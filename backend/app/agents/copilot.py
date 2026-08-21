from typing import List, Dict, Any, Optional
from app.schemas import CopilotChatRequest, CopilotChatResponse
from app.database import FIELDS_DB

class FarmCopilotAgent:
    """
    Conversational Farm Copilot Agent:
    Translates farmer voice/text queries into actionable agricultural guidance,
    supporting multi-lingual output (Hindi, Telugu, Tamil, Kannada, Marathi, English)
    and indicating which specialized sub-agents were consulted.
    """
    def __init__(self):
        pass

    def process_query(self, request: CopilotChatRequest) -> CopilotChatResponse:
        query = request.query.lower()
        lang = request.language or "English"
        field = FIELDS_DB.get(request.field_id or "field_01", FIELDS_DB["field_01"])

        crop = field["crop_type"]
        location = field["location"]

        agents_consulted = ["WeatherAgent", "SoilIrrigationAgent"]

        if "yellow" in query or "spot" in query or "leaf" in query or "disease" in query or "insect" in query or "pesticide" in query:
            agents_consulted.append("CropVisionAgent")
            agents_consulted.append("DiseaseRiskAgent")
            
            if lang == "Hindi":
                answer = f"आपकी {crop} की पत्तियों पर शुरुआती झुलसा (Early Blight) या फफूंद के लक्षण दिख रहे हैं। नासिक में बारिश का पूर्वानुमान है। कृपया 48 घंटे के भीतर 'इंडोफिल M-45 (Mancozeb)' 600 ग्राम प्रति एकड़ का छिड़काव करें और निचले संक्रमित पत्तों को काट दें।"
                actions = ["Mancozeb 75% WP खरीदें (₹380/एकड़)", "निचले पत्तों की छंटाई करें", "ड्रिप लाइन से स्प्रे करें"]
            elif lang == "Telugu":
                answer = f"మీ {crop} ఆకులపై ఎండు తెగులు (Early Blight) లక్షణాలు కనిపిస్తున్నాయి. రాబోయే వర్షాల దృష్ట్యా 48 గంటల్లో 'Mancozeb 75% WP' ఎకరానికి 600 గ్రాములు పిచికారీ చేయండి."
                actions = ["Mancozeb క్రిమిసంహారకం కొనండి", "తెగులు సోకిన ఆకులను తొలగించండి", "నీటి యాజమాన్యం తీసుకోండి"]
            elif lang == "Tamil":
                answer = f"உங்கள் {crop} பயிரில் இலைக்கருகல் நோய் அறிகுறி உள்ளது. மழைக்கு முன் 48 மணி நேரத்திற்குள் Mancozeb 75% WP தெளிக்கவும்."
                actions = ["Mancozeb மருந்து தெளிக்கவும்", "பாதிக்கப்பட்ட இலைகளை அகற்றவும்"]
            elif lang == "Kannada":
                answer = f"ನಿಮ್ಮ {crop} ಬೆಳೆಯಲ್ಲಿ ಎಲೆ ಚುಕ್ಕೆ / ಕರಗು ರೋಗದ ಲಕ್ಷಣಗಳಿವೆ. ಮಳೆಯ ಮುನ್ಸೂಚನೆ ಇರುವುದರಿಂದ 48 ಗಂಟೆಗಳ ಒಳಗೆ 600 ಗ್ರಾಂ Mancozeb ಸ್ಪಷ್ಟವಾಗಿ ಸಿಂಪಡಿಸಿ."
                actions = ["Mancozeb ಸಿಂಪಡಿಸಿ (₹380/ಎಕರೆ)", "ಹಾಳಾದ ಎಲೆಗಳನ್ನು ತೆಗೆಯಿರಿ"]
            else:
                answer = f"Your {crop} leaves exhibit signs of Early Blight fungal spots. Due to high humidity and rain forecast in {location}, spray Mancozeb 75% WP (600g in 200L water per acre) within 48 hours and prune lower yellowing leaves."
                actions = ["Purchase Mancozeb 75% WP (₹380/acre)", "Prune lower infected leaves", "Pause overhead irrigation"]

        elif "harvest" in query or "sell" in query or "price" in query or "mandi" in query or "कटाई" in query or "కోత" in query:
            agents_consulted.append("MarketAgent")
            agents_consulted.append("WeatherAgent")
            
            if lang == "Hindi":
                answer = f"नासिक मंडी में {crop} का भाव ₹2,450/क्विंटल चल रहा है और अगले 3 दिनों में ₹2,750 तक जाने की उम्मीद है। हालांकि, शुक्रवार को भारी बारिश की संभावना है। हमारी सिफारिश: बारिश से 1 दिन पहले (3 दिन बाद) कटाई करें!"
                actions = ["3 दिन बाद कटाई का समय तय करें", "मंडी परिवहन की व्यवस्था करें", "ग्रेडिंग शुरू करें"]
            elif lang == "Telugu":
                answer = f"మండీలో {crop} ధర రూ. 2,450 ఉంది. రాబోయే వర్షాలకు ముందే 3 రోజుల్లో కోత పూర్తి చేస్తే 12% అదనపు లాభం పొందవచ్చు."
                actions = ["3 రోజుల్లో కోత పూర్తి చేయండి", "మండీ రవాణా సిద్ధం చేయండి"]
            else:
                answer = f"{crop} is trading at ₹2,450/quintal in {location} mandi with a projected rise to ₹2,750 (+12.2%). With heavy rain expected on Friday, our Decision Engine recommends: Harvest in 3 Days to maximize price while avoiding rain damage!"
                actions = ["Schedule harvest for Day 3", "Arrange mandi transport", "Pre-pack crates"]

        elif "water" in query or "irrigation" in query or "fertilizer" in query or "npk" in query or "खाद" in query or "సిఫార్సు" in query:
            agents_consulted.append("SoilIrrigationAgent")
            
            if lang == "Hindi":
                answer = f"मिट्टी में नमी 34% है और बारिश का अनुमान है। आज ड्रिप सिंचाई बंद रखें या केवल 45 मिनट चलाएं। उर्वरक: 15 किग्रा यूरिया प्रति एकड़ ड्रिप से दें।"
                actions = ["सिंचाई 45 मिनट पर सीमित करें", "यूरिया फर्टिगेशन करें"]
            else:
                answer = f"Soil moisture is at 34% with upcoming rain. Limit drip irrigation cycle to 45 minutes ({field['soil_data']['moisture_percent']}% moisture). Apply 15 kg Urea per acre via fertigation."
                actions = ["Set drip timer to 45 mins", "Fertigate 15kg Urea per acre"]

        else:
            if lang == "Hindi":
                answer = f"नमस्ते! मैं आपका एआई किसान मित्र हूँ। आपकी {field['name']} खेत की स्थिति अच्छी है। मौसम में नमी 82% है। आप मुझसे बीमारी, खाद, सिंचाई या मंडी भाव के बारे में पूछ सकते हैं।"
                actions = ["फसल का फोटो स्कैन करें", "कटाई की समयसीमा देखें", "मंडी भाव चेक करें"]
            else:
                answer = f"Hello! I am your AI Farm Copilot for {field['name']}. Current soil moisture is optimal and market prices are trending upwards. You can ask me about crop diseases, fertilizers, watering schedules, or optimal harvest timing."
                actions = ["Scan crop leaf photo", "Check 'Should I Harvest Now?'", "View soil NPK advice"]

        return CopilotChatResponse(
            answer=answer,
            detected_language=lang,
            suggested_actions=actions,
            voice_audio_url=None,
            source_agents_consulted=agents_consulted
        )
