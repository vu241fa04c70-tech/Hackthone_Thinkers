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
    },
    "Chilli": {
        "nearest_mandi": "Guntur Mirchi Yard",
        "current_price": 18500.0,
        "historical_prices": [
            {"date": "10 Aug", "price": 17200},
            {"date": "14 Aug", "price": 17800},
            {"date": "18 Aug", "price": 18100},
            {"date": "21 Aug", "price": 18500}
        ],
        "projected_7d": 19800.0,
        "trend": "Rising",
        "optimal_window": "Optimal selling window active"
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
        "name": "Tomato Leaf - Early Blight",
        "crop": "Tomato",
        "disease_name": "టమాటా ఆకుపై ఎండు తెగులు",
        "confidence": 0.94,
        "affected_area_pct": 28.0,
        "severity_level": "Medium",
        "spread_velocity": "Moderate",
        "pesticide": {
            "name": "Mancozeb 75% WP (Indofil M-45)",
            "active_ingredient": "Mancozeb",
            "dosage_per_acre": "600 grams in 200L water",
            "estimated_cost_inr": 380.0,
            "nearby_mandi_availability": True
        },
        "preventive_actions": [
            "Spray Mancozeb 75% WP (600g/acre) within 48 hours",
            "Prune infected lower foliage to reduce splash dispersal",
            "Maintain row-to-row spacing for improved air ventilation"
        ]
    }
}

# Multilingual Dynamic Government Schemes Store (GOVT_SCHEMES_DB)
GOVT_SCHEMES_DB: Dict[str, Dict[str, Any]] = {
    "scheme_01": {
        "scheme_id": "scheme_01",
        "title": {
            "te": "పీఎం కిసాన్ సమ్మాన్ నిధి (PM-KISAN)",
            "hi": "पीएम किसान सम्मान निधि (PM-KISAN)",
            "en": "PM-KISAN Samman Nidhi"
        },
        "category": "Direct Income Support",
        "financial_benefit": {
            "te": "ఏటా ₹6,000 (3 విడతలలో రూ. 2,000 చొప్పున)",
            "hi": "₹6,000 प्रति वर्ष (3 किस्तों में)",
            "en": "₹6,000 per year (3 Installments of ₹2,000)"
        },
        "eligibility": {
            "te": "భారతదేశంలో సాగుభూమి ఉన్న చిన్న మరియు కమతాల రైతు కుటుంబాలు",
            "hi": "भारत में कृषि योग्य भूमि वाले सभी किसान परिवार",
            "en": "All landholding farmer families across India"
        },
        "deadline": "Open Year-Round",
        "description": {
            "te": "చిన్న మరియు చిన్నకారు రైతు కుటుంబాలకు ఏటా ₹6,000 ఆర్థిక సహాయం నేరుగా బ్యాంక్ ఖాతాలో జమ.",
            "hi": "छोटे और सीमांत किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष वित्तीय सहायता।",
            "en": "Direct bank transfer financial support for small and marginal landholding farmer families."
        },
        "application_link": "https://pmkisan.gov.in",
        "status": "Active",
        "added_by": "Government Admin"
    },
    "scheme_02": {
        "scheme_id": "scheme_02",
        "title": {
            "te": "పీఎం ఫసల్ భీమా యోజన (PMFBY Crop Insurance)",
            "hi": "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
            "en": "PM Fasal Bima Yojana (PMFBY)"
        },
        "category": "Crop Insurance & Risk Management",
        "financial_benefit": {
            "te": "వర్షాలు, తెగుళ్ల వల్ల పంట నష్టపోతే 100% బీమా రక్షణ",
            "hi": "100% फसल क्षतिपूर्ति बीमा",
            "en": "Full financial cover against non-preventable crop yield losses"
        },
        "eligibility": {
            "te": "టమాటా, వరి, మిరప, పత్తి, బంగాళాదుంప సాగు చేసే రైతులు",
            "hi": "अधिसूचित फसलों की खेती करने वाले सभी किसान",
            "en": "Farmers growing notified crops in notified areas"
        },
        "deadline": "31 August 2026",
        "description": {
            "te": "వర్షాలు, వరదలు, కరువు లేదా తెగుళ్ల వల్ల పంట నష్టం వాటిల్లితే 100% నష్టపరిహార బీమా రక్షణ పథకం.",
            "hi": "आपदाओं, बाढ़ या कीटों से फसल के नुकसान पर पूर्ण वित्तीय सुरक्षा।",
            "en": "Comprehensive crop insurance policy with nominal premium rates (1.5% for Rabi, 2% for Kharif)."
        },
        "application_link": "https://pmfby.gov.in",
        "status": "Active",
        "added_by": "Ministry of Agriculture"
    },
    "scheme_03": {
        "scheme_id": "scheme_03",
        "title": {
            "te": "వైఎస్సార్ రైతు భరోసా / రాష్ట్ర రైతు సహాయం",
            "hi": "राज्य किसान सहायता योजना",
            "en": "Rythu Bharosa / State Farmer Assistance"
        },
        "category": "State Investment Support",
        "financial_benefit": {
            "te": "ఏటా ₹13,500 పెట్టుబడి సాయం",
            "hi": "₹13,500 प्रति वर्ष",
            "en": "₹13,500 annual investment support"
        },
        "eligibility": {
            "te": "సొంత భూమి ఉన్న రైతులు మరియు కౌలు రైతు కుటుంబాలు",
            "hi": "स्वयं की भूमि वाले किसान और पट्टेदार किसान",
            "en": "Landowner & tenant farmer families in the state"
        },
        "deadline": "15 October 2026",
        "description": {
            "te": "పంట పెట్టుబడి సహాయం కోసం ప్రతి సంవత్సరం విత్తనాల కొనుగోలు సమయానికి విడతల వారీగా ఖాతాలో జమ చేసే పథకం.",
            "hi": "बीज और उर्वरक की खरीद के लिए प्रतिवर्ष प्रत्यक्ष वित्तीय सहायता।",
            "en": "Annual financial grant provided before crop sowing season to buy seeds, fertilizers, and pesticides."
        },
        "application_link": "https://rythubharosa.ap.gov.in",
        "status": "Active",
        "added_by": "State Agriculture Dept"
    },
    "scheme_04": {
        "scheme_id": "scheme_04",
        "title": {
            "te": "బిందు సేద్యం (సూక్ష్మ సేద్యం) 80% రాయితీ పథకం",
            "hi": "सूक्ष्म सिंचाई 80% सब्सिडी योजना",
            "en": "Micro-Irrigation & Drip 80% Subsidy Scheme"
        },
        "category": "Subsidized Machinery & Irrigation",
        "financial_benefit": {
            "te": "డ్రిప్ మరియు స్ప్రింక్లర్ పరికరాలపై 80% నుండి 90% సబ్సిడీ",
            "hi": "ड्रिप सिंचाई उपकरणों पर 80% से 90% सब्सिडी",
            "en": "80% to 90% subsidy on Drip & Sprinkler equipment"
        },
        "eligibility": {
            "te": "5 ఎకరాలలోపు సాగుభూమి ఉన్న చిన్న మరియు చిన్నకారు రైతులు",
            "hi": "5 एकड़ तक भूमि वाले छोटे और सीमांत किसान",
            "en": "Small and marginal farmers holding up to 5 acres"
        },
        "deadline": "30 September 2026",
        "description": {
            "te": "నీటిని ఆదా చేసి దిగుబడిని పెంచడానికి ఆధునిక డ్రిప్ పరికరాల రాయితీ అమరిక పథకం.",
            "hi": "जल संरक्षण और फसल पैदावार बढ़ाने के लिए सब्सिडी युक्त ड्रिप सिंचाई।",
            "en": "Subsidized installation of modern drip irrigation kits to conserve water and increase crop yield."
        },
        "application_link": "https://pmksy.gov.in",
        "status": "Active",
        "added_by": "Horticulture Department"
    }
}

EMERGENCY_ALERTS_DB: List[Dict[str, Any]] = []
SCANS_HISTORY_DB: List[Dict[str, Any]] = []
FARMER_FEEDBACK_DB: List[Dict[str, Any]] = []

def save_scan_history(entry: Dict[str, Any]) -> Dict[str, Any]:
    SCANS_HISTORY_DB.insert(0, entry)
    return entry

def save_feedback(decision_id: str, rating: int, feedback_text: str = "") -> Dict[str, Any]:
    entry = {
        "decision_id": decision_id,
        "rating": rating,
        "feedback_text": feedback_text,
        "timestamp": datetime.now().isoformat()
    }
    FARMER_FEEDBACK_DB.append(entry)
    return entry

def save_scheme(scheme_data: Dict[str, Any]) -> Dict[str, Any]:
    scheme_id = scheme_data.get("scheme_id") or f"scheme_{int(datetime.now().timestamp())}"
    scheme_data["scheme_id"] = scheme_id
    GOVT_SCHEMES_DB[scheme_id] = scheme_data
    return scheme_data

def delete_scheme(scheme_id: str) -> bool:
    if scheme_id in GOVT_SCHEMES_DB:
        del GOVT_SCHEMES_DB[scheme_id]
        return True
    return False

def update_mandi_price(crop: str, price: float, yard: str = "") -> Dict[str, Any]:
    if crop not in MANDI_PRICES_DB:
        MANDI_PRICES_DB[crop] = {
            "nearest_mandi": yard or "Guntur Wholesale Yard",
            "current_price": price,
            "historical_prices": [],
            "projected_7d": price * 1.1,
            "trend": "Rising",
            "optimal_window": "Active Market"
        }
    else:
        MANDI_PRICES_DB[crop]["current_price"] = price
        if yard:
            MANDI_PRICES_DB[crop]["nearest_mandi"] = yard
    return MANDI_PRICES_DB[crop]

def broadcast_alert(alert_data: Dict[str, Any]) -> Dict[str, Any]:
    alert_data["timestamp"] = datetime.now().isoformat()
    EMERGENCY_ALERTS_DB.insert(0, alert_data)
    return alert_data
