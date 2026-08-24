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

# VERIFIED GOVERNMENT OFFICERS & HELPLINE CONTACTS DATABASE (OFFICER_CONTACTS_DB)
OFFICER_CONTACTS_DB: Dict[str, Dict[str, Any]] = {
    "kisan_helpline": {
        "contact_id": "kisan_helpline",
        "category": "Kisan Call Centre",
        "designation": "Kisan Call Centre National Helpline",
        "officer_name": "Toll-Free Agricultural Support Desk",
        "department": "Ministry of Agriculture & Farmers Welfare, Govt. of India",
        "phone": "18001801551",
        "phone_display": "1800-180-1551",
        "state": "All India",
        "district": "All Districts",
        "mandal": "All Mandals",
        "village": "All Villages",
        "services": {
            "te": "పంటల తెగుళ్లు, విత్తనాలు, ఎరువులు, వాతావరణం మరియు మార్కెట్ ధరలపై 24/7 ఉచిత సలహాలు.",
            "hi": "फसल कीट, बीज, उर्वरक, मौसम और मंडी भाव पर 24/7 नि:शुल्क सलाह।",
            "en": "24/7 Toll-Free expert advice on crop diseases, seeds, fertilizers, weather & mandi prices."
        },
        "is_verified": True,
        "status": "Active"
    },
    "agri_assistant_mangalagiri": {
        "contact_id": "agri_assistant_mangalagiri",
        "category": "Agriculture / Horticulture Assistant",
        "designation": "Village Agriculture Assistant (VAA)",
        "officer_name": "కే. సురేష్ కుమార్ (K. Suresh Kumar)",
        "department": "Department of Agriculture, Govt. of AP",
        "phone": "+91 94401 23456",
        "phone_display": "9440123456",
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "mandal": "Mangalagiri",
        "village": "Mangalagiri",
        "services": {
            "te": "విత్తనాల పంపిణీ, ఇ-పంట నమొదు, ఉచిత ఎరువుల టోకెన్లు మరియు క్షేత్రస్థాయి పంట పరిశీలన.",
            "hi": "बीज वितरण, ई-फसल पंजीकरण, उर्वरक कूपन और खेत निरीक्षण।",
            "en": "Seed distribution, e-crop registration, fertilizer coupons & field inspection."
        },
        "is_verified": True,
        "status": "Active"
    },
    "horti_assistant_mangalagiri": {
        "contact_id": "horti_assistant_mangalagiri",
        "category": "Agriculture / Horticulture Assistant",
        "designation": "Village Horticulture Assistant (VHA)",
        "officer_name": "పి. శ్రీనివాసరావు (P. Srinivasa Rao)",
        "department": "Department of Horticulture, Govt. of AP",
        "phone": "+91 94402 34567",
        "phone_display": "9440234567",
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "mandal": "Mangalagiri",
        "village": "Mangalagiri",
        "services": {
            "te": "టమాటా, మిరప తోటల సబ్సిడీలు, డ్రిప్ సబ్సిడీ దరఖాస్తులు మరియు తెగుళ్ల నివారణ.",
            "hi": "टमाटर, मिर्च नर्सरी सब्सिडी, ड्रिप उपकरण और कीट नियंत्रण।",
            "en": "Tomato & chilli nursery subsidies, drip irrigation equipment & pest control."
        },
        "is_verified": True,
        "status": "Active"
    },
    "surveyor_mangalagiri": {
        "contact_id": "surveyor_mangalagiri",
        "category": "Village Surveyor",
        "designation": "Village Land Surveyor",
        "officer_name": "యం. వెంకటేశ్వర్లు (M. Venkateswarlu)",
        "department": "Survey, Settlements & Land Records Dept",
        "phone": "+91 94403 45678",
        "phone_display": "9440345678",
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "mandal": "Mangalagiri",
        "village": "Mangalagiri",
        "services": {
            "te": "సాగుభూమి సరిహద్దుల కొలతలు, రీ-సర్వే పటాలు మరియు భూమి హద్దు వివాదాల పరిష్కారం.",
            "hi": "कृषि भूमि सीमा माप, सर्वेक्षण मानचित्र और भूमि विवाद समाधान।",
            "en": "Agricultural land boundary survey, resurvey maps & land dispute measurement."
        },
        "is_verified": True,
        "status": "Active"
    },
    "ao_mangalagiri": {
        "contact_id": "ao_mangalagiri",
        "category": "Agriculture Officer",
        "designation": "Mandal Agriculture Officer (MAO)",
        "officer_name": "డా. ఆర్. లక్ష్మీ నారాయణ (Dr. R. Lakshmi Narayana)",
        "department": "Mandal Agriculture Office, Mangalagiri",
        "phone": "+91 94404 56789",
        "phone_display": "9440456789",
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "mandal": "Mangalagiri",
        "village": "Mangalagiri",
        "services": {
            "te": "పీఎం కిసాన్ నిధుల మంజూరు, పంట నష్టపరిహార ధృవీకరణ మరియు ఇన్పుట్ సబ్సిడీ ఆమోదం.",
            "hi": "पीएम किसान फंड स्वीकृति, फसल क्षतिपूर्ति सत्यापन और सब्सिडी मंजूरी।",
            "en": "PM-KISAN fund approval, crop loss damage verification & input subsidy authorization."
        },
        "is_verified": True,
        "status": "Active"
    },
    "vro_mangalagiri": {
        "contact_id": "vro_mangalagiri",
        "category": "VRO (Village Revenue Officer)",
        "designation": "Village Revenue Officer (VRO)",
        "officer_name": "సిహెచ్. రాంబాబు (Ch. Rambabu)",
        "department": "Revenue Department, Govt. of AP",
        "phone": "+91 94405 67890",
        "phone_display": "9440567890",
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "mandal": "Mangalagiri",
        "village": "Mangalagiri",
        "services": {
            "te": "పట్టాదార్ పాస్ పుస్తకాలు, అడంగల్ / 1-B నకళ్లు, కౌలు రైతు గుర్తింపు కార్డులు (CCRC).",
            "hi": "पट्टादार पासबुक, अडंगल/1-बी प्रतिलेख और पट्टेदार किसान पहचान पत्र (CCRC)।",
            "en": "Pattadar passbooks, Adangal/1-B extracts & Tenant Farmer CCRC identity cards."
        },
        "is_verified": True,
        "status": "Active"
    },
    "mri_mangalagiri": {
        "contact_id": "mri_mangalagiri",
        "category": "MRI (Mandal Revenue Inspector)",
        "designation": "Mandal Revenue Inspector (MRI)",
        "officer_name": "జి. శేషగిరిరావు (G. Seshagiri Rao)",
        "department": "Tahsildar Revenue Office, Mangalagiri",
        "phone": "+91 94406 78901",
        "phone_display": "9440678901",
        "state": "Andhra Pradesh",
        "district": "Guntur",
        "mandal": "Mangalagiri",
        "village": "Mangalagiri",
        "services": {
            "te": "వరదలు / కరువు నష్టపరిహార నివేదికలు, రెవెన్యూ విచారణ మరియు పరిహారం లబ్దిదారుల ఆమోదం.",
            "hi": "बाढ़/सूखा राहत सत्यापन, राजस्व जांच और मुआवजा मंजूरी।",
            "en": "Flood/drought disaster damage inspection, revenue enquiry & relief verification."
        },
        "is_verified": True,
        "status": "Active"
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
            "dosage_per_acre": "120 grams in 200 liters water",
            "dosage_per_liter": "0.6g per 1 liter water",
            "estimated_cost_inr": 420.0,
            "nearby_mandi_availability": True
        },
        "symptoms": [
          "Spindle-shaped lesions with gray-white centers",
          "Neck rot causing empty panicles",
          "Aggravated by excess nitrogenous fertilizers"
        ],
        "cause": "Fungal infection (Pyricularia oryzae) triggered by 85%+ relative humidity and dew drop accumulation.",
        "immediate_treatment": [
            "Spray Tricyclazole 75% WP @ 0.6g/L water during early morning hours.",
            "Pause all Urea/Nitrogenous fertilizer applications for the next 10 days.",
            "Ensure field drainage to reduce humidity levels."
        ],
        "prevention_tips": [
            "Use certified resistant seed varieties (e.g. MTU 1010 / BPT 5204).",
            "Treat seeds with Pseudomonas fluorescens @ 10g/kg before sowing."
        ],
        "dosage_note": "60 grams per 100 liters of water."
    }
}

GOVT_SCHEMES_DB: Dict[str, Dict[str, Any]] = {
    "pm_kisan": {
        "scheme_id": "pm_kisan",
        "title": {
            "te": "పీఎం కిసాన్ సమ్మాన్ నిధి పథకం (PM-KISAN)",
            "hi": "पीएम किसान सम्मान निधि योजना",
            "en": "PM-KISAN Samman Nidhi Scheme"
        },
        "category": "Direct Income Support",
        "financial_benefit": {
            "te": "ఏటా ₹6,000 (3 విడతలలో రూ. 2,000 చొప్పున బ్యాంక్ ఖాతాలో జమ)",
            "hi": "₹6,000 प्रति वर्ष (3 किस्तों में)",
            "en": "₹6,000 per year (3 installments of ₹2,000)"
        },
        "eligibility": {
            "te": "భారతదేశంలో సాగుభూమి ఉన్న చిన్న మరియు కమతాల రైతు కుటుంబాలు",
            "hi": "भारत में कृषि योग्य भूमि वाले सभी किसान परिवार",
            "en": "All landholding farmer families across India"
        },
        "deadline": "Open Year-Round",
        "description": {
            "te": "చిన్న మరియు చిన్నకారు రైతు కుటుంబాలకు ఏటా ₹6,000 ఆర్థిక సహాయం నేరుగా బ్యాంక్ ఖాతాలో జమ చేసే కేంద్ర ప్రభుత్వ పథకం.",
            "hi": "छोटे और सीमांत किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष वित्तीय सहायता।",
            "en": "Central Government scheme providing ₹6,000 annual direct income support to landholding farmer families."
        },
        "application_link": "https://pmkisan.gov.in",
        "status": "Active",
        "added_by": "Central Agriculture Ministry"
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

def save_officer_contact(contact: Dict[str, Any]) -> Dict[str, Any]:
    c_id = contact.get("contact_id") or f"contact_{int(datetime.now().timestamp())}"
    contact["contact_id"] = c_id
    contact["status"] = contact.get("status", "Active")
    contact["is_verified"] = contact.get("is_verified", True)
    OFFICER_CONTACTS_DB[c_id] = contact
    return contact

def delete_officer_contact(contact_id: str) -> bool:
    if contact_id in OFFICER_CONTACTS_DB:
        del OFFICER_CONTACTS_DB[contact_id]
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
