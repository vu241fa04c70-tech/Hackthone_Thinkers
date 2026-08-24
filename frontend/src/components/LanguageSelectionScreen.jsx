import React, { useState, useEffect } from 'react';
import { Check, Volume2, ArrowRight, ChevronLeft, UserPlus, LogIn, UserCheck, Search, Globe, CheckCircle2, Info, Sparkles, Camera, Sun, Scroll, TrendingUp, Mic } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../localization/languageMap';
import { INDIAN_STATES } from '../utils/indianStates';
import { speakText } from '../utils/voiceUtils';

export default function LanguageSelectionScreen({ onConfirm }) {
  const { lang, setLanguage, t } = useLanguage();
  
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
    // 1. Set language globally
    setLanguage(l.code);
    // 2. Mark state as selected (un-hides 7 feature cards and translates UI text)
    setIsLanguageSelected(true);
    // 3. Play audio greeting in selected language
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

  // Localized string getters for the 7 feature cards
  const getCardText = (key, defaultEn, defaultTe) => {
    if (!isLanguageSelected) return defaultEn;
    if (lang === 'te') return defaultTe;
    return t(`onboarding.${key}`) || defaultEn;
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Header Bar */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/20">
            🌾
          </div>
          <div>
            {/* Logo Text: NEUTRAL ENGLISH ONLY BEFORE SELECTION, LOCALIZED AFTER SELECTION */}
            <h1 className="text-lg font-black text-emerald-400 tracking-tight">
              {!isLanguageSelected ? 'Kisan Mitra' : (lang === 'te' ? 'కిసాన్ మిత్ర' : t('onboarding.appName') || 'Kisan Mitra')}
            </h1>
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

      {/* STEP 1: Language Selection & Localized Feature Cards */}
      {step === 1 && (
        <div className="max-w-4xl w-full mx-auto my-auto space-y-6 py-6">
          
          {/* Main Title Section */}
          <div className="text-center space-y-2">
            {/* Heading: Pure English before selection, Localized after selection */}
            <h2 className="text-2xl sm:text-4xl font-black text-slate-100">
              {!isLanguageSelected 
                ? 'Choose Your Language' 
                : (lang === 'te' ? 'మీ భాషను ఎంచుకోండి' : t('onboarding.chooseLang') || 'Choose Your Language')}
            </h2>

            {/* Subtitle: Pure English before selection, Localized after selection */}
            <p className="text-xs sm:text-sm text-slate-400 font-bold max-w-xl mx-auto">
              {!isLanguageSelected
                ? 'Select your preferred language. All features and voice assistant will adapt.'
                : (lang === 'te' ? 'మీకు అనుకూలమైన భాషను ఎంచుకోండి. యాప్‌లోని అన్ని వివరాలు మరియు వాయిస్ అసిస్టెంట్ ఆ భాషలో మార్చబడతాయి.' : t('onboarding.subtext') || 'Select your preferred language.')}
            </p>

            {/* Language Search Input */}
            <div className="relative max-w-md mx-auto pt-2">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={!isLanguageSelected ? 'Search language...' : (lang === 'te' ? 'భాషను వెతకండి...' : 'Search language...')}
                value={langSearchQuery}
                onChange={(e) => setLangSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Languages Grid Cards (Audio speaker button included) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[40vh] overflow-y-auto pr-1 no-scrollbar">
            {filteredLanguages.map((l) => {
              const isSelected = isLanguageSelected && lang === l.code;
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
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectLang(l);
                        }}
                        className="p-1 rounded-lg bg-slate-800/80 hover:bg-emerald-500/30 text-slate-400 hover:text-emerald-300"
                        title="Listen Greeting"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-black tracking-tight">{l.name}</div>
                    <div className="text-[11px] text-slate-400 font-bold">{l.subName}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 🌟 7 REVEALED LOCALIZED FEATURE OVERVIEW CARDS (REVEALED ONLY AFTER LANGUAGE SELECTION) */}
          {isLanguageSelected && (
            <div className="space-y-3 pt-4 border-t border-slate-800/80 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-emerald-400 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'te' ? 'కిసాన్ మిత్ర ప్రత్యేకతలు' : 'Kisan Mitra Feature Highlights'}</span>
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                  {lang === 'te' ? 'ఎంచుకున్న భాషలోకి మార్చబడింది' : 'Localized Active'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                
                {/* 1. Welcome Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-sm font-black text-emerald-400 flex items-center gap-2">
                    <span>🌾</span>
                    <span>{getCardText('welcomeCard', 'Welcome', 'సాదర స్వాగతం')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                    {getCardText('welcomeDesc', 'AI-powered smart agriculture assistant built specifically for Indian farmers.', 'భారతీయ రైతుల కోసం రూపొందించిన ఆర్టిఫిషియల్ ఇంటెలిజెన్స్ వ్యవసాయ వేదిక.')}
                  </p>
                </div>

                {/* 2. About Kisan Mitra Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-sm font-black text-cyan-400 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    <span>{getCardText('aboutCard', 'About Kisan Mitra', 'కిసాన్ మిత్ర గురించి')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                    {getCardText('aboutDesc', 'Instant agricultural solutions provided in all official Indian regional languages.', 'స్వదేశీ భాషలలో రైతులకు తక్షణ పరిష్కారాలను అందించే వినూత్న వేదిక.')}
                  </p>
                </div>

                {/* 3. Crop Disease Detection Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-sm font-black text-teal-400 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span>{getCardText('cropDoctorCard', 'Crop Disease Detection', 'పంట వ్యాధి నిర్ధారణ')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                    {getCardText('cropDoctorDesc', 'AI vision engine that accurately identifies plant parts and crop diseases from photos.', 'ఆకు, పండు లేదా పూల ఫోటోల ఆధారంగా పంట వ్యాధులను కచ్చితంగా గుర్తిస్తుంది.')}
                  </p>
                </div>

                {/* 4. Weather Updates Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-sm font-black text-amber-400 flex items-center gap-2">
                    <Sun className="w-4 h-4" />
                    <span>{getCardText('weatherCard', 'Weather Updates', 'వాతావరణ సమాచారం')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                    {getCardText('weatherDesc', 'Real-time rain warnings, temperature alerts, and irrigation advisories.', 'రియల్-టైమ్ వాతావరణ సూచనలు మరియు వర్షపాత హెచ్చరికలు.')}
                  </p>
                </div>

                {/* 5. Government Schemes Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-sm font-black text-purple-400 flex items-center gap-2">
                    <Scroll className="w-4 h-4" />
                    <span>{getCardText('schemesCard', 'Government Schemes', 'ప్రభుత్వ పథకాలు')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                    {getCardText('schemesDesc', 'Latest state and central government subsidies and direct financial benefits.', 'కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాలు అందించే తాజా సబ్సిడీలు.')}
                  </p>
                </div>

                {/* 6. Market Prices Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="text-sm font-black text-emerald-400 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>{getCardText('marketCard', 'Market Prices', 'మార్కెట్ ధరలు')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                    {getCardText('marketDesc', 'Current live Mandi prices per quintal for Tomato, Paddy, Chilli, Cotton, and Potato.', 'మీ సమీపంలో ఉన్న మార్కెట్ యార్డ్‌లలో వివిధ పంటల ప్రస్తుత మండీ ధరలు.')}
                  </p>
                </div>

                {/* 7. Voice Assistant Card */}
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 sm:col-span-2 lg:col-span-3 space-y-1">
                  <div className="text-sm font-black text-rose-400 flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span>{getCardText('voiceCard', 'Voice Assistant', 'వాయిస్ సహాయకుడు')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                    {getCardText('voiceDesc', 'Speak directly in your native language to get voice answers for any farming questions.', 'మీ స్వంత భాషలో మాట్లాడి వ్యవసాయ అనుమానాలకు తక్షణ వాయిస్ సమాధానాలు పొందండి.')}
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* Next / Continue Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => setStep(2)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base inline-flex items-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20 transition-transform hover:scale-105"
            >
              <span>
                {!isLanguageSelected
                  ? 'Next ➔'
                  : (lang === 'te' ? 'ముందుకు సాగండి ➔' : t('onboarding.nextBtn') || 'Next ➔')}
              </span>
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

          {/* Existing Saved Account Card */}
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

          {/* Form Option 2: Create Account */}
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

              {/* Alphabetical Indian States Dropdown */}
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
