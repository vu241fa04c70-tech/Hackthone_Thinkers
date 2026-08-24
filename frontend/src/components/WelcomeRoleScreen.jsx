import React, { useState } from 'react';
import { UserCheck, ShieldCheck, ArrowRight, Lock, Key, Globe, Sparkles, Camera, TrendingUp, Sun, Scroll, Volume2 } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../localization/languageMap';

export default function WelcomeRoleScreen({ onSelectFarmer, onSelectAdmin }) {
  const { lang, setLanguage, isRTL } = useLanguage();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [inputPassword, setInputPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const savedFarmer = (() => {
    try {
      const p = localStorage.getItem('kisan_farmer_profile');
      return p ? JSON.parse(p) : null;
    } catch (e) {
      return null;
    }
  })();

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

  const getTitle = () => {
    switch (lang) {
      case 'hi': return 'किसान मित्र में आपका स्वागत है';
      case 'te': return 'కిసాన్ మిత్ర లోకి స్వాగతం!';
      case 'ta': return 'கிசான் மித்ராவுக்கு நல்வரவு!';
      default: return 'Welcome to Kisan Mitra';
    }
  };

  const getSubtitle = () => {
    switch (lang) {
      case 'hi': return 'भारत के किसानों के लिए AI फसल रोग निदान, लाइव मंडी भाव, मौसम चेतावनियां एवं सरकारी योजनाएं';
      case 'te': return 'భారతీయ రైతుల కోసం AI పంట వ్యాధి గుర్తింపు, లైవ్ మండీ ధరలు, వాతావరణ హెచ్చరికలు మరియు ప్రభుత్వ పథకాలు';
      case 'ta': return 'இந்திய விவசாயிகளுக்கான AI பயிர் நோய் கண்டறிதல், நேரலை சந்தை விலை மற்றும் அரசு திட்டங்கள்';
      default: return 'AI Crop Disease Diagnostics, Live Mandi Rates, Weather Advisory & Government Schemes for Indian Farmers';
    }
  };

  const getFarmerBtnText = () => {
    switch (lang) {
      case 'hi': return '👤 किसान ऐप में प्रवेश करें ➔';
      case 'te': return '👤 రైతు యాప్‌లో ప్రవేశించండి ➔';
      case 'ta': return '👤 விவசாயி செயலியில் நுழையவும் ➔';
      default: return '👤 Enter Farmer Application ➔';
    }
  };

  const farmerFeatures = [
    {
      title: lang === 'hi' ? '📷 फसल एवं रोग निदान (AI लेंस)' : (lang === 'te' ? '📷 పంట వ్యాధి గుర్తింపు (AI లెన్స్)' : '📷 AI Crop Disease Diagnosis'),
      desc: lang === 'hi' ? 'फसल की फोटो खींचकर रोग और सटीक दवाई का सुझाव पाएं।' : (lang === 'te' ? 'పంట ఫోటో తీసి వ్యాధి మరియు రసాయన మందుల సలహా పొందండి.' : 'Upload crop photos to detect diseases and chemical treatments.')
    },
    {
      title: lang === 'hi' ? '💰 लाइव मंडी भाव एवं बिक्री सलाह' : (lang === 'te' ? '💰 లైవ్ మండీ ధరలు & అమ్మకం సలహా' : '💰 Live Mandi Prices & Sell Advisory'),
      desc: lang === 'hi' ? 'निकटतम मंडियों के प्रति क्विंटल भाव और बेचने का सही समय।' : (lang === 'te' ? 'సమీప గుంటూరు యార్డ్ ధరలు మరియు అమ్మకపు ఉత్తమ సమయం.' : 'Real-time APMC mandi prices and AI harvest hold advice.')
    },
    {
      title: lang === 'hi' ? '🌦️ मौसम चेतावनी एवं बुवाई कैलेंडर' : (lang === 'te' ? '🌦️ వాతావరణ హెచ్చరికలు & క్యాలెండర్' : '🌦️ Weather Advisory & Crop Calendar'),
      desc: lang === 'hi' ? 'बारिश का सटीक अनुमान एवं साप्ताहिक खेती के काम।' : (lang === 'te' ? 'వర్షపాత సూచనలు మరియు వారపు వ్యవసాయ పనుల జాబితా.' : 'Real-time rainfall warnings and weekly farming schedule.')
    },
    {
      title: lang === 'hi' ? '🏛️ सरकारी योजनाएं एवं वित्तीय लाभ' : (lang === 'te' ? '🏛️ ప్రభుత్వ పథకాలు & రాయితీలు' : '🏛️ Government Schemes & Subsidies'),
      desc: lang === 'hi' ? 'पीएम-किसान, फसल बीमा और सब्सिडी योजनाओं की जानकारी।' : (lang === 'te' ? 'పీఎం-కిసాన్, రైతు భరోసా మరియు ఫసల్ బీమా పథకాల సమాచారం.' : 'PM-KISAN, Rythu Bharosa, and PMFBY crop insurance details.')
    }
  ];

  return (
    <div className={`min-h-screen bg-[#FAF8F3] text-[#2C3333] flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#2D6A4F] selection:text-white p-4 sm:p-6 lg:p-8 ${isRTL ? 'text-right' : 'text-left'}`}>
      
      {/* Top Bar with Discrete Admin Access Link */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-black text-lg shadow-sm">
            🌾
          </div>
          <span className="text-base font-black text-[#2D6A4F] tracking-tight">Kisan Mitra</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Discrete Admin Access Button */}
          <button
            onClick={handleAdminClick}
            className="px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
            title="Authorized Government Admin Portal Only"
          >
            <Lock className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>{lang === 'hi' ? '🔐 एडमिन एक्सेस' : (lang === 'te' ? '🔐 అడ్మిన్ ప్రవేశం' : '🔐 Admin Access')}</span>
          </button>

          {/* 🌐 Multilingual Dropdown */}
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3.5 py-1.5 shadow-sm">
            <Globe className="w-4 h-4 text-[#2D6A4F] shrink-0" />
            <select
              value={lang}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#2D6A4F] focus:outline-none cursor-pointer"
            >
              {Object.values(SUPPORTED_LANGUAGES).map((l) => (
                <option key={l.code} value={l.code} className="bg-white text-slate-800 font-semibold">
                  {l.flag} {l.name} ({l.subName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="max-w-4xl mx-auto text-center space-y-5 my-auto pt-4 pb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-[#2D6A4F] border border-emerald-200 text-xs font-extrabold shadow-sm">
          <Sparkles className="w-4 h-4 text-[#2D6A4F]" />
          <span>{lang === 'hi' ? 'डिजिटल किसान सेवा ऐप' : (lang === 'te' ? 'డిజిటల్ రైతు యాప్' : 'Digital Agriculture Platform for Farmers')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#2C3333] leading-tight">
          {getTitle()}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-2xl mx-auto leading-relaxed">
          {getSubtitle()}
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-md mx-auto">
          {savedFarmer && (
            <button
              onClick={onSelectFarmer}
              className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-full bg-white hover:bg-emerald-50 text-[#2D6A4F] border-2 border-emerald-200 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all hover:scale-105"
            >
              <span>👨‍🌾 {savedFarmer.farmer_name || 'Ramesh'} {lang === 'hi' ? 'के रूप में जारी रखें ➔' : (lang === 'te' ? 'గా కొనసాగండి ➔' : 'Continue ➔')}</span>
            </button>
          )}

          <button
            onClick={onSelectFarmer}
            className="w-full sm:w-auto min-h-[52px] px-8 py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
          >
            <span>{getFarmerBtnText()}</span>
          </button>
        </div>
      </div>

      {/* Farmer Feature Highlights Grid */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 my-auto pt-4">
        {farmerFeatures.map((feat, idx) => (
          <div key={idx} className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 hover:border-emerald-300 transition-all space-y-2 shadow-sm">
            <h3 className="text-base font-bold text-[#2C3333]">{feat.title}</h3>
            <p className="text-xs text-slate-600 font-semibold leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>

      {/* Secret Admin Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#2D6A4F] border border-emerald-200 flex items-center justify-center text-xl font-black">
                🔒
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#2C3333]">
                  {isFirstTimeSetup 
                    ? (lang === 'hi' ? 'एडमिन पासवर्ड बनाएं' : (lang === 'te' ? 'అడ్మిన్ పాస్‌వర్డ్ సృష్టించండి' : 'Create Admin Security Password'))
                    : (lang === 'hi' ? 'एडमिन लॉगिन पासवर्ड' : (lang === 'te' ? 'అడ్మిన్ లాగిన్ పాస్‌వర్డ్' : 'Enter Admin Password'))}
                </h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {isFirstTimeSetup
                    ? (lang === 'hi' ? 'एडमिन पोर्टल सुरक्षित रखने के लिए अपना गुप्त पासवर्ड सेट करें।' : (lang === 'te' ? 'అడ్మిన్ పోర్టల్ కోసం మీ రహస్య పాస్‌వర్డ్ సెట్ చేయండి.' : 'Set your secret password to protect the Admin Portal.'))
                    : (lang === 'hi' ? 'सरकारी एडमिन पोर्टल खोलने के लिए अपना पासवर्ड दर्ज करें।' : (lang === 'te' ? 'అడ్మిన్ పోర్టల్ తెరవడానికి మీ పాస్‌వర్డ్ నమోదు చేయండి.' : 'Enter your secret password to unlock government features.'))}
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
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
                    className="w-full min-h-[48px] bg-slate-50 border border-slate-200 rounded-2xl px-4 text-sm font-bold text-[#2C3333] placeholder-slate-400 focus:outline-none focus:border-[#2D6A4F] transition-all"
                    autoFocus
                  />
                  <Key className="w-4 h-4 text-slate-400 absolute right-4 top-4" />
                </div>
                {passwordError && (
                  <p className="text-xs font-bold text-rose-600 animate-bounce pt-1">
                    ⚠️ {passwordError}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
                >
                  {lang === 'hi' ? 'रद्द करें' : (lang === 'te' ? 'రద్దు చేయండి' : 'Cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs transition-all cursor-pointer shadow-md"
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
      <div className="text-center text-[11px] text-slate-500 font-semibold py-2">
        <span>🌾 Kisan Mitra Multilingual AI Ecosystem • Built for Indian Agriculture</span>
      </div>

    </div>
  );
}
