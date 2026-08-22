import React, { useState } from 'react';
import { Sun, CloudRain, Wind, Droplets, Volume2, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function WeatherScreen() {
  const { lang, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const weatherData = {
    temp: '31°C',
    humidity: '68%',
    wind: '14 km/h',
    rainProb: '75%',
    alert: t('weather.alertMsg')
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    speakText(
      weatherData.alert,
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
            🌤️ {t('weather.title')}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {t('weather.subtitle')}
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
          <span>{isPlayingAudio ? (lang === 'te' ? 'ఆపండి' : 'Stop') : t('weather.listenAudio')}</span>
        </button>
      </div>

      {/* Main Alert Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-950/90 to-slate-900 border-2 border-sky-500/40 space-y-3 shadow-xl">
        <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider">
          <AlertTriangle className="w-4 h-4" />
          <span>{t('weather.recommendation')}</span>
        </div>
        <p className="text-lg sm:text-xl font-black text-slate-100 leading-relaxed">
          {weatherData.alert}
        </p>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 text-center">
          <Sun className="w-8 h-8 text-amber-400 mx-auto" />
          <div className="text-xs text-slate-400 font-bold">{t('weather.temp')}</div>
          <div className="text-xl font-black text-slate-100">{weatherData.temp}</div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 text-center">
          <CloudRain className="w-8 h-8 text-sky-400 mx-auto" />
          <div className="text-xs text-slate-400 font-bold">{t('weather.rainProbability')}</div>
          <div className="text-xl font-black text-slate-100">{weatherData.rainProb}</div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 text-center">
          <Droplets className="w-8 h-8 text-teal-400 mx-auto" />
          <div className="text-xs text-slate-400 font-bold">{t('weather.humidity')}</div>
          <div className="text-xl font-black text-slate-100">{weatherData.humidity}</div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 text-center">
          <Wind className="w-8 h-8 text-indigo-400 mx-auto" />
          <div className="text-xs text-slate-400 font-bold">{t('weather.wind')}</div>
          <div className="text-xl font-black text-slate-100">{weatherData.wind}</div>
        </div>
      </div>
    </div>
  );
}
