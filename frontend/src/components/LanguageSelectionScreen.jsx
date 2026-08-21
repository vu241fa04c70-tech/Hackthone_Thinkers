import React from 'react';
import { Globe, Check, Sparkles, Volume2 } from 'lucide-react';

export default function LanguageSelectionScreen({ selectedLang, onSelectLanguage, onClose }) {
  const languages = [
    { id: 'te', label: 'తెలుగు (Telugu)', subLabel: 'ముఖ్య భాష (Default)', flag: '🇮🇳' },
    { id: 'hi', label: 'हिंदी (Hindi)', subLabel: 'उत्तर भारत', flag: '🇮🇳' },
    { id: 'en', label: 'English', subLabel: 'Global', flag: '🌐' }
  ];

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (lang === 'te') u.lang = 'te-IN';
      else if (lang === 'hi') u.lang = 'hi-IN';
      else u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border-2 border-emerald-500 p-6 sm:p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-3xl mx-auto">
            🌾
          </div>
          <h2 className="text-2xl font-black text-slate-100">కిసాన్ మిత్ర (Kisan Mitra)</h2>
          <p className="text-sm font-bold text-emerald-400">
            దయచేసి మీ భాషను ఎంచుకోండి / Select Language
          </p>
        </div>

        {/* Language Options List */}
        <div className="space-y-3">
          {languages.map((l) => {
            const isSelected = selectedLang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => {
                  onSelectLanguage(l.id);
                  speakText(l.id === 'te' ? 'తెలుగు భాష ఎంచుకున్నారు. నమస్కారం!' : 'Language selected.', l.id);
                }}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">{l.flag}</span>
                  <div>
                    <div className="text-base font-black">{l.label}</div>
                    <div className="text-xs font-semibold text-slate-400">{l.subLabel}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(l.label, l.id);
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {isSelected && <Check className="w-5 h-5 text-emerald-400 font-extrabold" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-5 h-5 fill-slate-950" />
          {selectedLang === 'te' ? 'యాప్‌లోకి వెళ్లండి ➔' : (selectedLang === 'hi' ? 'ऐप शुरू करें ➔' : 'Continue to App ➔')}
        </button>

      </div>
    </div>
  );
}
