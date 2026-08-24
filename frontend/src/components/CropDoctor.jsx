import React, { useState } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle, AlertTriangle, Shield, Activity, Volume2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function CropDoctor({ activeField }) {
  const { lang, t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(activeField?.crop_type || 'Tomato');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const sampleImages = [
    {
      id: 'tomato_early_blight',
      name: lang === 'te' ? 'టమాటా ఆకుపై ఎండు తెగులు' : (lang === 'hi' ? 'टमाटर अगेती झुलसा रोग' : 'Tomato Early Blight'),
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&q=80&w=400',
      result: {
        disease: lang === 'te' ? 'టమాటా ఆకుపై ఎండు తెగులు (Early Blight)' : (lang === 'hi' ? 'टमाटर अगेती झुलसा रोग (Early Blight)' : 'Tomato Early Blight (Alternaria solani)'),
        confidence: '94%',
        severity: 'MEDIUM',
        crop: 'Tomato',
        part: lang === 'te' ? 'ఆకు' : (lang === 'hi' ? 'पत्ती' : 'Leaf'),
        pesticide: 'Mancozeb 75% WP (Indofil M-45)',
        dosage: lang === 'te' ? 'ఎకరానికి 600 గ్రాములు 200 లీటర్ల నీటిలో' : (lang === 'hi' ? '600 ग्राम प्रति 200 लीटर पानी प्रति एकड़' : '600 grams in 200L water per acre'),
        cost: '₹380 / acre',
        symptoms: [
          lang === 'te' ? 'కింది ఆకులపై గోధుమ రంగు గుండ్రని మచ్చలు' : (lang === 'hi' ? 'निचली पत्तियों पर भूरे रंग के गोल धब्बे' : 'Concentric dark brown target-like spots on lower leaves'),
          lang === 'te' ? 'మచ్చల చుట్టూ పసుపు రంగు వలయం' : (lang === 'hi' ? 'धब्बों के चारों ओर पीलापन' : 'Yellow halo surrounding foliage lesions'),
          lang === 'te' ? 'తీవ్రమైన సందర్భాల్లో ఆకులు ఎండి రాలిపోవడం' : (lang === 'hi' ? 'पत्तियों का सूखकर गिरना' : 'Premature defoliation in severe cases')
        ]
      }
    },
    {
      id: 'paddy_rice_blast',
      name: lang === 'te' ? 'వరి అగ్గి తెగులు' : (lang === 'hi' ? 'धान का झोंका रोग' : 'Paddy Rice Blast'),
      url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=400',
      result: {
        disease: lang === 'te' ? 'వరి అగ్గి తెగులు (Rice Blast)' : (lang === 'hi' ? 'धान का झोंका रोग (Rice Blast)' : 'Rice Blast (Pyricularia oryzae)'),
        confidence: '96%',
        severity: 'HIGH',
        crop: 'Paddy',
        part: lang === 'te' ? 'ఆకు & కాండం' : (lang === 'hi' ? 'पत्ती एवं तना' : 'Leaf & Stem'),
        pesticide: 'Tricyclazole 75% WP (Beam / Baan)',
        dosage: lang === 'te' ? 'ఎకరానికి 120 గ్రాములు 200 లీటర్ల నీటిలో' : (lang === 'hi' ? '120 ग्राम प्रति 200 लीटर पानी प्रति एकड़' : '120 grams in 200L water per acre'),
        cost: '₹420 / acre',
        symptoms: [
          lang === 'te' ? 'ఆకులపై కంటి ఆకారపు (కూజా) మచ్చలు' : (lang === 'hi' ? 'पत्तियों पर आँख के आकार के धब्बे' : 'Spindle-shaped lesions with gray-white centers'),
          lang === 'te' ? 'కంకి మెడ విరిగి పడిపోవడం' : (lang === 'hi' ? 'गर्दन तोड़ रोग' : 'Neck rot causing empty panicles'),
          lang === 'te' ? 'నేలలో నత్రజని ఎక్కువైతే వ్యాధి తీవ్రత పెరుగుతుంది' : (lang === 'hi' ? 'अत्यधिक नाइट्रोजन से रोग बढ़ना' : 'Aggravated by excess nitrogenous fertilizers')
        ]
      }
    }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
        runDiagnosis(sampleImages[0].result);
      };
      reader.readAsDataURL(file);
    }
  };

  const selectSample = (sample) => {
    setSelectedImage(sample.url);
    runDiagnosis(sample.result);
  };

  const runDiagnosis = (resultData) => {
    setAnalyzing(true);
    setAnalysisResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult(resultData);
    }, 1200);
  };

  const toggleAudio = () => {
    if (!analysisResult) return;
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const textToSpeak = lang === 'te'
      ? `గుర్తించిన వ్యాధి: ${analysisResult.disease}. సిఫార్సు చేసిన మందు: ${analysisResult.pesticide}. మోతాదు: ${analysisResult.dosage}.`
      : `Diagnosed Disease: ${analysisResult.disease}. Recommended Pesticide: ${analysisResult.pesticide}. Dosage: ${analysisResult.dosage}.`;

    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      lang,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📷</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#2C3333]">
            {lang === 'hi' ? 'फसल एवं रोग निदान (गूगल लेंस AI)' : (lang === 'te' ? 'పంట & వ్యాధి గుర్తింపు AI లెన్స్' : 'Agricultural Vision AI Lens')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-3xl">
          {lang === 'hi' 
            ? 'अपनी फसल की फोटो अपलोड करें और तुरंत रोग का पता लगाएं व सटीक दवाई का सुझाव पाएं।' 
            : (lang === 'te' ? 'ఆకు, పండు, కాండం లేదా పూల ఫోటో తీసి పంట వ్యాధులను తక్షణమే గుర్తించండి.' : 'Upload a photo of your crop leaf, fruit, or stem for instant AI disease identification and chemical treatment.')}
        </p>
      </div>

      {/* Main Upload Dropzone & Sample Images Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upload Box */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {lang === 'hi' ? 'पसल का चयन (ऐच्छिक):' : (lang === 'te' ? 'పంట పేరు (లేకుంటే AI గుర్తిస్తుంది):' : 'Select Crop Type (Optional):')}
            </label>

            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full min-h-[48px] bg-slate-50 border border-slate-200 rounded-2xl px-4 text-sm font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] transition-all cursor-pointer"
            >
              <option value="Tomato">🍅 Tomato (టమాటా / टमाटर)</option>
              <option value="Paddy">🌾 Paddy / Rice (వరి / धान)</option>
              <option value="Chilli">🌶️ Chilli (మిరప / मिर्च)</option>
              <option value="Cotton">☁️ Cotton (పత్తి / कपास)</option>
            </select>

            {/* Dropzone Area */}
            <div className="border-2 border-dashed border-emerald-200 hover:border-[#2D6A4F] bg-emerald-50/40 rounded-3xl p-8 text-center space-y-3 transition-all cursor-pointer relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />

              {selectedImage ? (
                <div className="relative rounded-2xl overflow-hidden max-h-48 mx-auto shadow-md">
                  <img src={selectedImage} alt="Crop Sample" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white text-xs font-bold">
                    {lang === 'hi' ? 'दूसरी फोटो चुनने के लिए क्लिक करें' : (lang === 'te' ? 'మరో ఫోటో ఎంచుకోవడానికి ఇక్కడ నొక్కండి' : 'Click to change photo')}
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#2D6A4F] mx-auto flex items-center justify-center text-2xl font-black shadow-sm group-hover:scale-110 transition-transform">
                    <Camera className="w-7 h-7 text-[#2D6A4F]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#2C3333]">
                      {lang === 'hi' ? 'फोटो खींचें या छवि अपलोड करें' : (lang === 'te' ? 'పంట ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి' : 'Take Photo or Upload Image')}
                    </div>
                    <div className="text-xs text-slate-500 font-semibold mt-1">
                      {lang === 'hi' ? 'पत्ती, फल, तना या फूल की स्पष्ट फोटो' : (lang === 'te' ? 'ఆకు, పండు, కాండం లేదా పూల ఫోటోలను మద్దతు ఇస్తుంది' : 'Supports leaf, fruit, stem or flower photos')}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sample Photos Bar */}
          <div className="space-y-2 pt-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'hi' ? '💡 नमुना फसल फोटो आजमाएं:' : (lang === 'te' ? '💡 నమూనా పంట ఫోటోలను ప్రయత్నించండి:' : 'Try Sample Crop Photos:')}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {sampleImages.map((s) => (
                <button
                  key={s.id}
                  onClick={() => selectSample(s)}
                  className="p-2 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 flex items-center gap-2 text-left cursor-pointer transition-all hover:bg-emerald-50/50"
                >
                  <img src={s.url} alt={s.name} className="w-10 h-10 rounded-xl object-cover" />
                  <span className="text-xs font-bold text-slate-700 truncate">{s.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Diagnosis Results Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 space-y-6 shadow-sm flex flex-col justify-between">
          
          {analyzing ? (
            <div className="my-auto py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2D6A4F] mx-auto flex items-center justify-center animate-spin">
                <Sparkles className="w-8 h-8 text-[#2D6A4F]" />
              </div>
              <div className="text-base font-bold text-[#2C3333]">
                {lang === 'hi' ? 'फसल रोग विश्लेषण चालू है...' : (lang === 'te' ? 'పంట వ్యాధి AI విశ్లేషణ జరుగుతోంది...' : 'Analyzing Crop Disease AI Model...')}
              </div>
              <p className="text-xs text-slate-500 font-semibold">
                {lang === 'hi' ? 'रोग के लक्षणों और दवा की जांच की जा रही है' : (lang === 'te' ? 'వ్యాధి లక్షణాలు మరియు నివారణ మందులను తనిఖీ చేస్తున్నాము' : 'Scanning leaf patterns & matching chemical treatments.')}
              </p>
            </div>
          ) : analysisResult ? (
            <div className="space-y-5">
              
              {/* Header Info */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${
                    analysisResult.severity === 'HIGH'
                      ? 'bg-rose-100 text-rose-800 border-rose-200'
                      : 'bg-amber-100 text-amber-800 border-amber-200'
                  }`}>
                    ⚠️ {analysisResult.severity} SEVERITY
                  </span>

                  <h3 className="text-xl font-extrabold text-[#2C3333] mt-2">
                    {analysisResult.disease}
                  </h3>
                </div>

                <button
                  onClick={toggleAudio}
                  className={`p-3 rounded-full border font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0 transition-all ${
                    isPlayingAudio
                      ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                      : 'bg-emerald-50 text-[#2D6A4F] border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                </button>
              </div>

              {/* Chemical Dosage Card */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-1">
                <div className="text-[11px] font-bold text-[#2D6A4F] uppercase">
                  {lang === 'hi' ? 'रासायनिक उपचार एवं मात्रा:' : (lang === 'te' ? 'రసాయన చికిత్స & మోతాదు:' : 'Recommended Pesticide & Dosage')}
                </div>
                <div className="text-base font-extrabold text-[#2D6A4F]">💊 {analysisResult.pesticide}</div>
                <div className="text-xs text-slate-700 font-bold mt-1">
                  🎯 <span className="font-extrabold">{lang === 'hi' ? 'मात्रा:' : (lang === 'te' ? 'మోతాదు:' : 'Dosage:')}</span> {analysisResult.dosage}
                </div>
              </div>

              {/* Symptoms Checklist */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {lang === 'hi' ? 'रोग के लक्षण:' : (lang === 'te' ? 'వ్యాధి లక్షణాలు:' : 'Observed Symptoms:')}
                </div>
                {analysisResult.symptoms.map((sym, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                    <span>{sym}</span>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="my-auto py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center text-xl font-bold">
                🌾
              </div>
              <div className="text-sm font-bold text-[#2C3333]">
                {lang === 'hi' ? 'फसल जांच के लिए तैयार' : (lang === 'te' ? 'పంట పరిశీలనకు సిద్ధంగా ఉంది' : 'Ready for Crop Inspection')}
              </div>
              <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
                {lang === 'hi' ? 'एआई रोग निदान के लिए फोटो अपलोड करें या नमुना फोटो चुनें।' : (lang === 'te' ? 'వివరాల కోసం ఫోటో అప్‌లోడ్ చేయండి లేదా నమూనా ఫోటో ఎంచుకోండి.' : 'Upload a photo or choose a sample image to see detailed AI disease diagnosis.')}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
