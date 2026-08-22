import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, ExternalLink, Calendar, DollarSign, Award } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function GovtSchemesScreen() {
  const { lang, t } = useLanguage();
  const [isPlayingId, setIsPlayingId] = useState(null);
  const [dbSchemes, setDbSchemes] = useState([]);

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
      title: t('schemes.pmKisan'),
      category: t('schemes.pmKisanTag'),
      financial_benefit: '₹6,000 / Year',
      description: t('schemes.pmKisanDesc'),
      eligibility: t('schemes.pmKisanElig'),
      application_link: 'https://pmkisan.gov.in'
    },
    {
      scheme_id: 'rythu_bharosa',
      title: t('schemes.rythuBharosa'),
      category: t('schemes.rythuBharosaTag'),
      financial_benefit: '₹13,500 / Year',
      description: t('schemes.rythuBharosaDesc'),
      eligibility: t('schemes.rythuBharosaElig'),
      application_link: 'https://rythubharosa.ap.gov.in'
    },
    {
      scheme_id: 'crop_insurance',
      title: t('schemes.cropInsurance'),
      category: t('schemes.cropInsuranceTag'),
      financial_benefit: 'Full Crop Insurance Cover',
      description: t('schemes.cropInsuranceDesc'),
      eligibility: t('schemes.cropInsuranceElig'),
      application_link: 'https://pmfby.gov.in'
    }
  ];

  const activeSchemesList = dbSchemes.length > 0 ? dbSchemes : defaultSchemes;

  const toggleAudio = (id, text) => {
    if (isPlayingId === id) {
      stopSpeech();
      setIsPlayingId(null);
      return;
    }

    setIsPlayingId(id);
    speakText(
      text,
      lang,
      () => setIsPlayingId(id),
      () => setIsPlayingId(null),
      () => setIsPlayingId(null)
    );
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header Banner */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            📜 {t('schemes.title')}
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold">
              Live Govt Portal Sync
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {t('schemes.subtitle')}
          </p>
        </div>
      </div>

      {/* Dynamic Schemes List */}
      <div className="space-y-4">
        {activeSchemesList.map((s) => {
          let titleText = s.title;
          if (typeof s.title === 'object') {
            titleText = s.title[lang] || s.title.te || s.title.en;
          }

          return (
            <div key={s.scheme_id} className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-black">
                    {s.category || 'Government Subsidy'}
                  </span>
                  <h3 className="text-lg font-black text-slate-100 mt-1">{titleText}</h3>
                </div>

                <button
                  onClick={() => toggleAudio(s.scheme_id, `${titleText}. ${s.financial_benefit || ''}. ${s.description || ''}`)}
                  className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                    isPlayingId === s.scheme_id
                      ? 'bg-emerald-500 text-slate-950 animate-pulse'
                      : 'bg-slate-950 text-slate-200 hover:text-emerald-400 border border-slate-800'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>{isPlayingId === s.scheme_id ? (lang === 'te' ? 'ఆపండి' : 'Stop') : t('schemes.listenAudio')}</span>
                </button>
              </div>

              {s.financial_benefit && (
                <div className="flex items-center gap-2 text-sm font-black text-emerald-400 bg-emerald-950/40 p-3 rounded-2xl border border-emerald-500/30">
                  <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{s.financial_benefit}</span>
                </div>
              )}

              {s.description && (
                <p className="text-xs sm:text-sm text-slate-300 font-bold leading-relaxed">{s.description}</p>
              )}

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 flex items-center gap-2 flex-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{s.eligibility}</span>
                </div>

                {s.application_link && (
                  <a
                    href={s.application_link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-black text-xs flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-all shrink-0"
                  >
                    <span>{lang === 'te' ? 'అప్లై చేయండి' : 'Apply Online'}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
