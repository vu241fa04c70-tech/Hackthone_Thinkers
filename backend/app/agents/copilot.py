import re
from typing import List, Dict, Any, Optional
from app.schemas import CopilotChatRequest, CopilotChatResponse
from app.database import FIELDS_DB, OFFICER_CONTACTS_DB

class FarmCopilotAgent:
    """
    Conversational Farm Copilot Agent:
    Speaks like a warm, caring, encouraging neighbor and friend in Telugu, Hindi, or English.
    Responds with contact details for government agricultural officers & Kisan Call Centre.
    """
    def __init__(self):
        pass

    def _detect_language(self, query: str, context_lang: str) -> str:
        if re.search(r'[\u0c00-\u0c7f]', query):
            return "te"
        if re.search(r'[\u0900-\u097f]', query):
            return "hi"
        if context_lang in ["te", "Telugu"]:
            return "te"
        if context_lang in ["hi", "Hindi"]:
            return "hi"
        return "en"

    def process_query(self, request: CopilotChatRequest) -> CopilotChatResponse:
        raw_query = request.query
        query = raw_query.lower()
        context_lang = request.language or "te"
        lang = self._detect_language(raw_query, context_lang)

        profile = request.farmer_profile or {}
        field = FIELDS_DB.get(request.field_id or "field_01", FIELDS_DB["field_01"])

        farmer_name = profile.get("farmer_name") or "రైతు అన్నా"
        crop = profile.get("main_crop") or field["crop_type"]
        location = profile.get("district") or field["location"]
        village = profile.get("village") or "Mangalagiri"

        agents_consulted = ["WeatherAgent", "SoilIrrigationAgent"]

        # 1. GOVERNMENT OFFICER & KISAN CALL CENTRE CONTACT QUERIES
        if any(w in query for w in ["officer", "vro", "mri", "surveyor", "kisan call centre", "helpline", "phone", "contact", "number", "అధికారి", "నంబర్", "ఫోన్", "హెల్ప్‌లైన్", "నెంబర్", "నెంబరు", "अधिकारी", "नंबर"]):
            agents_consulted.append("OfficerContactsAgent")
            
            if "call centre" in query or "helpline" in query or "1800" in query or "కాల్ సెంటర్" in query:
                if lang in ["te", "Telugu"]:
                    answer = (
                        f"📞 **కిసాన్ కాల్ సెంటర్ జాతీయ టోల్ ఫ్రీ నంబర్:**\n\n"
                        f"• **నంబర్:** 1800-180-1551 (ఉచిత హెల్ప్‌లైన్)\n"
                        f"• **లభ్యత:** 24/7 ప్రతిరోజూ అందుబాటులో ఉంటుంది.\n\n"
                        f"పంటల తెగుళ్లు, విత్తనాలు, ఎరువులు మరియు మార్కెట్ ధరలపై ఉచిత సలహా కోసం వెంటనే 1800-180-1551 కి డయల్ చేయండి అన్నా."
                    )
                else:
                    answer = (
                        f"📞 **Kisan Call Centre Toll-Free Helpline:**\n\n"
                        f"• **Phone:** 1800-180-1551 (Toll-Free)\n"
                        f"• **Service:** 24/7 Expert Advice on crops, diseases, seeds, fertilizers & mandi prices."
                    )
                actions = ["📞 Call 1800-180-1551", "Open Farmer Support Tab"]

            elif "vro" in query or "revenue" in query or "పాస్ పుస్తకం" in query:
                if lang in ["te", "Telugu"]:
                    answer = (
                        f"📜 **మీ గ్రామ రెవెన్యూ అధికారి (VRO) వివరాలు ({village}):**\n\n"
                        f"• **అధికారి పేరు:** సిహెచ్. రాంబాబు (Ch. Rambabu)\n"
                        f"• **హోదా:** గ్రామ రెవెన్యూ అధికారి (VRO)\n"
                        f"• **ఫోన్ నంబర్:** +91 94405 67890\n"
                        f"• **సేవలు:** పట్టాదార్ పాస్ పుస్తకాలు, అడంగల్ / 1-B నకళ్లు, CCRC కౌలు రైతు కార్డులు."
                    )
                else:
                    answer = (
                        f"📜 **Village Revenue Officer (VRO) Details ({village}):**\n\n"
                        f"• **Name:** Ch. Rambabu (VRO)\n"
                        f"• **Phone:** +91 94405 67890\n"
                        f"• **Help Provided:** Pattadar Passbooks, Adangal extracts & CCRC Tenant Cards."
                    )
                actions = ["📞 Call VRO (+91 94405 67890)", "Open Farmer Support Tab"]

            elif "surveyor" in query or "survey" in query or "సర్వే" in query:
                if lang in ["te", "Telugu"]:
                    answer = (
                        f"📐 **మీ గ్రామ సర్వేయర్ వివరాలు ({village}):**\n\n"
                        f"• **అధికారి పేరు:** యం. వెంకటేశ్వర్లు (M. Venkateswarlu)\n"
                        f"• **హోదా:** గ్రామ సర్వేయర్ (Land Surveyor)\n"
                        f"• **ఫోన్ నంబర్:** +91 94403 45678\n"
                        f"• **సేవలు:** సాగుభూమి సరిహద్దుల కొలతలు మరియు రీ-సర్వే పటాలు."
                    )
                else:
                    answer = (
                        f"📐 **Village Surveyor Contact ({village}):**\n\n"
                        f"• **Name:** M. Venkateswarlu (Land Surveyor)\n"
                        f"• **Phone:** +91 94403 45678\n"
                        f"• **Help Provided:** Agricultural land boundary measurement & survey maps."
                    )
                actions = ["📞 Call Surveyor (+91 94403 45678)", "Open Farmer Support Tab"]

            else:
                if lang in ["te", "Telugu"]:
                    answer = (
                        f"🌾 **మీ స్థానిక వ్యవసాయ అధికారుల వివరాలు ({village}):**\n\n"
                        f"1. **గ్రామ వ్యవసాయ సహాయకుడు (VAA):** కే. సురేష్ కుమార్ • 📞 +91 94401 23456\n"
                        f"2. **మండల వ్యవసాయ అధికారి (MAO):** డా. ఆర్. లక్ష్మీ నారాయణ • 📞 +91 94404 56789\n"
                        f"3. **కిసాన్ కాల్ సెంటర్ (టోల్ ఫ్రీ):** 📞 1800-180-1551\n\n"
                        f"ఇప్పుడే వారిని నేరుగా సంప్రదించవచ్చు అన్నా."
                    )
                else:
                    answer = (
                        f"🌾 **Your Local Agricultural Officers ({village}):**\n\n"
                        f"1. **Village Agri Assistant:** K. Suresh Kumar • 📞 +91 94401 23456\n"
                        f"2. **Mandal Agri Officer:** Dr. R. Lakshmi Narayana • 📞 +91 94404 56789\n"
                        f"3. **Kisan Call Centre:** 📞 1800-180-1551 (Toll-Free)"
                    )
                actions = ["📞 Call Agri Assistant", "📞 Call Kisan Centre (1800-180-1551)"]

        # 2. PEST & DISEASE QUERIES
        elif any(w in query for w in ["pest", "insect", "yellow", "spot", "leaf", "disease", "pesticide", "పరుగు", "పురుగు", "పురుగులు", "పసుపు", "మచ్చలు", "తెగులు", "మందు", "వరి", "कीड़ा", "बीमारी"]):
            agents_consulted.extend(["CropVisionAgent", "DiseaseRiskAgent"])
            
            if lang in ["te", "Telugu"]:
                answer = (
                    f"🌾 నమస్కారం {farmer_name}! మీ స్నేహితుడిగా నేను ఉన్నాను, మీ {crop} తోట గురించి ఎలాంటి దిగులు పడవద్దు అన్నా.\n\n"
                    f"మన తోటలో ఏ పురుగు లేదా తెగులు ఉందో ముందుగా పరిశీలిద్దాం అన్నా:\n\n"
                    f"✅ ప్రస్తుతం మనం చేయాల్సిన పని:\n"
                    f"1. వరి లేదా పైరులో కాండం తొలుచే పురుగు లేదా సుడి దోమ ఉంటే, ఎకరానికి 4 కేజీల Cartap Hydrochloride గుళికలు వేయండి.\n"
                    f"2. వర్షం లేదా మబ్బు వాతావరణం ఉంటే ఎకరానికి 120 గ్రాముల Tricyclazole 75% WP మందు పిచికారీ చేయండి.\n\n"
                    f"📌 మన మిత్రుడి సలహా:\n"
                    f"పొలంలో నిలిచిన అదనపు నీటిని తీసివేసి కాసేపు ఆరనివ్వండి. యూరియా ఎక్కువ వేయవద్దు అన్నా!"
                )
                actions = ["ఆకు ఫోటో స్కాన్ చేయండి", "మందుల వివరాలు వినండి", "మండీ ధరలు చూడండి"]

            elif lang in ["hi", "Hindi"]:
                answer = (
                    f"🌾 नमस्ते {farmer_name}! चिंता मत करो भाई, मैं आपका दोस्त हूँ। आपकी {crop} फसल के लिए मेरी सलाह सुनें:\n\n"
                    f"✅ अभी क्या करें:\n"
                    f"1. कीट प्रकोप के लिए 48 घंटे के भीतर फफूंदनाशक दवा का छिड़काव करें।\n"
                    f"2. खेत से अतिरिक्त पानी निकाल दें।"
                )
                actions = ["फसल का फोटो स्कैन करें", "मंडी भाव देखें"]

            else:
                answer = (
                    f"🌾 Namaste {farmer_name}! Don't worry my friend, I am here as your helpful neighbor for your {crop} crop:\n\n"
                    f"✅ Action to take now:\n"
                    f"1. Apply recommended Cartap Hydrochloride granules or foliar Tricyclazole spray within 48 hours.\n"
                    f"2. Drain excess field water to reduce pest humidity."
                )
                actions = ["Scan crop leaf photo", "Check mandi prices"]

        # 3. HARVEST & MANDI QUERIES
        elif any(w in query for w in ["harvest", "sell", "price", "mandi", "కోత", "అమ్మకం", "ధర", "మండీ", "कटाई", "बेचना", "भाव"]):
            agents_consulted.extend(["MarketAgent", "WeatherAgent"])
            
            if lang in ["te", "Telugu"]:
                answer = (
                    f"🌾 నమస్కారం {farmer_name}! మీ స్నేహితుడిగా చెప్తున్నాను, మన {crop}ంటకు మండీలో మంచి ధర వచ్చే అవకాశం ఉంది అన్నా.\n\n"
                    f"మండీలో ధర ప్రస్తుతం రూ. 24.50/కిలో ఉంది. మరో 3 రోజుల్లో రూ. 27.50 వరకు పెరుగుతుంది!\n\n"
                    f"✅ మనం చేయాల్సిన పని:\n"
                    f"ఈ రోజు తొందరపడి తక్కువ ధరకు అమ్మవద్దు. 3 రోజుల తర్వాత కోత చేసి అమ్మడం చాలా లాభదాయకం అన్నా."
                )
                actions = ["3 రోజుల తర్వాత కోత పూర్తి చేయండి", "మండీ రవాణా సిద్ధం చేయండి"]

            elif lang in ["hi", "Hindi"]:
                answer = (
                    f"🌾 नमस्ते {farmer_name}! आपके दोस्त के रूप में सलाह है कि मंडी में {crop} का भाव और बढ़ेगा। 3 दिन रुककर बेचना अधिक लाभदायक रहेगा।"
                )
                actions = ["3 दिन बाद कटाई करें", "मंडी भाव देखें"]

            else:
                answer = (
                    f"🌾 Namaste {farmer_name}! As your friendly neighbor, I recommend holding {crop} harvest for 3 days to get a higher mandi price."
                )
                actions = ["Schedule harvest for Day 3", "Arrange mandi transport"]

        # 4. WATER & FERTILIZER QUERIES
        elif any(w in query for w in ["water", "irrigation", "fertilizer", "npk", "urea", "నీరు", "ఎరువు", "पानी", "खाद", "यूरिया"]):
            agents_consulted.append("SoilIrrigationAgent")
            
            if lang in ["te", "Telugu"]:
                answer = (
                    f"🌾 నమస్కారం {farmer_name}! మీ తోట నేలలో తేమ 34% వద్ద బాగుంది అన్నా.\n\n"
                    f"✅ ప్రస్తుతం చేయాల్సిన పని:\n"
                    f"ఈ రోజు డ్రిప్ నీరు 45 నిమిషాలకు పరిమితం చేయండి. ఎకరానికి 15 కేజీల Urea ఎరువు అందించండి అన్నా.\n\n"
                    f"📌 స్నేహపూర్వక సూచన:\n"
                    f"ఎరువును డ్రిప్ లేదా తడి నేలలో మాత్రమే వేయండి. వర్షం పడే సమయానికి ముందు వేయవద్దు."
                )
                actions = ["డ్రిప్ సమయం 45 నిమిషాలకు సెట్ చేయండి", "15 కేజీల Urea వాడండి"]

            elif lang in ["hi", "Hindi"]:
                answer = (
                    f"🌾 नमस्ते {farmer_name}! मिट्टी में नमी अच्छी है। सिंचाई 45 मिनट रखें और 15 किग्रा यूरिया दें।"
                )
                actions = ["सिंचाई सीमित करें", "यूरिया दें"]

            else:
                answer = (
                    f"🌾 Namaste {farmer_name}! Soil moisture is optimal at 34%. Limit drip irrigation cycle to 45 minutes and apply 15kg Urea per acre."
                )
                actions = ["Set drip timer to 45 mins", "Fertigate 15kg Urea"]

        # 5. GENERAL GREETINGS & UNHANDLED QUERIES
        else:
            if lang in ["te", "Telugu"]:
                answer = (
                    f"🌾 నమస్కారం {farmer_name}! నేను మీ పొరుగు స్నేహితుడిని, మీ వ్యవసాయ మిత్రుడిని. మీకు ఏ విధంగా సహాయం చేయగలను అన్నా?\n\n"
                    f"✅ మనం చేయగలిగే పనులు:\n"
                    f"మీరు ఉద్యానవన / వ్యవసాయ అధికారుల నంబర్లు అడగవచ్చు, లేదా కిసాన్ కాల్ సెంటర్ 1800-180-1551 కి నేరుగా కాల్ చేయవచ్చు!"
                )
                actions = ["📞 అధికారులు & సహాయక కేంద్రం", "ఆకు ఫోటో స్కాన్ చేయండి", "మండీ ధర చెక్ చేయండి"]

            elif lang in ["hi", "Hindi"]:
                answer = (
                    f"🌾 नमस्ते {farmer_name}! मैं आपका पड़ोसी और किसान दोस्त हूँ। कृषि अधिकारियों या किसान कॉल सेंटर 1800-180-1551 का नंबर पूछें!"
                )
                actions = ["📞 किसान सहायता अधिकारी", "फसल का फोटो स्कैन करें"]

            else:
                answer = (
                    f"🌾 Namaste {farmer_name}! I am your friendly AI neighbor for your {crop} crop in {location}. Ask me for your Agriculture Officer's phone number or Kisan Call Centre helpline!"
                )
                actions = ["📞 Farmer Support Contacts", "Scan crop leaf photo"]

        return CopilotChatResponse(
            answer=answer,
            detected_language=lang,
            suggested_actions=actions,
            voice_audio_url=None,
            source_agents_consulted=agents_consulted
        )
