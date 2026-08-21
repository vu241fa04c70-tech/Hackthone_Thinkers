import React, { useState } from 'react';
import { Camera, Sun, TrendingUp, Mic, Volume2, Scroll, Calendar, Sparkles } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function KisanHomeGrid({ profile, onSelectAction }) {
  const { lang, t } = useLanguage();
  const [isPlayingBriefing, setIsPlayingBriefing] = useState(false);

  const toggleBriefing = () => {
    if (isPlayingBriefing) {
      stopSpeech();
      setIsPlayingBriefing(false);
      return;
    }

    const briefingText = lang === 'te'
      ? `నమస్కారం రమేష్ గారూ! ఈ రోజు మీ టమాటా తోట గురించిన ఉదయం సమాచారం: ఈ రోజు మధ్యాహ్నం 2 గంటలకు వర్షం పడే అవకాశం ఉంది, కాబట్టి మందు కొట్టడం మరియు నీటి పారుదల ఆపండి. మండీలో టమాటా ధర రూ. 24.50/కిలో ఉంది, 3 రోజులు ఆగితే ధర పెరుగుతుంది.`
      : (lang === 'hi'
        ? `नमस्ते रमेश भाई! आज दोपहर 2 बजे बारिश का अनुमान है। आज छिड़काव और सिंचाई रोक दें। टमाटर का भाव ₹24.50 है, 3 दिन बाद बेचें।`
        : `Good Morning Ramesh Bhai! Today rain is expected at 2 PM. Avoid spraying pesticides and pause drip irrigation. Tomato price is ₹24.50/kg, hold 3 days for higher price.`);

    setIsPlayingBriefing(true);
    speakText(
      briefingText,
      lang,
      () => setIsPlayingBriefing(true),
      () => setIsPlayingBriefing(false),
      () => setIsPlayingBriefing(false)
    );
  };

  const cards = [
    {
      id: 'doctor',
      title: t('home.card1Title'),
      subtitle: t('home.card1Sub'),
      btnText: t('home.card1Btn'),
      icon: Camera,
      badge: lang === 'te' ? 'వ్యాధి స్కాన్' : 'Vision AI',
      color: 'from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400'
    },
    {
      id: 'weather',
      title: t('home.card2Title'),
      subtitle: t('home.card2Sub'),
      btnText: t('home.card2Btn'),
      icon: Sun,
      badge: lang === 'te' ? 'మధ్యాహ్నం వర్షం' : 'Rain Alert',
      color: 'from-sky-500/20 to-blue-500/10 border-sky-500/40 text-sky-400'
    },
    {
      id: 'market',
      title: t('home.card3Title'),
      subtitle: t('home.card3Sub'),
      btnText: t('home.card3Btn'),
      icon: TrendingUp,
      badge: lang === 'te' ? '₹24.50/కిలో' : '₹24.50/kg',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-400'
    },
    {
      id: 'copilot',
      title: t('home.card4Title'),
      subtitle: t('home.card4Sub'),
      btnText: t('home.card4Btn'),
      icon: Mic,
      badge: lang === 'te' ? 'తెలుగు వాయిస్' : 'Voice AI',
      color: 'from-purple-500/20 to-indigo-500/10 border-purple-500/40 text-purple-400'
    },
    {
      id: 'schemes',
      title: t('home.card5Title'),
      subtitle: t('home.card5Sub'),
      btnText: t('home.card5Btn'),
      icon: Scroll,
      badge: lang === 'te' ? 'PM-Kisan' : 'Govt Schemes',
      color: 'from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-400'
    },
    {
      id: 'calendar',
      title: t('home.card6Title'),
      subtitle: t('home.card6Sub'),
      btnText: t('home.card6Btn'),
      icon: Calendar,
      badge: lang === 'te' ? 'పనుల జాబితా' : 'Calendar',
      color: 'from-teal-500/20 to-cyan-500/10 border-teal-500/40 text-teal-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 7 AM WhatsApp Audio Briefing Bar (Requirement #9) */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-2 border-emerald-500/40 p-6 rounded-3xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 text-2xl">
            🌅
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-black border border-emerald-500/30">
              {t('home.briefingTitle')}
            </span>
            <h2 className="text-xl font-black text-slate-100 mt-1">
              {lang === 'te' ? 'నమస్కారం రమేష్ గారూ! 🌅 (టమాటా సాగు)' : (lang === 'hi' ? 'नमस्ते रमेश भाई! 🌅' : 'Good Morning Ramesh Bhai! 🌅')}
            </h2>
            <p className="text-xs text-slate-300 font-bold mt-0.5">
              {lang === 'te' 
                ? '⚠️ ఈ రోజు మధ్యాహ్నం 2 గంటలకు వర్షం • 3 రోజుల తర్వాత మండీ అమ్మకం చేయండి' 
                : '⚠️ Rain expected at 2 PM today • Hold 3 days to harvest for max profit'}
            </p>
          </div>
        </div>

        <button
          onClick={toggleBriefing}
          className={`w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-black flex items-center justify-center gap-2 cursor-pointer transition-all shadow-xl ${
            isPlayingBriefing
              ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
              : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/30 hover:scale-[1.03]'
          }`}
        >
          <Volume2 className="w-5 h-5" />
          <span>{isPlayingBriefing ? t('home.pauseBriefing') : t('home.listenBriefing')}</span>
        </button>
      </div>

      {/* 6 Major Farmer Cards Grid (Requirement #6) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.id}
              onClick={() => onSelectAction(card.id)}
              className={`p-6 rounded-3xl border-2 bg-gradient-to-br ${card.color} text-left transition-all hover:scale-[1.02] cursor-pointer shadow-xl flex flex-col justify-between space-y-4 group`}
            >
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-slate-950/60 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8" />
                </div>
                <span className="text-xs font-black px-3 py-1 rounded-full bg-slate-950/80 border border-white/10 text-slate-200">
                  {card.badge}
                </span>
              </div>

              <div>
                <h3 className="text-lg sm:text-xl font-black text-slate-100 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm font-bold text-slate-300 mt-1 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              <div className="pt-2 flex items-center text-xs font-black text-emerald-400 group-hover:translate-x-1 transition-transform">
                <span>{card.btnText}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
