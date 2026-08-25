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

# SAMPLE CROP IMAGES DATABASE (SAMPLE_CROP_IMAGES)
SAMPLE_CROP_IMAGES: Dict[str, Dict[str, Any]] = {
    "sample_tomato_early_blight": {
        "id": "sample_tomato_early_blight",
        "name": "Tomato Leaf - Early Blight (Alternaria solani)",
        "crop": "Tomato",
        "disease_name": "Tomato Early Blight (Alternaria solani)",
        "confidence": 0.96,
        "affected_area_pct": 28.0,
        "severity_level": "Moderate",
        "spread_velocity": "Moderate",
        "pesticide": {
            "name": "Mancozeb 75% WP (Indofil M-45)",
            "active_ingredient": "Mancozeb",
            "dosage_per_acre": "600 grams in 200 liters water",
            "dosage_per_liter": "2.0g per 1 liter water",
            "estimated_cost_inr": 380.0,
            "nearby_mandi_availability": True
        },
        "symptoms": [
            "Concentric ring spots (bullseye pattern) on lower leaves",
            "Yellow halo surrounding brown necrotic leaf spots",
            "Defoliation starting from bottom leaves"
        ],
        "cause": "Fungal infection (Alternaria solani) triggered by high humidity and warm temperatures.",
        "immediate_treatment": [
            "Spray Mancozeb 75% WP @ 2.0g/L water (600g in 200L water per acre).",
            "Apply Neem oil (5ml/L) or Trichoderma viride bio-fungicide once every 7 days.",
            "Prune infected bottom leaves and dispose away from the field."
        ],
        "prevention_tips": [
            "Avoid overhead sprinkler irrigation; use drip irrigation.",
            "Maintain proper plant spacing for air circulation.",
            "Practice 3-year crop rotation with non-solanaceous crops."
        ]
    },
    "sample_paddy_rice_blast": {
        "id": "sample_paddy_rice_blast",
        "name": "Paddy Leaf - Rice Blast (Pyricularia oryzae)",
        "crop": "Paddy",
        "disease_name": "Rice Blast & Sheath Blight (Pyricularia oryzae)",
        "confidence": 0.95,
        "affected_area_pct": 32.5,
        "severity_level": "Severe",
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
            "Spindle-shaped lesions with gray-white centers and reddish-brown margins",
            "Neck rot causing empty/whitened panicles",
            "Aggravated by excess nitrogenous fertilizers"
        ],
        "cause": "Fungal infection (Pyricularia oryzae) triggered by 85%+ relative humidity and dew drops.",
        "immediate_treatment": [
            "Spray Tricyclazole 75% WP @ 0.6g/L water during early morning hours.",
            "Pause all Urea/Nitrogenous fertilizer applications for the next 10 days.",
            "Ensure field drainage to reduce humidity levels."
        ],
        "prevention_tips": [
            "Use certified resistant seed varieties (e.g. MTU 1010 / BPT 5204).",
            "Treat seeds with Pseudomonas fluorescens @ 10g/kg before sowing."
        ]
    },
    "sample_chilli_leaf_curl": {
        "id": "sample_chilli_leaf_curl",
        "name": "Chilli Leaf - Leaf Curl Virus",
        "crop": "Chilli",
        "disease_name": "Chilli Leaf Curl Virus (Begomovirus)",
        "confidence": 0.92,
        "affected_area_pct": 24.0,
        "severity_level": "Moderate",
        "spread_velocity": "Moderate",
        "pesticide": {
            "name": "Imidacloprid 17.8% SL (Confidor)",
            "active_ingredient": "Imidacloprid",
            "dosage_per_acre": "100 ml in 200 liters water",
            "dosage_per_liter": "0.5ml per 1 liter water",
            "estimated_cost_inr": 310.0,
            "nearby_mandi_availability": True
        },
        "symptoms": [
            "Upward puckering and curling of leaves",
            "Stunted plant growth and reduced leaf size",
            "Yellowing of veinlets"
        ],
        "cause": "Viral infection transmitted by Whiteflies (Bemisia tabaci).",
        "immediate_treatment": [
            "Spray Imidacloprid 17.8% SL @ 0.5ml/L water to control whitefly vector.",
            "Install yellow sticky traps (15 traps/acre) in the field.",
            "Apply Neem oil 10,000 ppm @ 2ml/L water every 5 days."
        ],
        "prevention_tips": [
            "Remove and destroy virus-infected plants early.",
            "Grow barrier crops like Maize or Sorghum around chilli plots."
        ]
    }
}

# ALL CENTRAL & STATE GOVERNMENT AGRICULTURAL SCHEMES (GOVT_SCHEMES_DB)
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
    },
    "rythu_bharosa": {
        "scheme_id": "rythu_bharosa",
        "title": {
            "te": "వైఎస్సార్ రైతు భరోసా / రాష్ట్ర రైతు సాయం",
            "hi": "राज्य किसान सहायता योजना (रायथु भरोसा)",
            "en": "Rythu Bharosa / Farmer Investment Support Scheme"
        },
        "category": "State Investment Support",
        "financial_benefit": {
            "te": "ఏటా ₹13,500 విత్తనాలు & ఎరువుల పెట్టుబడి సాయం",
            "hi": "₹13,500 प्रति वर्ष (बीज और उर्वरक सहायता)",
            "en": "₹13,500 per year investment support"
        },
        "eligibility": {
            "te": "సొంత సాగుభూమి ఉన్న రైతులు మరియు కౌలు రైతు కుటుంబాలు",
            "hi": "खुद की जमीन वाले किसान और पट्टेदार किसान परिवार",
            "en": "Farmer families cultivating land including tenant farmers"
        },
        "deadline": "Open Year-Round",
        "description": {
            "te": "పంటల విత్తనాలు, ఎరువుల కొనుగోలు సమయానికి ముందే రైతుల బ్యాంక్ ఖాతాల్లో క్రమం తప్పకుండా జమ చేసే పెట్టుబడి సహాయం.",
            "hi": "फसल बोने के समय बीज व खाद खरीदने हेतु वार्षिक प्रत्यक्ष नकद सहायता।",
            "en": "Annual financial grant to farmer families for purchasing quality seeds, fertilizers, and farm inputs."
        },
        "application_link": "https://rythubharosa.ap.gov.in",
        "status": "Active",
        "added_by": "State Agriculture Department"
    },
    "crop_insurance": {
        "scheme_id": "crop_insurance",
        "title": {
            "te": "పీఎం ఫసల్ భీమా యోజన (PMFBY Crop Insurance)",
            "hi": "प्रधानमंत्री फसल बीमा योजना (PMFBY)",
            "en": "PM Fasal Bima Yojana (Crop Insurance)"
        },
        "category": "Crop Insurance & Risk Management",
        "financial_benefit": {
            "te": "వర్షాలు, వరదలు లేదా తెగుళ్ల వల్ల పంట నష్టపోతే 100% బీమా రక్షణ",
            "hi": "100% फसल क्षतिपूर्ति बीमा सुरक्षा",
            "en": "100% financial compensation cover against natural crop losses"
        },
        "eligibility": {
            "te": "వరి, టమాటా, మిరప, పత్తి, జొన్న పంటలు సాగు చేసే రైతులు",
            "hi": "अधिसूचित फसलों की खेती करने वाले सभी किसान",
            "en": "All farmers growing notified Kharif and Rabi crops"
        },
        "deadline": "End of Sowing Season",
        "description": {
            "te": "వర్షాలు, వరదలు, కరువు లేదా తెగుళ్ల వల్ల పంట నష్టం వాటిల్లితే అతితక్కువ ప్రీమియంతో 100% నష్టపరిహార బీమా చెల్లించే పథకం.",
            "hi": "बाढ़, सूखा, अनावृष्टि या बीमारी से फसल क्षति पर पूर्ण नकद मुआवजा।",
            "en": "Comprehensive crop insurance policy providing full financial risk cover against non-preventable natural disasters."
        },
        "application_link": "https://pmfby.gov.in",
        "status": "Active",
        "added_by": "Central Crop Insurance Desk"
    },
    "micro_irrigation": {
        "scheme_id": "micro_irrigation",
        "title": {
            "te": "డ్రిప్ & తుంపర నీటిపారుదల సబ్సిడీ పథకం",
            "hi": "ड्रिप एवं स्प्रिंकलर सिंचाई सब्सिडी योजना",
            "en": "Subsidized Drip & Micro-Irrigation Scheme"
        },
        "category": "Subsidized Machinery & Irrigation",
        "financial_benefit": {
            "te": "డ్రిప్ మరియు స్ప్రリンクలర్ సెట్లపై 80% నుండి 90% ప్రభుత్వ సబ్సిడీ",
            "hi": "ड्रिप सेट पर 80% से 90% तक सरकारी सब्सिडी",
            "en": "80% to 90% government subsidy on Drip & Sprinkler sets"
        },
        "eligibility": {
            "te": "సాగుభూమి మరియు బోరుబావి సౌకర్యం ఉన్న రైతులు",
            "hi": "सिंचाई योग्य भूमि वाले सभी किसान",
            "en": "All farmers having agricultural land with water source"
        },
        "deadline": "Open Year-Round",
        "description": {
            "te": "నీటి కొరత అధిగమించడానికి డ్రిప్ నీటిపారుదల పరికరాల కొనుగోలుపై 90% సబ్సిడీ అందించే ఉద్యానవన శాఖ పథకం.",
            "hi": "पानी की बचत और पैदावार बढ़ाने के लिए ड्रिप सिंचाई उपकरण पर 90% सब्सिडी।",
            "en": "Horticulture department scheme providing up to 90% financial subsidy for drip/sprinkler micro-irrigation systems."
        },
        "application_link": "https://pmksy.gov.in",
        "status": "Active",
        "added_by": "Horticulture Department"
    },
    "kisan_credit_card": {
        "scheme_id": "kisan_credit_card",
        "title": {
            "te": "కిసాన్ క్రెడిట్ కార్డ్ (KCC 4% రాయితీ రుణాలు)",
            "hi": "किसान क्रेडिट कार्ड (KCC 4% ब्याज ऋण)",
            "en": "Kisan Credit Card (KCC 4% Interest Agri Loan)"
        },
        "category": "Direct Income Support",
        "financial_benefit": {
            "te": "రూ. 3 లక్షల వరకు కేవలం 4% వార్షిక వడ్డీకే పంట రుణం",
            "hi": "₹3 लाख तक केवल 4% ब्याज पर कृषि ऋण",
            "en": "Concessional crop loan up to ₹3 Lakh at 4% effective interest rate"
        },
        "eligibility": {
            "te": "రైతులు, కౌలు రైతులు మరియు పశుపోషకులు",
            "hi": "किसान, पट्टेदार किसान और पशुपालक",
            "en": "All farmers, tenant cultivators, and animal husbandry farmers"
        },
        "deadline": "Open Year-Round",
        "description": {
            "te": "పంట పెట్టుబడి కోసం బ్యాంకుల ద్వారా ఎటువంటి హామీ లేకుండా రూ. 3 లక్షల వరకు అతితక్కువ 4% వడ్డీకే పంట రుణాలు లభించే పథకం.",
            "hi": "बिना किसी गारंटी के ₹3 लाख तक का सस्ता कृषि ऋण प्रदान करने वाली योजना।",
            "en": "Government scheme providing hassle-free, low-interest crop credit up to ₹3 Lakh through nationalized banks."
        },
        "application_link": "https://sbi.co.in/kcc",
        "status": "Active",
        "added_by": "NABARD & Banking Division"
    },
    "pm_kusum": {
        "scheme_id": "pm_kusum",
        "title": {
            "te": "పీఎం కుసుమ్ సోలార్ అగ్రికల్చర్ పంప్ స్కీమ్",
            "hi": "पीएम कुसुम सोलर पंप योजना",
            "en": "PM-KUSUM Solar Irrigation Pump Scheme"
        },
        "category": "Subsidized Machinery & Irrigation",
        "financial_benefit": {
            "te": "సోలార్ పంప్‌సెట్ల ఏర్పాటుపై 60% సబ్సిడీ (ఉచిత పగటిపూటి కరెంట్)",
            "hi": "सोलर पंप पर 60% सरकारी सब्सिडी",
            "en": "60% government subsidy for solar irrigation pumps"
        },
        "eligibility": {
            "te": "వ్యవసాయ విద్యుత్ కనెక్షన్ లేని లేదా విద్యుత్ కోతలు ఉన్న రైతులు",
            "hi": "सभी किसान और कृषि समूह",
            "en": "Individual farmers, water user associations, and cooperatives"
        },
        "deadline": "Open Year-Round",
        "description": {
            "te": "పొలాల్లో డీజిల్ మరియు విద్యుత్ మోటార్లకు బదులుగా పగటిపూట ఉచిత కరెంట్‌తో నడిచే సోలార్ పంప్‌సెట్లపై 60% సబ్సిడీ.",
            "hi": "मुफ्त सौर ऊर्जा से सिंचाई पंप चलाने हेतु 60% सब्सिडी प्रोत्साहन योजना।",
            "en": "Central scheme subsidizing 60% of solar pump costs to enable reliable daytime irrigation for farmers."
        },
        "application_link": "https://pmkusum.mnre.gov.in",
        "status": "Active",
        "added_by": "Ministry of New & Renewable Energy"
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
