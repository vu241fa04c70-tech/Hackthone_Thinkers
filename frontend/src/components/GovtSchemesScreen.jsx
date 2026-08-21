import React, { useState } from 'react';
import { Volume2, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function GovtSchemesScreen() {
  const { lang, t } = useLanguage();
  const [isPlayingId, setIsPlayingId] = useState(null);

  const schemes = [
    {
      id: 'pm_kisan',
      title: t('schemes.pmKisan'),
      tag: t('schemes.pmKisanTag'),
      desc: t('schemes.pmKisanDesc'),
      eligibility: lang === 'te' ? '✅ 5 ఎకరాలలోపు సాగు భూమి ఉన్న రైతులు' : '✅ Farmers owning up to 5 acres land'
    },
    {
      id: 'rythu_bharosa',
      title: t('schemes.rythuBharosa'),
      tag: t('schemes.rythuBharosaTag'),
      desc: t('schemes.rythuBharosaDesc'),
      eligibility: lang === 'te' ? '✅ సొంత భూమి ఉన్న రైతులు మరియు కౌలు రైతులు' : '✅ Land owners and tenant farmers'
    },
    {
      id: ' crop_insurance',
      title: t('schemes.cropInsurance'),
      tag: t('schemes.cropInsuranceTag'),
      desc: t('schemes.cropInsuranceDesc'),
      eligibility: lang === 'te' ? '✅ టమాటా, వరి, మిరప, పత్తి సాగు చేసే రైతులు' : '✅ Tomato, Paddy, Chilli & Cotton farmers'
    }
  ];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            📜 {t('schemes.title')}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {t('schemes.subtitle')}
          </p>
        </div>
      </div>

      {/* Schemes Cards List */}
      <div className="space-y-4">
        {schemes.map((s) => (
          <div key={s.id} className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-emerald-500/50 transition-all shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-black">
                  {s.tag}
                </span>
                <h3 className="text-lg font-black text-slate-100 mt-1">{s.title}</h3>
              </div>

              <button
                onClick={() => toggleAudio(s.id, `${s.title}. ${s.desc}`)}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
                  isPlayingId === s.id
                    ? 'bg-emerald-500 text-slate-950 animate-pulse'
                    : 'bg-slate-950 text-slate-200 hover:text-emerald-400 border border-slate-800'
                }`}
              >
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>{isPlayingId === s.id ? 'ఆపండి' : t('schemes.listenAudio')}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-bold leading-relaxed">{s.desc}</p>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{s.eligibility}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
