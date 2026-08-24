import React, { useState, useEffect } from 'react';
import { Bot, Camera, Calendar, TrendingUp, Scroll, Home, Sun, UserCheck, Globe, UserPlus, ShieldCheck, LogOut } from 'lucide-react';
import { useLanguage } from './localization/LanguageContext';
import { SUPPORTED_LANGUAGES } from './localization/languageMap';

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

export default function App() {
  const { lang, setLanguage, t, isRTL } = useLanguage();

  // Mode: 'welcome' | 'farmer' | 'admin'
  const [currentMode, setCurrentMode] = useState('welcome');

  const [farmerProfile, setFarmerProfile] = useState(() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [hasSelectedLang, setHasSelectedLang] = useState(() => {
    return !!localStorage.getItem('kisanLanguage');
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

  const handleInitialSetupComplete = () => {
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
    setHasSelectedLang(true);
    setCurrentMode('welcome');
  };

  // Format farmer display name according to active language
  const getFormattedFarmerHeader = () => {
    if (!farmerProfile) return '';
    const rawName = farmerProfile.farmer_name || 'Ramesh';
    const crop = farmerProfile.main_crop || 'Tomato';
    const location = `${farmerProfile.district || 'Guntur'}, ${farmerProfile.state || 'Andhra Pradesh'}`;

    if (lang === 'en') {
      const cleanName = rawName.replace(/[\u0C00-\u0C7F]/g, '').replace(/[()]/g, '').trim() || 'Ramesh';
      return `👨‍🌾 ${cleanName} (${crop}) • 📍 ${location}`;
    } else {
      return `👨‍🌾 ${rawName} (${crop}) • 📍 ${location}`;
    }
  };

  // STEP 1: First Choose Language Screen
  if (!hasSelectedLang) {
    return (
      <LanguageSelectionScreen
        onConfirm={handleInitialSetupComplete}
      />
    );
  }

  // STEP 2: Welcome Role Landing Page in Selected Language
  if (currentMode === 'welcome') {
    return (
      <WelcomeRoleScreen
        onSelectFarmer={() => setCurrentMode('farmer')}
        onSelectAdmin={() => setCurrentMode('admin')}
      />
    );
  }

  // STEP 3: Admin Dashboard (Password Authenticated)
  if (currentMode === 'admin') {
    return (
      <div className={`min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] ${isRTL ? 'text-right' : 'text-left'}`}>
        <header className="border-b border-cyan-500/30 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20 text-xl">
                🏛️
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black text-cyan-400 flex items-center gap-2">
                  Kisan Mitra Admin Portal
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-black">
                    Government Session
                  </span>
                </h1>
                <p className="text-[11px] text-slate-400 font-bold">Authorized Admin Control Panel</p>
              </div>
            </div>

            <button
              onClick={() => setCurrentMode('welcome')}
              className="px-4 py-2 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-black text-xs flex items-center gap-2 cursor-pointer border border-slate-700"
            >
              <LogOut className="w-4 h-4 text-cyan-400" />
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

  // STEP 4: Full Farmer Application
  const getTabLabel = (id) => {
    switch (id) {
      case 'home': return t('nav.home');
      case 'doctor': return t('nav.doctor');
      case 'weather': return t('nav.weather');
      case 'market': return t('nav.market');
      case 'schemes': return t('nav.schemes');
      case 'calendar': return t('nav.calendar');
      case 'copilot': return t('nav.copilot');
      case 'profile': return t('nav.profile');
      default: return id;
    }
  };

  const tabs = [
    { id: 'home', icon: Home },
    { id: 'doctor', icon: Camera },
    { id: 'weather', icon: Sun },
    { id: 'market', icon: TrendingUp },
    { id: 'schemes', icon: Scroll },
    { id: 'calendar', icon: Calendar },
    { id: 'copilot', icon: Bot },
    { id: 'profile', icon: UserCheck },
  ];

  return (
    <div className={`min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950 transition-all ${isRTL ? 'text-right' : 'text-left'}`}>
      
      {/* Top Header Bar */}
      <header className="border-b border-emerald-500/30 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Current User Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 text-xl">
              🌾
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-emerald-400 flex items-center gap-2">
                {t('nav.appName')}
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold">
                  {t('nav.tagline')}
                </span>
              </h1>
              <p className="text-[11px] text-slate-300 font-bold hidden sm:block">
                {getFormattedFarmerHeader()}
              </p>
            </div>
          </div>

          {/* Multilingual Selector & Navigation Buttons */}
          <div className="flex items-center gap-2">
            {/* 🌐 23 Languages Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 shadow-lg shadow-emerald-500/10">
              <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={lang}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-black text-emerald-400 focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[190px]"
                title="Choose Language (22 Scheduled Languages of India)"
              >
                {Object.values(SUPPORTED_LANGUAGES).map((l) => (
                  <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100 font-bold">
                    {l.flag} {l.name} ({l.subName}) {l.isRTL ? '• RTL' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 🏠 Switch Portal Button */}
            <button
              onClick={() => setCurrentMode('welcome')}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              title="Return to Welcome Screen"
            >
              <span>🏠 Exit</span>
            </button>

            {/* ➕ Create Account / Switch User Button */}
            <button
              onClick={() => {
                localStorage.removeItem('kisan_farmer_profile');
                localStorage.removeItem('kisanLanguage');
                setFarmerProfile(null);
                setHasSelectedLang(false);
              }}
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shrink-0"
              title="Create New Account / Switch User"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">
                {lang === 'te' ? '➕ కొత్త ఖాతా' : (lang === 'hi' ? '➕ नया खाता' : '➕ Account')}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
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
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-emerald-400'}`} />
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
              setHasSelectedLang(false);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 bg-slate-950 text-center text-xs text-slate-500 font-bold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌾 {t('nav.appName')} • Government & Admin Management Control Active</span>
          <span>Multilingual Speech Recognition & Text-to-Speech (STT & TTS)</span>
        </div>
      </footer>

    </div>
  );
}
