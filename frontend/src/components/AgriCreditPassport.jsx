import React, { useState } from 'react';
import { ShieldCheck, Award, Lock, CheckCircle2, Share2, Download, Sparkles, Building2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AgriCreditPassport({ passportData, farmerData }) {
  const [farmerAccessGranted, setFarmerAccessGranted] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);

  // Fallback defaults if standalone view
  const data = passportData || {
    passport_id: 'AGRI-PASS-2026-0089',
    verification_code: 'VERIFIED-7A9B32CD',
    farmer_name: farmerData?.name || 'Ravi Kumar',
    village: farmerData?.village || farmerData?.address || 'Chandpur Village',
    phone: farmerData?.phone || '9876543210',
    credit_score: 78,
    credit_grade: 'Prime / Excellent Credit',
    repayment_probability_pct: 85.4,
    repayment_capacity_inr: 120000,
    recommended_credit_limit_inr: 120000,
    production_stability: 'High',
    market_risk: 'Medium',
    weather_risk: 'Medium',
    crop_risk: 'Low',
    fpo_verification: 'Verified (Member of Green Harvest FPO)',
    transaction_history: 'Verified - Bank & APMC Mandi Linked',
    data_sharing: {
      farmer_controlled_access: true,
      shareable_with_lenders: true
    }
  };

  const formatLakhs = (amount) => {
    if (!amount) return '₹1.2 Lakh';
    const lakhs = (amount / 100000).toFixed(1);
    return `₹${lakhs} Lakh`;
  };

  const handleCopyShareLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getRiskBadge = (level) => {
    switch (level?.toLowerCase()) {
      case 'low':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/40';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Container with clean card styling */}
      <div className="relative glass-card rounded-2xl p-5 border border-amber-400/30 overflow-hidden" style={{ width: '100%', boxSizing: 'border-box' }}>
        
        {/* Decorative Golden & Emerald Foil accents */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-400"></div>
        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Passport Header Banner */}
        <div className="flex items-center justify-between border-b border-amber-400/30 pb-3 mb-4" style={{ flexWrap: 'wrap', gap: '8px' }}>
          <div className="flex items-center gap-2" style={{ minWidth: 0 }}>
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-slate-950" style={{ flexShrink: 0 }}>
              <Award className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 uppercase">
                  OFFICIAL DIGITAL IDENTITY
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  PORTABLE
                </span>
              </div>
              <h2 className="text-base font-extrabold text-white uppercase font-mono">
                AGRICREDIT PASSPORT
              </h2>
            </div>
          </div>

          <div className="text-right" style={{ flexShrink: 0 }}>
            <span className="text-[10px] font-mono text-slate-400 block">PASSPORT ID</span>
            <span className="text-xs font-mono font-bold text-amber-300 tracking-wider">
              {data.passport_id}
            </span>
          </div>
        </div>

        {/* Farmer Personal Identity Block */}
        <div className="bg-slate-950/70 rounded-2xl p-4 border border-emerald-500/20 mb-6 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">FARMER NAME</span>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>{data.farmer_name}</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </h3>
            <span className="text-xs text-emerald-300/80">{data.village} • Ph: {data.phone}</span>
          </div>

          <div className="text-right bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-500/30">
            <span className="text-[10px] font-mono text-slate-400 block">STATUS</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified Profile
            </span>
          </div>
        </div>

        {/* Core Credit Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Credit Score Gauge */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-amber-400/30 flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-1.5 text-amber-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Credit Score
            </span>
            <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-tight my-1">
              {data.credit_score}<span className="text-base text-slate-400 font-normal">/100</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {data.credit_grade || 'Prime Credit'}
            </span>
          </div>

          {/* Repayment Capacity */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-emerald-500/30 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Repayment Capacity
            </span>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono tracking-tight my-1">
              {formatLakhs(data.repayment_capacity_inr)}
            </div>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Repay Prob: {data.repayment_probability_pct}%
            </span>
          </div>

          {/* Recommended Credit */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-teal-500/30 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
              Recommended Credit
            </span>
            <div className="text-2xl font-extrabold text-teal-300 font-mono tracking-tight my-1">
              {formatLakhs(data.recommended_credit_limit_inr)}
            </div>
            <span className="text-[10px] text-teal-400/90 font-medium">
              Bank Eligible Limit
            </span>
          </div>
        </div>

        {/* Risk Assessment Matrix */}
        <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 mb-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center justify-between">
            <span>Agricultural Risk Matrix</span>
            <span className="text-[10px] text-slate-400 font-normal">AI / ML Computed</span>
          </h4>

          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-300">Production Stability</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getRiskBadge(data.production_stability)}`}>
                {data.production_stability}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-300">Market Risk</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getRiskBadge(data.market_risk)}`}>
                {data.market_risk}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-300">Weather Risk</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getRiskBadge(data.weather_risk)}`}>
                {data.weather_risk}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <span className="text-slate-300">Crop Risk</span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getRiskBadge(data.crop_risk)}`}>
                {data.crop_risk}
              </span>
            </div>
          </div>
        </div>

        {/* Verifications & Badges */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-medium">FPO Verification</span>
            </div>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {data.fpo_verification || 'Verified'}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-medium">Transaction History</span>
            </div>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {data.transaction_history || 'Verified'}
            </span>
          </div>
        </div>

        {/* Data Sharing Controls */}
        <div className="bg-gradient-to-r from-amber-950/40 to-emerald-950/40 rounded-2xl p-4 border border-amber-400/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-400/20 text-amber-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Data Sharing Consent</span>
              <p className="text-[11px] text-slate-300">
                {farmerAccessGranted ? '✓ Farmer controls access (Shareable with approved lenders)' : '🔒 Private (Access restricted)'}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={() => setFarmerAccessGranted(!farmerAccessGranted)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              farmerAccessGranted ? 'bg-emerald-500' : 'bg-slate-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                farmerAccessGranted ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </button>
        </div>

        {/* Actions Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            SECURED BY AGRI-TRUST PKI
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copied Link!' : 'Share Passport'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
