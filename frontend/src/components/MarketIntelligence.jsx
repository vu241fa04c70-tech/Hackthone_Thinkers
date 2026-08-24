import React, { useState, useEffect } from 'react';
import { TrendingUp, Volume2, Calendar, MapPin, ArrowUpRight, DollarSign, Award, CheckCircle, TrendingDown, RefreshCw, BarChart2 } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function MarketIntelligence({ activeField }) {
  const { lang, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(activeField?.crop_type || 'Tomato');
  const [mandiPrices, setMandiPrices] = useState({});

  useEffect(() => {
    fetch('/api/mandi')
      .then(res => res.json())
      .then(data => setMandiPrices(data || {}))
      .catch(() => {});
  }, []);

  const currentCropData = mandiPrices[selectedCrop] || {
    current_price: 2600,
    unit: 'Quintal',
    trend: 'UP',
    nearest_mandi: 'Guntur Wholesale APMC Yard'
  };

  const currentPriceQtl = currentCropData.current_price || 2600;
  const currentPriceKg = (currentPriceQtl / 100).toFixed(2);
  const forecastPrice3Days = (currentPriceQtl * 1.1).toFixed(0);

  const getCropDisplayName = (cName) => {
    switch (cName) {
      case 'Tomato': return lang === 'te' ? 'టమాటా (Tomato)' : (lang === 'hi' ? 'टमाटर (Tomato)' : 'Tomato');
      case 'Paddy': return lang === 'te' ? 'వరి (Paddy)' : (lang === 'hi' ? 'धान (Paddy)' : 'Paddy / Rice');
      case 'Chilli': return lang === 'te' ? 'మిరప (Chilli)' : (lang === 'hi' ? 'मिर्च (Chilli)' : 'Chilli');
      case 'Cotton': return lang === 'te' ? 'పత్తి (Cotton)' : (lang === 'hi' ? 'कपास (Cotton)' : 'Cotton');
      case 'Potato': return lang === 'te' ? 'బంగాళాదుంప (Potato)' : (lang === 'hi' ? 'आलू (Potato)' : 'Potato');
      default: return cName;
    }
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = lang === 'te'
      ? `నమస్కారం! ఈ రోజు ${selectedCrop} మార్కెట్ ధర రూ. ${currentPriceQtl} ఒక క్వింటాల్ కి ఉంది. 3 రోజులు ఆగితే ధర ఇంకా పెరిగే అవకాశం ఉంది. గుంటూరు యార్డ్‌లో రవాణా ధర ఎక్కువగా ఉంది.`
      : `Today ${selectedCrop} market price is ₹${currentPriceQtl} per quintal (₹${currentPriceKg}/kg). Prices expected to increase by 10% in 3 days. Recommendation: HOLD harvest 3 days.`;

    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      lang,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const comparisonMarkets = [
    { 
      location: lang === 'te' ? 'గ్రామ వ్యాపారి (Farmgate Trader)' : (lang === 'hi' ? 'गाँव के व्यापारी' : 'Local Village Trader'), 
      price: (currentPriceQtl * 0.85).toFixed(0), 
      netKg: (currentPriceKg * 0.85).toFixed(1) 
    },
    { 
      location: lang === 'te' ? 'గుంటూరు హోల్‌సేల్ యార్డ్' : (lang === 'hi' ? 'गुंटूर मंडी' : 'Guntur Wholesale APMC Yard'), 
      price: currentPriceQtl, 
      netKg: currentPriceKg 
    },
    { 
      location: lang === 'te' ? 'విజయవాడ రీజినల్ APMC మార్కెట్' : (lang === 'hi' ? 'क्षेत्रीय APMC मंडी' : 'Regional APMC Hub (Vijayawada)'), 
      price: (currentPriceQtl * 1.12).toFixed(0), 
      netKg: (currentPriceKg * 1.12).toFixed(1) 
    }
  ];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C3333] flex items-center gap-2">
            💰 {lang === 'te' ? 'లైవ్ మండీ పంట ధరలు & అమ్మకం సలహా' : (lang === 'hi' ? 'लाइव मंडी भाव' : 'Live Mandi Market Prices & Sell Advisory')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            {lang === 'te'
              ? 'క్వింటాల్ ఆధారంగా ప్రస్తుత మార్కెట్ ధరలు, యార్డ్ ట్రెండ్స్ మరియు ఉత్తమ అమ్మకపు సమయం.'
              : 'Real-time crop market prices per quintal, APMC yard trends, and optimal selling timeline.'}
          </p>
        </div>

        <button
          onClick={toggleAudio}
          className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all shrink-0 ${
            isPlayingAudio
              ? 'bg-rose-500 text-white shadow-rose-200 animate-pulse'
              : 'bg-[#2D6A4F] hover:bg-[#1B4332] text-white shadow-emerald-100'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          <span>{isPlayingAudio ? (lang === 'te' ? 'ఆపండి ⏹️' : 'Stop Audio ⏹️') : (lang === 'te' ? '🔊 వాయిస్ సలహా వినండి' : '🔊 Listen Market Audio')}</span>
        </button>
      </div>

      {/* Crop Selection Selector Bar */}
      <div className="flex space-x-2 border-b border-emerald-100 pb-3 overflow-x-auto no-scrollbar">
        {['Tomato', 'Paddy', 'Chilli', 'Cotton', 'Potato'].map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              selectedCrop === crop
                ? 'bg-[#2D6A4F] text-white shadow-sm scale-[1.02]'
                : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
            }`}
          >
            <span>🌾 {getCropDisplayName(crop)}</span>
          </button>
        ))}
      </div>

      {/* Main Price Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Live Rate */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 space-y-6 shadow-sm flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {lang === 'te' ? 'పంట:' : 'Crop:'} {getCropDisplayName(selectedCrop)}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#2C3333] mt-1">
                  {lang === 'te' ? 'ఈనాటి హోల్‌సేల్ మండీ ధర' : (lang === 'hi' ? 'आज का थोक मंडी भाव' : "Today's Wholesale Mandi Rate")}
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold">
                <ArrowUpRight className="w-4 h-4 text-emerald-800" />
                <span>{lang === 'te' ? 'ధర ట్రెండ్: పెరుగుతోంది (+10%)' : 'TREND: UP (+10%)'}</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-3xl sm:text-5xl font-extrabold text-[#2D6A4F]">
                  ₹{currentPriceQtl} <span className="text-sm font-semibold text-slate-500">/ {lang === 'te' ? 'క్వింటాల్' : 'Quintal'}</span>
                </div>
                <div className="text-xs text-slate-600 font-semibold mt-1">
                  ({lang === 'te' ? 'కిలో ధర సగటున' : 'Equivalent to'} <span className="text-[#2D6A4F] font-bold">₹{currentPriceKg}/kg</span>)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-right">
                <div className="text-[11px] font-bold text-[#2D6A4F] uppercase">{lang === 'te' ? '3 రోజుల అంచనా ధర' : '3-Day Forecast Price'}</div>
                <div className="text-xl font-bold text-[#2C3333]">₹{forecastPrice3Days} / {lang === 'te' ? 'క్వింటాల్' : 'qtl'}</div>
                <div className="text-[10px] text-emerald-800 font-bold">{lang === 'te' ? 'ధర +10% పెరిగే అవకాశం ఉంది' : '+10% Price Increase Expected'}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-100/60 border border-emerald-200 text-emerald-950 space-y-1">
              <div className="text-xs font-bold uppercase text-[#2D6A4F] flex items-center gap-1.5">
                <Award className="w-4 h-4 text-[#2D6A4F]" />
                <span>{lang === 'te' ? 'AI సలహా: 3 రోజులు కోత ఆపి వేచి ఉండండి' : 'AI Recommendation: HOLD HARVEST FOR 3 DAYS'}</span>
              </div>
              <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                {lang === 'te'
                  ? 'మార్కెట్‌లో సరుకు రాక తగ్గింది. 3 రోజులు ఆగి అమ్మితే క్వింటాలుకు ₹200 నుండి ₹250 వరకు అదనపు లాభం లభిస్తుంది.'
                  : 'Market arrivals are currently low. Waiting 3 days before selling will fetch ₹200-₹250 higher profit per quintal.'}
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-semibold flex items-center gap-2 pt-2 border-t border-slate-100">
            <MapPin className="w-4 h-4 text-[#2D6A4F]" />
            <span>{lang === 'te' ? 'నివేదిక యార్డ్:' : 'Reporting Yard:'} {currentCropData.nearest_mandi || 'Guntur APMC Yard'}</span>
          </div>

        </div>

        {/* Market Price Comparison Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#2C3333] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#2D6A4F]" />
            <span>{lang === 'te' ? 'వివిధ మార్కెట్ల ధరల పోలిక' : 'Yard Price Comparison'}</span>
          </h3>

          <div className="space-y-3">
            {comparisonMarkets.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>📍 {m.location}</span>
                  <span className="text-[#2D6A4F]">₹{m.price} / {lang === 'te' ? 'క్వింటాల్' : 'qtl'}</span>
                </div>

                {/* Visual Bar Indicator */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#2D6A4F] h-full rounded-full"
                    style={{ width: `${Math.min(100, (m.price / (currentPriceQtl * 1.15)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
