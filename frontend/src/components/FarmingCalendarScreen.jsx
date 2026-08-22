import React, { useState } from 'react';
import { CheckSquare, Square, Volume2 } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function FarmingCalendarScreen() {
  const { lang, t } = useLanguage();

  const getTasks = () => [
    {
      id: 1,
      week: t('calendar.task1Week'),
      title: t('calendar.task1Title'),
      desc: t('calendar.task1Desc'),
      category: t('calendar.task1Cat'),
      completed: false
    },
    {
      id: 2,
      week: t('calendar.task2Week'),
      title: t('calendar.task2Title'),
      desc: t('calendar.task2Desc'),
      category: t('calendar.task2Cat'),
      completed: false
    },
    {
      id: 3,
      week: t('calendar.task3Week'),
      title: t('calendar.task3Title'),
      desc: t('calendar.task3Desc'),
      category: t('calendar.task3Cat'),
      completed: false
    },
    {
      id: 4,
      week: t('calendar.task4Week'),
      title: t('calendar.task4Title'),
      desc: t('calendar.task4Desc'),
      category: t('calendar.task4Cat'),
      completed: false
    }
  ];

  const [tasks, setTasks] = useState(getTasks());
  const [isPlayingId, setIsPlayingId] = useState(null);

  // Sync tasks when language changes
  React.useEffect(() => {
    setTasks(getTasks());
  }, [lang]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(tItem => tItem.id === id ? { ...tItem, completed: !tItem.completed } : tItem));
  };

  const toggleAudio = (id, text) => {
    if (isPlayingId === id) {
      stopSpeech();
      setIsPlayingId(null);
      return;
    }

    setIsPlayingId(id);
    speakText(
      text,
      lang,
      () => setIsPlayingId(id),
      () => setIsPlayingId(null),
      () => setIsPlayingId(null)
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            📅 {t('calendar.title')}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {t('calendar.subtitle')}
          </p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((tItem) => (
          <div
            key={tItem.id}
            className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
              tItem.completed
                ? 'bg-slate-950/40 border-slate-800 opacity-60'
                : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <button
              onClick={() => toggleTask(tItem.id)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all ${
                tItem.completed
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-950 border border-slate-700 text-slate-500 hover:border-emerald-400'
              }`}
            >
              {tItem.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            </button>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-400">{tItem.week}</span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  {tItem.category}
                </span>
              </div>
              <h3 className={`text-base font-black text-slate-100 ${tItem.completed ? 'line-through' : ''}`}>
                {tItem.title}
              </h3>
              <p className="text-xs text-slate-300 font-bold leading-relaxed">{tItem.desc}</p>
            </div>

            <button
              onClick={() => toggleAudio(tItem.id, `${tItem.title}. ${tItem.desc}`)}
              className={`p-2.5 rounded-xl border text-xs font-black flex items-center gap-1 cursor-pointer transition-all ${
                isPlayingId === tItem.id
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-emerald-400'
              }`}
            >
              <Volume2 className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
