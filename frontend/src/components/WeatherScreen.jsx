import React, { useState } from 'react';
import { Sun, CloudRain, Wind, Droplets, Volume2, AlertTriangle, Thermometer, ShieldAlert, Calendar } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function WeatherScreen() {
  const { lang, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const weatherData = {
    temp: '31°C',
    condition: lang === 'te' ? 'భారీ వర్షపు సూచన' : 'Heavy Rain Forecast',
    humidity: '74%',
    wind: '16 km/h',
    rainProb: '85%',
    uvIndex: 'Moderate (5)',
    alert: lang === 'te'
      ? 'ఈ రోజు మధ్యాహ్నం 2 గంటల నుండి సాయంత్రం 6 గంటల మధ్య గుంటూరు మరియు పరిసర ప్రాంతాలలో 85% వర్షపాతం కురిసే అవకాశం ఉంది. పంటలకు క్రిమిసంహారకాల పిచికారీ మరియు నీటిపారుదల నిలిపివేయండి.'
      : 'Heavy rain expected between 2 PM and 6 PM today. Pause all pesticide spraying and canal/drip irrigation.'
  };

  const weeklyForecast = [
    { day: lang === 'te' ? 'ఈ రోజు (నేడు)' : 'Today', icon: CloudRain, temp: '31°C / 24°C', rain: '85%', desc: 'Heavy Rain' },
    { day: lang === 'te' ? 'రేపు' : 'Tomorrow', icon: Sun, temp: '33°C / 25°C', rain: '20%', desc: 'Mostly Sunny' },
    { day: lang === 'te' ? 'ఎల్లుండి' : 'Day 3', icon: Sun, temp: '34°C / 26°C', rain: '10%', desc: 'Clear Skies' },
    { day: lang === 'te' ? 'గురువారం' : 'Day 4', icon: CloudRain, temp: '30°C / 23°C', rain: '60%', desc: 'Light Shower' },
    { day: lang === 'te' ? 'శుక్రవారం' : 'Day 5', icon: Sun, temp: '32°C / 24°C', rain: '15%', desc: 'Partly Cloudy' },
    { day: lang === 'te' ? 'శనివారం' : 'Day 6', icon: Sun, temp: '33°C / 25°C', rain: '0%', desc: 'Sunny Day' }
  ];

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
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-orange-950 p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-amber-400 flex items-center gap-2">
            🌤️ Live Agricultural Weather Advisory
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-bold mt-1">
            Real-time rainfall warnings, humidity, and microclimate advice for crop protection.
          </p>
        </div>

        <button
          onClick={toggleAudio}
          className={`min-h-[48px] px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg transition-all shrink-0 ${
            isPlayingAudio
              ? 'bg-rose-500 text-slate-950 shadow-rose-500/20 animate-pulse'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
          }`}
        >
          <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          <span>{isPlayingAudio ? 'Stop Audio ⏹️' : '🔊 Listen Weather Audio'}</span>
        </button>
      </div>

      {/* Emergency Alert Warning Banner */}
      <div className="p-5 rounded-3xl bg-amber-950/80 border-2 border-amber-500/60 text-amber-200 space-y-2 shadow-xl animate-in fade-in duration-300">
        <div className="flex items-center gap-2 text-sm font-black text-amber-400 uppercase tracking-wider">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
          <span>⚠️ Weather Alert for Farmers</span>
        </div>
        <p className="text-xs sm:text-sm font-bold text-slate-200 leading-relaxed">
          {weatherData.alert}
        </p>
      </div>

      {/* Current Weather Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span>Temperature</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">{weatherData.temp}</div>
          <div className="text-[11px] text-slate-400 font-bold">{weatherData.condition}</div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black">
            <CloudRain className="w-4 h-4 text-cyan-400" />
            <span>Rain Probability</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400">{weatherData.rainProb}</div>
          <div className="text-[11px] text-slate-400 font-bold">Rain at 2 PM</div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black">
            <Droplets className="w-4 h-4 text-emerald-400" />
            <span>Humidity</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{weatherData.humidity}</div>
          <div className="text-[11px] text-slate-400 font-bold">High Moisture</div>
        </div>

        <div className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-black">
            <Wind className="w-4 h-4 text-purple-400" />
            <span>Wind Speed</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-400">{weatherData.wind}</div>
          <div className="text-[11px] text-slate-400 font-bold">South-West Wind</div>
        </div>

      </div>

      {/* 6-Day Weather Forecast Cards */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-2xl">
        <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>Weekly Microclimate Sowing & Rain Forecast</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {weeklyForecast.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2 hover:border-amber-500/40 transition-all">
                <div className="text-xs font-black text-slate-300">{item.day}</div>
                <Icon className="w-7 h-7 text-amber-400 mx-auto" />
                <div className="text-xs font-black text-slate-100">{item.temp}</div>
                <div className="text-[10px] text-cyan-400 font-extrabold">🌧️ {item.rain}</div>
                <div className="text-[10px] text-slate-400 font-bold">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
