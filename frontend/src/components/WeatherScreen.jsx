import React, { useState } from 'react';
import { Sun, CloudRain, Wind, Droplets, Volume2, AlertTriangle, Thermometer, ShieldAlert, Calendar } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function WeatherScreen() {
  const { lang, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const weatherData = {
    temp: '31°C',
    condition: lang === 'te' ? 'భారీ వర్షపు సూచన' : (lang === 'hi' ? 'भारी बारिश का अनुमान' : 'Heavy Rain Forecast'),
    humidity: '74%',
    wind: '16 km/h',
    rainProb: '85%',
    alert: lang === 'te'
      ? 'ఈ రోజు మధ్యాహ్నం 2 గంటల నుండి సాయంత్రం 6 గంటల మధ్య గుంటూరు మరియు పరిసర ప్రాంతాలలో 85% వర్షపాతం కురిసే అవకాశం ఉంది. పంటలకు క్రిమిసంహారకాల పిచికారీ మరియు నీటిపారుదల నిలిపివేయండి.'
      : (lang === 'hi'
        ? 'आज दोपहर 2 बजे से शाम 6 बजे के बीच 85% बारिश की संभावना है। कीटनाशक छिड़काव और सिंचाई रोक दें।'
        : 'Heavy rain expected between 2 PM and 6 PM today. Pause all pesticide spraying and canal/drip irrigation.')
  };

  const weeklyForecast = [
    { 
      day: lang === 'te' ? 'ఈ రోజు (నేడు)' : (lang === 'hi' ? 'आज' : 'Today'), 
      icon: CloudRain, 
      temp: '31°C / 24°C', 
      rain: '85%', 
      desc: lang === 'te' ? 'భారీ వర్షం' : (lang === 'hi' ? 'भारी बारिश' : 'Heavy Rain') 
    },
    { 
      day: lang === 'te' ? 'రేపు' : (lang === 'hi' ? 'कल' : 'Tomorrow'), 
      icon: Sun, 
      temp: '33°C / 25°C', 
      rain: '20%', 
      desc: lang === 'te' ? 'ఎండ తీవ్రత' : (lang === 'hi' ? 'ज्यादातर धूप' : 'Mostly Sunny') 
    },
    { 
      day: lang === 'te' ? 'ఎల్లుండి' : (lang === 'hi' ? 'परसों' : 'Day 3'), 
      icon: Sun, 
      temp: '34°C / 26°C', 
      rain: '10%', 
      desc: lang === 'te' ? 'నిర్మలమైన ఆకాశం' : (lang === 'hi' ? 'साफ आसमान' : 'Clear Skies') 
    },
    { 
      day: lang === 'te' ? 'గురువారం' : (lang === 'hi' ? 'गुरुवार' : 'Day 4'), 
      icon: CloudRain, 
      temp: '30°C / 23°C', 
      rain: '60%', 
      desc: lang === 'te' ? 'తేలికపాటి వర్షం' : (lang === 'hi' ? 'हल्की बारिश' : 'Light Shower') 
    },
    { 
      day: lang === 'te' ? 'శుక్రవారం' : (lang === 'hi' ? 'शुक्रवार' : 'Day 5'), 
      icon: Sun, 
      temp: '32°C / 24°C', 
      rain: '15%', 
      desc: lang === 'te' ? 'పాక్షికంగా మేఘావృతం' : (lang === 'hi' ? 'आंशिक बादल' : 'Partly Cloudy') 
    },
    { 
      day: lang === 'te' ? 'శనివారం' : (lang === 'hi' ? 'शनिवार' : 'Day 6'), 
      icon: Sun, 
      temp: '33°C / 25°C', 
      rain: '0%', 
      desc: lang === 'te' ? 'ఎండ రోజు' : (lang === 'hi' ? 'धूप वाला दिन' : 'Sunny Day') 
    }
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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C3333] flex items-center gap-2">
            🌤️ {lang === 'te' ? 'వ్యవసాయ వాతావరణ సమాచారం & సలహాలు' : (lang === 'hi' ? 'कृषि मौसम सलाह' : 'Live Agricultural Weather Advisory')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            {lang === 'te' 
              ? 'వర్షపాత హెచ్చరికలు, తేమ శాతం మరియు పంట సంరక్షణ కోసం రియల్-టైమ్ సమాచారం.' 
              : (lang === 'hi' ? 'फसल सुरक्षा के लिए वास्तविक समय वर्षा चेतावनी और आर्द्रता सलाह।' : 'Real-time rainfall warnings, humidity, and microclimate advice for crop protection.')}
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
          <span>{isPlayingAudio ? (lang === 'te' ? 'ఆపండి ⏹️' : 'Stop Audio ⏹️') : (lang === 'te' ? '🔊 వాయిస్ సలహా వినండి' : '🔊 Listen Weather Audio')}</span>
        </button>
      </div>

      {/* Emergency Alert Warning Banner */}
      <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 animate-bounce" />
          <span>⚠️ {lang === 'te' ? 'రైతులకు వాతావరణ హెచ్చరిక' : (lang === 'hi' ? 'किसानों के लिए मौसम चेतावनी' : 'Weather Alert for Farmers')}</span>
        </div>
        <p className="text-xs sm:text-sm font-semibold text-amber-950 leading-relaxed">
          {weatherData.alert}
        </p>
      </div>

      {/* Current Weather Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Stat Card 1: Temperature */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <Thermometer className="w-4 h-4" />
            </div>
            <span>{lang === 'te' ? 'ఉష్ణోగ్రత' : (lang === 'hi' ? 'तापमान' : 'Temperature')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#2C3333]">{weatherData.temp}</div>
          <div className="text-[11px] text-slate-500 font-semibold">{weatherData.condition}</div>
        </div>

        {/* Stat Card 2: Rain Probability */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
              <CloudRain className="w-4 h-4" />
            </div>
            <span>{lang === 'te' ? 'వర్షం అవకాశం' : (lang === 'hi' ? 'बारिश की संभावना' : 'Rain Probability')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-sky-700">{weatherData.rainProb}</div>
          <div className="text-[11px] text-slate-500 font-semibold">{lang === 'te' ? 'మధ్యాహ్నం 2 గంటలకు వర్షం' : (lang === 'hi' ? 'दोपहर 2 बजे बारिश' : 'Rain at 2 PM')}</div>
        </div>

        {/* Stat Card 3: Humidity */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <Droplets className="w-4 h-4" />
            </div>
            <span>{lang === 'te' ? 'తేమ శాతం' : (lang === 'hi' ? 'आर्द्रता' : 'Humidity')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700">{weatherData.humidity}</div>
          <div className="text-[11px] text-slate-500 font-semibold">{lang === 'te' ? 'అధిక తేమ' : (lang === 'hi' ? 'उच्च नमी' : 'High Moisture')}</div>
        </div>

        {/* Stat Card 4: Wind Speed */}
        <div className="bg-white p-5 rounded-3xl border border-emerald-100 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-800 flex items-center justify-center shrink-0">
              <Wind className="w-4 h-4" />
            </div>
            <span>{lang === 'te' ? 'గాలి వేగం' : (lang === 'hi' ? 'हवा की गति' : 'Wind Speed')}</span>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-700">{weatherData.wind}</div>
          <div className="text-[11px] text-slate-500 font-semibold">{lang === 'te' ? 'నైరుతి దిశ గాలి' : (lang === 'hi' ? 'दक्षिण-पश्चिम हवा' : 'South-West Wind')}</div>
        </div>

      </div>

      {/* 6-Day Weather Forecast Cards */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-[#2C3333] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2D6A4F]" />
          <span>{lang === 'te' ? '📅 వారపు వాతావరణ మరియు విత్తనాల సూచన' : (lang === 'hi' ? 'साप्ताहिक मौसम पूर्वानुमान' : 'Weekly Microclimate Sowing & Rain Forecast')}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {weeklyForecast.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2 hover:border-emerald-300 transition-all">
                <div className="text-xs font-bold text-slate-700">{item.day}</div>
                <Icon className="w-7 h-7 text-[#2D6A4F] mx-auto" />
                <div className="text-xs font-bold text-[#2C3333]">{item.temp}</div>
                <div className="text-[10px] text-sky-700 font-extrabold">🌧️ {item.rain}</div>
                <div className="text-[10px] text-slate-500 font-semibold">{item.desc}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
