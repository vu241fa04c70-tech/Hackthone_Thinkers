from typing import Dict, List, Any
from datetime import datetime

# Multi-Farmer Backend Database Store (FARMERS_DB)
FARMERS_DB: Dict[str, Dict[str, Any]] = {
    "farmer_01": {
        "farmer_id": "farmer_01",
        "farmer_name": "రమేష్ గారూ (Ramesh)",
        "main_crop": "Tomato",
        "district": "Guntur",
        "village": "Mangalagiri",
        "state": "Andhra Pradesh",
        "acreage": 2.5,
        "phone": "+91 98480 12345",
        "registered_at": "2026-08-20T10:00:00"
    }
}

FIELDS_DB: Dict[str, Dict[str, Any]] = {
    "field_01": {
        "field_id": "field_01",
        "name": "వరి పొలం",
        "crop_type": "Tomato",
        "acreage": 2.5,
        "location": "Guntur, Andhra Pradesh",
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
    }
}

MANDI_PRICES_DB: Dict[str, Dict[str, Any]] = {
    "Tomato": {
        "nearest_mandi": "Guntur Wholesale Yard",
        "current_price": 2450.0,
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
    "Paddy": {
        "nearest_mandi": "Karimnagar APMC Market",
        "current_price": 2350.0,
        "historical_prices": [
            {"date": "10 Aug", "price": 2100},
            {"date": "12 Aug", "price": 2150},
            {"date": "14 Aug", "price": 2200},
            {"date": "16 Aug", "price": 2250},
            {"date": "18 Aug", "price": 2300},
            {"date": "20 Aug", "price": 2350},
            {"date": "21 Aug", "price": 2400}
        ],
        "projected_7d": 2650.0,
        "trend": "Rising",
        "optimal_window": "Hold harvest 3 days (+Rs 300/qtl gain)"
    }
}

SAMPLE_CROP_IMAGES: Dict[str, Dict[str, Any]] = {
    "sample_paddy_rice_blast": {
        "id": "sample_paddy_rice_blast",
        "name": "Paddy Leaf - Rice Blast & Sheath Blight",
        "crop": "Paddy",
        "disease_name": "వరి అగ్గి తెగులు మరియు పండు తెగులు",
        "confidence": 0.95,
        "affected_area_pct": 32.5,
        "severity_level": "High",
        "spread_velocity": "Fast",
        "pesticide": {
            "name": "Tricyclazole 75% WP (Beam / Baan)",
            "active_ingredient": "Tricyclazole",
            "dosage_per_acre": "120 grams in 200L water",
            "estimated_cost_inr": 420.0,
            "nearby_mandi_availability": True
        },
        "preventive_actions": [
            "Spray Tricyclazole 75% WP (120g/acre) within 48 hours",
            "Drain standing water from paddy fields to dry the soil surface",
            "Avoid over-application of nitrogenous (Urea) fertilizer"
        ]
    },
    "sample_tomato_early_blight": {
        "id": "sample_tomato_early_blight",
        "name": "Tomato Leaf - Early Blight Spotted",
        "crop": "Tomato",
        "disease_name": "టమాటా ఆకుపై ఎండు తెగులు",
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
            "Spray Mancozeb 75% WP within 48 hours",
            "Avoid overhead irrigation to reduce canopy wetness duration"
        ]
    }
}

FARMER_FEEDBACK_DB: List[Dict[str, Any]] = []
SCANS_HISTORY_DB: List[Dict[str, Any]] = [
    {
        "scan_id": "scan_101",
        "scan_date": "2026-08-22 10:30",
        "crop_name": "Tomato",
        "disease_name": "టమోటా ఎర్లీ బ్లైట్ (Early Blight)",
        "confidence_pct": 94.0,
        "health_status": "Diseased",
        "immediate_treatment": ["ప్రభావిత ఆకులను తొలగించండి", "Mancozeb 75% WP పిచికారీ చేయండి"]
    },
    {
        "scan_id": "scan_102",
        "scan_date": "2026-08-21 15:45",
        "crop_name": "Paddy",
        "disease_name": "వరి అగ్గి తెగులు (Rice Blast)",
        "confidence_pct": 95.0,
        "health_status": "Diseased",
        "immediate_treatment": ["Tricyclazole 75% WP పిచికారీ చేయండి", "పొలంలో నీరు తీసివేయండి"]
    }
]

def save_feedback(decision_id: str, rating: int, feedback_text: str):
    entry = {
        "decision_id": decision_id,
        "rating": rating,
        "feedback_text": feedback_text,
        "timestamp": datetime.now().isoformat()
    }
    FARMER_FEEDBACK_DB.append(entry)
    return entry

def save_scan_history(entry: Dict[str, Any]):
    SCANS_HISTORY_DB.insert(0, entry)
    return entry
