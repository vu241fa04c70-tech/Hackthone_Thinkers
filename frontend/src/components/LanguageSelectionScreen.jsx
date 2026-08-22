import React from 'react';
import { Check, Sparkles, Volume2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../localization/languageMap';
import { speakText } from '../utils/voiceUtils';

export default function LanguageSelectionScreen({ onConfirm }) {
  const { lang, setLanguage, t } = useLanguage();

  const languages = [
    { id: 'te', mainLabel: 'తెలుగు', subLabel: 'Telugu', flag: '🌾', greeting: 'తెలుగు భాష ఎంచుకున్నారు. నమస్కారం!' },
    { id: 'hi', mainLabel: 'हिन्दी', subLabel: 'Hindi', flag: '🇮🇳', greeting: 'हिंदी भाषा चुनी गई। नमस्ते!' },
    { id: 'ta', mainLabel: 'தமிழ்', subLabel: 'Tamil', flag: '🇮🇳', greeting: 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது. வணக்கம்!' },
    { id: 'kn', mainLabel: 'ಕನ್ನಡ', subLabel: 'Kannada', flag: '🇮🇳', greeting: 'ಕನ್ನಡ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ. ನಮಸ್ಕಾರ!' },
    { id: 'ml', mainLabel: 'മലയാളം', subLabel: 'Malayalam', flag: '🇮🇳', greeting: 'മലയാളം ഭാഷ തിരഞ്ഞെടുത്തു. നമസ്കാരം!' },
    { id: 'mr', mainLabel: 'मराठी', subLabel: 'Marathi', flag: '🇮🇳', greeting: 'मराठी भाषा निवडली आहे. नमस्कार!' },
    { id: 'en', mainLabel: 'English', subLabel: 'English', flag: '🌐', greeting: 'English language selected. Welcome!' }
  ];

  const handleSelect = (l) => {
    setLanguage(l.id);
    speakText(l.greeting, l.id);
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-slate-900/90 border-2 border-emerald-500/50 p-6 sm:p-8 rounded-3xl max-w-xl w-full shadow-2xl space-y-6 backdrop-blur-xl">
        
        {/* Title & Subtitle */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 border border-emerald-400/40 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-emerald-500/20">
            🌾
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            🌾 Kisan Mitra (కిసాన్ మిత్ర)
          </h1>
          <p className="text-xs font-bold text-emerald-400">
            Your AI farming companion • 7 Regional Languages
          </p>
          <div className="h-0.5 w-16 bg-emerald-500/40 mx-auto rounded-full my-1"></div>
          <p className="text-sm sm:text-base font-black text-slate-200">
            దయచేసి మీ భాషను ఎంచుకోండి / Choose your language
          </p>
        </div>

        {/* 7 Regional Language Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[22rem] overflow-y-auto pr-1 no-scrollbar">
          {languages.map((l) => {
            const isSelected = lang === l.id;
            return (
              <button
                key={l.id}
                onClick={() => handleSelect(l)}
                className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border-emerald-500 text-emerald-300 shadow-xl shadow-emerald-500/20 scale-[1.02]'
                    : 'bg-slate-950/90 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 text-left">
                  <span className="text-2xl">{l.flag}</span>
                  <div>
                    <div className="text-base font-black">{l.mainLabel}</div>
                    <div className="text-xs font-bold text-slate-400">{l.subLabel}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(l.mainLabel, l.id);
                    }}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800"
                    title="Listen voice preview"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                      <Check className="w-4 h-4" />
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
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
        >
          <span>Continue →</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}
