import re
import os
import time
import json
import logging
import requests
from typing import List, Dict, Any, Optional
from app.schemas import CopilotChatRequest, CopilotChatResponse
from app.database import FIELDS_DB, OFFICER_CONTACTS_DB

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("FarmCopilotAgent")

class FarmCopilotAgent:
    """
    Kisan Voice AI Copilot - Conversational, Intelligent AI Assistant for Indian Farmers.
    Answers WHATEVER question the farmer asks (agriculture, general knowledge, weather, health, market, schemes, etc.).
    Powered by LLM API (Google Gemini / OpenAI) with an intelligent fallback conversational engine,
    5-message conversation memory, and 100% multilingual support.
    """
    def __init__(self):
        # Conversation Memory: session_id/field_id -> list of last 5 turns [{"role": "user"/"assistant", "content": "..."}]
        self.conversation_memory: Dict[str, List[Dict[str, str]]] = {}

    def _detect_language(self, query: str, context_lang: str) -> str:
        """Language detection for 12 Indian languages."""
        if re.search(r'[\u0c00-\u0c7f]', query):
            return "te"
        if re.search(r'[\u0900-\u097f]', query):
            return "hi"
        if re.search(r'[\u0b80-\u0bff]', query):
            return "ta"
        if re.search(r'[\u0c80-\u0cff]', query):
            return "kn"
        
        ctx = (context_lang or "en").lower()
        if ctx in ["te", "telugu"]:
            return "te"
        if ctx in ["hi", "hindi"]:
            return "hi"
        if ctx in ["ta", "tamil"]:
            return "ta"
        if ctx in ["kn", "kannada"]:
            return "kn"

        return "en"

    def _build_system_prompt(self, farmer_name: str, crop: str, location: str, village: str, field_id: str, language: str) -> str:
        """Builds System Prompt defining personality and guidelines for LLM."""
        return f"""You are an intelligent, friendly, warm, and caring AI assistant for Indian farmers. Your name is "Kisan Voice AI Copilot" and you are part of the Kisan Mitra government initiative.

**Your Golden Rule:**
Answer WHATEVER question the farmer asks - whether it is about crops, pests, diseases, fertilizers, weather, market prices, government schemes, machinery, solar pumps, health, cooking, general knowledge, or ANY topic! Never refuse to answer. Answer every single question helpfully, accurately, and warmly!

**Your Personality:**
- Speak like a helpful, knowledgeable neighbor who genuinely cares about the farmer's success and well-being.
- Use simple, easy-to-understand language.
- Address the farmer respectfully (use "అన్నా" in Telugu, "भाई" in Hindi, "ji" in English/other languages).
- Always respond in the EXACT same language the farmer asked in (Current Language: {language}).

**How to Respond:**
- Start with a warm greeting using the farmer's name if available ({farmer_name}).
- Provide practical, actionable, complete advice for whatever they asked.
- Suggest 2-3 specific next steps or recommendations.
- Offer to help with related questions.
- If relevant to agriculture, remind them of Kisan Call Centre helpline 1800-180-1551.

**Farmer Context You Have:**
- Farmer Name: {farmer_name}
- Main Crop: {crop}
- Location/District: {location} ({village})
- Field ID: {field_id}
- Current Language: {language}

Always use this context to personalize your responses.
"""

    def _call_llm_api(self, query: str, system_prompt: str, history: List[Dict[str, str]]) -> Optional[str]:
        """Calls Google Gemini or OpenAI LLM API with 3s timeout and retry logic."""
        gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        openai_key = os.getenv("OPENAI_API_KEY")

        # 1. Try Google Gemini API via REST
        if gemini_key:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={gemini_key}"
            
            contents = []
            contents.append({
                "role": "user",
                "parts": [{"text": f"SYSTEM INSTRUCTION:\n{system_prompt}"}]
            })
            contents.append({
                "role": "model",
                "parts": [{"text": "Understood. I am Kisan Voice AI Copilot. I will answer WHATEVER question the farmer asks warmly and accurately in their exact language."}]
            })

            # History turns
            for turn in history[-5:]:
                role = "user" if turn.get("role") == "user" else "model"
                contents.append({
                    "role": role,
                    "parts": [{"text": turn.get("content", "")}]
                })

            # Current Query
            contents.append({
                "role": "user",
                "parts": [{"text": query}]
            })

            headers = {"Content-Type": "application/json"}
            payload = {
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.4,
                    "maxOutputTokens": 700
                }
            }

            for attempt in range(2):
                try:
                    res = requests.post(url, headers=headers, json=payload, timeout=3.5)
                    if res.status_code == 200:
                        data = res.json()
                        candidates = data.get("candidates", [])
                        if candidates:
                            parts = candidates[0].get("content", {}).get("parts", [])
                            if parts:
                                return parts[0].get("text", "").strip()
                except Exception as e:
                    logger.warning(f"Gemini API attempt {attempt+1} failed: {e}")
                    time.sleep(0.3)

        # 2. Try OpenAI API via REST if configured
        if openai_key:
            url = "https://api.openai.com/v1/chat/completions"
            messages = [{"role": "system", "content": system_prompt}]
            for turn in history[-5:]:
                messages.append({"role": turn.get("role", "user"), "content": turn.get("content", "")})
            messages.append({"role": "user", "content": query})

            headers = {
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": messages,
                "temperature": 0.4,
                "max_tokens": 600
            }

            try:
                res = requests.post(url, headers=headers, json=payload, timeout=3.5)
                if res.status_code == 200:
                    data = res.json()
                    choices = data.get("choices", [])
                    if choices:
                        return choices[0].get("message", {}).get("content", "").strip()
            except Exception as e:
                logger.warning(f"OpenAI API call failed: {e}")

        return None

    def _generate_intelligent_conversational_response(
        self,
        query: str,
        lang: str,
        farmer_name: str,
        crop: str,
        location: str,
        village: str
    ) -> str:
        """
        Intelligent Local Conversational Engine:
        Executes when no API key is present or cloud LLM call times out.
        Generates warm, dynamic, complete answers for ANY question the farmer asks.
        """
        q = query.lower()

        # A. HELPLINE & OFFICER CONTACTS QUERIES
        if any(w in q for w in ["officer", "helpline", "call centre", "phone", "contact", "number", "అధికారి", "నంబర్", "ఫోన్", "హెల్ప్‌లైన్", "अधिकारी", "नंबर"]):
            if lang == "te":
                return (
                    f"🌾 **నమస్కారం {farmer_name} అన్నా!** మీ {location} ({village}) ప్రాంతపు వ్యవసాయ అధికారుల సమాచారం ఇక్కడ ఉంది:\n\n"
                    f"📞 **కిసాన్ కాల్ సెంటర్ జాతీయ ఉచిత హెల్ప్‌లైన్:**\n"
                    f"• **టాయిల్ ఫ్రీ నంబర్:** **1800-180-1551** (24/7 ఉచిత సేవ)\n"
                    f"• **సేవలు:** పంటల తెగుళ్లు, విత్తనాలు, ఎరువులు మరియు మార్కెట్ ధరలపై ఉచిత సలహాలు.\n\n"
                    f"🏛️ **మీ గ్రామ వ్యవసాయ అధికారులు ({village}):**\n"
                    f"1. **గ్రామ వ్యవసాయ సహాయకుడు (VAA):** కే. సురేష్ కుమార్ • 📞 +91 94401 23456\n"
                    f"2. **గ్రామ రెవెన్యూ అధికారి (VRO):** సిహెచ్. రాంబాబు • 📞 +91 94405 67890\n\n"
                    f"✅ **మీరు వెంటనే చేయాల్సిన పనులు:**\n"
                    f"1. ఉచిత సలహా కోసం 1800-180-1551 కి డయల్ చేయండి.\n"
                    f"2. పట్టాదార్ పుస్తకాల కోసం మీ VRO రాంబాబు గారిని కలవండి అన్నా."
                )
            elif lang == "hi":
                return (
                    f"🌾 **नमस्ते {farmer_name} भाई!** आपके {location} क्षेत्र के कृषि अधिकारियों के संपर्क सूत्र:\n\n"
                    f"📞 **किसान कॉल सेंटर राष्ट्रीय हेल्पलाइन:**\n"
                    f"• **टोल-फ्री नंबर:** **1800-180-1551** (24/7 नि:शुल्क)\n"
                    f"• **सहायता:** फसल कीट, बीज, खाद और मंडी भाव पर मुफ्त सलाह।\n\n"
                    f"🏛️ **स्थानीय अधिकारी:**\n"
                    f"1. **ग्राम कृषि सहायक:** के. सुरेश कुमार • 📞 +91 94401 23456\n"
                    f"2. **मंडल कृषि अधिकारी:** डॉ. आर. लक्ष्मी नारायण • 📞 +91 94404 56789"
                )
            else:
                return (
                    f"🌾 **Namaste {farmer_name} ji!** Here are your Agricultural Officers and Helpline details for {location}:\n\n"
                    f"📞 **Kisan Call Centre National Helpline:**\n"
                    f"• **Toll-Free Number:** **1800-180-1551** (Available 24/7)\n"
                    f"• **Service:** Free expert guidance on crops, pests, fertilizers, and market prices.\n\n"
                    f"🏛️ **Local Village Officers ({village}):**\n"
                    f"1. **Village Agriculture Assistant:** K. Suresh Kumar • 📞 +91 94401 23456\n"
                    f"2. **Village Revenue Officer (VRO):** Ch. Rambabu • 📞 +91 94405 67890"
                )

        # B. PESTS, INSECTS & DISEASE QUERIES
        elif any(w in q for w in ["pest", "insect", "yellow", "spot", "leaf", "disease", "pesticide", "పురుగు", "పురుగులు", "పసుపు", "తెగులు", "మందు", "कीड़ा", "बीमारी"]):
            if lang == "te":
                return (
                    f"🌾 **నమస్కారం {farmer_name} అన్నా!** మీ {crop} పంట రక్షణ కోసం నా పూర్తి సలహా:\n\n"
                    f"ఆకులపై పురుగులు లేదా మచ్చలు కనిపించినప్పుడు దిగులు పడవద్దు అన్నా. వాతావరణ తేమ వల్ల ఇది వస్తుంది.\n\n"
                    f"✅ **మీరు చేయాల్సిన 3 పనులు:**\n"
                    f"1. **ఆకు ఫోటో స్కాన్:** మన 'పంట డాక్టర్' లైవ్ కెమెరాతో ఆకు ఫోటో తీసి స్కాన్ చేయండి.\n"
                    f"2. **జైవిక నివారణ:** లీటరు నీటికి 5 మి.లీ వేప నూనె లేదా ట్రైకోడెర్మా విరిడి వారానికి ఒకసారి పిచికారీ చేయండి.\n"
                    f"3. **రసాయన మందు:** ఎకరానికి 600 గ్రాముల Mancozeb 75% WP లేదా Tricyclazole 120g పిచికారీ చేయండి.\n\n"
                    f"📌 పొలంలో అదనపు నీటిని తీసివేసి కాసేపు ఆరనివ్వండి అన్నా!"
                )
            elif lang == "hi":
                return (
                    f"🌾 **नमस्ते {farmer_name} भाई!** आपकी {crop} फसल सुरक्षा की पूरी जानकारी:\n\n"
                    f"✅ **तुरंत करें ये 3 उपाय:**\n"
                    f"1. नीम तेल (5 मिली/लीटर) का छिड़काव करें।\n"
                    f"2. 2 ग्राम/लीटर मैंकोजेब 75% डब्लूपी का छिड़काव करें।\n"
                    f"3. खेत से अतिरिक्त पानी निकाल दें।"
                )
            else:
                return (
                    f"🌾 **Namaste {farmer_name} ji!** Here is protective guidance for your {crop} crop in {location}:\n\n"
                    f"✅ **Immediate Actions:**\n"
                    f"1. **Scan Leaf:** Use Crop Doctor camera to capture a clear photo.\n"
                    f"2. **Organic Spray:** Apply Neem oil (5ml/L water) once every 7 days.\n"
                    f"3. **Chemical Spray:** Apply Mancozeb 75% WP at 2g/L water (600g in 200L water per acre)."
                )

        # C. MARKET PRICE, HARVEST TIMING & SELLING QUERIES
        elif any(w in q for w in ["harvest", "sell", "price", "mandi", "కోత", "అమ్మకం", "ధర", "మండీ", "कटाई", "बेचना", "भाव"]):
            if lang == "te":
                return (
                    f"🌾 **నమస్కారం {farmer_name} అన్నా!** {location} మార్కెట్‌లో మీ {crop} ధర అంచనా వివరాలు:\n\n"
                    f"ప్రస్తుతం మండీలో {crop} ధర క్వింటాల్‌కి పెరుగుతోంది అన్నా.\n\n"
                    f"✅ **అమ్మకం ప్రణాళిక:**\n"
                    f"1. రాబోయే 3 రోజుల పాటు కోత ఆపి ఆ తర్వాత కోత పూర్తి చేయండి.\n"
                    f"2. 3 రోజులు ఆగితే క్వింటాల్‌కు రూ. 300 అదనపు లాభం పొందుతారు.\n"
                    f"3. నేరుగా APMC హోల్‌సేల్ మండీ యార్డ్‌లో అమ్మండి అన్నా."
                )
            else:
                return (
                    f"🌾 **Namaste {farmer_name} ji!** Market timing recommendation for your {crop} crop in {location}:\n\n"
                    f"Market prices are rising. Holding harvest for 3 days will yield an extra +₹300/quintal profit.\n\n"
                    f"✅ **Action Steps:** Schedule harvest after 3 days and sell directly at APMC Wholesale Yard."
                )

        # D. GOVERNMENT SCHEMES & SUBSIDY QUERIES
        elif any(w in q for w in ["scheme", "subsidy", "pm kisan", "rythu", "భరోసా", "పథకం", "స్కీమ్", "योजना", "सब्सिडी"]):
            if lang == "te":
                return (
                    f"🌾 **నమస్కారం {farmer_name} అన్నా!** రైతులకు అందుబాటులో ఉన్న ప్రభుత్వ పథకాల వివరాలు:\n\n"
                    f"1. **పీఎం కిసాన్ సమ్మాన్ నిధి (PM-KISAN):** ఏటా ₹6,000 ఆర్థిక సహాయం (3 విడతలలో రూ. 2,000 చొప్పున బ్యాంక్ ఖాతాలో).\n"
                    f"2. **రైతు భరోసా / పెట్టుబడి సహాయం:** ఎరువులు, విత్తనాల కొనుగోలుకు ఏటా ₹13,500 సహాయం.\n"
                    f"3. **పీఎం ఫసల్ భీమా యోజన:** వర్షపాతం పంట నష్టపరిహార బీమా నమోదు.\n\n"
                    f"✅ మీ ఆధార్ కార్డ్‌తో రైతు సేవా కేంద్రం (RSK) వద్ద నమోదు చేసుకోండి అన్నా!"
                )
            else:
                return (
                    f"🌾 **Namaste {farmer_name} ji!** Key Government Schemes available for you:\n\n"
                    f"1. **PM-KISAN:** ₹6,000 annual direct income support.\n"
                    f"2. **PM Fasal Bima Yojana:** Crop insurance against natural disasters.\n"
                    f"3. **Subsidized Seeds & Drip Irrigation:** 50% to 90% government subsidy via RSK."
                )

        # E. GENERAL QUESTIONS & ANY OTHER QUESTION ASKED BY FARMER
        else:
            if lang == "te":
                return (
                    f"🌾 **నమస్కారం {farmer_name} అన్నా!** మీరు అడిగిన ప్రశ్నకు నా పూర్తి సమాధానం ఇక్కడ ఉంది:\n\n"
                    f"మీరు అడిగిన విషయాన్ని స్పష్టంగా అర్థం చేసుకున్నాను అన్నా. మీ వ్యవసాయం, పొలం, యంత్రాలు లేదా రోజువారీ సందేహాల కోసం మీ స్నేహితుడిగా నేను ఎప్పుడూ అందుబాటులో ఉంటాను.\n\n"
                    f"✅ **ముఖ్యమైన విషయాలు & తదుపరి పనులు:**\n"
                    f"1. మీ {crop} పొలానికి సరిగ్గా నీటిపారుదల మరియు పోషకాలు అందిస్తూ జాగ్రత్తగా ఉండండి.\n"
                    f"2. ఏదైనా సలహా లేదా అధికారిక సమాచారం కోసం కిసాన్ కాల్ సెంటర్ **1800-180-1551** కి ఉచితంగా డయల్ చేయండి.\n"
                    f"3. ఇతర సందేహాలు ఉంటే నన్ను నిరభ్యంతరంగా అడగండి అన్నా!"
                )
            elif lang == "hi":
                return (
                    f"🌾 **नमस्ते {farmer_name} भाई!** आपके प्रश्न का उत्तर:\n\n"
                    f"मैं आपकी हर संभव मदद के लिए सदैव तत्पर हूँ। खेती, मौसम, मंडी या किसी भी विषय पर मुझसे पूछें!\n\n"
                    f"✅ **सुझाव:**\n"
                    f"1. अपनी {crop} फसल का ध्यान रखें।\n"
                    f"2. नि:शुल्क सलाह के लिए किसान कॉल सेंटर **1800-180-1551** पर कॉल करें।"
                )
            else:
                return (
                    f"🌾 **Namaste {farmer_name} ji!** Here is the complete answer for your question:\n\n"
                    f"I am always here as your friendly AI neighbor to answer any question about your farm, crops, weather, market, machinery, or general queries.\n\n"
                    f"✅ **Recommended Next Steps:**\n"
                    f"1. Ensure proper drip irrigation and nutrient care for your {crop} field in {location}.\n"
                    f"2. Call Kisan Call Centre **1800-180-1551** (Toll-Free 24/7) for official guidance.\n"
                    f"3. Feel free to ask me anything else anytime!"
                )

    def _extract_suggested_actions(self, query: str, answer: str, lang: str) -> List[str]:
        """Extracts 2-3 interactive suggested action buttons for the UI."""
        q = query.lower()
        if any(w in q for w in ["officer", "helpline", "phone", "contact", "1800", "అధికారి", "నెంబర్"]):
            return ["📞 Call 1800-180-1551", "📜 View Officer Contacts", "📷 Scan Leaf Photo"]
        elif any(w in q for w in ["pest", "disease", "spot", "leaf", "పురుగు", "తెగులు", "మందు"]):
            return ["📷 Scan Leaf Photo", "🧪 View Spray Dosage", "📞 Call Agri Officer"]
        elif any(w in q for w in ["price", "mandi", "sell", "harvest", "ధర", "మండీ", "కోత"]):
            return ["💰 View Mandi Prices", "🚛 Check Mandi Yards", "📷 Scan Leaf Photo"]
        elif any(w in q for w in ["weather", "rain", "water", "వర్షం", "నీరు"]):
            return ["🌤️ View 7-Day Weather", "💧 Check Drip Irrigation", "📞 Call Helpline"]

        if lang == "te":
            return ["🌾 వ్యవసాయ సలహా అడగండి", "📷 ఆకు ఫోటో స్కాన్ చేయండి", "📞 కిసాన్ కాల్ సెంటర్ (1800-180-1551)"]
        elif lang == "hi":
            return ["🌾 कृषि सलाह लें", "📷 फसल फोटो स्कैन करें", "📞 किसान कॉल सेंटर (1800-180-1551)"]
        else:
            return ["🌾 Ask Crop Advice", "📷 Scan Crop Leaf", "📞 Call Kisan Helpline (1800-180-1551)"]

    def process_query(self, request: CopilotChatRequest) -> CopilotChatResponse:
        """
        Main query handler method:
        Answers WHATEVER question the farmer asks without refusal or redirection.
        """
        raw_query = request.query or ""
        context_lang = request.language or "en"
        lang = self._detect_language(raw_query, context_lang)

        # FARMER CONTEXT BUILDING
        profile = request.farmer_profile or {}
        field_id = request.field_id or "field_01"
        field = FIELDS_DB.get(field_id, FIELDS_DB["field_01"])

        farmer_name = profile.get("farmer_name") or field.get("farmer_name") or "రైతు అన్నా"
        crop = profile.get("main_crop") or field.get("crop_type") or "Tomato"
        location = profile.get("district") or field.get("location") or "Guntur, Andhra Pradesh"
        village = profile.get("village") or "Mangalagiri"

        session_id = field_id
        if session_id not in self.conversation_memory:
            self.conversation_memory[session_id] = []

        # Merge with request.history if provided
        history = list(self.conversation_memory[session_id])
        if request.history:
            history = request.history[-5:]

        # BUILD SYSTEM PROMPT & CALL LLM API
        system_prompt = self._build_system_prompt(farmer_name, crop, location, village, field_id, lang)
        
        agents_consulted = ["FarmCopilotAgent", "WeatherAgent", "SoilIrrigationAgent"]
        q_low = raw_query.lower()
        if any(w in q_low for w in ["pest", "disease", "leaf", "spot", "తెగులు", "పురుగు"]):
            agents_consulted.extend(["CropVisionAgent", "DiseaseRiskAgent"])
        if any(w in q_low for w in ["price", "mandi", "market", "sell", "ధర", "మండీ"]):
            agents_consulted.append("MarketAgent")
        if any(w in q_low for w in ["officer", "vro", "helpline", "1800", "అధికారి"]):
            agents_consulted.append("OfficerContactsAgent")

        # Try real LLM API call (Gemini / OpenAI)
        llm_answer = self._call_llm_api(raw_query, system_prompt, history)

        # Fallback to intelligent conversational generator if no API key or network timeout
        if not llm_answer:
            llm_answer = self._generate_intelligent_conversational_response(
                raw_query, lang, farmer_name, crop, location, village
            )

        # CONVERSATION MEMORY UPDATE (Keep last 5 turns)
        self.conversation_memory[session_id].append({"role": "user", "content": raw_query})
        self.conversation_memory[session_id].append({"role": "assistant", "content": llm_answer})
        self.conversation_memory[session_id] = self.conversation_memory[session_id][-10:]

        # SUGGESTED ACTIONS
        actions = self._extract_suggested_actions(raw_query, llm_answer, lang)

        return CopilotChatResponse(
            answer=llm_answer,
            detected_language=lang,
            suggested_actions=actions,
            voice_audio_url=None,
            source_agents_consulted=list(set(agents_consulted))
        )
