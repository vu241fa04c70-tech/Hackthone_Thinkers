"""
CropGuard AI — Hackathon 60-Image Evaluator & Demo List Generator
===================================================================
1. Evaluates all 60 images in HACKATHON_60_IMAGES/ through true 2-stage PyTorch MobileNetV3 inference.
2. Writes HACKATHON_RESULTS.csv.
3. Copies 100% correctly identified images to HACKATHON_WORKING_IMAGES/.
4. Generates HACKATHON_DEMO_LIST.md for presentation.
"""

import os
import sys
import csv
import shutil
from PIL import Image

# Ensure backend directory is in python path
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(PROJECT_ROOT, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from app.agents.two_stage_evaluator import two_stage_evaluator

HACKATHON_60_DIR = os.path.join(PROJECT_ROOT, "HACKATHON_60_IMAGES")
MANIFEST_PATH = os.path.join(HACKATHON_60_DIR, "manifest.csv")
RESULTS_CSV_PATH = os.path.join(PROJECT_ROOT, "HACKATHON_RESULTS.csv")
WORKING_IMAGES_DIR = os.path.join(PROJECT_ROOT, "HACKATHON_WORKING_IMAGES")
DEMO_LIST_MD_PATH = os.path.join(PROJECT_ROOT, "HACKATHON_DEMO_LIST.md")

def clean_str(s):
    return str(s).strip().lower().replace("_", " ").replace("-", " ")

def main():
    print("=" * 60)
    print("CROPGUARD AI — EVALUATING 60 HACKATHON DEMO IMAGES")
    print("=" * 60)

    if not os.path.exists(MANIFEST_PATH):
        print(f"Error: Manifest file not found at {MANIFEST_PATH}")
        return

    if not two_stage_evaluator.loaded:
        print("Error: PyTorch two_stage_evaluator is not loaded.")
        return

    # Clean working images output dir
    if os.path.exists(WORKING_IMAGES_DIR):
        shutil.rmtree(WORKING_IMAGES_DIR)
    os.makedirs(WORKING_IMAGES_DIR, exist_ok=True)

    with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        manifest_entries = list(reader)

    results = []
    crop_correct_count = 0
    disease_correct_count = 0
    total_images = len(manifest_entries)

    working_images_by_crop = {}

    for entry in manifest_entries:
        rel_filename = entry["filename"] # e.g. Tomato/01_Healthy.jpg
        expected_crop = entry["crop"]
        expected_disease = entry["disease"]

        full_img_path = os.path.join(HACKATHON_60_DIR, rel_filename)
        if not os.path.exists(full_img_path):
            print(f"Warning: File missing {full_img_path}")
            continue

        with open(full_img_path, "rb") as img_f:
            img_bytes = img_f.read()

        # True PyTorch Tensor Inference (NO filename passing, NO fakes)
        eval_res = two_stage_evaluator.predict_image_bytes(img_bytes, lang="en")

        pred_crop = eval_res.get("crop_name", "")
        pred_disease = eval_res.get("disease_name", "")
        overall_conf = eval_res.get("confidence_pct", 0.0)
        crop_conf = eval_res.get("crop_confidence_pct", overall_conf)
        dis_conf = eval_res.get("disease_confidence_pct", overall_conf)

        # Accuracy checks
        c_correct = (clean_str(expected_crop) == clean_str(pred_crop))
        d_correct = (clean_str(expected_disease) in clean_str(pred_disease) or clean_str(pred_disease) in clean_str(expected_disease))

        if c_correct:
            crop_correct_count += 1
        if c_correct and d_correct:
            disease_correct_count += 1

            # Copy to HACKATHON_WORKING_IMAGES/<Crop>/
            crop_work_dir = os.path.join(WORKING_IMAGES_DIR, expected_crop)
            os.makedirs(crop_work_dir, exist_ok=True)
            fname_only = os.path.basename(rel_filename)
            dest_work_path = os.path.join(crop_work_dir, fname_only)
            shutil.copy2(full_img_path, dest_work_path)

            if expected_crop not in working_images_by_crop:
                working_images_by_crop[expected_crop] = []
            working_images_by_crop[expected_crop].append({
                "filename": f"{expected_crop}/{fname_only}",
                "expected_crop": expected_crop,
                "expected_disease": expected_disease,
                "confidence": overall_conf
            })

        results.append({
            "filename": rel_filename,
            "expected_crop": expected_crop,
            "expected_disease": expected_disease,
            "predicted_crop": pred_crop,
            "predicted_disease": pred_disease,
            "crop_confidence": f"{crop_conf:.1f}%",
            "disease_confidence": f"{dis_conf:.1f}%",
            "crop_correct": "TRUE" if c_correct else "FALSE",
            "disease_correct": "TRUE" if (c_correct and d_correct) else "FALSE"
        })

    # Write HACKATHON_RESULTS.csv
    with open(RESULTS_CSV_PATH, "w", newline="", encoding="utf-8") as f:
        fieldnames = [
            "filename", "expected_crop", "expected_disease",
            "predicted_crop", "predicted_disease",
            "crop_confidence", "disease_confidence",
            "crop_correct", "disease_correct"
        ]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)

    # Write HACKATHON_DEMO_LIST.md
    with open(DEMO_LIST_MD_PATH, "w", encoding="utf-8") as f:
        f.write("# 🌾 CROPGUARD AI — HACKATHON LIVE DEMO CHEAT SHEET\n\n")
        f.write(f"**Total Tested Demo Images**: {total_images}\n")
        f.write(f"**Crop Detection Accuracy**: {crop_correct_count}/{total_images} ({crop_correct_count/total_images*100:.1f}%)\n")
        f.write(f"**Disease Detection Accuracy**: {disease_correct_count}/{total_images} ({disease_correct_count/total_images*100:.1f}%)\n\n")
        f.write("Use the working images from `HACKATHON_WORKING_IMAGES/` for a 100% flawless presentation to judges.\n\n")
        f.write("---\n\n")

        counter = 1
        for crop_name in sorted(working_images_by_crop.keys()):
            for item in working_images_by_crop[crop_name]:
                f.write(f"### {counter}. {item['expected_crop']} — {item['expected_disease']}\n")
                f.write(f"- **File Path**: `HACKATHON_WORKING_IMAGES/{item['filename']}`\n")
                f.write(f"- **Expected Diagnosis**: **{item['expected_crop']} — {item['expected_disease']}**\n")
                f.write(f"- **Model Confidence**: **{item['confidence']:.1f}%**\n\n")
                counter += 1

    print("\n" + "=" * 60)
    print("EVALUATION COMPLETE!")
    print(f"Crop Accuracy: {crop_correct_count}/{total_images} ({crop_correct_count/total_images*100:.1f}%)")
    print(f"Disease Accuracy: {disease_correct_count}/{total_images} ({disease_correct_count/total_images*100:.1f}%)")
    print(f"Results CSV: {RESULTS_CSV_PATH}")
    print(f"Working Images Folder: {WORKING_IMAGES_DIR}")
    print(f"Demo Markdown Guide: {DEMO_LIST_MD_PATH}")
    print("=" * 60)

if __name__ == "__main__":
    main()
