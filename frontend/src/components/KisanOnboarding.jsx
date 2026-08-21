import React, { useState } from 'react';
import { User, MapPin, Globe, Check, Sparkles, Volume2 } from 'lucide-react';

export default function KisanOnboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [farmerName, setFarmerName] = useState('Ramesh Kumar');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [village, setVillage] = useState('Nashik, Maharashtra');
  const [language, setLanguage] = useState('Hindi');

  const crops = [
    { id: 'Tomato', name: 'Tomato (टमाटर / టమాటా)', emoji: '🍅', icon: '🍅' },
    { id: 'Wheat', name: 'Wheat (गेहूं / గోధుమ)', emoji: '🌾', icon: '🌾' },
    { id: 'Onion', name: 'Onion (प्याज / ఉల్లిపాయ)', emoji: '🧅', icon: '🧅' },
    { id: 'Corn', name: 'Corn (मक्का / జొన్న)', emoji: '🌽', icon: '🌽' },
    { id: 'Potato', name: 'Potato (आलू / బంగాళాదుంప)', emoji: '🥔', icon: '🥔' }
  ];

  const languages = [
    { id: 'Hindi', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
    { id: 'Telugu', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
    { id: 'Marathi', label: 'मराठी (Marathi)', flag: '🇮🇳' },
    { id: 'Tamil', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
    { id: 'Kannada', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
    { id: 'English', label: 'English', flag: '🌐' }
  ];

  const speakPrompt = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (language === 'Hindi') u.lang = 'hi-IN';
      else if (language === 'Telugu') u.lang = 'te-IN';
      else u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  };

  const handleFinish = () => {
    const profile = {
      farmer_name: farmerName,
      crop_type: selectedCrop,
      location: village,
      language: language
    };
    speakPrompt(`Namaste ${farmerName}! Welcome to Kisan Mitra.`);
    onComplete(profile);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 border border-emerald-500/30 p-6 sm:p-8 rounded-3xl max-w-lg w-full shadow-2xl space-y-6">
        
        {/* Header Progress */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌾</span>
            <div>
              <h2 className="text-lg font-black text-slate-100">Kisan Mitra Setup</h2>
              <p className="text-xs text-emerald-400 font-semibold">2-Minute Easy Farmer Setup</p>
            </div>
          </div>
          <span className="text-xs font-extrabold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
            Step {step} of 4
          </span>
        </div>

        {/* Step 1: Farmer Name */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" /> What is your name? (आपका नाम क्या है?)
              </label>
              <button
                onClick={() => speakPrompt("What is your name? Swaagat hai.")}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen
              </button>
            </div>

            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              placeholder="Enter your name (e.g. Ramesh Kumar)"
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl p-4 text-base font-bold text-slate-100 outline-none"
            />

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              Next Step ➔
            </button>
          </div>
        )}

        {/* Step 2: Select Crop Picture */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200">
                Which crop do you grow? (आप कौन सी फसल उगाते हैं?)
              </label>
              <button
                onClick={() => speakPrompt("Select your main crop.")}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {crops.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCrop(c.id)}
                  className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                    selectedCrop === c.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 scale-[1.02] shadow-lg shadow-emerald-500/10'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-4xl">{c.emoji}</span>
                  <span className="text-xs font-bold text-center">{c.name}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20"
              >
                Next Step ➔
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-400" /> Which village or district? (आपका गांव/जिला)
              </label>
              <button
                onClick={() => speakPrompt("Enter your village or district location.")}
                className="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg"
              >
                <Volume2 className="w-3.5 h-3.5" /> Listen
              </button>
            </div>

            <input
              type="text"
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Nashik, Maharashtra"
              className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 rounded-2xl p-4 text-base font-bold text-slate-100 outline-none"
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(2)}
                className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20"
              >
                Next Step ➔
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Language */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" /> Select your preferred language (आपकी भाषा)
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {languages.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id)}
                  className={`p-3.5 rounded-2xl border font-bold text-xs flex items-center justify-between cursor-pointer transition-all ${
                    language === l.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span>{l.flag} {l.label}</span>
                  {language === l.id && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(3)}
                className="w-1/3 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="w-2/3 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5 fill-slate-950" /> Start Kisan Mitra
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
