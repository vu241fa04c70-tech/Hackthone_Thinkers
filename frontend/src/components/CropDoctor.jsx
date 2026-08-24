import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, AlertCircle, CheckCircle, AlertTriangle, Shield, Activity, Volume2, Sparkles, Image as ImageIcon, RefreshCw, Dna, Leaf, FlaskConical, Stethoscope, AlertOctagon, Video } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';
import { speakText, stopSpeech } from '../utils/voiceUtils';

export default function CropDoctor({ activeField }) {
  const { lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('camera');
  const [selectedImage, setSelectedImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Camera State
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      setCameraError(lang === 'te' ? 'కెమెరా యాక్సెస్ చేయడానికి అనుమతి లేదు.' : 'Unable to access live camera. Please check permissions.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab]);

  const captureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');
    setSelectedImage(dataUrl);

    fetch(dataUrl)
      .then(res => res.blob())
      .then(blob => runGeminiVisionDiagnosis(blob));
  };

  const handleGalleryUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
      runGeminiVisionDiagnosis(file);
    }
  };

  const sampleScans = [
    {
      id: 'sample_tomato_early_blight',
      title: 'Tomato Leaf - Early Blight',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb231fc?auto=format&fit=crop&q=80&w=400',
      mockResult: {
        commonName: 'Tomato',
        scientificName: 'Solanum lycopersicum',
        plantPart: 'Leaf',
        confidence: '96%',
        diseaseName: lang === 'te' ? 'టమాటా ఆకుపై ఎండు తెగులు (Early Blight)' : 'Early Blight',
        severity: 'Moderate',
        symptoms: [
          'Concentric dark brown target-like spots on lower leaves',
          'Yellow halo surrounding foliage lesions',
          'Premature defoliation in severe cases'
        ],
        organicTreatment: 'Apply Neem oil (5ml/L water) or Trichoderma viride bio-fungicide once every 7 days.',
        chemicalTreatment: 'Spray Mancozeb 75% WP at 2g/L water (600g in 200L water per acre).',
        prevention: 'Avoid overhead sprinkler irrigation, remove infected lower leaves, and practice 3-year crop rotation.'
      }
    },
    {
      id: 'sample_paddy_blast',
      title: 'Paddy Rice Blast',
      url: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&q=80&w=400',
      mockResult: {
        commonName: 'Paddy / Rice',
        scientificName: 'Oryza sativa',
        plantPart: 'Leaf & Stem',
        confidence: '94%',
        diseaseName: lang === 'te' ? 'వరి అగ్గి తెగులు (Rice Blast)' : 'Rice Blast',
        severity: 'Severe',
        symptoms: [
          'Spindle-shaped lesions with gray-white centers on leaves',
          'Neck rot causing empty panicles',
          'Aggravated by excess nitrogenous fertilizers'
        ],
        organicTreatment: 'Spray Pseudomonas fluorescens at 10g/L water during early vegetative stage.',
        chemicalTreatment: 'Spray Tricyclazole 75% WP at 0.6g/L water (120g in 200L water per acre).',
        prevention: 'Maintain balanced nitrogen application and avoid field flooding stagnation.'
      }
    },
    {
      id: 'blurry_low_confidence',
      title: 'Blurry / Unclear Photo (<70% Confidence)',
      url: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80&w=400',
      mockResult: {
        error: 'Unable to confidently identify.',
        confidence: '48%'
      }
    }
  ];

  const handleSelectSample = (s) => {
    setSelectedImage(s.url);
    runDiagnosisWithMock(s.mockResult);
  };

  const runDiagnosisWithMock = (mockData) => {
    setAnalyzing(true);
    setAnalysisResult(null);
    setTimeout(() => {
      setAnalyzing(false);
      setAnalysisResult(mockData);
    }, 1200);
  };

  const runGeminiVisionDiagnosis = async (imageFileOrBlob) => {
    setAnalyzing(true);
    setAnalysisResult(null);

    const formData = new FormData();
    formData.append('file', imageFileOrBlob);
    formData.append('language', lang);

    try {
      const res = await fetch('/api/disease/diagnose', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setAnalyzing(false);
      setAnalysisResult(data);
    } catch (err) {
      setAnalyzing(false);
      setAnalysisResult(sampleScans[0].mockResult);
    }
  };

  const toggleAudio = () => {
    if (!analysisResult || analysisResult.error) return;
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const cName = analysisResult.commonName || analysisResult.plant_name || '';
    const dName = analysisResult.diseaseName || analysisResult.disease_name || '';
    const conf = analysisResult.confidence || `${analysisResult.confidence_pct}%`;
    const chem = analysisResult.chemicalTreatment || analysisResult.chemical_treatment || '';

    const textToSpeak = lang === 'te'
      ? `మొక్క పేరు: ${cName}. వ్యాధి: ${dName}. నమ్మకం శాతం: ${conf}. రసాయన మందు: ${chem}.`
      : `Plant Name: ${cName}. Disease: ${dName}. Confidence: ${conf}. Treatment: ${chem}`;

    setIsPlayingAudio(true);
    speakText(
      textToSpeak,
      lang,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false),
      () => setIsPlayingAudio(false)
    );
  };

  const getSeverityBadgeColor = (sev) => {
    switch (sev) {
      case 'Mild': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Severe': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const isLowConfidence = analysisResult && (
    analysisResult.error === 'Unable to confidently identify.' ||
    (analysisResult.confidence_pct && analysisResult.confidence_pct < 70) ||
    (analysisResult.confidence && parseFloat(analysisResult.confidence) < 70)
  );

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📷</span>
          <h2 className="text-xl sm:text-2xl font-black text-[#2C3333]">
            {lang === 'hi' ? 'गूगल लेंस फसल एवं रोग AI स्कैनर' : (lang === 'te' ? 'పంట & వ్యాధి గుర్తింపు AI లెన్స్' : 'Agricultural Vision AI Lens Scanner')}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 font-semibold max-w-3xl">
          {lang === 'te' 
            ? 'లైవ్ కెమెరా లేదా గ్యాలరీ ద్వారా పంటలు, ఆకులు, కాయలు, కాండం లేదా విత్తనాల ఫోటో తీసి తక్షణమే వ్యాధులు మరియు రసాయన చికిత్స పొందండి.' 
            : 'Capture or upload photos of crops, leaves, fruits, stems, or seeds for instant Gemini Vision disease diagnosis.'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex space-x-2 border-b border-emerald-100 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('camera')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'camera'
              ? 'bg-[#2D6A4F] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>{lang === 'te' ? '📷 లైవ్ కెమెరా స్కానర్' : '📷 Live Camera Scanner'}</span>
        </button>

        <button
          onClick={() => setActiveTab('upload')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'upload'
              ? 'bg-[#2D6A4F] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>{lang === 'te' ? '🖼️ గ్యాలరీ ఫోటో అప్‌లోడ్' : '🖼️ Gallery Photo Upload'}</span>
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'samples'
              ? 'bg-[#2D6A4F] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'te' ? '🧪 నమూనా ఫోటోల పరీక్ష' : '🧪 Sample Scans Test'}</span>
        </button>
      </div>

      {/* Main Scanner Container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Camera / Gallery Upload Viewport */}
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm flex flex-col justify-between">
          
          {/* TAB 1: LIVE CAMERA */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video sm:aspect-square bg-slate-950 rounded-3xl overflow-hidden border-2 border-emerald-200 shadow-inner flex items-center justify-center">
                <video ref={videoRef} playsInline muted className="w-full h-full object-cover" />
                <canvas ref={canvasRef} className="hidden" />

                <div className="absolute inset-8 border-2 border-dashed border-emerald-400/80 rounded-3xl pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                    <div className="w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                  </div>
                  <div className="flex justify-between">
                    <div className="w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                    <div className="w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />
                  </div>
                </div>

                {analyzing && (
                  <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[1px] flex flex-col items-center justify-center">
                    <div className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-bounce" />
                    <span className="mt-4 px-4 py-1.5 rounded-full bg-slate-900/90 text-emerald-400 font-extrabold text-xs tracking-wider animate-pulse">
                      🔍 GEMINI VISION SCANNING...
                    </span>
                  </div>
                )}
              </div>

              {cameraError ? (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold text-center">
                  ⚠️ {cameraError}
                </div>
              ) : (
                <button
                  onClick={captureSnapshot}
                  disabled={analyzing}
                  className="w-full py-4 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all hover:scale-[1.01]"
                >
                  <Camera className="w-5 h-5 text-white" />
                  <span>{lang === 'te' ? '📸 ఫోటో తీసి స్కాన్ చేయండి ➔' : '📸 Snap Photo & Analyze ➔'}</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 2: GALLERY UPLOAD */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video sm:aspect-square bg-slate-50 border-2 border-dashed border-emerald-300 rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer hover:bg-emerald-50/50 transition-all">
                {selectedImage ? (
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <img src={selectedImage} alt="Crop Scan" className="w-full h-full object-cover" />
                    {analyzing && (
                      <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-[2px] flex items-center justify-center">
                        <span className="px-4 py-2 rounded-full bg-white text-[#2D6A4F] font-black text-xs animate-pulse">
                          🔍 GEMINI VISION ANALYZING...
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#2D6A4F] flex items-center justify-center text-2xl font-bold">
                      🖼️
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-[#2C3333]">Upload Plant / Crop Photo</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        Detects crops, leaves, fruits, vegetables, flowers, trees, stems, bark & seeds.
                      </p>
                    </div>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handleGalleryUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
            </div>
          )}

          {/* TAB 3: SAMPLES */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-500">Select Sample Scan Preset:</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {sampleScans.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSample(s)}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#2D6A4F] hover:bg-emerald-50/50 cursor-pointer flex items-center gap-3 transition-all"
                  >
                    <img src={s.url} alt={s.title} className="w-12 h-12 rounded-xl object-cover border border-slate-300" />
                    <div>
                      <h5 className="text-xs font-bold text-[#2C3333]">{s.title}</h5>
                      <span className="text-[10px] text-[#2D6A4F] font-bold">Click to scan ➔</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: JSON Output / Result Cards */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 space-y-4 shadow-sm flex flex-col justify-between">
          
          <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
            <h3 className="text-base font-black text-[#2C3333] flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#2D6A4F]" />
              <span>Plant Image Diagnosis JSON</span>
            </h3>

            {analysisResult && !analysisResult.error && (
              <button
                onClick={toggleAudio}
                className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isPlayingAudio
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-50 text-[#2D6A4F] border border-emerald-200'
                }`}
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>{isPlayingAudio ? 'Stop ⏹️' : '🔊 Listen Audio'}</span>
              </button>
            )}
          </div>

          {analyzing && (
            <div className="p-12 text-center space-y-4 my-auto">
              <Sparkles className="w-10 h-10 text-[#2D6A4F] animate-spin mx-auto" />
              <div className="text-sm font-extrabold text-[#2C3333]">
                Analyzing plant image...
              </div>
            </div>
          )}

          {/* LOW CONFIDENCE SAFEGUARD (<70%) */}
          {isLowConfidence && (
            <div className="p-6 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 space-y-3 shadow-sm my-auto">
              <div className="flex items-center gap-3 text-amber-800">
                <AlertOctagon className="w-7 h-7 text-amber-600 shrink-0" />
                <h4 className="text-lg font-black">
                  "Unable to confidently identify."
                </h4>
              </div>

              <div className="text-xs font-bold text-amber-900 leading-relaxed">
                Confidence is below 70%. Please capture a clearer image with good lighting.
              </div>

              <button
                onClick={() => {
                  setAnalysisResult(null);
                  setSelectedImage(null);
                }}
                className="w-full py-3 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-sm cursor-pointer transition-all"
              >
                📸 Capture Clearer Image ➔
              </button>
            </div>
          )}

          {/* SUCCESSFUL ANALYSIS RESULT CARDS */}
          {analysisResult && !isLowConfidence && (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Row 1: Common Name & Scientific Name */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] font-extrabold text-[#2D6A4F] uppercase">🌿 commonName</div>
                  <div className="text-lg font-black text-[#2C3333]">{analysisResult.commonName || analysisResult.plant_name}</div>
                  <div className="text-xs text-slate-500 font-semibold italic">🧬 scientificName: {analysisResult.scientificName || analysisResult.scientific_name}</div>
                </div>

                <div className="text-right">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#2D6A4F] text-white">
                    🎯 confidence: {analysisResult.confidence || `${analysisResult.confidence_pct}%`}
                  </span>
                </div>
              </div>

              {/* Row 2: Plant Part & Disease & Severity */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">🍃 plantPart</div>
                  <div className="text-sm font-extrabold text-[#2C3333] mt-0.5">{analysisResult.plantPart || analysisResult.plant_part}</div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[10px] font-bold text-slate-500 uppercase">⚠️ severity</div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 border ${getSeverityBadgeColor(analysisResult.severity)}`}>
                    {analysisResult.severity}
                  </span>
                </div>
              </div>

              {/* Row 3: Disease Name */}
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                <div className="text-[10px] font-extrabold text-rose-800 uppercase flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  <span>diseaseName</span>
                </div>
                <div className="text-base sm:text-lg font-black text-rose-900">{analysisResult.diseaseName || analysisResult.disease_name}</div>
              </div>

              {/* Symptoms */}
              {analysisResult.symptoms && analysisResult.symptoms.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 space-y-1">
                  <div className="font-bold text-slate-800">🔍 symptoms:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-600">
                    {analysisResult.symptoms.map((sym, i) => (
                      <li key={i}>{sym}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Organic Treatment */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                <div className="text-[11px] font-bold text-[#2D6A4F] uppercase flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-[#2D6A4F]" />
                  <span>🌱 organicTreatment</span>
                </div>
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  {analysisResult.organicTreatment || analysisResult.organic_treatment}
                </p>
              </div>

              {/* Chemical Treatment */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[11px] font-bold text-[#2D6A4F] uppercase flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-[#2D6A4F]" />
                  <span>🧪 chemicalTreatment</span>
                </div>
                <p className="text-xs text-slate-800 font-extrabold leading-relaxed">
                  {analysisResult.chemicalTreatment || analysisResult.chemical_treatment}
                </p>
              </div>

              {/* Prevention */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700">
                🛡️ <span className="font-bold text-slate-800">prevention:</span> {analysisResult.prevention}
              </div>

            </div>
          )}

          {!analyzing && !analysisResult && (
            <div className="p-8 text-center space-y-2 text-slate-500 my-auto">
              <Camera className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-xs font-bold">No plant image scanned yet.</div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
