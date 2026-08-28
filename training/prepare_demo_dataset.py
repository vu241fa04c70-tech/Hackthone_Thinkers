"""
Kisan Mitra / CropGuard AI — Hackathon Small Real Dataset Preparer
===================================================================
1. Selects 20-30 real images per class for TRAIN.
2. Selects 5 real images per class for VALIDATION.
3. Selects 5 real images per class for TEST (genders zero data leakage).
4. Copies TEST set images to `HACKATHON_TEST_IMAGES/` with friendly names.
5. Generates `HACKATHON_TEST_IMAGES/EXPECTED_RESULTS.csv`.
"""

import os
import sys
import shutil
import csv
import random
from PIL import Image

# Source Kaggle Processed Dataset Directory on System
SOURCE_DATASET_DIR = r"c:\Users\Kanchana\Desktop\crop disease\data\processed"

# Target Output Directories
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEMO_DATASET_DIR = os.path.join(PROJECT_ROOT, "demo_dataset")
HACKATHON_TEST_DIR = os.path.join(PROJECT_ROOT, "HACKATHON_TEST_IMAGES")

# Target Crops and their exact Folder Class Mappings in SOURCE_DATASET_DIR
CROPS_SCHEMA = {
    "Tomato": {
        "Healthy": ["tomato__healthy"],
        "Early_Blight": ["tomato__early_blight"],
        "Late_Blight": ["tomato__late_blight"],
        "Septoria_Leaf_Spot": ["tomato__septoria_leaf_spot"]
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
    "Banana": {
        "Healthy": ["banana__healthy"],
        "Sigatoka": ["banana__sigatoka"],
        "Panama_Disease": ["banana__panama_disease"]
    }
}

def collect_source_images(folder_names):
    """
    Collects real image filepaths across train, test, val splits in SOURCE_DATASET_DIR.
    """
    collected = []
    splits = ["train", "test", "val"]
    for split in splits:
        for folder_name in folder_names:
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
    # Remove duplicate filepaths
    return list(set(collected))

def prepare_demo_dataset():
    print("=" * 60)
    print("CROPGUARD AI - DATASET PREPARATION")
    print("=" * 60)

    # Clean existing destination folders
    if os.path.exists(DEMO_DATASET_DIR):
        shutil.rmtree(DEMO_DATASET_DIR)
    if os.path.exists(HACKATHON_TEST_DIR):
        shutil.rmtree(HACKATHON_TEST_DIR)

    for split in ["train", "validation", "test"]:
        os.makedirs(os.path.join(DEMO_DATASET_DIR, split), exist_ok=True)
    os.makedirs(HACKATHON_TEST_DIR, exist_ok=True)

    expected_results = []
    dataset_report = {}

    random.seed(42) # Deterministic reproducability

    for crop_name, diseases in CROPS_SCHEMA.items():
        print(f"\nProcessing Crop: {crop_name}...")
        dataset_report[crop_name] = {}
        crop_test_dir = os.path.join(HACKATHON_TEST_DIR, crop_name)
        os.makedirs(crop_test_dir, exist_ok=True)

        for disease_name, folder_names in diseases.items():
            all_images = collect_source_images(folder_names)
            random.shuffle(all_images)

            total_available = len(all_images)
            if total_available < 50:
                n_train = max(5, int(total_available * 0.7))
                n_val = max(2, int(total_available * 0.15))
                n_test = max(2, total_available - n_train - n_val)
            else:
                n_train = min(100, total_available - 20)
                n_val = 10
                n_test = 10

            train_imgs = all_images[:n_train]
            val_imgs = all_images[n_train:n_train + n_val]
            test_imgs = all_images[n_train + n_val:n_train + n_val + n_test]

            dataset_report[crop_name][disease_name] = {
                "train": len(train_imgs),
                "val": len(val_imgs),
                "test": len(test_imgs)
            }

            # Copy to demo_dataset/ train, validation, test
            for split_name, img_list in [("train", train_imgs), ("validation", val_imgs), ("test", test_imgs)]:
                dest_dir = os.path.join(DEMO_DATASET_DIR, split_name, crop_name, disease_name)
                os.makedirs(dest_dir, exist_ok=True)
                for idx, src_path in enumerate(img_list):
                    ext = os.path.splitext(src_path)[1].lower()
                    dest_file = os.path.join(dest_dir, f"{crop_name.lower()}_{disease_name.lower()}_{idx+1:02d}{ext}")
                    shutil.copy2(src_path, dest_file)

            # Copy test images to HACKATHON_TEST_IMAGES/ with user-friendly names
            for idx, src_path in enumerate(test_imgs):
                ext = os.path.splitext(src_path)[1].lower()
                clean_disease = disease_name.lower()
                friendly_filename = f"{crop_name.lower()}_{clean_disease}_{idx+1:02d}{ext}"
                dest_test_path = os.path.join(crop_test_dir, friendly_filename)
                shutil.copy2(src_path, dest_test_path)

                # Format disease display name
                disease_display = disease_name.replace("_", " ")
                expected_results.append({
                    "filename": friendly_filename,
                    "crop": crop_name,
                    "disease": disease_display,
                    "relative_path": os.path.join(crop_name, friendly_filename)
                })

            print(f"   [+] {disease_name:<22} -> Train: {len(train_imgs):>2}, Val: {len(val_imgs):>2}, Test: {len(test_imgs):>2}")

    # Write HACKATHON_TEST_IMAGES/EXPECTED_RESULTS.csv
    csv_path = os.path.join(HACKATHON_TEST_DIR, "EXPECTED_RESULTS.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["filename", "crop", "disease", "relative_path"])
        writer.writeheader()
        writer.writerows(expected_results)

    print("\n" + "=" * 60)
    print(f"DATASET PREPARATION COMPLETE!")
    print(f"   - Prepared Dataset: {DEMO_DATASET_DIR}")
    print(f"   - Hackathon Test Images: {HACKATHON_TEST_DIR}")
    print(f"   - Expected Results CSV: {csv_path}")
    print(f"   - Total Hackathon Test Files: {len(expected_results)}")
    print("=" * 60)

if __name__ == "__main__":
    prepare_demo_dataset()
