import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, ShieldCheck, DollarSign, Activity, Volume2, PhoneCall, CheckCircle, RefreshCw, X, AlertCircle } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function CropDoctor({ activeField, onDiagnosisComplete }) {
  const { lang, t } = useLanguage();
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [report, setReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const getFarmerCrop = () => {
    if (activeField && activeField.crop_type) return activeField.crop_type;
    const saved = localStorage.getItem('kisan_farmer_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.main_crop) return parsed.main_crop;
      } catch (e) {}
    }
    return 'Paddy';
  };

  useEffect(() => {
    fetch(`/api/samples?language=${lang}`)
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(() => {});
    
    // Initial demo load
    runAnalysis('sample_tomato_early_blight', null);
  }, [lang]);

  const runAnalysis = async (sampleKey, file) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    const formData = new FormData();
    formData.append('language', lang);
    formData.append('crop_hint', getFarmerCrop());

    if (file) {
      formData.append('file', file);
    } else if (sampleKey) {
      formData.append('sample_key', sampleKey);
    }

    try {
      const res = await fetch('/api/agents/crop-vision', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        throw new Error('API analysis failed');
      }

      const data = await res.json();
      setReport(data);
      if (onDiagnosisComplete) onDiagnosisComplete(data);
    } catch (err) {
      const fallbackErr = lang === 'te'
        ? 'క్షమించండి. చిత్రాన్ని విశ్లేషించలేకపోయాము. దయచేసి స్పష్టమైన ఆకు ఫోటోను మళ్లీ అప్‌లోడ్ చేయండి.'
        : (lang === 'hi' ? 'क्षमा करें, चित्र का विश्लेषण नहीं हो सका। कृपया साफ़ फ़ोटो पुनः अपलोड करें।' : "Sorry, we couldn't analyze this image. Please upload a clearer leaf photo.");
      setErrorMsg(fallbackErr);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSampleClick = (sampleKey) => {
    setSelectedSample(sampleKey);
    setUploadedFile(null);
    setImagePreview(null);
    runAnalysis(sampleKey, null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 10MB.');
      return;
    }

    setUploadedFile(file);
    setSelectedSample(null);
    const objectUrl = URL.createObjectURL(file);
    setImagePreview(objectUrl);
    runAnalysis(null, file);
  };

  const handleClearUpload = () => {
    setUploadedFile(null);
    setImagePreview(null);
    setSelectedSample('sample_tomato_early_blight');
    runAnalysis('sample_tomato_early_blight', null);
  };

  const toggleAudio = (textToSpeak) => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      lang,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const getAudioScript = () => {
    if (!report) return '';
    if (report.is_low_confidence) {
      return report.user_message || 'Please upload a clear leaf photo.';
    }
    return `${report.crop_detected} - ${report.disease_name}. ${report.symptoms ? report.symptoms.join('. ') : ''}. ${report.preventive_actions ? report.preventive_actions.join('. ') : ''}. ${report.dosage_note || ''}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Photo Upload Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            📷 {t('cropDoctor.title')}
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {t('cropDoctor.subtitle')}
          </p>
        </div>

        <label className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20 self-start sm:self-center hover:scale-105">
          <Upload className="w-4 h-4" />
          <span>{t('cropDoctor.uploadPhoto')}</span>
          <input 
            type="file" 
            accept="image/jpeg,image/jpg,image/png,image/webp" 
            capture="environment" 
            onChange={handleFileUpload} 
            className="hidden" 
          />
        </label>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-black flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg(null)} className="p-1 hover:bg-rose-900 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Upload Preview & Demo Samples */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Active Upload Preview Card */}
          {imagePreview && (
            <div className="bg-slate-900/90 p-4 rounded-3xl border-2 border-emerald-500/60 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t('cropDoctor.uploadPhoto')}
                </span>
                <button
                  onClick={handleClearUpload}
                  className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-400 cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
                <img src={imagePreview} alt="Uploaded leaf" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Demo Sample Cards */}
          <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              {t('cropDoctor.demoSamples')}
            </h3>
            <div className="grid grid-cols-1 gap-2.5">
              {samples.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSampleClick(s.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    selectedSample === s.id && !imagePreview
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-black'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300 font-bold'
                  }`}
                >
                  <div>
                    <div className="text-xs font-black">{s.disease_name}</div>
                    <div className="text-[11px] text-slate-400 font-bold mt-0.5">Demo • {s.crop}</div>
                  </div>
                  <span className="text-xs font-black text-emerald-400">{(s.confidence * 100).toFixed(0)}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Diagnostic Result Card */}
        <div className="lg:col-span-2">
          {isAnalyzing ? (
            <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-200">
                {t('cropDoctor.analyzing')}
              </p>
            </div>
          ) : report ? (
            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              
              {/* Main Diagnostic Header */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between gap-3 ${
                report.is_low_confidence
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : (report.severity_level === 'Low'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300')
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{report.is_low_confidence ? '⚠️' : (report.severity_level === 'Low' ? '🟢' : '🔴')}</span>
                  <div>
                    <div className="text-xs font-black text-slate-300">
                      {t('cropDoctor.statusTitle')}
                    </div>
                    <h3 className="text-lg font-black">{report.disease_name}</h3>
                    <div className="text-xs font-extrabold mt-0.5 text-slate-400">
                      Confidence: <span className="text-emerald-400">{(report.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* 🔊 Listen Button */}
                <button
                  onClick={() => toggleAudio(getAudioScript())}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all ${
                    isPlayingAudio
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:text-emerald-400'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>{isPlayingAudio ? t('cropDoctor.pauseAudio') : t('cropDoctor.listenAudio')}</span>
                </button>
              </div>

              {/* Low Confidence Safety Warning */}
              {report.is_low_confidence && (
                <div className="p-4 rounded-2xl bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs font-bold space-y-2">
                  <p className="font-black text-amber-300">{report.user_message}</p>
                </div>
              )}

              {/* Observed Symptoms */}
              {report.symptoms && report.symptoms.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-black text-slate-300">
                    {t('cropDoctor.observedSymptoms')}:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-200 font-bold list-disc list-inside">
                    {report.symptoms.map((sym, idx) => (
                      <li key={idx}>{sym}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What To Do Today */}
              {report.preventive_actions && report.preventive_actions.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    {t('cropDoctor.doThisToday')}
                  </h4>
                  <div className="space-y-2">
                    {report.preventive_actions.map((act, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-bold text-slate-200">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What To Avoid */}
              {report.what_to_avoid && report.what_to_avoid.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-black text-rose-400">
                    {t('cropDoctor.whatToAvoid')}:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300 font-bold list-disc list-inside">
                    {report.what_to_avoid.map((avd, idx) => (
                      <li key={idx}>{avd}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price & Expert Call */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <div>
                  <div className="text-xs text-slate-400 font-bold">
                    {t('cropDoctor.cost')}
                  </div>
                  <div className="text-2xl font-black text-emerald-400">
                    {report.pesticide ? `~₹${report.pesticide.estimated_cost_inr}` : '—'}
                  </div>
                  <div className="text-[10px] text-teal-300 font-extrabold mt-0.5">
                    {report.dosage_note}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("KVK Helpline: 1800-180-1551")}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-black flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" /> 
                    {t('cropDoctor.contactExpert')}
                  </button>
                </div>
              </div>

            </div>
          ) : null}
        </div>

      </div>
    </div>
  );
}
