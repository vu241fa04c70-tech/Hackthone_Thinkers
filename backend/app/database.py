from typing import Dict, List, Any
from datetime import datetime

# Persistent Farmer Database Store
FARMERS_DB: Dict[str, Dict[str, Any]] = {
    "farmer_01": {
        "farmer_id": "farmer_01",
        "farmer_name": "రమేష్ గారూ",
        "main_crop": "Paddy",
        "district": "Guntur",
        "village": "Mangalagiri",
        "state": "Andhra Pradesh",
        "acreage": 3.5,
        "phone": "+91 98480 12345",
        "registered_at": "2026-08-20T10:00:00"
    },
    "farmer_02": {
        "farmer_id": "farmer_02",
        "farmer_name": "వెంకటేశ్వర్లు గారూ",
        "main_crop": "Chilli",
        "district": "Guntur",
        "village": "Tadikonda",
        "state": "Andhra Pradesh",
        "acreage": 2.0,
        "phone": "+91 94401 67890",
        "registered_at": "2026-08-21T11:30:00"
    },
    "farmer_03": {
        "farmer_id": "farmer_03",
        "farmer_name": "रमेश कुमार भाई",
        "main_crop": "Wheat",
        "district": "Ludhiana",
        "village": "Gill",
        "state": "Punjab",
        "acreage": 5.0,
        "phone": "+91 98140 54321",
        "registered_at": "2026-08-21T14:15:00"
    },
    "farmer_04": {
        "farmer_id": "farmer_04",
        "farmer_name": "రమేష్ సింగ్ గారూ",
        "main_crop": "Tomato",
        "district": "Chittoor",
        "village": "Madanapalle",
        "state": "Andhra Pradesh",
        "acreage": 4.2,
        "phone": "+91 97000 88990",
        "registered_at": "2026-08-22T09:00:00"
    }
}

# Fields Database Store
FIELDS_DB: Dict[str, Dict[str, Any]] = {
    "field_01": {
        "field_id": "field_01",
        "name": "Green Acres - Paddy Block A",
        "crop_type": "Paddy",
        "acreage": 3.5,
        "location": "Guntur, Andhra Pradesh",
        "soil_type": "Black Loam",
        "irrigation_system": "Canal Irrigation",
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
    "Paddy": {
        "nearest_mandi": "Guntur APMC Rice Yard",
        "current_price": 2350.0, # INR per Quintal
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
    },
    "Tomato": {
        "nearest_mandi": "Madanapalle Wholesale Yard",
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
    "Chilli": {
        "nearest_mandi": "Guntur Mirchi Yard",
        "current_price": 18500.0,
        "historical_prices": [
            {"date": "10 Aug", "price": 17000},
            {"date": "12 Aug", "price": 17500},
            {"date": "14 Aug", "price": 17800},
            {"date": "16 Aug", "price": 18000},
            {"date": "18 Aug", "price": 18200},
            {"date": "20 Aug", "price": 18500},
            {"date": "21 Aug", "price": 18900}
        ],
        "projected_7d": 19800.0,
        "trend": "Rising",
        "optimal_window": "Dry Pods for 2 Days Before Sale"
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
    "sample_paddy_rice_blast": {
        "id": "sample_paddy_rice_blast",
        "name": "Paddy Leaf - Rice Blast & Sheath Blight",
        "crop": "Paddy",
        "disease_name": "Rice Blast & Sheath Blight (Pyricularia oryzae)",
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
            "Spray Mancozeb 75% WP within 48 hours",
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
