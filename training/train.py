"""
Kisan Mitra / CropGuard AI — 2-Stage PyTorch MobileNetV3 Model Trainer
======================================================================
Trains:
1. Stage 1 Crop Classifier -> models/crop_classifier/model.pt & models/crop_classes.json
2. Stage 2 Crop-Specific Disease Classifiers -> models/{crop}_disease/model.pt & models/{crop}_classes.json
"""

import os
import sys
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms, models
from PIL import Image

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEMO_DIR = os.path.join(PROJECT_ROOT, "demo_dataset")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
BATCH_SIZE = 16
EPOCHS = 12
LR = 0.001

# Data preprocessing & augmentations (Real Field & Fruit Robustness)
transform_train = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.75, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomVerticalFlip(),
    transforms.RandomRotation(25),
    transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2),
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

def train_and_save(model_name, train_samples, val_samples, class_list, output_dir):
    print(f"\n--- Training {model_name} ({len(class_list)} classes) ---", flush=True)
    os.makedirs(output_dir, exist_ok=True)
    
    idx_to_class = {i: cls for i, cls in enumerate(class_list)}
    class_to_idx = {cls: i for i, cls in enumerate(class_list)}
    
    mapping_data = {
        'class_to_idx': class_to_idx,
        'idx_to_class': idx_to_class,
        'classes': class_list
    }
    
    if model_name == 'crop_classifier':
        mapping_path = os.path.join(MODELS_DIR, 'crop_classes.json')
    else:
        crop_prefix = model_name.split('_')[0].lower()
        mapping_path = os.path.join(MODELS_DIR, f"{crop_prefix}_classes.json")
        
    with open(mapping_path, 'w', encoding='utf-8') as f:
        json.dump(mapping_data, f, indent=2)
    print(f"  [+] Saved class mapping to {mapping_path}", flush=True)
    
    train_ds = CustomImageDataset(train_samples, transform=transform_train)
    val_ds = CustomImageDataset(val_samples, transform=transform_val)
    
    train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
    val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False)
    
    model = build_mobilenet(len(class_list)).to(DEVICE)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)
    
    best_val_acc = 0.0
    best_weights = None
    
    for epoch in range(1, EPOCHS + 1):
        model.train()
        train_loss, train_correct = 0.0, 0
        for imgs, labels in train_loader:
            imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
            optimizer.zero_grad()
            outputs = model(imgs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            
            train_loss += loss.item() * imgs.size(0)
            train_correct += (outputs.argmax(1) == labels).sum().item()
            
        train_acc = train_correct / (len(train_ds) or 1)
        
        model.eval()
        val_loss, val_correct = 0.0, 0
        with torch.no_grad():
            for imgs, labels in val_loader:
                imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
                outputs = model(imgs)
                loss = criterion(outputs, labels)
                val_loss += loss.item() * imgs.size(0)
                val_correct += (outputs.argmax(1) == labels).sum().item()
                
        val_acc = val_correct / (len(val_ds) or 1)
        
        print(f"  Epoch {epoch:02d}/{EPOCHS:02d} | Train Acc: {train_acc*100:5.1f}% | Val Acc: {val_acc*100:5.1f}%", flush=True)
        
        if val_acc >= best_val_acc or best_weights is None:
            best_val_acc = val_acc
            best_weights = model.state_dict().copy()
            
    model_save_path = os.path.join(output_dir, 'model.pt')
    torch.save(best_weights, model_save_path)
    print(f"  [+] Saved best model to {model_save_path} (Val Acc: {best_val_acc*100:.1f}%)", flush=True)

def train_all():
    os.makedirs(MODELS_DIR, exist_ok=True)
    
    # 1. Collect Stage 1 Crop Samples
    print("Collecting Stage 1 Crop Samples...", flush=True)
    crop_names = sorted(os.listdir(os.path.join(DEMO_DIR, 'train')))
    crop_to_idx = {c: i for i, c in enumerate(crop_names)}
    
    crop_train_samples = []
    crop_val_samples = []
    
    for c in crop_names:
        c_train_dir = os.path.join(DEMO_DIR, 'train', c)
        c_val_dir = os.path.join(DEMO_DIR, 'validation', c)
        
        for d in os.listdir(c_train_dir):
            d_path = os.path.join(c_train_dir, d)
            if os.path.isdir(d_path):
                for f in os.listdir(d_path):
                    if f.lower().endswith(('.jpg', '.png', '.jpeg')):
                        crop_train_samples.append((os.path.join(d_path, f), crop_to_idx[c]))
                        
        for d in os.listdir(c_val_dir):
            d_path = os.path.join(c_val_dir, d)
            if os.path.isdir(d_path):
                for f in os.listdir(d_path):
                    if f.lower().endswith(('.jpg', '.png', '.jpeg')):
                        crop_val_samples.append((os.path.join(d_path, f), crop_to_idx[c]))
                        
    train_and_save(
        model_name='crop_classifier',
        train_samples=crop_train_samples,
        val_samples=crop_val_samples,
        class_list=crop_names,
        output_dir=os.path.join(MODELS_DIR, 'crop_classifier')
    )
    
    # 2. Collect Stage 2 Disease Samples Per Crop
    for c in crop_names:
        c_train_dir = os.path.join(DEMO_DIR, 'train', c)
        c_val_dir = os.path.join(DEMO_DIR, 'validation', c)
        
        diseases = sorted([d for d in os.listdir(c_train_dir) if os.path.isdir(os.path.join(c_train_dir, d))])
        d_to_idx = {d: i for i, d in enumerate(diseases)}
        
        dis_train_samples = []
        dis_val_samples = []
        
        for d in diseases:
            d_tr_path = os.path.join(c_train_dir, d)
            d_val_path = os.path.join(c_val_dir, d)
            
            if os.path.exists(d_tr_path):
                for f in os.listdir(d_tr_path):
                    if f.lower().endswith(('.jpg', '.png', '.jpeg')):
                        dis_train_samples.append((os.path.join(d_tr_path, f), d_to_idx[d]))
                        
            if os.path.exists(d_val_path):
                for f in os.listdir(d_val_path):
                    if f.lower().endswith(('.jpg', '.png', '.jpeg')):
                        dis_val_samples.append((os.path.join(d_val_path, f), d_to_idx[d]))
                        
        train_and_save(
            model_name=f"{c.lower()}_disease",
            train_samples=dis_train_samples,
            val_samples=dis_val_samples,
            class_list=diseases,
            output_dir=os.path.join(MODELS_DIR, f"{c.lower()}_disease")
        )

if __name__ == '__main__':
    train_all()
