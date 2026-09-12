import React from 'react';
import { Users, Landmark, Award, Sprout, Mic, CreditCard, Sparkles, Building2, TrendingUp, CheckCircle2, ChevronRight, BarChart3, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ExecutiveDashboard({ farmers, loans, fpos, onNavigate }) {
  const totalFarmers = farmers.length;
  const totalLoanVolume = loans.reduce((acc, l) => acc + (l.amount || 0), 0);
  const activeLoansCount = loans.filter((l) => l.status === 'approved' || l.status === 'active' || l.status === 'pending').length;
  const totalAcres = farmers.reduce((acc, f) => acc + (parseFloat(f.land_size_acres) || 0), 0);
  const pendingLoansCount = loans.filter((l) => l.status === 'pending').length;

  const avgCreditScore = 78;

  return (
    <div className="space-y-8 animate-fadeIn w-full">
      
      {/* Top Welcome Hero Banner */}
      <div className="glass-card rounded-3xl p-8 md:p-10 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 space-y-4 max-w-4xl">
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 uppercase tracking-widest">
              NATIONAL AGRICULTURAL CREDIT INFRASTRUCTURE
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 font-bold border border-amber-400/30">
              AI Powered
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Welcome to <span className="text-emerald-400">AgriTrust</span> Credit Portal
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-3xl">
            Transforming agricultural lending into a supportive partnership. Complete farmer lifecycle management with voice-assisted registration, AI credit scoring (0–100), digital AgriCredit Passports, and instant Kisan Credit loan applications.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('registration')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-xs md:text-sm bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-xl shadow-emerald-500/20 transition-all"
            >
              <Mic className="w-5 h-5" />
              <span>Register Farmer (Voice / Form)</span>
            </button>

            <button
              onClick={() => onNavigate('loan-application')}
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-xs md:text-sm bg-gradient-to-r from-amber-400 to-emerald-500 text-slate-950 hover:brightness-110 shadow-xl shadow-amber-400/20 transition-all"
            >
              <Landmark className="w-5 h-5" />
              <span>Apply for Kisan Credit Loan</span>
            </button>

            <button
              onClick={() => onNavigate('admin-portal')}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-xs md:text-sm bg-slate-950/90 text-amber-300 border border-amber-400/40 hover:bg-slate-900 transition-all shadow-md"
            >
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span>👑 Admin Review ({pendingLoansCount} Pending)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Overview Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="glass-card glass-card-hover rounded-3xl p-6 border border-emerald-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Farmers
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
              {totalFarmers}
            </div>
            <span className="text-xs text-emerald-300 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Profiles Monitored
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-300">
            <Users className="w-8 h-8" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card glass-card-hover rounded-3xl p-6 border border-amber-400/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Disbursed Loan Volume
            </span>
            <div className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono tracking-tight">
              ₹{(totalLoanVolume / 100000).toFixed(1)} Lakh
            </div>
            <span className="text-xs text-amber-300 font-medium">
              {activeLoansCount} Active Applications
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-400/20 text-amber-300">
            <Landmark className="w-8 h-8" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card glass-card-hover rounded-3xl p-6 border border-teal-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Avg AI Credit Score
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-teal-300 font-mono tracking-tight">
              {avgCreditScore}<span className="text-sm font-normal text-slate-400">/100</span>
            </div>
            <span className="text-xs text-teal-400 font-medium">
              Prime Risk Profile
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-teal-500/20 text-teal-300">
            <Award className="w-8 h-8" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="glass-card glass-card-hover rounded-3xl p-6 border border-cyan-500/30 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Cultivated Farmland
            </span>
            <div className="text-3xl md:text-4xl font-extrabold text-cyan-300 font-mono tracking-tight">
              {totalAcres.toFixed(1)} <span className="text-sm font-normal text-slate-400">Acres</span>
            </div>
            <span className="text-xs text-cyan-400 font-medium">
              {fpos.length} Registered FPOs
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-cyan-500/20 text-cyan-300">
            <Sprout className="w-8 h-8" />
          </div>
        </div>

      </div>

      {/* Middle Grid: Quick Actions & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Portals Grid (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Core Platform Modules & Services
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Feature 1 */}
            <div
              onClick={() => onNavigate('registration')}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-emerald-500/30 cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 group-hover:scale-110 transition-transform">
                  <Mic className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Multilingual Voice
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                  🎤 Voice Registration
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Hands-free registration for farmers in Hindi, English, Telugu, Tamil, Marathi, Punjabi, and Kannada.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-emerald-400 gap-1 pt-1">
                <span>Open Registration</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 2 */}
            <div
              onClick={() => onNavigate('loan-application')}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-amber-400/30 cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-amber-400/20 text-amber-300 group-hover:scale-110 transition-transform">
                  <Landmark className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  7% Subsidized
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                  💳 Kisan Credit Loans
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Apply for agricultural loans with live EMI calculator and instant AI pre-approval score checks.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-amber-400 gap-1 pt-1">
                <span>Apply for Loan</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 3 */}
            <div
              onClick={() => onNavigate('passport')}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-teal-500/30 cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-teal-500/20 text-teal-300 group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  Data Consent
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors">
                  🌟 AgriCredit Passport
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Digital economic identity card with credit scores, risk matrices, and farmer-controlled data sharing.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-teal-400 gap-1 pt-1">
                <span>View Digital Identity</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Feature 4 */}
            <div
              onClick={() => onNavigate('admin-portal')}
              className="glass-card glass-card-hover rounded-3xl p-6 border border-cyan-500/30 cursor-pointer space-y-4 group"
            >
              <div className="flex items-center justify-between">
                <div className="p-3.5 rounded-2xl bg-cyan-500/20 text-cyan-300 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Admin Decision
                </span>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  👑 Admin Review Portal
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Inspect submitted farmer registration forms, review AI credit scores, and approve or reject loan applications.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-cyan-400 gap-1 pt-1">
                <span>Open Admin Portal</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

          </div>
        </div>

        {/* Right: Live Feed Stream (5 cols) */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 md:p-8 border border-emerald-500/30 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              Recent Farmer Directory Feed
            </h3>
            <button
              onClick={() => onNavigate('directory')}
              className="text-xs font-bold text-emerald-400 hover:underline"
            >
              View All
            </button>
          </div>

          {farmers.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400 space-y-2">
              <Users className="w-8 h-8 mx-auto text-slate-600" />
              <p>No farmers registered yet.</p>
              <button
                onClick={() => onNavigate('registration')}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
              >
                + Register First Farmer
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {farmers.slice(0, 4).map((f) => (
                <div
                  key={f.id}
                  onClick={() => onNavigate('directory')}
                  className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 font-extrabold flex items-center justify-center text-sm border border-emerald-500/30">
                      {f.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{f.name}</h4>
                      <span className="text-xs text-slate-400">{f.village || f.address || 'Village'} • {f.land_size_acres || 0} Acres</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    ID #{f.id}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Active Loan Applications Feed */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
              Recent Loan Applications Stream
            </h4>
            {loans.length === 0 ? (
              <p className="text-xs text-slate-400">No active loans submitted yet.</p>
            ) : (
              <div className="space-y-2.5">
                {loans.slice(0, 3).map((l) => (
                  <div key={l.id} className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-400/20 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white block">Loan #{l.id} - ₹{l.amount.toLocaleString()}</span>
                      <span className="text-slate-400">{l.purpose} ({l.duration_months} M)</span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                      l.status === 'approved' || l.status === 'active'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : l.status === 'rejected'
                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                        : 'bg-amber-400/20 text-amber-300 border-amber-400/30'
                    }`}>
                      {l.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
