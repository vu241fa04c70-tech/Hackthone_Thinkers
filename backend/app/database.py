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

# REGIONAL AREA-SPECIFIC MANDI PRICES DATABASE (AREA_MANDI_PRICES_DB)
AREA_MANDI_PRICES_DB: Dict[str, Dict[str, Dict[str, Any]]] = {
    "guntur": {
        "Tomato": {
            "crop": "Tomato",
            "area": "Guntur",
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
            "crop": "Paddy",
            "area": "Guntur",
            "nearest_mandi": "Guntur Wholesale Yard",
            "current_price": 2320.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 2100},
                {"date": "14 Aug", "price": 2200},
                {"date": "18 Aug", "price": 2280},
                {"date": "21 Aug", "price": 2320}
            ],
            "projected_7d": 2580.0,
            "trend": "Rising",
            "optimal_window": "Hold harvest 3 days (+Rs 300/qtl gain)"
        },
        "Chilli": {
            "crop": "Chilli",
            "area": "Guntur",
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
        },
        "Cotton": {
            "crop": "Cotton",
            "area": "Guntur",
            "nearest_mandi": "Guntur Wholesale Yard",
            "current_price": 7200.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 6800},
                {"date": "14 Aug", "price": 6950},
                {"date": "18 Aug", "price": 7100},
                {"date": "21 Aug", "price": 7200}
            ],
            "projected_7d": 7600.0,
            "trend": "Rising",
            "optimal_window": "Optimal selling window active"
        }
    },
    "mangalagiri": {
        "Tomato": {
            "crop": "Tomato",
            "area": "Mangalagiri",
            "nearest_mandi": "Guntur Wholesale Yard",
            "current_price": 2450.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 2100},
                {"date": "14 Aug", "price": 2250},
                {"date": "18 Aug", "price": 2400},
                {"date": "21 Aug", "price": 2520}
            ],
            "projected_7d": 2750.0,
            "trend": "Rising",
            "optimal_window": "Harvest in 3 days (Pre-Rain Gain)"
        },
        "Chilli": {
            "crop": "Chilli",
            "area": "Mangalagiri",
            "nearest_mandi": "Guntur Mirchi Yard",
            "current_price": 18500.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 17200},
                {"date": "18 Aug", "price": 18100},
                {"date": "21 Aug", "price": 18500}
            ],
            "projected_7d": 19800.0,
            "trend": "Rising",
            "optimal_window": "Optimal selling window active"
        }
    },
    "vijayawada": {
        "Tomato": {
            "crop": "Tomato",
            "area": "Vijayawada",
            "nearest_mandi": "Vijayawada APMC Market",
            "current_price": 2380.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 2050},
                {"date": "14 Aug", "price": 2180},
                {"date": "18 Aug", "price": 2290},
                {"date": "21 Aug", "price": 2380}
            ],
            "projected_7d": 2620.0,
            "trend": "Rising",
            "optimal_window": "Harvest in 3 days (Pre-Rain Gain)"
        },
        "Paddy": {
            "crop": "Paddy",
            "area": "Vijayawada",
            "nearest_mandi": "Vijayawada APMC Market",
            "current_price": 2350.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 2100},
                {"date": "14 Aug", "price": 2220},
                {"date": "18 Aug", "price": 2300},
                {"date": "21 Aug", "price": 2350}
            ],
            "projected_7d": 2610.0,
            "trend": "Rising",
            "optimal_window": "Hold harvest 3 days (+Rs 300/qtl gain)"
        },
        "Maize": {
            "crop": "Maize",
            "area": "Vijayawada",
            "nearest_mandi": "Vijayawada APMC Market",
            "current_price": 2150.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 1950},
                {"date": "14 Aug", "price": 2020},
                {"date": "18 Aug", "price": 2100},
                {"date": "21 Aug", "price": 2150}
            ],
            "projected_7d": 2320.0,
            "trend": "Rising",
            "optimal_window": "Optimal selling window active"
        }
    },
    "hyderabad": {
        "Tomato": {
            "crop": "Tomato",
            "area": "Hyderabad",
            "nearest_mandi": "Hyderabad Bowenpally Market",
            "current_price": 2650.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 2300},
                {"date": "14 Aug", "price": 2450},
                {"date": "18 Aug", "price": 2580},
                {"date": "21 Aug", "price": 2650}
            ],
            "projected_7d": 2900.0,
            "trend": "Rising",
            "optimal_window": "Harvest in 3 days (Pre-Rain Gain)"
        },
        "Chilli": {
            "crop": "Chilli",
            "area": "Hyderabad",
            "nearest_mandi": "Hyderabad Bowenpally Market",
            "current_price": 19200.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 18000},
                {"date": "14 Aug", "price": 18600},
                {"date": "18 Aug", "price": 18900},
                {"date": "21 Aug", "price": 19200}
            ],
            "projected_7d": 20500.0,
            "trend": "Rising",
            "optimal_window": "Optimal selling window active"
        },
        "Onion": {
            "crop": "Onion",
            "area": "Hyderabad",
            "nearest_mandi": "Hyderabad Bowenpally Market",
            "current_price": 1850.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 1600},
                {"date": "14 Aug", "price": 1720},
                {"date": "18 Aug", "price": 1800},
                {"date": "21 Aug", "price": 1850}
            ],
            "projected_7d": 2100.0,
            "trend": "Rising",
            "optimal_window": "Optimal selling window active"
        }
    },
    "karimnagar": {
        "Paddy": {
            "crop": "Paddy",
            "area": "Karimnagar",
            "nearest_mandi": "Karimnagar APMC Market",
            "current_price": 2380.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 2120},
                {"date": "14 Aug", "price": 2240},
                {"date": "18 Aug", "price": 2320},
                {"date": "21 Aug", "price": 2380}
            ],
            "projected_7d": 2680.0,
            "trend": "Rising",
            "optimal_window": "Hold harvest 3 days (+Rs 300/qtl gain)"
        },
        "Maize": {
            "crop": "Maize",
            "area": "Karimnagar",
            "nearest_mandi": "Karimnagar APMC Market",
            "current_price": 2200.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 1980},
                {"date": "14 Aug", "price": 2080},
                {"date": "18 Aug", "price": 2150},
                {"date": "21 Aug", "price": 2200}
            ],
            "projected_7d": 2400.0,
            "trend": "Rising",
            "optimal_window": "Optimal selling window active"
        }
    },
    "nashik": {
        "Onion": {
            "crop": "Onion",
            "area": "Nashik",
            "nearest_mandi": "Nashik Pimpalgaon Yard",
            "current_price": 2100.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 1800},
                {"date": "14 Aug", "price": 1950},
                {"date": "18 Aug", "price": 2040},
                {"date": "21 Aug", "price": 2100}
            ],
            "projected_7d": 2400.0,
            "trend": "Rising",
            "optimal_window": "Optimal selling window active"
        },
        "Tomato": {
            "crop": "Tomato",
            "area": "Nashik",
            "nearest_mandi": "Nashik Pimpalgaon Yard",
            "current_price": 2150.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 1850},
                {"date": "14 Aug", "price": 1980},
                {"date": "18 Aug", "price": 2080},
                {"date": "21 Aug", "price": 2150}
            ],
            "projected_7d": 2420.0,
            "trend": "Rising",
            "optimal_window": "Harvest in 3 days (Pre-Rain Gain)"
        }
    },
    "ludhiana": {
        "Wheat": {
            "crop": "Wheat",
            "area": "Ludhiana",
            "nearest_mandi": "Ludhiana APMC Yard",
            "current_price": 2275.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 2150},
                {"date": "14 Aug", "price": 2200},
                {"date": "18 Aug", "price": 2240},
                {"date": "21 Aug", "price": 2275}
            ],
            "projected_7d": 2450.0,
            "trend": "Rising",
            "optimal_window": "Optimal selling window active"
        },
        "Paddy": {
            "crop": "Paddy",
            "area": "Ludhiana",
            "nearest_mandi": "Ludhiana APMC Yard",
            "current_price": 2450.0,
            "historical_prices": [
                {"date": "10 Aug", "price": 2250},
                {"date": "14 Aug", "price": 2340},
                {"date": "18 Aug", "price": 2400},
                {"date": "21 Aug", "price": 2450}
            ],
            "projected_7d": 2700.0,
            "trend": "Rising",
            "optimal_window": "Hold harvest 3 days (+Rs 300/qtl gain)"
        }
    }
}

MANDI_PRICES_DB: Dict[str, Dict[str, Any]] = AREA_MANDI_PRICES_DB["guntur"]

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
    }
}

SAMPLE_CROP_IMAGES: Dict[str, Dict[str, Any]] = {}
GOVT_SCHEMES_DB: Dict[str, Dict[str, Any]] = {}

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

def get_mandi_prices_by_area(area_name: str = "Guntur") -> Dict[str, Dict[str, Any]]:
    low_area = area_name.lower().split(",")[0].strip()
    if low_area in AREA_MANDI_PRICES_DB:
        return AREA_MANDI_PRICES_DB[low_area]
    
    # Return default Guntur if area is missing
    return AREA_MANDI_PRICES_DB["guntur"]

def update_mandi_price(crop: str, price: float, yard: str = "", area: str = "Guntur") -> Dict[str, Any]:
    low_area = area.lower().split(",")[0].strip()
    if low_area not in AREA_MANDI_PRICES_DB:
        AREA_MANDI_PRICES_DB[low_area] = {}

    area_dict = AREA_MANDI_PRICES_DB[low_area]

    if crop not in area_dict:
        area_dict[crop] = {
            "crop": crop,
            "area": area,
            "nearest_mandi": yard or f"{area} APMC Market",
            "current_price": price,
            "historical_prices": [],
            "projected_7d": price * 1.1,
            "trend": "Rising",
            "optimal_window": "Active Market"
        }
    else:
        area_dict[crop]["current_price"] = price
        if yard:
            area_dict[crop]["nearest_mandi"] = yard

    return area_dict[crop]
