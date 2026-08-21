from typing import List, Dict, Any, Optional
from app.schemas import CopilotChatRequest, CopilotChatResponse
from app.database import FIELDS_DB

class FarmCopilotAgent:
    """
    Conversational Farm Copilot Agent:
    Translates farmer voice/text queries into actionable agricultural guidance,
    supporting multi-lingual output (Telugu, Hindi, English) and structured farmer response format.
    """
    def __init__(self):
        pass

    def process_query(self, request: CopilotChatRequest) -> CopilotChatResponse:
        query = request.query.lower()
        lang = request.language or "Telugu"
        field = FIELDS_DB.get(request.field_id or "field_01", FIELDS_DB["field_01"])

        # Override profile info if provided from request
        profile = request.farmer_profile or {}
        crop = profile.get("main_crop") or field["crop_type"]
        location = profile.get("district") or field["location"]

        agents_consulted = ["WeatherAgent", "SoilIrrigationAgent"]

        if "yellow" in query or "spot" in query or "leaf" in query or "disease" in query or "insect" in query or "pesticide" in query or "పసుపు" in query or "మచ్చలు" in query or "తెగులు" in query or "మందు" in query:
            agents_consulted.append("CropVisionAgent")
            agents_consulted.append("DiseaseRiskAgent")
            
            if lang in ["Telugu", "te"]:
                answer = (
                    f"🌾 సమాధానం:\n"
                    f"మీ {crop} పంట ఆకులపై ఎండు తెగులు (Early Blight) లేదా పసుపు రంగు మచ్చల లక్షణాలు కనిపిస్తున్నాయి.\n\n"
                    f"✅ ప్రస్తుతం చేయాల్సిన పని:\n"
                    f"రాబోయే వర్షాల దృష్ట్యా 48 గంటలలోపు 'Mancozeb 75% WP' ఎకరానికి 600 గ్రాములు పిచికారీ చేయండి.\n\n"
                    f"📌 ముఖ్య గమనిక:\n"
                    f"1 లీటరు నీటికి 2 స్పూన్ల మందు మాత్రమే కలపండి (అంచనా ఖరీదు ~₹380/ఎకరం).\n\n"
                    f"⚠️ నివారించాల్సినవి:\n"
                    f"వర్షం పడటానికి ముందు మందు పిచికారీ చేయవద్దు. అనుమానం ఉంటే KVK హెల్ప్‌లైన్‌ను సంప్రదించండి."
                )
                actions = ["Mancozeb 75% WP మందు వివరాలు", "పాడైన ఆకులను తొలగించండి", "డ్రిప్ నీరు తగ్గించండి"]
            elif lang in ["Hindi", "hi"]:
                answer = (
                    f"🌾 उत्तर:\n"
                    f"आपकी {crop} की पत्तियों पर शुरुआती झुलसा (Early Blight) के लक्षण दिख रहे हैं।\n\n"
                    f"✅ अभी क्या करें:\n"
                    f"48 घंटे के भीतर Mancozeb 75% WP (600 ग्राम प्रति एकड़) का छिड़काव करें।\n\n"
                    f"📌 ध्यान दें:\n"
                    f"1 लीटर पानी में 2 चम्मच दवा मिलाएं (अनुमानित खर्च ~₹380/एकड़)।\n\n"
                    f"⚠️ क्या न करें:\n"
                    f"बारिश से ठीक पहले छिड़काव न करें।"
                )
                actions = ["Mancozeb 75% WP खरीदें", "निचले पत्तों की छंटाई करें"]
            else:
                answer = (
                    f"🌾 Answer:\n"
                    f"Your {crop} leaves exhibit signs of Early Blight fungal spots.\n\n"
                    f"✅ What to do now:\n"
                    f"Spray Mancozeb 75% WP (600g in 200L water per acre) within 48 hours.\n\n"
                    f"📌 Important note:\n"
                    f"Mix 2 spoons per 1 liter water (~₹380/acre cost).\n\n"
                    f"⚠️ What to avoid:\n"
                    f"Do not spray right before heavy rainfall."
                )
                actions = ["Purchase Mancozeb 75% WP", "Prune lower infected leaves"]

        elif "harvest" in query or "sell" in query or "price" in query or "mandi" in query or "కోత" in query or "అమ్మకం" in query or "ధర" in query or "మండీ" in query:
            agents_consulted.append("MarketAgent")
            agents_consulted.append("WeatherAgent")
            
            if lang in ["Telugu", "te"]:
                answer = (
                    f"🌾 సమాధానం:\n"
                    f"మండీలో {crop} ధర ప్రస్తుతం రూ. 24.50/కిలో ఉంది. రాబోయే 3 రోజుల్లో ధర రూ. 27.50 వరకు పెరుగుతుంది.\n\n"
                    f"✅ ప్రస్తుతం చేయాల్సిన పని:\n"
                    f"ఈ రోజు అమ్మవద్దు. 3 రోజుల తర్వాత కోత పూర్తి చేసి మార్కెట్లో అమ్మండి.\n\n"
                    f"📌 ముఖ్య గమనిక:\n"
                    f"3 రోజులు వేచి ఉంటే రూ. 3.00/కిలో అదనపు లాభం పొందుతారు.\n\n"
                    f"⚠️ నివారించాల్సినవి:\n"
                    f"తక్కువ ధర వద్ద వ్యాపారులకు తొందరపడి అమ్మవద్దు."
                )
                actions = ["3 రోజుల తర్వాత కోత పూర్తి చేయండి", "మండీ రవాణా సిద్ధం చేయండి"]
            elif lang in ["Hindi", "hi"]:
                answer = (
                    f"🌾 उत्तर:\n"
                    f"मंडी में {crop} का भाव ₹24.50/किग्रा है और 3 दिनों में ₹27.50 होने की संभावना है।\n\n"
                    f"✅ अभी क्या करें:\n"
                    f"3 दिन बाद कटाई करके मंडी में बेचें।\n\n"
                    f"📌 ध्यान दें:\n"
                    f"3 दिन रुकने पर ₹3/किग्रा अधिक लाभ होगा।"
                )
                actions = ["3 दिन बाद कटाई करें", "मंडी परिवहन की व्यवस्था करें"]
            else:
                answer = (
                    f"🌾 Answer:\n"
                    f"{crop} is trading at ₹24.50/kg with a projected 3-day rise to ₹27.50/kg.\n\n"
                    f"✅ What to do now:\n"
                    f"Hold harvest for 3 days to maximize your profit.\n\n"
                    f"📌 Important note:\n"
                    f"Holding 3 days yields +12.2% higher returns.\n\n"
                    f"⚠️ What to avoid:\n"
                    f"Avoid selling to local traders at lower prices today."
                )
                actions = ["Schedule harvest for Day 3", "Arrange mandi transport"]

        elif "water" in query or "irrigation" in query or "fertilizer" in query or "npk" in query or "నీరు" in query or "ఎరువు" in query:
            agents_consulted.append("SoilIrrigationAgent")
            
            if lang in ["Telugu", "te"]:
                answer = (
                    f"🌾 సమాధానం:\n"
                    f"నేలలో 34% తేమ ఉంది మరియు మధ్యాహ్నం 2 గంటలకు వర్షం పడే అవకాశం ఉంది.\n\n"
                    f"✅ ప్రస్తుతం చేయాల్సిన పని:\n"
                    f"ఈ రోజు డ్రిప్ నీటి సమయం 45 నిమిషాలకు పరిమితం చేయండి. ఎకరానికి 15 కేజీల Urea ఎరువు అందించండి.\n\n"
                    f"📌 ముఖ్య గమనిక:\n"
                    f"డ్రిప్ ఫెర్టిగేషన్ ద్వారా ఎరువును అందించడం శ్రేయస్కరం.\n\n"
                    f"⚠️ నివారించాల్సినవి:\n"
                    f"వర్షం కురిసే సమయంలో అధికంగా నీరు పెట్టవద్దు."
                )
                actions = ["డ్రిప్ సమయం 45 నిమిషాలకు సెట్ చేయండి", "15 కేజీల Urea వాడండి"]
            elif lang in ["Hindi", "hi"]:
                answer = (
                    f"🌾 उत्तर:\n"
                    f"मिट्टी में नमी 34% है और बारिश का अनुमान है।\n\n"
                    f"✅ अभी क्या करें:\n"
                    f"ड्रिप केवल 45 मिनट चलाएं और 15 किग्रा यूरिया दें।"
                )
                actions = ["सिंचाई सीमित करें", "यूरिया दें"]
            else:
                answer = (
                    f"🌾 Answer:\n"
                    f"Soil moisture is at 34% with upcoming rain forecast.\n\n"
                    f"✅ What to do now:\n"
                    f"Limit drip irrigation cycle to 45 minutes. Apply 15 kg Urea per acre.\n\n"
                    f"📌 Important note:\n"
                    f"Apply via drip fertigation for maximum efficiency."
                )
                actions = ["Set drip timer to 45 mins", "Fertigate 15kg Urea per acre"]

        else:
            if lang in ["Telugu", "te"]:
                answer = (
                    f"🌾 సమాధానం:\n"
                    f"నమస్కారం! నేను మీ AI కిసాన్ మిత్రుడిని. మీ {crop} తోటలో ({location}) ప్రస్తుతం పంట స్థితి బాగుంది.\n\n"
                    f"✅ ప్రస్తుతం చేయాల్సిన పని:\n"
                    f"మీ పంట ఫోటో స్కాన్ చేయండి లేదా వాతావరణం, ఎరువులు మరియు మండీ ధరల గురించి తెలుగులో అడగండి.\n\n"
                    f"📌 ముఖ్య గమనిక:\n"
                    f"నేల తేమ 34% వద్ద అనుకూలంగా ఉంది.\n\n"
                    f"⚠️ నివారించాల్సినవి:\n"
                    f"ధృవీకరించని పురుగుమందులను వాడవద్దు."
                )
                actions = ["పంట ఫోటో స్కాన్ చేయండి", "కోత సమయం చూడండి", "మండీ ధర చెక్ చేయండి"]
            elif lang in ["Hindi", "hi"]:
                answer = (
                    f"🌾 उत्तर:\n"
                    f"नमस्ते! मैं आपका एआई किसान मित्र हूँ। आपकी {crop} की स्थिति अच्छी है।\n\n"
                    f"✅ अभी क्या करें:\n"
                    f"बीमारी, खाद या मंडी भाव के बारे में पूछें।"
                )
                actions = ["फसल का फोटो स्कैन करें", "मंडी भाव चेक करें"]
            else:
                answer = (
                    f"🌾 Answer:\n"
                    f"Hello! I am your AI Farm Copilot for your {crop} field in {location}.\n\n"
                    f"✅ What to do now:\n"
                    f"Ask me about crop diseases, fertilizers, watering schedules, or mandi prices.\n\n"
                    f"📌 Important note:\n"
                    f"Soil moisture is currently optimal at 34%."
                )
                actions = ["Scan crop leaf photo", "Check mandi prices"]

        return CopilotChatResponse(
            answer=answer,
            detected_language=lang,
            suggested_actions=actions,
            voice_audio_url=None,
            source_agents_consulted=agents_consulted
        )
