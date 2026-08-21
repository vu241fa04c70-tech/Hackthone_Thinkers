from typing import Dict, List, Any
from datetime import datetime

# In-Memory Database Store
FIELDS_DB: Dict[str, Dict[str, Any]] = {
    "field_01": {
        "field_id": "field_01",
        "name": "Green Acres - Tomato Block A",
        "crop_type": "Tomato",
        "acreage": 2.5,
        "location": "Nashik, Maharashtra",
        "soil_type": "Black Loam",
        "irrigation_system": "Drip Irrigation",
        "planting_date": "2026-06-15",
        "growth_stage": "Fruiting",
        "soil_data": {
            "nitrogen_n": 140.0,
            "phosphorus_p": 22.0,
            "potassium_k": 180.0,
            "moisture_percent": 34.0,
            "ph": 6.8,
            "organic_matter_pct": 1.4
        }
    },
    "field_02": {
        "field_id": "field_02",
        "name": "Sunrise Farm - Wheat North",
        "crop_type": "Wheat",
        "acreage": 5.0,
        "location": "Ludhiana, Punjab",
        "soil_type": "Alluvial Soil",
        "irrigation_system": "Sprinkler",
        "planting_date": "2026-05-10",
        "growth_stage": "Vegetative",
        "soil_data": {
            "nitrogen_n": 180.0,
            "phosphorus_p": 45.0,
            "potassium_k": 210.0,
            "moisture_percent": 42.0,
            "ph": 7.2,
            "organic_matter_pct": 1.8
        }
    },
    "field_03": {
        "field_id": "field_03",
        "name": "Delta Cotton - Field C",
        "crop_type": "Cotton",
        "acreage": 3.8,
        "location": "Guntur, Andhra Pradesh",
        "soil_type": "Red Clay",
        "irrigation_system": "Flood Irrigation",
        "planting_date": "2026-04-20",
        "growth_stage": "Flowering",
        "soil_data": {
            "nitrogen_n": 110.0,
            "phosphorus_p": 18.0,
            "potassium_k": 130.0,
            "moisture_percent": 28.0,
            "ph": 6.3,
            "organic_matter_pct": 1.1
        }
    }
}

MANDI_PRICES_DB: Dict[str, Dict[str, Any]] = {
    "Tomato": {
        "nearest_mandi": "Nashik APMC Mandi",
        "current_price": 2450.0, # INR per Quintal
        "historical_prices": [
            {"date": "10 Aug", "price": 2100},
            {"date": "12 Aug", "price": 2180},
            {"date": "14 Aug", "price": 2250},
            {"date": "16 Aug", "price": 2320},
            {"date": "18 Aug", "price": 2400},
            {"date": "20 Aug", "price": 2450},
            {"date": "21 Aug", "price": 2520}
        ],
        "projected_7d": 2750.0,
        "trend": "Rising",
        "optimal_window": "Harvest in 3 days (Pre-Rain Gain)"
    },
    "Wheat": {
        "nearest_mandi": "Ludhiana Grain Market",
        "current_price": 2275.0,
        "historical_prices": [
            {"date": "10 Aug", "price": 2250},
            {"date": "12 Aug", "price": 2260},
            {"date": "14 Aug", "price": 2265},
            {"date": "16 Aug", "price": 2270},
            {"date": "18 Aug", "price": 2272},
            {"date": "20 Aug", "price": 2275},
            {"date": "21 Aug", "price": 2275}
        ],
        "projected_7d": 2290.0,
        "trend": "Stable",
        "optimal_window": "Wait for Full Grain Filling (2 Weeks)"
    },
    "Cotton": {
        "nearest_mandi": "Guntur Cotton Market",
        "current_price": 6800.0,
        "historical_prices": [
            {"date": "10 Aug", "price": 7200},
            {"date": "12 Aug", "price": 7100},
            {"date": "14 Aug", "price": 7000},
            {"date": "16 Aug", "price": 6900},
            {"date": "18 Aug", "price": 6850},
            {"date": "20 Aug", "price": 6800},
            {"date": "21 Aug", "price": 6750}
        ],
        "projected_7d": 6600.0,
        "trend": "Falling",
        "optimal_window": "Pick Ready Bolls Immediately"
    },
    "Potato": {
        "nearest_mandi": "Agra Wholesale Market",
        "current_price": 1420.0,
        "historical_prices": [
            {"date": "10 Aug", "price": 1300},
            {"date": "12 Aug", "price": 1340},
            {"date": "14 Aug", "price": 1380},
            {"date": "16 Aug", "price": 1400},
            {"date": "18 Aug", "price": 1410},
            {"date": "20 Aug", "price": 1420},
            {"date": "21 Aug", "price": 1430}
        ],
        "projected_7d": 1510.0,
        "trend": "Rising",
        "optimal_window": "Hold in Cold Storage 10 Days"
    }
}

SAMPLE_CROP_IMAGES: Dict[str, Dict[str, Any]] = {
    "sample_tomato_early_blight": {
        "id": "sample_tomato_early_blight",
        "name": "Tomato Leaf - Early Blight Spotted",
        "crop": "Tomato",
        "disease_name": "Early Blight (Alternaria solani)",
        "confidence": 0.94,
        "affected_area_pct": 28.5,
        "severity_level": "Medium",
        "spread_velocity": "Fast",
        "pesticide": {
            "name": "Mancozeb 75% WP (Indofil M-45)",
            "active_ingredient": "Mancozeb",
            "dosage_per_acre": "600 grams in 200L water",
            "estimated_cost_inr": 380.0,
            "nearby_mandi_availability": True
        },
        "preventive_actions": [
            "Prune lower infected leaves to prevent soil splash transmission",
            "Spray Mancozeb or Copper Oxychloride within 48 hours",
            "Avoid overhead irrigation to reduce canopy wetness duration"
        ]
    },
    "sample_wheat_rust": {
        "id": "sample_wheat_rust",
        "name": "Wheat Leaf - Yellow Rust Stripe",
        "crop": "Wheat",
        "disease_name": "Yellow (Stripe) Rust (Puccinia striiformis)",
        "confidence": 0.91,
        "affected_area_pct": 18.0,
        "severity_level": "Medium",
        "spread_velocity": "Fast",
        "pesticide": {
            "name": "Propiconazole 25% EC (Tilt)",
            "active_ingredient": "Propiconazole",
            "dosage_per_acre": "200 ml in 200L water",
            "estimated_cost_inr": 520.0,
            "nearby_mandi_availability": True
        },
        "preventive_actions": [
            "Apply foliar spray of Propiconazole early morning",
            "Destroy localized infection spots to avoid windborne spore dispersion",
            "Maintain balanced nitrogen application"
        ]
    },
    "sample_cotton_bollworm": {
        "id": "sample_cotton_bollworm",
        "name": "Cotton Leaf - Pink Bollworm Infestation",
        "crop": "Cotton",
        "disease_name": "Pink Bollworm (Pectinophora gossypiella)",
        "confidence": 0.89,
        "affected_area_pct": 35.0,
        "severity_level": "High",
        "spread_velocity": "Moderate",
        "pesticide": {
            "name": "Emamectin Benzoate 5% SG (Proclaim)",
            "active_ingredient": "Emamectin Benzoate",
            "dosage_per_acre": "100 grams in 200L water",
            "estimated_cost_inr": 450.0,
            "nearby_mandi_availability": True
        },
        "preventive_actions": [
            "Install Pheromone traps (5 per acre) for monitoring adult moths",
            "Spray Emamectin Benzoate during late evening hours",
            "Collect and destroy rosette flowers and damaged bolls"
        ]
    },
    "sample_potato_late_blight": {
        "id": "sample_potato_late_blight",
        "name": "Potato Leaf - Late Blight Water-Soaked Lesions",
        "crop": "Potato",
        "disease_name": "Late Blight (Phytophthora infestans)",
        "confidence": 0.96,
        "affected_area_pct": 42.0,
        "severity_level": "Severe",
        "spread_velocity": "Fast",
        "pesticide": {
            "name": "Cymoxanil + Mancozeb (Curzate M8)",
            "active_ingredient": "Cymoxanil 8% + Mancozeb 64%",
            "dosage_per_acre": "600 grams in 200L water",
            "estimated_cost_inr": 620.0,
            "nearby_mandi_availability": True
        },
        "preventive_actions": [
            "Immediate systemic fungicide spray before rain event",
            "Earthing up soil around plants to protect tubers from spores",
            "Burn or deeply bury severely blighted haulms"
        ]
    },
    "sample_healthy_crop": {
        "id": "sample_healthy_crop",
        "name": "Healthy Crop Canopy",
        "crop": "Tomato",
        "disease_name": "Healthy - No Pathogens Detected",
        "confidence": 0.98,
        "affected_area_pct": 0.0,
        "severity_level": "Low",
        "spread_velocity": "Slow",
        "pesticide": {
            "name": "Neem Oil 10000 PPM (Preventive Bio-pesticide)",
            "active_ingredient": "Azadirachtin",
            "dosage_per_acre": "500 ml in 200L water",
            "estimated_cost_inr": 210.0,
            "nearby_mandi_availability": True
        },
        "preventive_actions": [
            "Continue regular drip irrigation schedule",
            "Perform bi-weekly visual scouting for early pest signs",
            "Apply prophylactic Neem oil spray"
        ]
    }
}

FARMER_FEEDBACK_DB: List[Dict[str, Any]] = []

def save_feedback(decision_id: str, rating: int, feedback_text: str):
    entry = {
        "decision_id": decision_id,
        "rating": rating,
        "feedback_text": feedback_text,
        "timestamp": datetime.now().isoformat()
    }
    FARMER_FEEDBACK_DB.append(entry)
    return entry
