import React, { useState } from 'react';
import { Camera, Sun, TrendingUp, Mic, Volume2, Scroll, Calendar, Sparkles, ArrowRight, ShieldAlert, CheckCircle2, Zap } from 'lucide-react';
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
      ? `నమస్కారం ${farmerName} గారూ! ఈ రోజు మీ ${cropName} తోట గురించిన ఉదయం సమాచారం: ఈ రోజు మధ్యాహ్నం 2 గంటలకు వర్షం పడే అవకాశం ఉంది, కాబట్టి మందు కొట్టడం మరియు నీటి పారుదల ఆపండి. మండీలో టమాటా ధర రూ. 2,600/క్వింటాల్ ఉంది, 3 రోజులు ఆగితే ధర పెరుగుతుంది.`
      : (lang === 'hi'
        ? `नमस्ते ${farmerName} जी! आज दोपहर 2 बजे बारिश का अनुमान है। आज छिड़काव और सिंचाई रोक दें। मंडी में टमाटर का भाव ₹2,600 प्रति क्विंटल है, 3 दिन बाद बेचें।`
        : `Good Morning ${farmerName}! Today rain is expected at 2 PM in ${district}. Avoid spraying pesticides and pause irrigation. Mandi price is ₹2,600/qtl, hold 3 days for higher price.`);

    setIsPlayingBriefing(true);
    speakText(
      briefingText,
      lang,
      () => setIsPlayingBriefing(true),
      () => setIsPlayingBriefing(false),
      () => setIsPlayingBriefing(false)
    );
  };

  const orbitalFeatures = [
    {
      id: 'doctor',
      title: lang === 'hi' ? '📷 फसल एवं रोग निदान (AI लेंस)' : (lang === 'te' ? '📷 పంట వ్యాధి గుర్తింపు AI లెన్స్' : '📷 Crop Disease Lens'),
      subtitle: lang === 'hi' ? 'पौधे की फोटो लें और रोग व दवाई का सुझाव पाएं।' : (lang === 'te' ? 'ఆకు, పండు లేదా పూల ఫోటో తీసి పంట వ్యాధులను తక్షణమే గుర్తించండి.' : 'Diagnose plant diseases instantly by uploading leaf or fruit photos.'),
      btnText: lang === 'hi' ? 'फसल जांचें ➔' : (lang === 'te' ? 'పంట వ్యాధి స్కాన్ చేయండి ➔' : 'Scan Crop Disease ➔'),
      icon: Camera,
      badge: lang === 'hi' ? 'फसल जांच' : (lang === 'te' ? 'వ్యాధి AI స్కాన్' : 'Vision AI'),
      circleBg: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      id: 'weather',
      title: lang === 'hi' ? '🌦️ लाइव मौसम सलाह' : (lang === 'te' ? '🌦️ ఈనాటి వాతావరణ హెచ్చరికలు' : '🌦️ Weather Advisory'),
      subtitle: lang === 'hi' ? 'आज बारिश का अनुमान। छिड़काव और सिंचाई रोक दें।' : (lang === 'te' ? 'ఈ రోజు మధ్యాహ్నం వర్షం పడే అవకాశం ఉంది. మందుల పిచికారీ నిలిపివేయండి.' : 'Rain expected today. Hold spraying pesticides and irrigation.'),
      btnText: lang === 'hi' ? 'मौसम देखें ➔' : (lang === 'te' ? 'వాతావరణ వివరాలు చూడండి ➔' : 'View Weather ➔'),
      icon: Sun,
      badge: lang === 'hi' ? 'मौसम सलाह' : (lang === 'te' ? 'వర్షపాత హెచ్చరిక' : 'Weather Alert'),
      circleBg: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'market',
      title: lang === 'hi' ? '💰 लाइव मंडी भाव' : (lang === 'te' ? '💰 రూపాయికి సరైన మార్కెట్ ధరలు' : '💰 Live Mandi Prices'),
      subtitle: lang === 'hi' ? 'गुंटूर एवं निकटतम मंडियों के प्रति क्विंटल थोक भाव।' : (lang === 'te' ? 'గుంటూరు & విజయవాడ యార్డ్‌లలో ప్రస్తుత క్వింటాల్ ధరలు.' : 'Live market rates per quintal for Tomato, Paddy, Chilli & Cotton.'),
      btnText: lang === 'hi' ? 'मंडी भाव देखें ➔' : (lang === 'te' ? 'ధరల వివరాలు చూడండి ➔' : 'Check Prices ➔'),
      icon: TrendingUp,
      badge: lang === 'hi' ? 'मंडी भाव' : (lang === 'te' ? 'మండీ రేట్లు' : 'Mandi Rates'),
      circleBg: 'bg-sky-100 text-sky-800 border-sky-200'
    },
    {
      id: 'schemes',
      title: lang === 'hi' ? '🏛️ सरकारी योजनाएं' : (lang === 'te' ? '🏛️ ప్రభుత్వ పథకాలు & రాయితీలు' : '🏛️ Government Schemes'),
      subtitle: lang === 'hi' ? 'पीएम-किसान, फसल बीमा और वित्तीय सब्सिडी।' : (lang === 'te' ? 'పిఎం కిసాన్, రైతు భరోసా మరియు ఉచిత పంట భీమా పధకాలు.' : 'PM-KISAN, Rythu Bharosa, and Crop Insurance Subsidies.'),
      btnText: lang === 'hi' ? 'योजनाएं देखें ➔' : (lang === 'te' ? 'పథకాలు చూడండి ➔' : 'View Schemes ➔'),
      icon: Scroll,
      badge: lang === 'hi' ? 'सब्सिडी' : (lang === 'te' ? 'రాయితీలు' : 'Govt Subsidy'),
      circleBg: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 🌟 1. HERO ORBITAL FARMER FRIEND BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-emerald-100 p-6 sm:p-8 shadow-sm">
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          
          {/* Left Text Greeting */}
          <div className="space-y-3 flex-1 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-[#2D6A4F] border border-emerald-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span>{lang === 'hi' ? 'आज का किसान AI समाचार' : (lang === 'te' ? 'ఈనాటి రైతు AI సమాచారం' : 'Daily Farmer AI Advisory')}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#2C3333] tracking-tight">
              {t('home.greetingPrefix') || (lang === 'hi' ? 'नमस्ते' : (lang === 'te' ? 'నమస్కారం' : 'Namaskaram'))} <span className="text-[#2D6A4F]">{farmerName}</span> {t('home.greetingSuffix') || (lang === 'te' ? 'గారూ!' : 'ji!')} 🌅
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-semibold">
              📍 {village}, {district} • 🌾 {lang === 'te' ? 'సాగు పంట' : 'Crop'}: <span className="text-[#2D6A4F] font-bold">{cropName}</span>
            </p>

            {/* Prominent Audio Briefing Button */}
            <div className="pt-2">
              <button
                onClick={toggleBriefing}
                className={`w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-full font-bold text-xs sm:text-sm flex items-center justify-center gap-3 cursor-pointer shadow-sm transition-all duration-200 ${
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

          {/* Right Central Circular Farmer Illustration Feature Badge */}
          <div className="relative flex items-center justify-center shrink-0 w-56 h-56 sm:w-64 sm:h-64">
            
            {/* Outer Soft Orbit Rings */}
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-200 animate-spin-slow" style={{ animationDuration: '40s' }} />
            <div className="absolute inset-3 rounded-full bg-emerald-50/60 border border-emerald-100" />

            {/* Center Circular Farmer Badge */}
            <div className="relative z-10 w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-tr from-emerald-100 via-teal-50 to-amber-50 border-4 border-white shadow-md flex flex-col items-center justify-center text-center p-3">
              <span className="text-4xl sm:text-5xl mb-1">👨‍🌾</span>
              <span className="text-xs font-black text-[#2D6A4F] tracking-tight">Kisan Mitra</span>
              <span className="text-[10px] text-slate-500 font-bold">{lang === 'hi' ? "किसान मित्र" : "Farmer's Friend"}</span>
            </div>

            {/* Orbiting Satellite Pastel Icon Badges */}
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-emerald-100 border-2 border-white shadow-sm flex items-center justify-center text-emerald-800" title="Vision AI">
              <Camera className="w-5 h-5" />
            </div>

            <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-10 h-10 rounded-full bg-amber-100 border-2 border-white shadow-sm flex items-center justify-center text-amber-800" title="Weather Advisory">
              <Sun className="w-5 h-5" />
            </div>

            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-sky-100 border-2 border-white shadow-sm flex items-center justify-center text-sky-800" title="Mandi Prices">
              <TrendingUp className="w-5 h-5" />
            </div>

            <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-10 h-10 rounded-full bg-purple-100 border-2 border-white shadow-sm flex items-center justify-center text-purple-800" title="Voice AI">
              <Mic className="w-5 h-5" />
            </div>

          </div>

        </div>

        {/* Quick Weather & Mandi Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 mt-6 border-t border-emerald-100">
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">🌦️ {lang === 'hi' ? 'मौसम सलाह आज' : (lang === 'te' ? 'వాతావరణ హెచ్చరిక' : 'Weather Advisory Today')}</div>
              <div className="text-[11px] text-slate-600 font-semibold">{lang === 'hi' ? 'दोपहर 2 बजे बारिश। छिड़काव रोक दें।' : (lang === 'te' ? 'మధ్యాహ్నం 2 గంటలకు వర్షం. మందు కొట్టడం ఆపండి.' : 'Rain expected at 2 PM. Hold pesticide spray.')}</div>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">💰 {cropName} {lang === 'hi' ? 'मंडी भाव' : (lang === 'te' ? 'మండీ ధర' : 'Mandi Rate')}</div>
              <div className="text-[11px] text-slate-600 font-semibold">{lang === 'hi' ? '₹2,600 / क्विंटल • 3 दिन बाद बेचें।' : (lang === 'te' ? '₹2,600 / క్వింటాల్ • 3 రోజులు ఆగితే ధర పెరుగుతుంది.' : '₹2,600 / Quintal • Hold 3 days for higher price.')}</div>
            </div>
          </div>
        </div>

      </div>

      {/* 🚀 2. QUICK SHORTCUTS BAR */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#2D6A4F]" />
          <span>{lang === 'hi' ? 'त्वरित सेवाएँ' : (lang === 'te' ? 'తక్షణ సేవలు & షార్ట్‌కట్‌లు' : 'Quick Actions & Shortcuts')}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onSelectAction('doctor')}
            className="min-h-[52px] p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex items-center gap-3 group shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'hi' ? 'फसल जांच' : (lang === 'te' ? 'పంట స్కాన్' : 'Scan Crop')}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{lang === 'hi' ? 'गूगल लेंस AI' : (lang === 'te' ? 'ఫోటో AI లెన్స్' : 'Photo Lens AI')}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('copilot')}
            className="min-h-[52px] p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex items-center gap-3 group shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'hi' ? 'वॉयस प्रश्न' : (lang === 'te' ? 'వాయిస్ ప్రశ్న' : 'Voice Query')}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{lang === 'hi' ? 'AI से बात करें' : (lang === 'te' ? 'AI తో మాట్లాడండి' : 'Talk to Kisan AI')}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('market')}
            className="min-h-[52px] p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex items-center gap-3 group shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'hi' ? 'मंडी भाव' : (lang === 'te' ? 'మండీ ధరలు' : 'Mandi Rate')}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{lang === 'hi' ? 'आज का भाव' : (lang === 'te' ? 'ఈనాటి ధరలు' : "Today's Prices")}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('calendar')}
            className="min-h-[52px] p-3.5 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50/50 text-left transition-all cursor-pointer flex items-center gap-3 group shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#2C3333]">{lang === 'hi' ? 'कैलेंडर' : (lang === 'te' ? 'క్యాలెండర్' : 'Calendar')}</div>
              <div className="text-[10px] text-slate-500 font-semibold">{lang === 'hi' ? 'बुवाई सूची' : (lang === 'te' ? 'విత్తనాల షెడ్యూల్' : 'Sowing Schedule')}</div>
            </div>
          </button>
        </div>
      </div>

      {/* 🌾 3. MAIN FEATURE CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {orbitalFeatures.map((card) => {
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
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
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
