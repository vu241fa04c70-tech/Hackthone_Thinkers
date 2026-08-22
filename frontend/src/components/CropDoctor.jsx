import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, ShieldCheck, Volume2, PhoneCall, CheckCircle, RefreshCw, X, AlertCircle, History, Activity, Sparkles, RotateCcw } from 'lucide-react';
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
  const [scanHistory, setScanHistory] = useState([]);

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

  const fetchHistory = () => {
    fetch('/api/scans/history')
      .then(res => res.json())
      .then(data => setScanHistory(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    fetch(`/api/samples?language=${lang}`)
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(() => {});

    fetchHistory();
    
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
      fetchHistory();
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
    if (report.is_low_confidence || report.is_below_threshold) {
      return report.quality_warning || report.user_message || 'Please upload a clear leaf photo.';
    }
    const symptomsStr = report.symptoms ? report.symptoms.join('. ') : '';
    const treatmentStr = report.immediate_treatment ? report.immediate_treatment.join('. ') : '';
    return `${report.crop_detected} - ${report.disease_name}. ${symptomsStr}. ${treatmentStr}. ${report.dosage_note || ''}`;
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header & Camera / Gallery Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            📷 {t('cropDoctor.title')}
            <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-extrabold">
              224×224 PlantVillage AI
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-0.5">
            {t('cropDoctor.subtitle')}
          </p>
        </div>

        {/* Camera / Gallery Dual Input */}
        <div className="flex items-center gap-2">
          {/* Camera Capture */}
          <label className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20 hover:scale-105">
            <Camera className="w-4 h-4" />
            <span>{t('cropDoctor.takePhoto')}</span>
            <input 
              type="file" 
              accept="image/*" 
              capture="environment" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>

          {/* Gallery Upload */}
          <label className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 font-black text-xs flex items-center gap-2 cursor-pointer transition-all hover:scale-105">
            <Upload className="w-4 h-4 text-emerald-400" />
            <span>{t('cropDoctor.uploadPhoto')}</span>
            <input 
              type="file" 
              accept="image/jpeg,image/jpg,image/png,image/webp" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </label>
        </div>
      </div>

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-300 text-xs font-black flex items-center justify-between gap-3 shadow-lg">
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
            <div className="bg-slate-900/90 p-4 rounded-3xl border-2 border-emerald-500/60 space-y-4 shadow-xl">
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

              {/* 🔍 Check Disease Action Button */}
              <button
                type="button"
                onClick={() => runAnalysis(null, uploadedFile)}
                disabled={isAnalyzing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/30 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t('cropDoctor.analyzing')}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t('cropDoctor.checkDiseaseBtn')}</span>
                  </>
                )}
              </button>
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
            <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center space-y-4 shadow-xl">
              <RefreshCw className="w-10 h-10 text-emerald-400 animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-base font-black text-slate-100">
                  {t('cropDoctor.analyzing')}
                </p>
                <p className="text-xs text-slate-400 font-bold">
                  224×224 Normalization & EXIF Correction...
                </p>
              </div>
            </div>
          ) : report ? (
            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              
              {/* Quality Alert or <70% Confidence Threshold Retake Prompt */}
              {report.is_below_threshold && (
                <div className="p-5 rounded-2xl bg-amber-950/80 border-2 border-amber-500/60 space-y-3 text-amber-200">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />
                    <div>
                      <h4 className="text-sm font-black text-amber-300">
                        {lang === 'te' ? '⚠️ ఫోటో స్పష్టత లేదా నమ్మకం తక్కువగా ఉంది' : '⚠️ Low Confidence / Image Quality Warning'}
                      </h4>
                      <p className="text-xs font-bold mt-0.5 text-amber-200">
                        {report.quality_warning || report.user_message}
                      </p>
                    </div>
                  </div>

                  <label className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg">
                    <RotateCcw className="w-4 h-4" />
                    <span>{t('cropDoctor.retakeBtn')}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      capture="environment" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
              )}

              {/* Main Diagnostic Header */}
              <div className={`p-5 rounded-2xl border flex items-center justify-between gap-3 ${
                report.is_below_threshold
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                  : (report.health_status === 'Healthy'
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-300')
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{report.health_status === 'Healthy' ? '🟢' : '🔴'}</span>
                  <div>
                    <div className="text-xs font-black text-slate-300 flex items-center gap-2">
                      <span>{t('cropDoctor.statusTitle')}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                        report.health_status === 'Healthy' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                      }`}>
                        {report.health_status}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-black">{report.disease_name}</h3>
                    <div className="text-xs font-extrabold mt-0.5 text-slate-400">
                      Confidence: <span className="text-emerald-400">{(report.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>

                {/* 🔊 Listen Voice Diagnosis Button */}
                <button
                  onClick={() => toggleAudio(getAudioScript())}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-black flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                    isPlayingAudio
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:text-emerald-400'
                  }`}
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span>{isPlayingAudio ? t('cropDoctor.pauseAudio') : t('cropDoctor.listenAudio')}</span>
                </button>
              </div>

              {/* 📊 Top 3 Predictions Breakdown */}
              {report.top_3_predictions && report.top_3_predictions.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-teal-400 uppercase tracking-wider">
                    {t('cropDoctor.top3Predictions')}
                  </h4>
                  <div className="space-y-2">
                    {report.top_3_predictions.map((p, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-slate-200">{idx + 1}. {p.disease_name}</span>
                          <span className="text-emerald-400 font-black">{p.confidence_pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full transition-all duration-500 ${
                              idx === 0 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-slate-700'
                            }`}
                            style={{ width: `${Math.min(100, p.confidence_pct)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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

              {/* Disease Cause */}
              {report.cause && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <h4 className="text-xs font-black text-amber-400">
                    {t('cropDoctor.diseaseCause')}:
                  </h4>
                  <p className="text-xs text-slate-300 font-bold">
                    {report.cause}
                  </p>
                </div>
              )}

              {/* Immediate Treatment Actions */}
              {report.immediate_treatment && report.immediate_treatment.length > 0 && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider">
                    {t('cropDoctor.immediateTreatment')}
                  </h4>
                  <div className="space-y-2">
                    {report.immediate_treatment.map((act, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs font-bold text-slate-200">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prevention & Safety Tips */}
              {report.prevention_tips && report.prevention_tips.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-black text-teal-300">
                    {t('cropDoctor.preventionTips')}:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-300 font-bold list-disc list-inside">
                    {report.prevention_tips.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
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

      {/* 📜 Persistent Scan History Section */}
      <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-400" />
          <span>{t('cropDoctor.scanHistoryTitle')}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {scanHistory.length > 0 ? (
            scanHistory.map((item, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">{item.scan_date}</span>
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {item.confidence_pct}% Confidence
                  </span>
                </div>
                <div className="text-sm font-black text-slate-100 flex items-center gap-2">
                  <span>🌾 {item.crop_name}</span> • <span>{item.disease_name}</span>
                </div>
                {item.immediate_treatment && item.immediate_treatment.length > 0 && (
                  <p className="text-xs text-slate-300 font-bold line-clamp-2">
                    💡 {item.immediate_treatment.join(' • ')}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-6 text-xs font-bold text-slate-500">
              No previous scan history recorded yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
