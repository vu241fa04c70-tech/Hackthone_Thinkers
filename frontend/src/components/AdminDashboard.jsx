import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit3, Save, ShieldAlert, CheckCircle, RefreshCw, Layers, TrendingUp, Users, AlertOctagon, ExternalLink, Globe, LogOut, Lock } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';

export default function AdminDashboard({ onLogout }) {
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('schemes');
  const [schemes, setSchemes] = useState([]);
  const [mandiData, setMandiData] = useState({});
  const [farmers, setFarmers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // New Scheme Form State
  const [newScheme, setNewScheme] = useState({
    title_te: '',
    title_en: '',
    category: 'Direct Income Support',
    financial_benefit: '',
    eligibility: '',
    deadline: 'Open Year-Round',
    description: '',
    application_link: 'https://pmkisan.gov.in',
    added_by: 'Government Admin'
  });

  // Price Update State
  const [priceForm, setPriceForm] = useState({
    crop: 'Tomato',
    current_price: 2600,
    nearest_mandi: 'Guntur Wholesale Yard'
  });

  // Emergency Alert Form State
  const [alertForm, setAlertForm] = useState({
    alert_title: '⚠️ వర్షపాత హెచ్చరిక (Heavy Rainfall Warning)',
    district: 'Guntur & Krishna',
    severity: 'High',
    message: 'తదుపరి 48 గంటల్లో భారీ వర్షాలు కురిసే అవకాశం ఉంది. పంటలకు క్రిమిసంహారకాల పిచికారీ మరియు నీటిపారుదల నిలిపివేయండి.'
  });

  const fetchAllData = () => {
    setIsLoading(true);
    fetch('/api/schemes')
      .then(res => res.json())
      .then(data => setSchemes(data || []))
      .catch(() => {});

    fetch('/api/mandi')
      .then(res => res.json())
      .then(data => setMandiData(data || {}))
      .catch(() => {});

    fetch('/api/farmers')
      .then(res => res.json())
      .then(data => setFarmers(data || []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleAddScheme = async (e) => {
    e.preventDefault();
    if (!newScheme.title_en || !newScheme.financial_benefit) {
      setErrorMsg('Please fill in scheme title and financial benefit.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      scheme_id: `scheme_${Date.now()}`,
      title: {
        te: newScheme.title_te || newScheme.title_en,
        hi: newScheme.title_en,
        en: newScheme.title_en
      },
      category: newScheme.category,
      financial_benefit: newScheme.financial_benefit,
      eligibility: newScheme.eligibility,
      deadline: newScheme.deadline,
      description: newScheme.description,
      application_link: newScheme.application_link,
      status: 'Active',
      added_by: newScheme.added_by
    };

    try {
      const res = await fetch('/api/schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to add scheme');
      setSuccessMsg('Government scheme published successfully to database!');
      setNewScheme({
        title_te: '',
        title_en: '',
        category: 'Direct Income Support',
        financial_benefit: '',
        eligibility: '',
        deadline: 'Open Year-Round',
        description: '',
        application_link: 'https://pmkisan.gov.in',
        added_by: 'Government Admin'
      });
      fetchAllData();
    } catch (err) {
      setErrorMsg('Failed to save scheme to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScheme = async (schemeId) => {
    if (!window.confirm('Are you sure you want to delete this government scheme?')) return;
    setIsLoading(true);
    try {
      await fetch(`/api/schemes/${schemeId}`, { method: 'DELETE' });
      setSuccessMsg('Scheme removed successfully.');
      fetchAllData();
    } catch (err) {
      setErrorMsg('Failed to delete scheme.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMandiPrice = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/mandi/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceForm)
      });
      if (!res.ok) throw new Error('Failed to update mandi price');
      setSuccessMsg(`Updated Mandi price for ${priceForm.crop} to ₹${priceForm.current_price}/qtl`);
      fetchAllData();
    } catch (err) {
      setErrorMsg('Failed to update mandi rate.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcastAlert = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/alerts/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertForm)
      });
      if (!res.ok) throw new Error('Failed to broadcast alert');
      setSuccessMsg('Emergency Weather Alert broadcasted to all farmer devices!');
    } catch (err) {
      setErrorMsg('Failed to broadcast alert.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Info */}
      <div className="bg-white p-6 rounded-3xl border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-[#2C3333] flex items-center gap-2">
            🏛️ Government Official Control Dashboard
          </h2>
          <p className="text-xs text-slate-500 font-bold mt-0.5">
            Add official schemes, update live Mandi prices, and broadcast weather warnings to farmers.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="px-4 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer border border-slate-200 transition-all shrink-0 shadow-sm"
        >
          <LogOut className="w-4 h-4 text-[#2D6A4F]" />
          <span>Exit Admin Portal</span>
        </button>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#2D6A4F] text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-4 h-4 text-[#2D6A4F]" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <AlertOctagon className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Control Tabs Bar */}
      <div className="flex space-x-2 border-b border-emerald-100 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'schemes'
              ? 'bg-[#2D6A4F] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Government Schemes Manager</span>
        </button>

        <button
          onClick={() => setActiveTab('mandi')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'mandi'
              ? 'bg-[#2D6A4F] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Update Mandi Rates</span>
        </button>

        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'farmers'
              ? 'bg-[#2D6A4F] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Registered Farmers Log ({farmers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
            activeTab === 'alerts'
              ? 'bg-[#2D6A4F] text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-emerald-50 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Broadcast Weather Warning</span>
        </button>
      </div>

      {/* Tab 1: Government Schemes Manager */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Add New Scheme Form */}
          <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#2C3333] flex items-center gap-2">
              <PlusCircle className="w-4 h-4 text-[#2D6A4F]" />
              <span>Publish New Scheme</span>
            </h3>

            <form onSubmit={handleAddScheme} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700">Scheme Title (English):</label>
                <input
                  type="text"
                  value={newScheme.title_en}
                  onChange={(e) => setNewScheme({ ...newScheme, title_en: e.target.value })}
                  placeholder="e.g. PM Kisan Samman Nidhi Phase 2"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Scheme Title (Telugu Translation):</label>
                <input
                  type="text"
                  value={newScheme.title_te}
                  onChange={(e) => setNewScheme({ ...newScheme, title_te: e.target.value })}
                  placeholder="e.g. పిఎం కిసాన్ సమ్మాన్ నిధి"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Category:</label>
                <select
                  value={newScheme.category}
                  onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1 cursor-pointer"
                >
                  <option value="Direct Income Support">Direct Income Support</option>
                  <option value="Crop Insurance & Risk Management">Crop Insurance & Risk Management</option>
                  <option value="Subsidized Machinery & Irrigation">Subsidized Machinery & Irrigation</option>
                  <option value="State Investment Support">State Investment Support</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Financial Benefit Amount:</label>
                <input
                  type="text"
                  value={newScheme.financial_benefit}
                  onChange={(e) => setNewScheme({ ...newScheme, financial_benefit: e.target.value })}
                  placeholder="e.g. ₹6,000 per year (3 installments)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Eligibility Criteria:</label>
                <input
                  type="text"
                  value={newScheme.eligibility}
                  onChange={(e) => setNewScheme({ ...newScheme, eligibility: e.target.value })}
                  placeholder="e.g. Small & marginal farmers holding <5 acres"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Scheme Description:</label>
                <textarea
                  rows={2}
                  value={newScheme.description}
                  onChange={(e) => setNewScheme({ ...newScheme, description: e.target.value })}
                  placeholder="Details about scheme benefits..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Official Portal Link:</label>
                <input
                  type="text"
                  value={newScheme.application_link}
                  onChange={(e) => setNewScheme({ ...newScheme, application_link: e.target.value })}
                  placeholder="https://pmkisan.gov.in"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Publish Scheme to DB</span>
              </button>
            </form>
          </div>

          {/* Active Schemes List */}
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#2C3333]">Active Published Schemes ({schemes.length})</h3>

            <div className="space-y-3">
              {schemes.map((s) => {
                const titleStr = typeof s.title === 'object' ? (s.title.te || s.title.en) : s.title;
                const benefitStr = typeof s.financial_benefit === 'object' ? (s.financial_benefit.te || s.financial_benefit.en) : s.financial_benefit;

                return (
                  <div key={s.scheme_id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {s.category}
                      </span>
                      <h4 className="text-base font-bold text-[#2C3333]">{titleStr}</h4>
                      <p className="text-xs text-[#2D6A4F] font-bold">💰 {benefitStr}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteScheme(s.scheme_id)}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 cursor-pointer transition-all shrink-0"
                      title="Delete Scheme"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Mandi Price Updates */}
      {activeTab === 'mandi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#2C3333]">Update Live Wholesale Mandi Rates</h3>

            <form onSubmit={handleUpdateMandiPrice} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700">Select Crop:</label>
                <select
                  value={priceForm.crop}
                  onChange={(e) => setPriceForm({ ...priceForm, crop: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1 cursor-pointer"
                >
                  <option value="Tomato">🍅 Tomato (టమాటా)</option>
                  <option value="Paddy">🌾 Paddy (వరి)</option>
                  <option value="Chilli">🌶️ Chilli (మిరప)</option>
                  <option value="Cotton">☁️ Cotton (పత్తి)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Wholesale Price (₹ / Quintal):</label>
                <input
                  type="number"
                  value={priceForm.current_price}
                  onChange={(e) => setPriceForm({ ...priceForm, current_price: parseFloat(e.target.value) })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700">Mandi Yard Name:</label>
                <input
                  type="text"
                  value={priceForm.nearest_mandi}
                  onChange={(e) => setPriceForm({ ...priceForm, nearest_mandi: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Save className="w-4 h-4" />
                <span>Save Live Mandi Price</span>
              </button>
            </form>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-[#2C3333]">Live Mandi Prices DB Overview</h3>
            <div className="space-y-3">
              {Object.entries(mandiData).map(([cName, cData]) => (
                <div key={cName} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#2C3333]">🌾 {cName}</h4>
                    <p className="text-xs text-slate-500 font-semibold">{cData.nearest_mandi}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-extrabold text-[#2D6A4F]">₹{cData.current_price} / qtl</div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Trend: {cData.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Farmers Log */}
      {activeTab === 'farmers' && (
        <div className="bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-[#2C3333]">Registered Farmers ({farmers.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {farmers.map((f, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-sm font-bold text-[#2D6A4F]">👨‍🌾 {f.farmer_name}</div>
                <div className="text-xs text-slate-700 font-semibold">Crop: {f.main_crop || 'Tomato'} • Acreage: {f.acreage || 2.5} acres</div>
                <div className="text-xs text-slate-500 font-semibold">📍 {f.village || 'Mangalagiri'}, {f.district || 'Guntur'}, {f.state || 'Andhra Pradesh'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Broadcast Alert */}
      {activeTab === 'alerts' && (
        <div className="max-w-2xl bg-white p-6 rounded-3xl border border-emerald-100 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            <span>Broadcast Emergency Weather Advisory</span>
          </h3>

          <form onSubmit={handleBroadcastAlert} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold text-slate-700">Alert Title:</label>
              <input
                type="text"
                value={alertForm.alert_title}
                onChange={(e) => setAlertForm({ ...alertForm, alert_title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">Target Districts:</label>
              <input
                type="text"
                value={alertForm.district}
                onChange={(e) => setAlertForm({ ...alertForm, district: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700">Advisory Message for Farmers:</label>
              <textarea
                rows={3}
                value={alertForm.message}
                onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#2C3333] focus:outline-none focus:border-[#2D6A4F] mt-1"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-full bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Broadcast Alert to All Farmers</span>
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
