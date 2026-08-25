import React, { useState } from 'react';
import { Camera, Sun, TrendingUp, Mic, Volume2, Scroll, Calendar, Sparkles, ArrowRight, ShieldAlert, CheckCircle2, Zap, PhoneCall, Building2, Landmark, MapPin, Sprout, Droplets } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function KisanHomeGrid({ profile, onSelectAction }) {
  const { lang, t } = useLanguage();
  const [isPlayingBriefing, setIsPlayingBriefing] = useState(false);

  const farmerName = profile?.farmer_name || 'Ramesh';
  const cropName = profile?.main_crop || 'Tomato';
  const village = profile?.village || 'Mangalagiri';
  const district = profile?.district || 'Guntur';

  const toggleBriefing = () => {
    if (isPlayingBriefing) {
      stopSpeech();
      setIsPlayingBriefing(false);
      return;
    }

    const briefingText = lang === 'te'
      ? `నమస్కారం ${farmerName} గారూ! ఈ రోజు మీ ${cropName} తోట గురించిన ఉదయం సమాచారం: కిసాన్ కాల్ సెంటర్ ఉచిత నంబర్ 1800-180-1551 మరియు గ్రామ సహాయకులు అందుబాటులో ఉన్నారు. ${district} లో వర్షపాతం పడే అవకాశం ఉంది. పిఎం కిసాన్ మరియు ఫసల్ బీమా పథకాలు అందుబాటులో ఉన్నాయి.`
      : (lang === 'hi'
        ? `नमस्ते ${farmerName} जी! किसान कॉल सेंटर टोल-फ्री 1800-180-1551 और स्थानीय अधिकारी सहायता के लिए तैयार हैं। आज ${district} में बारिश का अनुमान है। पीएम-किसान और फसल बीमा योजनाएं उपलब्ध हैं।`
        : `Good Morning ${farmerName}! Kisan Call Centre Toll-Free 1800-180-1551 and local village officers are active. Today rain is expected in ${district}. PM-KISAN and Crop Insurance schemes are live.`);

    setIsPlayingBriefing(true);
    speakText(
      briefingText,
      lang,
      () => setIsPlayingBriefing(true),
      () => setIsPlayingBriefing(false),
      () => setIsPlayingBriefing(false)
    );
  };

  const mainFeatureCards = [
    {
      id: 'doctor',
      title: lang === 'hi' ? '📷 फसल एवं रोग निदान (AI लेंस)' : (lang === 'te' ? '📷 పంట వ్యాధి గుర్తింపు AI లెన్స్' : '📷 Crop Disease AI Lens'),
      subtitle: lang === 'hi' ? 'पौधे की फोटो लें और कीट व सटीक दवाइयों की मात्रा पाएं।' : (lang === 'te' ? 'ఆకు లేదా పండు ఫోటో తీసి పంట వ్యాధులు మరియు పిచికారీ మందు మోతాదు పొందండి.' : 'Scan crop photos to identify diseases, pests, and exact chemical dosages.'),
      btnText: lang === 'hi' ? 'फसल जांचें ➔' : (lang === 'te' ? 'పంట వ్యాధి స్కాన్ చేయండి ➔' : 'Scan Crop Disease ➔'),
      icon: Camera,
      badge: lang === 'hi' ? 'रोग निदान' : (lang === 'te' ? 'వ్యాధి AI స్కాన్' : 'Vision AI'),
      circleBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'copilot',
      title: lang === 'hi' ? '🤖 किसान AI वॉयस सहायक (100% उत्तर)' : (lang === 'te' ? '🤖 కిసాన్ AI వాయిస్ కోపైలట్ (100% సలహాలు)' : '🤖 Kisan AI Copilot (100% Unrestricted Answers)'),
      subtitle: lang === 'hi' ? 'खेती, मौसम, मशीनरी या किसी भी प्रश्न का अपनी भाषा में उत्तर पाएं।' : (lang === 'te' ? 'వ్యవసాయం, ఎరువులు, యంత్రాలు లేదా మీరు ఏది అడిగినా 100% స్పష్టమైన సమాధానం ఇస్తుంది.' : 'Ask ANY farming or general question and get warm, intelligent audio answers in your native language.'),
      btnText: lang === 'hi' ? 'प्रश्न पूछें ➔' : (lang === 'te' ? 'AI ని అడగండి ➔' : 'Ask AI Copilot ➔'),
      icon: Mic,
      badge: lang === 'hi' ? 'वॉयस AI' : (lang === 'te' ? '100% AI సలహా' : 'Universal AI'),
      circleBg: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      id: 'support',
      title: lang === 'hi' ? '📞 कृषि अधिकारी एवं हेल्पलाइन केंद्र' : (lang === 'te' ? '📞 రైతు మద్దతు & ముఖ్యమైన ఫోన్ నంబర్లు' : '📞 Farmer Support & Verified Officer Contacts'),
      subtitle: lang === 'hi' ? 'किसान कॉल सेंटर 1800-180-1551 एवं स्थानीय ग्राम सहायक (VAA, VRO) नंबर।' : (lang === 'te' ? 'కిసాన్ కాల్ సెంటర్ 1800-180-1551 (ఉచితం) మరియు గ్రామ వ్యవసాయ అధికారుల నంబర్లు.' : 'Kisan Call Centre 1800-180-1551 (24/7 Toll-Free) & local village officers (VAA, VRO, MRI).'),
      btnText: lang === 'hi' ? 'संपर्क देखें ➔' : (lang === 'te' ? 'అధికారులను కలవండి ➔' : 'View Officer Contacts ➔'),
      icon: PhoneCall,
      badge: lang === 'hi' ? '1800-180-1551' : (lang === 'te' ? 'హెల్ప్‌లైన్ నంబర్లు' : 'Direct Helpline'),
      circleBg: 'bg-rose-100 text-rose-800 border-rose-200'
    },
    {
      id: 'schemes',
      title: lang === 'hi' ? '🏛️ शासकीय योजनाएं एवं 6 सब्सिडी' : (lang === 'te' ? '🏛️ అధికారిక ప్రభుత్వ పథకాలు & రాయితీలు' : '🏛️ Official Government Schemes & Subsidies'),
      subtitle: lang === 'hi' ? 'पीएम-किसान (₹6,000), रायथु भरोसा (₹13,500), फसल बीमा और ड्रिप सब्सिडी।' : (lang === 'te' ? 'పీఎం కిసాన్ (₹6,000), రైతు భరోసా (₹13,500), 100% బీమా మరియు డ్రిప్ 90% సబ్సిడీ.' : 'PM-KISAN (₹6k), Rythu Bharosa (₹13.5k), PMFBY 100% Insurance & Drip Subsidies.'),
      btnText: lang === 'hi' ? 'योजनाएं देखें ➔' : (lang === 'te' ? 'పథకాలు చూడండి ➔' : 'View All Schemes ➔'),
      icon: Scroll,
      badge: lang === 'hi' ? '6 योजनाएं' : (lang === 'te' ? '6 ప్రభుత్వ పథకాలు' : '6 Govt Schemes'),
      circleBg: 'bg-indigo-100 text-indigo-800 border-indigo-200'
    },
    {
      id: 'calendar',
      title: lang === 'hi' ? '📅 गांव वार स्मार्ट कृषि कैलेंडर' : (lang === 'te' ? '📅 గ్రామాల వారీ స్మార్ట్ వ్యవసాయ క్యాలెండర్' : '📅 Village-Searchable Smart Farming Calendar'),
      subtitle: lang === 'hi' ? 'गांव खोजें और स्थानीय मौसम, मिट्टी व फसल विकास आधारित कार्य सूची पाएं।' : (lang === 'te' ? 'మీ గ్రామం పేరు టైప్ చేసి ప్రత్యక్ష సాటిలైట్ వాతావరణం & నేల పనుల జాబితా పొందండి.' : 'Search any village to generate weather-driven tasks based on local soil NPK & crop growth stage.'),
      btnText: lang === 'hi' ? 'कैलेंडर खोलें ➔' : (lang === 'te' ? 'క్యాలెండర్ చూడండి ➔' : 'Search Village Calendar ➔'),
      icon: Calendar,
      badge: lang === 'hi' ? 'गांव कैलेंडर' : (lang === 'te' ? 'గ్రామ క్యాలెండర్' : 'Village Search'),
      circleBg: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'market',
      title: lang === 'hi' ? '💰 क्षेत्रीय थोक मंडी भाव' : (lang === 'te' ? '💰 ప్రాంతీయ మార్కెట్ ధరలు & అమ్మకం సలహా' : '💰 Regional Mandi Prices & Selling Window'),
      subtitle: lang === 'hi' ? 'गुंटूर, विजयवाड़ा, हैदराबाद और निकटतम मंडियों के भाव व मुनाफा सलाह।' : (lang === 'te' ? 'గుంటూరు, విజయవాడ, హైదరాబాద్ మండీ ధరలు మరియు రాబోయే 3 రోజుల ధరల అంచనా.' : 'Live area-specific mandi rates per quintal & optimal 3-day holding advice.'),
      btnText: lang === 'hi' ? 'मंडी भाव देखें ➔' : (lang === 'te' ? 'ధరల వివరాలు చూడండి ➔' : 'Check Mandi Rates ➔'),
      icon: TrendingUp,
      badge: lang === 'hi' ? 'मंडी भाव' : (lang === 'te' ? 'మండీ రేట్లు' : 'Live Mandi'),
      circleBg: 'bg-sky-100 text-sky-800 border-sky-200'
    }
  ];

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 🌟 1. HERO FARMER FRIEND BANNER MATCHING SAMPLE IMAGE 2 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-[#F4F9F4] to-white border border-emerald-200 p-6 sm:p-10 shadow-md">
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          
          {/* Left Text Greeting */}
          <div className="space-y-4 flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-[#2D6A4F] border border-emerald-200 text-xs font-extrabold shadow-sm">
              <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
              <span>{lang === 'hi' ? 'आज का किसान AI समाचार' : (lang === 'te' ? 'ఈనాటి రైతు AI సమాచారం' : 'Daily Farmer AI Advisory')}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-[#2C3333] tracking-tight">
              {t('home.greetingPrefix') || (lang === 'hi' ? 'नमस्ते' : (lang === 'te' ? 'నమస్కారం' : 'Namaskaram'))} <span className="text-[#2D6A4F]">{farmerName}</span> {t('home.greetingSuffix') || (lang === 'te' ? 'గారూ!' : 'ji!')} 🌅
            </h2>

            <p className="text-sm sm:text-base text-slate-600 font-semibold">
              📍 {village}, {district} • 🌾 {lang === 'te' ? 'సాగు పంట' : 'Crop'}: <span className="text-[#2D6A4F] font-bold">{cropName}</span>
            </p>

            {/* Audio Briefing Button */}
            <div className="pt-2">
              <button
                onClick={toggleBriefing}
                className={`w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-full font-extrabold text-sm flex items-center justify-center gap-3 cursor-pointer shadow-md transition-all duration-200 ${
                  isPlayingBriefing
                    ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-200 animate-pulse'
                    : 'bg-[#2D6A4F] hover:bg-[#1B4332] text-white shadow-emerald-100 hover:scale-105'
                }`}
              >
                <Volume2 className={`w-5 h-5 ${isPlayingBriefing ? 'animate-bounce' : ''}`} />
                <span>
                  {isPlayingBriefing
                    ? (lang === 'hi' ? 'रोकें ⏹️' : (lang === 'te' ? 'ఆపండి ⏹️' : 'Stop Audio ⏹️'))
                    : (lang === 'hi' ? '🔊 सुबह का समाचार सुनें' : (lang === 'te' ? '🔊 ఉదయం సలహా వినండి' : '🔊 Listen Morning Audio'))}
                </span>
              </button>
            </div>
          </div>

          {/* Right Circular Indian Farmer Illustration Artwork Matching Sample Image 2 */}
          <div className="relative flex items-center justify-center shrink-0 w-64 h-64 sm:w-80 sm:h-80">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-300/80 bg-emerald-100/50 shadow-inner" />
            <div className="absolute inset-3 rounded-full border-2 border-dashed border-emerald-400 animate-spin-slow" style={{ animationDuration: '60s' }} />

            {/* Large Prominent Center Circular Farmer Image Artwork */}
            <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-b from-amber-50 via-emerald-50 to-emerald-100 group">
              <img 
                src="/assets/farmer_avatar.jpg" 
                alt="Indian Farmer in Field" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="hidden w-full h-full flex-col items-center justify-center text-center p-3 bg-gradient-to-tr from-emerald-100 to-amber-50">
                <span className="text-5xl mb-1">👨‍🌾</span>
                <span className="text-sm font-black text-[#2D6A4F]">Kisan Mitra</span>
              </div>
            </div>

            {/* Orbit Badges Matching Image 2 */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]" title="Sun Weather">
              <Sun className="w-5 h-5" />
            </div>

            <div className="absolute top-1/4 -right-1 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]" title="Crop Health">
              <Sprout className="w-5 h-5" />
            </div>

            <div className="absolute bottom-1/4 -right-1 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]" title="Water Irrigation">
              <Droplets className="w-5 h-5" />
            </div>

            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]" title="Vision AI">
              <Camera className="w-5 h-5" />
            </div>

            <div className="absolute bottom-1/4 -left-1 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]" title="Voice AI">
              <Mic className="w-5 h-5" />
            </div>

            <div className="absolute top-1/4 -left-1 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]" title="Mandi Prices">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

        </div>

        {/* Quick Weather & Kisan Helpline Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 mt-6 border-t border-emerald-200">
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">🌦️ {lang === 'hi' ? 'मौसम सलाह' : (lang === 'te' ? 'వాతావరణ హెచ్చరిక' : 'Weather Advisory Today')}</div>
              <div className="text-xs text-slate-600 font-semibold">{lang === 'hi' ? 'आज बारिश का अनुमान। छिड़काव रोक दें।' : (lang === 'te' ? 'మధ్యాహ్నం 2 గంటలకు వర్షం. మందు కొట్టడం ఆపండి.' : 'Rain expected today. Pause spraying & irrigation.')}</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/90 border border-rose-200 flex items-center gap-3 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900">📞 {lang === 'hi' ? 'किसान कॉल सेंटर' : (lang === 'te' ? 'కిసాన్ హెల్ప్‌లైన్ నంబర్' : 'Kisan Call Centre')}</div>
              <div className="text-xs text-slate-600 font-semibold">
                <span className="font-extrabold text-rose-700">1800-180-1551</span> (24/7 {lang === 'te' ? 'ఉచితం' : 'Toll-Free'})
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* 🚀 2. QUICK ACTION SHORTCUTS STRIP */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#2D6A4F]" />
          <span>{lang === 'hi' ? 'त्वरित सेवाएँ एवं शॉर्टकट' : (lang === 'te' ? 'తక్షణ సేవలు & షార్ట్‌కట్‌లు' : 'Quick Actions & Instant Shortcuts')}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <button
            onClick={() => onSelectAction('doctor')}
            className="p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group shadow-sm min-h-[76px]"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'te' ? 'పంట స్కాన్' : 'Crop Doctor'}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{lang === 'te' ? 'వ్యాధి AI' : 'Vision AI'}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('copilot')}
            className="p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group shadow-sm min-h-[76px]"
          >
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'te' ? 'AI కోపైలట్' : 'AI Copilot'}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{lang === 'te' ? '100% సలహా' : 'Universal AI'}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('support')}
            className="p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group shadow-sm min-h-[76px]"
          >
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'te' ? 'అధికారులు' : 'Officer Contacts'}</div>
              <div className="text-[10px] text-slate-500 font-semibold">1800-180-1551</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('schemes')}
            className="p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group shadow-sm min-h-[76px]"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Scroll className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'te' ? 'పథకాలు' : 'Govt Schemes'}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{lang === 'te' ? '6 రాయితీలు' : '6 Subsidies'}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('calendar')}
            className="p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group shadow-sm min-h-[76px]"
          >
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'te' ? 'గ్రామ క్యాలెండర్' : 'Village Calendar'}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{lang === 'te' ? 'వాతావరణ పనులు' : 'Weather Tasks'}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('market')}
            className="p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex flex-col justify-between gap-2 group shadow-sm min-h-[76px]"
          >
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'te' ? 'మండీ రేట్లు' : 'Mandi Rates'}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{lang === 'te' ? 'ఈనాటి ధరలు' : 'Live Prices'}</div>
            </div>
          </button>
        </div>
      </div>

      {/* 🌾 3. ALL MAIN NEW FEATURE CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainFeatureCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectAction(card.id)}
              className="p-6 rounded-3xl bg-white border border-emerald-100 hover:border-emerald-300 transition-all duration-200 shadow-sm flex flex-col justify-between cursor-pointer group hover:shadow-md space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-full ${card.circleBg} border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2C3333] leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold mt-2 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="w-full py-3 px-4 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <span>{card.btnText}</span>
                <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
