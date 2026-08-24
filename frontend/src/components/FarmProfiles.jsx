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
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            ⚙️ {t('profile.title')}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {t('profile.subtitle')}
          </p>
        </div>

        {onNewAccountClick && (
          <button
            type="button"
            onClick={onNewAccountClick}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>➕ {lang === 'te' ? 'క్రొత్త ఖాతాని సృష్టించండి' : 'Create New Account'}</span>
          </button>
        )}
      </div>

      {savedMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-black flex items-center gap-2 shadow-lg">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{lang === 'te' ? 'రైతు ప్రొఫైల్ వివరాలు విజయవంతంగా సేవ్ అయ్యాయి!' : 'Farmer profile updated successfully!'}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        
        {/* Name */}
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-300 flex items-center gap-1.5">
            <User className="w-4 h-4 text-emerald-400" />
            <span>{t('profile.name')}</span>
          </label>
          <input
            type="text"
            value={profile.farmer_name || ''}
            onChange={(e) => handleChange('farmer_name', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
            required
          />
        </div>

        {/* State (Alphabetical Dropdown for 36 States & UTs) */}
        <div className="space-y-1">
          <label className="text-xs font-black text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>{t('profile.state')}</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-extrabold">All 36 States & UTs</span>
          </label>
          <select
            value={profile.state || 'Andhra Pradesh'}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            {INDIAN_STATES.map((st) => (
              <option key={st} value={st} className="bg-slate-900 text-slate-100 font-bold">
                📍 {st}
              </option>
            ))}
          </select>
        </div>

        {/* District & Village */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-300">{t('profile.district')}</label>
            <input
              type="text"
              value={profile.district || ''}
              onChange={(e) => handleChange('district', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-300">{t('profile.village')}</label>
            <input
              type="text"
              value={profile.village || ''}
              onChange={(e) => handleChange('village', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
              required
            />
          </div>
        </div>

        {/* Main Crop & Acreage */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-black text-slate-300 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>{t('profile.crop')}</span>
            </label>
            <select
              value={profile.main_crop || 'Tomato'}
              onChange={(e) => handleChange('main_crop', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value="Tomato">Tomato (టమాటా)</option>
              <option value="Paddy">Paddy / Rice (వరి)</option>
              <option value="Chilli">Chilli / Mirchi (మిరప)</option>
              <option value="Cotton">Cotton (పత్తి)</option>
              <option value="Maize">Maize (మొక్కజొన్న)</option>
              <option value="Wheat">Wheat (గోధుమ)</option>
              <option value="Potato">Potato (బంగాళాదుంప)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-slate-300">{t('profile.acreage')}</label>
            <input
              type="number"
              step="0.5"
              value={profile.acreage || 2.5}
              onChange={(e) => handleChange('acreage', parseFloat(e.target.value) || 1.0)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20 transition-transform hover:scale-[1.01]"
        >
          <Save className="w-4 h-4" />
          <span>{t('profile.saveBtn')}</span>
        </button>

      </form>
    </div>
  );
}
