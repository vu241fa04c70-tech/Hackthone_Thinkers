import React, { useState, useEffect } from 'react';
import { User, MapPin, Sprout, Globe, Check, Save, UserCheck, UserPlus } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';

export default function FarmProfiles({ onProfileSwitch }) {
  const { lang, t } = useLanguage();

  const [farmersList, setFarmersList] = useState([]);
  const [selectedFarmerId, setSelectedFarmerId] = useState('farmer_01');

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      farmer_name: 'రమేష్ గారూ (Ramesh)',
      state: 'Andhra Pradesh',
      district: 'Guntur',
      village: 'Mangalagiri',
      main_crop: 'Tomato',
      acreage: 2.5
    };
  });

  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    fetch('/api/farmers')
      .then(res => res.json())
      .then(data => {
        setFarmersList(data);
      })
      .catch(() => {});
  }, []);

  const handleSelectExisting = (farmer) => {
    setSelectedFarmerId(farmer.farmer_id);
    const updated = {
      farmer_name: farmer.farmer_name,
      main_crop: farmer.main_crop || 'Tomato',
      district: farmer.district || 'Guntur',
      village: farmer.village || 'Mangalagiri',
      state: farmer.state || 'Andhra Pradesh',
      acreage: farmer.acreage || 2.5
    };
    setProfile(updated);
    localStorage.setItem('kisan_farmer_profile', JSON.stringify(updated));
    if (onProfileSwitch) onProfileSwitch(updated);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            {t('profile.title')}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {lang === 'te' 
              ? 'రిజిస్టర్ అయిన రైతు ఖాతాను ఎంచుకోండి లేదా కొత్త అకౌంట్ సృష్టించండి' 
              : 'Switch registered farmer account or create a new farmer profile'}
          </p>
        </div>
      </div>

      {/* Registered Multi-Farmer Profiles Selector */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <span>👥</span>
          {lang === 'te' ? 'రిజిస్టర్ అయిన రైతు ఖాతాలు (Registered Farmers):' : 'Registered Farmer Accounts:'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {farmersList.map((f) => {
            const isSelected = profile.farmer_name === f.farmer_name;
            return (
              <button
                key={f.farmer_id}
                type="button"
                onClick={() => handleSelectExisting(f)}
                className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-950/90 to-teal-950/90 border-emerald-500 text-emerald-300 shadow-lg shadow-emerald-500/20 scale-[1.01]'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-sm font-black flex items-center gap-1.5">
                    <span>👨‍🌾</span> {f.farmer_name}
                  </div>
                  <div className="text-xs text-slate-400 font-bold mt-1">
                    🌾 {f.main_crop} • 📍 {f.village}, {f.district} ({f.acreage} Acres)
                  </div>
                </div>

                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile Form (Edit or Add New) */}
      <form onSubmit={handleSave} className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5 shadow-2xl">
        <h3 className="text-sm font-black text-slate-200 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-emerald-400" />
          {lang === 'te' ? 'ఖాతా వివరాలు మార్చండి / కొత్త ఖాతా సృష్టించండి:' : 'Edit Account / Create New Profile:'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider">
              {t('profile.name')}
            </label>
            <input
              type="text"
              required
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
              <option value="Wheat">గోధుమ (Wheat)</option>
              <option value="Potato">బంగాళాదుంప (Potato)</option>
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
              type="number"
              step="0.5"
              value={profile.acreage}
              onChange={(e) => handleChange('acreage', parseFloat(e.target.value) || 2.5)}
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
              {lang === 'te' ? 'భద్రపరచబడింది!' : 'Account Saved Successfully!'}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
