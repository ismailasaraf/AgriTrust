import React, { useState } from 'react';
import { Sprout, User, Phone, Key, Lock, ArrowLeft, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLoginSuccess, initialRole = 'farmer', onBackToHome }) {
  const [role, setRole]       = useState(initialRole);
  const [phone, setPhone]     = useState('');
  const [name, setName]       = useState('');
  const [password, setPassword] = useState('');
  const [adminUser, setAdminUser] = useState('admin');
  const [adminPass, setAdminPass] = useState('');

  const handleFarmer = (e) => {
    e.preventDefault();
    onLoginSuccess({ role: 'farmer', name: name || 'Farmer', phone, isDemo: false });
  };

  const handleAdmin = (e) => {
    e.preventDefault();
    onLoginSuccess({ role: 'admin', name: 'Credit Officer', username: adminUser, isDemo: false });
  };

  const demoFarmer = () => onLoginSuccess({ role: 'farmer', name: 'Ramesh Patel', phone: '9876543210', isDemo: true });
  const demoAdmin  = () => onLoginSuccess({ role: 'admin',  name: 'Chief Credit Officer', username: 'admin', isDemo: true });

  const s = {
    wrap:    { minHeight: '100vh', background: '#0b1120', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Inter, -apple-system, sans-serif' },
    box:     { width: '100%', maxWidth: 420, background: '#1e293b', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, overflow: 'hidden' },
    head:    { padding: '28px 28px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' },
    body:    { padding: '24px 28px 28px' },
    label:   { display: 'block', fontSize: 12, fontWeight: 600, color: '#94a3b8', marginBottom: 6 },
    input:   { display: 'block', width: '100%', background: '#0f172a', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, color: '#f1f5f9', fontSize: 14, padding: '10px 14px', fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' },
    btnG:    { width: '100%', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
    btnGold: { width: '100%', background: '#d97706', color: '#fff', border: 'none', borderRadius: 8, padding: '11px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 20 },
    demo:    { width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 8, padding: '9px', fontWeight: 600, fontSize: 12, cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, boxSizing: 'border-box' },
    tab:     (active) => ({ flex: 1, padding: '9px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 13, borderRadius: 6, transition: 'all 0.15s', background: active ? '#16a34a' : 'transparent', color: active ? '#fff' : '#64748b' }),
    field:   { marginBottom: 16 },
    back:    { display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', marginBottom: 20, padding: 0 },
  };

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        {/* Header */}
        <div style={s.head}>
          {onBackToHome && (
            <button style={s.back} onClick={onBackToHome}>
              <ArrowLeft size={14} /> Back to Website
            </button>
          )}
          <div style={{ display: 'inline-flex', background: '#16a34a', borderRadius: 12, padding: 10, marginBottom: 14 }}>
            <Sprout size={22} color="#fff" strokeWidth={2.5} />
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>
            Agri<span style={{ color: '#22c55e' }}>Trust</span> Portal
          </div>
          <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
            National Agricultural Credit Platform
          </div>
        </div>

        {/* Role tabs */}
        <div style={{ padding: '16px 20px 0', display: 'flex', gap: 6, background: '#172031' }}>
          <button style={s.tab(role === 'farmer')} onClick={() => setRole('farmer')}>👨‍🌾 Farmer</button>
          <button style={s.tab(role === 'admin')}  onClick={() => setRole('admin')}>🏦 Bank Admin</button>
        </div>

        {/* Form body */}
        <div style={s.body}>
          {role === 'farmer' ? (
            <form onSubmit={handleFarmer}>
              <div style={s.field}>
                <label style={s.label}>Full Name</label>
                <input style={s.input} type="text" placeholder="e.g. Ramesh Patel" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Mobile Number *</label>
                <input style={s.input} type="tel" required placeholder="9876543210" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Password / PIN</label>
                <input style={s.input} type="password" placeholder="Enter your PIN" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button type="submit" style={s.btnG}>
                Login to Farmer Portal <ArrowRight size={15} />
              </button>
              <button type="button" style={s.demo} onClick={demoFarmer}>
                ⚡ Quick Demo — Farmer Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdmin}>
              <div style={s.field}>
                <label style={s.label}>Admin Username</label>
                <input style={s.input} type="text" required placeholder="admin" value={adminUser} onChange={e => setAdminUser(e.target.value)} />
              </div>
              <div style={s.field}>
                <label style={s.label}>Password</label>
                <input style={s.input} type="password" required placeholder="admin123" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
              </div>
              <button type="submit" style={s.btnGold}>
                Login to Admin Portal <ArrowRight size={15} />
              </button>
              <button type="button" style={s.demo} onClick={demoAdmin}>
                ⚡ Quick Demo — Admin Login
              </button>
            </form>
          )}

          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 11, color: '#475569', textAlign: 'center' }}>
            Secured · FastAPI Backend · AgriTrust v1.0
          </div>
        </div>
      </div>
    </div>
  );
}
