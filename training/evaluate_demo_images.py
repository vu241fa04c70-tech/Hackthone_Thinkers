"""
Kisan Mitra / CropGuard AI — Hackathon Batch Evaluation Script
==============================================================
1. Evaluates every image in `HACKATHON_TEST_IMAGES/`.
2. Runs 2-Stage PyTorch inference (Crop Classifier -> Crop-Specific Disease Classifier).
3. Compares predictions with ground truth in `HACKATHON_TEST_IMAGES/EXPECTED_RESULTS.csv`.
4. Outputs `DEMO_RESULTS.csv` with per-image results and calculates exact Crop & Disease Accuracies.
"""

import os
import sys
import json
import csv
import torch
import torch.nn as nn
from torchvision import transforms, models
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HACKATHON_TEST_DIR = os.path.join(PROJECT_ROOT, "HACKATHON_TEST_IMAGES")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
OUTPUT_CSV = os.path.join(PROJECT_ROOT, "DEMO_RESULTS.csv")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

transform_inference = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def load_mobilenet_model(model_path):
    state_dict = torch.load(model_path, map_location=DEVICE)
    num_classes = state_dict['classifier.3.weight'].shape[0]
    model = models.mobilenet_v3_small(weights=None)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    model.load_state_dict(state_dict)
    model.to(DEVICE)
    model.eval()
    return model

def load_class_mapping(mapping_path):
    with open(mapping_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    # Convert integer keys back from string if needed
    idx_to_class = {int(k): v for k, v in data['idx_to_class'].items()}
    return idx_to_class, data['class_to_idx']

def predict_single_image(image_path, crop_model, crop_idx_to_class, disease_models):
    """
    Performs 2-Stage PyTorch inference on an image file.
    """
    img = Image.open(image_path).convert('RGB')
    input_tensor = transform_inference(img).unsqueeze(0).to(DEVICE)

    # Stage 1: Crop Classifier
    with torch.no_grad():
        crop_logits = crop_model(input_tensor)
        crop_probs = torch.softmax(crop_logits, dim=1)[0]
        crop_pred_idx = int(torch.argmax(crop_probs).item())
        crop_conf = float(crop_probs[crop_pred_idx].item())
        pred_crop = crop_idx_to_class[crop_pred_idx]

    # Stage 2: Crop-Specific Disease Classifier
    pred_crop_key = pred_crop.lower()
    if pred_crop_key in disease_models:
        dis_model, dis_idx_to_class = disease_models[pred_crop_key]
        with torch.no_grad():
            dis_logits = dis_model(input_tensor)
            dis_probs = torch.softmax(dis_logits, dim=1)[0]
            dis_pred_idx = int(torch.argmax(dis_probs).item())
            dis_conf = float(dis_probs[dis_pred_idx].item())
            raw_disease = dis_idx_to_class[dis_pred_idx]
            pred_disease = raw_disease.replace("_", " ")
    else:
        pred_disease = "Healthy"
        dis_conf = 0.50

    return pred_crop, pred_disease, crop_conf, dis_conf

def evaluate_demo():
    print("=" * 65)
    print("CROPGUARD AI - HACKATHON BATCH EVALUATION SUITE")
    print("=" * 65)

    # Load Stage 1 Crop Model
    crop_model_path = os.path.join(MODELS_DIR, "crop_classifier", "model.pt")
    crop_mapping_path = os.path.join(MODELS_DIR, "crop_classes.json")

    if not os.path.exists(crop_model_path) or not os.path.exists(crop_mapping_path):
        print("Error: Crop classifier models not found! Run training/train.py first.")
        return

    crop_idx_to_class, _ = load_class_mapping(crop_mapping_path)
    crop_model = load_mobilenet_model(crop_model_path)
    print(f"[+] Loaded Stage 1 Crop Classifier ({len(crop_idx_to_class)} classes)")

    # Load Stage 2 Disease Models for each crop
    disease_models = {}
    for crop_name in crop_idx_to_class.values():
        c_key = crop_name.lower()
        possible_dirs = [f"{c_key}_disease", f"{c_key}_disease_classifier"]
        d_model_path = None
        for p_dir in possible_dirs:
            candidate = os.path.join(MODELS_DIR, p_dir, "model.pt")
            if os.path.exists(candidate):
                d_model_path = candidate
                break
        
        d_map_path = os.path.join(MODELS_DIR, f"{c_key}_classes.json")

        if d_model_path and os.path.exists(d_map_path):
            dis_idx_to_class, _ = load_class_mapping(d_map_path)
            d_model = load_mobilenet_model(d_model_path)
            disease_models[c_key] = (d_model, dis_idx_to_class)
            print(f"[+] Loaded Stage 2 {crop_name} Classifier ({len(dis_idx_to_class)} classes)")

    # Read Expected Results Manifest
    manifest_path = os.path.join(HACKATHON_TEST_DIR, "EXPECTED_RESULTS.csv")
    if not os.path.exists(manifest_path):
        print(f"Error: Manifest not found at {manifest_path}")
        return

    test_records = []
    with open(manifest_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            test_records.append(row)

    results = []
    total_images = len(test_records)
    crop_correct_cnt = 0
    disease_correct_cnt = 0

    print(f"\nProcessing {total_images} Unseen Hackathon Test Images...")
    print("-" * 65)

    for rec in test_records:
        rel_path = rec["relative_path"]
        actual_crop = rec["crop"]
        actual_disease = rec["disease"]
        img_path = os.path.join(HACKATHON_TEST_DIR, rel_path)

        if not os.path.exists(img_path):
            continue

        pred_crop, pred_disease, crop_conf, dis_conf = predict_single_image(
            img_path, crop_model, crop_idx_to_class, disease_models
        )

        crop_correct = (pred_crop.lower() == actual_crop.lower())
        disease_correct = (crop_correct and (pred_disease.lower().replace("_", " ") == actual_disease.lower().replace("_", " ")))

        if crop_correct:
            crop_correct_cnt += 1
        if disease_correct:
            disease_correct_cnt += 1

        res_entry = {
            "filename": rec["filename"],
            "actual_crop": actual_crop,
            "actual_disease": actual_disease,
            "predicted_crop": pred_crop,
            "predicted_disease": pred_disease,
            "crop_confidence": f"{crop_conf * 100:.1f}%",
            "disease_confidence": f"{dis_conf * 100:.1f}%",
            "crop_correct": crop_correct,
            "disease_correct": disease_correct
        }
        results.append(res_entry)

        status_symbol = "[OK]" if disease_correct else ("[CROP_OK]" if crop_correct else "[FAIL]")
        print(f"  {status_symbol:<9} {rec['filename']:<32} | Actual: {actual_crop:<7} - {actual_disease:<16} | Pred: {pred_crop:<7} - {pred_disease:<16} | Conf: {dis_conf*100:4.1f}%")

    # Write DEMO_RESULTS.csv
    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "filename", "actual_crop", "actual_disease", "predicted_crop",
            "predicted_disease", "crop_confidence", "disease_confidence",
            "crop_correct", "disease_correct"
        ])
        writer.writeheader()
        writer.writerows(results)

    crop_acc = (crop_correct_cnt / float(total_images or 1)) * 100.0
    disease_acc = (disease_correct_cnt / float(total_images or 1)) * 100.0

    print("\n" + "=" * 65)
    print("FINAL ACCURACY EVALUATION RESULTS")
    print("=" * 65)
    print(f"   Total Unseen Test Images  : {total_images}")
    print(f"   Correct Crop Predictions  : {crop_correct_cnt} / {total_images} ({crop_acc:.1f}%)")
    print(f"   Correct Disease Diagnosis : {disease_correct_cnt} / {total_images} ({disease_acc:.1f}%)")
    print(f"   Detailed Results Saved To : {OUTPUT_CSV}")
    print("=" * 65)

if __name__ == "__main__":
    evaluate_demo()
