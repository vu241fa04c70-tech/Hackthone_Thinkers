import React, { useState, useEffect } from 'react';
import { Check, Volume2, ArrowRight, ChevronLeft, UserPlus, LogIn, UserCheck, Search, Globe, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../localization/languageMap';
import { INDIAN_STATES } from '../utils/indianStates';
import { speakText } from '../utils/voiceUtils';

export default function LanguageSelectionScreen({ onConfirm }) {
  const { lang, setLanguage, t } = useLanguage();
  const [step, setStep] = useState(1); // 1: Language Selection, 2: Auth Screen (Sign In / Register)
  const [authTab, setAuthTab] = useState('signin'); // 'signin' or 'register'
  const [langSearchQuery, setLangSearchQuery] = useState('');

  const [registeredFarmers, setRegisteredFarmers] = useState([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState('');
  
  // Existing saved profile from localStorage
  const [savedLocalProfile, setSavedLocalProfile] = useState(() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Form State for creating a new farmer profile
  const [formData, setFormData] = useState({
    farmer_name: '',
    main_crop: 'Tomato',
    state: 'Andhra Pradesh', // Default state from alphabetical list
    district: '',
    village: '',
    acreage: 2.5,
    phone: ''
  });

  useEffect(() => {
    fetch('/api/farmers')
      .then(res => res.json())
      .then(data => {
        setRegisteredFarmers(data || []);
        if (data && data.length > 0) {
          setSelectedFarmerId(data[0].farmer_id);
        }
      })
      .catch(() => {});
  }, []);

  const allLanguagesList = Object.values(SUPPORTED_LANGUAGES);

  const filteredLanguages = allLanguagesList.filter(l =>
    l.name.toLowerCase().includes(langSearchQuery.toLowerCase()) ||
    l.subName.toLowerCase().includes(langSearchQuery.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearchQuery.toLowerCase())
  );

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
    setLanguage(l.code);
    speakText(l.greeting || l.name, l.code);
  };

  const handleUseSavedLocalProfile = () => {
    if (!savedLocalProfile) return;
    speakText(
      lang === 'te' 
        ? `నమస్కారం ${savedLocalProfile.farmer_name}! మీ ఖాతాలోకి ప్రవేశించారు.` 
        : `Welcome back ${savedLocalProfile.farmer_name}! Signed in successfully.`,
      lang
    );
    if (onConfirm) onConfirm();
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const existing = registeredFarmers.find(f => f.farmer_id === selectedFarmerId);
    if (!existing) return;

    localStorage.setItem('kisan_farmer_profile', JSON.stringify(existing));
    speakText(
      lang === 'te' 
        ? `నమస్కారం ${existing.farmer_name}! మీ ఖాతాలోకి విజయవంతంగా ప్రవేశించారు.` 
        : `Welcome back ${existing.farmer_name}! Signed in successfully.`,
      lang
    );

    if (onConfirm) onConfirm();
  };

  const handleCreateAccountSubmit = async (e) => {
    e.preventDefault();

    let finalProfile = {
      farmer_id: `farmer_${Date.now()}`,
      farmer_name: formData.farmer_name.trim() || (lang === 'te' ? 'రైతు సోదరుడు' : 'Farmer User'),
      main_crop: formData.main_crop || 'Tomato',
      state: formData.state || 'Andhra Pradesh',
      district: formData.district.trim() || (lang === 'te' ? 'గుంటూరు' : 'Guntur'),
      village: formData.village.trim() || (lang === 'te' ? 'మంగళగిరి' : 'Mangalagiri'),
      acreage: parseFloat(formData.acreage) || 2.5,
      phone: formData.phone.trim() || '',
      registered_at: new Date().toISOString()
    };

    try {
      await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProfile)
      });
    } catch (err) {}

    localStorage.setItem('kisan_farmer_profile', JSON.stringify(finalProfile));
    setSavedLocalProfile(finalProfile);

    speakText(
      lang === 'te' 
        ? `అభినందనలు ${finalProfile.farmer_name} గారూ! మీ ఖాతా విజయవంతంగా సృష్టించబడింది.` 
        : `Congratulations ${finalProfile.farmer_name}! Your account has been created successfully.`,
      lang
    );

    if (onConfirm) onConfirm();
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
            🌾
          </div>
          <div>
            <h1 className="text-lg font-black text-emerald-400 tracking-tight">Kisan Mitra</h1>
            <p className="text-[10px] text-slate-400 font-bold">22 Official Scheduled Languages of India</p>
          </div>
        </div>

        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-800 text-xs font-black flex items-center gap-1.5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{lang === 'te' ? 'భాష మార్చండి' : 'Change Language'}</span>
          </button>
        )}
      </div>

      {/* STEP 1: Choose Your Language */}
      {step === 1 && (
        <div className="max-w-4xl w-full mx-auto my-auto space-y-6 py-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black text-slate-100">
              🇮🇳 Choose Your Language / మీ భాషను ఎంచుకోండి
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-bold max-w-xl mx-auto">
              Select your preferred language. All features, voice assistant, and diagnostic reports will automatically adapt.
            </p>

            {/* Search Language Bar */}
            <div className="relative max-w-md mx-auto pt-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Language / భాష వెతకండి (e.g. Telugu, Hindi)..."
                value={langSearchQuery}
                onChange={(e) => setLangSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Languages Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
            {filteredLanguages.map((l) => {
              const isSelected = lang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => handleSelectLang(l)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between gap-2 relative ${
                    isSelected
                      ? 'bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/10 scale-[1.02]'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{l.flag}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-black tracking-tight">{l.name}</div>
                    <div className="text-[11px] text-slate-400 font-bold">{l.subName}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Confirm Language Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20 transition-transform hover:scale-105"
            >
              <span>{lang === 'te' ? 'ముందుకు సాగండి ➔' : 'Continue in Selected Language ➔'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Farmer Authentication (Existing Account / Sign In / Create Account) */}
      {step === 2 && (
        <div className="max-w-xl w-full mx-auto my-auto space-y-6 py-6">
          
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-xl font-black">
              👨‍🌾
            </div>
            <h2 className="text-2xl font-black text-slate-100">
              {lang === 'te' ? 'రైతు ఖాతా ప్రవేశం' : (lang === 'hi' ? 'किसान खाता प्रवेश' : 'Farmer Account Access')}
            </h2>
            <p className="text-xs text-slate-400 font-bold">
              {lang === 'te'
                ? 'ఖాతా ఉన్నట్లయితే సైన్-ఇన్ అవ్వండి లేదా క్రొత్త రైతు ఖాతాను సృష్టించండి.'
                : 'Sign in to an existing farmer profile or create a new account.'}
            </p>
          </div>

          {/* 🌟 EXISTING SAVED ACCOUNT DETECTED CARD (NO RE-CREATION NEEDED) */}
          {savedLocalProfile && (
            <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border-2 border-emerald-500/60 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {lang === 'te' ? 'సేవ్ చేసిన మీ ఖాతా దొరికింది' : 'Existing Saved Account Found'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black">
                  Auto Saved
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-base font-black text-slate-100">
                  👨‍🌾 {savedLocalProfile.farmer_name}
                </div>
                <div className="text-xs text-slate-300 font-bold">
                  Crop: <span className="text-emerald-400">{savedLocalProfile.main_crop || 'Tomato'}</span> • Acreage: {savedLocalProfile.acreage || 2.5} acres
                </div>
                <div className="text-xs text-slate-400 font-bold">
                  📍 {savedLocalProfile.village || 'Village'}, {savedLocalProfile.district || 'District'}, {savedLocalProfile.state || 'Andhra Pradesh'}
                </div>
              </div>

              <button
                onClick={handleUseSavedLocalProfile}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02]"
              >
                <UserCheck className="w-4 h-4" />
                <span>
                  {lang === 'te' 
                    ? `ఈ ఖాతాతో నేరుగా ప్రవేశించండి (${savedLocalProfile.farmer_name}) ➔` 
                    : `Continue as ${savedLocalProfile.farmer_name} ➔`}
                </span>
              </button>
            </div>
          )}

          {/* Sign In vs Create Account Toggle Tabs */}
          <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setAuthTab('signin')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authTab === 'signin'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? 'ఉన్న ఖాతాలో సైన్-ఇన్' : 'Sign In'}</span>
            </button>

            <button
              onClick={() => setAuthTab('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                authTab === 'register'
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{lang === 'te' ? '➕ కొత్త ఖాతాను సృష్టించండి' : 'Create New Account'}</span>
            </button>
          </div>

          {/* Form Option 1: Existing Account Sign In */}
          {authTab === 'signin' && (
            <form onSubmit={handleSignIn} className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div>
                <label className="text-xs font-extrabold text-slate-300">
                  {lang === 'te' ? 'రైతు ఖాతాను ఎంచుకోండి:' : 'Select Registered Farmer Account:'}
                </label>
                <select
                  value={selectedFarmerId}
                  onChange={(e) => setSelectedFarmerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-3 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 mt-1 cursor-pointer"
                >
                  {registeredFarmers.map((f) => (
                    <option key={f.farmer_id} value={f.farmer_id} className="bg-slate-900 text-slate-100 font-bold">
                      👨‍🌾 {f.farmer_name} ({f.main_crop || 'Tomato'}) • 📍 {f.village || 'Guntur'}, {f.state || 'AP'}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <UserCheck className="w-4 h-4" />
                <span>{lang === 'te' ? 'ఖాతాలోకి ప్రవేశించండి ➔' : 'Sign In to Selected Profile ➔'}</span>
              </button>
            </form>
          )}

          {/* Form Option 2: Create Account with Alphabetical Indian States Dropdown */}
          {authTab === 'register' && (
            <form onSubmit={handleCreateAccountSubmit} className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
              <div>
                <label className="text-xs font-extrabold text-slate-300">
                  {lang === 'te' ? 'రైతు పూర్తి పేరు:' : 'Farmer Full Name:'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'te' ? 'ఉదా: రమేష్ కుమార్' : 'e.g. Ramesh Kumar'}
                  value={formData.farmer_name}
                  onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-extrabold text-slate-300">
                  {lang === 'te' ? 'ప్రధాన పంట:' : 'Main Crop Grown:'}
                </label>
                <select
                  value={formData.main_crop}
                  onChange={(e) => setFormData({ ...formData, main_crop: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 mt-1 cursor-pointer"
                >
                  {crops.map((c) => (
                    <option key={c.id} value={c.id} className="bg-slate-900 text-slate-100 font-bold">
                      {lang === 'te' ? c.labelTe : (lang === 'hi' ? c.labelHi : c.labelEn)}
                    </option>
                  ))}
                </select>
              </div>

              {/* 🇮🇳 ALPHABETICAL DROPDOWN MENU FOR ALL INDIAN STATES & UNION TERRITORIES */}
              <div>
                <label className="text-xs font-extrabold text-slate-300 flex items-center justify-between">
                  <span>{lang === 'te' ? 'రాష్ట్రం (భారతీయ రాష్ట్రాల జాబితా):' : 'Select State / UT (Alphabetical Order):'}</span>
                  <span className="text-[10px] text-emerald-400 font-black">All 36 States & UTs</span>
                </label>
                <select
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 mt-1 cursor-pointer"
                  required
                >
                  {INDIAN_STATES.map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-slate-100 font-bold">
                      📍 {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-300">
                    {lang === 'te' ? 'జిల్లా పేరు:' : 'District:'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'te' ? 'ఉదా: గుంటూరు' : 'e.g. Guntur'}
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-300">
                    {lang === 'te' ? 'గ్రామం పేరు:' : 'Village:'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'te' ? 'ఉదా: మంగళగిరి' : 'e.g. Mangalagiri'}
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-extrabold text-slate-300">
                    {lang === 'te' ? 'పొలం వైశాల్యం (ఎకరాలు):' : 'Farm Acreage (Acres):'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.acreage}
                    onChange={(e) => setFormData({ ...formData, acreage: parseFloat(e.target.value) || 1.0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-slate-300">
                    {lang === 'te' ? 'ఫోన్ నంబర్:' : 'Phone Number:'}
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98480 12345"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <UserPlus className="w-4 h-4" />
                <span>{lang === 'te' ? 'రైతు ఖాతాను సృష్టించండి ➔' : 'Save & Continue to App ➔'}</span>
              </button>
            </form>
          )}

        </div>
      )}

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto py-3 text-center border-t border-slate-800 text-xs text-slate-500 font-bold">
        🌾 Kisan Mitra AI Platform • Multilingual Speech & Vision Technology
      </div>

    </div>
  );
}
