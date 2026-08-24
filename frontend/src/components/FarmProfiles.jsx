import React, { useState, useEffect } from 'react';
import { User, MapPin, Sprout, Globe, Check, Save, UserPlus } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { INDIAN_STATES } from '../utils/indianStates';

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

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-[#2C3333] flex items-center gap-2">
            ⚙️ {t('profile.title')}
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-0.5">
            {t('profile.subtitle')}
          </p>
        </div>

        {onNewAccountClick && (
          <button
            type="button"
            onClick={onNewAccountClick}
            className="px-4 py-2.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-[#2D6A4F] border border-emerald-200 text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4 text-[#2D6A4F]" />
            <span>➕ {lang === 'te' ? 'క్రొత్త ఖాతాని సృష్టించండి' : (lang === 'hi' ? 'नया खाता बनाएं' : 'Create New Account')}</span>
          </button>
        )}
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs font-bold flex items-center gap-2 shadow-sm">
          <Check className="w-4 h-4 text-[#2D6A4F]" />
          <span>{lang === 'te' ? 'రైతు ప్రొఫైల్ వివరాలు విజయవంతంగా సేవ్ అయ్యాయి!' : (lang === 'hi' ? 'किसान प्रोफाइल अपडेट हो गई है!' : 'Farmer profile updated successfully!')}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 space-y-6 shadow-sm">
        
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <User className="w-4 h-4 text-[#2D6A4F]" />
            <span>{t('profile.name')}</span>
          </label>
          <input
            type="text"
            value={profile.farmer_name || ''}
            onChange={(e) => handleChange('farmer_name', e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
            required
          />
        </div>

        {/* State (Alphabetical Dropdown for 36 States & UTs) */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
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
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] cursor-pointer"
            required
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st} className="bg-white text-slate-800 font-semibold">
                📍 {st}
              </option>
            ))}
          </select>
        </div>

        {/* District & Village */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">{t('profile.district')}</label>
            <input
              type="text"
              value={profile.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">{t('profile.village')}</label>
            <input
              type="text"
              value={profile.village || ''}
              onChange={(e) => handleChange('village', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
              required
            />
          </div>
        </div>

        {/* Crop & Acreage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-[#2D6A4F]" />
              <span>{t('profile.mainCrop')}</span>
            </label>
            <select
              value={profile.main_crop || 'Tomato'}
              onChange={(e) => handleChange('main_crop', e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] cursor-pointer"
            >
              <option value="Tomato">🍅 Tomato (టమాటా / टमाटर)</option>
              <option value="Paddy">🌾 Paddy (వరి / धान)</option>
              <option value="Chilli">🌶️ Chilli (మిరప / मिर्च)</option>
              <option value="Cotton">☁️ Cotton (పత్తి / कपास)</option>
              <option value="Potato">🥔 Potato (బంగాళాదుంప / आलू)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">{t('profile.acreage')}</label>
            <input
              type="number"
              step="0.1"
              value={profile.acreage || 2.5}
              onChange={(e) => handleChange('acreage', parseFloat(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F]"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <Save className="w-4 h-4 text-white" />
          <span>{t('profile.save')}</span>
        </button>

      </form>
    </div>
  );
}
