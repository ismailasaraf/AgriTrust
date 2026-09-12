import React from 'react';
import { Sprout, LayoutDashboard, Mic, Landmark, CreditCard, Users, Cpu, Building2, ShieldCheck, LogOut, Lock } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, backendStatus, totalFarmers, pendingLoans, currentUser, onLogout }) {
  const isAdmin = currentUser?.role === 'admin';

  const farmerNav = [
    { id: 'farmer-dashboard',  label: 'Dashboard',         icon: LayoutDashboard },
    { id: 'registration',      label: 'Register Farm',      icon: Mic,      badge: 'Voice AI' },
    { id: 'loan-application',  label: 'Apply for Loan',     icon: Landmark, badge: '7%' },
    { id: 'passport',          label: 'Credit Passport',    icon: CreditCard },
    { id: 'directory',         label: 'Farmer Directory',   icon: Users },
    { id: 'ai-suite',          label: 'Market Prices',      icon: Cpu },
  ];

  const adminNav = [
    { id: 'admin-portal',     label: 'Loan Approvals',     icon: ShieldCheck, badge: pendingLoans > 0 ? `${pendingLoans}` : null },
    { id: 'dashboard',        label: 'Analytics',          icon: LayoutDashboard },
    { id: 'directory',        label: 'Farmer Records',     icon: Users, badge: totalFarmers > 0 ? `${totalFarmers}` : null },
    { id: 'fpo-loans',        label: 'FPO Registry',       icon: Building2 },
    { id: 'ai-suite',         label: 'AI Credit Models',   icon: Cpu },
    { id: 'registration',     label: 'Add Farmer',         icon: Mic },
    { id: 'loan-application', label: 'New Loan',           icon: Landmark },
  ];

  const nav = isAdmin ? adminNav : farmerNav;

  const s = {
    sidebar: { width: 220, minWidth: 220, background: '#0f172a', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', height: '100vh', position: 'sticky', top: 0, zIndex: 40, fontFamily: 'Inter, -apple-system, sans-serif' },
    top:     { padding: '18px 16px 14px', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    logo:    { display: 'flex', alignItems: 'center', gap: 9, marginBottom: 14 },
    logoIcon:{ background: '#16a34a', borderRadius: 8, padding: 6, display: 'flex' },
    user:    { background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    nav:     { flex: 1, padding: '10px 10px', overflowY: 'auto' },
    grp:     { fontSize: 10, fontWeight: 700, color: '#334155', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 6px 8px' },
    item:    (active) => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '8px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: active ? 600 : 500, marginBottom: 2, background: active ? '#16a34a' : 'transparent', color: active ? '#fff' : '#94a3b8', transition: 'all 0.15s' }),
    badge:   { fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: 'rgba(255,255,255,0.1)', color: '#94a3b8' },
    badgeR:  { fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: 'rgba(239,68,68,0.2)', color: '#f87171' },
    foot:    { padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' },
    logout:  { display: 'flex', alignItems: 'center', gap: 8, width: '100%', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: '#f87171', fontSize: 12, fontWeight: 600 },
    status:  { marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, color: '#334155', padding: '0 4px' },
    dot:     (online) => ({ width: 6, height: 6, borderRadius: '50%', background: online ? '#22c55e' : '#f59e0b', display: 'inline-block', marginRight: 4 }),
  };

  return (
    <aside style={s.sidebar}>
      {/* Top: logo + user */}
      <div style={s.top}>
        <div style={s.logo}>
          <div style={s.logoIcon}><Sprout size={16} color="#fff" strokeWidth={2.5} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#f1f5f9', lineHeight: 1 }}>Agri<span style={{ color: '#22c55e' }}>Trust</span></div>
            <div style={{ fontSize: 10, color: '#475569', marginTop: 2 }}>{isAdmin ? 'Admin Portal' : 'Farmer Portal'}</div>
          </div>
        </div>
        <div style={s.user}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: isAdmin ? '#d97706' : '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
              {(currentUser?.name || 'U')[0].toUpperCase()}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 110 }}>{currentUser?.name || 'User'}</div>
              <div style={{ fontSize: 10, color: '#475569' }}>{isAdmin ? 'Admin' : 'Farmer'}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 2 }} title="Logout">
            <LogOut size={13} />
          </button>
        </div>
      </div>

      {/* Nav */}
      <div style={s.nav}>
        <div style={s.grp}>{isAdmin ? 'Administration' : 'Services'}</div>
        {nav.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => setActiveTab(item.id)} style={s.item(active)}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Icon size={14} />
                {item.label}
              </span>
              {item.badge && (
                <span style={item.id === 'admin-portal' && pendingLoans > 0 ? s.badgeR : s.badge}>{item.badge}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div style={s.foot}>
        <button style={s.logout} onClick={onLogout}>
          <LogOut size={13} /> Logout
        </button>
        <div style={s.status}>
          <span>Server</span>
          <span>
            <span style={s.dot(backendStatus === 'online')} />
            {backendStatus === 'online' ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </aside>
  );
}
