import React, { useState } from 'react';
import { UserCheck, ShieldCheck, ArrowRight, Lock, Key, Globe, Sparkles } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../localization/languageMap';

export default function WelcomeRoleScreen({ onSelectFarmer, onSelectAdmin }) {
  const { lang, setLanguage, isRTL } = useLanguage();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Password Setup / Verification Logic
  const savedPassword = localStorage.getItem('kisan_admin_password');
  const isFirstTimeSetup = !savedPassword;

  const handleAdminClick = () => {
    setShowPasswordModal(true);
    setInputPassword('');
    setPasswordError('');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!inputPassword.trim()) {
      setPasswordError(lang === 'hi' ? 'कृपया पासवर्ड दर्ज करें' : (lang === 'te' ? 'దయచేసి పాస్‌వర్డ్ ఎంటర్ చేయండి' : 'Please enter password'));
      return;
    }

    if (isFirstTimeSetup) {
      if (inputPassword.length < 4) {
        setPasswordError(lang === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए' : (lang === 'te' ? 'పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి' : 'Password must be at least 4 characters'));
        return;
      }
      localStorage.setItem('kisan_admin_password', inputPassword.trim());
      setShowPasswordModal(false);
      onSelectAdmin();
    } else {
      if (inputPassword.trim() === savedPassword) {
        setShowPasswordModal(false);
        onSelectAdmin();
      } else {
        setPasswordError(lang === 'hi' ? 'गलत एडमिन पासवर्ड। पुनः प्रयास करें।' : (lang === 'te' ? 'తప్పు పాస్‌వర్డ్. దయచేసి మళ్లీ ప్రయత్నించండి.' : 'Incorrect password. Please try again.'));
      }
    }
  };

  const getTopBadge = () => {
    switch (lang) {
      case 'hi': return '✨ नीचे अपना पोर्टल चुनें';
      case 'te': return '✨ కింద మీ పోర్టల్‌ను ఎంచుకోండి';
      case 'ta': return '✨ போர்ட்டலை தேர்ந்தெடுக்கவும்';
      default: return '✨ Select Your Portal Below';
    }
  };

  const getTitle = () => {
    switch (lang) {
      case 'hi': return 'किसान मित्र में आपका हार्दिक स्वागत है!';
      case 'te': return 'కిసాన్ మిత్ర లోకి స్వాగతం!';
      case 'ta': return 'கிசான் மித்ராவுக்கு நல்வரவு!';
      default: return 'Welcome to Kisan Mitra!';
    }
  };

  const getSubtitle = () => {
    switch (lang) {
      case 'hi': return 'किसानों की सेवा में AI तकनीक • सरकारी योजनाएं • मंडी भाव • फसल रोग निदान';
      case 'te': return 'రైతుల సేవలో AI సాంకేతికత • ప్రభుత్వ పథకాలు • మార్కెట్ ధరలు • పంట వ్యాధి నిర్ధారణ';
      case 'ta': return 'விவசாயிகளுக்கான AI தொழில்நுட்பம் • அரசு திட்டங்கள் • சந்தை விலை';
      default: return 'AI Technology for Farmers • Government Schemes • Mandi Prices • Crop Disease Diagnostics';
    }
  };

  const getAdminBadge = () => {
    switch (lang) {
      case 'hi': return 'पासवर्ड द्वारा सुरक्षित';
      case 'te': return 'పాస్‌వర్డ్‌తో రక్షణ';
      default: return 'Password Protected';
    }
  };

  const getAdminTitle = () => {
    switch (lang) {
      case 'hi': return 'शासन एवं एडमिन पोर्टल';
      case 'te': return 'ప్రభుత్వ & అడ్మిన్ పోర్టల్';
      default: return 'Government Admin Portal';
    }
  };

  const getAdminDesc = () => {
    switch (lang) {
      case 'hi': return 'सरकारी अधिकारियों और व्यवस्थापकों के लिए नई योजनाएं जोड़ने, मंडी भाव अपडेट करने और मौसम चेतावनी जारी करने का पोर्टल।';
      case 'te': return 'ప్రభుత్వ అధికారులు మరియు అడ్మిన్‌లు కొత్త పథకాలు జోడించడానికి, మండీ ధరలు అప్‌డేట్ చేయడానికి పోర్టల్.';
      default: return 'For Government Officials & Admins to add new schemes, update live Mandi prices, and broadcast weather alerts.';
    }
  };

  const getAdminBullets = () => {
    if (lang === 'hi') {
      return [
        'नई सरकारी योजनाएं प्रकाशित करें',
        'लाइव फसल मंडी भाव अपडेट करें',
        'किसानों के लिए मौसम चेतावनियां जारी करें'
      ];
    } else if (lang === 'te') {
      return [
        'క్రొత్త ప్రభుత్వ పథకాలను ప్రచురించండి',
        'లైవ్ పంట మార్కెట్ ధరలను అప్‌డేట్ చేయండి',
        'రైతులకు వాతావరణ హెచ్చరికలు పంపండి'
      ];
    } else {
      return [
        'Publish New Government Schemes',
        'Update Live Crop Mandi Prices',
        'Broadcast Weather Warnings to Farmers'
      ];
    }
  };

  const getAdminBtnText = () => {
    switch (lang) {
      case 'hi': return '🔒 एडमिन लॉगिन (पासवर्ड दर्ज करें) ➔';
      case 'te': return '🔒 అడ్మిన్ లాగిన్ (పాస్‌వర్డ్ నమోదు చేయండి) ➔';
      default: return '🔒 Admin Login (Enter Password) ➔';
    }
  };

  const getFarmerBadge = () => {
    switch (lang) {
      case 'hi': return 'सीधा किसान प्रवेश';
      case 'te': return 'నేరుగా రైతు ప్రవేశం';
      default: return 'Direct Farmer Access';
    }
  };

  const getFarmerTitle = () => {
    switch (lang) {
      case 'hi': return 'किसान आवेदन ऐप';
      case 'te': return 'రైతు మొబైల్ అప్లికేషన్';
      default: return 'Farmer Application App';
    }
  };

  const getFarmerDesc = () => {
    switch (lang) {
      case 'hi': return 'किसानों के लिए फसल रोगों का निदान करने, सरकारी योजनाएं देखने, मंडी भाव जांचने और किसान वॉइस AI से बात करने का ऐप।';
      case 'te': return 'రైతులు పంట వ్యాధులను గుర్తించడానికి, ప్రభుత్వ పథకాలు చూడటానికి, మండీ ధరలు మరియు AI వాయిస్ తో మాట్లాడటానికి యాప్.';
      default: return 'For Farmers to diagnose crop diseases, view official govt schemes, check Mandi prices, and talk with Kisan Voice AI.';
    }
  };

  const getFarmerBullets = () => {
    if (lang === 'hi') {
      return [
        'फसल एवं रोग निदान (गूगल लेंस AI)',
        'लाइव मंडी भाव एवं मौसम सलाह',
        'वॉइस AI सहायक एवं कृषि कैलेंडर'
      ];
    } else if (lang === 'te') {
      return [
        'పంట వ్యాధి గుర్తింపు (గూగుల్ లెన్స్ AI)',
        'లైవ్ మండీ ధరలు & వాతావరణ సలహాలు',
        'వాయిస్ AI సహాయకుడు & క్యాలెండర్'
      ];
    } else {
      return [
        'Crop & Disease AI Diagnosis (Google Lens)',
        'Live Mandi Prices & Weather Advisory',
        'Voice AI Assistant & Farming Calendar'
      ];
    }
  };

  const getFarmerBtnText = () => {
    switch (lang) {
      case 'hi': return '👤 किसान ऐप में प्रवेश करें ➔';
      case 'te': return '👤 రైతు యాప్‌లో ప్రవేశించండి ➔';
      default: return '👤 Enter Farmer Application ➔';
    }
  };

  return (
    <div className={`min-h-screen bg-[#090d16] text-slate-100 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-emerald-500 selection:text-slate-950 p-4 sm:p-6 lg:p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
      
      {/* Top Bar Language Selector */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-end pb-4">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2 shadow-xl">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <select
            value={lang}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-black text-emerald-400 focus:outline-none cursor-pointer"
          >
            {Object.values(SUPPORTED_LANGUAGES).map((l) => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100 font-bold">
                {l.flag} {l.name} ({l.subName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="max-w-4xl mx-auto text-center space-y-4 my-auto pt-2 pb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black shadow-lg">
          <span>{getTopBadge()}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-100 flex items-center justify-center gap-3">
          <span className="text-4xl sm:text-6xl">🌾</span>
          <span>{getTitle()}</span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 font-bold max-w-2xl mx-auto leading-relaxed">
          {getSubtitle()}
        </p>
      </div>

      {/* Role Selection Cards Grid */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 my-auto">
        
        {/* Admin Card */}
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border-2 border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-2xl font-black shadow-lg group-hover:scale-110 transition-transform">
                🏛️
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                {getAdminBadge()}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-100 group-hover:text-cyan-300 transition-colors">
                {getAdminTitle()}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-bold mt-2 leading-relaxed">
                {getAdminDesc()}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              {getAdminBullets().map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleAdminClick}
            className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-500 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-500/20 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <span>{getAdminBtnText()}</span>
          </button>
        </div>

        {/* Farmer Application Card */}
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border-2 border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 shadow-2xl flex flex-col justify-between space-y-6 relative overflow-hidden group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl font-black shadow-lg group-hover:scale-110 transition-transform">
                👨‍🌾
              </div>
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {getFarmerBadge()}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-slate-100 group-hover:text-emerald-300 transition-colors">
                {getFarmerTitle()}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 font-bold mt-2 leading-relaxed">
                {getFarmerDesc()}
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              {getFarmerBullets().map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={onSelectFarmer}
            className="w-full min-h-[52px] py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <span>{getFarmerBtnText()}</span>
          </button>
        </div>

      </div>

      {/* Admin Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xl font-black">
                🔒
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-100">
                  {isFirstTimeSetup 
                    ? (lang === 'hi' ? 'एडमिन पासवर्ड बनाएं' : (lang === 'te' ? 'అడ్మిన్ పాస్‌వర్డ్ సృష్టించండి' : 'Create Admin Security Password'))
                    : (lang === 'hi' ? 'एडमिन लॉगिन पासवर्ड' : (lang === 'te' ? 'అడ్మిన్ లాగిన్ పాస్‌వర్డ్' : 'Enter Admin Password'))}
                </h3>
                <p className="text-xs text-slate-400 font-bold">
                  {isFirstTimeSetup
                    ? (lang === 'hi' ? 'एडमिन पोर्टल सुरक्षित रखने के लिए अपना गुप्त पासवर्ड सेट करें।' : (lang === 'te' ? 'అడ్మిన్ పోర్టల్ కోసం మీ రహస్య పాస్‌వర్డ్ సెట్ చేయండి.' : 'Set your secret password to protect the Admin Portal.'))
                    : (lang === 'hi' ? 'सरकारी एडमिन पोर्टल खोलने के लिए अपना पासवर्ड दर्ज करें।' : (lang === 'te' ? 'అడ్మిన్ పోర్టల్ తెరవడానికి మీ పాస్‌వర్డ్ నమోదు చేయండి.' : 'Enter your secret password to unlock government features.'))}
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  {lang === 'hi' ? 'एडमिन सुरक्षा पासवर्ड' : (lang === 'te' ? 'రహస్య పాస్‌వర్డ్' : 'Admin Password')}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={inputPassword}
                    onChange={(e) => {
                      setInputPassword(e.target.value);
                      setPasswordError('');
                    }}
                    placeholder={isFirstTimeSetup ? 'e.g. admin123' : '••••••••'}
                    className="w-full min-h-[48px] bg-slate-950 border border-slate-800 rounded-2xl px-4 text-sm font-black text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
                    autoFocus
                  />
                  <Key className="w-4 h-4 text-slate-500 absolute right-4 top-4" />
                </div>
                {passwordError && (
                  <p className="text-xs font-black text-rose-400 animate-bounce pt-1">
                    ⚠️ {passwordError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-400 font-black text-xs border border-slate-800 transition-all cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : (lang === 'te' ? 'రద్దు చేయండి' : 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
                >
                  {isFirstTimeSetup 
                    ? (lang === 'hi' ? 'सहेजें और खोलें ➔' : (lang === 'te' ? 'పాస్‌వర్డ్ సేవ్ చేయండి ➔' : 'Save & Login ➔'))
                    : (lang === 'hi' ? 'लॉगिन करें ➔' : (lang === 'te' ? 'లాగిన్ చేయండి ➔' : 'Unlock Portal ➔'))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-[11px] text-slate-500 font-bold py-2">
        <span>🌾 Kisan Mitra Multilingual AI Ecosystem • Built for Indian Agriculture</span>
      </div>

    </div>
  );
}
