import React from 'react';
import { Sprout, Mic, Landmark, Award, Cpu, Building2, ShieldCheck, ArrowRight, TrendingUp, LogIn, ChevronRight } from 'lucide-react';

export default function LandingPage({ onOpenLogin, totalFarmers }) {

  const stats = [
    { val: `${totalFarmers || 12}+`, label: 'Registered Farmers', color: '#22c55e' },
    { val: '₹14.8L+',               label: 'Credit Disbursed',    color: '#fbbf24' },
    { val: '7.0% p.a.',             label: 'Kisan Interest Rate', color: '#2dd4bf' },
    { val: '7 Languages',           label: 'Voice AI Support',    color: '#38bdf8' },
  ];

  const features = [
    { icon: Mic,        title: 'Voice Registration',   desc: 'Register in Hindi, Tamil, Telugu, Marathi, Punjabi, Kannada & English.' },
    { icon: Landmark,   title: 'Kisan Credit Loans',   desc: 'Apply for subsidized 7% agricultural loans with live EMI calculator.' },
    { icon: Award,      title: 'AgriCredit Passport',  desc: 'Portable digital identity with credit score, repayment capacity & FPO seal.' },
    { icon: Cpu,        title: 'AI Credit Scoring',    desc: 'ML models evaluate credit rating, repayment probability & crop risk.' },
    { icon: Building2,  title: 'FPO Registry',         desc: 'Manage Farmer Producer Organizations and collective credit workflows.' },
    { icon: ShieldCheck,title: 'Admin Approvals',      desc: 'Bank officers approve or reject loan applications with one click.' },
  ];

  const steps = [
    { n: '01', title: 'Register Farm', desc: 'Enter farm details via form or voice assistant.' },
    { n: '02', title: 'Get Passport',  desc: 'AI issues your digital AgriCredit score and ID.' },
    { n: '03', title: 'Apply for Loan',desc: 'Select amount, purpose, and duration at 7% rate.' },
    { n: '04', title: 'Bank Approval', desc: 'Officer reviews and disburses directly to your account.' },
  ];

  const ticker = [
    'Wheat (गेहूं): ₹2,275/Qtl +4.2%',
    'Paddy (धान): ₹2,183/Qtl +3.8%',
    'Cotton (कपास): ₹7,020/Qtl +6.1%',
    'Sugarcane (गन्ना): ₹315/Qtl +2.5%',
    'Maize (मक्का): ₹2,090/Qtl +1.9%',
    'Pulses (दाल): ₹6,600/Qtl +5.4%',
    'Mustard (सरसों): ₹5,650/Qtl +4.0%',
    'Soybean (सोयाबीन): ₹4,600/Qtl +3.1%',
  ];

  return (
    <div style={{ background: '#0b1120', minHeight: '100vh', color: '#f1f5f9', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* ── NAVBAR ── */}
      <nav style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.07)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#16a34a', borderRadius: 10, padding: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sprout size={18} color="#fff" strokeWidth={2.5} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#f1f5f9', lineHeight: 1 }}>
                Agri<span style={{ color: '#22c55e' }}>Trust</span>
              </div>
              <div style={{ fontSize: 10, color: '#64748b', marginTop: 2 }}>National Credit Platform</div>
            </div>
          </div>

          {/* Center nav */}
          <div style={{ display: 'flex', gap: 32, fontSize: 13, fontWeight: 500, color: '#94a3b8' }} className="hidden-mobile">
            <a href="#features"    style={{ textDecoration: 'none', color: 'inherit' }} onMouseOver={e => e.target.style.color='#22c55e'} onMouseOut={e => e.target.style.color='#94a3b8'}>Platform</a>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }} onMouseOver={e => e.target.style.color='#22c55e'} onMouseOut={e => e.target.style.color='#94a3b8'}>How It Works</a>
            <a href="#mandi"       style={{ textDecoration: 'none', color: 'inherit' }} onMouseOver={e => e.target.style.color='#22c55e'} onMouseOut={e => e.target.style.color='#94a3b8'}>Mandi Rates</a>
          </div>

          {/* Single Login button */}
          <button
            onClick={() => onOpenLogin('farmer')}
            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontWeight: 600, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <LogIn size={14} /> Login / Sign Up
          </button>
        </div>
      </nav>

      {/* ── MANDI TICKER ── */}
      <div id="mandi" style={{ background: '#0f172a', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '7px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, fontSize: 11, fontFamily: 'monospace', whiteSpace: 'nowrap', overflowX: 'auto', padding: '0 32px' }} className="scrollbar-none">
          <span style={{ color: '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
            <TrendingUp size={12} /> LIVE AGMARKNET
          </span>
          {ticker.map((t, i) => (
            <span key={i} style={{ color: '#94a3b8', flexShrink: 0 }}>
              <span style={{ color: '#f1f5f9' }}>{t.split(':')[0]}:</span>
              <span style={{ color: '#22c55e', fontWeight: 600 }}>{t.split(':')[1]}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px 64px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 999, padding: '5px 16px', fontSize: 11, fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28 }}>
          National Kisan Credit &amp; Digital Agriculture Platform
        </div>

        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, lineHeight: 1.15, color: '#f1f5f9', marginBottom: 20, maxWidth: 680, margin: '0 auto 20px' }}>
          Intelligent Agricultural Credit &amp;{' '}
          <span style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Kisan Loans</span>{' '}
          for Farmers
        </h1>

        <p style={{ fontSize: 15, color: '#94a3b8', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Empowering Indian farmers with hands-free voice registration, portable AgriCredit Passports, and 1-click subsidized bank loan approvals.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 56 }}>
          <button
            onClick={() => onOpenLogin('farmer')}
            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <Sprout size={16} /> Enter Farmer Portal <ArrowRight size={14} />
          </button>
          <button
            onClick={() => onOpenLogin('admin')}
            style={{ background: 'rgba(217,119,6,0.12)', color: '#fbbf24', border: '1px solid rgba(217,119,6,0.3)', borderRadius: 10, padding: '12px 28px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <ShieldCheck size={16} /> Bank Admin Portal
          </button>
        </div>

        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, maxWidth: 700, margin: '0 auto' }}>
          {stats.map((s, i) => (
            <div key={i} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'monospace', color: s.color, lineHeight: 1 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 6, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '64px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Platform Modules</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>Complete Agricultural Credit Suite</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px 20px 16px' }}>
                  <div style={{ background: 'rgba(22,163,74,0.1)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Icon size={16} color="#22c55e" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9', marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ padding: '64px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#d97706', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>End-to-End Workflow</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#f1f5f9' }}>How It Works</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '20px' }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: '#16a34a', fontFamily: 'monospace', marginBottom: 12, lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9', marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '56px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#f1f5f9', marginBottom: 12 }}>Ready to Get Started?</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 28, lineHeight: 1.7 }}>
            Log in as a farmer to apply for credit or as a bank officer to manage approvals.
          </p>
          <button
            onClick={() => onOpenLogin('farmer')}
            style={{ background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, padding: '12px 32px', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}
          >
            <LogIn size={16} /> Login to Platform
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ background: '#16a34a', borderRadius: 6, padding: 5, display: 'flex' }}><Sprout size={13} color="#fff" /></div>
            <span style={{ fontWeight: 700, fontSize: 13, color: '#f1f5f9' }}>AgriTrust</span>
            <span style={{ fontSize: 11, color: '#475569' }}>National Agricultural Credit Infrastructure</span>
          </div>
          <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#475569' }}>
            <a href="#features" style={{ textDecoration: 'none', color: 'inherit' }}>Modules</a>
            <a href="#how-it-works" style={{ textDecoration: 'none', color: 'inherit' }}>How It Works</a>
            <a href="#mandi" style={{ textDecoration: 'none', color: 'inherit' }}>Mandi Rates</a>
          </div>
          <span style={{ fontSize: 11, color: '#334155' }}>© 2026 AgriTrust • All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}
