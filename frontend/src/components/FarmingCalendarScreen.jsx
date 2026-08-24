import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Volume2, Calendar, CheckCircle2, Sprout, Clock } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function FarmingCalendarScreen() {
  const { lang, t } = useLanguage();

  const getTasks = () => [
    {
      id: 1,
      week: lang === 'te' ? 'వారం 1 - 2 (తొలి దశ)' : 'Week 1 - 2 (Land Prep)',
      title: lang === 'te' ? 'నేల దుక్కి దున్నడం & సేంద్రీయ ఎరువు వేయడం' : 'Soil Tilling & Organic Compost Application',
      desc: lang === 'te' ? 'నేలను 2-3 సార్లు దున్ని పశువుల ఎరువు వేసి సమం చేయండి.' : 'Till soil 2-3 times and mix well-rotted farmyard manure.',
      category: 'Land Prep',
      completed: true
    },
    {
      id: 2,
      week: lang === 'te' ? 'వారం 3 - 4 (విత్తన నాట్లు)' : 'Week 3 - 4 (Sowing)',
      title: lang === 'te' ? 'విత్తన శుద్ధి & నారు నాటడం' : 'Seed Treatment & Nursery Sowing',
      desc: lang === 'te' ? 'ట్రైకోడెర్మా విరిడితో విత్తన శుద్ధి చేసి నారు మడిలో నాటండి.' : 'Treat seeds with Trichoderma viride and sow in raised nursery beds.',
      category: 'Sowing',
      completed: true
    },
    {
      id: 3,
      week: lang === 'te' ? 'వారం 5 - 8 (ఎదుగుదల దశ)' : 'Week 5 - 8 (Vegetative)',
      title: lang === 'te' ? 'నత్రజని (Urea) ఎరువు & నీటిపారుదల' : 'Urea Fertilizer Application & Canal Irrigation',
      desc: lang === 'te' ? 'ఎకరానికి 25 కిలోల Urea ఎరువు మరియు డ్రిప్ నీరు అందించండి.' : 'Top dress 25 kg Urea per acre and maintain optimum moisture.',
      category: 'Fertilizer',
      completed: false
    },
    {
      id: 4,
      week: lang === 'te' ? 'వారం 9 - 12 (పూత & పంట కాపు)' : 'Week 9 - 12 (Fruiting)',
      title: lang === 'te' ? 'ఎర్లీ బ్లైట్ తెగులు నివారణ స్ప్రే' : 'Fungicide Spray for Early Blight Protection',
      desc: lang === 'te' ? 'లీటరు నీటికి 2 గ్రాముల Mancozeb కలిపి ఆకులపై పిచికారీ చేయండి.' : 'Spray Mancozeb at 2g/liter water to prevent fungal leaf spot.',
      category: 'Pest Protection',
      completed: false
    }
  ];

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

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📅</span>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-400">
            Agricultural Farming Calendar & Stage Tracker
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-3xl">
          Track weekly crop tasks, fertilizer application schedules, and pest protection spray timings.
        </p>

        {/* Crop Growth Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-between text-xs font-black text-slate-200">
            <span>Crop Lifecycle Progress</span>
            <span className="text-emerald-400">{progressPct}% Completed</span>
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
          <span>Weekly Agricultural Activities</span>
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
                <span>{isPlayingId === task.id ? 'Stop' : 'Listen'}</span>
              </button>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
