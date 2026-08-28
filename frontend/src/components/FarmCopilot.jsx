import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Bot, User, Volume2, Sparkles, PhoneCall } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech, getLanguageLocale } from '../utils/voiceUtils';

const WELCOME_GREETINGS = {
  te: 'నమస్కారం! నేను మీ కిసాన్ AI సహాయకుడిని. మీ పంటల ఎరువులు, మార్కెట్ ధరలు లేదా ఇతర సందేహాల గురించి నన్ను ఏదైనా అడగండి.',
  hi: 'नमस्ते! मैं आपका किसान AI सहायक हूँ। अपनी फसल, खाद, मंडी भाव या किसी भी अन्य विषय पर कुछ भी पूछें।',
  ta: 'வணக்கம்! நான் உங்கள் கிசான் AI உதவியாளர். உங்கள் பயிர்கள், உரங்கள், சந்தை விலைகள் அல்லது பிற கேள்விகளைப் பற்றி கேளுங்கள்.',
  kn: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕಿಸಾನ್ AI ಸಹಾಯಕ. ನಿಮ್ಮ ಬೆಳೆಗಳು, ರಸಗೊಬ್ಬರ, ಮಂಡಿ ದರ ಅಥವಾ ಯಾವುದೇ ಪ್ರಶ್ನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ.',
  ml: 'നമസ്കാരം! ഞാൻ നിങ്ങളുടെ കിസാൻ AI സഹായിയാണ്. വിളകൾ, വളങ്ങൾ, വിപണി വിലകൾ അല്ലെങ്കിൽ മറ്റ് ചോദ്യങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കാം.',
  mr: 'नमस्कार! मी तुमचा किसान AI सहाय्यक आहे. आपली पिके, खते, बाजारभाव किंवा कोणत्याही प्रश्नाबद्दल विचारा.',
  gu: 'નમસ્તે! હું તમારો કિસાન AI સહાયક છું. તમારા પાક, ખાતર, બજાર ભાવ અથવા કોઈપણ પ્રશ્ન વિશે પૂછો.',
  bn: 'নমস্কার! আমি আপনার কিসান AI সহায়ক। আপনার ফসল, সার, বাজার দর বা যেকোনো প্রশ্ন সম্পর্কে জিজ্ঞাসা করুন।',
  or: 'ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କ କିସାନ AI ସହାୟକ। ଆପଣଙ୍କ ଫସଲ, ଖତ, ମଣ୍ଡି ଦର କିମ୍ବା ଯେକୌଣସି ପ୍ରଶ୍ନ ବିଷୟରେ ପଚାରନ୍ତୁ।',
  pa: 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਕਿਸਾਨ AI ਸਹਾਇਕ ਹਾਂ। ਫਸਲਾਂ, ਖਾਦ, ਮੰਡੀ ਦੇ ਭਾਅ ਜਾਂ ਕਿਸੇ ਵੀ ਸਵਾਲ ਬਾਰੇ ਪੁੱਛੋ।',
  en: 'Namaskaram! I am your Kisan AI Copilot. Ask me anything about crop diseases, fertilizers, mandi prices, or any general questions.'
};

const ERROR_MESSAGES = {
  te: 'క్షమించండి, మీ ప్రశ్నకు సమాధానం ఇవ్వలేకపోయాను. దయచేసి మళ్ళీ ప్రయత్నించండి.',
  hi: 'क्षमा करें, मैं आपके प्रश्न को प्रोसेस नहीं कर सका। कृपया पुनः प्रयास करें.',
  ta: 'மன்னிக்கவும், உங்கள் கேள்வியை செயலாக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.',
  kn: 'ಕ್ಷಮಿಸಿ, ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಪ್ರಕ್ರಿಯೆಗೊಳಿಸಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.',
  ml: 'ക്ഷമിക്കണം, നിങ്ങളുടെ ചോദ്യം പ്രോസസ്സ് ചെയ്യാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
  mr: 'क्षमस्व, मी तुमच्या प्रश्नावर प्रक्रिया करू शकलो नाही. कृपया पुन्हा प्रयत्न करा.',
  gu: 'માફ કરશો, હું તમારા પ્રશ્નની પ્રક્રિયા કરી શક્યો નથી. કૃપા કરીને ફરી પ્રયાસ કરો.',
  bn: 'দুঃখিত, আমি আপনার প্রশ্নটি প্রক্রিয়া করতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন.',
  or: 'କ୍ଷମା କରିବେ, ମୁଁ ଆପଣଙ୍କ ପ୍ରଶ୍ନର ପ୍ରକ୍ରିୟାକରଣ କରିପାରିଲି ନାହିଁ। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।',
  pa: 'ਮਾਫ ਕਰਨਾ, ਮੈਂ ਤੁਹਾਡੇ ਸਵਾਲ ਦੀ ਪ੍ਰਕਿਰਿਆ ਨਹੀਂ ਕਰ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ.',
  en: "Sorry, I couldn't process your question. Please try again."
};

const QUICK_QUESTIONS_BY_LANG = {
  te: [
    '📞 నా వ్యవసాయ అధికారి ఫోన్ నంబర్ ఎంత?',
    '📞 కిసాన్ కాల్ సెంటర్ నంబర్ (1800-180-1551)',
    'గుంటూరు మండీలో ప్రస్తుత టమాటా ధర ఎంత?',
    'పంటలో ఆకు ముడత నివారణకు ఏ మందు వాడాలి?',
    'What is Python?'
  ],
  hi: [
    '📞 कृषि अधिकारी का फोन नंबर?',
    '📞 किसान कॉल सेंटर 1800-180-1551',
    'टमाटर और मिर्च का ताजा मंडी भाव क्या है?',
    'पत्तियों में बीमारी के लिए कौन सी दवा डालें?',
    'What is photosynthesis?'
  ],
  ta: [
    '📞 வேளாண்மை அதிகாரி எண் என்ன?',
    '📞 கிசான் கால் சென்டர் (1800-180-1551)',
    'தற்போதைய தக்காளி மற்றும் மிளகாய் மண்டி விலை?',
    'இலை சுருட்டல் நோய்க்கு என்ன மருந்து தெளிக்க வேண்டும்?',
    'What is 2 + 2?'
  ],
  kn: [
    '📞 ಕೃಷಿ ಅಧಿಕಾರಿಯ ಫೋನ್ ಸಂಖ್ಯೆ ಎಷ್ಟು?',
    '📞 ಕಿಸಾನ್ ಕಾಲ್ ಸೆಂಟರ್ 1800-180-1551',
    'ಟೊಮೆಟೊ ಮತ್ತು ಮೆಣಸಿನಕಾಯಿ ಇಂದಿನ ಮಂಡಿ ದರ?',
    'ಎಲೆ ಮುರುಟು ರೋಗಕ್ಕೆ ಯಾವ ಔಷಧಿ ಸಿಂಪಡಿಸಬೇಕು?',
    'What is Python?'
  ],
  mr: [
    '📞 कृषी अधिकाऱ्यांचा फोन नंबर काय आहे?',
    '📞 किसान कॉल सेंटर 1800-180-1551',
    'टोमॅटो व मिरचीचे आजचे बाजारभाव काय आहेत?',
    'पानांवरील रोगावर कोणते औषध फवारावे?'
  ],
  gu: [
    '📞 કૃષિ અધિકારીનો ફોન નંબર?',
    '📞 કિસાન કોલ સેન્ટર 1800-180-1551',
    'ટમેટા અને મરચાંનો આજનો મંડી ભાવ શું છે?'
  ],
  bn: [
    '📞 কৃষি আধিকারিকের ফোন নম্বর?',
    '📞 কিসান কল সেন্টার 1800-180-1551',
    'টমেটো ও লঙ্কার আজকের বাজার দর কত?'
  ],
  en: [
    'Why are my chilli leaves turning yellow?',
    'Which fertilizer is suitable for chilli?',
    'What is Python?',
    'What is photosynthesis?',
    'What is 2 + 2?',
    '📞 Kisan Call Centre (1800-180-1551)'
  ]
};

export default function FarmCopilot({ activeField }) {
  const { lang } = useLanguage();
  const quickQuestions = QUICK_QUESTIONS_BY_LANG[lang] || QUICK_QUESTIONS_BY_LANG.en || QUICK_QUESTIONS_BY_LANG.te || [];
  
  const getGreeting = (languageCode) => {
    return WELCOME_GREETINGS[languageCode] || WELCOME_GREETINGS.te;
  };

  const getErrorMessage = (languageCode) => {
    return ERROR_MESSAGES[languageCode] || ERROR_MESSAGES.en;
  };

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: getGreeting(lang)
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Update greeting when language changes if only 1 welcome message exists
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].sender === 'bot') {
        return [{ id: 1, sender: 'bot', text: getGreeting(lang) }];
      }
      return prev;
    });
  }, [lang]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const query = (textToSend || inputText || '').trim();
    if (!query) return;

    const userMsg = { id: Date.now(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    setIsTyping(true);

    const savedProfile = localStorage.getItem('kisan_farmer_profile');
    let farmerProfileData = activeField || {};
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        farmerProfileData = {
          farmer_name: parsed.farmer_name || activeField?.name || 'రైతు అన్నా',
          main_crop: parsed.main_crop || activeField?.crop_type || 'Chilli',
          district: parsed.district || activeField?.location?.split(',')[0]?.trim() || 'Guntur',
          village: parsed.village || 'Mangalagiri',
          state: parsed.state || 'Andhra Pradesh'
        };
      } catch (e) {}
    }

    // Build recent conversation history for multi-turn context
    const currentHistory = messages
      .filter(m => m.sender === 'user' || m.sender === 'bot')
      .slice(-6)
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

    const payload = {
      query,
      language: lang,
      field_id: activeField?.field_id || 'field_01',
      farmer_profile: farmerProfileData,
      history: currentHistory
    };

    const resolveClientQuery = async (qText, qLang) => {
      const q = (qText || '').trim();
      const qLow = q.toLowerCase();

      // Math calculation
      const mathClean = qLow.replace(/×/g, '*').replace(/multiplied by/g, '*').replace(/times/g, '*').replace(/divided by/g, '/').replace(/plus/g, '+').replace(/minus/g, '-').replace(/ఎంత|ఏమిటి|ఏంటి|\?|=/g, '').trim();
      const mathMatch = mathClean.match(/(\d+(\.\d+)?)\s*([\+\-\*\/])\s*(\d+(\.\d+)?)/);
      if (mathMatch) {
        const n1 = parseFloat(mathMatch[1]);
        const op = mathMatch[3];
        const n2 = parseFloat(mathMatch[4]);
        let res = 0;
        if (op === '+') res = n1 + n2;
        else if (op === '-') res = n1 - n2;
        else if (op === '*') res = n1 * n2;
        else if (op === '/') res = n2 !== 0 ? n1 / n2 : 'undefined';
        return q.trim().split(/\s+/).length <= 4 ? `${res}` : `${n1} ${op} ${n2} = ${res}`;
      }

      // Direct Facts: Prime Minister, President, Capitals, Chief Ministers
      if (/ప్రధానమంత్రి|ప్రధాన మంత్రి|పీఎం|పిఎం|प्रधानमंत्री|पीएम/i.test(q) || /prime\s*minister|pm\s*of\s*india|who\s*is\s*(the\s*)?pm/i.test(qLow)) {
        if (/ఎవరు|పేరు|ఏమిటి|ఏంటి|ప్రస్తుత|కొత్త|कौन|नाम/i.test(q) || /who|name|current|what|is/i.test(qLow) || q.trim().length <= 25) {
          if (qLang === 'te') return 'నరేంద్ర మోదీ (Narendra Modi).';
          if (qLang === 'hi') return 'नरेंद्र मोदी (Narendra Modi).';
          return 'Narendra Modi.';
        }
      }

      if (/రాష్ట్రపతి|రాష్ట్ర పతి|राष्ट्रपति/i.test(q) || /president\s*of\s*india|who\s*is\s*(the\s*)?president/i.test(qLow)) {
        if (/ఎవరు|పేరు|ఏమిటి|ఏంటి|ప్రస్తుత|కొత్త|कौन|नाम/i.test(q) || /who|name|current|what|is/i.test(qLow) || q.trim().length <= 25) {
          if (qLang === 'te') return 'ద్రౌపది ముర్ము (Droupadi Murmu).';
          if (qLang === 'hi') return 'द्रौपदी मुर्मू (Droupadi Murmu).';
          return 'Droupadi Murmu.';
        }
      }

      if (/ఆంధ్రప్రదేశ్ ముఖ్యమంత్రి|ఆంధ్ర ప్రదేశ్ ముఖ్యమంత్రి|ఏపీ సీఎం|ఆంధ్ర సీఎం/i.test(q) || (/\bandhra\b/i.test(qLow) && /\bcm\b/i.test(qLow))) {
        if (qLang === 'te') return 'నారా చంద్రబాబు నాయుడు (N. Chandrababu Naidu).';
        if (qLang === 'hi') return 'एन. चंद्रबाबू नायडू (N. Chandrababu Naidu).';
        return 'N. Chandrababu Naidu.';
      }

      if (/తెలంగాణ ముఖ్యమంత్రి|తెలంగాణ సీఎం/i.test(q) || (/\btelangana\b/i.test(qLow) && /\bcm\b/i.test(qLow))) {
        if (qLang === 'te') return 'ఎనుముల రేవంత్ రెడ్డి (A. Revanth Reddy).';
        if (qLang === 'hi') return 'ए. रेवंत रेड्डी (A. Revanth Reddy).';
        return 'A. Revanth Reddy.';
      }

      if (/భారతదేశ రాజధాని|భారత రాజధాని|భారత్ రాజధాని|దేశ రాజధాని|రాజధాని ఏది|రాజధాని ఏమిటి|भारत की राजधानी/i.test(q) || (/\bcapital\b/i.test(qLow) && /\bindia\b/i.test(qLow))) {
        if (qLang === 'te') return 'న్యూఢిల్లీ (New Delhi).';
        if (qLang === 'hi') return 'नई दिल्ली (New Delhi).';
        return 'New Delhi.';
      }

      if (/ఆంధ్రప్రదేశ్ రాజధాని|ఆంధ్ర ప్రదేశ్ రాజధాని|ఏపీ రాజధాని/i.test(q) || (/\bcapital\b/i.test(qLow) && /\bandhra\b/i.test(qLow))) {
        if (qLang === 'te') return 'అమరావతి (Amaravati).';
        if (qLang === 'hi') return 'अमरावती (Amaravati).';
        return 'Amaravati.';
      }

      if (/తెలంగాణ రాజధాని/i.test(q) || (/\bcapital\b/i.test(qLow) && /\btelangana\b/i.test(qLow))) {
        if (qLang === 'te') return 'హైదరాబాద్ (Hyderabad).';
        if (qLang === 'hi') return 'हैदराबाद (Hyderabad).';
        return 'Hyderabad.';
      }

      // Greetings
      if (/\b(hello|hey|hi|namaste|namaskaram)\b/i.test(qLow) || /హలో|నమస్కారం|నమస్తే|नमस्ते/.test(q)) {
        if (qLang === 'te') return 'నమస్కారం! నేను మీ కిసాన్ AI సహాయకుడిని. మీకు ఎలాంటి సమాచారం లేదా సహాయం కావాలి?';
        if (qLang === 'hi') return 'नमस्ते! मैं आपका किसान AI सहायक हूँ। आज मैं आपकी क्या सहायता कर सकता हूँ?';
        return 'Hello! I am your Kisan AI assistant. How can I help you today?';
      }

      // Full forms (Concise Exact Answers)
      if (/who|డబ్ల్యూహెచ్ఓ|డబ్ల్యుహెచ్ఓ|डब्ल्यूएचओ/i.test(qLow) && /full\s*form|stands for|ఫుల్\s*ఫామ్|ఫుల్‌ఫామ్|పూర్తి రూపం|फुल फॉर्म|అంటే/i.test(qLow)) {
        if (qLang === 'te') return '**WHO** అంటే **World Health Organization (ప్రపంచ ఆరోగ్య సంస్థ)**.';
        if (qLang === 'hi') return '**WHO** का फुल फॉर्म **World Health Organization** है।';
        return 'World Health Organization.';
      }
      if (/cpu|సిపియు|సీపీయూ|सीपीयू/i.test(qLow) && /full\s*form|stands for|ఫుల్\s*ఫామ్|ఫుల్‌ఫామ్|పూర్తి రూపం|फुल फॉर्म|అంటే/i.test(qLow)) {
        if (qLang === 'te') return '**CPU** అంటే **Central Processing Unit (కేంద్ర ప్రాసెసింగ్ యూనిట్)**.';
        if (qLang === 'hi') return '**CPU** का फुल फॉर्म **Central Processing Unit** है।';
        return 'Central Processing Unit.';
      }
      if (/html|హెచ్‌టిఎమ్‌ఎల్/i.test(qLow) && /full\s*form|stands for|ఫుల్\s*ఫామ్|ఫుల్‌ఫామ్|పూర్తి రూపం|फुल फॉर्म|అంటే/i.test(qLow)) {
        if (qLang === 'te') return '**HTML** అంటే **HyperText Markup Language**.';
        return 'HyperText Markup Language.';
      }
      if (/nasa|నాసా|नासा/i.test(qLow) && /full\s*form|stands for|ఫుల్\s*ఫామ్|ఫుల్‌ఫామ్|పూర్తి రూపం|फुल फॉर्म|అంటే/i.test(qLow)) {
        return '**NASA** stands for **National Aeronautics and Space Administration**.';
      }

      // Agricultural Transliterations & Local Telugu/Hindi Crop Care
      if (/vari|dhaanyam|paddy|వరి|ధాన|धान/i.test(qLow) && /yeruvu|eruvu|fertilizer|khad|ఎరువు|खाद/i.test(qLow)) {
        if (qLang === 'te') {
          return "వరి పంటకు ఎరువుల యాజమాన్యం (ఎకరాకు సిఫార్సు):\n\n1. **నాట్లు వేసే సమయంలో (Basal):** 50 కిలోల DAP + 20 కిలోల పొటాష్ (MOP) + 10 కిలోల జింక్ సల్ఫేట్.\n2. **మొదటి పైపాటు (20-25 రోజులకు):** 25-30 కిలోల యూరియా.\n3. **చిరుపొట్ట దశలో (40-45 రోజులకు):** 20 కిలోల యూరియా + 15 కిలోల పొటాష్ అందించండి.\n\n⚠️ ఖచ్చితమైన మోతాదు మీ నేల పరీక్ష మరియు వరి రకాన్ని బట్టి ఆధారపడి ఉంటుంది.";
        }
        return "Recommended Fertilizer Schedule for Paddy / Rice (Per Acre):\n\n1. **Basal Dose:** 50 kg DAP + 20 kg MOP (Potash) + 10 kg Zinc Sulphate at transplanting.\n2. **First Top Dressing (20-25 Days):** 25-30 kg Urea per acre.\n3. **Panicle Initiation (40-45 Days):** 20 kg Urea + 15 kg Potash per acre.";
      }

      if (/mamidi|mango|మామిడి|మామిడికాయ|आम/i.test(qLow) && /mandhu|mandhulu|mandulu|pesticide|spray|మందు|మందులు|దవా|दवा/i.test(qLow)) {
        if (qLang === 'te') {
          return "మామిడి తోటల్లో పూత, పిందె మరియు పండ్ల సంరక్షణకు యాజమాన్యం:\n\n1. **తేనెమంచు పురుగు & బూడిద తెగులు:** Imidacloprid 17.8% SL (0.4 ml/లీ) + Hexaconazole 5% SC (2 ml/లీ) లేదా Carbendazim 50% WP (1 గ్రా/లీ) పిచికారీ చేయండి.\n2. **పండు ఈగ నివారణ:** ఎకరానికి 4-6 మిథైల్ యూజినాల్ (Methyl Eugenol) లింగాకర్షక బుట్టలను అమర్చండి.\n3. **మచ్చ తెగులు (Anthracnose):** Copper Oxychloride 50% WP (3 గ్రా/లీ) పిచికారీ చేయండి.";
        }
        return "Pest & Disease Management for Mango Orchard:\n\n1. **Hopper & Powdery Mildew:** Spray Imidacloprid 17.8% SL @ 0.4 ml/L + Hexaconazole 5% SC @ 2 ml/L or Carbendazim 50% WP @ 1g/L water.\n2. **Fruit Fly Management:** Install 4-6 Methyl Eugenol pheromone traps per acre.\n3. **Anthracnose Spot:** Spray Copper Oxychloride 50% WP @ 3g/L water.";
      }

      if (/mirapa|mirapakaya|chilli|మిరప|మిరపకాయ/i.test(qLow) && /pasupu|yellow|పసుపు/i.test(qLow)) {
        if (qLang === 'te') {
          return "మిరప పంటలో ఆకులు పసుపు రంగులోకి మారడానికి కారణాలు & నివారణలు:\n\n1. **నత్రజని లోపం:** ఎకరానికి 25-30 కిలోల యూరియా అందించండి లేదా 19-19-19 ఎరువును లీటరు నీటికి 5 గ్రాములు కలిపి పిచికారీ చేయండి.\n2. **తామర పురుగులు / తెల్లదోమ:** Imidacloprid 17.8% SL (0.5 ml/లీ) లేదా వేప నూనె 10,000 ppm (5 ml/లీ) పిచికారీ చేయండి.\n3. **నీటి నిల్వ:** నేలలో నీరు నిల్వ ఉండకుండా మురుగు నీటి సౌకర్యం కల్పించండి.";
        }
        return "Primary causes and solutions for yellowing chilli leaves:\n\n1. **Nitrogen Deficiency:** Apply Urea @ 25-30 kg/acre or spray NPK 19-19-19 @ 5g/liter water.\n2. **Sucking Pests (Thrips / Whiteflies):** Spray Imidacloprid 17.8% SL @ 0.5 ml/L water.\n3. **Drainage:** Prevent water stagnation around root zones.";
      }

      // Crop Growth & Precautions (e.g. "పంట బాగా పెరగడానికి కావలసిన జాగ్రత్తలు ఏమిటి", "panta baga peragadaniki em jagrathalu teesukovali")
      if (/పెరగడానికి|పెరగాలంటే|పెరుగుదలకు|పెరుగుదల|బాగా పెరగడం|మంచిగా పెరగడం|జాగ్రత్తలు ఏమిటి|జాగ్రత్తలు తీసుకోవాలి|జాగ్రత్తలు/i.test(q) || /baga peragadaniki|peragalante|perugudalaku|growth|jagrathalu/i.test(qLow)) {
        if (qLang === 'te') {
          return "పంట ఆరోగ్యంగా మరియు బాగా పెరగడానికి తీసుకోవలసిన ముఖ్యమైన జాగ్రత్తలు:\n\n1. **నేల తయారీ & సేంద్రీయ ఎరువులు:** విత్తే ముందు ఎకరానికి 4-5 టన్నుల పశువుల ఎరువు (FYM) లేదా వర్మీకంపోస్ట్ వేసి నేలను బాగా దున్నండి.\n2. **సమతుల్య ఎరువుల యాజమాన్యం (NPK):** సిఫార్సు చేసిన మోతాదులో నత్రజని (యూరియా), భాస్వరం (DAP) మరియు పొటాష్‌లను సరైన సమయాల్లో దశల వారీగా అందించండి.\n3. **సక్రమమైన నీటి యాజమాన్యం:** పంట ఎదుగుదల దశల్లో నేలలో తగినంత తేమ ఉండేలా చూసుకోండి; అధిక నీరు నిల్వ ఉండకుండా మురుగు నీటి కాలువలు తీయండి.\n4. **సకాలంలో కలుపు నివారణ:** పంట ప్రారంభ దశలో (మొదటి 20-30 రోజుల్లో) కలుపు లేకుండా చూసుకోవడం ద్వారా పోషకాలు నేరుగా పంటకే అందుతాయి.\n5. **సమగ్ర సస్యరక్షణ (IPM):** పురుగులు, తెగుళ్ల నివారణకు క్రమం తప్పకుండా పొలాన్ని గమనిస్తూ అవసరాన్ని బట్టి వేపనూనె లేదా తగిన మందులను పిచికారీ చేయండి.";
        }
        return "Key practices and care required for healthy and optimal crop growth:\n\n1. **Soil Preparation & Organic Matter:** Apply 4-5 tonnes/acre of well-decomposed FYM or compost.\n2. **Balanced Nutrient Management (NPK):** Apply Nitrogen, Phosphorus, and Potassium in split doses according to crop stages.\n3. **Proper Irrigation & Drainage:** Ensure adequate moisture during critical growth stages; prevent water stagnation.\n4. **Timely Weed Control:** Keep the field weed-free during the first 20-35 days.\n5. **Integrated Pest Management (IPM):** Regularly monitor crops and use biological controls or recommended sprays.";
      }

      // Urea Definition & Usage
      if (/యూరియా|urea/i.test(q)) {
        if (/ఎందుకు|వాడతారు|ఉపయోగిస్తారు|ఉపయోగం|why|use|purpose/i.test(q)) {
          if (qLang === 'te') return 'యూరియాను పంటలకు ప్రధాన పోషకమైన నత్రజని (Nitrogen - 46%) అందించడానికి ఉపయోగిస్తారు. ఇది మొక్కలు వేగంగా ఏపుగా పెరగడానికి, ఆకులు పచ్చగా ఉండటానికి మరియు క్లోరోఫిల్ తయారీకి సహాయపడుతుంది.';
          return 'Urea is applied to supply crops with 46% concentrated Nitrogen, promoting vegetative growth, lush green leaves, and chlorophyll synthesis.';
        }
        if (/అనగా|అంటే|ఏమిటి|ఏంటి|what is|meaning|definition/i.test(q) || q.trim().split(/\s+/).length <= 4) {
          if (qLang === 'te') return '**యూరియా (Urea):** పంటలలో ఆకులు పచ్చగా ఉండటానికి మరియు శాఖీయ పెరుగుదలకు 46% నత్రజనిని (Nitrogen) అందించే అత్యంత ముఖ్యమైన రసాయన ఎరువు.';
          return '**Urea:** A widely used nitrogenous fertilizer containing 46% Nitrogen (N), essential for vegetative growth and green foliage in crops.';
        }
      }

      // Nursery Bed (ఆకుమడి / నారుమడి)
      if (/ఆకుమడి|నారుమడి|nursery bed|seedbed/i.test(q)) {
        if (qLang === 'te') return '**ఆకుమడి (లేదా నారుమడి / Nursery Bed):** ప్రధాన పొలంలో నాట్లు వేయడానికి ముందుగా వరి లేదా కూరగాయల విత్తనాలను చల్లి ఆరోగ్యకరమైన నారును పెంచే ప్రత్యేకమైన చిన్న పొలం మడి.';
        return '**Nursery Bed (Seedbed):** A specially prepared small area of soil where seeds of crops like paddy or vegetables are germinated and nurtured into healthy seedlings before being transplanted into the main field.';
      }

      // Seed (విత్తనం)
      if (/విత్తనం|విత్తనము|seed/i.test(q) && (/అనగా|అంటే|ఏమిటి|ఏంటి|what is|definition/i.test(q) || q.trim().split(/\s+/).length <= 4)) {
        if (qLang === 'te') return '**విత్తనం (Seed):** ఒక కొత్త మొక్కను ఉత్పత్తి చేసే శక్తిని కలిగి ఉండే పిండం మరియు మొలకెత్తడానికి అవసరమైన పోషకాలను నిల్వ చేసుకున్న మొక్క యొక్క ముఖ్యమైన పునరుత్పత్తి భాగం.';
        return '**Seed:** A fertilized, ripened ovule containing an embryonic plant and food reserves capable of germinating to produce a new plant.';
      }

      // Weeds (కలుపు మొక్కలు)
      if (/కలుపు మొక్కలు|కలుపు మొక్క|కలుపు|weed/i.test(q) && (/అనగా|అంటే|ఏమిటి|ఏంటి|what is|definition|నివారణ/i.test(q) || q.trim().split(/\s+/).length <= 4)) {
        if (qLang === 'te') return '**కలుపు మొక్కలు (Weeds):** పంట పొలంలో అనుమతి లేకుండా పెరిగి, ప్రధాన పంటకు అందవలసిన నీరు, సూర్యరశ్మి మరియు పోషకాలను గ్రహించి పంట ఎదుగుదలను దెబ్బతీసే అవాంఛనీయ పనికిరాని మొక్కలు.';
        return '**Weeds:** Unwanted and undesirable plants growing in cultivated fields that compete with the main crop for water, nutrients, and sunlight, thereby reducing yield.';
      }

      // Fertilizer Timing
      if (/ఎప్పుడు వేయాలి|ఎరువు ఎప్పుడు|ఎరువుల సమయం/i.test(q) || (/fertilizer|eruvu/i.test(qLow) && /when|timing|eppudu/i.test(qLow))) {
        if (qLang === 'te') {
          return "పంటలకు ఎరువులు వేయవలసిన సరైన సమయాలు & పద్ధతి:\n\n1. **విత్తే/నాట్లేసే సమయంలో (Basal):** మొత్తం DAP, సగం పొటాష్ (MOP) మరియు జింక్ సల్ఫేట్ చివరి దుక్కిలో లేదా నాట్లలో వేయాలి.\n2. **మొదటి పైపాటు (20-25 రోజులకు):** శాఖీయ పెరుగుదల కోసం సిఫార్సు చేసిన యూరియాలో మొదటి భాగం వేయాలి.\n3. **రెండవ పైపాటు (40-45 రోజులకు):** పూత లేదా చిరుపొట్ట దశలో మిగిలిన యూరియా మరియు పొటాష్ వేయాలి.\n4. **గమనిక:** ఎరువులు వేసేటప్పుడు నేలలో తగినంత తేమ ఉండాలి.";
        }
        return "Recommended Fertilizer Application Timing:\n\n1. **Basal (At Sowing):** Full DAP + 50% Potash + Zinc Sulphate.\n2. **First Top-Dressing (20-25 Days):** 1st split of Nitrogen (Urea).\n3. **Second Top-Dressing (40-45 Days):** 2nd split of Urea + remaining 50% Potash.";
      }

      // NPK Full Form & Role
      if (/npk|ఎన్‌పికె|ఎన్‌పీకే|एनपीके/i.test(qLow)) {
        if (qLang === 'te') {
          return "**NPK** అంటే **Nitrogen, Phosphorus, and Potassium (నత్రజని, భాస్వరం మరియు పొటాష్)**. ఇవి పంటల ఆరోగ్యకరమైన పెరుగుదలకు అవసరమైన 3 ప్రధాన పోషకాలు.";
        }
        return "Nitrogen, Phosphorus and Potassium.";
      }

      // Seasonal Sowing & Crop Selection
      if (/which crop|what crop|sow|sowing|season|వేయు|వేయవలెను|వేయాలి|ఏ పంట|విత్తే సమయం/i.test(qLow) || /ఏ పంట వేయవలెను|ఏ పంట వేయాలి/.test(q)) {
        if (qLang === 'te') {
          return "ప్రస్తుత వ్యవసాయ కాలానికి సిఫార్సు చేయబడిన ప్రధాన పంటలు & విత్తే ప్రణాళిక:\n\n1. **ఖరీఫ్ కాలం (జూన్ - అక్టోబర్):** వరి (Paddy), ప్రత్తి (Cotton - జూన్/జూలైలో విత్తాలి), మిరప (Chilli), మొక్కజొన్న (Maize), కందులు, వేరుశనగ.\n2. **రబీ కాలం (అక్టోబర్ - మార్చి):** శనగ (Bengal Gram), మినుము (Black Gram), మొక్కజొన్న, టమాటా, కూరగాయలు.\n3. **వేసవి కాలం (మార్చి - మే):** పెసలు, నువ్వులు, పుచ్చకాయ, కూరగాయలు.\n\n💡 మీ నేల స్వభావం మరియు నీటి లభ్యత ఆధారంగా సరైన పంటను ఎంచుకోండి.";
        }
        return "Seasonal Crop Sowing Guide & Recommendations:\n\n1. **Kharif Season (June - October):** Cotton (Best sown June-July), Paddy/Rice, Chilli, Maize, Red Gram, Groundnut.\n2. **Rabi Season (October - March):** Bengal Gram (Chickpea), Black Gram (Urad), Maize, Tomato, Vegetables.\n3. **Summer/Zaid (March - May):** Green Gram (Moong), Sesame, Watermelon, irrigated vegetables.";
      }

      // Organic Farming
      if (/organic farming|సేంద్రీయ వ్యవసాయం/i.test(qLow)) {
        if (qLang === 'te') {
          return "**సేంద్రీయ వ్యవసాయం (Organic Farming)** అనేది రసాయన ఎరువులు, పురుగుమందులు వాడకుండా పశువుల ఎరువు, వర్మీకంపోస్ట్, జీవామృతం, వేపపిండి మరియు జీవ నియంత్రణ పద్ధతులతో పంటలను పండించే పద్ధతి. ఇది నేల సారాన్ని కాపాడి విషరహిత ఆరోగ్యకరమైన దిగుబడిని ఇస్తుంది.";
        }
        return "**Organic Farming** is an eco-friendly farming method that avoids synthetic chemical fertilizers and pesticides. It relies on compost, FYM, Jeevamrutham, neem cake, and biological pest controls to sustain soil health.";
      }

      // PM-KISAN
      if (/pm-kisan|pmkisan|pm kisan|పీఎం కిసాన్/i.test(qLow)) {
        if (qLang === 'te') {
          return "**పీఎం కిసాన్ (PM-KISAN - Pradhan Mantri Kisan Samman Nidhi)** అనేది కేంద్ర ప్రభుత్వ పథకం. దీని ద్వారా అర్హులైన ప్రతి రైతు కుటుంబానికి ఏడాదికి **₹6,000** పెట్టుబడి సహాయం (4 నెలలకు ఒకసారి ₹2,000 చొప్పున 3 విడతల్లో) నేరుగా బ్యాంక్ ఖాతాల్లో జమ చేస్తారు.";
        }
        return "**PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)** is a Central Government scheme providing **₹6,000 per year** direct financial support to eligible farmer families in 3 installments of **₹2,000** each via DBT.";
      }

      // Crop Rotation
      if (/crop rotation|పంట మార్పిడి/i.test(qLow)) {
        if (qLang === 'te') {
          return "**పంట మార్పిడి (Crop Rotation)** అంటే ఒకే పొలంలో ఒకే పంటను పదేపదే వేయకుండా, కాలాల వారీగా వేర్వేరు పంటలను (తృణధాన్యాల తర్వాత పప్పుజాతి పంటలు) మార్చి సాగు చేయడం. దీని వల్ల నేల సారం పెరుగుతుంది మరియు పురుగులు, తెగుళ్లు అదుపులో ఉంటాయి.";
        }
        return "**Crop Rotation** is the practice of growing different crops sequentially on the same land across seasons. It restores soil nitrogen (via legumes), breaks pest cycles, and prevents soil exhaustion.";
      }

      // Drug / Medicine
      if (/what is a drug|what is drug/i.test(qLow) || /డ్రగ్ అంటే ఏమిటి|డ్రగ్ అంటే ఏంటి|డ్రగ్/.test(q)) {
        if (qLang === 'te') {
          return "**డ్రగ్ (Drug) / ఔషధం:**\n\nడ్రగ్ లేదా ఔషధం అనేది మానవులు లేదా జంతువులలో వ్యాధులను గుర్తించడానికి, నివారించడానికి, చికిత్స చేయడానికి లేదా నొప్పి నుండి ఉపశమనం పొందడానికి ఉపయోగించే ఒక రసాయన లేదా జీవసంబంధిత పదార్థం.\n\n• **వైద్యపరమైన ఉపయోగం:** వైద్యుల సలహా మరియు ప్రిస్క్రిప్షన్ ప్రకారం వాడే మందులు ఆరోగ్యాన్ని కాపాడతాయి.\n⚠️ **హెచ్చరిక:** వైద్యుల సలహా లేకుండా మందులను అనధికారికంగా వాడటం ప్రాణాంతకం.";
        }
        return "A **drug** (or medication / pharmaceutical) is any chemical or biological substance that causes a physiological or psychological change in the body. In medicine, drugs are used under qualified healthcare supervision to diagnose, cure, treat, or prevent diseases and relieve medical symptoms.";
      }

      // Artificial Intelligence & Machine Learning
      if (/artificial intelligence|what is ai|ai ante/i.test(qLow) || /కృత్రిమ మేధస్సు|కృత్రిమ మేధ/.test(q)) {
        if (qLang === 'te') {
          return "**కృత్రిమ మేధస్సు (Artificial Intelligence - AI):**\n\nకృత్రిమ మేధస్సు అనేది మానవుల మాదిరిగానే నేర్చుకోవడం (Learning), ఆలోచించడం (Reasoning), సమస్యల పరిష్కారం (Problem Solving) మరియు భాషను అర్థం చేసుకోవడం వంటి పనులను కంప్యూటర్లు మరియు యంత్రాలు స్వతంత్రంగా చేసేలా రూపొందించబడిన ఆధునిక సాంకేతికత.";
        }
        return "**Artificial Intelligence (AI)** is the branch of computer science dedicated to developing machines and software capable of performing tasks that typically require human intelligence, such as perception, learning, reasoning, and decision-making.";
      }

      if (/machine learning|what is ml/i.test(qLow)) {
        return "Machine Learning (ML) is a branch of artificial intelligence focused on building applications that learn from data and improve their accuracy over time without being explicitly programmed.";
      }

      // Photosynthesis
      if (/photosynthesis/i.test(qLow) || /కిరణజన్య/.test(q)) {
        if (qLang === 'te') {
          return "కిరణజన్య సంయోగ క్రియ (Photosynthesis) అనేది ఆకుపచ్చని మొక్కలు సూర్యరశ్మి, కార్బన్ డయాక్సైడ్ మరియు నీటిని ఉపయోగించి తమ ఆహారాన్ని (గ్లూకోజ్) తయారుచేసుకునే ప్రక్రియ. ఈ ప్రక్రియలో మొక్కలు ఆక్సిజన్‌ను విడుదల చేస్తాయి.";
        }
        return "Photosynthesis is the biological process by which green plants and certain organisms use sunlight, water, and carbon dioxide to synthesize nutrients (glucose) and release oxygen into the atmosphere.";
      }

      // General Knowledge & Famous Figures
      if (/mahatma gandhi|gandhi/i.test(qLow) || /మహాత్మా గాంధీ|గాంధీ ఎవరు/.test(q)) {
        if (qLang === 'te') {
          return "**మహాత్మా గాంధీ (మోహన్‌దాస్ కరంచంద్ గాంధీ):** భారత స్వాతంత్ర్య సమరయోధుడు, 'జాతిపిత'. సత్యం మరియు అహింసా సిద్ధాంతాలతో శాంతియుత పోరాటం సాగించి భారతదేశానికి స్వాతంత్ర్యం సాధించిపెట్టిన మహనీయుడు.";
        }
        return "**Mahatma Gandhi (Mohandas Karamchand Gandhi)** was the leader of India's non-violent independence movement against British rule, revered worldwide as the 'Father of the Nation' and an apostle of truth and non-violence.";
      }

      if (/capital of india/i.test(qLow) || /భారతదేశ రాజధాని/.test(q)) {
        if (qLang === 'te') return "భారతదేశ రాజధాని **న్యూఢిల్లీ (New Delhi)**.";
        return "The capital of India is **New Delhi**.";
      }

      if (/democracy/i.test(qLow) || /ప్రజాస్వామ్యం/.test(q)) {
        if (qLang === 'te') return "**ప్రజాస్వామ్యం (Democracy):** ప్రజల చేత, ప్రజల కొరకు, ప్రజల ద్వారా నడిచే ప్రభుత్వ పాలనా విధానం (Government of the people, by the people, for the people).";
        return "**Democracy** is a system of government where supreme power is vested in the people, exercised either directly or through freely elected representatives.";
      }

      // People & Movies
      if (/mahesh babu/i.test(qLow) && /recent|latest|movie|film/i.test(qLow)) {
        return "Mahesh Babu's latest released film is **Guntur Kaaram** (released in January 2024, directed by Trivikram Srinivas). His next major upcoming film is directed by S.S. Rajamouli (tentatively titled **SSMB29**).";
      }
      if (/pan india/i.test(qLow) && /who|star|hero|actor/i.test(qLow)) {
        return "**Prabhas** is widely recognized as the quintessential modern Pan-India superstar following the historic nationwide success of *Baahubali*. Other leading stars include **Allu Arjun**, **Ram Charan & Jr NTR**, **Yash**, and **Shah Rukh Khan**.";
      }

      // Direct Multilingual Wikipedia REST API lookup directly from browser
      try {
        let clean = q.replace(/(అంటే ఏమిటి|అంటే ఏంటి|అంటే|గురించి చెప్పండి|వివరించండి|ఎవరు|ఎక్కడ ఉంది|ఏమిటి|ఏంటి|\?|\!)/g, '').trim();
        clean = clean.replace(/^(what is the|what is a|what is an|what is|what are|who is the|who is|who was|explain in simple words|explain|tell me about|define|why is|why does)\s+/i, '').replace(/[?!]/g, '').trim();
        if (clean.length >= 2) {
          const wikiLang = ['te', 'hi', 'ta', 'kn', 'ml', 'mr', 'bn', 'gu'].includes(qLang) ? qLang : 'en';
          const searchRes = await fetch(`https://${wikiLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(clean)}&utf8=&format=json&origin=*`);
          if (searchRes.ok) {
            const sData = await searchRes.json();
            const firstResult = sData?.query?.search?.[0];
            if (firstResult?.title) {
              const summaryRes = await fetch(`https://${wikiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(firstResult.title)}`);
              if (summaryRes.ok) {
                const sumData = await summaryRes.json();
                if (sumData?.extract && sumData.extract.length > 30) {
                  return sumData.extract;
                }
              }
            }
          }
        }
      } catch (wikiErr) {
        console.warn('[FarmCopilot] Client Wikipedia fetch error:', wikiErr);
      }

      return null;
    };

    const sendChatRequest = async () => {
      try {
        console.log('[FarmCopilot] Sending chat request:', payload);
        let res;
        try {
          res = await fetch('/api/copilot/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (!res.ok) throw new Error(`Proxy HTTP ${res.status}`);
        } catch (proxyErr) {
          console.warn('[FarmCopilot] Proxy request failed, trying direct backend at 127.0.0.1:8000:', proxyErr);
          res = await fetch('http://127.0.0.1:8000/api/copilot/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }

        if (!res.ok) {
          const errBody = await res.text().catch(() => '');
          console.error(`[FarmCopilot] Server returned HTTP ${res.status}:`, errBody);
          throw new Error(`HTTP ${res.status}: ${errBody}`);
        }

        const data = await res.json();
        setIsTyping(false);
        console.log('[FarmCopilot] Received response from server:', data);
        const botMsgText = data.answer || data.response || getErrorMessage(lang);
        setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: botMsgText, lang: payload.language || lang }]);
      } catch (err) {
        console.warn('[FarmCopilot] Backend unavailable, running resilient browser resolver:', err);
        const clientAnswer = await resolveClientQuery(query, lang);
        setIsTyping(false);
        if (clientAnswer) {
          setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: clientAnswer, lang }]);
        } else {
          setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: getErrorMessage(lang), lang }]);
        }
      }
    };

    sendChatRequest();
  };

  const toggleMic = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
      setIsListening(false);
      return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert(lang === 'te' ? 'మీ బ్రౌజర్ వాయిస్ రికగ్నిషన్‌ని మద్దతు ఇవ్వదు. దయచేసి Chrome లేదా Edge బ్రౌజర్ ఉపయోగించండి.' : (lang === 'hi' ? 'आपका ब्राउज़र वॉयस रिकग्निशन का समर्थन नहीं करता है।' : 'Voice recognition is not supported in this browser. Please use Chrome or Edge.'));
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = getLanguageLocale(lang) || 'en-IN';
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    let finalTranscript = '';

    recognition.onstart = () => {
      console.log('[FarmCopilot] Voice recognition started for lang:', recognition.lang);
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      const currentSaid = finalTranscript || interim;
      if (currentSaid) {
        setInputText(currentSaid);
      }
    };

    recognition.onerror = (event) => {
      console.error('[FarmCopilot] Voice recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        alert(lang === 'te' ? 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్ సెట్టింగ్స్‌లో మైక్రోఫోన్‌ను అనుమతించండి.' : (lang === 'hi' ? 'माइक्रोफ़ोन की अनुमति नहीं है। कृपया ब्राउज़र सेटिंग में अनुमति दें।' : 'Microphone permission was denied. Please allow microphone access in your browser.'));
      }
    };

    recognition.onend = () => {
      console.log('[FarmCopilot] Voice recognition ended. Final text:', finalTranscript);
      setIsListening(false);
      if (finalTranscript && finalTranscript.trim()) {
        const queryText = finalTranscript.trim();
        setInputText('');
        handleSend(queryText);
      }
    };

    try {
      recognition.start();
    } catch (startErr) {
      console.warn('[FarmCopilot] Recognition start error:', startErr);
      setIsListening(false);
    }
  };

  const toggleSpeech = (msg) => {
    if (playingAudioId === msg.id) {
      stopSpeech();
      setPlayingAudioId(null);
      return;
    }

    const speechLang = msg.lang || lang || 'te';

    setPlayingAudioId(msg.id);
    speakText(
      msg.text,
      speechLang,
      () => setPlayingAudioId(msg.id),
      () => setPlayingAudioId(null),
      () => setPlayingAudioId(null)
    );
  };

  const getHeaderTitle = () => {
    if (lang === 'te') return 'కిసాన్ వాయిస్ AI సహాయకుడు';
    if (lang === 'hi') return 'किसान वॉयस AI सहायक';
    if (lang === 'ta') return 'கிசான் குரல் AI உதவியாளர்';
    if (lang === 'kn') return 'ಕಿಸಾನ್ ಧ್ವನಿ AI ಸಹಾಯಕ';
    if (lang === 'mr') return 'किसान व्हॉइस AI सहाय्यक';
    return 'Kisan Voice AI Copilot';
  };

  const getHeaderSubtitle = () => {
    if (lang === 'te') return 'మీ స్వంత భాషలో మాట్లాడి లేదా టైప్ చేసి వ్యవసాయం లేదా ఇతర సందేహాలు అడిగి తెలుసుకోండి.';
    if (lang === 'hi') return 'अपनी मातृभाषा में बोलकर या लिखकर खेती, मौसम या किसी भी विषय पर पूछें।';
    if (lang === 'ta') return 'உங்கள் தாய்மொழியில் பேசி அல்லது எழுதி வேளாண்மை மற்றும் பிற கேள்விகளை அறியவும்.';
    if (lang === 'kn') return 'ನಿಮ್ಮ ಮಾತೃಭಾಷೆಯಲ್ಲಿ ಮಾತನಾಡಿ ಅಥವಾ ಬರೆದು ಕೃಷಿ ಮತ್ತು ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ.';
    return 'Ask farming queries or general questions by voice or text in your selected language.';
  };

  const getPlaceholder = () => {
    if (lang === 'te') return 'మీ సందేహాన్ని అడగండి (వ్యవసాయం లేదా ఏదైనా)...';
    if (lang === 'hi') return 'अपना प्रश्न पूछें (कृषि या सामान्य)...';
    if (lang === 'ta') return 'உங்கள் கேள்வியைக் கேளுங்கள்...';
    if (lang === 'kn') return 'ನಿಮ್ಮ ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳಿ...';
    return 'Ask your question (farming or general)...';
  };

  const getSendLabel = () => {
    if (lang === 'te') return 'పంపండి';
    if (lang === 'hi') return 'भेजें';
    if (lang === 'ta') return 'அனுப்பு';
    if (lang === 'kn') return 'ಕಳುಹಿಸಿ';
    return 'Send';
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎤</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C3333]">
            {getHeaderTitle()}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-3xl">
          {getHeaderSubtitle()}
        </p>
      </div>

      {/* Main Chat Window */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        {/* Messages Container */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
          
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border ${
                msg.sender === 'user'
                  ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}>
                {msg.sender === 'user' ? '👨‍🌾' : '🤖'}
              </div>

              <div className={`max-w-[80%] p-4 rounded-3xl space-y-2 shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-emerald-100/90 text-emerald-950 rounded-tr-none font-bold text-xs sm:text-sm border border-emerald-200'
                  : 'bg-white text-slate-800 rounded-tl-none font-semibold text-xs sm:text-sm border border-slate-200'
              }`}>
                <div className="leading-relaxed whitespace-pre-line">{msg.text}</div>

                {msg.sender === 'bot' && (
                  <div className="flex items-center gap-3 pt-1 border-t border-slate-100">
                    <button
                      onClick={() => toggleSpeech(msg)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] hover:underline cursor-pointer"
                    >
                      <Volume2 className={`w-3.5 h-3.5 ${playingAudioId === msg.id ? 'animate-bounce text-rose-600' : ''}`} />
                      <span>{playingAudioId === msg.id ? (lang === 'te' ? 'ఆపండి' : 'Stop') : (lang === 'te' ? '🔊 వాయిస్ వినండి' : (lang === 'hi' ? '🔊 सुनें' : '🔊 Listen'))}</span>
                    </button>

                    <a
                      href="tel:18001801551"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2D6A4F] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 hover:bg-emerald-100"
                    >
                      <PhoneCall className="w-3 h-3 text-[#2D6A4F]" />
                      <span>1800-180-1551</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-max animate-pulse">
              <Sparkles className="w-4 h-4 text-[#2D6A4F] animate-spin" />
              <span>{lang === 'hi' ? 'उत्तर तैयार हो रहा है...' : (lang === 'te' ? 'సమాధానం సిద్ధం చేస్తున్నాను...' : 'Kisan AI is typing...')}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Chips Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto no-scrollbar">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#2D6A4F] border border-slate-200 text-xs font-semibold shrink-0 transition-all cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-emerald-100 flex items-center gap-2">
          <button
            onClick={toggleMic}
            className={`min-h-[48px] px-4 rounded-full font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-200'
                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200'
            }`}
            title="Speak Question"
          >
            <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{isListening ? (lang === 'te' ? 'వింటున్నాను...' : 'Listening...') : (lang === 'te' ? 'మాట్లాడండి' : (lang === 'hi' ? 'बोलें' : 'Voice'))}</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={getPlaceholder()}
            className="flex-1 min-h-[48px] bg-slate-50 border border-slate-200 rounded-full px-4 text-xs sm:text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2D6A4F] transition-all"
          />

          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className="min-h-[48px] px-5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shrink-0 cursor-pointer"
          >
            <span>{getSendLabel()}</span>
            <Send className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
}
