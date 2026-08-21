from typing import Dict, Any
from app.schemas import MorningBriefingResponse
from app.database import FIELDS_DB, MANDI_PRICES_DB

class MorningBriefingAgent:
    """
    Daily Morning Briefing Agent:
    Generates a personalized WhatsApp-style voice script (7 AM Briefing)
    synthesizing weather warnings, watering guidance, and market price tips.
    """
    def __init__(self):
        pass

    def generate_briefing(
        self,
        field_id: str = "field_01",
        farmer_name: str = "Ramesh Bhai",
        language: str = "Hindi"
    ) -> MorningBriefingResponse:
        field = FIELDS_DB.get(field_id, FIELDS_DB["field_01"])
        crop = field["crop_type"]
        location = field["location"]

        mandi_info = MANDI_PRICES_DB.get(crop, MANDI_PRICES_DB["Tomato"])
        current_price = mandi_info["current_price"] / 100.0 # INR per kg approx
        proj_price = mandi_info["projected_7d"] / 100.0

        if language == "Hindi":
            greeting = f"राम-राम {farmer_name}! 🌅"
            script = (
                f"नमस्ते {farmer_name}, शुभ प्रभात। आज आपके {location} के {crop} खेत के लिए 3 जरूरी बातें हैं:\n"
                f"1. मौसम: आज दोपहर 2 बजे बारिश का अनुमान है। आज खेत में पानी न दें और छिड़काव रोक दें।\n"
                f"2. कटाई सलाह: {crop} का भाव मंडी में ₹{current_price:.0f}/किग्रा है। अगले 3 दिनों में भाव ₹{proj_price:.0f} तक बढ़ सकता है, आज न बेचें।\n"
                f"3. फसल सुरक्षा: अगर पत्तियों पर काले धब्बे दिखें तो 2 चम्मच Mancozeb 1 लीटर पानी में घोलकर कल शाम छिड़कें।"
            )
            actions = [
                "आज खेत में सिंचाई न करें (बारिश आ रही है)",
                "आज मंडी में फसल न बेचें (3 दिन बाद भाव बढ़ेगा)",
                "Mancozeb दवाई तैयार रखें"
            ]
            weather_adv = "⚠️ दोपहर 2 बजे बारिश: आज छिड़काव न करें, सिंचाई रोक दें।"
            market_adv = f"💡 आज ₹{current_price:.0f}/किग्रा है। 3 दिन रुकें, भाव ₹{proj_price:.0f}/किग्रा तक जाएगा!"

        elif language == "Telugu":
            greeting = f"నమస్కారం {farmer_name}! 🌅"
            script = (
                f"నమస్కారం {farmer_name} గారూ, శుభోదయం. ఈ రోజు మీ {crop} పొలం కోసం 3 ముఖ్యమైన విషయాలు:\n"
                f"1. వాతావరణం: మధ్యాహ్నం 2 గంటలకు వర్షం పడే అవకాశం ఉంది. ఈ రోజు నీరు పెట్టవద్దు.\n"
                f"2. మార్కెట్ ధర: మండీలో {crop} ధర రూ. {current_price:.0f}/కిలో ఉంది. 3 రోజుల్లో రూ. {proj_price:.0f}కు పెరుగుతుంది, ఈ రోజు అమ్మకండి.\n"
                f"3. పంట రక్షణ: ఆకులపై మచ్చలు ఉంటే Mancozeb మందు సిద్ధం చేసుకోండి."
            )
            actions = [
                "ఈ రోజు పొలానికి నీరు పెట్టవద్దు (వర్షం పడుతుంది)",
                "ఈ రోజు పంట అమ్మవద్దు (3 రోజుల్లో ధర పెరుగుతుంది)",
                "మందు పిచికారీ రేపు సాయంత్రం చేయండి"
            ]
            weather_adv = "⚠️ మధ్యాహ్నం 2 గంటలకు వర్షం: ఈ రోజు నీరు పెట్టవద్దు."
            market_adv = f"💡 ఈ రోజు రూ. {current_price:.0f}/కిలో. 3 రోజులు ఆగితే రూ. {proj_price:.0f} పొందుతారు!"

        elif language == "Marathi":
            greeting = f"राम राम {farmer_name}! 🌅"
            script = (
                f"नमस्कार {farmer_name}, शुभ सकाळ. आज तुमच्या {crop} शेतासाठी 3 महत्वाच्या गोष्टी:\n"
                f"1. हवामान: आज दुपारी 2 वाजता पावसाची शक्यता आहे. आज पाणी देऊ नका.\n"
                f"2. बाजार भाव: बाजारात भाव ₹{current_price:.0f}/किलो आहे. 3 दिवसात भाव ₹{proj_price:.0f} होईल, आज विकू नका.\n"
                f"3. पीक औषध: पानांवर ठिपके असल्यास Mancozeb फवारणी उद्या संध्याकाळी करा."
            )
            actions = [
                "आज शेतात पाणी देऊ नका (पाऊस येणार आहे)",
                "आज माल विकू नका (3 दिवसात भाव वाढेल)",
                "Mancozeb औषध तयार ठेवा"
            ]
            weather_adv = "⚠️ दुपारी 2 वाजता पाऊस: आज फवारणी आणि पाणी थांबवा."
            market_adv = f"💡 आज ₹{current_price:.0f}/किलो. 3 दिवस थांबा, भाव ₹{proj_price:.0f} होईल!"

        elif language == "Tamil":
            greeting = f"வணக்கம் {farmer_name}! 🌅"
            script = (
                f"வணக்கம் {farmer_name}, காலை வணக்கம். இன்று உங்கள் {crop} தோாட்டத்திற்கு 3 முக்கிய தகவல்கள்:\n"
                f"1. வானிலை: இன்று மதியம் 2 மணிக்கு மழை வரும். தண்ணீர் பாய்ச்ச வேண்டாம்.\n"
                f"2. சந்தை விலை: இன்று விலை ₹{current_price:.0f}/கிலோ. 3 நாட்களில் ₹{proj_price:.0f} ஆக உயரும், இன்று விற்க வேண்டாம்.\n"
                f"3. பயிர் பாதுகாப்பு: Mancozeb மருந்து தெளிக்கவும்."
            )
            actions = [
                "இன்று தண்ணீர் பாய்ச்ச வேண்டாம் (மழை வரும்)",
                "இன்று விற்க வேண்டாம் (3 நாட்களில் விலை உயரும்)"
            ]
            weather_adv = "⚠️ மதியம் 2 மணிக்கு மழை: இன்று தண்ணீர் பாய்ச்ச வேண்டாம்."
            market_adv = f"💡 இன்று ₹{current_price:.0f}/கிலோ. 3 நாட்கள் காத்திருக்கவும்!"

        else: # Default English
            greeting = f"Good Morning {farmer_name}! 🌅"
            script = (
                f"Good Morning {farmer_name}! Here are your 3 key updates for your {crop} field in {location}:\n"
                f"1. Weather: Rain expected at 2 PM today. Hold irrigation and do NOT spray pesticides today.\n"
                f"2. Market Price: {crop} is currently ₹{current_price:.0f}/kg. Prices projected to rise to ₹{proj_price:.0f}/kg in 3 days. Hold your harvest!\n"
                f"3. Crop Protection: If you see leaf spots, prepare Mancozeb spray (2 spoons per 1L) for tomorrow evening."
            )
            actions = [
                "Do NOT irrigate today (Rain expected at 2 PM)",
                "Hold harvest for 3 days (Price expected to rise +12%)",
                "Keep Mancozeb spray ready for tomorrow evening"
            ]
            weather_adv = "⚠️ Rain at 2 PM: Pause irrigation and spraying today."
            market_adv = f"💡 Current: ₹{current_price:.0f}/kg. Hold 3 days for ₹{proj_price:.0f}/kg!"

        return MorningBriefingResponse(
            farmer_name=farmer_name,
            crop=crop,
            location=location,
            greeting=greeting,
            voice_script=script,
            key_action_points=actions,
            weather_simple_advice=weather_adv,
            market_simple_advice=market_adv,
            language=language
        )
