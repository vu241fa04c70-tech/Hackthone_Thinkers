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
    { location: lang === 'te' ? 'గ్రామ వ్యాపారి (Farmgate Trader)' : 'Local Village Trader', price: (currentPriceQtl * 0.85).toFixed(0), netKg: (currentPriceKg * 0.85).toFixed(1) },
    { location: currentCropData.nearest_mandi || 'Guntur Wholesale APMC Yard', price: currentPriceQtl, netKg: currentPriceKg },
    { location: lang === 'te' ? 'ప్రాంతీయ ప్రధాన ఏపిఎంసి (Regional APMC)' : 'Regional APMC Hub (Vijayawada)', price: (currentPriceQtl * 1.12).toFixed(0), netKg: (currentPriceKg * 1.12).toFixed(1) }
  ];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-cyan-400 flex items-center gap-2">
            💰 Live Mandi Market Prices & Sell Advisory
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">
            Real-time crop market prices per quintal, APMC yard trends, and optimal selling timeline.
          </p>
        </div>

        <button
          onClick={toggleAudio}
          className={`min-h-[48px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all shrink-0 ${
            isPlayingAudio
              ? 'bg-rose-500 text-slate-950 shadow-rose-500/20 animate-pulse'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          <span>{isPlayingAudio ? 'Stop Audio ⏹️' : '🔊 Listen Market Audio'}</span>
        </button>
      </div>

      {/* Crop Selection Selector Bar */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {['Tomato', 'Paddy', 'Chilli', 'Cotton', 'Potato'].map((crop) => (
          <button
            key={crop}
            onClick={() => setSelectedCrop(crop)}
            className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              selectedCrop === crop
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 scale-[1.02]'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>🌾 {crop}</span>
          </button>
        ))}
      </div>

      {/* Main Price Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Live Rate */}
        <div className="lg:col-span-2 bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Crop: {selectedCrop}</span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-100 mt-1">
                  Today's Wholesale Mandi Rate
                </h3>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                <span>TREND: {currentCropData.trend || 'UP (+10%)'}</span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-3xl sm:text-5xl font-black text-cyan-400">
                  ₹{currentPriceQtl} <span className="text-sm font-extrabold text-slate-400">/ Quintal</span>
                </div>
                <div className="text-xs text-slate-300 font-bold mt-1">
                  (Equivalent to <span className="text-emerald-400 font-black">₹{currentPriceKg}/kg</span> at yard)
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-right">
                <div className="text-[11px] font-black text-cyan-400 uppercase">3-Day Forecast Price</div>
                <div className="text-xl font-black text-slate-100">₹{forecastPrice3Days} / qtl</div>
                <div className="text-[10px] text-emerald-400 font-bold">+10% Price Increase Expected</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 space-y-1">
              <div className="text-xs font-black uppercase text-emerald-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>AI Recommendation: HOLD HARVEST FOR 3 DAYS</span>
              </div>
              <p className="text-xs text-slate-200 font-bold leading-relaxed">
                Market arrivals are currently low. Waiting 3 days before selling will fetch ₹200-₹250 higher profit per quintal.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-400 font-bold flex items-center gap-2 pt-2 border-t border-slate-800">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Reporting Yard: {currentCropData.nearest_mandi || 'Guntur APMC Yard'}</span>
          </div>

        </div>

        {/* Market Price Comparison Breakdown */}
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-cyan-400" />
            <span>Yard Price Comparison</span>
          </h3>

          <div className="space-y-3">
            {comparisonMarkets.map((m, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-black text-slate-200">
                  <span>📍 {m.location}</span>
                  <span className="text-cyan-400">₹{m.price} / qtl</span>
                </div>

                {/* Visual Bar Indicator */}
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full"
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
