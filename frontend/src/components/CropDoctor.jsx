import React, { useState, useEffect } from 'react';
import { Camera, Upload, AlertTriangle, ShieldCheck, DollarSign, Activity, Volume2, PhoneCall, CheckCircle, RefreshCw } from 'lucide-react';

export default function CropDoctor({ activeField, onDiagnosisComplete }) {
  const [samples, setSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState('sample_tomato_early_blight');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [report, setReport] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    fetch('/api/samples')
      .then(res => res.json())
      .then(data => setSamples(data))
      .catch(() => {});
    
    runAnalysis('sample_tomato_early_blight', null);
  }, []);

  const runAnalysis = async (sampleKey, file) => {
    setIsAnalyzing(true);
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
      formData.append('crop_hint', activeField?.crop_type || 'Tomato');
    } else if (sampleKey) {
      formData.append('sample_key', sampleKey);
    }

    try {
      const res = await fetch('/api/agents/crop-vision', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setReport(data);
      if (onDiagnosisComplete) onDiagnosisComplete(data);
    } catch (err) {
      console.error(err);
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
    if (file) {
      setUploadedFile(file);
      setSelectedSample(null);
      setImagePreview(URL.createObjectURL(file));
      runAnalysis(null, file);
    }
  };

  const playAudio = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      if (isPlayingAudio) {
        setIsPlayingAudio(false);
        return;
      }
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      u.onend = () => setIsPlayingAudio(false);
      u.onerror = () => setIsPlayingAudio(false);
      setIsPlayingAudio(true);
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            📷 "Scan & Know" Crop Doctor
          </h2>
          <p className="text-xs text-slate-400">Take leaf photo or choose a sample picture to see diagnosis & solution</p>
        </div>

        <label className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20 self-start sm:self-center">
          <Upload className="w-4 h-4" />
          Take Photo of Leaf
          <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sample Gallery */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-slate-900/60 p-5 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Choose Sample Leaf Photo</h3>
            <div className="grid grid-cols-1 gap-2.5">
              {samples.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSampleClick(s.id)}
                  className={`p-3 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    selectedSample === s.id
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{s.name}</div>
                    <div className="text-[11px] text-amber-400 mt-0.5">{s.disease_name}</div>
                  </div>
                  <span className="text-xs font-black text-emerald-400">{(s.confidence * 100).toFixed(0)}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diagnostic Result Card */}
        <div className="lg:col-span-2">
          {isAnalyzing ? (
            <div className="bg-slate-900/60 p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-200">Analyzing leaf photo...</p>
            </div>
          ) : report ? (
            <div className="bg-slate-900/90 p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
              
              {/* Red/Green Main Alert Header */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between ${
                report.severity_level === 'Low'
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{report.severity_level === 'Low' ? '🟢' : '🔴'}</span>
                  <div>
                    <div className="text-xs font-extrabold uppercase tracking-wider">Crop Health Status</div>
                    <h3 className="text-lg font-black">{report.disease_name}</h3>
                  </div>
                </div>

                <button
                  onClick={() => playAudio(`Your ${activeField?.crop_type || 'tomato'} crop has ${report.disease_name}. Spray ${report.pesticide.name}. Mix 2 spoons per 1 liter water. Cost is around ${report.pesticide.estimated_cost_inr} rupees.`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-extrabold text-slate-200 hover:text-emerald-400 flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-emerald-400" /> Listen Audio
                </button>
              </div>

              {/* Do This TODAY Box */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider">Do This TODAY:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <CheckCircle className="w-4 h-4" /> Spray: {report.pesticide.name}
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Dosage: 2 spoons per 1 liter water ({report.pesticide.dosage_per_acre})
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Timing: Spray in late evening (avoid hot sun)
                  </div>
                </div>
              </div>

              {/* Price & Expert Call */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
                <div>
                  <div className="text-xs text-slate-400">Estimated Cost per Acre</div>
                  <div className="text-2xl font-black text-emerald-400">~₹{report.pesticide.estimated_cost_inr}</div>
                  <div className="text-[10px] text-teal-300 font-semibold mt-0.5">Available in nearby APMC market</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => alert("Calling Agricultural Expert KVK Helpline: 1800-180-1551")}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" /> Call Expert Helpline
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
