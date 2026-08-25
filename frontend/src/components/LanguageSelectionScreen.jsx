import React, { useState, useEffect } from 'react';
import { Check, Volume2, ArrowRight, ChevronLeft, UserPlus, LogIn, UserCheck, Search, Globe, CheckCircle2, Info, Sparkles, Camera, Sun, Scroll, TrendingUp, Mic, Sprout, Droplets } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../localization/languageMap';
import { INDIAN_STATES } from '../utils/indianStates';
import { speakText } from '../utils/voiceUtils';
import SearchableDistrictSelect from './SearchableDistrictSelect';

export default function LanguageSelectionScreen({ onConfirm }) {
  const { lang, setLanguage } = useLanguage();
  
  // Track whether user has tapped/selected a language card on screen
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);

  const [step, setStep] = useState(1); // 1: Language Selection & Localized Feature Cards, 2: Auth Screen
  const [authTab, setAuthTab] = useState('signin');
  const [langSearchQuery, setLangSearchQuery] = useState('');

  const [registeredFarmers, setRegisteredFarmers] = useState([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState('');
  
  const [savedLocalProfile, setSavedLocalProfile] = useState(() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [formData, setFormData] = useState({
    farmer_name: '',
    main_crop: 'Tomato',
    state: 'Andhra Pradesh',
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

  // Handler when user taps a language card
  const handleSelectLang = (l) => {
    setLanguage(l.code);
    setIsLanguageSelected(true);
    speakText(l.greeting || l.name, l.code);
  };

  // Helper Multilingual Dynamic Text Getters (Clean & Zero Raw Keys)
  const getChooseTitle = () => {
    if (!isLanguageSelected) return 'Choose Your Language';
    switch (lang) {
      case 'te': return 'మీ భాషను ఎంచుకోండి';
      case 'hi': return 'अपनी भाषा चुनें';
      case 'ta': return 'உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்';
      case 'kn': return 'నిమ్మ భాతెయన్ను అత్కెమాడి';
      case 'ml': return 'നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക';
      case 'mr': return 'तुमची भाषा निवडा';
      case 'bn': return 'আপনার ভাষা নির্বাচন করুন';
      case 'gu': return 'તમારી ભાષા પસંદ કરો';
      case 'pa': return 'ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ';
      default: return 'Choose Your Language';
    }
  };

  const getChooseSub = () => {
    if (!isLanguageSelected) return 'Select your preferred language to continue with Kisan Mitra.';
    switch (lang) {
      case 'te': return 'మీకు అనుకూలమైన భాషను ఎంచుకోండి. యాప్‌లోని అన్ని వివరాలు మరియు వాయిస్ అసిస్టెంట్ ఆ భాషలో మార్చబడతాయి.';
      case 'hi': return 'अपनी पसंदीदा भाषा चुनें। ऐप की सभी विशेषताएं और वॉयस असिस्टेंट उसी भाषा में बदल जाएंगे।';
      case 'ta': return 'உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும். அனைத்து அம்சங்களும் குரல் உதவியாளரும் பொருந்தும்.';
      case 'kn': return 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ. ಎಲ್ಲಾ ವೈಶಿಷ್ಟ್ಯಗಳು ಆ ಭಾಷೆಗೆ ಬದಲಾಗುತ್ತವೆ.';
      case 'bn': return 'আপনার পছন্দের ভাষা নির্বাচন করুন। সমস্ত বৈশিষ্ট্য এবং ভয়েস সহায়তা সেই ভাষায় রূপান্তরিত হবে।';
      default: return 'Select your preferred language to continue with Kisan Mitra.';
    }
  };

  const getSearchPlaceholder = () => {
    if (!isLanguageSelected) return 'Search language...';
    switch (lang) {
      case 'te': return 'భాషను వెతకండి...';
      case 'hi': return 'भाषा खोजें...';
      case 'ta': return 'மொழியைத் தேடுங்கள்...';
      case 'kn': return 'భాషೆಯನ್ನು ಹುಡುಕಿ...';
      default: return 'Search language...';
    }
  };

  const getNextBtnText = () => {
    if (!isLanguageSelected) return 'Continue ➔';
    switch (lang) {
      case 'te': return 'ముందుకు సాగండి ➔';
      case 'hi': return 'आगे बढ़ें ➔';
      case 'ta': return 'அடுத்து ➔';
      case 'kn': return 'ముందే ➔';
      case 'bn': return 'পরবর্তী ➔';
      default: return 'Continue ➔';
    }
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

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!formData.farmer_name || !formData.district) return;

    const newFarmer = {
      farmer_id: `farmer_${Date.now()}`,
      farmer_name: formData.farmer_name,
      main_crop: formData.main_crop,
      state: formData.state,
      district: formData.district,
      village: formData.village || 'Mangalagiri',
      acreage: parseFloat(formData.acreage) || 2.5,
      phone: formData.phone || '+91 98480 12345',
      registered_at: new Date().toISOString()
    };

    try {
      await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFarmer)
      });
    } catch (err) {}

    localStorage.setItem('kisan_farmer_profile', JSON.stringify(newFarmer));
    speakText(
      lang === 'te' 
        ? `నమస్కారం ${newFarmer.farmer_name}! మీ క్రొత్త రైతు ఖాతా విజయవంతంగా సృష్టించబడింది.` 
        : `Welcome ${newFarmer.farmer_name}! Account created successfully.`,
      lang
    );
    if (onConfirm) onConfirm();
  };

  return (
    <div className="min-h-screen bg-transparent india-watermark-bg text-[#2C3333] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#2D6A4F] selection:text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      
      {/* Top Header Bar with High Contrast White Badge */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-3 bg-white/95 px-4 py-2 rounded-full border-2 border-emerald-200 shadow-md">
          <div className="w-10 h-10 rounded-2xl bg-[#2D6A4F] text-white flex items-center justify-center text-xl font-black shadow-sm">
            🍃
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#2D6A4F]">
              Kisan Mitra
            </h1>
            <p className="text-[11px] text-slate-700 font-bold">
              Government of India
            </p>
          </div>
        </div>

        {step === 2 && (
          <button
            onClick={() => setStep(1)}
            className="px-4 py-2 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs flex items-center gap-1.5 border border-slate-300 shadow-md cursor-pointer transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-[#2D6A4F]" />
            <span>{lang === 'te' ? 'వెనుకకు (భాష)' : (lang === 'hi' ? 'पीछे (भाषा)' : 'Back to Language')}</span>
          </button>
        )}
      </div>

      {/* Main Multi-Step Content */}
      <div className="max-w-5xl w-full mx-auto my-auto space-y-6 py-2">
        
        {/* STEP 1: Interactive Language Selection */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* Center Orbital Indian Farmer Illustration Artwork Badge - Extra Large Size */}
            <div className="flex justify-center">
              <div className="relative flex items-center justify-center w-64 h-64 sm:w-80 sm:h-80 bg-white/40 p-4 rounded-full backdrop-blur-sm border border-white/60 shadow-2xl">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-300/80 bg-emerald-100/60 shadow-inner" />
                <div className="absolute inset-2 rounded-full border-4 border-dashed border-emerald-400 animate-spin-slow" style={{ animationDuration: '60s' }} />

                {/* Extra Large Center Image Artwork */}
                <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-gradient-to-b from-amber-50 to-emerald-100">
                  <img 
                    src="/assets/farmer_avatar.jpg" 
                    alt="Kisan Mitra Farmer" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full flex-col items-center justify-center text-center p-2">
                    <span className="text-5xl">👨‍🌾</span>
                    <span className="text-sm font-black text-[#2D6A4F]">Kisan Mitra</span>
                  </div>
                </div>

                {/* Orbiting Icons */}
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="absolute top-1/4 -right-1 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]">
                  <Sprout className="w-5 h-5" />
                </div>
                <div className="absolute bottom-1/4 -right-1 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]">
                  <Droplets className="w-5 h-5" />
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="absolute bottom-1/4 -left-1 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]">
                  <Mic className="w-5 h-5" />
                </div>
                <div className="absolute top-1/4 -left-1 w-11 h-11 rounded-full bg-white border-2 border-emerald-300 shadow-lg flex items-center justify-center text-[#2D6A4F]">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Title & Subtitle Card Container - High Contrast so "Choose Your Language" is 100% Clearly Visible */}
            <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 shadow-2xl max-w-2xl mx-auto text-center space-y-4">
              <h2 className="text-3xl sm:text-5xl font-black text-[#2D6A4F] tracking-tight">
                {getChooseTitle()}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-bold max-w-xl mx-auto leading-relaxed">
                {getChooseSub()}
              </p>

              {/* Language Search Input */}
              <div className="relative max-w-md mx-auto pt-1">
                <input
                  type="text"
                  value={langSearchQuery}
                  onChange={(e) => setLangSearchQuery(e.target.value)}
                  placeholder={getSearchPlaceholder()}
                  className="w-full bg-slate-50 border-2 border-slate-300 rounded-full px-4 py-3 pl-11 text-xs sm:text-sm font-bold text-[#2C3333] placeholder-slate-500 focus:outline-none focus:border-[#2D6A4F] shadow-sm transition-all"
                />
                <Search className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
              </div>
            </div>

            {/* Language Cards Grid Container - Solid White Card Overlay */}
            <div className="bg-white/95 backdrop-blur-md border-2 border-emerald-200 p-3 sm:p-4 rounded-3xl shadow-2xl max-w-4xl mx-auto">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[320px] overflow-y-auto p-1.5 no-scrollbar">
                {filteredLanguages.map((l) => {
                  const isSelected = lang === l.code && isLanguageSelected;
                  return (
                    <div
                      key={l.code}
                      onClick={() => handleSelectLang(l)}
                      className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-2 shadow-sm ${
                        isSelected
                          ? 'bg-emerald-100 border-2 border-[#2D6A4F] shadow-md scale-[1.03]'
                          : 'bg-white border-slate-200 hover:border-[#2D6A4F] hover:shadow-md hover:scale-[1.01]'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-extrabold text-[#2D6A4F] uppercase tracking-wider flex items-center gap-1">
                          <span>{l.flag}</span>
                          <span>{l.code.toUpperCase()}</span>
                        </div>
                        <div className="text-base font-black text-[#2C3333] leading-snug">
                          {l.name}
                        </div>
                        <div className="text-[11px] text-slate-600 font-bold">
                          {l.subName}
                        </div>
                      </div>

                      {/* Audio Preview Speaker Button */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLang(l);
                        }}
                        className={`w-8 h-8 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? 'bg-[#2D6A4F] text-white border-[#2D6A4F]'
                            : 'bg-emerald-100 text-[#2D6A4F] border-emerald-300 hover:bg-emerald-200'
                        }`}
                        title={`Listen ${l.name} audio`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next Step Button */}
            <div className="text-center pt-2 max-w-sm mx-auto space-y-2">
              <button
                onClick={() => setStep(2)}
                className="w-full min-h-[52px] py-3.5 px-8 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-105"
              >
                <span>{getNextBtnText()}</span>
              </button>

              <div className="text-[11px] text-slate-800 font-black flex items-center justify-center gap-1 bg-white/90 py-1.5 rounded-full border border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>An official digital initiative for Indian farmers</span>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: Farmer Account Authentication / Registration Screen */}
        {step === 2 && (
          <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            
            {/* Quick Auto Sign-In for Saved Farmer Profile */}
            {savedLocalProfile && (
              <div className="p-6 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-emerald-200 space-y-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-900 border border-emerald-300">
                    👨‍🌾 {lang === 'te' ? 'పూర్వపు సేవ్‌ చేసిన రైతు ఖాతా' : (lang === 'hi' ? 'सहेजा गया किसान खाता' : 'Saved Account Found')}
                  </span>
                  <CheckCircle2 className="w-5 h-5 text-[#2D6A4F]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#2C3333]">
                    {savedLocalProfile.farmer_name}
                  </h3>
                  <p className="text-xs text-slate-700 font-bold">
                    🌾 {savedLocalProfile.main_crop || 'Tomato'} • 📍 {savedLocalProfile.village || 'Mangalagiri'}, {savedLocalProfile.district || 'Guntur'}, {savedLocalProfile.state || 'Andhra Pradesh'}
                  </p>
                </div>

                <button
                  onClick={handleUseSavedLocalProfile}
                  className="w-full py-3.5 px-6 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <span>{lang === 'te' ? `${savedLocalProfile.farmer_name} గా కొనసాగండి ➔` : (lang === 'hi' ? `${savedLocalProfile.farmer_name} के रूप में जारी रखें ➔` : `Continue as ${savedLocalProfile.farmer_name} ➔`)}</span>
                </button>
              </div>
            )}

            {/* Account Option Tabs */}
            <div className="flex bg-white/95 p-1.5 rounded-full border-2 border-emerald-200 shadow-lg">
              <button
                onClick={() => setAuthTab('signin')}
                className={`flex-1 py-3 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authTab === 'signin'
                    ? 'bg-[#2D6A4F] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#2C3333]'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>{lang === 'te' ? 'రైతు ఖాతాలోకి ప్రవేశించండి' : (lang === 'hi' ? 'किसान लॉगिन' : 'Select Existing Farmer')}</span>
              </button>

              <button
                onClick={() => setAuthTab('signup')}
                className={`flex-1 py-3 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  authTab === 'signup'
                    ? 'bg-[#2D6A4F] text-white shadow-sm'
                    : 'text-slate-700 hover:text-[#2C3333]'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>{lang === 'te' ? 'క్రొత్త రైతు ఖాతా సృష్టించండి' : (lang === 'hi' ? 'नया किसान खाता' : 'Create New Farmer Account')}</span>
              </button>
            </div>

            {/* Sign In Form */}
            {authTab === 'signin' && (
              <form onSubmit={handleSignIn} className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 space-y-6 shadow-xl">
                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-800 uppercase tracking-wider">
                    {lang === 'te' ? 'రైతు పేరును ఎంచుకోండి:' : (lang === 'hi' ? 'किसान खाता चुनें:' : 'Select Farmer Account:')}
                  </label>

                  {registeredFarmers.length > 0 ? (
                    <select
                      value={selectedFarmerId}
                      onChange={(e) => setSelectedFarmerId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3.5 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] cursor-pointer"
                    >
                      {registeredFarmers.map((f) => (
                        <option key={f.farmer_id} value={f.farmer_id} className="bg-white text-slate-800 font-semibold">
                          👨‍🌾 {f.farmer_name} • {f.main_crop} • 📍 {f.village}, {f.district}, {f.state}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-xs text-slate-600 font-bold">
                      {lang === 'te' ? 'డేటాబేస్‌లో ఖాతాలు లేవు. దయచేసి క్రొత్త ఖాతాని సృష్టించండి.' : 'No registered farmers found. Please create a new account below.'}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={registeredFarmers.length === 0}
                  className="w-full py-4 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-white" />
                  <span>{lang === 'te' ? 'యాప్‌లోకి ప్రవేశించండి ➔' : (lang === 'hi' ? 'ऐप खोलें ➔' : 'Sign In & Launch App ➔')}</span>
                </button>
              </form>
            )}

            {/* Create Account Form */}
            {authTab === 'signup' && (
              <form onSubmit={handleCreateAccount} className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 space-y-4 shadow-xl">
                
                {/* Farmer Name */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800">
                    {lang === 'te' ? 'రైతు పేరు:' : (lang === 'hi' ? 'किसान का नाम:' : 'Farmer Full Name:')}
                  </label>
                  <input
                    type="text"
                    value={formData.farmer_name}
                    onChange={(e) => setFormData({ ...formData, farmer_name: e.target.value })}
                    placeholder={lang === 'te' ? 'ఉదా: రమేష్ కుమార్' : 'e.g. Ramesh Kumar'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
                    required
                  />
                </div>

                {/* State Selection Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                    <span>{lang === 'te' ? 'రాష్ట్రం (భారతదేశం):' : (lang === 'hi' ? 'राज्य (भारत):' : 'State Name (India):')}</span>
                    <span className="text-[10px] text-[#2D6A4F] font-bold">
                      {lang === 'te' ? 'అక్షరక్రమంలో (36 రాష్ట్రాలు & కేంద్రపాలిత ప్రాంతాలు)' : 'Alphabetical (36 States & UTs)'}
                    </span>
                  </label>
                  
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] cursor-pointer"
                    required
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st} className="bg-white text-slate-800 font-semibold">
                        📍 {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Searchable District & Village */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-800 flex items-center justify-between">
                      <span>{lang === 'te' ? 'జిల్లా:' : (lang === 'hi' ? 'जिला:' : 'District Name:')}</span>
                      <span className="text-[10px] text-[#2D6A4F] font-bold">🔍 Searchable</span>
                    </label>
                    <SearchableDistrictSelect
                      value={formData.district}
                      onChange={(val) => setFormData({ ...formData, district: val })}
                      selectedState={formData.state}
                      placeholder={lang === 'te' ? 'జిల్లాను వెతకండి లేదా ఎంచుకోండి...' : (lang === 'hi' ? 'जिला खोजें या चुनें...' : 'Search or select district...')}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-800">
                      {lang === 'te' ? 'గ్రామం:' : (lang === 'hi' ? 'गांव:' : 'Village / Town:')}
                    </label>
                    <input
                      type="text"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      placeholder="e.g. Mangalagiri"
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
                      required
                    />
                  </div>
                </div>

                {/* Crop & Acreage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-800">
                      {lang === 'te' ? 'ముఖ్యమైన సాగు పంట:' : (lang === 'hi' ? 'मुख्य फसल:' : 'Main Crop Grown:')}
                    </label>
                    <select
                      value={formData.main_crop}
                      onChange={(e) => setFormData({ ...formData, main_crop: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] cursor-pointer"
                    >
                      {crops.map((c) => (
                        <option key={c.id} value={c.id} className="bg-white text-slate-800 font-semibold">
                          🌾 {lang === 'te' ? c.labelTe : (lang === 'hi' ? c.labelHi : c.labelEn)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-800">
                      {lang === 'te' ? 'సాగు భూమి (ఎకరాలు):' : (lang === 'hi' ? 'जमीन (एकड़):' : 'Land Acreage (Acres):')}
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.acreage}
                      onChange={(e) => setFormData({ ...formData, acreage: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-white" />
                  <span>{lang === 'te' ? 'ఖాతా సృష్టించి యాప్‌లోకి ప్రవేశించండి ➔' : (lang === 'hi' ? 'खाता बनाएं और ऐप खोलें ➔' : 'Create Account & Launch App ➔')}</span>
                </button>
              </form>
            )}

          </div>
        )}

      </div>

      {/* Footer Branding */}
      <div className="text-center text-[11px] text-slate-800 font-black py-2 bg-white/90 rounded-full max-w-xl mx-auto border border-emerald-200 shadow-sm my-2">
        <span>🌾 Kisan Mitra Platform • Government of India Initiative</span>
      </div>

    </div>
  );
}
