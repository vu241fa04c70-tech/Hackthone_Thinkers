import React, { useState } from 'react';
import { Scroll, Volume2, CheckCircle2, Award, ShieldCheck, ArrowRight } from 'lucide-react';

export default function GovtSchemesScreen({ lang = 'te' }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(null);

  const schemes = [
    {
      id: 'pm_kisan',
      title: lang === 'te' ? 'PM-KISAN (పిఎం కిసాన్ సాగు సాయం)' : (lang === 'hi' ? 'पीएम किसान सम्मान निधि' : 'PM-KISAN Farmer Support'),
      tag: '₹6,000 / ఏడాది',
      desc: lang === 'te'
        ? 'ప్రతి సంవత్సరం ₹6,000 రైతుల బ్యాంక్ ఖాతాల్లో 3 విడతల్లో నేరుగా జమ అవుతుంది. పట్టాదారు పాస్ పుస్తకం మరియు ఆధార్ కార్డ్ లింక్ ఉన్న ప్రతి చిన్న, సన్నకారు రైతు అర్హులు.'
        : 'हर साल ₹6,000 किसानों के खाते में सीधे 3 किश्तों में ट्रांसफर। आधार लिंक अनिवार्य।',
      eligibility: lang === 'te' ? '✅ 5 ఎకరాలలోపు సాగు భూమి ఉన్న రైతులు' : '✅ 5 एकड़ तक भूमि वाले किसान',
      action: lang === 'te' ? 'అర్హత తనిఖీ చేయండి' : 'पात्रता जांचें'
    },
    {
      id: 'rythu_bharosa',
      title: lang === 'te' ? 'రైతు భరోసా (Rythu Bharosa)' : (lang === 'hi' ? 'रैथु भरोसा सहायता' : 'Rythu Bharosa Investment Support'),
      tag: '₹13,500 / ఏడాది',
      desc: lang === 'te'
        ? 'విత్తనాలు, ఎరువుల కొనుగోలు కోసం రైతులకు పెట్టుబడి సాయంగా ఏడాదికి ₹13,500 అందిస్తారు. కౌలు రైతులకు కూడా వర్తిస్తుంది.'
        : 'बीज और उर्वरक के लिए ₹13,500 की वार्षिक सहायता। पट्टेदार किसानों के लिए भी।',
      eligibility: lang === 'te' ? '✅ సొంత భూమి ఉన్న రైతులు మరియు కౌలు రైతులు' : '✅ पट्टेदार और मालिक दोनों',
      action: lang === 'te' ? 'దరఖాస్తు విధానం' : 'आवेदन प्रक्रिया'
    },
    {
      id: ' फसल_बीमा',
      title: lang === 'te' ? 'ప్రధానమంత్రి ఫసల్ బీమా యోజన (Crop Insurance)' : (lang === 'hi' ? 'प्रधानमंत्री फसल बीमा योजना' : 'Pradhan Mantri Fasal Bima Yojana'),
      tag: 'పంట నష్ట పరిహారం',
      desc: lang === 'te'
        ? 'అకాల వర్షాలు, తుఫానులు, కరువు వల్ల పంట నష్టం జరిగితే 100% భీమా పరిహారం లభిస్తుంది. కేవలం 1.5% ప్రీమియం చెల్లిస్తే చాలు.'
        : 'बेमौसम बारिश और सूखे से फसल नुकसान पर 100% क्लेम सुरक्षा।',
      eligibility: lang === 'te' ? '✅ టమాటా, వరి, మిరప, పత్తి సాగు చేసే రైతులు' : '✅ सभी प्रमुख फसलें',
      action: lang === 'te' ? 'క్లెయిమ్ దాఖలు చేయండి' : 'क्लेम दर्ज करें'
    }
  ];

  const speakText = (id, text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingAudio === id) {
        setIsPlayingAudio(null);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      if (lang === 'te') u.lang = 'te-IN';
      else if (lang === 'hi') u.lang = 'hi-IN';
      else u.lang = 'en-US';

      u.onend = () => setIsPlayingAudio(null);
      u.onerror = () => setIsPlayingAudio(null);

      setIsPlayingAudio(id);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            📜 {lang === 'te' ? 'ప్రభుత్వ పథకాలు & రైతు సహాయం' : (lang === 'hi' ? 'सरकारी योजनाएं' : 'Government Schemes')}
          </h2>
          <p className="text-xs text-slate-400">
            {lang === 'te' ? 'రైతులకు అందే పథకాల వివరాలు మరియు అర్హతలు వాయిస్ ద్వారా వినండి' : 'सरकारी योजनाओं की सरल जानकारी'}
          </p>
        </div>
      </div>

      {/* Schemes Cards List */}
      <div className="space-y-4">
        {schemes.map((s) => (
          <div key={s.id} className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-purple-500/50 transition-all shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-500/30 font-extrabold">
                  {s.tag}
                </span>
                <h3 className="text-lg font-black text-slate-100 mt-1">{s.title}</h3>
              </div>

              <button
                onClick={() => speakText(s.id, `${s.title}. ${s.desc}`)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 cursor-pointer transition-all ${
                  isPlayingAudio === s.id
                    ? 'bg-purple-500 text-slate-950 animate-pulse'
                    : 'bg-slate-950 text-slate-200 hover:text-purple-400 border border-slate-800'
                }`}
              >
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>{isPlayingAudio === s.id ? 'ఆపండి' : '🔊 వాయిస్ వినండి'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{s.desc}</p>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 text-xs font-bold text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{s.eligibility}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
