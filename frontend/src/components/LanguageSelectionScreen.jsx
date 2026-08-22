import React, { useState } from 'react';
import { Check, Volume2, ArrowRight, ChevronLeft, UserPlus, Sprout, MapPin } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText } from '../utils/voiceUtils';

export default function LanguageSelectionScreen({ onConfirm }) {
  const { lang, setLanguage, t } = useLanguage();
  const [step, setStep] = useState(1); // 1: Language Selection, 2: Create Account Form

  // Form State for creating a new farmer profile (Blank by default!)
  const [formData, setFormData] = useState({
    farmer_name: '',
    main_crop: 'Tomato',
    state: '',
    district: '',
    village: '',
    acreage: 2.5,
    phone: ''
  });

  const languages = [
    { id: 'te', mainLabel: 'తెలుగు', subLabel: 'Telugu', flag: '🌾', greeting: 'తెలుగు భాష ఎంచుకున్నారు. నమస్కారం!' },
    { id: 'hi', mainLabel: 'हिन्दी', subLabel: 'Hindi', flag: '🇮🇳', greeting: 'हिंदी भाषा चुनी गई। नमस्ते!' },
    { id: 'ta', mainLabel: 'தமிழ்', subLabel: 'Tamil', flag: '🇮🇳', greeting: 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது. வணக்கம்!' },
    { id: 'kn', mainLabel: 'ಕನ್ನಡ', subLabel: 'Kannada', flag: '🇮🇳', greeting: 'ಕನ್ನಡ ಭಾಷೆ ಆಯ್ಕೆಮಾಡಲಾಗಿದೆ. ನಮಸ್ಕಾರ!' },
    { id: 'mr', mainLabel: 'मराठी', subLabel: 'Marathi', flag: '🇮🇳', greeting: 'मराठी भाषा निवडली आहे. नमस्कार!' },
    { id: 'bn', mainLabel: 'বাংলা', subLabel: 'Bengali', flag: '🇮🇳', greeting: 'বাংলা ভাষা নির্বাচিত হয়েছে। নমস্কার!' },
    { id: 'gu', mainLabel: 'ગુજરાતી', subLabel: 'Gujarati', flag: '🇮🇳', greeting: 'ગુજરાતી ભાષા પસંદ કરી છે. નમસ્તે!' },
    { id: 'en', mainLabel: 'English', subLabel: 'English', flag: '🌐', greeting: 'English language selected. Welcome!' }
  ];

  const crops = [
    { id: 'Tomato', labelTe: 'టమాటా (Tomato)', labelHi: 'टमाटर (Tomato)', labelEn: 'Tomato' },
    { id: 'Paddy', labelTe: 'వరి (Paddy / Rice)', labelHi: 'धान (Paddy / Rice)', labelEn: 'Paddy (Rice)' },
    { id: 'Chilli', labelTe: 'మిరప (Chilli)', labelHi: 'मिर्च (Chilli)', labelEn: 'Chilli' },
    { id: 'Cotton', labelTe: 'పత్తి (Cotton)', labelHi: 'कपास (Cotton)', labelEn: 'Cotton' },
    { id: 'Maize', labelTe: 'మొక్కజొన్న (Maize)', labelHi: 'मक्का (Maize)', labelEn: 'Maize' },
    { id: 'Wheat', labelTe: 'గోధుమ (Wheat)', labelHi: 'गेहूं (Wheat)', labelEn: 'Wheat' },
    { id: 'Potato', labelTe: 'బంగాళాదుంప (Potato)', labelHi: 'आलू (Potato)', labelEn: 'Potato' }
  ];

  const handleSelectLang = (l) => {
    setLanguage(l.id);
    speakText(l.greeting, l.id);
  };

  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();

    let finalProfile = {
      farmer_id: `farmer_${Date.now()}`,
      farmer_name: formData.farmer_name.trim() || (lang === 'te' ? 'రైతు సోదరుడు' : 'Farmer User'),
      main_crop: formData.main_crop || 'Tomato',
      state: formData.state.trim() || (lang === 'te' ? 'తెలంగాణ / ఏపీ' : 'Telangana / AP'),
      district: formData.district.trim() || (lang === 'te' ? 'జిల్లా' : 'District'),
      village: formData.village.trim() || (lang === 'te' ? 'గ్రామం' : 'Village'),
      acreage: parseFloat(formData.acreage) || 2.5,
      phone: formData.phone.trim() || '',
      registered_at: new Date().toISOString()
    };

    try {
      // Save profile to backend database API
      await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProfile)
      });
    } catch (err) {}

    // Save active profile locally
    localStorage.setItem('kisan_farmer_profile', JSON.stringify(finalProfile));

    speakText(
      lang === 'te' 
        ? `నమస్కారం ${finalProfile.farmer_name}! మీ అకౌంట్ విజయవంతంగా సృష్టించబడింది.` 
        : `Welcome ${finalProfile.farmer_name}! Your account has been created successfully.`,
      lang
    );

    if (onConfirm) onConfirm();
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex items-center justify-center p-4 sm:p-6 selection:bg-emerald-500 selection:text-slate-950 font-['Plus_Jakarta_Sans',sans-serif]">
      <div className="bg-slate-900/95 border-2 border-emerald-500/50 p-6 sm:p-8 rounded-3xl max-w-xl w-full shadow-2xl space-y-6 backdrop-blur-xl">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 border border-emerald-400/40 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-emerald-500/20">
            🌾
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            🌾 Kisan Mitra (కిసాన్ మిత్ర)
          </h1>
          <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
            {step === 1 ? 'Step 1 of 2 • Regional Language Selection' : 'Step 2 of 2 • Create Farmer Account'}
          </p>
        </div>

        {/* STEP 1: REGIONAL LANGUAGE SELECTION */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-sm sm:text-base font-black text-slate-200">
                దయచేసి మీ ప్రాంతీయ భాషను ఎంచుకోండి / Select Language
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[20rem] overflow-y-auto pr-1 no-scrollbar">
              {languages.map((l) => {
                const isSelected = lang === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => handleSelectLang(l)}
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

            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <span>
                {lang === 'te' 
                  ? 'అకౌంట్ సృష్టించండి (Next Step) →' 
                  : (lang === 'hi' ? 'खाता बनाएं (Next Step) →' : 'Create Account (Next Step) →')}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2: FARMER ACCOUNT CREATION FORM */}
        {step === 2 && (
          <form onSubmit={handleCreateAccountSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{lang === 'te' ? 'భాష మార్చండి' : 'Change Language'}</span>
              </button>
              <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
                <UserPlus className="w-4 h-4" />
                {lang === 'te' ? 'కొత్త ఖాతా సృష్టించండి' : (lang === 'hi' ? 'नया खाता बनाएं' : 'Create New Account')}
              </span>
            </div>

            {/* Profile Input Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  {lang === 'te' ? 'రైతు పేరు (Farmer Name):' : (lang === 'hi' ? 'किसान का नाम:' : 'Farmer Name:')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.farmer_name}
                  onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                  placeholder={lang === 'te' ? 'మీ పేరు నమోదు చేయండి (उदा. రమేష్ గారూ)' : 'Enter Farmer Name (e.g. Ramesh Bhai)'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {lang === 'te' ? 'ముఖ్య పంట (Main Crop):' : (lang === 'hi' ? 'मुख्य फसल:' : 'Main Crop:')}
                  </label>
                  <select
                    value={formData.main_crop}
                    onChange={(e) => setFormData({ ...formData, main_crop: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
                  >
                    {crops.map(c => (
                      <option key={c.id} value={c.id}>
                        {lang === 'te' ? c.labelTe : (lang === 'hi' ? c.labelHi : c.labelEn)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {lang === 'te' ? 'రాష్ట్రం (State):' : (lang === 'hi' ? 'राज्य:' : 'State:')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="e.g. Andhra Pradesh / Telangana"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {lang === 'te' ? 'జిల్లా (District):' : (lang === 'hi' ? 'जिला:' : 'District:')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Guntur / Karimnagar"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {lang === 'te' ? 'గ్రామం (Village):' : (lang === 'hi' ? 'गाँव:' : 'Village:')}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    placeholder="e.g. Mangalagiri / Tenali"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {lang === 'te' ? 'సాగు భూమి (Acres):' : (lang === 'hi' ? 'भूमि (एकड़):' : 'Land Size (Acres):')}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.acreage}
                    onChange={(e) => setFormData({ ...formData, acreage: parseFloat(e.target.value) || 2.5 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    {lang === 'te' ? 'ఫోన్ నెంబర్ (Optional):' : (lang === 'hi' ? 'फोन नंबर (ऐच्छिक):' : 'Phone Number (Optional):')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98480 12345"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 text-slate-950 font-black text-base sm:text-lg shadow-xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.02]"
            >
              <span>
                {lang === 'te' 
                  ? 'అకౌంట్ సృష్టించి ప్రారంభించండి ➔' 
                  : (lang === 'hi' ? 'खाता बनाकर शुरू करें ➔' : 'Create Account & Start ➔')}
              </span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
