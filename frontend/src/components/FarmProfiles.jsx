import React, { useState } from 'react';
import { User, MapPin, Sprout, Globe, Check, Save } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';

export default function FarmProfiles({ onChangeLanguageClick }) {
  const { lang, t } = useLanguage();

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      farmer_name: 'రమేష్ గారూ (Ramesh)',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      village: 'Tenali',
      main_crop: 'Tomato',
      land_size: '2.5'
    };
  });

  const [savedMsg, setSavedMsg] = useState(false);

  const handleChange = (field, val) => {
    setProfile(prev => ({ ...prev, [field]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('kisan_farmer_profile', JSON.stringify(profile));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            {t('profile.title')}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {lang === 'te' 
              ? 'మీ ప్రొఫైల్ ఆధారంగా వాతావరణం, మందులు మరియు మండీ ధరల సలహాలు అందుతాయి' 
              : 'Personalized weather, advisory and mandi recommendations based on your profile'}
          </p>
        </div>

        {/* Change Language Button (Requirement #19) */}
        <button
          onClick={onChangeLanguageClick}
          className="px-4 py-2.5 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-black flex items-center gap-2 cursor-pointer transition-all shrink-0"
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>{t('profile.changeLangBtn')}</span>
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
              {t('profile.name')}
            </label>
            <input
              type="text"
              value={profile.farmer_name}
              onChange={(e) => handleChange('farmer_name', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
              {t('profile.crop')}
            </label>
            <select
              value={profile.main_crop}
              onChange={(e) => handleChange('main_crop', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
            >
              <option value="Tomato">టమాటా (Tomato)</option>
              <option value="Paddy">వరి (Paddy/Rice)</option>
              <option value="Chilli">మిరప (Chilli)</option>
              <option value="Cotton">పత్తి (Cotton)</option>
              <option value="Maize">మొక్కజొన్న (Maize)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
              {t('profile.state')}
            </label>
            <input
              type="text"
              value={profile.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
              {t('profile.district')}
            </label>
            <input
              type="text"
              value={profile.district}
              onChange={(e) => handleChange('district', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
              {t('profile.village')}
            </label>
            <input
              type="text"
              value={profile.village}
              onChange={(e) => handleChange('village', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
              {t('profile.land')}
            </label>
            <input
              type="text"
              value={profile.land_size}
              onChange={(e) => handleChange('land_size', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-sm font-bold text-slate-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

        </div>

        <div className="pt-4 flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{t('profile.saveBtn')}</span>
          </button>

          {savedMsg && (
            <span className="text-xs font-black text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              {lang === 'te' ? 'భద్రపరచబడింది!' : 'Profile Saved Successfully!'}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
