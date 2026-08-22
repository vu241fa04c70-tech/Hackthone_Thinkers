from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class FieldProfile(BaseModel):
    field_id: str
    name: str
    crop_type: str  # e.g., Tomato, Wheat, Rice, Cotton, Potato, Onion, Corn
    acreage: float
    location: str   # e.g., Nashik, Maharashtra / Guntur, Andhra Pradesh
    soil_type: str  # Black Loam, Red Soil, Alluvial, Sandy
    irrigation_system: str # Drip, Flood, Sprinkler
    planting_date: str # YYYY-MM-DD
    growth_stage: str  # Seedling, Vegetative, Flowering, Fruiting, Harvesting
    farmer_name: Optional[str] = "Ramesh Kumar"
    language: Optional[str] = "Hindi"

class SoilData(BaseModel):
    nitrogen_n: float = Field(..., description="N content in kg/ha")
    phosphorus_p: float = Field(..., description="P content in kg/ha")
    potassium_k: float = Field(..., description="K content in kg/ha")
    moisture_percent: float = Field(..., description="Current soil moisture percentage")
    ph: float = 6.5
    organic_matter_pct: float = 1.2

class WeatherDay(BaseModel):
    day: str
    temp_max: float
    temp_min: float
    humidity: float
    rainfall_mm: float
    condition: str # Sunny, Rainy, High Humidity, Overcast

class WeatherData(BaseModel):
    location: str
    current_temp_c: float
    current_humidity_pct: float
    wind_speed_kmh: float
    forecast_7d: List[WeatherDay]

class PesticideRecommendation(BaseModel):
    name: str
    active_ingredient: str
    dosage_per_acre: str
    dosage_per_liter: Optional[str] = "2 spoons per 1 liter water"
    estimated_cost_inr: float
    nearby_mandi_availability: bool

class PredictionProbability(BaseModel):
    disease_name: str
    confidence_pct: float
    status: str # Healthy or Diseased

class CropVisionReport(BaseModel):
    is_crop_detected: bool = True
    crop_detected: str
    plant_part_detected: str # Leaf, Fruit, Stem, Flower, Whole Plant, Multiple Parts
    health_status: str # Healthy or Diseased
    disease_name: str
    confidence: float
    affected_area_pct: float
    severity_level: str # Low, Medium, High, Severe
    spread_velocity: str # Slow, Moderate, Fast
    top_3_predictions: List[PredictionProbability]
    is_below_threshold: bool = False
    quality_warning: Optional[str] = None
    symptoms: List[str]
    cause: str
    immediate_treatment: List[str]
    prevention_tips: List[str]
    dosage_note: str
    pesticide: Optional[PesticideRecommendation] = None
    is_low_confidence: bool = False
    user_message: Optional[str] = None
    scan_date: Optional[str] = None

class ScanHistoryEntry(BaseModel):
    scan_id: str
    scan_date: str
    crop_name: str
    plant_part_detected: Optional[str] = "Leaf"
    disease_name: str
    confidence_pct: float
    health_status: str
    immediate_treatment: List[str]
    image_url: Optional[str] = None

class SoilIrrigationReport(BaseModel):
    water_requirement_l_per_day: float
    irrigation_schedule: str
    fertilizer_recommendations: List[Dict[str, Any]]
    soil_health_score: int

class DiseaseRiskReport(BaseModel):
    risk_level: str # Low, Medium, High, Critical
    probability_percent: int
    key_weather_triggers: List[str]
    prevention_advice: List[str]

class MarketReport(BaseModel):
    crop: str
    nearest_mandi: str
    current_price_per_quintal: float
    projected_7d_price: float
    price_trend: str # Rising, Stable, Falling
    harvest_recommendation: str
    harvest_confidence_score: int
    price_change_expected_pct: float
    yield_loss_risk_if_delayed_pct: float
    village_price_per_kg: Optional[float] = 8.0
    mandi_price_per_kg: Optional[float] = 12.0

class TimelineItem(BaseModel):
    week: str
    title: str
    category: str
    details: str
    priority: str
    completed: bool = False

class ExplainabilityFactor(BaseModel):
    agent_name: str
    icon: str
    factor_title: str
    reasoning: str
    weight: str

class IntegratedDecisionResponse(BaseModel):
    decision_id: str
    field_id: str
    crop_type: str
    overall_action_summary: str
    priority: str
    risk_rating: str
    confidence_score: int
    explainability_factors: List[ExplainabilityFactor]
    weekly_timeline: List[TimelineItem]
    vision_report: Optional[CropVisionReport] = None
    weather_data: Optional[WeatherData] = None
    soil_irrigation_report: Optional[SoilIrrigationReport] = None
    disease_risk_report: Optional[DiseaseRiskReport] = None
    market_report: Optional[MarketReport] = None
    timestamp: str

class MorningBriefingResponse(BaseModel):
    farmer_name: str
    crop: str
    location: str
    greeting: str
    voice_script: str
    key_action_points: List[str]
    weather_simple_advice: str
    market_simple_advice: str
    language: str

class CopilotChatRequest(BaseModel):
    query: str
    language: str = "English"
    field_id: Optional[str] = "field_01"
    audio_base64: Optional[str] = None
    farmer_profile: Optional[Dict[str, Any]] = None

class CopilotChatResponse(BaseModel):
    answer: str
    detected_language: str
    suggested_actions: List[str]
    voice_audio_url: Optional[str] = None
    source_agents_consulted: List[str]

class FarmerFeedbackRequest(BaseModel):
    decision_id: str
    rating: int
    feedback_text: Optional[str] = ""
