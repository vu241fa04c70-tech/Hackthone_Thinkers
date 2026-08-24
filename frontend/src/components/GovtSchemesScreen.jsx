import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, ExternalLink, Calendar, DollarSign, Award, Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function GovtSchemesScreen() {
  const { lang, t } = useLanguage();
  const [isPlayingId, setIsPlayingId] = useState(null);
  const [dbSchemes, setDbSchemes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    fetch('/api/schemes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDbSchemes(data);
        }
      })
      .catch(() => {});
  }, []);

  const defaultSchemes = [
    {
      scheme_id: 'pm_kisan',
      title: t('schemes.pmKisan') || 'PM-KISAN Samman Nidhi Scheme',
      category: 'Direct Income Support',
      financial_benefit: '₹6,000 / Year',
      description: t('schemes.pmKisanDesc') || 'Direct financial income support of ₹6,000 per year transferred in 3 equal installments.',
      eligibility: t('schemes.pmKisanElig') || 'All small & marginal landholding farmer families across India.',
      application_link: 'https://pmkisan.gov.in'
    },
    {
      scheme_id: 'rythu_bharosa',
      title: t('schemes.rythuBharosa') || 'Rythu Bharosa / Farmer Financial Support',
      category: 'Direct Income Support',
      financial_benefit: '₹13,500 / Year',
      description: t('schemes.rythuBharosaDesc') || 'Annual investment support to farmer families for purchasing seeds, fertilizers & machinery.',
      eligibility: t('schemes.rythuBharosaElig') || 'Farmer families cultivating agricultural land including tenant farmers.',
      application_link: 'https://rythubharosa.ap.gov.in'
    },
    {
      scheme_id: 'crop_insurance',
      title: t('schemes.cropInsurance') || 'PM Fasal Bima Yojana (Crop Insurance)',
      category: 'Crop Insurance & Risk Management',
      financial_benefit: 'Full Crop Loss Cover',
      description: t('schemes.cropInsuranceDesc') || 'Comprehensive crop insurance covering yield loss due to non-preventable natural risks, flood, and pests.',
      eligibility: t('schemes.cropInsuranceElig') || 'All farmers growing notified crops in notified areas.',
      application_link: 'https://pmfby.gov.in'
    }
  ];

  const schemesToRender = dbSchemes.length > 0 ? dbSchemes : defaultSchemes;

  const categories = [
    { id: 'ALL', label: 'All Schemes' },
    { id: 'Direct Income Support', label: 'Direct Income' },
    { id: 'Crop Insurance & Risk Management', label: 'Crop Insurance' },
    { id: 'Subsidized Machinery & Irrigation', label: 'Machinery Subsidy' }
  ];

  const filteredSchemes = schemesToRender.filter(s =>
    selectedCategory === 'ALL' ? true : s.category === selectedCategory
  );

  const toggleAudio = (scheme) => {
    if (isPlayingId === scheme.scheme_id) {
      stopSpeech();
      setIsPlayingId(null);
      return;
    }

    const titleStr = typeof scheme.title === 'object' ? (scheme.title.te || scheme.title.en) : scheme.title;
    const textToSpeak = `${titleStr}. Financial benefit: ${scheme.financial_benefit}. Eligibility: ${scheme.eligibility}. Description: ${scheme.description}`;

    setIsPlayingId(scheme.scheme_id);
    speakText(
      textToSpeak,
      lang,
      () => setIsPlayingId(scheme.scheme_id),
      () => setIsPlayingId(null),
      () => setIsPlayingId(null)
    );
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-2xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <h2 className="text-xl sm:text-2xl font-black text-purple-400">
            Official Government Schemes & Subsidies
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-3xl">
          Discover central and state government financial assistance, crop insurance, and subsidized machinery schemes.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-slate-950 shadow-lg shadow-purple-500/20 scale-[1.02]'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((s) => {
          const titleStr = typeof s.title === 'object' ? (s.title[lang] || s.title.te || s.title.en) : s.title;
          const isPlaying = isPlayingId === s.scheme_id;

          return (
            <div
              key={s.scheme_id}
              className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4 shadow-2xl flex flex-col justify-between hover:border-purple-500/40 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {s.category}
                    </span>
                    <h3 className="text-xl font-black text-slate-100 mt-2 group-hover:text-purple-300 transition-colors">
                      {titleStr}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleAudio(s)}
                    className={`p-2.5 rounded-2xl border font-black text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                      isPlaying
                        ? 'bg-rose-500 text-slate-950 border-rose-500 animate-pulse'
                        : 'bg-slate-950 text-emerald-400 border-slate-800 hover:border-emerald-500/40'
                    }`}
                    title="Listen Scheme Audio"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                  </button>
                </div>

                {/* Financial Benefit Tag */}
                <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 space-y-1">
                  <div className="text-[11px] font-black text-emerald-400 uppercase">Financial Benefit</div>
                  <div className="text-lg font-black text-emerald-300">💰 {s.financial_benefit}</div>
                </div>

                {/* Description & Eligibility */}
                <p className="text-xs text-slate-300 font-bold leading-relaxed">
                  {s.description}
                </p>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
                  🎯 <span className="text-slate-400">Eligibility:</span> {s.eligibility}
                </div>
              </div>

              {/* Action Button: Official Portal */}
              {s.application_link && (
                <a
                  href={s.application_link}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[48px] w-full mt-4 py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-500/40 font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Apply on Official Portal</span>
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                </a>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
