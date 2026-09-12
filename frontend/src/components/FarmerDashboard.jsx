import React from 'react';
import {
  Sprout, Landmark, Award, Mic, CheckCircle2, Clock, XCircle,
  TrendingUp, ShieldCheck, ArrowRight, AlertCircle, BarChart2, Leaf
} from 'lucide-react';

const StatusBadge = ({ status }) => {
  const map = {
    approved: { cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: <CheckCircle2 className="w-3 h-3" />, label: 'Approved' },
    active:   { cls: 'bg-teal-500/15 text-teal-300 border-teal-500/30',           icon: <CheckCircle2 className="w-3 h-3" />, label: 'Active'    },
    pending:  { cls: 'bg-amber-400/15 text-amber-300 border-amber-400/30',         icon: <Clock className="w-3 h-3 animate-spin" style={{animationDuration:'3s'}} />, label: 'Pending' },
    rejected: { cls: 'bg-red-500/15 text-red-300 border-red-500/30',               icon: <XCircle className="w-3 h-3" />,       label: 'Rejected'  },
    completed:{ cls: 'bg-slate-500/15 text-slate-300 border-slate-500/30',         icon: <CheckCircle2 className="w-3 h-3" />, label: 'Completed' },
    defaulted:{ cls: 'bg-red-700/15 text-red-400 border-red-700/30',               icon: <AlertCircle className="w-3 h-3" />,  label: 'Defaulted' },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${s.cls}`}>
      {s.icon}{s.label}
    </span>
  );
};

export default function FarmerDashboard({ currentUser, loans, onNavigate, onOpenPassport }) {
  const approvedLoans  = loans.filter(l => l.status === 'approved' || l.status === 'active');
  const pendingLoans   = loans.filter(l => l.status === 'pending');
  const totalPortfolio = loans.reduce((s, l) => s + (l.amount || 0), 0);
  const latestApproved = approvedLoans[0] ?? null;

  return (
    <div className="w-full space-y-6 animate-fadeIn">

      {/* ── APPROVAL BANNER ── */}
      {latestApproved && (
        <div className="rounded-2xl p-5 border-2 border-emerald-400/60 bg-emerald-950/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono font-extrabold text-amber-300 uppercase tracking-widest mb-0.5">🔔 Loan Approval Notification</p>
              <p className="text-sm font-extrabold text-white">
                Loan #{latestApproved.id} — ₹{latestApproved.amount.toLocaleString()} has been <span className="text-emerald-400">{latestApproved.status.toUpperCase()}</span>
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                {latestApproved.interest_rate}% p.a. · {latestApproved.duration_months} months · {latestApproved.purpose}
              </p>
            </div>
          </div>
          <button onClick={() => onNavigate('loan-application')} className="btn-emerald text-xs px-4 py-2 rounded-xl shrink-0">
            View Passbook
          </button>
        </div>
      )}

      {/* ── WELCOME BANNER ── */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-emerald-500/25 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30 uppercase tracking-wider">
              🌾 FARMER PORTAL
            </span>
            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-300 font-bold border border-amber-400/25">
              Kisan Verified
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold text-white leading-tight">
            Namaste, <span className="text-emerald-400">{currentUser?.name || 'Farmer'}</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-lg">
            Your agricultural credit hub — voice registration, Kisan loans at 7%, and your digital AgriCredit Passport.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <button onClick={() => onNavigate('loan-application')} className="btn-emerald text-xs px-4 py-2.5 rounded-xl flex items-center gap-2">
              <Landmark className="w-4 h-4" /><span>Apply for Loan</span>
            </button>
            <button onClick={() => onNavigate('registration')} className="text-xs px-4 py-2.5 rounded-xl font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/25 flex items-center gap-2 transition-all">
              <Mic className="w-4 h-4" /><span>Voice Register</span>
            </button>
            <button onClick={() => onNavigate('passport')} className="text-xs px-4 py-2.5 rounded-xl font-bold bg-slate-900 text-teal-300 border border-teal-500/25 hover:bg-slate-800 flex items-center gap-2 transition-all">
              <Award className="w-4 h-4" /><span>My Passport</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── KPI CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'AI Credit Score', value: '78', unit: '/100',
            sub: 'Prime · Loan Eligible', icon: <Award className="w-5 h-5" />,
            accent: 'text-amber-400', ring: 'border-amber-400/25', iconBg: 'bg-amber-400/15 text-amber-300',
          },
          {
            label: 'Credit Limit', value: '₹1.2L', unit: '',
            sub: 'Based on 5 Acres', icon: <Landmark className="w-5 h-5" />,
            accent: 'text-teal-300', ring: 'border-teal-500/25', iconBg: 'bg-teal-500/15 text-teal-300',
          },
          {
            label: 'Active Loans', value: approvedLoans.length, unit: '',
            sub: 'Approved & Active', icon: <BarChart2 className="w-5 h-5" />,
            accent: 'text-emerald-400', ring: 'border-emerald-500/25', iconBg: 'bg-emerald-500/15 text-emerald-300',
          },
          {
            label: 'Pending Review', value: pendingLoans.length, unit: '',
            sub: 'Awaiting Bank Decision', icon: <Clock className="w-5 h-5" />,
            accent: 'text-cyan-300', ring: 'border-cyan-500/25', iconBg: 'bg-cyan-500/15 text-cyan-300',
          },
        ].map((k, i) => (
          <div key={i} className={`glass-card rounded-2xl p-5 border ${k.ring} flex items-center justify-between gap-3`}>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{k.label}</p>
              <div className={`text-2xl font-extrabold font-mono ${k.accent} leading-none`}>
                {k.value}<span className="text-sm font-normal text-slate-400 ml-0.5">{k.unit}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">{k.sub}</p>
            </div>
            <div className={`p-2.5 rounded-xl ${k.iconBg} shrink-0`}>{k.icon}</div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Mic className="w-5 h-5" />, title: 'Voice Registration', desc: 'Update your farm profile using the AI voice assistant in your language.', tab: 'registration', color: 'emerald', btn: 'Open Voice AI' },
          { icon: <Landmark className="w-5 h-5" />, title: 'Apply Kisan Loan', desc: 'Apply for agricultural loans at subsidized 7.0% interest rate.', tab: 'loan-application', color: 'amber', btn: 'Apply Now' },
          { icon: <Award className="w-5 h-5" />, title: 'AgriCredit Passport', desc: 'View your portable digital credit passport and share with lenders.', tab: 'passport', color: 'teal', btn: 'View Passport' },
        ].map((a, i) => {
          const c = { emerald: { bg: 'bg-emerald-500/15', text: 'text-emerald-300', btn: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30' }, amber: { bg: 'bg-amber-400/15', text: 'text-amber-300', btn: 'bg-amber-400/15 text-amber-300 border-amber-400/30 hover:bg-amber-400/25' }, teal: { bg: 'bg-teal-500/15', text: 'text-teal-300', btn: 'bg-teal-500/15 text-teal-300 border-teal-500/30 hover:bg-teal-500/25' } }[a.color];
          return (
            <div key={i} className="glass-card rounded-2xl p-5 border border-emerald-500/15 flex flex-col gap-4">
              <div className={`w-9 h-9 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>{a.icon}</div>
              <div>
                <h3 className="text-sm font-extrabold text-white mb-1">{a.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{a.desc}</p>
              </div>
              <button onClick={() => onNavigate(a.tab)} className={`mt-auto text-xs font-bold px-4 py-2 rounded-xl border flex items-center gap-1.5 transition-all ${c.btn}`}>
                {a.btn} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ── LOAN TRACKER ── */}
      <div className="glass-card rounded-2xl border border-emerald-500/20 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-500/15 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-amber-400" />
              My Kisan Loan Applications
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Track approval and disbursement status of all your loan applications.</p>
          </div>
          <button onClick={() => onNavigate('loan-application')} className="btn-emerald text-xs px-4 py-2 rounded-xl shrink-0">
            + New Loan
          </button>
        </div>

        {/* Table or empty */}
        {loans.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
              <Leaf className="w-7 h-7" />
            </div>
            <p className="text-sm font-semibold text-slate-300">No loan applications yet</p>
            <p className="text-xs text-slate-500 max-w-xs">Submit your first Kisan Credit loan application to begin the approval process.</p>
            <button onClick={() => onNavigate('loan-application')} className="btn-emerald text-xs px-5 py-2.5 rounded-xl mt-2">
              Apply for First Loan
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-950/60 border-b border-slate-800">
                  <th className="px-5 py-3">Loan ID</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Rate</th>
                  <th className="px-5 py-3">Tenure</th>
                  <th className="px-5 py-3">Purpose</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {loans.map(loan => (
                  <tr key={loan.id} className="hover:bg-emerald-950/30 transition-colors">
                    <td className="px-5 py-3.5 text-xs font-extrabold text-amber-300 font-mono">#LOAN-{loan.id}</td>
                    <td className="px-5 py-3.5 text-sm font-extrabold text-emerald-400 font-mono">₹{loan.amount.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-xs font-bold text-teal-300 font-mono">{loan.interest_rate}%</td>
                    <td className="px-5 py-3.5 text-xs text-slate-300">{loan.duration_months}m</td>
                    <td className="px-5 py-3.5 text-xs text-slate-200 max-w-[180px] truncate">{loan.purpose}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={loan.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PORTFOLIO SUMMARY (if loans exist) ── */}
      {loans.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Portfolio', val: `₹${totalPortfolio.toLocaleString()}`, sub: `${loans.length} applications`, color: 'text-emerald-400' },
            { label: 'Approved Amount', val: `₹${approvedLoans.reduce((s,l)=>s+l.amount,0).toLocaleString()}`, sub: `${approvedLoans.length} loans`, color: 'text-teal-300' },
            { label: 'Pending Amount', val: `₹${pendingLoans.reduce((s,l)=>s+l.amount,0).toLocaleString()}`, sub: `${pendingLoans.length} under review`, color: 'text-amber-400' },
          ].map((s, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 border border-emerald-500/15 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                <p className={`text-xl font-extrabold font-mono ${s.color} mt-1`}>{s.val}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{s.sub}</p>
              </div>
              <TrendingUp className="w-5 h-5 text-slate-600" />
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
