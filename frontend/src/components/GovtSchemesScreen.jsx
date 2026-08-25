import React, { useState, useEffect } from 'react';
import { Volume2, CheckCircle2, ExternalLink, Calendar, DollarSign, Award, Layers, Sparkles } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function GovtSchemesScreen() {
  const { lang } = useLanguage();
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

  const resolveLocalized = (val) => {
    if (!val) return '';
    if (typeof val === 'object') {
      return val[lang] || val.te || val.en || '';
    }
    return val;
  };

  const getLocalizedCategoryTag = (catKey) => {
    switch (catKey) {
      case 'Direct Income Support':
        return lang === 'te' ? 'నేరుగా ఆదాయ సహాయం' : (lang === 'hi' ? 'प्रत्यक्ष आय सहायता' : 'Direct Income Support');
      case 'Crop Insurance & Risk Management':
        return lang === 'te' ? 'పంట బీమా & రక్షణ' : (lang === 'hi' ? 'फसल बीमा एवं जोखिम' : 'Crop Insurance & Risk');
      case 'Subsidized Machinery & Irrigation':
        return lang === 'te' ? 'యంత్రాల సబ్సిడీ & నీటిపారుదల' : (lang === 'hi' ? 'मशीनरी सब्सिडी' : 'Subsidized Machinery');
      case 'State Investment Support':
        return lang === 'te' ? 'రాష్ట్ర రైతు సాయం' : (lang === 'hi' ? 'राज्य किसान सहायता' : 'State Investment Support');
      default:
        return catKey;
    }
  };

  const defaultSchemes = [
    {
      scheme_id: 'pm_kisan',
      title: lang === 'te' ? 'పీఎం కిసాన్ సమ్మాన్ నిధి (PM-KISAN)' : (lang === 'hi' ? 'पीएम किसान सम्मान निधि (PM-KISAN)' : 'PM-KISAN Samman Nidhi Scheme'),
      category: 'Direct Income Support',
      financial_benefit: lang === 'te' ? 'ఏటా ₹6,000 (3 విడతలలో రూ. 2,000 చొప్పున బ్యాంక్ ఖాతాలో జమ)' : (lang === 'hi' ? '₹6,000 प्रति वर्ष (3 किस्तों में)' : '₹6,000 per year (3 Installments of ₹2,000)'),
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
      title: lang === 'te' ? 'వైఎస్సార్ రైతు భరోసా / రాష్ట్ర రైతు సహాయం' : (lang === 'hi' ? 'राज्य किसान सहायता योजना (रायथु भरोसा)' : 'Rythu Bharosa / Farmer Investment Support'),
      category: 'State Investment Support',
      financial_benefit: lang === 'te' ? 'ఏటా ₹13,500 విత్తనాలు & ఎరువుల పెట్టుబడి సాయం' : (lang === 'hi' ? '₹13,500 प्रति वर्ष' : '₹13,500 per year investment support'),
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
      title: lang === 'te' ? 'పీఎం ఫసల్ భీమా యోజన (PMFBY Crop Insurance)' : (lang === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना (PMFBY)' : 'PM Fasal Bima Yojana (Crop Insurance)'),
      category: 'Crop Insurance & Risk Management',
      financial_benefit: lang === 'te' ? 'వర్షాలు, వరదలు లేదా తెగుళ్ల వల్ల పంట నష్టపోతే 100% బీమా రక్షణ' : (lang === 'hi' ? '100% फसल क्षतिपूर्ति बीमा' : 'Full financial cover against non-preventable crop yield losses'),
      description: lang === 'te' 
        ? 'వర్షాలు, వరదలు, కరువు లేదా తెగుళ్ల వల్ల పంట నష్టం వాటిల్లితే 100% నష్టపరిహార బీమా రక్షణ పథకం.' 
        : (lang === 'hi' 
          ? 'आपदाओं, बाढ़ या कीटों से फसल के नुकसान पर पूर्ण वित्तीय सुरक्षा।' 
          : 'Comprehensive crop insurance policy with nominal premium rates for Kharif and Rabi crops.'),
      eligibility: lang === 'te' 
        ? 'టమాటా, వరి, మిరప, పత్తి, బంగాళాదుంప సాగు చేసే రైతులు' 
        : (lang === 'hi' ? 'अधिसूचित फसलों की खेती करने वाले सभी किसान' : 'All farmers growing notified crops in notified areas'),
      application_link: 'https://pmfby.gov.in'
    },
    {
      scheme_id: 'micro_irrigation',
      title: lang === 'te' ? 'డ్రిప్ & తుంపర నీటిపారుదల సబ్సిడీ పథకం' : (lang === 'hi' ? 'ड्रिप एवं स्प्रिंकलर सिंचाई सब्सिडी योजना' : 'Subsidized Drip & Micro-Irrigation Scheme'),
      category: 'Subsidized Machinery & Irrigation',
      financial_benefit: lang === 'te' ? 'డ్రిప్ మరియు స్ప్రリンクలర్ సెట్లపై 80% నుండి 90% ప్రభుత్వ సబ్సిడీ' : (lang === 'hi' ? 'ड्रिप सेट पर 80% से 90% तक सरकारी सब्सिडी' : '80% to 90% government subsidy on Drip & Sprinkler sets'),
      description: lang === 'te'
        ? 'నీటి కొరత అధిగమించడానికి డ్రిప్ నీటిపారుదల పరికరాల కొనుగోలుపై 90% సబ్సిడీ అందించే పథకం.'
        : (lang === 'hi' ? 'पानी की बचत और पैदावार बढ़ाने के लिए ड्रिप सिंचाई उपकरण पर 90% सब्सिडी।' : 'Horticulture scheme providing up to 90% subsidy for drip/sprinkler micro-irrigation systems.'),
      eligibility: lang === 'te'
        ? 'సాగుభూమి మరియు బోరుబావి సౌకర్యం ఉన్న రైతులు'
        : (lang === 'hi' ? 'सिंचाई योग्य भूमि वाले सभी किसान' : 'All farmers having agricultural land with water source'),
      application_link: 'https://pmksy.gov.in'
    },
    {
      scheme_id: 'kisan_credit_card',
      title: lang === 'te' ? 'కిసాన్ క్రెడిట్ కార్డ్ (KCC 4% వడ్డీ రుణాలు)' : (lang === 'hi' ? 'किसान क्रेडिट कार्ड (KCC 4% ब्याज ऋण)' : 'Kisan Credit Card (KCC 4% Concessional Loan)'),
      category: 'Direct Income Support',
      financial_benefit: lang === 'te' ? 'రూ. 3 లక్షల వరకు కేవలం 4% వార్షిక వడ్డీకే పంట రుణం' : (lang === 'hi' ? '₹3 लाख तक केवल 4% ब्याज पर कृषि ऋण' : 'Crop loan up to ₹3 Lakh at 4% effective interest rate'),
      description: lang === 'te'
        ? 'పంట పెట్టుబడి కోసం బ్యాంకుల ద్వారా ఎటువంటి హామీ లేకుండా రూ. 3 లక్షల వరకు అతితక్కువ 4% వడ్డీకే రుణాలు.'
        : (lang === 'hi' ? 'बिना किसी गारंटी के ₹3 लाख तक का सस्ता कृषि ऋण प्रदान करने वाली योजना।' : 'Government scheme providing hassle-free crop credit up to ₹3 Lakh at 4% interest.'),
      eligibility: lang === 'te'
        ? 'రైతులు, కౌలు రైతులు మరియు పశుపోషకులు'
        : (lang === 'hi' ? 'किसान, पट्टेदार किसान और पशुपालक' : 'All farmers, tenant cultivators, and animal husbandry farmers'),
      application_link: 'https://sbi.co.in/kcc'
    },
    {
      scheme_id: 'pm_kusum',
      title: lang === 'te' ? 'పీఎం కుసుమ్ సోలార్ అగ్రికల్చర్ పంప్ స్కీమ్' : (lang === 'hi' ? 'पीएम कुसुम सोलर पंप योजना' : 'PM-KUSUM Solar Irrigation Pump Scheme'),
      category: 'Subsidized Machinery & Irrigation',
      financial_benefit: lang === 'te' ? 'సోలార్ పంప్‌సెట్ల ఏర్పాటుపై 60% సబ్సిడీ (పగటిపూట ఉచిత కరెంట్)' : (lang === 'hi' ? 'सोलर पंप पर 60% सरकारी सब्सिडी' : '60% government subsidy for solar irrigation pumps'),
      description: lang === 'te'
        ? 'పొలాల్లో డీజిల్ మరియు విద్యుత్ మోటార్లకు బదులుగా పగటిపూట ఉచిత కరెంట్‌తో నడిచే సోలార్ పంప్‌సెట్లపై 60% సబ్సిడీ.'
        : (lang === 'hi' ? 'मुफ्त सौर ऊर्जा से सिंचाई पंप चलाने हेतु 60% सब्सिडी योजना।' : 'Central scheme subsidizing 60% of solar pump costs for reliable daytime irrigation.'),
      eligibility: lang === 'te'
        ? 'వ్యవసాయ విద్యుత్ కనెక్షన్ లేని లేదా విద్యుత్ కోతలు ఉన్న రైతులు'
        : (lang === 'hi' ? 'सभी किसान और कृषि समूह' : 'Individual farmers, water user associations, and cooperatives'),
      application_link: 'https://pmkusum.mnre.gov.in'
    }
  ];

  const rawSchemesToRender = dbSchemes.length >= 5 ? dbSchemes : defaultSchemes;

  const categories = [
    { id: 'ALL', label: lang === 'te' ? 'అన్ని పథకాలు' : (lang === 'hi' ? 'सभी योजनाएं' : 'All Schemes') },
    { id: 'Direct Income Support', label: lang === 'te' ? 'నేరుగా ఆదాయం' : (lang === 'hi' ? 'प्रत्यक्ष आय' : 'Direct Income') },
    { id: 'Crop Insurance & Risk Management', label: lang === 'te' ? 'పంట బీమా' : (lang === 'hi' ? 'फसल बीमा' : 'Crop Insurance') },
    { id: 'Subsidized Machinery & Irrigation', label: lang === 'te' ? 'యంత్రాల సబ్సిడీ' : (lang === 'hi' ? 'मशीनरी सब्सिडी' : 'Machinery Subsidy') },
    { id: 'State Investment Support', label: lang === 'te' ? 'రాష్ట్ర సాయం' : (lang === 'hi' ? 'राज्य सहायता' : 'State Support') }
  ];

  const filteredSchemes = rawSchemesToRender.filter(s =>
    selectedCategory === 'ALL' ? true : s.category === selectedCategory
  );

  const toggleAudio = (scheme) => {
    if (isPlayingId === scheme.scheme_id) {
      stopSpeech();
      setIsPlayingId(null);
      return;
    }

    const titleStr = resolveLocalized(scheme.title);
    const benefitStr = resolveLocalized(scheme.financial_benefit);
    const descStr = resolveLocalized(scheme.description);
    const textToSpeak = `${titleStr}. ${benefitStr}. ${descStr}`;

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
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🏛️</span>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C3333]">
            {lang === 'te' ? 'అధికారిక ప్రభుత్వ పథకాలు & రాయితీలు' : (lang === 'hi' ? 'शासकीय योजनाएं एवं सब्सिडी' : 'Official Government Schemes & Subsidies')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-3xl">
          {lang === 'te' 
            ? 'కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాల ఆర్థిక సహాయం, పంట బీమా, నీటిపారుదల సబ్సిడీ మరియు తక్కువ వడ్డీ రుణాల పూర్తి సమాచారం.' 
            : (lang === 'hi' 
              ? 'केंद्र एवं राज्य सरकार की वित्तीय सहायता, फसल बीमा, ड्रिप सब्सिडी और कृषि ऋण।' 
              : 'Discover central and state government financial assistance, crop insurance, drip subsidies, and concessional loans.')}
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex space-x-2 border-b border-emerald-100 pb-3 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`min-h-[40px] px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
              selectedCategory === cat.id
                ? 'bg-[#2D6A4F] text-white shadow-sm scale-[1.02]'
                : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
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
          const titleStr = resolveLocalized(s.title);
          const benefitStr = resolveLocalized(s.financial_benefit);
          const descStr = resolveLocalized(s.description);
          const eligStr = resolveLocalized(s.eligibility);
          const isPlaying = isPlayingId === s.scheme_id;

          return (
            <div
              key={s.scheme_id}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 space-y-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                      {getLocalizedCategoryTag(s.category)}
                    </span>
                    <h3 className="text-xl font-black text-[#2C3333] mt-2 group-hover:text-[#2D6A4F] transition-colors">
                      {titleStr}
                    </h3>
                  </div>

                  <button
                    onClick={() => toggleAudio(s)}
                    className={`p-2.5 rounded-full border font-bold text-xs flex items-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                      isPlaying
                        ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                        : 'bg-emerald-50 text-[#2D6A4F] border-emerald-200 hover:bg-emerald-100'
                    }`}
                    title="Listen Scheme Audio"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                  </button>
                </div>

                {/* Financial Benefit Tag */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                  <div className="text-[11px] font-bold text-[#2D6A4F] uppercase">
                    {lang === 'te' ? 'ఆర్థిక లబ్ధి (ఆదాయ సాయం)' : (lang === 'hi' ? 'वित्तीय लाभ' : 'Financial Benefit')}
                  </div>
                  <div className="text-base sm:text-lg font-extrabold text-[#2D6A4F]">💰 {benefitStr}</div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed">
                  {descStr}
                </p>

                {/* Eligibility */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                  🎯 <span className="text-slate-500 font-bold">{lang === 'te' ? 'అర్హత నిబంధనలు:' : (lang === 'hi' ? 'पात्रता:' : 'Eligibility:')}</span> {eligStr}
                </div>
              </div>

              {/* Action Button: Official Portal */}
              {s.application_link && (
                <a
                  href={s.application_link}
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-[48px] w-full mt-4 py-3 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>{lang === 'te' ? 'అధికారిక పోర్టల్‌లో దరఖాస్తు చేసుకోండి ➔' : (lang === 'hi' ? 'आधिकारिक पोर्टल पर आवेदन करें ➔' : 'Apply on Official Portal ➔')}</span>
                  <ExternalLink className="w-4 h-4 text-white" />
                </a>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
