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

  const getLocalizedTitle = (schemeId, defaultEn) => {
    switch (schemeId) {
      case 'pm_kisan':
        return lang === 'te' ? 'పీఎం కిసాన్ సమ్మాన్ నిధి (PM-KISAN)' : (lang === 'hi' ? 'पीएम किसान सम्मान निधि (PM-KISAN)' : 'PM-KISAN Samman Nidhi Scheme');
      case 'rythu_bharosa':
        return lang === 'te' ? 'రైతు భరోసా / కిసాన్ సమ్మాన్ యోజన' : (lang === 'hi' ? 'पीएम फसल बीमा योजना (PMFBY)' : 'Rythu Bharosa / Farmer Financial Support');
      case 'crop_insurance':
        return lang === 'te' ? 'పీఎం ఫసల్ బీమా యోజన (PMFBY Crop Insurance)' : (lang === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना' : 'PM Fasal Bima Yojana (Crop Insurance)');
      default:
        return defaultEn;
    }
  };

  const getLocalizedCategoryTag = (catKey) => {
    switch (catKey) {
      case 'Direct Income Support':
        return lang === 'te' ? 'నేరుగా ఆదాయ సహాయం' : (lang === 'hi' ? 'प्रत्यक्ष आय सहायता' : 'Direct Income Support');
      case 'Crop Insurance & Risk Management':
        return lang === 'te' ? 'పంట బీమా & రక్షణ' : (lang === 'hi' ? 'फसल बीमा एवं जोखिम' : 'Crop Insurance & Risk');
      case 'Subsidized Machinery & Irrigation':
        return lang === 'te' ? 'యంత్రాల సబ్సిడీ & నీటిపారుదల' : (lang === 'hi' ? 'मशीनरी सब्सिडी' : 'Subsidized Machinery');
      default:
        return catKey;
    }
  };

  const defaultSchemes = [
    {
      scheme_id: 'pm_kisan',
      title: getLocalizedTitle('pm_kisan', 'PM-KISAN Samman Nidhi Scheme'),
      category: 'Direct Income Support',
      financial_benefit: lang === 'te' ? 'ఏటా ₹6,000 (3 విడతలలో రూ. 2,000 చొప్పున)' : (lang === 'hi' ? '₹6,000 प्रति वर्ष (3 किस्तों में)' : '₹6,000 per year (3 Installments of ₹2,000)'),
      description: lang === 'te' 
        ? 'చిన్న మరియు చిన్నకారు రైతు కుటుంబాలకు ఏటా ₹6,000 ఆర్థిక సహాయం నేరుగా బ్యాంక్ ఖాతాలో జమ.' 
        : (lang === 'hi' 
          ? 'छोटे और सीमांत किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष वित्तीय सहायता।' 
          : 'Direct bank transfer financial support for small and marginal landholding farmer families.'),
      eligibility: lang === 'te' 
        ? 'భారతదేశంలో సాగుభూమి ఉన్న చిన్న మరియు కమతాల రైతు కుటుంబాలు' 
        : (lang === 'hi' ? 'भारत में कृषि योग्य भूमि वाले सभी किसान परिवार' : 'All landholding farmer families across India'),
      application_link: 'https://pmkisan.gov.in'
    },
    {
      scheme_id: 'rythu_bharosa',
      title: getLocalizedTitle('rythu_bharosa', 'Rythu Bharosa / Farmer Investment Support'),
      category: 'Direct Income Support',
      financial_benefit: lang === 'te' ? 'ఏటా ₹13,500 పెట్టుబడి సాయం' : (lang === 'hi' ? '₹13,500 प्रति वर्ष' : '₹13,500 per year investment support'),
      description: lang === 'te' 
        ? 'పంట పెట్టుబడి సహాయం కోసం ప్రతి సంవత్సరం విత్తనాల కొనుగోలు సమయానికి విడతల వారీగా ఖాతాలో జమ చేసే పథకం.' 
        : (lang === 'hi' 
          ? 'बीज और उर्वरक की खरीद के लिए प्रतिवर्ष प्रत्यक्ष वित्तीय सहायता।' 
          : 'Annual investment support to farmer families for purchasing seeds, fertilizers & machinery.'),
      eligibility: lang === 'te' 
        ? 'సొంత భూమి ఉన్న రైతులు మరియు కౌలు రైతు కుటుంబాలు' 
        : (lang === 'hi' ? 'स्वयं की भूमि वाले किसान और पट्टेदार किसान' : 'Farmer families cultivating agricultural land including tenant farmers'),
      application_link: 'https://rythubharosa.ap.gov.in'
    },
    {
      scheme_id: 'crop_insurance',
      title: getLocalizedTitle('crop_insurance', 'PM Fasal Bima Yojana (Crop Insurance)'),
      category: 'Crop Insurance & Risk Management',
      financial_benefit: lang === 'te' ? 'వర్షాలు, తెగుళ్ల వల్ల పంట నష్టపోతే 100% బీమా రక్షణ' : (lang === 'hi' ? '100% फसल क्षतिपूर्ति बीमा' : 'Full financial cover against non-preventable crop yield losses'),
      description: lang === 'te' 
        ? 'వర్షాలు, వరదలు, కరువు లేదా తెగుళ్ల వల్ల పంట నష్టం వాటిల్లితే 100% నష్టపరిహార బీమా రక్షణ పథకం.' 
        : (lang === 'hi' 
          ? 'आपदाओं, बाढ़ या कीटों से फसल के नुकसान पर पूर्ण वित्तीय सुरक्षा।' 
          : 'Comprehensive crop insurance policy with nominal premium rates for Kharif and Rabi crops.'),
      eligibility: lang === 'te' 
        ? 'టమాటా, వరి, మిరప, పత్తి, బంగాళాదుంప సాగు చేసే రైతులు' 
        : (lang === 'hi' ? 'अधिसूचित फसलों की खेती करने वाले सभी किसान' : 'All farmers growing notified crops in notified areas'),
      application_link: 'https://pmfby.gov.in'
    }
  ];

  const schemesToRender = dbSchemes.length > 0 ? dbSchemes : defaultSchemes;

  const categories = [
    { id: 'ALL', label: lang === 'te' ? 'అన్ని పథకాలు' : (lang === 'hi' ? 'सभी योजनाएं' : 'All Schemes') },
    { id: 'Direct Income Support', label: lang === 'te' ? 'నేరుగా ఆదాయం' : (lang === 'hi' ? 'प्रत्यक्ष आय' : 'Direct Income') },
    { id: 'Crop Insurance & Risk Management', label: lang === 'te' ? 'పంట బీమా' : (lang === 'hi' ? 'फसल बीमा' : 'Crop Insurance') },
    { id: 'Subsidized Machinery & Irrigation', label: lang === 'te' ? 'యంత్రాల సబ్సిడీ' : (lang === 'hi' ? 'मशीनरी सब्सिडी' : 'Machinery Subsidy') }
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

    const titleStr = typeof scheme.title === 'object' ? (scheme.title[lang] || scheme.title.te || scheme.title.en) : scheme.title;
    const textToSpeak = `${titleStr}. ${scheme.financial_benefit}. ${scheme.description}`;

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
            {t('schemes.bannerTitle') || (lang === 'te' ? 'అధికారిక ప్రభుత్వ పథకాలు & రాయితీలు' : 'Official Government Schemes & Subsidies')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-3xl">
          {t('schemes.bannerSubtitle') || (lang === 'te' ? 'కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాల ఆర్థిక సహాయం, పంట బీమా మరియు యంత్రాల సబ్సిడీ పథకాల పూర్తి సమాచారం.' : 'Discover central and state government financial assistance, crop insurance, and subsidized machinery schemes.')}
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
                      {getLocalizedCategoryTag(s.category)}
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
                  <div className="text-[11px] font-black text-emerald-400 uppercase">
                    {lang === 'te' ? 'ఆర్థిక లబ్ధి (ఆదాయ సాయం)' : (lang === 'hi' ? 'वित्तीय लाभ' : 'Financial Benefit')}
                  </div>
                  <div className="text-base sm:text-lg font-black text-emerald-300">💰 {s.financial_benefit}</div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 font-bold leading-relaxed">
                  {s.description}
                </p>

                {/* Eligibility */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300">
                  🎯 <span className="text-slate-400 font-black">{lang === 'te' ? 'అర్హత నిబంధనలు:' : (lang === 'hi' ? 'पात्रता:' : 'Eligibility:')}</span> {s.eligibility}
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
                  <span>{lang === 'te' ? 'అధికారిక పోర్టల్‌లో దరఖాస్తు చేసుకోండి ➔' : (lang === 'hi' ? 'आधिकारिक पोर्टल पर आवेदन करें ➔' : 'Apply on Official Portal ➔')}</span>
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
