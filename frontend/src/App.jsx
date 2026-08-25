import React, { useState, useEffect } from 'react';
import { Bot, Camera, Calendar, TrendingUp, Scroll, Home, Sun, UserCheck, Globe, UserPlus, ShieldCheck, LogOut, PhoneCall } from 'lucide-react';
import { useLanguage } from './localization/LanguageContext';
import { SUPPORTED_LANGUAGES } from './localization/languageMap';
import { getLocalizedLocationName } from './localization/locationTranslator';

import WelcomeRoleScreen from './components/WelcomeRoleScreen';
import LanguageSelectionScreen from './components/LanguageSelectionScreen';
import KisanHomeGrid from './components/KisanHomeGrid';
import FarmCopilot from './components/FarmCopilot';
import CropDoctor from './components/CropDoctor';
import MarketIntelligence from './components/MarketIntelligence';
import GovtSchemesScreen from './components/GovtSchemesScreen';
import FarmingCalendarScreen from './components/FarmingCalendarScreen';
import WeatherScreen from './components/WeatherScreen';
import FarmProfiles from './components/FarmProfiles';
import AdminDashboard from './components/AdminDashboard';
import FarmerSupportScreen from './components/FarmerSupportScreen';

export default function App() {
  const { lang, setLanguage, t, isRTL } = useLanguage();

  // Navigation Mode: 'welcome' (Welcome to Kisan Mitra) | 'lang_select' | 'farmer' | 'admin'
  const [currentMode, setCurrentMode] = useState('welcome');

  const [farmerProfile, setFarmerProfile] = useState(() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [activeTab, setActiveTab] = useState('home');

  const [activeField, setActiveField] = useState({
    field_id: 'field_01',
    name: 'వరి పొలం',
    crop_type: farmerProfile?.main_crop || 'Paddy',
    acreage: farmerProfile?.acreage || 2.5,
    location: `${farmerProfile?.district || 'Guntur'}, ${farmerProfile?.state || 'Andhra Pradesh'}`,
    soil_type: 'Black Loam',
    irrigation_system: 'Canal Irrigation',
    planting_date: '2026-06-15',
    growth_stage: 'Fruiting'
  });

  const handleAccountSetupComplete = () => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFarmerProfile(parsed);
        setActiveField(prev => ({
          ...prev,
          crop_type: parsed.main_crop || 'Paddy',
          location: `${parsed.district || 'Guntur'}, ${parsed.state || 'Andhra Pradesh'}`
        }));
      } catch (e) {}
    }
    setCurrentMode('farmer');
  };

  const getFormattedFarmerHeader = () => {
    if (!farmerProfile) return '';
    const rawName = farmerProfile.farmer_name || 'Ramesh';
    const crop = farmerProfile.main_crop || 'Tomato';
    const rawLocation = `${farmerProfile.district || 'Guntur'}, ${farmerProfile.state || 'Andhra Pradesh'}`;
    const localizedLoc = getLocalizedLocationName(rawLocation, lang);

    if (lang === 'en') {
      const cleanName = rawName.replace(/[\u0C00-\u0C7F]/g, '').replace(/[()]/g, '').trim() || 'Ramesh';
      return `👨‍🌾 ${cleanName} (${crop}) • 📍 ${localizedLoc}`;
    } else {
      return `👨‍🌾 ${rawName} (${crop}) • 📍 ${localizedLoc}`;
    }
  };

  // STEP 1: Application Launch Landing Page (Welcome to Kisan Mitra)
  if (currentMode === 'welcome') {
    return (
      <WelcomeRoleScreen
        onSelectFarmer={() => setCurrentMode('lang_select')}
        onSelectAdmin={() => setCurrentMode('admin')}
      />
    );
  }

  // STEP 2: Language Selection & Create Account Screen
  if (currentMode === 'lang_select') {
    return (
      <LanguageSelectionScreen
        onConfirm={handleAccountSetupComplete}
      />
    );
  }

  // STEP 3: Admin Dashboard (Password Authenticated)
  if (currentMode === 'admin') {
    return (
      <div className={`min-h-screen bg-[#FAF8F3] text-[#2C3333] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${isRTL ? 'text-right' : 'text-left'}`}>
        <header className="border-b border-emerald-100 bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xl font-black shadow-sm">
                🏛️
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight text-[#2D6A4F]">
                  Admin Control Portal
                </h1>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Government Official Management Console
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentMode('welcome')}
              className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 border border-slate-200 cursor-pointer transition-all shadow-sm shrink-0"
            >
              <LogOut className="w-4 h-4 text-[#2D6A4F]" />
              <span>Exit Admin Portal</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdminDashboard onLogout={() => setCurrentMode('welcome')} />
        </main>
      </div>
    );
  }

  // STEP 4: Main Farmer Application
  const tabs = [
    { id: 'home', icon: Home },
    { id: 'doctor', icon: Camera },
    { id: 'weather', icon: Sun },
    { id: 'market', icon: TrendingUp },
    { id: 'schemes', icon: Scroll },
    { id: 'support', icon: PhoneCall },
    { id: 'calendar', icon: Calendar },
    { id: 'copilot', icon: Bot },
    { id: 'profile', icon: UserCheck }
  ];

  const getTabLabel = (id) => {
    switch (id) {
      case 'home': return t('nav.home');
      case 'doctor': return t('nav.doctor');
      case 'weather': return t('nav.weather');
      case 'market': return t('nav.market');
      case 'schemes': return t('nav.schemes');
      case 'support': return lang === 'te' ? '📞 రైతు సహాయం & అధికారులు' : (lang === 'hi' ? '📞 किसान सहायता एवं अधिकारी' : '📞 Farmer Support & Contacts');
      case 'calendar': return t('nav.calendar');
      case 'copilot': return t('nav.copilot');
      case 'profile': return t('nav.profile');
      default: return id;
    }
  };

  return (
    <div className={`min-h-screen bg-transparent india-watermark-bg text-[#2C3333] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${isRTL ? 'text-right' : 'text-left'}`}>
      
      {/* Top Main Navigation Header */}
      <header className="border-b border-emerald-100 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center text-xl font-black shadow-sm">
              🌾
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-[#2D6A4F] flex items-center gap-2">
                {t('nav.appName')}
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#2D6A4F] border border-emerald-200 font-extrabold">
                  {t('nav.tagline')}
                </span>
              </h1>
              <p className="text-[11px] text-slate-500 font-semibold hidden sm:block">
                {getFormattedFarmerHeader()}
              </p>
            </div>
          </div>

          {/* Multilingual Selector & Navigation Buttons */}
          <div className="flex items-center gap-2">
            {/* 🌐 Languages Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
              <Globe className="w-4 h-4 text-[#2D6A4F] shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#2D6A4F] focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[190px]"
                title="Choose Language (22 Scheduled Languages of India)"
              >
                {Object.values(SUPPORTED_LANGUAGES).map((l) => (
                  <option key={l.code} value={l.code} className="bg-white text-slate-800 font-semibold">
                    {l.flag} {l.name} ({l.subName}) {l.isRTL ? '• RTL' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 🏠 Switch Portal Button */}
            <button
              onClick={() => setCurrentMode('welcome')}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shrink-0"
              title="Return to Welcome Screen"
            >
              <span>{lang === 'hi' ? '🏠 वापस' : (lang === 'te' ? '🏠 వెనుకకు' : '🏠 Exit')}</span>
            </button>

            {/* ➕ Create Account / Switch User Button */}
            <button
              onClick={() => {
                localStorage.removeItem('kisan_farmer_profile');
                localStorage.removeItem('kisanLanguage');
                setFarmerProfile(null);
                setCurrentMode('lang_select');
              }}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#2D6A4F] border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm shrink-0"
              title="Create New Account / Switch User"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#2D6A4F]" />
              <span className="hidden sm:inline">
                {lang === 'hi' ? '➕ नया खाता' : (lang === 'te' ? '➕ కొత్త ఖాతా' : '➕ Account')}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Pill Tabs Bar */}
      <div className="border-b border-emerald-100 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              const labelText = getTabLabel(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#2D6A4F] text-white shadow-md scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#2D6A4F]'}`} />
                  <span>{labelText}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Active Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <KisanHomeGrid profile={farmerProfile} onSelectAction={(tabId) => setActiveTab(tabId)} />
        )}
        {activeTab === 'doctor' && <CropDoctor activeField={activeField} />}
        {activeTab === 'weather' && <WeatherScreen />}
        {activeTab === 'market' && <MarketIntelligence activeField={activeField} />}
        {activeTab === 'schemes' && <GovtSchemesScreen />}
        {activeTab === 'support' && <FarmerSupportScreen />}
        {activeTab === 'calendar' && <FarmingCalendarScreen />}
        {activeTab === 'copilot' && <FarmCopilot activeField={activeField} />}
        {activeTab === 'profile' && (
          <FarmProfiles 
            onProfileSwitch={(newP) => {
              setFarmerProfile(newP);
              setActiveField(prev => ({
                ...prev,
                crop_type: newP.main_crop || 'Paddy',
                location: `${newP.district || 'Guntur'}, ${newP.state || 'Andhra Pradesh'}`
              }));
            }}
            onNewAccountClick={() => {
              localStorage.removeItem('kisan_farmer_profile');
              setFarmerProfile(null);
              setCurrentMode('lang_select');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-emerald-100 py-5 bg-white text-center text-xs text-slate-500 font-semibold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌾 {t('nav.appName')} • {lang === 'hi' ? 'शासकीय एवं प्रशासनिक पोर्टल सक्रिय' : (lang === 'te' ? 'ప్రభుత్వ సేవలు మరియు అడ్మిన్ నిర్వహణ సక్రియంగా ఉంది' : 'Government & Admin Management Active')}</span>
          <span>{lang === 'hi' ? 'बहुभाषी वॉयस AI और कंप्यूटर विजन सिस्टम' : (lang === 'te' ? 'బహుభాషా వాయిస్ AI మరియు కంప్యూటర్ విజన్ సాధనం' : 'Multilingual Speech Recognition & Text-to-Speech (STT & TTS)')}</span>
        </div>
      </footer>

    </div>
  );
}
