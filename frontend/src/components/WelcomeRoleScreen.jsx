import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Key, Lock, ArrowRight, Globe, AlertCircle, X, Sparkles, CheckCircle2, UserPlus, Eye, EyeOff } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { SUPPORTED_LANGUAGES } from '../localization/languageMap';

export default function WelcomeRoleScreen({ onSelectFarmer, onSelectAdmin }) {
  const { lang, setLanguage, t } = useLanguage();
  
  // Check if an Admin password has been created in localStorage
  const [existingPassword, setExistingPassword] = useState(() => {
    return localStorage.getItem('kisan_admin_password') || '';
  });

  const [showAdminModal, setShowAdminModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Admin Login or Registration Handler
  const handleAdminAuthSubmit = (e) => {
    e.preventDefault();
    setPasswordError('');

    // MODE A: First-time Admin Password Registration
    if (!existingPassword) {
      if (!passwordInput || passwordInput.length < 4) {
        setPasswordError(
          lang === 'te'
            ? 'మార్గదర్శకం: పాస్‌వర్డ్ కనీసం 4 అక్షరాలు ఉండాలి.'
            : (lang === 'hi' ? 'पासवर्ड कम से कम 4 अक्षरों का होना चाहिए।' : 'Password must be at least 4 characters long.')
        );
        return;
      }
      if (passwordInput !== confirmPasswordInput) {
        setPasswordError(
          lang === 'te'
            ? 'పాస్‌వర్డ్‌లు సరిపోలడం లేదు. దయచేసి మళ్లీ తనిఖీ చేయండి.'
            : (lang === 'hi' ? 'पासवर्ड मेल नहीं खाते। कृपया पुनः जांचें।' : 'Passwords do not match. Please verify.')
        );
        return;
      }

      // Save newly created custom password
      localStorage.setItem('kisan_admin_password', passwordInput);
      setExistingPassword(passwordInput);
      setShowAdminModal(false);
      setPasswordInput('');
      setConfirmPasswordInput('');
      onSelectAdmin();
    } 
    // MODE B: Returning Admin Login Verification
    else {
      if (passwordInput === existingPassword) {
        setShowAdminModal(false);
        setPasswordInput('');
        onSelectAdmin();
      } else {
        setPasswordError(
          lang === 'te'
            ? '❌ తప్పు పాస్‌వర్డ్. అడ్మిన్ ప్రవేశం నిరాకరించబడింది.'
            : (lang === 'hi' ? '❌ गलत पासवर्ड। एडमिन प्रवेश अस्वीकृत।' : '❌ Incorrect Admin Password. Access Denied.')
        );
      }
    }
  };

  const getWelcomeGreeting = () => {
    switch (lang) {
      case 'te': return '🌾 కిసాన్ మిత్ర కు సాదర స్వాగతం!';
      case 'hi': return '🌾 किसान मित्र में आपका हार्दिक स्वागत है!';
      case 'ta': return '🌾 கிசான் மித்ராவுக்கு நல்வரவு!';
      case 'kn': return '🌾 ಕಿಸಾನ್ ಮಿತ್ರಕ್ಕೆ ನಿಮಗಿದೋ ಸ್ವಾಗತ!';
      case 'ml': return '🌾 കിസാൻ മിത്രയിലേക്ക് സ്വാഗതം!';
      case 'mr': return '🌾 किसान मित्र मध्ये आपले स्वागत आहे!';
      default: return '🌾 Welcome to Kisan Mitra!';
    }
  };

  const getSubGreeting = () => {
    switch (lang) {
      case 'te': return 'రైతుల సేవలో AI సాంకేతికత • ప్రభుత్వ పథకాలు • మార్కెట్ ధరలు • పంట వ్యాధి నిర్ధారణ';
      case 'hi': return 'किसानों की सेवा में AI तकनीक • सरकारी योजनाएं • मंडी भाव • फसल रोग निदान';
      case 'ta': return 'விவசாயிகளுக்கான செயற்கை நுண்ணறிவு • அரசு திட்டங்கள் • சந்தை விலை • பயிர் நோய் ஆய்வு';
      case 'kn': return 'ರೈತರ ಸೇವೆಗಾಗಿ AI ತಂತ್ರಜ್ಞಾನ • ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು • ಮಾರುಕಟ್ಟೆ ದರ • ಬೆಳೆ ರೋಗ ತಪಾಸಣೆ';
      default: return 'AI-Powered Smart Agriculture • Govt Schemes • Mandi Prices • Vision Crop Diagnosis';
    }
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between font-['Plus_Jakarta_Sans',sans-serif] relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/10 blur-3xl pointer-events-none" />

      {/* Top Header Bar with Language Switcher */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-xl shadow-emerald-500/20 text-2xl">
            🌾
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-400 flex items-center gap-2">
              Kisan Mitra
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-black">
                AI Platform
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-bold">Farmer Voice & Vision AI Engine</p>
          </div>
        </div>

        {/* 🌐 Native Language Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl px-3.5 py-2 shadow-lg backdrop-blur-md">
          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
          <select
            value={lang}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs font-black text-emerald-400 focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[200px]"
          >
            {Object.values(SUPPORTED_LANGUAGES).map((l) => (
              <option key={l.code} value={l.code} className="bg-slate-900 text-slate-100 font-bold">
                {l.flag} {l.name} ({l.subName})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col items-center text-center my-auto space-y-8">
        
        {/* Welcome Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold shadow-lg">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'te' ? 'క్రింది పోర్టల్‌లలో ఒకదాన్ని ఎంచుకోండి' : 'Select Your Portal Below'}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-slate-100 tracking-tight leading-tight">
            {getWelcomeGreeting()}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 font-bold max-w-2xl mx-auto leading-relaxed">
            {getSubGreeting()}
          </p>
        </div>

        {/* Dual Role Entry Cards (Government Admin vs Farmer Application) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl pt-4">
          
          {/* Card 1: 🏛️ Government & Admin Portal */}
          <div className="bg-slate-900/90 p-8 rounded-3xl border-2 border-slate-800 hover:border-cyan-500/60 transition-all duration-300 shadow-2xl flex flex-col justify-between text-left group hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldCheck className="w-32 h-32 text-cyan-400" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 text-2xl font-black shadow-lg shadow-cyan-500/10">
                🏛️
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-100">
                    {lang === 'te' ? 'ప్రభుత్వ & అడ్మిన్ పోర్టల్' : (lang === 'hi' ? 'शासन एवं एडमिन पोर्टल' : 'Government & Admin Portal')}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {existingPassword
                      ? (lang === 'te' ? 'పాస్‌వర్డ్‌తో రక్షించబడింది' : 'Password Protected')
                      : (lang === 'te' ? 'పాస్‌వర్డ్ సెటప్ అవసరం' : 'Password Setup Needed')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed">
                  {lang === 'te'
                    ? 'ప్రభుత్వ అధికారులు కొత్త పథకాలు జోడించడానికి, మార్కెట్ ధరలను నవీకరించడానికి మరియు వర్షపాత హెచ్చరికలను పంపడానికి లాగిన్ అవ్వండి.'
                    : 'For Government Officials & Admins to add new schemes, update live Mandi prices, and broadcast weather alerts.'}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{lang === 'te' ? 'కొత్త ప్రభుత్వ పథకాలను జోడించండి' : 'Publish New Government Schemes'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{lang === 'te' ? 'మండీ ధరలను నవీకరించండి' : 'Update Live Crop Mandi Prices'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{lang === 'te' ? 'వాతావరణ హెచ్చరికలను పంపండి' : 'Broadcast Weather Warnings to Farmers'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowAdminModal(true);
                setPasswordError('');
              }}
              className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-cyan-500/20 transition-all group-hover:shadow-cyan-500/30"
            >
              <Lock className="w-4 h-4" />
              <span>
                {existingPassword
                  ? (lang === 'te' ? 'అడ్మిన్ లాగిన్ (పాస్‌వర్డ్ నమోదు చేయండి)' : 'Admin Login (Enter Password)')
                  : (lang === 'te' ? 'అడ్మిన్ పాస్‌వర్డ్‌ను సృష్టించండి ➔' : 'Create Admin Password ➔')}
              </span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Card 2: 👨‍🌾 Farmer Portal / Application */}
          <div className="bg-slate-900/90 p-8 rounded-3xl border-2 border-slate-800 hover:border-emerald-500/60 transition-all duration-300 shadow-2xl flex flex-col justify-between text-left group hover:scale-[1.02] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <UserCheck className="w-32 h-32 text-emerald-400" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl font-black shadow-lg shadow-emerald-500/10">
                👨‍🌾
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-100">
                    {lang === 'te' ? 'రైతుల అప్లికేషన్' : (lang === 'hi' ? 'किसान आवेदन ऐप' : 'Farmer Application')}
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {lang === 'te' ? 'నేరుగా ప్రవేశించండి' : 'Direct Farmer Access'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold mt-2 leading-relaxed">
                  {lang === 'te'
                    ? 'పంట వ్యాధి నిర్ధారణ, వాతావరణ సమాచారం, ప్రభుత్వం ప్రకటించిన పథకాలు మరియు మార్కెట్ ధరలు చూడటానికి అనువర్తనాన్ని ఉపయోగించండి.'
                    : 'For Farmers to diagnose crop diseases, view official govt schemes, check Mandi prices, and talk with Kisan Voice AI.'}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'te' ? 'పంట & వ్యాధి గుర్తింపు AI (Google Lens)' : 'Crop & Disease AI Diagnosis (Google Lens)'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'te' ? 'మండీ ధరలు & వాతావరణ సలహాలు' : 'Live Mandi Prices & Weather Advisory'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'te' ? 'వాయిస్ సహాయకుడు & వ్యవసాయ క్యాలెండర్' : 'Voice AI Assistant & Farming Calendar'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onSelectFarmer}
              className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20 transition-all group-hover:shadow-emerald-500/30"
            >
              <UserCheck className="w-4 h-4" />
              <span>{lang === 'te' ? 'రైతుల యాప్‌ను ప్రారంభించండి ➔' : 'Enter Farmer Application ➔'}</span>
            </button>
          </div>

        </div>

      </main>

      {/* Admin Password Login / Registration Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative animate-in fade-in zoom-in duration-200">
            
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center mx-auto text-xl font-black">
                {existingPassword ? '🔑' : '⚙️'}
              </div>
              <h3 className="text-xl font-black text-slate-100">
                {existingPassword
                  ? (lang === 'te' ? 'అడ్మిన్ లాగిన్ పాస్‌వర్డ్ నమోదు చేయండి' : 'Government Admin Login')
                  : (lang === 'te' ? 'అడ్మిన్ పాస్‌వర్డ్‌ను సృష్టించండి' : 'Create Admin Security Password')}
              </h3>
              <p className="text-xs text-slate-400 font-bold">
                {existingPassword
                  ? (lang === 'te' ? 'పోర్టల్‌లోకి ప్రవేశించడానికి మీ పాస్‌వర్డ్‌ను నమోదు చేయండి.' : 'Enter your custom admin password to access the portal.')
                  : (lang === 'te' ? 'భవిష్యత్తు లాగిన్‌ల కోసం మీ స్వంత రహస్య పాస్‌వర్డ్‌ను సెట్ చేయండి.' : 'Set up your secret admin password for securing the portal.')}
              </p>
            </div>

            {passwordError && (
              <div className="p-3 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-300 text-xs font-black flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-300">
                  {existingPassword
                    ? (lang === 'te' ? 'అడ్మిన్ పాస్‌వర్డ్:' : 'Admin Password:')
                    : (lang === 'te' ? 'క్రొత్త అడ్మిన్ పాస్‌వర్డ్‌ను సృష్టించండి:' : 'Create New Admin Password:')}
                </label>
                <div className="relative mt-1">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder={existingPassword ? 'Enter Password' : 'Create Admin Password (min 4 chars)'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
                    autoFocus
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field for First-Time Setup */}
              {!existingPassword && (
                <div>
                  <label className="text-xs font-extrabold text-slate-300">
                    {lang === 'te' ? 'పాస్‌వర్డ్‌ను నిర్ధారించండి:' : 'Confirm Password:'}
                  </label>
                  <div className="relative mt-1">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm Admin Password"
                      value={confirmPasswordInput}
                      onChange={(e) => setConfirmPasswordInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-10 py-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {existingPassword
                    ? (lang === 'te' ? 'పాస్‌వర్డ్ తనిఖీ చేసి ప్రవేశించండి' : 'Verify Password & Access Portal')
                    : (lang === 'te' ? 'పాస్‌వర్డ్‌ను సేవ్ చేసి లాగిన్ అవ్వండి ➔' : 'Save Password & Access Portal ➔')}
                </span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-800/60 py-4 bg-slate-950 text-center text-xs text-slate-500 font-bold">
        🌾 Kisan Mitra AI Platform • 22 Official Scheduled Languages Supported
      </footer>

    </div>
  );
}
