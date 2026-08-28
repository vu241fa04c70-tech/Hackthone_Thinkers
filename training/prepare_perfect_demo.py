import os
import shutil
import csv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV_PATH = os.path.join(BASE_DIR, 'DEMO_RESULTS.csv')
TEST_SRC_DIR = os.path.join(BASE_DIR, 'HACKATHON_TEST_IMAGES')
DEST_DIR = os.path.join(BASE_DIR, 'HACKATHON_PERFECT_DEMO_IMAGES')

os.makedirs(DEST_DIR, exist_ok=True)

perfect_images = []

with open(CSV_PATH, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        if row['crop_correct'].strip().lower() == 'true' and row['disease_correct'].strip().lower() == 'true':
            perfect_images.append(row)

print(f"Found {len(perfect_images)} perfect prediction images.")

manifest_path = os.path.join(DEST_DIR, 'PERFECT_DEMO_MANIFEST.csv')
cheat_sheet_path = os.path.join(DEST_DIR, 'HACKATHON_CHEAT_SHEET.md')

with open(manifest_path, 'w', newline='', encoding='utf-8') as f_csv:
    fieldnames = ['folder_path', 'filename', 'crop', 'disease', 'crop_confidence', 'disease_confidence']
    writer = csv.DictWriter(f_csv, fieldnames=fieldnames)
    writer.writeheader()

    for item in perfect_images:
        crop = item['actual_crop']
        filename = item['filename']
        crop_folder = os.path.join(DEST_DIR, crop)
        os.makedirs(crop_folder, exist_ok=True)

        src_file = os.path.join(TEST_SRC_DIR, crop, filename)
        dst_file = os.path.join(crop_folder, filename)

        if os.path.exists(src_file):
            shutil.copy2(src_file, dst_file)
            writer.writerow({
                'folder_path': os.path.relpath(dst_file, BASE_DIR),
                'filename': filename,
                'crop': crop,
                'disease': item['actual_disease'],
                'crop_confidence': item['crop_confidence'],
                'disease_confidence': item['disease_confidence']
            })

print(f"Copied perfect demo images to {DEST_DIR}")
