import React from 'react';
import { Mic, Landmark, LogOut } from 'lucide-react';

const PAGE_INFO = {
  'farmer-dashboard': { title: 'My Dashboard',          sub: 'Loan status, credit score & quick actions' },
  'dashboard':        { title: 'Analytics Overview',     sub: 'National agricultural credit infrastructure data' },
  'registration':     { title: 'Farmer Registration',    sub: 'Step-by-step form with voice AI assistant' },
  'loan-application': { title: 'Apply for Kisan Loan',   sub: 'Subsidized agricultural loans at 7.0% p.a.' },
  'admin-portal':     { title: 'Loan Approvals',         sub: 'Review and approve or reject loan applications' },
  'directory':        { title: 'Farmer Directory',       sub: 'Searchable registry of registered farmers' },
  'passport':         { title: 'AgriCredit Passport',    sub: 'Portable digital credit identity and score' },
  'ai-suite':         { title: 'AI & Market Intelligence',sub: 'Credit models, risk matrix and AGMARKNET prices' },
  'fpo-loans':        { title: 'FPO & Loan Registry',    sub: 'Farmer Producer Organizations and active loans' },
};

export default function TopHeader({ activeTab, onNavigate, currentUser, onLogout }) {
  const info = PAGE_INFO[activeTab] || { title: 'AgriTrust Portal', sub: 'Agricultural Credit Infrastructure' };
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, paddingBottom: 24, marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: 'Inter, -apple-system, sans-serif' }}>
      {/* Title */}
      <div style={{ minWidth: 0 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.3, margin: 0 }}>{info.title}</h1>
        <p style={{ fontSize: 12, color: '#475569', margin: '3px 0 0', lineHeight: 1 }}>{info.sub}</p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <button
          onClick={() => onNavigate('registration')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#94a3b8', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
        >
          <Mic size={13} /> Register
        </button>
        <button
          onClick={() => onNavigate('loan-application')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#16a34a', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
        >
          <Landmark size={13} /> New Loan
        </button>

        {/* User chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 8, borderLeft: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: isAdmin ? '#d97706' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12, color: '#fff' }}>
            {(currentUser?.name || 'U')[0].toUpperCase()}
          </div>
          <div style={{ display: 'none' }} className="md-show">
            <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{currentUser?.name}</div>
            <div style={{ fontSize: 10, color: '#475569' }}>{isAdmin ? 'Admin' : 'Farmer'}</div>
          </div>
          <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4 }} title="Logout">
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
