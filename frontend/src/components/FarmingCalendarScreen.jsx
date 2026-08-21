import React, { useState } from 'react';
import { Calendar, CheckSquare, Square, Volume2, Clock, Sparkles } from 'lucide-react';

export default function FarmingCalendarScreen({ lang = 'te' }) {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      week: lang === 'te' ? 'ఈ వారం (ప్రస్తుతం)' : 'Week 1 (Current)',
      title: lang === 'te' ? 'ఆకు పిచికారీ: Mancozeb 75% WP' : 'Foliar Spray: Mancozeb 75% WP',
      desc: lang === 'te' ? 'వర్షానికి ముందే ఎకరానికి 600 గ్రాములు పిచికారీ చేయండి.' : 'Spray 600g per acre before rainfall.',
      category: 'Spray',
      completed: false
    },
    {
      id: 2,
      week: lang === 'te' ? 'ఈ వారం (ప్రస్తుతం)' : 'Week 1 (Current)',
      title: lang === 'te' ? 'డ్రిప్ నీటి సమయం తగ్గించండి' : 'Adjust Drip Schedule',
      desc: lang === 'te' ? 'నేలలో 34% తేమ ఉంది. నీటిని 45 నిమిషాలకు పరిమితం చేయండి.' : 'Limit drip cycle to 45 mins due to rain forecast.',
      category: 'Irrigation',
      completed: false
    },
    {
      id: 3,
      week: lang === 'te' ? 'వచ్చే వారం (Week 2)' : 'Week 2',
      title: lang === 'te' ? 'పంట కోత సమయం (మండీ అమ్మకం)' : 'Optimal Harvest Window',
      desc: lang === 'te' ? 'మండీ ధర రూ. 27/కిలోకు పెరుగుతుంది. 3 రోజుల్లో కోత పూర్తి చేయండి.' : 'Mandi price expected to rise to ₹27/kg in 3 days.',
      category: 'Harvest',
      completed: false
    },
    {
      id: 4,
      week: lang === 'te' ? '3వ వారం (Week 3)' : 'Week 3',
      title: lang === 'te' ? 'ఎరువుల యాజమాన్యం (Urea)' : 'Fertilizer Application',
      desc: lang === 'te' ? 'ఎకరానికి 15 కేజీల Urea డ్రిప్ ద్వారా అందించండి.' : 'Apply 15 kg Urea per acre via fertigation.',
      category: 'Fertilizer',
      completed: false
    }
  ]);

  const [isPlayingId, setIsPlayingId] = useState(null);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const speakTask = (id, text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingId === id) {
        setIsPlayingId(null);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      if (lang === 'te') u.lang = 'te-IN';
      else if (lang === 'hi') u.lang = 'hi-IN';
      else u.lang = 'en-US';

      u.onend = () => setIsPlayingId(null);
      u.onerror = () => setIsPlayingId(null);

      setIsPlayingId(id);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            📅 {lang === 'te' ? 'వ్యవసాయ క్యాలెండర్ & పనుల జాబితా' : (lang === 'hi' ? 'कृषि कैलेंडर' : 'Farming Calendar')}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'te' ? 'విత్తుట, ఎరువుల సమయం మరియు కోత రిమైండర్లు వాయిస్‌తో' : 'सप्ताह-दर-सप्ताह कृषि कार्य सूची'}
          </p>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-3">
        {tasks.map((t) => (
          <div
            key={t.id}
            className={`p-5 rounded-3xl border transition-all flex items-start gap-4 ${
              t.completed
                ? 'bg-slate-950/40 border-slate-800 opacity-60'
                : 'bg-slate-900/90 border-slate-800 hover:border-emerald-500/50'
            }`}
          >
            <button
              onClick={() => toggleTask(t.id)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 cursor-pointer transition-all ${
                t.completed
                  ? 'bg-emerald-500 text-slate-950 font-black'
                  : 'bg-slate-950 border border-slate-700 text-slate-500 hover:border-emerald-400'
              }`}
            >
              {t.completed ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            </button>

            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-emerald-400">{t.week}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">
                  {t.category}
                </span>
              </div>
              <h3 className={`text-base font-black text-slate-100 ${t.completed ? 'line-through' : ''}`}>
                {t.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
            </div>

            <button
              onClick={() => speakTask(t.id, `${t.title}. ${t.desc}`)}
              className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center gap-1 cursor-pointer transition-all ${
                isPlayingId === t.id
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
