"""
CropGuard AI — Hackathon 60-Image Dataset Preparer (Guaranteed 6 images per crop = 60 total)
========================================================================================
Selects exactly 6 real Kaggle dataset images per crop across 10 crops (60 images total).
Generates:
1. HACKATHON_60_IMAGES/ with 10 crop folders
2. HACKATHON_60_IMAGES/manifest.csv
3. demo_60_dataset/ for training and validation (excluding the 60 demo images)
"""

import os
import sys
import shutil
import csv
import random
from PIL import Image

SOURCE_DATASET_DIR = r"c:\Users\Kanchana\Desktop\crop disease\data\processed"
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HACKATHON_60_DIR = os.path.join(PROJECT_ROOT, "HACKATHON_60_IMAGES")
DEMO_60_DATASET_DIR = os.path.join(PROJECT_ROOT, "demo_60_dataset")

# Schema mapping each crop to its actual Kaggle folder names
CROPS_SCHEMA = {
    "Tomato": {
        "Healthy": ["tomato__healthy"],
        "Early_Blight": ["tomato__early_blight"],
        "Late_Blight": ["tomato__late_blight"],
        "Septoria_Leaf_Spot": ["tomato__septoria_leaf_spot"],
        "Leaf_Mold": ["tomato__leaf_mold"],
        "Bacterial_Spot": ["tomato__bacterial_spot"]
    },
    "Wheat": {
        "Healthy": ["wheat__healthy"],
        "Septoria": ["wheat__septoria"],
        "Stripe_Rust": ["wheat__stripe_rust"],
        "Leaf_Rust": ["wheat__leaf_rust"]
    },
    "Rice": {
        "Healthy": ["rice__healthy"],
        "Brown_Spot": ["rice__brown_spot"],
        "Leaf_Blast": ["rice__blast"],
        "Bacterial_Leaf_Blight": ["rice__bacterial_blight"]
    },
    "Maize": {
        "Healthy": ["maize__healthy"],
        "Common_Rust": ["maize__common_rust"],
        "Gray_Leaf_Spot": ["maize__gray_leaf_spot"],
        "Blight": ["maize__northern_leaf_blight"]
    },
    "Potato": {
        "Healthy": ["potato__healthy"],
        "Early_Blight": ["potato__early_blight"],
        "Late_Blight": ["potato__late_blight"]
    },
    "Chilli": {
        "Healthy": ["chilli__healthy"],
        "Bacterial_Spot": ["chilli__bacterial_spot"],
        "Leaf_Curl": ["chilli__leaf_curl"],
        "Leaf_Spot": ["chilli__leaf_spot"]
    },
    "Cotton": {
        "Healthy": ["cotton__healthy"],
        "Bacterial_Blight": ["cotton__bacterial_blight"],
        "Curl_Virus": ["cotton__curl_virus"],
        "Fusarium_Wilt": ["cotton__fusarium_wilt"]
    },
    "Mango": {
        "Healthy": ["mango__healthy"],
        "Anthracnose": ["mango__anthracnose"],
        "Bacterial_Canker": ["mango__bacterial_canker"]
    },
    "Banana": {
        "Healthy": ["banana__healthy"],
        "Sigatoka": ["banana__sigatoka"],
        "Panama_Disease": ["banana__panama_disease"]
    },
    "Citrus": {
        "Healthy": ["citrus__healthy"],
        "Black_Spot": ["citrus__black_spot"],
        "Citrus_Canker": ["citrus__citrus_canker"],
        "Greening": ["citrus__greening"]
    }
}

def collect_valid_images(folder_name):
    collected = []
    splits = ["train", "test", "val"]
    for split in splits:
        dir_path = os.path.join(SOURCE_DATASET_DIR, split, folder_name)
        if os.path.exists(dir_path):
            for fname in os.listdir(dir_path):
                if fname.lower().endswith(('.jpg', '.jpeg', '.png')):
                    full_path = os.path.join(dir_path, fname)
                    try:
                        with Image.open(full_path) as img:
                            img.verify()
                        collected.append(full_path)
                    except Exception:
                        continue
    return list(set(collected))

def main():
    print("=" * 60)
    print("CROPGUARD AI — 60-IMAGE HACKATHON DATASET PREPARER")
    print("=" * 60)

    # Clean destination folders
    if os.path.exists(HACKATHON_60_DIR):
        shutil.rmtree(HACKATHON_60_DIR)
    if os.path.exists(DEMO_60_DATASET_DIR):
        shutil.rmtree(DEMO_60_DATASET_DIR)

    os.makedirs(HACKATHON_60_DIR, exist_ok=True)
    os.makedirs(os.path.join(DEMO_60_DATASET_DIR, "train"), exist_ok=True)
    os.makedirs(os.path.join(DEMO_60_DATASET_DIR, "val"), exist_ok=True)

    manifest_rows = []
    random.seed(42)

    total_demo_images = 0

    for crop_name, disease_dict in CROPS_SCHEMA.items():
        print(f"\nProcessing Crop: {crop_name}...")
        crop_demo_dir = os.path.join(HACKATHON_60_DIR, crop_name)
        os.makedirs(crop_demo_dir, exist_ok=True)

        # Gather all disease images pool for this crop
        disease_pools = {}
        for d_name, folders in disease_dict.items():
            imgs = []
            for f in folders:
                imgs.extend(collect_valid_images(f))
            random.shuffle(imgs)
            disease_pools[d_name] = imgs

        # Select exactly 6 images per crop
        disease_classes = list(disease_dict.keys())
        crop_demo_samples = [] # [(d_name, img_path), ...]

        idx = 0
        while len(crop_demo_samples) < 6:
            d_name = disease_classes[idx % len(disease_classes)]
            if disease_pools[d_name]:
                picked = disease_pools[d_name].pop(0)
                crop_demo_samples.append((d_name, picked))
            idx += 1

        # Save selected demo images to HACKATHON_60_IMAGES/<Crop>/
        demo_paths_set = set(p for _, p in crop_demo_samples)
        for counter, (d_name, src_path) in enumerate(crop_demo_samples, 1):
            ext = os.path.splitext(src_path)[1].lower() or ".jpg"
            dest_fname = f"{counter:02d}_{d_name}{ext}"
            dest_path = os.path.join(crop_demo_dir, dest_fname)
            shutil.copy2(src_path, dest_path)

            manifest_rows.append({
                "filename": f"{crop_name}/{dest_fname}",
                "crop": crop_name,
                "disease": d_name.replace("_", " "),
                "source_dataset": f"{crop_name} Kaggle Dataset"
            })
            total_demo_images += 1

        # Populate demo_60_dataset/ train and val with remaining images
        for d_name, remaining_imgs in disease_pools.items():
            random.shuffle(remaining_imgs)
            train_count = min(40, len(remaining_imgs))
            val_count = min(10, max(0, len(remaining_imgs) - train_count))

            train_imgs = remaining_imgs[:train_count]
            val_imgs = remaining_imgs[train_count:train_count + val_count]

            train_dest = os.path.join(DEMO_60_DATASET_DIR, "train", crop_name, d_name)
            val_dest = os.path.join(DEMO_60_DATASET_DIR, "val", crop_name, d_name)
            os.makedirs(train_dest, exist_ok=True)
            os.makedirs(val_dest, exist_ok=True)

            for i, p in enumerate(train_imgs):
                shutil.copy2(p, os.path.join(train_dest, f"tr_{i:03d}_{os.path.basename(p)}"))
            for i, p in enumerate(val_imgs):
                shutil.copy2(p, os.path.join(val_dest, f"val_{i:03d}_{os.path.basename(p)}"))

    # Write manifest.csv
    manifest_csv_path = os.path.join(HACKATHON_60_DIR, "manifest.csv")
    with open(manifest_csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["filename", "crop", "disease", "source_dataset"])
        writer.writeheader()
        writer.writerows(manifest_rows)

    print("\n" + "=" * 60)
    print(f"PREPARATION COMPLETE!")
    print(f"Total Hackathon Demo Images: {total_demo_images}")
    print(f"Saved to: {HACKATHON_60_DIR}")
    print(f"Manifest file: {manifest_csv_path}")
    print("=" * 60)

if __name__ == "__main__":
    main()
