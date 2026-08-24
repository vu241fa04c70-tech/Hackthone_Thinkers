import React, { useState, useEffect } from 'react';
import { PhoneCall, MapPin, User, Building, ShieldCheck, AlertCircle, Search, HelpCircle, CheckCircle2, Layers, PhoneForwarded } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';

export default function FarmerSupportScreen() {
  const { lang } = useLanguage();
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Load saved farmer profile location
  const farmerProfile = (() => {
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      state: 'Andhra Pradesh',
      district: 'Guntur',
      mandal: 'Mangalagiri',
      village: 'Mangalagiri'
    };
  })();

  const fetchContacts = () => {
    setIsLoading(true);
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setContacts(data);
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const resolveServicesText = (serv) => {
    if (!serv) return '';
    if (typeof serv === 'object') {
      return serv[lang] || serv.te || serv.en || '';
    }
    return serv;
  };

  const getCategoryDisplayName = (catKey) => {
    switch (catKey) {
      case 'Kisan Call Centre':
        return lang === 'te' ? '📞 కిసాన్ కాల్ సెంటర్ (టోల్ ఫ్రీ)' : (lang === 'hi' ? '📞 किसान कॉल सेंटर (टोल-फ्री)' : '📞 Kisan Call Centre (Toll-Free)');
      case 'Agriculture / Horticulture Assistant':
        return lang === 'te' ? '🌾 వ్యవసాయ / ఉద్యానవన సహాయకుడు' : (lang === 'hi' ? '🌾 कृषि / उद्यान सहायक' : '🌾 Agriculture / Horticulture Assistant');
      case 'Village Surveyor':
        return lang === 'te' ? '📐 గ్రామ సర్వేయర్ (భూమి సర్వే)' : (lang === 'hi' ? '📐 ग्राम सर्वेक्षक (भूमि सर्वेक्षण)' : '📐 Village Surveyor (Land Survey)');
      case 'Agriculture Officer':
        return lang === 'te' ? '👔 మండల వ్యవసాయ అధికారి (AO)' : (lang === 'hi' ? '👔 कृषि अधिकारी (AO)' : '👔 Agriculture Officer (AO)');
      case 'VRO (Village Revenue Officer)':
        return lang === 'te' ? '📜 గ్రామ రెవెన్యూ అధికారి (VRO)' : (lang === 'hi' ? '📜 ग्राम राजस्व अधिकारी (VRO)' : '📜 VRO (Village Revenue Officer)');
      case 'MRI (Mandal Revenue Inspector)':
        return lang === 'te' ? '🏛️ మండల రెవెన్యూ ఇన్స్పెక్టర్ (MRI)' : (lang === 'hi' ? '🏛️ मंडल राजस्व निरीक्षक (MRI)' : '🏛️ MRI (Mandal Revenue Inspector)');
      default:
        return catKey;
    }
  };

  const categories = [
    { id: 'ALL', label: lang === 'te' ? 'అన్ని అధికారులు' : (lang === 'hi' ? 'सभी अधिकारी' : 'All Contacts') },
    { id: 'Kisan Call Centre', label: lang === 'te' ? 'కిసాన్ కాల్ సెంటర్' : 'Kisan Call Centre' },
    { id: 'Agriculture / Horticulture Assistant', label: lang === 'te' ? 'వ్యవసాయ సహాయకుడు' : 'Agri Assistant' },
    { id: 'Village Surveyor', label: lang === 'te' ? 'గ్రామ సర్వేయర్' : 'Village Surveyor' },
    { id: 'Agriculture Officer', label: lang === 'te' ? 'వ్యవసాయ అధికారి' : 'Agri Officer' },
    { id: 'VRO (Village Revenue Officer)', label: lang === 'te' ? 'VRO రెవెన్యూ' : 'VRO Revenue' },
    { id: 'MRI (Mandal Revenue Inspector)', label: lang === 'te' ? 'MRI ఇన్స్పెక్టర్' : 'MRI Inspector' }
  ];

  const filteredContacts = contacts.filter(c => 
    selectedCategory === 'ALL' ? true : c.category === selectedCategory
  );

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📞</span>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C3333]">
            {lang === 'te' ? 'రైతు సహాయం & ముఖ్యమైన ప్రభుత్వ అధికారులు' : (lang === 'hi' ? 'किसान सहायता एवं महत्वपूर्ण सरकारी संपर्क' : 'Farmer Support & Important Government Contacts')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-3xl">
          {lang === 'te'
            ? 'పంట తెగుళ్లు, విత్తనాలు, భూమి సర్వే మరియు సబ్సిడీల కోసం స్థానిక ప్రభుత్వ అధికారులను నేరుగా సంప్రదించండి.'
            : 'Directly call your local Village Agriculture Assistant, Surveyor, Agriculture Officer, VRO, MRI & Kisan Call Centre for immediate assistance.'}
        </p>

        {/* Location Badge */}
        <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#2D6A4F]">
          <MapPin className="w-4 h-4 text-[#2D6A4F]" />
          <span>
            {lang === 'te' ? 'మీ ప్రాంతం:' : 'Your Location:'} <span className="font-extrabold text-[#2C3333]">{farmerProfile.village || 'Mangalagiri'}, {farmerProfile.mandal || 'Mangalagiri'}, {farmerProfile.district || 'Guntur'}, {farmerProfile.state || 'Andhra Pradesh'}</span>
          </span>
        </div>
      </div>

      {/* PROMINENT KISAN CALL CENTRE PRIORITY CARD (1800-180-1551) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#2D6A4F] to-[#1B4332] text-white space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase bg-emerald-400 text-slate-950 shadow-sm">
              🇮🇳 National Toll-Free Farmers Helpline (24/7)
            </span>

            <h3 className="text-2xl sm:text-4xl font-black tracking-tight text-white mt-1">
              Kisan Call Centre – 1800-180-1551
            </h3>

            <p className="text-xs sm:text-sm text-emerald-100 font-semibold max-w-2xl leading-relaxed">
              {lang === 'te'
                ? 'భారత ప్రభుత్వ ఉచిత జాతీయ రైతు హెల్ప్‌లైన్. పంటల రోగాలు, వాతావరణ హెచ్చరికలు, విత్తనాలు మరియు ఎరువుల సందేహాలపై 24/7 నిపుణుల సలహాలు పొందండి.'
                : 'Govt of India Toll-Free helpline. Connect instantly with agricultural experts for crop diseases, weather, seeds, fertilizers & mandi advice in your native language.'}
            </p>
          </div>

          <a
            href="tel:18001801551"
            className="min-h-[52px] px-8 py-4 rounded-full bg-white hover:bg-emerald-50 text-[#2D6A4F] font-black text-sm sm:text-base inline-flex items-center justify-center gap-2.5 shadow-lg transition-all hover:scale-105 shrink-0"
          >
            <PhoneCall className="w-5 h-5 text-[#2D6A4F] animate-bounce" />
            <span>{lang === 'te' ? '📞 ఇప్పుడే కాల్ చేయండి (1800-180-1551)' : '📞 Call Now (1800-180-1551)'}</span>
          </a>
        </div>
      </div>

      {/* Category Selection Bar */}
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

      {/* Local Government Officer Contact Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
          <Building className="w-4 h-4 text-[#2D6A4F]" />
          <span>{lang === 'te' ? 'స్థానిక ప్రభుత్వ అధికారుల వివరాలు' : 'Verified Local Government Officers'}</span>
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContacts.map((c) => {
            const isKisan = c.category === 'Kisan Call Centre' || c.contact_id === 'kisan_helpline';
            const servicesStr = resolveServicesText(c.services);
            const phoneNumber = c.phone_display || c.phone || '18001801551';
            const telLink = `tel:${c.phone ? c.phone.replace(/[^0-9]/g, '') : '18001801551'}`;

            return (
              <div
                key={c.contact_id}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 space-y-4 shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all group"
              >
                <div className="space-y-3">
                  
                  {/* Category Pill & Verified Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {getCategoryDisplayName(c.category)}
                    </span>

                    {c.is_verified && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verified Govt Official</span>
                      </span>
                    )}
                  </div>

                  {/* Officer Designation & Name */}
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-[#2C3333] group-hover:text-[#2D6A4F] transition-colors">
                      👤 {c.officer_name}
                    </h4>
                    <p className="text-xs text-slate-500 font-bold mt-0.5">
                      🏢 {c.department}
                    </p>
                  </div>

                  {/* Location Area */}
                  <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <MapPin className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0" />
                    <span>📍 {c.village || 'Mangalagiri'}, {c.mandal || 'Mangalagiri'}, {c.district || 'Guntur'}, {c.state || 'Andhra Pradesh'}</span>
                  </div>

                  {/* Services Provided */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-xs font-semibold text-slate-700 space-y-1">
                    <div className="text-[11px] font-bold text-[#2D6A4F] uppercase">
                      💡 {lang === 'te' ? 'అందించే ఉచిత సేవలు:' : (lang === 'hi' ? 'उपलब्ध सहायता:' : 'Help Provided / Services:')}
                    </div>
                    <p className="text-slate-800 leading-relaxed font-bold">
                      {servicesStr}
                    </p>
                  </div>

                </div>

                {/* Prominent 1-Tap Call Button */}
                <a
                  href={telLink}
                  className="min-h-[52px] w-full mt-4 py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md hover:scale-[1.01]"
                >
                  <PhoneCall className="w-4 h-4 text-white animate-pulse" />
                  <span>{lang === 'te' ? `📞 ఇప్పుడే కాల్ చేయండి (${phoneNumber})` : (lang === 'hi' ? `📞 अभी कॉल करें (${phoneNumber})` : `📞 Call Now (${phoneNumber})`)}</span>
                </a>

              </div>
            );
          })}
        </div>
      </div>

      {/* Fallback Notice for Unlisted Categories */}
      <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2 shadow-sm">
        <div className="flex items-center gap-2 text-amber-800">
          <HelpCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <h4 className="text-sm font-bold">
            {lang === 'te' ? 'మీ ప్రాంతపు అధికారి వివరాలు లభించలేదా?' : 'Need Help Finding Your Officer?'}
          </h4>
        </div>
        <p className="text-xs text-amber-900 font-semibold leading-relaxed">
          {lang === 'te'
            ? 'మీ గ్రామానికి చెందిన ప్రత్యేకాధికారి నంబర్ జాబితాలో లేకపోతే, జాతీయ కిసాన్ కాల్ సెంటర్ ఉచిత నంబర్ 1800-180-1551 కి కాల్ చేసి తక్షణ సహాయం పొందవచ్చు.'
            : 'If your specific village officer contact is unlisted, please call the Kisan Call Centre Toll-Free line 1800-180-1551 or request your local admin to add the officer details.'}
        </p>
      </div>

    </div>
  );
}
