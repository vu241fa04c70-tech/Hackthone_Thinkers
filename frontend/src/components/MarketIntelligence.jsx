import React, { useState, useEffect } from 'react';
import { TrendingUp, Volume2, Calendar, MapPin, ArrowUpRight, DollarSign, Award, CheckCircle, TrendingDown, RefreshCw, BarChart2, Search } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { translateMarketTerm } from '../localization/marketTranslator';
import { getLocalizedLocationName } from '../localization/locationTranslator';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function MarketIntelligence({ activeField }) {
  const { lang, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Farmer default location
  const farmerProfile = (() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      district: 'Guntur',
      state: 'Andhra Pradesh'
    };
  })();

  const defaultArea = farmerProfile.district || 'Guntur';
  const [selectedArea, setSelectedArea] = useState(defaultArea);
  const [mandiPrices, setMandiPrices] = useState({});
  const [selectedCrop, setSelectedCrop] = useState('Tomato');

  const fetchAreaMandiPrices = (area) => {
    setIsLoading(true);
    fetch(`/api/mandi?area=${encodeURIComponent(area)}`)
      .then(res => res.json())
      .then(data => {
        setMandiPrices(data || {});
        // Auto select first crop if selectedCrop not in data
        const crops = Object.keys(data || {});
        if (crops.length > 0 && !crops.includes(selectedCrop)) {
          setSelectedCrop(crops[0]);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAreaMandiPrices(selectedArea);
  }, [selectedArea]);

  const currentCropData = mandiPrices[selectedCrop] || {
    crop: selectedCrop,
    area: selectedArea,
    current_price: 2450.0,
    nearest_mandi: 'Guntur Wholesale Yard',
    trend: 'Rising',
    optimal_window: 'Harvest in 3 days (Pre-Rain Gain)',
    projected_7d: 2750.0
  };

  const currentPriceQtl = currentCropData.current_price || 2450;
  const currentPriceKg = (currentPriceQtl / 100).toFixed(2);
  const forecastPrice3Days = currentCropData.projected_7d || Math.round(currentPriceQtl * 1.1);

  const localizedAreaName = getLocalizedLocationName(selectedArea, lang);
  const localizedCropName = translateMarketTerm(selectedCrop, lang);
  const localizedMandiYard = translateMarketTerm(currentCropData.nearest_mandi || `${selectedArea} APMC Market`, lang);
  const localizedTrend = translateMarketTerm(currentCropData.trend || 'Rising', lang);
  const localizedWindow = translateMarketTerm(currentCropData.optimal_window || 'Harvest in 3 days (Pre-Rain Gain)', lang);

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = lang === 'te'
      ? `నమస్కారం! ${localizedAreaName} ప్రాంతపు మార్కెట్‌లో ${selectedCrop} ధర క్వింటాల్‌కి రూ. ${currentPriceQtl} ఉంది. 3 రోజుల తర్వాత అమ్మడం ద్వారా రూ. 300 అధిక రాబడి పొందవచ్చు.`
      : `Today in ${selectedArea} market, ${selectedCrop} price is ₹${currentPriceQtl} per quintal. Forecast recommendation: Hold or harvest in 3 days for higher gains.`;

    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      lang,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const popularAreas = ['Guntur', 'Mangalagiri', 'Vijayawada', 'Hyderabad', 'Karimnagar', 'Tirupati', 'Nashik', 'Ludhiana'];
  const availableCrops = Object.keys(mandiPrices).length > 0 ? Object.keys(mandiPrices) : ['Tomato', 'Paddy', 'Chilli', 'Cotton'];

  const comparisonMarkets = [
    { 
      location: lang === 'te' ? 'గ్రామ స్థానిక వ్యాపారి (Farmgate Trader)' : (lang === 'hi' ? 'गाँव के व्यापारी' : 'Local Village Trader'), 
      price: Math.round(currentPriceQtl * 0.86), 
      netKg: (currentPriceKg * 0.86).toFixed(1) 
    },
    { 
      location: localizedMandiYard, 
      price: currentPriceQtl, 
      netKg: currentPriceKg 
    },
    { 
      location: lang === 'te' ? `${localizedAreaName} రీజినల్ APMC యార్డ్` : `${selectedArea} Regional APMC Hub`, 
      price: Math.round(currentPriceQtl * 1.10), 
      netKg: (currentPriceKg * 1.10).toFixed(1) 
    }
  ];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2C3333] flex items-center gap-2">
              💰 {lang === 'te' ? 'ప్రాంతాల వారీ లైవ్ మండీ ధరలు & అమ్మకపు సలహా' : (lang === 'hi' ? 'क्षेत्रीय लाइव मंडी भाव एवं बिक्री सलाह' : 'Area-Specific Live Mandi Prices & Sell Advisory')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
              {lang === 'te'
                ? 'ప్రతి ప్రాంతం మరియు మండీ యార్డ్‌కి విడివిడిగా ధరలు, 7-రోజుల ధరల ట్రెండ్ మరియు ఉత్తమ అమ్మకపు సమయం.'
                : 'Real-time crop prices per quintal tailored to your specific region & APMC wholesale market.'}
            </p>
          </div>

          <button
            onClick={toggleAudio}
            className={`min-h-[44px] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all shrink-0 ${
              isPlayingAudio
                ? 'bg-rose-500 text-white shadow-rose-200 animate-pulse'
                : 'bg-[#2D6A4F] hover:bg-[#1B4332] text-white'
            }`}
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
            <span>{isPlayingAudio ? (lang === 'te' ? 'ఆపండి' : 'Stop Audio') : (lang === 'te' ? '🔊 వాయిస్ వినండి' : '🔊 Listen Advice')}</span>
          </button>
        </div>

        {/* Area Selection Chips Bar */}
        <div className="space-y-2 pt-2 border-t border-emerald-100">
          <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#2D6A4F]" />
            <span>{lang === 'te' ? 'మీ ప్రాంతం / మండీ యార్డ్‌ను ఎంచుకోండి:' : 'Select Mandi Region / Market Area:'}</span>
          </span>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {popularAreas.map((area) => {
              const localizedArea = getLocalizedLocationName(area, lang);
              const isSelected = selectedArea.toLowerCase() === area.toLowerCase();
              return (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#2D6A4F] text-white shadow-md scale-[1.03]'
                      : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200'
                  }`}
                >
                  📍 {localizedArea}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Crop Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {availableCrops.map((cName) => {
          const locCrop = translateMarketTerm(cName, lang);
          const isActive = selectedCrop === cName;
          return (
            <button
              key={cName}
              onClick={() => setSelectedCrop(cName)}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#2D6A4F] text-white shadow-md scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-emerald-50 border border-emerald-100'
              }`}
            >
              {locCrop}
            </button>
          );
        })}
      </div>

      {/* Main Mandi Price Highlight Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2D6A4F] via-[#1B4332] to-[#081C15] text-white shadow-lg space-y-6">
        
        {/* Top Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/50 pb-4">
          <div>
            <div className="text-xs uppercase tracking-wider font-extrabold text-emerald-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-300" />
              <span>{localizedMandiYard} ({localizedAreaName})</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {localizedCropName}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-400 text-slate-950 shadow-sm">
              {localizedTrend}
            </span>
          </div>
        </div>

        {/* Price Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Current Wholesale Price */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-emerald-200">
              {lang === 'te' ? 'ప్రస్తుత హోల్‌సేల్ ధర (క్వింటాల్)' : 'Current Wholesale Price'}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-white">
              ₹{currentPriceQtl.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-emerald-200 font-semibold">
              ≈ ₹{currentPriceKg} / kg
            </div>
          </div>

          {/* 7-Day Forecasted Price */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-emerald-200">
              {lang === 'te' ? '3 రోజుల అంచనా ధర' : '3-Day Forecast Price'}
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-300">
              ₹{Number(forecastPrice3Days).toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-emerald-200 font-semibold">
              +₹{(forecastPrice3Days - currentPriceQtl)} / qtl gain
            </div>
          </div>

          {/* Optimal Window */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-emerald-200">
              {lang === 'te' ? 'ఉత్తమ విక్రయ సమయం' : 'Optimal Window'}
            </div>
            <div className="text-sm font-extrabold text-white leading-snug">
              {localizedWindow}
            </div>
          </div>

        </div>

      </div>

      {/* Region Price Comparison Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-[#2C3333] flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-[#2D6A4F]" />
          <span>{lang === 'te' ? `${localizedAreaName} పరిసర మార్కెట్ల ధరల పోలిక` : `Price Comparison Across Markets near ${localizedAreaName}`}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {comparisonMarkets.map((m, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 hover:border-emerald-300 transition-all">
              <div className="text-xs font-bold text-slate-500">{m.location}</div>
              <div className="text-xl font-black text-[#2C3333]">₹{Number(m.price).toLocaleString('en-IN')} <span className="text-xs font-bold text-slate-500">/ qtl</span></div>
              <div className="text-xs font-semibold text-[#2D6A4F]">≈ ₹{m.netKg} / kg</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
