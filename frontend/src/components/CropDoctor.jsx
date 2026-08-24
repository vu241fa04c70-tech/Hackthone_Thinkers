import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, ShieldCheck, Volume2, PhoneCall, CheckCircle, RefreshCw, X, AlertCircle, History, Activity, Sparkles, RotateCcw, Sprout, Tag, ArrowRight } from 'lucide-react';
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
  
  // Crop Selector (AUTO / Chilli / Rice / Tomato / Cotton / Potato / Maize)
  const [selectedCropHint, setSelectedCropHint] = useState('AUTO');

  const fetchHistory = () => {
    fetch('/api/scans/history')
      .then(res => res.json())
      .then(data => setScanHistory(data || []))
      .catch(() => {});
  };

  const runAnalysis = async (sampleKey, file) => {
    setIsAnalyzing(true);
    setErrorMsg(null);
    const formData = new FormData();
    formData.append('language', lang);

    if (selectedCropHint !== 'AUTO') {
      formData.append('crop_hint', selectedCropHint);
    } else {
      formData.append('crop_hint', '');
    }

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

      if (!res.ok) throw new Error('Analysis failed');

      const data = await res.json();
      setReport(data);
      if (onDiagnosisComplete) onDiagnosisComplete(data);
      fetchHistory();
    } catch (err) {
      setErrorMsg('Failed to run crop vision diagnosis. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    fetch('/api/scans/samples')
      .then(res => res.json())
      .then(data => setSamples(data || []))
      .catch(() => {});
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setSelectedSample(null);
      setImagePreview(URL.createObjectURL(file));
      setReport(null);
    }
  };

  const handleSampleClick = (sample) => {
    setSelectedSample(sample.key);
    setUploadedFile(null);
    setImagePreview(sample.url);
    setReport(null);
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    if (!report) return;

    const speechText = lang === 'te'
      ? `నమస్కారం! గుర్తించిన పంట: ${report.crop_name}. భాగం: ${report.plant_part_detected}. వ్యాధి: ${report.disease_name}. నివారణ చికిత్స: ${report.immediate_treatment}`
      : `Crop detected: ${report.crop_name}. Plant Part: ${report.plant_part_detected}. Disease: ${report.disease_name}. Recommended treatment: ${report.immediate_treatment}`;

    setIsPlayingAudio(true);
    speakText(
      speechText,
      lang,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const getSeverityBadge = (severity) => {
    switch (severity?.toUpperCase()) {
      case 'HIGH':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-300 border border-rose-500/40">🔴 HIGH SEVERITY</span>;
      case 'MEDIUM':
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">🟡 MEDIUM SEVERITY</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🟢 LOW SEVERITY</span>;
    }
  };

  return (
    <div className="space-y-8 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📷</span>
          <h2 className="text-xl sm:text-2xl font-black text-emerald-400">
            {t('cropDoctor.title') || 'Agricultural Vision AI Lens'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 font-bold max-w-3xl">
          {t('cropDoctor.subtitle') || 'Upload photo of leaf, fruit, stem, flower or plant to diagnose crop disease & receive chemical dosages.'}
        </p>
      </div>

      {/* Main Grid: Upload & Crop Hint Selector vs Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Photo Upload Dropzone */}
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Optional Crop Type Hint Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-300 flex items-center gap-1.5">
                <Tag className="w-4 h-4 text-emerald-400" />
                <span>Crop Type Hint (Auto-Detected if blank):</span>
              </label>
              <select
                value={selectedCropHint}
                onChange={(e) => setSelectedCropHint(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="AUTO">✨ Auto Detect Crop & Plant Part</option>
                <option value="Tomato">Tomato (టమాటా)</option>
                <option value="Chilli">Chilli / Mirchi (మిరప)</option>
                <option value="Paddy">Paddy / Rice (వరి)</option>
                <option value="Cotton">Cotton (పత్తి)</option>
                <option value="Potato">Potato (బంగాళాదుంప)</option>
                <option value="Maize">Maize (మొక్కజొన్న)</option>
              </select>
            </div>

            {/* Dropzone Upload Box */}
            <div className="relative border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 bg-slate-950/80 rounded-3xl p-6 sm:p-8 text-center space-y-4 transition-all group cursor-pointer overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
              />

              {imagePreview ? (
                <div className="relative z-10 max-h-64 overflow-hidden rounded-2xl border border-slate-700">
                  <img src={imagePreview} alt="Crop Preview" className="w-full h-auto object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setImagePreview(null);
                      setUploadedFile(null);
                      setSelectedSample(null);
                      setReport(null);
                    }}
                    className="absolute top-2 right-2 p-2 rounded-xl bg-slate-950/80 text-slate-300 hover:text-rose-400 z-30 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3 relative z-10 py-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-100">
                      {t('cropDoctor.takePhoto') || 'Take Photo or Upload Image'}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">
                      Supports leaf, fruit, stem, flower or whole plant photos
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Demo Sample Photos */}
            {samples.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase text-slate-400 tracking-wider">
                  💡 Try Sample Crop Photos:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {samples.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => handleSampleClick(s)}
                      className={`p-1.5 rounded-2xl border text-center transition-all cursor-pointer ${
                        selectedSample === s.key
                          ? 'border-emerald-500 bg-emerald-500/20'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                      }`}
                    >
                      <img src={s.url} alt={s.label} className="w-full h-16 object-cover rounded-xl" />
                      <div className="text-[10px] font-black text-slate-300 mt-1 truncate">{s.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Submit Button (Touch Target >= 48px) */}
          <button
            onClick={() => runAnalysis(selectedSample, uploadedFile)}
            disabled={isAnalyzing || (!imagePreview && !selectedSample)}
            className="min-h-[52px] w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing Image (Stage 1 & Stage 2 AI)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>{t('cropDoctor.checkDiseaseBtn') || 'Diagnose Crop Disease ➔'}</span>
              </>
            )}
          </button>

        </div>

        {/* Right Column: Diagnostic Results Report */}
        <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl flex flex-col justify-between">
          
          {report ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Report Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-emerald-400 font-extrabold uppercase tracking-wider">
                    Confidence: {report.confidence_score}%
                  </div>
                  <h3 className="text-2xl font-black text-slate-100 mt-1">
                    {report.disease_name}
                  </h3>
                </div>

                <div className="text-right">
                  {getSeverityBadge(report.severity)}
                </div>
              </div>

              {/* Identified Crop & Plant Part Badge */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] font-black text-slate-400 uppercase">Crop Identified</div>
                  <div className="text-sm font-black text-emerald-400 mt-0.5">🌾 {report.crop_name}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="text-[11px] font-black text-slate-400 uppercase">Plant Part</div>
                  <div className="text-sm font-black text-cyan-400 mt-0.5">🍃 {report.plant_part_detected}</div>
                </div>
              </div>

              {/* Chemical Treatment & Dosage Cards */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-black text-emerald-400 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Immediate Chemical Treatment & Dosage</span>
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-200 leading-relaxed">
                  {report.immediate_treatment}
                </p>
                <div className="text-xs text-amber-400 font-black pt-1">
                  💊 Dosage: {report.chemical_dosage}
                </div>
              </div>

              {/* Observed Symptoms */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-black text-slate-300 uppercase">Observed Symptoms:</div>
                <p className="text-xs text-slate-300 font-bold leading-relaxed">
                  {report.observed_symptoms}
                </p>
              </div>

              {/* Audio Listen Button */}
              <button
                onClick={toggleAudio}
                className="min-h-[48px] w-full py-3 rounded-2xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 font-black text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>{isPlayingAudio ? 'Stop Audio ⏹️' : '🔊 Listen Voice Diagnosis'}</span>
              </button>

            </div>
          ) : (
            <div className="my-auto text-center space-y-3 py-12">
              <div className="w-16 h-16 rounded-2xl bg-slate-950 text-slate-500 border border-slate-800 flex items-center justify-center mx-auto text-2xl font-black">
                🩺
              </div>
              <h4 className="text-base font-black text-slate-300">Ready for Crop Inspection</h4>
              <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto">
                Upload a photo or choose a sample image to see detailed AI disease diagnosis.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* History Log */}
      {scanHistory.length > 0 && (
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Scan History Log ({scanHistory.length})</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scanHistory.slice(0, 6).map((h, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-xs font-black text-emerald-400">🌾 {h.crop_name} • {h.plant_part}</div>
                <div className="text-xs font-bold text-slate-200">{h.disease_name}</div>
                <div className="text-[10px] text-slate-400 font-bold">{h.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
