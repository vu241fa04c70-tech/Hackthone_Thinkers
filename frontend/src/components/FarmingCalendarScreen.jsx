import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Volume2, Calendar, CheckCircle2, Sprout, Clock, CloudRain, Thermometer, ShieldAlert, Sparkles, Droplets, AlertTriangle } from 'lucide-react';
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
  const district = farmerProfile.district || 'Guntur';
  const localizedLocation = getLocalizedLocationName(district, lang);

  const [weatherData, setWeatherData] = useState(null);
  const [isPlayingId, setIsPlayingId] = useState(null);

  // Fetch live satellite weather to trigger weather-based calendar rules
  useEffect(() => {
    fetch(`/api/weather?location=${encodeURIComponent(district)}`)
      .then(res => res.json())
      .then(data => setWeatherData(data))
      .catch(() => {});
  }, [district]);

  // Generate dynamic, context-aware tasks based on Soil, Weather, & Crop Stage
  const generateDynamicTasks = () => {
    const isRainyWeather = (weatherData?.rain_probability_pct || 65) > 40;
    const currentTemp = weatherData?.current_temp_c || 31;
    const soilMoisture = activeField?.soil_data?.moisture_percent || 34.0;
    const soilN = activeField?.soil_data?.nitrogen_n || 140.0;
    const growthStage = activeField?.growth_stage || 'Fruiting';

    if (lang === 'te') {
      return [
        {
          id: 'task_weather_advisory',
          priority: 'URGENT',
          priorityLabel: '⚠️ అత్యవసరం (వాతావరణ ఆధారిత)',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          week: 'ఈ వారం (తక్షణ పని)',
          title: isRainyWeather 
            ? 'వర్షపాత హెచ్చరిక: క్రిమిసంహారకాల పిచికారీ & నీటిపారుదల నిలిపివేత' 
            : 'ఎండ వాతావరణం: ఉదయం పూట డ్రిప్ నీటిపారుదల',
          desc: isRainyWeather 
            ? `ఈ వారంలో ${localizedLocation} ప్రాంతంలో 65% వర్షపాతం పడే అవకాశం ఉంది. మందుల పిచికారీ ఆపండి, పొలంలో వర్షపు నీరు నిలవకుండా డ్రెయిన్ చేయండి.` 
            : `ప్రస్తుత ఉష్ణోగ్రత ${currentTemp}°C గా ఉంది. ఉదయం 7 నుండి 9 గంటల మధ్య 45 నిమిషాలు డ్రిప్ నీరు అందించండి.`,
          category: 'వాతావరణ నిర్వహణ',
          completed: false
        },
        {
          id: 'task_soil_fertilizer',
          priority: 'RECOMMENDED',
          priorityLabel: '💡 సిఫార్సు (నేల పరీక్ష ఆధారిత)',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          week: 'వారం 5 - 8 (ఎదుగుదల దశ)',
          title: soilN < 150 
            ? 'నత్రజని (Urea) ఎరువు టాప్-డ్రెస్సింగ్' 
            : 'పొటాషియం సల్ఫేట్ (SOP) పిచికారీ',
          desc: `మీ తోట నేలలో నత్రజని లభ్యత ${soilN} kg/ha గా ఉంది. ఎకరానికి 15 కేజీల Urea ఎరువును డ్రిప్ ద్వారా లేదా తడి నేలలో వేయండి.`,
          category: 'నేల & ఎరువుల యాజమాన్యం',
          completed: false
        },
        {
          id: 'task_crop_stage',
          priority: 'ROUTINE',
          priorityLabel: '📅 సాధారణం (పంట దశ ఆధారిత)',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          week: 'వారం 9 - 12 (కాపు దశ)',
          title: `${crop} పంట ${growthStage} దశ: తెగుళ్ల నివారణ పిచికారీ`,
          desc: `మీ ${crop} పంట ప్రస్తుతం ${growthStage} దశలో ఉంది. ఆకుమచ్చ లేదా కాయ తొలిచే పురుగు నివారణకు లీటరు నీటికి 2 గ్రాముల Mancozeb 75% WP పిచికారీ చేయండి.`,
          category: 'పంట సంరక్షణ',
          completed: true
        },
        {
          id: 'task_mandi_harvest',
          priority: 'ROUTINE',
          priorityLabel: '💰 మార్కెట్ సమయం',
          badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
          week: 'వారం 13 - 14 (కోత దశ)',
          title: 'కోత సమయం & మండీ విక్రయ ప్రణాళిక',
          desc: `మండీ ధర ప్రస్తుతం పెరుగుతోంది. 3 రోజుల తర్వాత కోత పూర్తి చేయడం ద్వారా క్వింటాల్‌కు రూ. 300 అదనపు లాభం పొందుతారు.`,
          category: 'కోత & అమ్మకం',
          completed: false
        }
      ];
    } else if (lang === 'hi') {
      return [
        {
          id: 'task_weather_advisory',
          priority: 'URGENT',
          priorityLabel: '⚠️ अत्यंत आवश्यक (मौसम आधारित)',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          week: 'इस सप्ताह (तत्काल कार्य)',
          title: isRainyWeather 
            ? 'वर्षा चेतावनी: कीटनाशक छिड़काव और सिंचाई रोकें' 
            : 'शुष्क मौसम: सुबह ड्रिप सिंचाई करें',
          desc: isRainyWeather 
            ? `आज ${localizedLocation} में बारिश की संभावना है। छिड़काव रोकें और खेत में पानी का भराव न होने दें।` 
            : `तापमान ${currentTemp}°C है। सुबह 7 से 9 बजे के बीच 45 मिनट सिंचाई करें।`,
          category: 'मौसम प्रबंधन',
          completed: false
        },
        {
          id: 'task_soil_fertilizer',
          priority: 'RECOMMENDED',
          priorityLabel: '💡 अनुशंसित (मृदा परीक्षण आधारित)',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          week: 'सप्ताह 5 - 8 (वानस्पतिक वृद्धि)',
          title: 'यूरिया (Nitrogen) उर्वरक प्रयोग',
          desc: `मिट्टी में नाइट्रोजन की मात्रा ${soilN} kg/ha है। प्रति एकड़ 15 किग्रा यूरिया ड्रिप के माध्यम से दें।`,
          category: 'उर्वरक प्रबंधन',
          completed: false
        },
        {
          id: 'task_crop_stage',
          priority: 'ROUTINE',
          priorityLabel: '📅 सामान्य (फसल चरण)',
          badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          week: 'सप्ताह 9 - 12 (फलन चरण)',
          title: `${crop} फसल (${growthStage} अवस्था): कवकनाशी छिड़काव`,
          desc: `पत्तियों के झुलसा रोग से बचाव हेतु 2 ग्राम/लीटर मैनकोज़ेब का छिड़काव करें।`,
          category: 'फसल सुरक्षा',
          completed: true
        }
      ];
    } else {
      return [
        {
          id: 'task_weather_advisory',
          priority: 'URGENT',
          priorityLabel: '⚠️ URGENT (Weather Triggered)',
          badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
          week: 'This Week (Immediate Action)',
          title: isRainyWeather 
            ? 'Rain Forecast Alert: Pause Pesticide Spraying & Canal Irrigation' 
            : 'Dry Weather Window: Morning Drip Irrigation Cycle',
          desc: isRainyWeather 
            ? `Rain probability is high in ${localizedLocation}. Pause all chemical sprays and ensure field drainage.` 
            : `Current temperature is ${currentTemp}°C. Run drip irrigation for 45 minutes between 7:00 AM - 9:00 AM.`,
          category: 'Weather Management',
          completed: false
        },
        {
          id: 'task_soil_fertilizer',
          priority: 'RECOMMENDED',
          priorityLabel: '💡 RECOMMENDED (Soil Test Based)',
          badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
          week: 'Week 5 - 8 (Vegetative Stage)',
          title: soilN < 150 
            ? 'Nitrogen (Urea) Top-Dressing Fertigation' 
            : 'Potassium Sulphate Foliar Spray',
          desc: `Soil test shows Nitrogen at ${soilN} kg/ha and Moisture at ${soilMoisture}%. Apply 15kg Urea per acre via drip.`,
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
          title: 'Harvest Schedule & Mandi Sales Strategy',
          desc: `Mandi prices are trending upwards. Delay harvest by 3 days for an extra +₹300/quintal price gain.`,
          category: 'Harvest & Sales',
          completed: false
        }
      ];
    }
  };

  const [tasks, setTasks] = useState(generateDynamicTasks());

  useEffect(() => {
    setTasks(generateDynamicTasks());
  }, [lang, weatherData]);

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
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📅</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#2C3333]">
                {lang === 'te' ? 'స్మార్ట్ వ్యవసాయ క్యాలెండర్ & పనివేళల సూచిక' : (lang === 'hi' ? 'स्मार्ट कृषि कैलेंडर एवं कार्य अनुवेषक' : 'Smart Agricultural Farming Calendar & Field Tracker')}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-3xl">
              {lang === 'te'
                ? `మీ ప్రాంతపు సాటిలైట్ వాతావరణం (${localizedLocation}), నేల సారం మరియు ${crop} పంట దశకు అనుగుణంగా తయారు చేసిన వారపు పనులు.`
                : `Tailored weekly tasks based on live satellite weather in ${localizedLocation}, soil moisture (${activeField?.soil_data?.moisture_percent || 34}%), and ${crop} growth stage.`}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl shrink-0 text-center space-y-0.5">
            <div className="text-[10px] font-bold uppercase text-[#2D6A4F]">
              {lang === 'te' ? 'పంట & నేల స్థితి' : 'Crop & Soil Health'}
            </div>
            <div className="text-xs font-black text-slate-900">
              🌱 {crop} ({activeField?.growth_stage || 'Fruiting'})
            </div>
            <div className="text-[10px] font-bold text-slate-600">
              💧 Moisture: {activeField?.soil_data?.moisture_percent || 34}%
            </div>
          </div>
        </div>

        {/* Lifecycle Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-emerald-100">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span>{lang === 'te' ? 'సీజన్ పనుల ప్రగతి' : (lang === 'hi' ? 'सीजन कार्यों की प्रगति' : 'Season Activity Progress')}</span>
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
          <span>{lang === 'te' ? 'వాతావరణం & నేల ఆధారిత ప్రాధాన్యత పనుల జాబితా' : 'Weather & Soil Priority Task Schedule'}</span>
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
