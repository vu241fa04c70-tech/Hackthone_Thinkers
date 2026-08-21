from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any, List

from app.schemas import (
    FieldProfile, SoilData, WeatherData, CropVisionReport,
    SoilIrrigationReport, DiseaseRiskReport, MarketReport,
    IntegratedDecisionResponse, CopilotChatRequest, CopilotChatResponse,
    FarmerFeedbackRequest, MorningBriefingResponse
)
from app.database import (
    FIELDS_DB, MANDI_PRICES_DB, SAMPLE_CROP_IMAGES,
    FARMER_FEEDBACK_DB, save_feedback
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
    description="Voice-First & Picture-First Multi-Agent Farm Management System",
    version="2.0.0"
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate Agents
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
        "service": "Kisan Mitra - AI Smart Agriculture Decision Agent",
        "version": "2.0.0"
    }


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "agent_engine": "Multi-Agent Orchestrator & Morning Briefing Ready"}


@app.get("/api/fields")
def get_fields():
    return list(FIELDS_DB.values())


@app.post("/api/fields")
def create_field(profile: FieldProfile):
    FIELDS_DB[profile.field_id] = profile.model_dump()
    return {"message": "Field profile saved", "field": profile}


@app.get("/api/samples")
def get_samples():
    return list(SAMPLE_CROP_IMAGES.values())


@app.get("/api/agents/morning-briefing")
def get_morning_briefing(
    field_id: str = "field_01",
    farmer_name: str = "Ramesh Bhai",
    language: str = "Hindi"
):
    return briefing_agent.generate_briefing(field_id=field_id, farmer_name=farmer_name, language=language)


@app.post("/api/agents/crop-vision")
async def analyze_crop_vision(
    sample_key: Optional[str] = Form(None),
    crop_hint: Optional[str] = Form("Tomato"),
    file: Optional[UploadFile] = File(None)
):
    if file:
        content = await file.read()
        return vision_agent.analyze_uploaded_image(content, crop_hint=crop_hint or "Tomato")
    elif sample_key:
        return vision_agent.analyze_sample(sample_key)
    else:
        return vision_agent.analyze_sample("sample_tomato_early_blight")


@app.post("/api/agents/weather")
def get_weather(location: str = Body(..., embed=True)):
    return weather_agent.get_weather_forecast(location)


@app.post("/api/agents/soil-irrigation")
def analyze_soil(
    field_id: str = Body("field_01"),
    crop_type: str = Body("Tomato"),
    growth_stage: str = Body("Fruiting"),
    acreage: float = Body(2.5),
    nitrogen_n: float = Body(140.0),
    phosphorus_p: float = Body(22.0),
    potassium_k: float = Body(180.0),
    moisture_percent: float = Body(34.0)
):
    soil = SoilData(
        nitrogen_n=nitrogen_n,
        phosphorus_p=phosphorus_p,
        potassium_k=potassium_k,
        moisture_percent=moisture_percent
    )
    weather = weather_agent.get_weather_forecast("Nashik, Maharashtra")
    return soil_agent.calculate_requirements(soil, crop_type, growth_stage, acreage, weather)


@app.post("/api/agents/market")
def analyze_market(
    crop_type: str = Body("Tomato"),
    growth_stage: str = Body("Fruiting"),
    location: str = Body("Nashik, Maharashtra")
):
    weather = weather_agent.get_weather_forecast(location)
    return market_agent.evaluate_market_and_harvest(crop_type, growth_stage, weather)


@app.post("/api/agents/integrate-decision")
async def integrate_decision(
    field_id: Optional[str] = Form("field_01"),
    sample_image_key: Optional[str] = Form("sample_tomato_early_blight"),
    file: Optional[UploadFile] = File(None)
):
    uploaded_bytes = None
    if file:
        uploaded_bytes = await file.read()

    return orchestrator.generate_integrated_decision(
        field_id=field_id or "field_01",
        sample_image_key=sample_image_key,
        uploaded_bytes=uploaded_bytes
    )


@app.post("/api/copilot/chat")
def copilot_chat(request: CopilotChatRequest):
    return copilot_agent.process_query(request)


@app.post("/api/feedback")
def submit_feedback(request: FarmerFeedbackRequest):
    entry = save_feedback(request.decision_id, request.rating, request.feedback_text or "")
    return {"message": "Farmer feedback recorded. Thank you for continuous learning!", "entry": entry}


@app.get("/api/feedback")
def get_all_feedback():
    return FARMER_FEEDBACK_DB
