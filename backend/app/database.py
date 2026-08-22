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
    },
    "farmer_02": {
        "farmer_id": "farmer_02",
        "farmer_name": "సురేష్ రెడ్డి (Suresh Reddy)",
        "main_crop": "Paddy",
        "district": "Karimnagar",
        "village": "Huzurabad",
        "state": "Telangana",
        "acreage": 4.0,
        "phone": "+91 94401 67890",
        "registered_at": "2026-08-21T11:30:00"
    },
    "farmer_03": {
        "farmer_id": "farmer_03",
        "farmer_name": "రాజేష్ పటేల్ (Rajesh Patel)",
        "main_crop": "Chilli",
        "district": "Nashik",
        "village": "Pimpalgaon",
        "state": "Maharashtra",
        "acreage": 3.0,
        "phone": "+91 98140 54321",
        "registered_at": "2026-08-21T14:15:00"
    },
    "farmer_04": {
        "farmer_id": "farmer_04",
        "farmer_name": "నవీన్ కుమార్ (Naveen Kumar)",
        "main_crop": "Maize",
        "district": "Mandya",
        "village": "Pandavapura",
        "state": "Karnataka",
        "acreage": 5.0,
        "phone": "+91 97000 88990",
        "registered_at": "2026-08-22T09:00:00"
    }
}

FIELDS_DB: Dict[str, Dict[str, Any]] = {
    "field_01": {
        "field_id": "field_01",
        "name": "Green Acres - Block A",
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
    "Maize": {
        "nearest_mandi": "Mandya Grain Market",
        "current_price": 2150.0,
        "historical_prices": [
            {"date": "10 Aug", "price": 2000},
            {"date": "12 Aug", "price": 2050},
            {"date": "14 Aug", "price": 2080},
            {"date": "16 Aug", "price": 2100},
            {"date": "18 Aug", "price": 2120},
            {"date": "20 Aug", "price": 2150},
            {"date": "21 Aug", "price": 2180}
        ],
        "projected_7d": 2280.0,
        "trend": "Rising",
        "optimal_window": "Sell in 4 Days"
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
