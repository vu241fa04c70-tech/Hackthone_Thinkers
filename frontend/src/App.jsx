import React, { useState } from 'react';
import { Bot, Camera, Calendar, TrendingUp, Scroll, Home, Sun, UserCheck } from 'lucide-react';
import { useLanguage } from './localization/LanguageContext';

import LanguageSelectionScreen from './components/LanguageSelectionScreen';
import KisanHomeGrid from './components/KisanHomeGrid';
import FarmCopilot from './components/FarmCopilot';
import CropDoctor from './components/CropDoctor';
import MarketIntelligence from './components/MarketIntelligence';
import GovtSchemesScreen from './components/GovtSchemesScreen';
import FarmingCalendarScreen from './components/FarmingCalendarScreen';
import WeatherScreen from './components/WeatherScreen';
import FarmProfiles from './components/FarmProfiles';

export default function App() {
  const { lang, setLanguage, t } = useLanguage();

  // Requirement #1 & #21: Check if language has been selected previously in localStorage
  const [hasSelectedLang, setHasSelectedLang] = useState(() => {
    return !!localStorage.getItem('kisanLanguage');
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const [profile, setProfile] = useState({
    farmer_name: 'రమేష్ గారూ',
    crop_type: 'Tomato',
    location: 'Guntur, Andhra Pradesh',
    language: 'Telugu'
  });

  const [activeField, setActiveField] = useState({
    field_id: 'field_01',
    name: 'టమాటా తోట (Tomato Block)',
    crop_type: 'Tomato',
    acreage: 2.5,
    location: 'Guntur, Andhra Pradesh',
    soil_type: 'Black Loam',
    irrigation_system: 'Drip Irrigation',
    planting_date: '2026-06-15',
    growth_stage: 'Fruiting'
  });

  const handleInitialLanguageSelect = () => {
    setHasSelectedLang(true);
  };

  // Requirement #1: If first visit, show FULL SCREEN Language Selection Page!
  if (!hasSelectedLang) {
    return (
      <LanguageSelectionScreen
        onConfirm={handleInitialLanguageSelect}
      />
    );
  }

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
    { id: 'doctor', icon: Camera, badge: 'Vision' },
    { id: 'weather', icon: Sun },
    { id: 'market', icon: TrendingUp },
    { id: 'schemes', icon: Scroll },
    { id: 'calendar', icon: Calendar },
    { id: 'copilot', icon: Bot, badge: 'Voice AI' },
    { id: 'profile', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Settings Change Language Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <LanguageSelectionScreen
              onConfirm={() => setShowLanguageModal(false)}
            />
          </div>
        </div>
      )}

      {/* Top Header (Requirement #19: NO permanent language button in top right) */}
      <header className="border-b border-emerald-500/30 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
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
              <p className="text-[11px] text-slate-400 font-bold hidden sm:block">
                {t('nav.greeting')}
              </p>
            </div>
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
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold ${
                      isActive ? 'bg-slate-950 text-emerald-400' : 'bg-slate-800 text-emerald-300'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Active Tab Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'home' && (
          <KisanHomeGrid profile={profile} onSelectAction={(tabId) => setActiveTab(tabId)} />
        )}
        {activeTab === 'doctor' && <CropDoctor activeField={activeField} />}
        {activeTab === 'weather' && <WeatherScreen />}
        {activeTab === 'market' && <MarketIntelligence activeField={activeField} />}
        {activeTab === 'schemes' && <GovtSchemesScreen />}
        {activeTab === 'calendar' && <FarmingCalendarScreen />}
        {activeTab === 'copilot' && <FarmCopilot activeField={activeField} />}
        {activeTab === 'profile' && <FarmProfiles onChangeLanguageClick={() => setShowLanguageModal(true)} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 bg-slate-950 text-center text-xs text-slate-500 font-bold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌾 {t('nav.appName')} • Voice AI Farmer Application</span>
          <span>Telugu Speech Recognition (`te-IN`) & Text-to-Speech (`te-IN`)</span>
        </div>
      </footer>

    </div>
  );
}
