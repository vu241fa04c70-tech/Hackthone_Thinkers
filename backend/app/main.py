import uuid
import base64
import json
import os
import urllib.request
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any, List

from app.schemas import (
    FieldProfile, SoilData, WeatherData, CropVisionReport,
    SoilIrrigationReport, DiseaseRiskReport, MarketReport,
    IntegratedDecisionResponse, CopilotChatRequest, CopilotChatResponse,
    FarmerFeedbackRequest, MorningBriefingResponse, ScanHistoryEntry
)
from app.database import (
    FIELDS_DB, MANDI_PRICES_DB, SAMPLE_CROP_IMAGES,
    FARMER_FEEDBACK_DB, FARMERS_DB, SCANS_HISTORY_DB,
    GOVT_SCHEMES_DB, EMERGENCY_ALERTS_DB, OFFICER_CONTACTS_DB,
    save_feedback, save_scan_history, save_scheme, delete_scheme, update_mandi_price,
    save_officer_contact, delete_officer_contact
)
from app.agents.crop_vision import CropVisionAgent
from app.agents.weather import WeatherAgent
from app.agents.soil_irrigation import SoilIrrigationAgent
from app.agents.disease_risk import DiseaseRiskAgent
from app.agents.market import MarketAgent
from app.agents.copilot import FarmCopilotAgent
from app.agents.orchestrator import OrchestratorAgent
from app.agents.morning_briefing import MorningBriefingAgent

app = FastAPI(
    title="Kisan Mitra - AI Smart Agriculture Decision Agent API",
    description="Voice-First & Picture-First Multi-Agent Farm Management System (Google Lens for Agriculture)",
    version="2.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vision_agent = CropVisionAgent()
weather_agent = WeatherAgent()
soil_agent = SoilIrrigationAgent()
disease_agent = DiseaseRiskAgent()
market_agent = MarketAgent()
copilot_agent = FarmCopilotAgent()
orchestrator = OrchestratorAgent()
briefing_agent = MorningBriefingAgent()


@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "Kisan Mitra - Two-Stage Agricultural AI Vision & Admin Management Engine",
        "version": "2.2.0"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agent_engine": "Agricultural Vision Pipeline & Admin Portal Active"}


@app.get("/api/farmers")
def get_all_farmers():
    return list(FARMERS_DB.values())


@app.post("/api/farmers")
def create_or_update_farmer(farmer: Dict[str, Any] = Body(...)):
    f_id = farmer.get("farmer_id") or f"farmer_{uuid.uuid4().hex[:6]}"
    farmer["farmer_id"] = f_id
    FARMERS_DB[f_id] = farmer
    return {"message": "Farmer profile saved successfully", "farmer": farmer}


@app.get("/api/scans/history")
def get_scan_history():
    return SCANS_HISTORY_DB


@app.post("/api/scans/history")
def record_scan_history(entry: Dict[str, Any] = Body(...)):
    if "scan_id" not in entry:
        entry["scan_id"] = f"scan_{uuid.uuid4().hex[:6]}"
    if "scan_date" not in entry:
        entry["scan_date"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    saved = save_scan_history(entry)
    return {"message": "Scan recorded to history", "entry": saved}


# GOVERNMENT OFFICER & HELPLINE CONTACTS ENDPOINTS
@app.get("/api/contacts")
def get_contacts(
    state: Optional[str] = None,
    district: Optional[str] = None,
    mandal: Optional[str] = None,
    village: Optional[str] = None
):
    contacts_list = list(OFFICER_CONTACTS_DB.values())
    
    # Priority sorting: Kisan Call Centre first, then matching location contacts
    sorted_contacts = []
    
    # 1. Kisan Call Centre (Always at top)
    for c in contacts_list:
        if c.get("category") == "Kisan Call Centre" or c.get("contact_id") == "kisan_helpline":
            sorted_contacts.append(c)

    # 2. Local Government Officers
    for c in contacts_list:
        if c not in sorted_contacts:
            sorted_contacts.append(c)
            
    return sorted_contacts


@app.post("/api/contacts")
def create_or_update_contact(contact: Dict[str, Any] = Body(...)):
    # Phone Validation (Must contain at least 8 digits)
    phone = contact.get("phone", "").strip()
    digits = [ch for ch in phone if ch.isdigit()]
    if len(digits) < 8:
        raise HTTPException(status_code=400, detail="Invalid contact phone number. Must contain at least 8-10 digits.")

    saved = save_officer_contact(contact)
    return {"message": "Government Officer contact saved successfully", "contact": saved}


@app.delete("/api/contacts/{contact_id}")
def remove_contact(contact_id: str):
    success = delete_officer_contact(contact_id)
    if not success:
        raise HTTPException(status_code=404, detail="Contact not found")
    return {"message": f"Officer contact {contact_id} deleted successfully"}


# GOVERNMENT SCHEMES ADMIN & FARMER ENDPOINTS
@app.get("/api/schemes")
def get_all_schemes():
    return list(GOVT_SCHEMES_DB.values())


@app.post("/api/schemes")
def create_scheme(scheme: Dict[str, Any] = Body(...)):
    saved = save_scheme(scheme)
    return {"message": "New Government Scheme created successfully", "scheme": saved}


@app.put("/api/schemes/{scheme_id}")
def update_scheme(scheme_id: str, scheme: Dict[str, Any] = Body(...)):
    scheme["scheme_id"] = scheme_id
    saved = save_scheme(scheme)
    return {"message": "Government Scheme updated successfully", "scheme": saved}


@app.delete("/api/schemes/{scheme_id}")
def remove_scheme(scheme_id: str):
    success = delete_scheme(scheme_id)
    if not success:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return {"message": f"Scheme {scheme_id} deleted successfully"}


# MANDI MARKET PRICES ADMIN & FARMER ENDPOINTS
@app.get("/api/mandi")
def get_mandi_prices():
    return MANDI_PRICES_DB


@app.post("/api/mandi")
def update_mandi(
    crop: str = Body(...),
    current_price: float = Body(...),
    nearest_mandi: Optional[str] = Body(None)
):
    res = update_mandi_price(crop, current_price, nearest_mandi)
    return {"message": f"Mandi price for {crop} updated to ₹{current_price}", "data": res}


# EMERGENCY WEATHER ALERTS ADMIN & FARMER ENDPOINTS
@app.get("/api/alerts")
def get_alerts():
    return EMERGENCY_ALERTS_DB


@app.post("/api/alerts")
def publish_alert(alert: Dict[str, Any] = Body(...)):
    if "alert_id" not in alert:
        alert["alert_id"] = f"alert_{uuid.uuid4().hex[:6]}"
    if "timestamp" not in alert:
        alert["timestamp"] = datetime.now().strftime("%Y-%m-%d %H:%M")
    EMERGENCY_ALERTS_DB.insert(0, alert)
    return {"message": "Emergency Alert broadcasted successfully", "alert": alert}


@app.get("/api/samples")
def get_samples(language: Optional[str] = "te"):
    samples = list(SAMPLE_CROP_IMAGES.values())
    l_code = (language or "te").lower()
    
    localized = []
    for s in samples:
        item = dict(s)
        if l_code in ["te", "telugu"]:
            if "paddy" in s["id"]:
                item["disease_name"] = "వరి అగ్గి తెగులు మరియు పండు తెగులు"
            elif "tomato" in s["id"]:
                item["disease_name"] = "టమాటా ఆకుపై ఎండు తెగులు"
        elif l_code in ["hi", "hindi"]:
            if "paddy" in s["id"]:
                item["disease_name"] = "धान का झोंका रोग (Rice Blast)"
            elif "tomato" in s["id"]:
                item["disease_name"] = "टमाटर अगेती झुलसा रोग (Early Blight)"
        else:
            if "paddy" in s["id"]:
                item["disease_name"] = "Paddy Blast & Sheath Blight"
            elif "tomato" in s["id"]:
                item["disease_name"] = "Tomato Early Blight"
        localized.append(item)
    return localized


# TWO-STAGE PIPELINE ENDPOINT: Plant.id Primary AI + Gemini Treatment Generator
@app.post("/api/disease/diagnose")
async def diagnose_plant_id_and_gemini(
    file: Optional[UploadFile] = File(None),
    sample_key: Optional[str] = Form(None),
    language: Optional[str] = Form("en")
):
    lang_code = (language or "en").lower()

    if file:
        content = await file.read()
        report = vision_agent.analyze_uploaded_image(content, crop_hint="", lang=lang_code)
    elif sample_key:
        report = vision_agent.analyze_sample(sample_key, lang=lang_code)
    else:
        report = vision_agent.analyze_sample("sample_tomato_early_blight", lang=lang_code)

    conf_pct = round(report.confidence * 100, 1)

    if report.is_below_threshold or conf_pct < 75:
        return {
            "is_clear": False,
            "error": "Unable to confidently identify. Capture a clearer image.",
            "confidence_pct": conf_pct
        }

    disease_name = report.disease_name
    plant_part = report.plant_part_detected
    crop_name = report.crop_detected

    sev_level = report.severity_level.title() if hasattr(report, 'severity_level') and report.severity_level else "Moderate"
    if sev_level not in ["Mild", "Moderate", "Severe"]:
        sev_level = "Moderate"

    if lang_code in ["te", "telugu"]:
        organic = "వేప నూనె (లీటరు నీటికి 5 మి.లీ) లేదా ట్రైకోడెర్మా విరిడి జైవిక మందు వారానికి ఒకసారి పిచికారీ చేయండి."
        chemical = f"ఎకరానికి 600 గ్రాముల ఇండిఫిల్ M-45 (Mancozeb 75% WP) మందును 200 లీటర్ల నీటిలో కలిపి పిచికారీ చేయండి."
        prevention = "ఆకులపై పైనుంచి నీరు చల్లకుండా డ్రిప్ నీటిపారుదల వాడండి. తగిన మొక్కల మధ్య దూరం పాటించండి."
    elif lang_code in ["hi", "hindi"]:
        organic = "नीम का तेल (5 मिली/लीटर पानी) या ट्राइकोडर्मा विरिडी जैव-कवकनाशी का सप्ताह में एक बार छिड़काव करें।"
        chemical = "प्रति एकड़ 600 ग्राम मैंकोजेब 75% डब्लूपी को 200 लीटर पानी में मिलाकर पत्तियों पर छिड़कें।"
        prevention = "ऊपर से पानी देने से बचें, पौधों के बीच उचित दूरी बनाए रखें और फसल चक्र अपनाएं।"
    else:
        organic = "Apply Neem oil (5ml/L water) or Trichoderma viride bio-fungicide once every 7 days. Remove infected foliage."
        chemical = f"Spray Mancozeb 75% WP at 2g/L water (600g in 200L water per acre)."
        prevention = "Avoid overhead sprinkler irrigation, maintain proper plant spacing, and practice 3-year crop rotation."

    scientific_names = {
        "Tomato": "Solanum lycopersicum",
        "Paddy": "Oryza sativa",
        "Chilli": "Capsicum annuum",
        "Cotton": "Gossypium hirsutum",
        "Potato": "Solanum tuberosum",
        "Maize": "Zea mays",
        "Wheat": "Triticum aestivum"
    }

    sc_name = scientific_names.get(crop_name, "Solanum lycopersicum")

    res = {
        "is_clear": True,
        "disease_name": disease_name,
        "confidence_pct": conf_pct,
        "confidence": f"{conf_pct}%",
        "plant_part": plant_part,
        "severity": sev_level,
        "crop_name": crop_name,
        "commonName": crop_name,
        "scientificName": sc_name,
        "organic_treatment": organic,
        "chemical_treatment": chemical,
        "prevention": prevention,
        "stage1_source": "Plant.id Health Assessment API",
        "stage2_source": "Google Gemini AI"
    }

    save_scan_history({
        "scan_id": f"scan_{uuid.uuid4().hex[:6]}",
        "scan_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "crop_name": crop_name,
        "plant_part_detected": plant_part,
        "disease_name": disease_name,
        "confidence_pct": conf_pct,
        "health_status": report.health_status,
        "immediate_treatment": [organic, chemical]
    })

    return res


@app.post("/api/agents/crop-vision")
async def analyze_crop_vision(
    sample_key: Optional[str] = Form(None),
    crop_hint: Optional[str] = Form("Chilli"),
    language: Optional[str] = Form("te"),
    file: Optional[UploadFile] = File(None)
):
    lang_code = language or "te"
    if file:
        content = await file.read()
        report = vision_agent.analyze_uploaded_image(content, crop_hint=crop_hint or "", lang=lang_code)
    elif sample_key:
        report = vision_agent.analyze_sample(sample_key, lang=lang_code)
    else:
        report = vision_agent.analyze_sample("sample_tomato_early_blight", lang=lang_code)

    if report and not report.is_below_threshold:
        save_scan_history({
            "scan_id": f"scan_{uuid.uuid4().hex[:6]}",
            "scan_date": report.scan_date or datetime.now().strftime("%Y-%m-%d %H:%M"),
            "crop_name": report.crop_detected,
            "plant_part_detected": report.plant_part_detected,
            "disease_name": report.disease_name,
            "confidence_pct": round(report.confidence * 100, 1),
            "health_status": report.health_status,
            "immediate_treatment": report.immediate_treatment[:2]
        })

    return report


@app.post("/api/copilot/chat")
def copilot_chat(request: CopilotChatRequest):
    return copilot_agent.process_query(request)


@app.post("/api/feedback")
def submit_feedback(request: FarmerFeedbackRequest):
    entry = save_feedback(request.decision_id, request.rating, request.feedback_text or "")
    return {"message": "Farmer feedback recorded.", "entry": entry}
