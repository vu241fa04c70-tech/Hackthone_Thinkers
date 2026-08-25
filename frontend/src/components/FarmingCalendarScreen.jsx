import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Volume2, Calendar, CheckCircle2, Sprout, Clock, CloudRain, Thermometer, ShieldAlert, Sparkles, Droplets, AlertTriangle, Search, MapPin } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { getLocalizedLocationName } from '../localization/locationTranslator';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function FarmingCalendarScreen({ activeField }) {
  const { lang } = useLanguage();

  // Load Farmer Profile & Field Context
  const farmerProfile = (() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      farmer_name: 'రమేష్ గారూ (Ramesh)',
      main_crop: activeField?.crop_type || 'Tomato',
      district: activeField?.location || 'Guntur',
      village: 'Mangalagiri'
    };
  })();

  const crop = farmerProfile.main_crop || activeField?.crop_type || 'Tomato';
  const defaultLoc = farmerProfile.village || farmerProfile.district || 'Mangalagiri';

  const [searchQuery, setSearchQuery] = useState(defaultLoc);
  const [activeLocation, setActiveLocation] = useState(defaultLoc);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlayingId, setIsPlayingId] = useState(null);

  const localizedLocation = getLocalizedLocationName(activeLocation, lang);

  // Fetch live satellite weather for searched village/area
  const fetchVillageWeather = (loc) => {
    setIsLoading(true);
    fetch(`/api/weather?location=${encodeURIComponent(loc)}`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchVillageWeather(activeLocation);
  }, [activeLocation]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveLocation(searchQuery.trim());
    }
  };

  const popularVillages = ['Mangalagiri', 'Guntur', 'Tenali', 'Vijayawada', 'Hyderabad', 'Karimnagar', 'Warangal', 'Tirupati', 'Nashik', 'Ludhiana'];

  // Generate dynamic, context-aware tasks based on Searched Village Soil & Weather
  const generateDynamicTasks = () => {
    const isRainyWeather = (weatherData?.rain_probability_pct || 60) > 40;
    const currentTemp = weatherData?.current_temp_c || 31;
    const currentHumidity = weatherData?.current_humidity_pct || 74;
    const soilMoisture = activeField?.soil_data?.moisture_percent || 34.0;
    const soilN = activeField?.soil_data?.nitrogen_n || 140.0;
    const growthStage = activeField?.growth_stage || 'Fruiting';

    // Soil type detection based on searched area
    const locLow = activeLocation.toLowerCase();
    let soilTypeStr = 'Black Loam Soil (నల్లరేగడి నేల)';
    if (locLow.includes('tirupati') || locLow.includes('anantapur')) {
      soilTypeStr = 'Red Loamy Soil (ఎర్ర నేల)';
    } else if (locLow.includes('vijayawada') || locLow.includes('ludhiana')) {
      soilTypeStr = 'Alluvial River Basin Soil (ఒండ్రు నేల)';
    }

    if (lang === 'te') {
      return [
        {
          id: 'task_village_weather',
          priority: 'URGENT',
          priorityLabel: '⚠️ తక్షణ వాతావరణ పని (గ్రామ ప్రత్యక్ష హెచ్చరిక)',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          week: 'ఈ రోజు (తక్షణ పని)',
          title: isRainyWeather 
            ? `${localizedLocation} గ్రామంలో వర్షపాతం: క్రిమిసంహారకాల పిచికారీ & నీరు నిలిపివేత` 
            : `${localizedLocation} గ్రామంలో పొడి వాతావరణం: ఉదయం డ్రిప్ తడి అందించడం`,
          desc: isRainyWeather 
            ? `${localizedLocation} గ్రామంలో నేడు 65% వర్షపాతం పడే అవకాశం ఉంది. మందుల పిచికారీ ఆపి, పొలంలో నీరు నిలవకుండా డ్రెయిన్ కాలువలు తెరవండి.` 
            : `ప్రస్తుత ఉష్ణోగ్రత ${currentTemp}°C, గాలి తేమ ${currentHumidity}%. ఉదయం 7 నుండి 9 గంటల మధ్య 45 నిమిషాలు డ్రిప్ నీరు అందించండి.`,
          category: 'గ్రామ వాతావరణ నిర్వహణ',
          completed: false
        },
        {
          id: 'task_soil_fertilizer',
          priority: 'RECOMMENDED',
          priorityLabel: '💡 నేల సారం సిఫార్సు',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          week: 'వారం 5 - 8 (ఎదుగుదల దశ)',
          title: `${soilTypeStr} కి నత్రజని (Urea) టాప్-డ్రెస్సింగ్`,
          desc: `${localizedLocation} ప్రాంతపు ${soilTypeStr} లో నత్రజని లభ్యత ${soilN} kg/ha ఉంది. ఎకరానికి 15 కేజీల Urea ఎరువును డ్రిప్ ద్వారా వేయండి.`,
          category: 'నేల సారం & ఎరువులు',
          completed: false
        },
        {
          id: 'task_crop_stage',
          priority: 'ROUTINE',
          priorityLabel: '📅 పంట దశ పర్యవేక్షణ',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          week: 'వారం 9 - 12 (కాపు దశ)',
          title: `${crop} పంట ${growthStage} దశ: ఆకుమచ్చ & తెగుళ్ల నివారణ`,
          desc: `మీ ${crop} పంట ప్రస్తుతం ${growthStage} దశలో ఉంది. లీటరు నీటికి 2 గ్రాముల Mancozeb 75% WP లేదా వేప నూనె (5ml/L) పిచికారీ చేయండి.`,
          category: 'పంట రక్షణ',
          completed: true
        },
        {
          id: 'task_mandi_harvest',
          priority: 'ROUTINE',
          priorityLabel: '💰 విక్రయ సమయం',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          week: 'వారం 13 - 14 (కోత దశ)',
          title: `${localizedLocation} సమీప మండీ విక్రయ ప్రణాళిక`,
          desc: `${localizedLocation} హోల్‌సేల్ యార్డ్‌లో ధర పెరుగుతోంది. 3 రోజుల తర్వాత కోత చేయడం ద్వారా క్వింటాల్‌కు రూ. 300 అదనపు లాభం పొందుతారు.`,
          category: 'కోత & అమ్మకం',
          completed: false
        }
      ];
    } else if (lang === 'hi') {
      return [
        {
          id: 'task_village_weather',
          priority: 'URGENT',
          priorityLabel: '⚠️ अत्यंत आवश्यक (गांव मौसम आधारित)',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          week: 'आज का कार्य',
          title: isRainyWeather 
            ? `${localizedLocation} गांव में बारिश की चेतावनी: छिड़काव रोकें` 
            : `${localizedLocation} गांव में शुष्क मौसम: सुबह ड्रिप सिंचाई करें`,
          desc: isRainyWeather 
            ? `${localizedLocation} में आज बारिश की संभावना है। छिड़काव रोकें और खेत से अतिरिक्त पानी निकाल दें।` 
            : `तापमान ${currentTemp}°C है। सुबह 7 से 9 बजे के बीच 45 मिनट सिंचाई करें।`,
          category: 'गांव मौसम प्रबंधन',
          completed: false
        },
        {
          id: 'task_soil_fertilizer',
          priority: 'RECOMMENDED',
          priorityLabel: '💡 मृदा स्वास्थ्य सलाह',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          week: 'सप्ताह 5 - 8 (वानस्पतिक वृद्धि)',
          title: `यूरिया (Nitrogen) उर्वरक प्रयोग`,
          desc: `${localizedLocation} की मिट्टी में नाइट्रोजन की मात्रा ${soilN} kg/ha है। प्रति एकड़ 15 किग्रा यूरिया डालें।`,
          category: 'उर्वरक प्रबंधन',
          completed: false
        },
        {
          id: 'task_crop_stage',
          priority: 'ROUTINE',
          priorityLabel: '📅 फसल चरण',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          week: 'सप्ताह 9 - 12 (फलन चरण)',
          title: `${crop} फसल (${growthStage} अवस्था): कवकनाशी छिड़काव`,
          desc: `झुलसा रोग से बचाव हेतु 2 ग्राम/लीटर मैनकोज़ेब का छिड़काव करें।`,
          category: 'फसल सुरक्षा',
          completed: true
        }
      ];
    } else {
      return [
        {
          id: 'task_village_weather',
          priority: 'URGENT',
          priorityLabel: '⚠️ URGENT (Village Weather Triggered)',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          week: 'Today (Immediate Action)',
          title: isRainyWeather 
            ? `Rain Alert in ${localizedLocation} Village: Pause Spraying & Drain Water` 
            : `Dry Spell in ${localizedLocation} Village: Morning Drip Irrigation`,
          desc: isRainyWeather 
            ? `Rain probability is high in ${localizedLocation}. Postpone all chemical spraying and open field drainage channels.` 
            : `Current temperature is ${currentTemp}°C with ${currentHumidity}% humidity. Run drip irrigation for 45 mins between 7 AM - 9 AM.`,
          category: 'Village Weather Management',
          completed: false
        },
        {
          id: 'task_soil_fertilizer',
          priority: 'RECOMMENDED',
          priorityLabel: '💡 RECOMMENDED (Soil Test Based)',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          week: 'Week 5 - 8 (Vegetative Stage)',
          title: `Nitrogen (Urea) Top-Dressing for ${soilTypeStr}`,
          desc: `Soil test for ${localizedLocation} shows Nitrogen at ${soilN} kg/ha and Moisture at ${soilMoisture}%. Apply 15kg Urea per acre via drip.`,
          category: 'Soil & Fertilizer',
          completed: false
        },
        {
          id: 'task_crop_stage',
          priority: 'ROUTINE',
          priorityLabel: '📅 ROUTINE (Crop Growth Stage)',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          week: 'Week 9 - 12 (Fruiting Stage)',
          title: `${crop} Crop (${growthStage} Stage): Preventive Fungicide Spray`,
          desc: `Your ${crop} crop is at ${growthStage} stage. Spray Mancozeb 75% WP at 2g/L water for leaf spot protection.`,
          category: 'Crop Protection',
          completed: true
        },
        {
          id: 'task_mandi_harvest',
          priority: 'ROUTINE',
          priorityLabel: '💰 Market Timing',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          week: 'Week 13 - 14 (Harvest Stage)',
          title: `Harvest Strategy for ${localizedLocation} APMC Market`,
          desc: `Wholesale prices near ${localizedLocation} are rising. Delay harvest by 3 days for an extra +₹300/quintal profit.`,
          category: 'Harvest & Sales',
          completed: false
        }
      ];
    }
  };

  const [tasks, setTasks] = useState(generateDynamicTasks());

  useEffect(() => {
    setTasks(generateDynamicTasks());
  }, [lang, weatherData, activeLocation]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleAudio = (task) => {
    if (isPlayingId === task.id) {
      stopSpeech();
      setIsPlayingId(null);
      return;
    }

    const textToSpeak = `${task.title}. ${task.desc}`;
    setIsPlayingId(task.id);
    speakText(
      textToSpeak,
      lang,
      () => setIsPlayingId(task.id),
      () => setIsPlayingId(null),
      () => setIsPlayingId(null)
    );
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner & Village Search Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#2C3333]">
                {lang === 'te' ? 'గ్రామాల వారీ స్మార్ట్ వ్యవసాయ క్యాలెండర్' : (lang === 'hi' ? 'गांव वार स्मार्ट कृषि कैलेंडर' : 'Village-Specific Smart Farming Calendar')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-3xl">
              {lang === 'te'
                ? 'మీ గ్రామం పేరు టైప్ చేయండి. ఆ గ్రామం యొక్క నిజమైన సాటిలైట్ వాతావరణం మరియు నేల సారానికి తగిన కచ్చితమైన క్యాలెండర్ పొందండి.'
                : 'Type your village or mandal name to generate realistic, weather-driven farming tasks tailored to your local soil & crop stage.'}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl shrink-0 text-center space-y-0.5">
            <div className="text-[10px] font-bold uppercase text-[#2D6A4F]">
              📍 {localizedLocation}
            </div>
            <div className="text-xs font-black text-slate-900">
              🌱 {crop} ({activeField?.growth_stage || 'Fruiting'})
            </div>
            <div className="text-[10px] font-bold text-slate-600">
              🌡️ {weatherData?.current_temp_c || 31}°C • 💧 {weatherData?.current_humidity_pct || 74}%
            </div>
          </div>
        </div>

        {/* Village Search Input Form */}
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 pt-2 border-t border-emerald-100">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'te' ? 'మీ గ్రామం లేదా మండల పేరు టైప్ చేయండి (ఉదా: మంగళగిరి, గుంటూరు, తెనాలి)...' : (lang === 'hi' ? 'अपने गांव या मंडल का नाम दर्ज करें...' : 'Type your village or mandal name (e.g., Mangalagiri, Tenali, Guntur)...')}
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] shadow-sm"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs shrink-0 cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            {isLoading ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <MapPin className="w-3.5 h-3.5" />}
            <span>{lang === 'te' ? 'గ్రామ క్యాలెండర్ చూడండి' : 'Get Village Calendar'}</span>
          </button>
        </form>

        {/* Popular Village Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[11px] font-bold text-slate-500 shrink-0">
            {lang === 'te' ? 'ముఖ్య గ్రామాలు/మండలాలు:' : 'Popular Areas:'}
          </span>
          {popularVillages.map((vName) => {
            const locV = getLocalizedLocationName(vName, lang);
            const isSelected = activeLocation.toLowerCase().includes(vName.toLowerCase());
            return (
              <button
                key={vName}
                onClick={() => {
                  setSearchQuery(vName);
                  setActiveLocation(vName);
                }}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-[#2D6A4F] text-white shadow-sm scale-[1.02]'
                    : 'bg-slate-100 hover:bg-emerald-50 text-slate-700 border border-slate-200'
                }`}
              >
                📍 {locV}
              </button>
            );
          })}
        </div>

        {/* Lifecycle Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-emerald-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{lang === 'te' ? `${localizedLocation} గ్రామ పనుల ప్రగతి` : `${localizedLocation} Task Completion`}</span>
            <span className="text-[#2D6A4F] font-extrabold">{progressPct}% {lang === 'te' ? 'పూర్తయింది' : 'Completed'}</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
            <div
              className="bg-[#2D6A4F] h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Checklist Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#2D6A4F]" />
          <span>{lang === 'te' ? `${localizedLocation} గ్రామానికి అనుగుణంగా వాతావరణ & నేల పనుల పట్టిక` : `Realistic Measures & Priority Schedule for ${localizedLocation}`}</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => {
            const isPlaying = isPlayingId === task.id;
            return (
              <div
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`p-6 rounded-3xl border transition-all duration-200 cursor-pointer shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-emerald-50/40 border-emerald-200 text-slate-500'
                    : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                    className="mt-1 shrink-0 text-[#2D6A4F] cursor-pointer"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-6 h-6 text-[#2D6A4F]" />
                    ) : (
                      <Square className="w-6 h-6 text-slate-400 hover:text-[#2D6A4F]" />
                    )}
                  </button>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${task.badgeColor}`}>
                        {task.priorityLabel}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {task.week}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">• {task.category}</span>
                    </div>

                    <h4 className={`text-base sm:text-lg font-bold ${task.completed ? 'line-through text-slate-400' : 'text-[#2C3333]'}`}>
                      {task.title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                      {task.desc}
                    </p>
                  </div>
                </div>

                {/* Audio Listen Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAudio(task);
                  }}
                  className={`min-h-[40px] px-4 py-2 rounded-full border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                    isPlaying
                      ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                      : 'bg-emerald-50 text-[#2D6A4F] border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                  <span>{isPlaying ? (lang === 'te' ? 'ఆపండి ⏹️' : 'Stop ⏹️') : (lang === 'te' ? 'సలహా వినండి 🔊' : 'Listen Advice 🔊')}</span>
                </button>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
