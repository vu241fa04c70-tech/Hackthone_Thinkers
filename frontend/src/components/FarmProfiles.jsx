import React, { useState, useEffect } from 'react';
import { User, MapPin, Sprout, Globe, Check, Save, UserPlus } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { INDIAN_STATES } from '../utils/indianStates';
import SearchableDistrictSelect from './SearchableDistrictSelect';

export default function FarmProfiles({ onProfileSwitch, onNewAccountClick }) {
  const { lang, t } = useLanguage();

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      farmer_name: 'రమేష్ కుమార్ (Ramesh)',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      village: 'Mangalagiri',
      main_crop: 'Tomato',
      acreage: 2.5
    };
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/farmers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
    } catch (err) {}

    localStorage.setItem('kisan_farmer_profile', JSON.stringify(profile));
    if (onProfileSwitch) onProfileSwitch(profile);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const getProfileTitle = () => {
    switch (lang) {
      case 'hi': return 'किसान प्रोफाइल एवं सेटिंग्स';
      case 'te': return 'రైతు ప్రొఫైల్ & సెట్టింగ్‌లు';
      case 'ta': return 'விவசாயி சுயவிவரம் மற்றும் அமைப்புகள்';
      default: return 'Farmer Profile & Settings';
    }
  };

  const getProfileSubtitle = () => {
    switch (lang) {
      case 'hi': return 'अपने किसान खाते का विवरण, राज्य, जिला और फसल जानकारी अपडेट करें';
      case 'te': return 'మీ రైతు ఖాతా వివరాలు, రాష్ట్రం, జిల్లా మరియు పంట వివరాలను సవరించండి';
      case 'ta': return 'உங்கள் சுயவிவர விவரங்கள் மற்றும் பயிர் தகவலைப் புதுப்பிக்கவும்';
      default: return 'Manage your farmer account details, state, district & crop details';
    }
  };

  const getNameLabel = () => {
    switch (lang) {
      case 'hi': return 'किसान का पूरा नाम';
      case 'te': return 'రైతు పూర్తి పేరు';
      case 'ta': return 'விவசாயி பெயர்';
      default: return 'Farmer Name';
    }
  };

  const getDistrictLabel = () => {
    switch (lang) {
      case 'hi': return 'जिला (ड्रॉपडाउन खोजें)';
      case 'te': return 'జిల్లా (డ్రాప్‌డౌన్ వెతకండి)';
      default: return 'District (Searchable Dropdown)';
    }
  };

  const getVillageLabel = () => {
    switch (lang) {
      case 'hi': return 'गांव / क्षेत्र';
      case 'te': return 'గ్రామం / మండలం';
      default: return 'Village / Mandal';
    }
  };

  const getMainCropLabel = () => {
    switch (lang) {
      case 'hi': return 'मुख्य बोई गई फसल';
      case 'te': return 'ప్రధాన సాగు పంట';
      case 'ta': return 'முக்கிய பயிர்';
      default: return 'Main Crop Grown';
    }
  };

  const getAcreageLabel = () => {
    switch (lang) {
      case 'hi': return 'भूमि का क्षेत्रफल (एकड़)';
      case 'te': return 'సాగు భూమి వైశాల్యం (ఎకరాలు)';
      default: return 'Land Area (Acres)';
    }
  };

  const getSaveLabel = () => {
    switch (lang) {
      case 'hi': return 'विवरण सुरक्षित करें ➔';
      case 'te': return 'వివరాలను సేవ్‌ చేయండి ➔';
      default: return 'Save Profile & Settings ➔';
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Card */}
      <div className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-[#2D6A4F] flex items-center gap-2">
            ⚙️ {getProfileTitle()}
          </h2>
          <p className="text-xs text-slate-600 font-bold mt-1">
            {getProfileSubtitle()}
          </p>
        </div>

        {onNewAccountClick && (
          <button
            type="button"
            onClick={onNewAccountClick}
            className="px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#2D6A4F] border-2 border-emerald-300 text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0 shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-[#2D6A4F]" />
            <span>➕ {lang === 'te' ? 'క్రొత్త ఖాతాని సృష్టించండి' : (lang === 'hi' ? 'नया खाता बनाएं' : 'Create New Account')}</span>
          </button>
        )}
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-950 text-xs font-extrabold flex items-center gap-2 shadow-md">
          <Check className="w-5 h-5 text-[#2D6A4F]" />
          <span>{lang === 'te' ? 'రైతు ప్రొఫైల్ వివరాలు విజయవంతంగా సేవ్ అయ్యాయి!' : (lang === 'hi' ? 'किसान प्रोफाइल अपडेट हो गई है!' : 'Farmer profile updated successfully!')}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-emerald-200 space-y-6 shadow-xl">
        
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
            <User className="w-4 h-4 text-[#2D6A4F]" />
            <span>{getNameLabel()}</span>
          </label>
          <input
            type="text"
            value={profile.farmer_name || ''}
            onChange={(e) => handleChange('farmer_name', e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
            required
          />
        </div>

        {/* State (Alphabetical Dropdown for 36 States & UTs) */}
        <div className="space-y-1.5">
          <label className="text-xs font-black text-slate-800 flex items-center justify-between">
            <span className="flex items-center gap-1.5 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-[#2D6A4F]" />
              <span>{lang === 'te' ? 'రాష్ట్రం (భారతదేశం)' : (lang === 'hi' ? 'राज्य (भारत)' : 'State (India)')}</span>
            </span>
            <span className="text-[10px] text-[#2D6A4F] font-bold">
              {lang === 'te' ? 'అక్షరక్రమంలో (36 రాష్ట్రాలు & కేంద్రపాలిత ప్రాంతాలు)' : (lang === 'hi' ? 'वर्णमाला क्रम में' : 'Alphabetical (36 States & UTs)')}
            </span>
          </label>
          
          <select
            value={profile.state || 'Andhra Pradesh'}
            onChange={(e) => handleChange('state', e.target.value)}
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

        {/* Searchable District Dropdown & Village Field */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Searchable District Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center justify-between">
              <span>{getDistrictLabel()}</span>
              <span className="text-[10px] text-[#2D6A4F] font-bold">🔍 Searchable</span>
            </label>
            <SearchableDistrictSelect
              value={profile.district || ''}
              onChange={(val) => handleChange('district', val)}
              selectedState={profile.state || 'Andhra Pradesh'}
              placeholder={lang === 'te' ? 'జిల్లాను వెతకండి లేదా ఎంచుకోండి...' : (lang === 'hi' ? 'जिला खोजें या चुनें...' : 'Search or select district...')}
            />
          </div>

          {/* Village */}
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">{getVillageLabel()}</label>
            <input
              type="text"
              value={profile.village || ''}
              onChange={(e) => handleChange('village', e.target.value)}
              placeholder="e.g. Mangalagiri"
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
              required
            />
          </div>
        </div>

        {/* Crop & Acreage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
              <Sprout className="w-4 h-4 text-[#2D6A4F]" />
              <span>{getMainCropLabel()}</span>
            </label>
            <select
              value={profile.main_crop || 'Tomato'}
              onChange={(e) => handleChange('main_crop', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] cursor-pointer"
            >
              <option value="Tomato">🍅 Tomato (టమాటా / टमाटर)</option>
              <option value="Paddy">🌾 Paddy (వరి / धान)</option>
              <option value="Chilli">🌶️ Chilli (మిరప / मिर्च)</option>
              <option value="Cotton">☁️ Cotton (పత్తి / कपास)</option>
              <option value="Maize">🌽 Maize (మొక్కజొన్న / मक्का)</option>
              <option value="Wheat">🌾 Wheat (గోధుమ / गेहूं)</option>
              <option value="Potato">🥔 Potato (బంగాళాదుంప / आलू)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">{getAcreageLabel()}</label>
            <input
              type="number"
              step="0.1"
              value={profile.acreage || 2.5}
              onChange={(e) => handleChange('acreage', parseFloat(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg cursor-pointer hover:scale-[1.01]"
        >
          <Save className="w-4 h-4 text-white" />
          <span>{getSaveLabel()}</span>
        </button>

      </form>
    </div>
  );
}
