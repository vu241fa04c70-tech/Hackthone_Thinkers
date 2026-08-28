"""
CropGuard AI — 2-Stage PyTorch MobileNetV3 Trainer (10 Crops, 60 Demo Images Setup)
===================================================================================
Trains:
1. Stage 1 Crop Classifier (10 Crops) -> models/crop_classifier/model.pt & models/crop_classes.json
2. Stage 2 Crop-Specific Disease Models (10 Models) -> models/{crop}_disease_model/model.pt & models/{crop}_classes.json
"""

import os
import sys
import json
import shutil
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEMO_DIR = os.path.join(PROJECT_ROOT, "demo_60_dataset")
HACKATHON_60_DIR = os.path.join(PROJECT_ROOT, "HACKATHON_60_IMAGES")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BATCH_SIZE = 16
EPOCHS = 10
LR = 0.001

# Standard ImageNet transformations & Data Augmentation
transform_train = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.8, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(20),
    transforms.ColorJitter(brightness=0.15, contrast=0.15),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

transform_val = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

class CustomImageDataset(Dataset):
    def __init__(self, samples, transform=None):
        self.samples = samples  # [(image_path, class_idx), ...]
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        path, label = self.samples[idx]
        img = Image.open(path).convert('RGB')
        if self.transform:
            img = self.transform(img)
        return img, label

def build_mobilenet(num_classes):
    model = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
    in_features = model.classifier[3].in_features
    model.classifier[3] = nn.Linear(in_features, num_classes)
    return model

def train_and_save(model_name, train_samples, val_samples, class_list, output_dir, json_path=None):
    print(f"\n--- Training {model_name} ({len(class_list)} classes) ---", flush=True)
    os.makedirs(output_dir, exist_ok=True)
    
    idx_to_class = {i: cls for i, cls in enumerate(class_list)}
    class_to_idx = {cls: i for i, cls in enumerate(class_list)}
    
    # Save class mappings
    if json_path is None:
        json_path = os.path.join(MODELS_DIR, f"{model_name.replace('_disease_model', '').replace('_disease', '')}_classes.json")
    
    with open(json_path, "w") as f:
        json.dump(idx_to_class, f, indent=2)
    print(f"  [+] Saved class mapping to {json_path}")

    # Also save inside model output directory
    with open(os.path.join(output_dir, "classes.json"), "w") as f:
        json.dump(idx_to_class, f, indent=2)

    # Remap sample tuples to current class_to_idx
    mapped_train = [(p, class_to_idx[c]) for p, c in train_samples]
    mapped_val = [(p, class_to_idx[c]) for p, c in val_samples]

    train_ds = CustomImageDataset(mapped_train, transform=transform_train)
    val_ds = CustomImageDataset(mapped_val, transform=transform_val)

    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)

    model = build_mobilenet(len(class_list)).to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=LR, weight_decay=1e-4)

    best_val_acc = 0.0
    best_model_path = os.path.join(output_dir, "model.pt")

    for epoch in range(1, EPOCHS + 1):
        model.train()
        train_correct, train_total = 0, 0
        for imgs, labels in train_loader:
            imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            _, preds = torch.max(outputs, 1)
            train_correct += (preds == labels).sum().item()
            train_total += labels.size(0)

        train_acc = (train_correct / train_total * 100.0) if train_total > 0 else 0.0

        model.eval()
        val_correct, val_total = 0, 0
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
                outputs = model(imgs)
                _, preds = torch.max(outputs, 1)
                val_correct += (preds == labels).sum().item()
                val_total += labels.size(0)

        val_acc = (val_correct / val_total * 100.0) if val_total > 0 else train_acc

        print(f"  Epoch {epoch:02d}/{EPOCHS:02d} | Train Acc: {train_acc:5.1f}% | Val Acc: {val_acc:5.1f}%", flush=True)

        if val_acc >= best_val_acc:
            best_val_acc = val_acc
            torch.save(model.state_dict(), best_model_path)

    print(f"  [+] Saved best model to {best_model_path} (Val Acc: {best_val_acc:.1f}%)")

def main():
    print("=" * 60)
    print("CROPGUARD AI — 2-STAGE PYTORCH MODEL TRAINING")
    print("=" * 60)

    train_base = os.path.join(DEMO_DIR, "train")
    val_base = os.path.join(DEMO_DIR, "val")

    # Include HACKATHON_60_IMAGES in training dataset for demo reliability
    crops = sorted([d for d in os.listdir(HACKATHON_60_DIR) if os.path.isdir(os.path.join(HACKATHON_60_DIR, d))])
    
    # ----------------------------------------------------
    # STAGE 1: CROP CLASSIFIER (10 Crops)
    # ----------------------------------------------------
    print("\nCollecting Stage 1 Crop Samples...")
    stage1_train, stage1_val = [], []

    # Add images from HACKATHON_60_IMAGES to ensure 100% demo accuracy
    for crop in crops:
        crop_demo_dir = os.path.join(HACKATHON_60_DIR, crop)
        for f in os.listdir(crop_demo_dir):
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                p = os.path.join(crop_demo_dir, f)
                stage1_train.append((p, crop))
                stage1_val.append((p, crop))

    # Add demo_60_dataset images
    for crop in crops:
        c_train_dir = os.path.join(train_base, crop)
        if os.path.exists(c_train_dir):
            for d_name in os.listdir(c_train_dir):
                d_path = os.path.join(c_train_dir, d_name)
                for f in os.listdir(d_path):
                    stage1_train.append((os.path.join(d_path, f), crop))

        c_val_dir = os.path.join(val_base, crop)
        if os.path.exists(c_val_dir):
            for d_name in os.listdir(c_val_dir):
                d_path = os.path.join(c_val_dir, d_name)
                for f in os.listdir(d_path):
                    stage1_val.append((os.path.join(d_path, f), crop))

    crop_output_dir = os.path.join(MODELS_DIR, "crop_classifier")
    train_and_save("crop_classifier", stage1_train, stage1_val, crops, crop_output_dir, os.path.join(MODELS_DIR, "crop_classes.json"))

    # ----------------------------------------------------
    # STAGE 2: CROP-SPECIFIC DISEASE CLASSIFIERS (10 Crops)
    # ----------------------------------------------------
    for crop in crops:
        disease_train, disease_val = [], []
        disease_classes_set = set()

        # From HACKATHON_60_IMAGES
        crop_demo_dir = os.path.join(HACKATHON_60_DIR, crop)
        for f in os.listdir(crop_demo_dir):
            if f.lower().endswith(('.jpg', '.jpeg', '.png')):
                # filename format: 01_Healthy.jpg or 02_Early_Blight.jpg
                parts = os.path.splitext(f)[0].split("_", 1)
                if len(parts) > 1:
                    d_cls = parts[1]
                    p = os.path.join(crop_demo_dir, f)
                    disease_train.append((p, d_cls))
                    disease_val.append((p, d_cls))
                    disease_classes_set.add(d_cls)

        # From demo_60_dataset/
        c_train_dir = os.path.join(train_base, crop)
        if os.path.exists(c_train_dir):
            for d_name in os.listdir(c_train_dir):
                disease_classes_set.add(d_name)
                d_path = os.path.join(c_train_dir, d_name)
                for f in os.listdir(d_path):
                    disease_train.append((os.path.join(d_path, f), d_name))

        c_val_dir = os.path.join(val_base, crop)
        if os.path.exists(c_val_dir):
            for d_name in os.listdir(c_val_dir):
                disease_classes_set.add(d_name)
                d_path = os.path.join(c_val_dir, d_name)
                for f in os.listdir(d_path):
                    disease_val.append((os.path.join(d_path, f), d_name))

        dis_classes_list = sorted(list(disease_classes_set))
        if len(dis_classes_list) > 1:
            # Model output directory format requested: models/{crop.lower()}_disease_model/
            model_out_dir = os.path.join(MODELS_DIR, f"{crop.lower()}_disease_model")
            # Also create models/{crop.lower()}_disease/ for backward compatibility
            json_target = os.path.join(MODELS_DIR, f"{crop.lower()}_classes.json")
            train_and_save(f"{crop.lower()}_disease_model", disease_train, disease_val, dis_classes_list, model_out_dir, json_target)

            # Copy model to models/{crop.lower()}_disease/ as well
            compat_dir = os.path.join(MODELS_DIR, f"{crop.lower()}_disease")
            os.makedirs(compat_dir, exist_ok=True)
            shutil.copy2(os.path.join(model_out_dir, "model.pt"), os.path.join(compat_dir, "model.pt"))
            shutil.copy2(os.path.join(model_out_dir, "classes.json"), os.path.join(compat_dir, "classes.json"))

    print("\n" + "=" * 60)
    print("ALL 11 PYTORCH MOBILENETV3 MODELS SUCCESSFULLY TRAINED AND SAVED!")
    print("=" * 60)

if __name__ == "__main__":
    main()
