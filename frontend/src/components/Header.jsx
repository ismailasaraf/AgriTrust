import React from 'react';
import { Sprout, ShieldCheck, Cpu, Users, Building2, Mic, CreditCard, Landmark, LayoutDashboard, Lock } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, backendStatus, totalFarmers, totalLoans }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Main' },
    { id: 'registration', label: 'Farmer Registration', icon: Mic, badge: 'Voice Assistant' },
    { id: 'loan-application', label: 'Apply for Loan', icon: Landmark, badge: 'Kisan Credit' },
    { id: 'admin-portal', label: 'Admin Portal', icon: Lock, badge: 'Review Forms' },
    { id: 'directory', label: 'Farmer Passbooks', icon: Users, count: totalFarmers },
    { id: 'passport', label: 'AgriCredit Passport', icon: CreditCard, badge: 'Digital ID' },
    { id: 'ai-suite', label: 'AI / ML Models', icon: Cpu },
    { id: 'fpo-loans', label: 'FPO & Loans', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-emerald-500/25 px-4 lg:px-8 py-3 shadow-2xl backdrop-blur-xl w-full">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        {/* Brand Identity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30">
              <Sprout className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Agri<span className="text-emerald-400">Trust</span>
                </h1>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold tracking-wide">
                  v1.0 Credit Platform
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">India's Agricultural Credit Infrastructure</p>
            </div>
          </div>

          {/* Mobile Status Indicator */}
          <div className="md:hidden flex items-center gap-1.5 text-xs bg-slate-950/80 px-2.5 py-1 rounded-full border border-emerald-500/30">
            <span className={`w-2 h-2 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-300 font-mono">{backendStatus === 'online' ? 'FastAPI Online' : 'Connecting'}</span>
          </div>
        </div>

        {/* Top Navigation Bar Tabs */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shadow-sm ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-600/30 border border-emerald-400/40'
                    : 'text-slate-300 hover:text-white hover:bg-emerald-950/60'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-emerald-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold ${
                    item.id === 'admin-portal' ? 'bg-amber-400/30 text-amber-200 border border-amber-400/40' :
                    item.id === 'loan-application' ? 'bg-amber-400/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
                {item.count !== undefined && (
                  <span className="text-[11px] px-1.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Server Connectivity Status Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/90 border border-emerald-500/30 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${backendStatus === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
            <span className="text-slate-200 font-mono font-semibold">FastAPI {backendStatus === 'online' ? 'Online' : 'Offline'}</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400 ml-1" />
          </div>
        </div>

      </div>
    </header>
  );
}
