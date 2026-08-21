import React, { useState, useEffect } from 'react';
import { Camera, CloudRain, DollarSign, Mic, Volume2, Sparkles, AlertCircle, ArrowRight, Play, Square, PhoneCall } from 'lucide-react';

export default function KisanHomeGrid({ profile, onSelectAction }) {
  const [briefing, setBriefing] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    fetchBriefing();
  }, [profile]);

  const fetchBriefing = async () => {
    try {
      const farmerName = profile?.farmer_name || 'Ramesh Bhai';
      const lang = profile?.language || 'Hindi';
      const res = await fetch(`/api/agents/morning-briefing?farmer_name=${encodeURIComponent(farmerName)}&language=${lang}`);
      const data = await res.json();
      setBriefing(data);
    } catch (err) {
      console.error(err);
    }
  };

  const playAudioScript = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingAudio) {
        setIsPlayingAudio(false);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      const lang = profile?.language || 'Hindi';
      if (lang === 'Hindi') u.lang = 'hi-IN';
      else if (lang === 'Telugu') u.lang = 'te-IN';
      else if (lang === 'Marathi') u.lang = 'mr-IN';
      else u.lang = 'en-US';

      u.onend = () => setIsPlayingAudio(false);
      u.onerror = () => setIsPlayingAudio(false);

      setIsPlayingAudio(true);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 🌅 7 AM Daily WhatsApp Voice Audio Briefing Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-teal-950/60 border border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 text-2xl">
              🌅
            </div>
            <div>
              <div className="text-xs text-emerald-400 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Daily WhatsApp Audio Briefing (7 AM)
              </div>
              <h2 className="text-xl font-black text-slate-100 mt-0.5">
                {briefing?.greeting || `Namaste ${profile?.farmer_name || 'Ramesh'}!`}
              </h2>
            </div>
          </div>

          <button
            onClick={() => playAudioScript(briefing?.voice_script || 'Good morning! Rain expected at 2 PM today. Hold irrigation and market harvest for 3 days.')}
            className={`px-5 py-3 rounded-2xl font-extrabold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isPlayingAudio
                ? 'bg-rose-500 text-white animate-pulse shadow-rose-500/30'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isPlayingAudio ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isPlayingAudio ? 'Pause Audio' : '🔊 Listen Daily Audio Briefing'}</span>
          </button>
        </div>

        {/* Action Bullet Points */}
        {briefing && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80">
            {briefing.key_action_points.map((act, idx) => (
              <div key={idx} className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800/80 flex items-start gap-2">
                <span className="text-emerald-400 font-bold shrink-0">✅</span>
                <span className="text-xs font-bold text-slate-200 leading-relaxed">{act}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4 Big Picture Action Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Card 1: 📷 My Crop Photo */}
        <button
          onClick={() => onSelectAction('doctor')}
          className="group relative p-8 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/60 shadow-xl transition-all duration-300 text-left flex flex-col justify-between h-64 overflow-hidden cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              📷
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              Disease Scan
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-100 group-hover:text-emerald-300 transition-colors">
              My Crop Photo
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Point camera at sick leaf → Get instant remedy & price in ₹
            </p>
          </div>

          <div className="flex items-center text-xs font-extrabold text-emerald-400 gap-1.5 group-hover:translate-x-1 transition-transform">
            <span>Scan Crop Leaf Now</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Card 2: 🌤️ Weather Today */}
        <button
          onClick={() => onSelectAction('weather_simple')}
          className="group relative p-8 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/60 shadow-xl transition-all duration-300 text-left flex flex-col justify-between h-64 overflow-hidden cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-16 h-16 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              🌤️
            </div>
            <span className="text-xs font-bold text-sky-400 bg-sky-500/10 px-3 py-1 rounded-full border border-sky-500/20">
              Village Weather
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-100 group-hover:text-sky-300 transition-colors">
              Weather Today
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {briefing?.weather_simple_advice || "⚠️ Rain at 2 PM: Don't spray pesticides today."}
            </p>
          </div>

          <div className="flex items-center text-xs font-extrabold text-sky-400 gap-1.5 group-hover:translate-x-1 transition-transform">
            <span>View Today's Rain Advisory</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Card 3: 💰 Market Price */}
        <button
          onClick={() => onSelectAction('market')}
          className="group relative p-8 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/60 shadow-xl transition-all duration-300 text-left flex flex-col justify-between h-64 overflow-hidden cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              💰
            </div>
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Mandi Prices
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-100 group-hover:text-amber-300 transition-colors">
              Market Price
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              {briefing?.market_simple_advice || "💡 Hold 3 days: Price expected to rise to ₹27/kg!"}
            </p>
          </div>

          <div className="flex items-center text-xs font-extrabold text-amber-400 gap-1.5 group-hover:translate-x-1 transition-transform">
            <span>Check Mandi Price & Sell Timing</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

        {/* Card 4: 🎤 Ask Me Anything */}
        <button
          onClick={() => onSelectAction('copilot')}
          className="group relative p-8 rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/60 shadow-xl transition-all duration-300 text-left flex flex-col justify-between h-64 overflow-hidden cursor-pointer"
        >
          <div className="flex items-start justify-between w-full">
            <div className="w-16 h-16 rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
              🎤
            </div>
            <span className="text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
              Voice Assistant
            </span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-slate-100 group-hover:text-teal-300 transition-colors">
              Ask Me Anything
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Speak in Hindi, Telugu, Marathi, Tamil: "मेरी फसल पीली हो रही है"
            </p>
          </div>

          <div className="flex items-center text-xs font-extrabold text-teal-400 gap-1.5 group-hover:translate-x-1 transition-transform">
            <span>Press Mic & Talk</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </button>

      </div>

    </div>
  );
}
