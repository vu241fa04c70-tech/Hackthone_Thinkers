import React, { useState } from 'react';
import { TrendingUp, Volume2, Calendar, MapPin, ArrowUpRight, DollarSign, Award, CheckCircle } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function MarketIntelligence({ activeField }) {
  const { lang, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const marketData = {
    crop: activeField?.crop_type || 'Tomato',
    current_price: 24.50,
    forecast_3days: 27.50,
    forecast_change_pct: '+12.2%',
    recommendation: t('market.recommendation'),
    comparison: [
      { location: t('market.villageTrader'), price: 21.00, net: '₹21.00/kg' },
      { location: t('market.nearestMandi'), price: 24.50, net: '₹24.50/kg' },
      { location: t('market.regionalAPMC'), price: 27.50, net: '₹27.50/kg' }
    ]
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = t('market.audioText');

    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      lang,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            💰 {t('market.title')}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {t('market.subtitle')}
          </p>
        </div>

        <button
          onClick={toggleAudio}
          className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
            isPlayingAudio
              ? 'bg-emerald-500 text-slate-950 animate-pulse'
              : 'bg-slate-950 text-slate-200 border border-slate-800 hover:text-emerald-400'
          }`}
        >
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span>{isPlayingAudio ? (lang === 'te' ? 'ఆపండి' : 'Stop') : t('market.listenAudio')}</span>
        </button>
      </div>

      {/* Harvest Recommendation Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/90 to-slate-900 border-2 border-emerald-500/40 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-emerald-400 tracking-wider">
            {t('market.harvestAdviceTitle')}
          </span>
          <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            {marketData.forecast_change_pct}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-100">
          {marketData.recommendation}
        </h3>
        <p className="text-xs text-slate-300 font-bold leading-relaxed">
          {t('market.waitAdvice')}
        </p>
      </div>

      {/* Mandi Price Comparison List */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">
          {t('market.priceComparisonTitle')}
        </h3>

        <div className="space-y-3">
          {marketData.comparison.map((c, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                idx === 2
                  ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300 font-black'
                  : 'bg-slate-950 border-slate-800 text-slate-200 font-bold'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <span>{c.location}</span>
              </div>
              <div className="text-lg font-black">
                {c.net}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
