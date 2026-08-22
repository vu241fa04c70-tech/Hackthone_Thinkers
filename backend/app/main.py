import uuid
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
    save_feedback, save_scan_history
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
    version="2.1.0"
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
        "service": "Kisan Mitra - Two-Stage Agricultural AI Vision Engine",
        "version": "2.1.0"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agent_engine": "Two-Stage Agricultural AI Vision Pipeline Ready (Google Lens for Agriculture)"}


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
        else: # English & all other languages
            if "paddy" in s["id"]:
                item["disease_name"] = "Paddy Blast & Sheath Blight"
            elif "tomato" in s["id"]:
                item["disease_name"] = "Tomato Early Blight"
        localized.append(item)
    return localized


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
