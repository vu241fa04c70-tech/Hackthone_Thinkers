import React from 'react';
import { Check, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText } from '../utils/voiceUtils';

export default function LanguageSelectionScreen({ onConfirm }) {
  const { lang, setLanguage, t } = useLanguage();

  const languages = [
    { id: 'te', mainLabel: 'తెలుగు', subLabel: 'Telugu', flag: '🌾' },
    { id: 'hi', mainLabel: 'हिन्दी', subLabel: 'Hindi', flag: '🇮🇳' },
    { id: 'en', mainLabel: 'English', subLabel: 'English', flag: '🌐' }
  ];

  const handleSelect = (lId) => {
    setLanguage(lId);
    speakText(
      lId === 'te' 
        ? 'తెలుగు భాష ఎంచుకున్నారు. నమస్కారం!' 
        : (lId === 'hi' ? 'हिंदी भाषा चुनी गई।' : 'English language selected.'),
      lId
    );
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-slate-900/90 border-2 border-emerald-500/50 p-6 sm:p-10 rounded-3xl max-w-lg w-full shadow-2xl space-y-8 backdrop-blur-xl">
        
        {/* Title & Subtitle */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 border border-emerald-400/40 flex items-center justify-center text-4xl mx-auto shadow-xl shadow-emerald-500/20">
            🌾
          </div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">
            🌾 Kisan Mitra
          </h1>
          <p className="text-base font-bold text-emerald-400">
            Your AI farming companion
          </p>
          <div className="h-0.5 w-16 bg-emerald-500/40 mx-auto rounded-full my-2"></div>
          <p className="text-lg font-black text-slate-200">
            Choose your language
          </p>
        </div>

        {/* 3 Large Language Cards */}
        <div className="space-y-4">
          {languages.map((l) => {
            const isSelected = lang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => handleSelect(l.id)}
                className={`w-full p-5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border-emerald-500 text-emerald-300 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-slate-950/90 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-4 text-left">
                  <span className="text-3xl">{l.flag}</span>
                  <div>
                    <div className="text-xl font-black">{l.mainLabel}</div>
                    <div className="text-xs font-bold text-slate-400">{l.subLabel}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(l.mainLabel, l.id);
                    }}
                    className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800"
                    title="Listen voice preview"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  {isSelected && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue -> Button */}
        <button
          onClick={onConfirm}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-xl shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <span>Continue →</span>
        </button>

      </div>
    </div>
  );
}
