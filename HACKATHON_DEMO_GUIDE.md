# CropGuard AI — Hackathon Presentation & Live Demonstration Guide

Welcome to the **CropGuard AI Hackathon Demo Guide!** This document provides step-by-step instructions for demonstrating your real-time 2-stage crop disease detection platform to hackathon judges using **real, trained PyTorch models** and **unseen test images**.

---

## 🚀 1. How to Start the Application

### **Step 1: Start Backend FastAPI Server (Port 8000)**
Open **Terminal 1** in the project directory:
```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
> *Starts the 2-Stage PyTorch MobileNetV3 Crop & Disease Inference Engine on `http://127.0.0.1:8000`.*

### **Step 2: Start Frontend React App (Port 5173)**
Open **Terminal 2** in the `frontend/` directory:
```bash
cd frontend
npm run dev
```
> *Starts the web application on `http://localhost:5173`.*

---

## 📁 2. Location of Unseen Hackathon Test Images

All test images are located in `HACKATHON_TEST_IMAGES/` organized by crop:

```text
HACKATHON_TEST_IMAGES/
├── Tomato/                   <-- Tomato test images
├── Wheat/                    <-- Wheat test images
├── Rice/                     <-- Rice test images
├── Maize/                    <-- Maize test images
├── Potato/                   <-- Potato test images
├── Banana/                   <-- Banana test images
└── EXPECTED_RESULTS.csv      <-- Ground-truth manifest
```

---

## 🎬 3. Recommended Live Presentation Sequence

Follow these steps during your live presentation to demonstrate accuracy and UI responsiveness:

### **DEMO 1: Tomato Early Blight**
1. **File to Upload**: `HACKATHON_TEST_IMAGES/Tomato/tomato_early_blight_01.jpg`
2. **Expected Prediction**:
   - **Crop**: `Tomato`
   - **Disease**: `Early Blight`
   - **Confidence**: `80% – 100%`
3. **Point out to Judges**: Show how Stage 1 identifies the crop as Tomato and Stage 2 diagnoses Early Blight with organic & chemical spray remedies.

---

### **DEMO 2: UI Reset & Wheat Septoria Detection**
1. **Action**: Click the **"Choose a different image"** / **"Take Photo"** button.
2. **Point out to Judges**: Highlight how all previous predictions, confidence bars, and remedies clear completely!
3. **File to Upload**: `HACKATHON_TEST_IMAGES/Wheat/wheat_septoria_01.jpg`
4. **Expected Prediction**:
   - **Crop**: `Wheat`
   - **Disease**: `Septoria`
5. **Point out to Judges**: Show that Wheat Septoria is dynamically distinguished from Tomato Septoria without cross-crop disease leakage.

---

### **DEMO 3: Rice Brown Spot**
1. **File to Upload**: `HACKATHON_TEST_IMAGES/Rice/rice_brown_spot_01.jpg`
2. **Expected Prediction**:
   - **Crop**: `Rice`
   - **Disease**: `Brown Spot`
3. **Point out to Judges**: Show the localized bio-treatment and Mandal Agriculture Officer contact threshold for paddy farmers.

---

### **DEMO 4: Potato Late Blight**
1. **File to Upload**: `HACKATHON_TEST_IMAGES/Potato/potato_late_blight_01.jpg`
2. **Expected Prediction**:
   - **Crop**: `Potato`
   - **Disease**: `Late Blight`

---

### **DEMO 5: Maize Common Rust**
1. **File to Upload**: `HACKATHON_TEST_IMAGES/Maize/maize_common_rust_01.jpg`
2. **Expected Prediction**:
   - **Crop**: `Maize`
   - **Disease**: `Common Rust`

---

### **DEMO 6: Banana Sigatoka**
1. **File to Upload**: `HACKATHON_TEST_IMAGES/Banana/banana_sigatoka_01.jpg`
2. **Expected Prediction**:
   - **Crop**: `Banana`
   - **Disease**: `Sigatoka`

---

## 📊 4. Batch Evaluation & Accuracy Verification

To re-run the automated accuracy evaluation on all 80 unseen test images:
```bash
python training/evaluate_demo_images.py
```
> *Generates `DEMO_RESULTS.csv` and outputs exact Crop Accuracy % and Disease Accuracy %.*
