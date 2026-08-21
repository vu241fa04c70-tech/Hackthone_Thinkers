import React, { useState, useEffect } from 'react';
import { Layers, Droplets, Zap, ShieldAlert, CheckCircle2, ArrowRight, RefreshCw } from 'lucide-react';

export default function SoilIrrigation({ activeField }) {
  const [nitrogen, setNitrogen] = useState(140);
  const [phosphorus, setPhosphorus] = useState(22);
  const [potassium, setPotassium] = useState(180);
  const [moisture, setMoisture] = useState(34);
  const [cropType, setCropType] = useState(activeField?.crop_type || 'Tomato');
  const [growthStage, setGrowthStage] = useState(activeField?.growth_stage || 'Fruiting');

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    calculateSoilAndIrrigation();
  }, [nitrogen, phosphorus, potassium, moisture, cropType, growthStage]);

  const calculateSoilAndIrrigation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/agents/soil-irrigation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field_id: activeField?.field_id || 'field_01',
          crop_type: cropType,
          growth_stage: growthStage,
          acreage: activeField?.acreage || 2.5,
          nitrogen_n: parseFloat(nitrogen),
          phosphorus_p: parseFloat(phosphorus),
          potassium_k: parseFloat(potassium),
          moisture_percent: parseFloat(moisture)
        })
      });
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-400" />
            Soil & Irrigation Agronomic Studio
          </h2>
          <p className="text-sm text-slate-400">
            Simulate soil NPK levels, moisture %, and growth stage to generate precise fertigation dosage and drip schedules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Interactive Inputs & Sliders */}
        <div className="lg:col-span-1 space-y-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Field Soil & Moisture Controls</h3>

          {/* Crop & Stage selector */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Crop Type</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="Tomato">Tomato</option>
                <option value="Wheat">Wheat</option>
                <option value="Cotton">Cotton</option>
                <option value="Potato">Potato</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 font-medium block mb-1">Growth Stage</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
              >
                <option value="Seedling">Seedling</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Flowering">Flowering</option>
                <option value="Fruiting">Fruiting</option>
                <option value="Harvesting">Harvesting</option>
              </select>
            </div>
          </div>

          {/* Nitrogen Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Nitrogen (N)</span>
              <span className="text-emerald-400">{nitrogen} kg/ha</span>
            </div>
            <input
              type="range"
              min="50"
              max="250"
              value={nitrogen}
              onChange={(e) => setNitrogen(e.target.value)}
              className="w-full accent-emerald-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Phosphorus Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Phosphorus (P)</span>
              <span className="text-sky-400">{phosphorus} kg/ha</span>
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={phosphorus}
              onChange={(e) => setPhosphorus(e.target.value)}
              className="w-full accent-sky-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Potassium Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Potassium (K)</span>
              <span className="text-amber-400">{potassium} kg/ha</span>
            </div>
            <input
              type="range"
              min="80"
              max="300"
              value={potassium}
              onChange={(e) => setPotassium(e.target.value)}
              className="w-full accent-amber-500 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>

          {/* Moisture Slider */}
          <div className="space-y-1 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-400" /> Soil Moisture %
              </span>
              <span className="text-sky-400">{moisture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={moisture}
              onChange={(e) => setMoisture(e.target.value)}
              className="w-full accent-sky-400 bg-slate-950 h-2 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Right Column: Fertilizer & Water Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {report ? (
            <>
              {/* Irrigation Schedule Card */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-sky-400" />
                    Recommended Irrigation Schedule
                  </h3>
                  <div className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-xs font-bold text-sky-400">
                    {report.water_requirement_l_per_day.toFixed(0)} L / Acre / Day
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/30 text-sky-200 text-sm font-semibold leading-relaxed">
                  {report.irrigation_schedule}
                </div>
              </div>

              {/* Fertilizer Dosage Table */}
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Targeted Fertigation & Fertilizer Prescription
                </h3>

                <div className="space-y-3">
                  {report.fertilizer_recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-400">{rec.nutrient}</span>
                          <span className="text-[10px] text-slate-400">({rec.status})</span>
                        </div>
                        <div className="text-sm font-bold text-slate-100 mt-1">{rec.action}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{rec.timing}</div>
                      </div>
                      <span className={`text-[10px] px-3 py-1 rounded-full font-bold self-start sm:self-center border ${
                        rec.priority === 'High'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {rec.priority} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
}
