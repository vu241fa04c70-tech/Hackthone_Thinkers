import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ThumbsUp, ThumbsDown, MessageSquare, Sparkles, Layers, Microscope, CloudRain, TrendingUp, Info } from 'lucide-react';

export default function IntegratedDecision({ activeField }) {
  const [decision, setDecision] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    fetchDecision();
  }, [activeField]);

  const fetchDecision = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('field_id', activeField?.field_id || 'field_01');
      formData.append('sample_image_key', 'sample_tomato_early_blight');

      const res = await fetch('/api/agents/integrate-decision', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      setDecision(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = async (val) => {
    setRating(val);
    if (!decision) return;

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision_id: decision.decision_id,
          rating: val,
          feedback_text: feedbackText
        })
      });
      setFeedbackSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'Microscope': return <Microscope className="w-5 h-5 text-emerald-400" />;
      case 'CloudRain': return <CloudRain className="w-5 h-5 text-sky-400" />;
      case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-amber-400" />;
      default: return <Layers className="w-5 h-5 text-teal-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-emerald-400" />
            Integrated Multi-Agent Farm Decision Engine
          </h2>
          <p className="text-sm text-slate-400">
            Synthesizes Crop Vision, OpenWeather, Soil NPK, and Mandi Prices into one explainable action plan.
          </p>
        </div>
        <button
          onClick={fetchDecision}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-4 h-4" />
          Re-Run Agent Synthesis
        </button>
      </div>

      {isLoading ? (
        <div className="bg-slate-900/60 border border-slate-800 p-12 rounded-2xl text-center space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
          <h3 className="text-base font-bold text-slate-200">Orchestrating Sub-Agents...</h3>
          <p className="text-xs text-slate-400">Aggregating outputs from CropVision, Weather, Soil, DiseaseRisk, and Market Agents</p>
        </div>
      ) : decision ? (
        <>
          {/* Main Action Banner Card */}
          <div className={`p-6 rounded-2xl border backdrop-blur-xl space-y-4 shadow-2xl relative overflow-hidden ${
            decision.priority === 'High'
              ? 'bg-gradient-to-r from-slate-900 via-rose-950/30 to-slate-900 border-rose-500/40 shadow-rose-500/10'
              : 'bg-gradient-to-r from-slate-900 via-emerald-950/30 to-slate-900 border-emerald-500/40 shadow-emerald-500/10'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 ${
                  decision.priority === 'High'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Priority: {decision.priority}
                </span>

                <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold">
                  Field: {activeField?.name || 'Green Acres'} ({decision.crop_type})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Agent Confidence</div>
                  <div className="text-lg font-extrabold text-emerald-400">{decision.confidence_score}%</div>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Integrated Farm Management Recommendation</h3>
              <p className="text-lg font-bold text-slate-100 leading-relaxed">{decision.overall_action_summary}</p>
            </div>
          </div>

          {/* Explainability Panel */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <Info className="w-5 h-5 text-emerald-400" />
                  Explainable Decision Panel ("Why This Recommendation Was Made")
                </h3>
                <p className="text-xs text-slate-400">
                  Transparent breakdown of multi-agent reasoning vectors and contextual factors.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {decision.explainability_factors.map((factor, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        {getIconComponent(factor.icon)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{factor.factor_title}</div>
                        <div className="text-[10px] text-emerald-400 font-medium">{factor.agent_name}</div>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                      {factor.weight}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed pt-1">{factor.reasoning}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Farmer Feedback Loop Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  Farmer Feedback Loop (Continuous Agent Alignment)
                </h3>
                <p className="text-xs text-slate-400">Was this recommendation helpful for your farm decisions today?</p>
              </div>
            </div>

            {feedbackSubmitted ? (
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Thank you! Your feedback has been recorded in the agent memory bank for continuous fine-tuning.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleFeedback(1)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      rating === 1
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                        : 'bg-slate-950 hover:bg-slate-800 text-emerald-400 border-slate-800'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" /> Helpful
                  </button>

                  <button
                    onClick={() => handleFeedback(-1)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                      rating === -1
                        ? 'bg-rose-500 text-white border-rose-400'
                        : 'bg-slate-950 hover:bg-slate-800 text-rose-400 border-slate-800'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" /> Needs Improvement
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Optional notes for the agent (e.g. 'Mancozeb worked well last season')"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => handleFeedback(rating || 1)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer"
                  >
                    Submit Feedback
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
