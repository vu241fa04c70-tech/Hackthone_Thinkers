import React, { useState, useEffect } from 'react';
import { Bot, Camera, Cpu, Calendar, Layers, TrendingUp, MapPin, Sparkles, Globe, Scroll, Home, Volume2 } from 'lucide-react';

import LanguageSelectionScreen from './components/LanguageSelectionScreen';
import KisanHomeGrid from './components/KisanHomeGrid';
import FarmCopilot from './components/FarmCopilot';
import CropDoctor from './components/CropDoctor';
import IntegratedDecision from './components/IntegratedDecision';
import DecisionTimeline from './components/DecisionTimeline';
import SoilIrrigation from './components/SoilIrrigation';
import MarketIntelligence from './components/MarketIntelligence';
import GovtSchemesScreen from './components/GovtSchemesScreen';
import FarmingCalendarScreen from './components/FarmingCalendarScreen';

export default function App() {
  const [selectedLang, setSelectedLang] = useState(() => {
    return localStorage.getItem('kisan_lang') || 'te'; // Default to Telugu!
  });

  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  const [profile, setProfile] = useState({
    farmer_name: 'రమేష్ గారూ',
    crop_type: 'Tomato',
    location: 'Nashik, Maharashtra',
    language: 'Telugu'
  });

  const [activeField, setActiveField] = useState({
    field_id: 'field_01',
    name: 'టమాటా తోట (Tomato Block)',
    crop_type: 'Tomato',
    acreage: 2.5,
    location: 'Nashik, Maharashtra',
    soil_type: 'Black Loam',
    irrigation_system: 'Drip Irrigation',
    planting_date: '2026-06-15',
    growth_stage: 'Fruiting'
  });

  const handleSelectLanguage = (langCode) => {
    setSelectedLang(langCode);
    localStorage.setItem('kisan_lang', langCode);
    const langStr = langCode === 'te' ? 'Telugu' : (langCode === 'hi' ? 'Hindi' : 'English');
    setProfile(prev => ({ ...prev, language: langStr }));
  };

  const getTabLabel = (id) => {
    switch (id) {
      case 'home': return selectedLang === 'te' ? '🌾 కిసాన్ మిత్ర' : (selectedLang === 'hi' ? '🌾 किसान मित्र' : '🌾 Home');
      case 'doctor': return selectedLang === 'te' ? '📷 పైరు వ్యాధి' : (selectedLang === 'hi' ? '📷 बीमारी जांच' : '📷 Disease Scan');
      case 'weather': return selectedLang === 'te' ? '🌤️ వాతావరణం' : (selectedLang === 'hi' ? '🌤️ मौसम' : '🌤️ Weather');
      case 'market': return selectedLang === 'te' ? '💰 మండీ ధరలు' : (selectedLang === 'hi' ? '💰 मंडी भाव' : '💰 Market Prices');
      case 'schemes': return selectedLang === 'te' ? '📜 ప్రభుత్వ పథకాలు' : (selectedLang === 'hi' ? '📜 योजनाएं' : '📜 Govt Schemes');
      case 'calendar': return selectedLang === 'te' ? '📅 క్యాలెండర్' : (selectedLang === 'hi' ? '📅 कैलेंडर' : '📅 Calendar');
      case 'copilot': return selectedLang === 'te' ? '🎤 అడగండి తెలుసుకోండి' : (selectedLang === 'hi' ? '🎤 कुछ भी पूछें' : '🎤 AI Assistant');
      default: return id;
    }
  };

  const tabs = [
    { id: 'home', icon: Home },
    { id: 'doctor', icon: Camera, badge: 'Vision' },
    { id: 'market', icon: TrendingUp },
    { id: 'schemes', icon: Scroll },
    { id: 'calendar', icon: Calendar },
    { id: 'copilot', icon: Bot, badge: 'Voice AI' },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Language Selection Modal */}
      {showLanguageModal && (
        <LanguageSelectionScreen
          selectedLang={selectedLang}
          onSelectLanguage={handleSelectLanguage}
          onClose={() => setShowLanguageModal(false)}
        />
      )}

      {/* Top Header */}
      <header className="border-b border-emerald-500/30 bg-slate-950/90 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 text-xl">
              🌾
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-emerald-400 flex items-center gap-2">
                {selectedLang === 'te' ? 'కిసాన్ మిత్ర' : (selectedLang === 'hi' ? 'किसान मित्र' : 'Kisan Mitra')}
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-extrabold">
                  {selectedLang === 'te' ? 'వాయిస్ AI' : 'Voice AI'}
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-bold hidden sm:block">
                {selectedLang === 'te' ? 'నమస్కారం రమేష్ గారూ! 🌅 (టమాటా సాగు)' : 'Namaste Ramesh Bhai! 🌅'}
              </p>
            </div>
          </div>

          {/* Language Selector Pill */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLanguageModal(true)}
              className="px-4 py-2 rounded-2xl bg-slate-900 border border-emerald-500/40 text-xs font-black text-emerald-300 hover:bg-slate-800 flex items-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>{selectedLang === 'te' ? 'తెలుగు (Telugu)' : (selectedLang === 'hi' ? 'हिंदी (Hindi)' : 'English')}</span>
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
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black transition-all shrink-0 cursor-pointer ${
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
        {activeTab === 'market' && <MarketIntelligence activeField={activeField} />}
        {activeTab === 'schemes' && <GovtSchemesScreen lang={selectedLang} />}
        {activeTab === 'calendar' && <FarmingCalendarScreen lang={selectedLang} />}
        {activeTab === 'copilot' && <FarmCopilot activeField={activeField} />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 bg-slate-950 text-center text-xs text-slate-500 font-bold">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>🌾 కిసాన్ మిత్ర (Kisan Mitra) • Smart India Hackathon (SIH) Voice Prototype</span>
          <span>Telugu Voice AI & Multimodal Decision Engine</span>
        </div>
      </footer>

    </div>
  );
}
