import React, { useState, useEffect } from 'react';
import { MapPin, Layers, Droplets, Calendar, Plus, Check, Edit, Trash2 } from 'lucide-react';

export default function FarmProfiles({ activeField, onSelectField }) {
  const [fields, setFields] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');
  const [newCrop, setNewCrop] = useState('Tomato');
  const [newAcreage, setNewAcreage] = useState('3.0');
  const [newLocation, setNewLocation] = useState('Nashik, Maharashtra');
  const [newSoil, setNewSoil] = useState('Black Loam');

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const res = await fetch('/api/fields');
      const data = await res.json();
      setFields(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateField = async () => {
    if (!newFieldName.trim()) return;

    const newProfile = {
      field_id: `field_${Date.now()}`,
      name: newFieldName,
      crop_type: newCrop,
      acreage: parseFloat(newAcreage),
      location: newLocation,
      soil_type: newSoil,
      irrigation_system: "Drip Irrigation",
      planting_date: "2026-06-01",
      growth_stage: "Vegetative"
    };

    try {
      await fetch('/api/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProfile)
      });
      fetchFields();
      setShowModal(false);
      setNewFieldName('');
      onSelectField(newProfile);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-400" />
            Crop & Field Profile Manager
          </h2>
          <p className="text-sm text-slate-400">
            Manage your agricultural blocks, soil characteristics, irrigation infrastructure, and growth stages.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" /> Add New Field Profile
        </button>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {fields.map((f) => {
          const isSelected = activeField?.field_id === f.field_id;
          return (
            <div
              key={f.field_id}
              onClick={() => onSelectField(f)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative space-y-4 ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <span className="absolute top-4 right-4 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Active Field
                </span>
              )}

              <div>
                <h3 className="text-base font-bold text-slate-100">{f.name}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {f.location}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Crop & Stage</div>
                  <div className="text-xs font-bold text-emerald-300 mt-0.5">{f.crop_type} ({f.growth_stage})</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold uppercase">Acreage</div>
                  <div className="text-xs font-bold text-slate-200 mt-0.5">{f.acreage} Acres</div>
                </div>
              </div>

              <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between">
                <span>Soil: <strong className="text-slate-200">{f.soil_type}</strong></span>
                <span>Irrigation: <strong className="text-sky-400">{f.irrigation_system}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-100">Add New Field Profile</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Field Name</label>
                <input
                  type="text"
                  value={newFieldName}
                  onChange={(e) => setNewFieldName(e.target.value)}
                  placeholder="e.g. South Block - Tomato B"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">Crop Type</label>
                  <select
                    value={newCrop}
                    onChange={(e) => setNewCrop(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="Tomato">Tomato</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Potato">Potato</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">Acreage (Acres)</label>
                  <input
                    type="number"
                    value={newAcreage}
                    onChange={(e) => setNewAcreage(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateField}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
