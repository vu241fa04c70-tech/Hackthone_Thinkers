import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit3, Save, ShieldAlert, CheckCircle, RefreshCw, Layers, TrendingUp, Users, AlertOctagon, ExternalLink, Globe } from 'lucide-react';
import { useLanguage } from '../localization/LanguageContext';

export default function AdminDashboard() {
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

      setSuccessMsg('✅ New Government Scheme published successfully! Farmers can view it live now.');
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
      setErrorMsg('Error publishing scheme.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScheme = async (schemeId) => {
    if (!window.confirm('Are you sure you want to delete this Government Scheme?')) return;
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

  const handleUpdatePrice = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch('/api/mandi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(priceForm)
      });
      setSuccessMsg(`✅ Mandi price for ${priceForm.crop} updated to ₹${priceForm.current_price}!`);
      fetchAllData();
    } catch (err) {
      setErrorMsg('Failed to update mandi price.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcastAlert = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertForm)
      });
      setSuccessMsg('⚠️ Emergency Weather Warning broadcasted live to all farmers!');
    } catch (err) {
      setErrorMsg('Failed to broadcast alert.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-400">
              Government Agriculture & Admin Control Portal
            </h2>
          </div>
          <p className="text-xs text-slate-300 font-bold mt-1 max-w-2xl">
            Publish new government schemes, update live Mandi crop prices, view registered farmers, and broadcast emergency weather advisories directly to farmers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchAllData}
            className="px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-slate-700 font-black text-xs flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/60 text-emerald-300 text-xs font-black flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="p-1 hover:bg-emerald-900 rounded-lg">
            ✕
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-300 text-xs font-black flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="p-1 hover:bg-rose-900 rounded-lg">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'schemes'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>📜 Manage Govt Schemes ({schemes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mandi')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'mandi'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>💰 Update Mandi Prices</span>
        </button>

        <button
          onClick={() => setActiveTab('farmers')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'farmers'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>👨‍🌾 Farmers Log ({farmers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>⚠️ Broadcast Weather Warning</span>
        </button>
      </div>

      {/* Tab 1: Schemes Management */}
      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Form: Add New Scheme */}
          <div className="lg:col-span-1 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>Add New Government Scheme</span>
            </h3>

            <form onSubmit={handleAddScheme} className="space-y-3">
              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Scheme Title (Telugu / Native):</label>
                <input
                  type="text"
                  placeholder="ఉదా: కొత్త రైతు భరోసా పథకం"
                  value={newScheme.title_te}
                  onChange={(e) => setNewScheme({ ...newScheme, title_te: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Scheme Title (English):</label>
                <input
                  type="text"
                  placeholder="e.g. Solar Pump Subsidy Scheme"
                  value={newScheme.title_en}
                  onChange={(e) => setNewScheme({ ...newScheme, title_en: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Category:</label>
                <select
                  value={newScheme.category}
                  onChange={(e) => setNewScheme({ ...newScheme, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                >
                  <option value="Direct Income Support">Direct Income Support</option>
                  <option value="Crop Insurance & Risk Management">Crop Insurance & Risk Management</option>
                  <option value="Subsidized Machinery & Irrigation">Subsidized Machinery & Irrigation</option>
                  <option value="State Investment Support">State Investment Support</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Financial Benefit (₹):</label>
                <input
                  type="text"
                  placeholder="e.g. ₹10,000 subsidy per acre"
                  value={newScheme.financial_benefit}
                  onChange={(e) => setNewScheme({ ...newScheme, financial_benefit: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Eligibility Criteria:</label>
                <input
                  type="text"
                  placeholder="e.g. All small & marginal farmers holding up to 5 acres"
                  value={newScheme.eligibility}
                  onChange={(e) => setNewScheme({ ...newScheme, eligibility: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Application Deadline:</label>
                <input
                  type="text"
                  placeholder="e.g. 31 October 2026 / Open Year-Round"
                  value={newScheme.deadline}
                  onChange={(e) => setNewScheme({ ...newScheme, deadline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Official Portal Link:</label>
                <input
                  type="text"
                  placeholder="https://agri.gov.in"
                  value={newScheme.application_link}
                  onChange={(e) => setNewScheme({ ...newScheme, application_link: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Publish Scheme to Farmers</span>
              </button>
            </form>
          </div>

          {/* List: Existing Schemes */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-black text-slate-100 flex items-center justify-between">
              <span>Active Government Schemes ({schemes.length})</span>
              <span className="text-xs text-emerald-400 font-bold">Live Synced with Farmer App</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {schemes.map((s) => {
                const titleStr = typeof s.title === 'object' ? (s.title.te || s.title.en) : s.title;
                return (
                  <div key={s.scheme_id} className="bg-slate-900/90 p-5 rounded-3xl border border-slate-800 space-y-3 hover:border-slate-700 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {s.category}
                        </span>
                        <h4 className="text-base font-black text-slate-100 mt-1">{titleStr}</h4>
                      </div>

                      <button
                        onClick={() => handleDeleteScheme(s.scheme_id)}
                        className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 cursor-pointer transition-all"
                        title="Delete Scheme"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold text-slate-300 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <div>💰 Benefit: <span className="text-emerald-400 font-black">{s.financial_benefit}</span></div>
                      <div>📅 Deadline: <span className="text-amber-400">{s.deadline}</span></div>
                      <div className="sm:col-span-2">🎯 Eligibility: {s.eligibility}</div>
                    </div>

                    {s.application_link && (
                      <a
                        href={s.application_link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-bold"
                      >
                        <span>Official Portal: {s.application_link}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Tab 2: Mandi Prices Management */}
      {activeTab === 'mandi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-emerald-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Update Mandi Market Prices</span>
            </h3>

            <form onSubmit={handleUpdatePrice} className="space-y-4">
              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Select Crop:</label>
                <select
                  value={priceForm.crop}
                  onChange={(e) => setPriceForm({ ...priceForm, crop: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                >
                  <option value="Tomato">Tomato (టమాటా)</option>
                  <option value="Paddy">Paddy / Rice (వరి)</option>
                  <option value="Chilli">Chilli / Mirchi (మిరప)</option>
                  <option value="Cotton">Cotton (పత్తి)</option>
                  <option value="Potato">Potato (బంగాళాదుంప)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Current Market Price (₹ / Quintal):</label>
                <input
                  type="number"
                  value={priceForm.current_price}
                  onChange={(e) => setPriceForm({ ...priceForm, current_price: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 mt-1"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-extrabold text-slate-400">Nearest Mandi / Wholesale Yard Name:</label>
                <input
                  type="text"
                  value={priceForm.nearest_mandi}
                  onChange={(e) => setPriceForm({ ...priceForm, nearest_mandi: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-emerald-500 mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save Live Mandi Price</span>
              </button>
            </form>
          </div>

          <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-slate-100">Live Mandi Prices DB Overview</h3>
            <div className="space-y-3">
              {Object.entries(mandiData).map(([cName, cData]) => (
                <div key={cName} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-100">🌾 {cName}</h4>
                    <p className="text-xs text-slate-400 font-bold">{cData.nearest_mandi}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-emerald-400">₹{cData.current_price} / qtl</div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
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
        <div className="bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-black text-slate-100">Registered Farmers ({farmers.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {farmers.map((f, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-sm font-black text-emerald-400">👨‍🌾 {f.farmer_name}</div>
                <div className="text-xs text-slate-300 font-bold">Crop: {f.main_crop || 'Tomato'} • Acreage: {f.acreage || 2.5} acres</div>
                <div className="text-xs text-slate-400 font-bold">📍 {f.village || 'Mangalagiri'}, {f.district || 'Guntur'}, {f.state || 'Andhra Pradesh'}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Broadcast Alert */}
      {activeTab === 'alerts' && (
        <div className="max-w-2xl bg-slate-900/90 p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-amber-400 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4" />
            <span>Broadcast Emergency Weather Advisory</span>
          </h3>

          <form onSubmit={handleBroadcastAlert} className="space-y-4">
            <div>
              <label className="text-[11px] font-extrabold text-slate-400">Alert Title:</label>
              <input
                type="text"
                value={alertForm.alert_title}
                onChange={(e) => setAlertForm({ ...alertForm, alert_title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500 mt-1"
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-slate-400">Target Districts:</label>
              <input
                type="text"
                value={alertForm.district}
                onChange={(e) => setAlertForm({ ...alertForm, district: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500 mt-1"
              />
            </div>

            <div>
              <label className="text-[11px] font-extrabold text-slate-400">Advisory Message for Farmers:</label>
              <textarea
                rows={3}
                value={alertForm.message}
                onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-100 focus:outline-none focus:border-amber-500 mt-1"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
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
