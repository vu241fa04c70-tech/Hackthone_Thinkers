import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Volume2, Calendar, CheckCircle2, Sprout, Clock } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function FarmingCalendarScreen() {
  const { lang, t } = useLanguage();

  const getTasks = () => {
    if (lang === 'te') {
      return [
        {
          id: 1,
          week: 'వారం 1 - 2 (తొలి దశ)',
          title: 'నేల దుక్కి దున్నడం & సేంద్రీయ ఎరువు వేయడం',
          desc: 'నేలను 2-3 సార్లు దున్ని పశువుల ఎరువు వేసి సమం చేయండి.',
          category: 'నేల తయారీ',
          completed: true
        },
        {
          id: 2,
          week: 'వారం 3 - 4 (విత్తన నాట్లు)',
          title: 'విత్తన శుద్ధి & నారు నాటడం',
          desc: 'ట్రైకోడెర్మా విరిడితో విత్తన శుద్ధి చేసి నారు మడిలో నాటండి.',
          category: 'విత్తనాల నాట్లు',
          completed: true
        },
        {
          id: 3,
          week: 'వారం 5 - 8 (ఎదుగుదల దశ)',
          title: 'నత్రజని (Urea) ఎరువు & నీటిపారుదల',
          desc: 'ఎకరానికి 25 కిలోల Urea ఎరువు మరియు డ్రిప్ నీరు అందించండి.',
          category: 'ఎరువుల యాజమాన్యం',
          completed: false
        },
        {
          id: 4,
          week: 'వారం 9 - 12 (పూత & పంట కాపు)',
          title: 'ఎర్లీ బ్లైట్ తెగులు నివారణ స్ప్రే',
          desc: 'లీటరు నీటికి 2 గ్రాముల Mancozeb కలిపి ఆకులపై పిచికారీ చేయండి.',
          category: 'తెగుళ్ల నివారణ',
          completed: false
        }
      ];
    } else if (lang === 'hi') {
      return [
        {
          id: 1,
          week: 'सप्ताह 1 - 2 (भूमि की तैयारी)',
          title: 'मृदा जुताई और जैविक खाद का प्रयोग',
          desc: 'मिट्टी की 2-3 बार जुताई करें और अच्छी तरह से सड़ी हुई गोबर की खाद मिलाएं।',
          category: 'भूमि तैयारी',
          completed: true
        },
        {
          id: 2,
          week: 'सप्ताह 3 - 4 (बुवाई)',
          title: 'बीज उपचार और नर्सरी बुवाई',
          desc: 'ट्राइकोडर्मा विरिडी से बीजों का उपचार करें और उठी हुई क्यारियों में बोएं।',
          category: 'बुवाई',
          completed: true
        },
        {
          id: 3,
          week: 'सप्ताह 5 - 8 (वानस्पतिक वृद्धि)',
          title: 'यूरिया उर्वरक का प्रयोग और नहर सिंचाई',
          desc: 'प्रति एकड़ 25 किग्रा यूरिया डालें और इष्टतम नमी बनाए रखें।',
          category: 'उर्वरक प्रबंधन',
          completed: false
        },
        {
          id: 4,
          week: 'सप्ताह 9 - 12 (फूल और फल लगना)',
          title: 'अगेती झुलसा रोकथाम के लिए कवकनाशी छिड़काव',
          desc: 'पत्तियों के झुलसा रोग को रोकने के लिए मैनकोज़ेब 2 ग्राम प्रति लीटर पानी का छिड़काव करें।',
          category: 'कीट एवं रोग नियंत्रण',
          completed: false
        }
      ];
    } else if (lang === 'ta') {
      return [
        {
          id: 1,
          week: 'வாரம் 1 - 2 (நில தயாரிப்பு)',
          title: 'மண் உழுதல் மற்றும் இயற்கை உரம் இடுதல்',
          desc: 'மண்ணை 2-3 முறை உழுது மக்கிய தொழு உரம் கலக்கவும்.',
          category: 'நில தயாரிப்பு',
          completed: true
        },
        {
          id: 2,
          week: 'வாரம் 3 - 4 (விதைப்பு)',
          title: 'விதை நேர்த்தி மற்றும் நாற்று நடுதல்',
          desc: 'ட்ரைகோடெர்மா விரிடி கொண்டு விதை நேர்த்தி செய்து நாற்று நடவும்.',
          category: 'விதைப்பு',
          completed: true
        },
        {
          id: 3,
          week: 'வாரம் 5 - 8 (வளர்ச்சி)',
          title: 'யுரியா உரம் இடுதல் மற்றும் நீர் பாசனம்',
          desc: 'ஏக்கருக்கு 25 கிலோ யுரியா உரம் இட்டு பாசனம் செய்யவும்.',
          category: 'உரம் இடுதல்',
          completed: false
        },
        {
          id: 4,
          week: 'வாரம் 9 - 12 (பூத்தல் & காய்த்தல்)',
          title: 'பயிர் நோய் தடுப்பு தெளித்தல்',
          desc: 'மான் கோசெப் பூச்சிக்கொல்லி தெளித்து பயிர் பாதுகாப்பு செய்யவும்.',
          category: 'பயிர் பாதுகாப்பு',
          completed: false
        }
      ];
    } else {
      return [
        {
          id: 1,
          week: 'Week 1 - 2 (Land Prep)',
          title: 'Soil Tilling & Organic Compost Application',
          desc: 'Till soil 2-3 times and mix well-rotted farmyard manure.',
          category: 'Land Prep',
          completed: true
        },
        {
          id: 2,
          week: 'Week 3 - 4 (Sowing)',
          title: 'Seed Treatment & Nursery Sowing',
          desc: 'Treat seeds with Trichoderma viride and sow in raised nursery beds.',
          category: 'Sowing',
          completed: true
        },
        {
          id: 3,
          week: 'Week 5 - 8 (Vegetative)',
          title: 'Urea Fertilizer Application & Canal Irrigation',
          desc: 'Top dress 25 kg Urea per acre and maintain optimum moisture.',
          category: 'Fertilizer',
          completed: false
        },
        {
          id: 4,
          week: 'Week 9 - 12 (Fruiting)',
          title: 'Fungicide Spray for Early Blight Protection',
          desc: 'Spray Mancozeb at 2g/liter water to prevent fungal leaf spot.',
          category: 'Pest Protection',
          completed: false
        }
      ];
    }
  };

  const [tasks, setTasks] = useState(getTasks());
  const [isPlayingId, setIsPlayingId] = useState(null);

  useEffect(() => {
    setTasks(getTasks());
  }, [lang]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const toggleAudio = (task) => {
    if (isPlayingId === task.id) {
      stopSpeech();
      setIsPlayingId(null);
      return;
    }

    const textToSpeak = `${task.week}: ${task.title}. ${task.desc}`;

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

  const getHeaderTitle = () => {
    switch (lang) {
      case 'te': return '📅 వ్యవసాయ క్యాలెండర్ & పంట దశలు';
      case 'hi': return '📅 कृषि कैलेंडर एवं फसल चरण अनुवेषक';
      case 'ta': return '📅 விவசாய நாட்காட்டி & பயிர் கட்டங்கள்';
      default: return '📅 Agricultural Farming Calendar & Stage Tracker';
    }
  };

  const getHeaderSubtitle = () => {
    switch (lang) {
      case 'te': return 'వారపు పంట పనులు, ఎరువులు మరియు మందుల పిచికారీ సమయాలను గమనించండి.';
      case 'hi': return 'साप्ताहिक फसल कार्यों, उर्वरक प्रयोग और कीट नियंत्रण छिड़काव के समय की निगरानी करें।';
      case 'ta': return 'வாராந்திர விவசாய பணிகள் மற்றும் உரம் இடும் நேரங்களை கண்காணிக்கவும்.';
      default: return 'Track weekly crop tasks, fertilizer application schedules, and pest protection spray timings.';
    }
  };

  const getSectionTitle = () => {
    switch (lang) {
      case 'te': return 'వారపు వ్యవసాయ పనుల జాబితా';
      case 'hi': return 'साप्ताहिक कृषि कार्य सूची';
      case 'ta': return 'வாராந்திர விவசாய பணிகள்';
      default: return 'Weekly Agricultural Activities';
    }
  };

  const getListenBtnText = () => {
    switch (lang) {
      case 'te': return 'వినండి 🔊';
      case 'hi': return 'सुनें 🔊';
      case 'ta': return 'கேட்க 🔊';
      default: return 'Listen 🔊';
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-400">
            {getHeaderTitle()}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-3xl">
          {getHeaderSubtitle()}
        </p>

        {/* Crop Growth Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-200">
            <span>{lang === 'te' ? 'పంట ఎదుగుదల పూర్తయిన శాతం' : (lang === 'hi' ? 'फसल विकास की प्रगति' : 'Crop Lifecycle Progress')}</span>
            <span className="text-emerald-400">{progressPct}% {lang === 'te' ? 'పూర్తయింది' : (lang === 'hi' ? 'पूर्ण हुआ' : 'Completed')}</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task Checklist Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <span>{getSectionTitle()}</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed
                  ? 'bg-slate-950/90 border-emerald-500/40 text-slate-400'
                  : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50 text-slate-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTask(task.id);
                  }}
                  className="mt-1 shrink-0 text-emerald-400 cursor-pointer"
                >
                  {task.completed ? (
                    <CheckSquare className="w-6 h-6 text-emerald-400" />
                  ) : (
                    <Square className="w-6 h-6 text-slate-500 hover:text-emerald-400" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {task.week}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">• {task.category}</span>
                  </div>

                  <h4 className={`text-base sm:text-lg font-black ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                    {task.title}
                  </h4>

                  <p className="text-xs text-slate-300 font-bold leading-relaxed">
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
                className={`min-h-[44px] px-4 py-2 rounded-2xl border font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                  isPlayingId === task.id
                    ? 'bg-rose-500 text-slate-950 border-rose-500 animate-pulse'
                    : 'bg-slate-950 text-emerald-400 border-slate-800 hover:border-emerald-500/40'
                }`}
              >
                <Volume2 className={`w-4 h-4 ${isPlayingId === task.id ? 'animate-bounce' : ''}`} />
                <span>{isPlayingId === task.id ? (lang === 'te' ? 'ఆపండి ⏹️' : 'Stop ⏹️') : getListenBtnText()}</span>
              </button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
