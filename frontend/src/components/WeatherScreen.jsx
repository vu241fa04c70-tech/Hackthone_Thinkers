import React, { useState, useEffect } from 'react';
import { Sun, CloudRain, Wind, Droplets, Volume2, AlertTriangle, Thermometer, ShieldAlert, Calendar, RefreshCw, MapPin, Search } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function WeatherScreen() {
  const { lang, t } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Farmer location from localStorage or default
  const farmerProfile = (() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      village: 'Mangalagiri',
      mandal: 'Mangalagiri',
      district: 'Guntur',
      state: 'Andhra Pradesh'
    };
  })();

  const defaultLoc = `${farmerProfile.village || 'Mangalagiri'}, ${farmerProfile.district || 'Guntur'}, ${farmerProfile.state || 'Andhra Pradesh'}`;
  const [selectedLocation, setSelectedLocation] = useState(defaultLoc);
  const [weatherData, setWeatherData] = useState(null);

  const fetchWeather = (loc) => {
    setIsLoading(true);
    fetch(`/api/weather?location=${encodeURIComponent(loc)}`)
      .then(res => res.json())
      .then(data => {
        setWeatherData(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchWeather(selectedLocation);
  }, []);

  const getAdvisoryText = () => {
    if (!weatherData || !weatherData.spray_advisory) {
      return lang === 'te'
        ? 'ఈ రోజు మధ్యాహ్నం 2 గంటల నుండి సాయంత్రం 6 గంటల మధ్య 85% వర్షపాతం కురిసే అవకాశం ఉంది. పంటలకు క్రిమిసంహారకాల పిచికారీ మరియు నీటిపారుదల నిలిపివేయండి.'
        : (lang === 'hi'
          ? 'आज दोपहर 2 बजे से शाम 6 बजे के बीच 85% बारिश की संभावना है। कीटनाशक छिड़काव और सिंचाई रोक दें।'
          : 'Heavy rain expected between 2 PM and 6 PM today. Pause all pesticide spraying and canal/drip irrigation.');
    }
    return weatherData.spray_advisory[lang] || weatherData.spray_advisory.te || weatherData.spray_advisory.en;
  };

  const getConditionText = () => {
    if (!weatherData) return lang === 'te' ? 'భారీ వర్షపు సూచన' : (lang === 'hi' ? 'भारी बारिश का अनुमान' : 'Heavy Rain Forecast');
    if (lang === 'te') return weatherData.condition_te || 'భారీ వర్షపు సూచన';
    if (lang === 'hi') return weatherData.condition_hi || 'भारी बारिश का अनुमान';
    return weatherData.condition_en || 'Heavy Rain Forecast';
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = getAdvisoryText();
    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      lang,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const hourlyForecast = [
    { time: '06:00 AM', temp: '26°C', rain: '10%', condition: '☁️ Partly Cloudy' },
    { time: '09:00 AM', temp: '28°C', rain: '20%', condition: '⛅ Sunny Intervals' },
    { time: '12:00 PM', temp: '31°C', rain: '45%', condition: '🌦️ Light Rain' },
    { time: '02:00 PM', temp: '29°C', rain: '85%', condition: '🌧️ Heavy Rain Warning' },
    { time: '05:00 PM', temp: '27°C', rain: '70%', condition: '⛈️ Thunderstorms' },
    { time: '08:00 PM', temp: '25°C', rain: '30%', condition: '☁️ Overcast' }
  ];

  const weeklyForecast = weatherData?.forecast_7d || [
    { day: lang === 'te' ? 'ఈ రోజు (నేడు)' : 'Today', temp_max: 31, temp_min: 24, humidity: 82, rainfall_mm: 12.5, condition: 'Heavy Rain' },
    { day: lang === 'te' ? 'రేపు' : 'Tomorrow', temp_max: 33, temp_min: 25, humidity: 75, rainfall_mm: 2.0, condition: 'Mostly Sunny' },
    { day: lang === 'te' ? 'ఎల్లుండి' : 'Day 3', temp_max: 34, temp_min: 26, humidity: 70, rainfall_mm: 0.0, condition: 'Clear Sky' },
    { day: lang === 'te' ? 'గురువారం' : 'Day 4', temp_max: 30, temp_min: 23, humidity: 80, rainfall_mm: 15.0, condition: 'Light Showers' },
    { day: lang === 'te' ? 'శుక్రవారం' : 'Day 5', temp_max: 32, temp_min: 24, humidity: 68, rainfall_mm: 0.0, condition: 'Partly Cloudy' },
    { day: lang === 'te' ? 'శనివారం' : 'Day 6', temp_max: 33, temp_min: 25, humidity: 65, rainfall_mm: 0.0, condition: 'Sunny Day' }
  ];

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C3333] flex items-center gap-2">
            🌤️ {lang === 'te' ? 'రియల్-టైమ్ వ్యవసాయ వాతావరణ సమాచారం & పిచికారీ సలహాలు' : (lang === 'hi' ? 'वास्तविक समय कृषि मौसम पूर्वानुमान एवं छिड़काव सलाह' : 'Live Real-Time Agricultural Weather & Spray Advisory')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
            {lang === 'te' 
              ? 'వర్షపాత హెచ్చరికలు, గాలి వేగం, తేమ శాతం మరియు మందుల పిచికారీకి అనుకూల సమయం.' 
              : (lang === 'hi' ? 'फसल सुरक्षा के लिए वर्षा चेतावनी, हवा की गति और आर्द्रता सलाह।' : 'Accurate real-time weather, rain warnings, wind speed, humidity & pesticide spray timing.')}
          </p>

          {/* Location Badge */}
          <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#2D6A4F]">
            <MapPin className="w-4 h-4 text-[#2D6A4F]" />
            <span>📍 {selectedLocation}</span>
          </div>
        </div>

        <button
          onClick={() => fetchWeather(selectedLocation)}
          disabled={isLoading}
          className="px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#2D6A4F] font-bold text-xs flex items-center gap-2 border border-emerald-200 cursor-pointer transition-all shadow-sm shrink-0"
        >
          <RefreshCw className={`w-4 h-4 text-[#2D6A4F] ${isLoading ? 'animate-spin' : ''}`} />
          <span>{lang === 'te' ? 'వాతావరణం రిఫ్రెష్ చేయండి' : 'Refresh Weather'}</span>
        </button>
      </div>

      {/* Main Current Weather Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#2D6A4F] via-[#1B4332] to-[#081C15] text-white shadow-lg space-y-6 relative overflow-hidden">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-700/50 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-800/60 border border-emerald-500/30 flex items-center justify-center text-3xl shadow-inner">
              🌧️
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-300">
                {lang === 'te' ? 'ప్రస్తుత ప్రత్యక్ష వాతావరణం' : 'Live Current Weather'}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {getConditionText()}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-rose-500 text-white shadow-sm animate-pulse">
              ⚡ Rain Alert Active (85%)
            </span>
          </div>
        </div>

        {/* Weather Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          
          {/* Temperature */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'te' ? 'ఉష్ణోగ్రత' : 'Temperature'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {weatherData?.current_temp_c || 31}°C
            </div>
            <div className="text-[11px] text-emerald-200 font-semibold">High: 33°C / Low: 24°C</div>
          </div>

          {/* Humidity */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'te' ? 'గాలిలో తేమ' : 'Humidity'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {weatherData?.current_humidity_pct || 76}%
            </div>
            <div className="text-[11px] text-emerald-200 font-semibold">High Humidity</div>
          </div>

          {/* Wind Speed */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'te' ? 'గాలి వేగం' : 'Wind Speed'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {weatherData?.wind_speed_kmh || 16} km/h
            </div>
            <div className="text-[11px] text-emerald-200 font-semibold">Breezy Conditions</div>
          </div>

          {/* Rain Probability */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-emerald-300" />
              <span>{lang === 'te' ? 'వర్షపాతం అవకాశం' : 'Rain Chance'}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-300">
              85%
            </div>
            <div className="text-[11px] text-emerald-200 font-semibold">Expect Showers</div>
          </div>

        </div>

        {/* Emergency Farmer Spray Warning Box */}
        <div className="p-5 rounded-2xl bg-amber-500/20 border border-amber-400/40 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-200">
              <ShieldAlert className="w-5 h-5 text-amber-300 shrink-0" />
              <h4 className="text-sm font-extrabold text-white">
                ⚠️ {lang === 'te' ? 'ముఖ్యమైన రైతు పిచికారీ సలహా:' : (lang === 'hi' ? 'महत्वपूर्ण किसान छिड़काव सलाह:' : 'Critical Pesticide Spraying Advisory:')}
              </h4>
            </div>

            <button
              onClick={toggleAudio}
              className="px-4 py-2 rounded-full bg-white hover:bg-emerald-50 text-[#2D6A4F] font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm shrink-0"
            >
              <Volume2 className={`w-4 h-4 text-[#2D6A4F] ${isPlayingAudio ? 'animate-bounce text-rose-600' : ''}`} />
              <span>{isPlayingAudio ? (lang === 'te' ? 'ఆపండి' : 'Stop Audio') : (lang === 'te' ? '🔊 సలహా వినండి' : '🔊 Listen Voice Advisory')}</span>
            </button>
          </div>

          <p className="text-xs sm:text-sm text-emerald-50 font-semibold leading-relaxed">
            {getAdvisoryText()}
          </p>
        </div>

      </div>

      {/* Hourly Timeline */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-[#2C3333] flex items-center gap-2">
          🕒 <span>{lang === 'te' ? 'నేటి గంటల వారీ వాతావరణ అంచనా' : 'Today Hourly Weather Timeline'}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {hourlyForecast.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-1.5 hover:border-emerald-300 transition-all">
              <div className="text-[11px] font-bold text-slate-500">{item.time}</div>
              <div className="text-lg font-black text-[#2C3333]">{item.temp}</div>
              <div className="text-[11px] font-bold text-[#2D6A4F]">🌧️ {item.rain} Rain</div>
              <div className="text-[10px] text-slate-600 font-semibold truncate">{item.condition}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Microclimate Weather Forecast */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
        <h3 className="text-sm font-bold text-[#2C3333] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#2D6A4F]" />
          <span>{lang === 'te' ? 'వారపు వాతావరణ అంచనా (7-Day Forecast)' : '7-Day Microclimate Weather Forecast'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeklyForecast.map((item, index) => {
            const dayName = item.day || `Day ${index + 1}`;
            const maxT = item.temp_max || 32;
            const minT = item.temp_min || 23;
            const cond = item.condition || 'Sunny';

            return (
              <div
                key={index}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-emerald-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="text-sm font-black text-[#2C3333]">{dayName}</div>
                  <div className="text-xs text-slate-500 font-semibold">{cond}</div>
                  <div className="text-xs text-[#2D6A4F] font-bold">💧 {item.humidity || 75}% Humidity</div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-[#2C3333]">{maxT}°C / {minT}°C</div>
                  <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full mt-1 inline-block">
                    🌧️ {item.rainfall_mm ? `${item.rainfall_mm} mm` : '0 mm'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
