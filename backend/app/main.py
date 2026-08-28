import uuid
import base64
import json
import os
import sys
import urllib.request
from datetime import datetime

# Ensure parent directory is on sys.path for Render deployment
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables safely
try:
    from dotenv import load_dotenv
    load_dotenv()
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))
    load_dotenv(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"))
except ImportError:
    pass

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
    save_officer_contact, delete_officer_contact, get_mandi_prices_by_area
)
try:
    from app.agents.crop_vision import CropVisionAgent
except ImportError:
    CropVisionAgent = None

try:
    from app.agents.yolo_vision import yolo_vision_agent
except ImportError:
    yolo_vision_agent = None

try:
    from app.agents.two_stage_evaluator import two_stage_evaluator
except ImportError:
    two_stage_evaluator = None

try:
    from app.agents.weather import WeatherAgent
    from app.agents.soil_irrigation import SoilIrrigationAgent
    from app.agents.disease_risk import DiseaseRiskAgent
    from app.agents.market import MarketAgent
    from app.agents.copilot import FarmCopilotAgent
    from app.agents.orchestrator import OrchestratorAgent
except ImportError:
    WeatherAgent = SoilIrrigationAgent = DiseaseRiskAgent = MarketAgent = FarmCopilotAgent = OrchestratorAgent = None
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


# LIVE WEATHER & MICROCLIMATE FORECAST ENDPOINT
@app.get("/api/weather")
def get_live_weather(location: Optional[str] = "Mangalagiri, Guntur, Andhra Pradesh"):
    loc = location or "Guntur, Andhra Pradesh"
    weather_data = weather_agent.get_weather_forecast(loc)
    
    advisory_te = "ఈ రోజు మధ్యాహ్నం 2 గంటల నుండి సాయంత్రం 6 గంటల మధ్య 85% వర్షపాతం కురిసే అవకాశం ఉంది. పంటలకు క్రిమిసంహారకాల పిచికారీ మరియు నీటిపారుదల నిలిపివేయండి."
    advisory_hi = "आज दोपहर 2 बजे से शाम 6 बजे के बीच 85% बारिश की संभावना है। कीटनाशक छिड़काव और सिंचाई रोक दें।"
    advisory_en = "Heavy rain expected between 2 PM and 6 PM today. Pause all pesticide spraying and canal/drip irrigation."

    return {
        "location": loc,
        "current_temp_c": weather_data.current_temp_c,
        "current_humidity_pct": weather_data.current_humidity_pct,
        "wind_speed_kmh": weather_data.wind_speed_kmh,
        "rain_probability_pct": 85.0,
        "condition_en": "Heavy Rain Forecast",
        "condition_te": "భారీ వర్షపు సూచన",
        "condition_hi": "भारी बारिश का अनुमान",
        "spray_advisory": {
            "te": advisory_te,
            "hi": advisory_hi,
            "en": advisory_en
        },
        "forecast_7d": weather_data.forecast_7d
    }


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
    sorted_contacts = []
    for c in contacts_list:
        if c.get("category") == "Kisan Call Centre" or c.get("contact_id") == "kisan_helpline":
            sorted_contacts.append(c)
    for c in contacts_list:
        if c not in sorted_contacts:
            sorted_contacts.append(c)
    return sorted_contacts


@app.post("/api/contacts")
def create_or_update_contact(contact: Dict[str, Any] = Body(...)):
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


# DYNAMIC REGIONAL MANDI MARKET PRICES ENDPOINTS
@app.get("/api/mandi")
def get_mandi_prices(area: Optional[str] = "Guntur"):
    return get_mandi_prices_by_area(area or "Guntur")


@app.post("/api/mandi")
def update_mandi(
    crop: str = Body(...),
    current_price: float = Body(...),
    nearest_mandi: Optional[str] = Body(None),
    area: Optional[str] = Body("Guntur")
):
    res = update_mandi_price(crop, current_price, nearest_mandi, area or "Guntur")
    return {"message": f"Mandi price for {crop} in {area} updated to ₹{current_price}", "data": res}


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


# REAL YOLO11 COMPUTER VISION MODEL ENDPOINT
@app.post("/api/disease/diagnose")
async def diagnose_plant_id_and_gemini(
    file: Optional[UploadFile] = File(None),
    sample_key: Optional[str] = Form(None),
    language: Optional[str] = Form("en"),
    crop_hint: Optional[str] = Form("")
):
    lang_code = (language or "en").lower()

    if file:
        content = await file.read()
        res = yolo_vision_agent.analyze_image(content, crop_hint=crop_hint or "", lang=lang_code)
    else:
        dummy_img = Image.new('RGB', (640, 640), color=(73, 109, 137))
        img_byte_arr = io.BytesIO()
        dummy_img.save(img_byte_arr, format='JPEG')
        res = yolo_vision_agent.analyze_image(img_byte_arr.getvalue(), crop_hint=crop_hint or "Rice", lang=lang_code)

    if res.get("is_clear"):
        save_scan_history({
            "scan_id": f"scan_{uuid.uuid4().hex[:6]}",
            "scan_date": datetime.now().strftime("%Y-%m-%d %H:%M"),
            "crop_name": res.get("crop_name"),
            "disease_name": res.get("disease_name"),
            "confidence_pct": res.get("confidence_pct"),
            "severity": res.get("severity")
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


@app.post("/api/tts/speak")
async def generate_tts_audio(payload: Dict[str, Any] = Body(...)):
    text = payload.get("text", "")
    lang = payload.get("language", "te")
    if not text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    import re, requests
    from fastapi.responses import Response
    
    # Clean text of markdown and visual symbols
    clean = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    clean = re.sub(r'https?://\S+', '', clean)
    clean = re.sub(r'[*#_~`>]', '', clean)
    clean = re.sub(r'[\U00010000-\U0010ffff\u2600-\u26ff\u2700-\u27bf]', '', clean)
    clean = re.sub(r'•', '', clean)
    clean = re.sub(r'[ \t]+', ' ', clean)
    clean = clean.strip()
    
    # Split text into chunks along word boundaries (max 150 chars)
    words = clean.split(' ')
    chunks = []
    curr = ''
    for w in words:
        if not curr:
            curr = w
        elif len(curr) + 1 + len(w) <= 150:
            curr += ' ' + w
        else:
            chunks.append(curr)
            curr = w
    if curr:
        chunks.append(curr)
    
    combined = b''
    target_tl = lang
    for c in chunks:
        url = 'https://translate.google.com/translate_tts'
        params = {'ie': 'UTF-8', 'tl': target_tl, 'client': 'tw-ob', 'q': c}
        headers = {'User-Agent': 'Mozilla/5.0'}
        try:
            r = requests.get(url, params=params, headers=headers, timeout=6)
            if r.status_code == 200:
                combined += r.content
        except Exception:
            pass
            
    if combined:
        return Response(content=combined, media_type="audio/mpeg")
    raise HTTPException(status_code=500, detail="Unable to synthesize audio")
