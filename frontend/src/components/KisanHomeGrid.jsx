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

  const mainFeatureCards = [
    {
      id: 'doctor',
      title: lang === 'te' ? '📷 పంట & వ్యాధి గుర్తింపు AI లెన్స్' : (lang === 'hi' ? '📷 फसल रोग पहचान लेंस' : '📷 Crop Disease Lens'),
      subtitle: lang === 'te' ? 'ఆకు, పండు, కాండం లేదా పూల ఫోటో తీసి పంట వ్యాధులను తక్షణమే గుర్తించండి.' : 'Upload photo of leaf, fruit, stem or flower to diagnose crop diseases instantly.',
      btnText: lang === 'te' ? 'పంట వ్యాధి స్కాన్ చేయండి ➔' : 'Scan Crop Disease ➔',
      icon: Camera,
      badge: lang === 'te' ? 'వ్యాధి AI స్కాన్' : 'Vision AI Engine',
      gradient: 'from-emerald-950/90 via-slate-900 to-teal-950/90 border-emerald-500/50 hover:border-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      iconBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
    },
    {
      id: 'weather',
      title: lang === 'te' ? '🌦️ ఈనాటి వాతావరణ హెచ్చరికలు' : (lang === 'hi' ? '🌦️ मौसम सलाह' : '🌦️ Live Weather Advisory'),
      subtitle: lang === 'te' ? 'ఈ రోజు మధ్యాహ్నం వర్షం పడే అవకాశం ఉంది. మందుల పిచికారీ మరియు నీటిపారుదల నిలిపివేయండి.' : 'Rain expected today. Pause spraying pesticides & irrigation.',
      btnText: lang === 'te' ? 'వాతావరణ వివరాలు చూడండి ➔' : 'View Weather Details ➔',
      icon: Sun,
      badge: lang === 'te' ? 'వర్షపాత హెచ్చరిక' : 'Weather Alert',
      gradient: 'from-amber-950/90 via-slate-900 to-orange-950/90 border-amber-500/50 hover:border-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      iconBg: 'bg-amber-500/20 text-amber-400 border-amber-500/40'
    },
    {
      id: 'market',
      title: lang === 'te' ? '💰 రూపాయికి సరైన మార్కెట్ ధరలు' : (lang === 'hi' ? '💰 लाइव मंडी भाव' : '💰 Live Mandi Prices'),
      subtitle: lang === 'te' ? 'గుంటూరు & విజయవాడ యార్డ్‌లలో ప్రస్తుత క్వింటాల్ ధరలు.' : 'Live market prices per quintal for Tomato, Paddy, Chilli & Cotton.',
      btnText: lang === 'te' ? 'ధరల వివరాలు చూడండి ➔' : 'Check Market Prices ➔',
      icon: TrendingUp,
      badge: lang === 'te' ? 'మండీ రేట్లు' : 'Mandi Trends',
      gradient: 'from-cyan-950/90 via-slate-900 to-blue-950/90 border-cyan-500/50 hover:border-cyan-400',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      iconBg: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
    },
    {
      id: 'schemes',
      title: lang === 'te' ? '🏛️ ప్రభుత్వ పథకాలు & రాయితీలు' : (lang === 'hi' ? '🏛️ सरकारी योजनाएं' : '🏛️ Government Schemes'),
      subtitle: lang === 'te' ? 'పిఎం కిసాన్, రైతు భరోసా మరియు ఉచిత పంట భీమా పధకాలు.' : 'PM-KISAN, Rythu Bharosa, and Crop Insurance Subsidies.',
      btnText: lang === 'te' ? 'పథకాలు చూడండి ➔' : 'View Govt Schemes ➔',
      icon: Scroll,
      badge: lang === 'te' ? 'రాయితీలు' : 'Govt Benefits',
      gradient: 'from-purple-950/90 via-slate-900 to-indigo-950/90 border-purple-500/50 hover:border-purple-400',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      iconBg: 'bg-purple-500/20 text-purple-400 border-purple-500/40'
    }
  ];

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* 🌟 1. HERO FARMER AUDIO BRIEFING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-emerald-400" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{lang === 'te' ? 'ఈనాటి రైతు AI సమాచారం' : (lang === 'hi' ? 'आज का किसान AI समाचार' : 'Daily Farmer AI Advisory')}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
                {t('home.greetingPrefix') || (lang === 'te' ? 'నమస్కారం' : 'Namaskaram')} <span className="text-emerald-400">{farmerName}</span> {t('home.greetingSuffix') || (lang === 'te' ? 'గారూ!' : '')} 🌅
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-bold">
                📍 {village}, {district} • 🌾 {lang === 'te' ? 'సాగు పంట' : 'Crop'}: <span className="text-emerald-400 font-black">{cropName}</span>
              </p>
            </div>

            {/* Prominent Voice Briefing Button */}
            <button
              onClick={toggleBriefing}
              className={`min-h-[52px] px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-3 cursor-pointer shadow-xl transition-all duration-300 shrink-0 ${
                isPlayingBriefing
                  ? 'bg-rose-500 hover:bg-rose-600 text-slate-950 shadow-rose-500/30 animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-emerald-500/30 hover:scale-105'
              }`}
            >
              <Volume2 className={`w-5 h-5 ${isPlayingBriefing ? 'animate-bounce' : ''}`} />
              <span>
                {isPlayingBriefing
                  ? (lang === 'te' ? 'ఆపండి ⏹️' : 'Stop Audio ⏹️')
                  : (lang === 'te' ? '🔊 ఉదయం సలహా వినండి' : '🔊 Listen Morning Briefing')}
              </span>
            </button>

          </div>

          {/* Quick Weather & Mandi Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <Sun className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-200">🌦️ {lang === 'te' ? 'వాతావరణ హెచ్చరిక' : 'Weather Advisory Today'}</div>
                <div className="text-[11px] text-slate-400 font-bold">{lang === 'te' ? 'మధ్యాహ్నం 2 గంటలకు వర్షం. మందు కొట్టడం ఆపండి.' : 'Rain expected at 2 PM. Hold pesticide spray.'}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-black text-slate-200">💰 {cropName} {lang === 'te' ? 'మండీ ధర' : 'Mandi Rate'}</div>
                <div className="text-[11px] text-slate-400 font-bold">{lang === 'te' ? '₹2,600 / క్వింటాల్ • 3 రోజులు ఆగితే ధర పెరుగుతుంది.' : '₹2,600 / Quintal • Price expected +₹200 in 3 days.'}</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 🚀 2. QUICK SHORTCUTS BAR FOR COMMON TASKS */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'te' ? 'తక్షణ సేవలు & షార్ట్‌కట్‌లు' : (lang === 'hi' ? 'त्वरित सेवाएँ' : 'Quick Actions & Shortcuts')}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onSelectAction('doctor')}
            className="min-h-[56px] p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-left transition-all cursor-pointer flex items-center gap-3 group shadow-lg"
          >
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-100">{lang === 'te' ? 'పంట స్కాన్' : 'Scan Crop'}</div>
              <div className="text-[10px] text-slate-400 font-bold">{lang === 'te' ? 'ఫోటో AI లెన్స్' : 'Photo Lens AI'}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('copilot')}
            className="min-h-[56px] p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-left transition-all cursor-pointer flex items-center gap-3 group shadow-lg"
          >
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 group-hover:scale-110 transition-transform">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-100">{lang === 'te' ? 'వాయిస్ ప్రశ్న' : 'Voice Query'}</div>
              <div className="text-[10px] text-slate-400 font-bold">{lang === 'te' ? 'AI తో మాట్లాడండి' : 'Talk to Kisan AI'}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('market')}
            className="min-h-[56px] p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800 text-left transition-all cursor-pointer flex items-center gap-3 group shadow-lg"
          >
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-100">{lang === 'te' ? 'మండీ ధరలు' : 'Mandi Rate'}</div>
              <div className="text-[10px] text-slate-400 font-bold">{lang === 'te' ? 'ఈనాటి ధరలు' : "Today's Prices"}</div>
            </div>
          </button>

          <button
            onClick={() => onSelectAction('calendar')}
            className="min-h-[56px] p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-800 text-left transition-all cursor-pointer flex items-center gap-3 group shadow-lg"
          >
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-black text-slate-100">{lang === 'te' ? 'క్యాలెండర్' : 'Calendar'}</div>
              <div className="text-[10px] text-slate-400 font-bold">{lang === 'te' ? 'విత్తనాల షెడ్యూల్' : 'Sowing Schedule'}</div>
            </div>
          </button>
        </div>
      </div>

      {/* 🌾 3. MAIN VISUAL FEATURE CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {mainFeatureCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onSelectAction(card.id)}
              className={`p-6 sm:p-8 rounded-3xl border-2 bg-gradient-to-br ${card.gradient} transition-all duration-300 shadow-2xl flex flex-col justify-between cursor-pointer group hover:scale-[1.02] active:scale-[0.98] space-y-6 relative overflow-hidden`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className={`w-14 h-14 rounded-2xl ${card.iconBg} border flex items-center justify-center text-xl font-black shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${card.badgeColor}`}>
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-100 tracking-tight leading-snug">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 font-bold mt-2 leading-relaxed">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                className="w-full py-3.5 px-4 rounded-2xl bg-slate-950/90 border border-slate-800 group-hover:border-slate-600 text-slate-100 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all group-hover:bg-slate-900"
              >
                <span>{card.btnText}</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
}
