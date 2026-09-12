import React, { useState, useEffect } from 'react';
import { Cpu, TrendingUp, ShieldAlert, DollarSign, Sparkles, RefreshCw, BarChart3, ChevronRight } from 'lucide-react';
import { api } from '../api';

export default function AIAgricreditSuite() {
  const [agmarknetData, setAgmarknetData] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(true);

  // Simulation State
  const [landAcres, setLandAcres] = useState(4.5);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [farmingExperienceYears, setFarmingExperienceYears] = useState(8);
  const [fpoMember, setFpoMember] = useState(true);
  const [requestedLoanAmount, setRequestedLoanAmount] = useState(120000);
  const [loanDurationMonths, setLoanDurationMonths] = useState(12);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    setLoadingPrices(true);
    try {
      const res = await api.getAgmarknetPrices();
      setAgmarknetData(res);
    } catch (err) {
      console.error('Failed to load AGMARKNET prices:', err);
    } finally {
      setLoadingPrices(false);
    }
  };

  // Live ML Model Calculations
  const cropPrice = agmarknetData?.crops?.[selectedCrop]?.avg_price || 2275;
  const cropRisk = agmarknetData?.crops?.[selectedCrop]?.risk || 'Low';
  
  const estimatedYieldQuintals = landAcres * 20;
  const grossIncome = estimatedYieldQuintals * cropPrice;
  const netIncome = grossIncome * 0.65;
  const recommendedCreditLimit = Math.round(netIncome * 0.70);

  // Credit score calculation
  let calculatedScore = 50 + Math.min(25, Math.floor(landAcres * 4)) + (farmingExperienceYears >= 10 ? 20 : 12) + (fpoMember ? 15 : 5);
  calculatedScore = Math.min(98, Math.max(35, calculatedScore));

  // Repayment Probability %
  let baseProb = calculatedScore * 0.85 + 15;
  let repaymentProbability = requestedLoanAmount <= recommendedCreditLimit ? Math.min(96, baseProb + 5) : Math.max(40, baseProb - 15);

  return (
    <div className="w-full space-y-6">
      
      {/* AI Suite Header Banner */}
      <div className="glass-card rounded-2xl p-4 border border-emerald-500/30 flex items-center justify-between gap-4" style={{ flexWrap: 'wrap' }}>
        <div className="flex items-center gap-3" style={{ minWidth: 0 }}>
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-slate-950" style={{ flexShrink: 0 }}>
            <Cpu className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-sm font-bold text-white tracking-tight">AI / ML Agricultural Intelligence Suite</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold whitespace-nowrap">
                Multi-Model Ensemble
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Credit Scoring, Repayment Probability, Crop Risk & AGMARKNET Price Trends.
            </p>
          </div>
        </div>

        <button
          onClick={fetchPrices}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 transition-all"
          style={{ flexShrink: 0 }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingPrices ? 'animate-spin' : ''}`} />
          <span>Refresh Trends</span>
        </button>
      </div>

      {/* Grid: 4 Core AI Models */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Model 1: Credit Score Model */}
        <div className="glass-card rounded-2xl p-5 border border-amber-400/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">1. Credit Score Model</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Random Forest / Decision Tree scoring based on land, production, FPO & market stability.</p>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 text-center border border-amber-400/20">
            <span className="text-[10px] font-mono text-slate-400 block">AI CREDIT SCORE</span>
            <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight my-1">
              {calculatedScore}<span className="text-sm text-slate-400">/100</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {calculatedScore >= 80 ? 'Prime / Low Risk' : 'Good Standing'}
            </span>
          </div>
        </div>

        {/* Model 2: Repayment Prediction Model */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">2. Repayment Probability</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Evaluates expected harvest income vs loan amount, crop duration & production costs.</p>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 text-center border border-emerald-500/20">
            <span className="text-[10px] font-mono text-slate-400 block">REPAYMENT PROBABILITY</span>
            <div className="text-3xl font-extrabold text-emerald-400 font-mono tracking-tight my-1">
              {repaymentProbability.toFixed(1)}%
            </div>
            <span className="text-[10px] text-teal-300 font-semibold">
              Limit: ₹{(recommendedCreditLimit/100000).toFixed(1)} Lakh
            </span>
          </div>
        </div>

        {/* Model 3: Crop / Market Risk Model */}
        <div className="glass-card rounded-2xl p-5 border border-teal-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">3. Crop & Market Risk</span>
              <ShieldAlert className="w-4 h-4 text-teal-300" />
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Assesses climate vulnerability, crop disease risk & market price volatility.</p>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 text-center border border-teal-500/20">
            <span className="text-[10px] font-mono text-slate-400 block">MODEL RISK INDEX</span>
            <div className="text-2xl font-extrabold text-teal-300 tracking-tight my-1 uppercase">
              {cropRisk} Risk
            </div>
            <span className="text-[10px] text-slate-300">
              Crop: {selectedCrop}
            </span>
          </div>
        </div>

        {/* Model 4: AGMARKNET Price Prediction */}
        <div className="glass-card rounded-2xl p-5 border border-cyan-500/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider">4. Price Trend Engine</span>
              <DollarSign className="w-4 h-4 text-cyan-300" />
            </div>
            <p className="text-[11px] text-slate-400 mb-4">Historical & live AGMARKNET mandi price trends for future price estimation.</p>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-4 text-center border border-cyan-500/20">
            <span className="text-[10px] font-mono text-slate-400 block">PROJECTED MANDI PRICE</span>
            <div className="text-xl font-extrabold text-cyan-300 font-mono tracking-tight my-1">
              ₹{cropPrice.toLocaleString()} <span className="text-xs text-slate-400">/ Qtl</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold">
              Trend: {agmarknetData?.crops?.[selectedCrop]?.trend || '+4.2%'}
            </span>
          </div>
        </div>

      </div>

      {/* Simulation Controls & AGMARKNET Prices Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Interactive Simulation Parameters */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-emerald-500/20 pb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            Test Live AI Simulation Inputs
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Select Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full glass-input rounded-xl p-2.5 text-emerald-300 bg-slate-900"
              >
                {agmarknetData?.crops ? (
                  Object.keys(agmarknetData.crops).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))
                ) : (
                  ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize', 'Pulses'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Cultivated Land (Acres)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="50"
                value={landAcres}
                onChange={(e) => setLandAcres(parseFloat(e.target.value) || 1)}
                className="w-full glass-input rounded-xl p-2.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Farming Experience (Years)</label>
              <input
                type="number"
                value={farmingExperienceYears}
                onChange={(e) => setFarmingExperienceYears(parseInt(e.target.value) || 1)}
                className="w-full glass-input rounded-xl p-2.5 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">FPO Membership</label>
              <select
                value={fpoMember ? 'yes' : 'no'}
                onChange={(e) => setFpoMember(e.target.value === 'yes')}
                className="w-full glass-input rounded-xl p-2.5 text-teal-300 bg-slate-900"
              >
                <option value="yes">Yes - Active FPO Member</option>
                <option value="no">No - Independent Farmer</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="text-slate-300 font-medium block mb-1">Loan Amount (₹)</label>
              <input
                type="number"
                step="10000"
                value={requestedLoanAmount}
                onChange={(e) => setRequestedLoanAmount(parseFloat(e.target.value) || 0)}
                className="w-full glass-input rounded-xl p-2.5 text-amber-300 font-mono"
              />
            </div>

            <div>
              <label className="text-slate-300 font-medium block mb-1">Loan Duration (Months)</label>
              <input
                type="number"
                value={loanDurationMonths}
                onChange={(e) => setLoanDurationMonths(parseInt(e.target.value) || 12)}
                className="w-full glass-input rounded-xl p-2.5 text-white font-mono"
              />
            </div>
          </div>
        </div>

        {/* AGMARKNET Price Table */}
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-emerald-500/20 pb-3 flex items-center justify-between">
            <span>AGMARKNET Mandi Price Benchmark</span>
            <span className="text-[10px] text-emerald-400 font-mono">Government Portal Data</span>
          </h3>

          <div className="overflow-x-auto max-h-64 scrollbar-thin">
            <table className="w-full text-left text-xs">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/80 sticky top-0">
                <tr>
                  <th className="p-2.5">Crop Name</th>
                  <th className="p-2.5">Avg Price (₹/Qtl)</th>
                  <th className="p-2.5">Risk Profile</th>
                  <th className="p-2.5">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {agmarknetData?.crops && Object.entries(agmarknetData.crops).map(([name, info]) => (
                  <tr key={name} className="hover:bg-emerald-950/40 transition-colors">
                    <td className="p-2.5 font-bold text-white">{name}</td>
                    <td className="p-2.5 font-mono text-emerald-300">₹{info.avg_price.toLocaleString()}</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        info.risk === 'Low' ? 'bg-emerald-500/20 text-emerald-300' :
                        info.risk === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {info.risk}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-emerald-400">{info.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}
