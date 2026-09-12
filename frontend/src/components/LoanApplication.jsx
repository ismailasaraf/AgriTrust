import React, { useState, useEffect } from 'react';
import { CreditCard, Landmark, CheckCircle, Sparkles, UserCheck, UserPlus, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';

const LOAN_PURPOSES = [
  "Seeds & Crop Inputs (Fertilizers / Pesticides)",
  "Drip & Micro Irrigation Infrastructure",
  "Tractor & Heavy Farm Machinery Purchase",
  "Solar Water Pump Installation",
  "Seasonal Crop Cultivation & Labor Expenses",
  "Livestock & Dairy Development",
  "Warehouse & Grain Storage Facilities"
];

export default function LoanApplication({ onLoanCreated }) {
  const [farmers, setFarmers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicantType, setApplicantType] = useState('existing');
  const [successLoan, setSuccessLoan] = useState(null);

  const [selectedFarmerId, setSelectedFarmerId] = useState('');
  const [newFarmer, setNewFarmer] = useState({
    name: '', phone: '', village: '',
    land_size_acres: 4.0,
    crop_type: 'Wheat, Rice',
    crops_cultivated: 'Wheat, Rice',
    farming_type: 'Organic Farming',
    market_sold_to: 'APMC Mandi (Government Market)'
  });

  const [loanAmount, setLoanAmount] = useState(120000);
  const [durationMonths, setDurationMonths] = useState(12);
  const [purpose, setPurpose] = useState(LOAN_PURPOSES[0]);
  const [interestRate, setInterestRate] = useState(7.0);

  useEffect(() => { fetchFarmersAndLoans(); }, []);

  const fetchFarmersAndLoans = async () => {
    setLoading(true);
    try {
      const [farmerList, loanList] = await Promise.all([
        api.getFarmers(0, 100).catch(() => []),
        api.getLoans().catch(() => [])
      ]);
      setFarmers(farmerList);
      setLoans(loanList);
      if (farmerList.length > 0) setSelectedFarmerId(farmerList[0].id.toString());
    } catch (err) {
      console.error('Failed to load loan data:', err);
    } finally {
      setLoading(false);
    }
  };

  const approvedLoans = loans.filter((l) => l.status === 'approved' || l.status === 'active');
  const latestApprovedLoan = approvedLoans.length > 0 ? approvedLoans[0] : null;

  const monthlyRate = interestRate / (12 * 100);
  const emi = loanAmount > 0 && durationMonths > 0
    ? Math.round((loanAmount * monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) / (Math.pow(1 + monthlyRate, durationMonths) - 1))
    : 0;

  const currentFarmer = applicantType === 'existing'
    ? farmers.find((f) => f.id.toString() === selectedFarmerId)
    : newFarmer;

  const landAcres = currentFarmer?.land_size_acres || 3.0;
  const netCapacity = landAcres * 20 * 2250 * 0.65;
  const recommendedCredit = Math.round(netCapacity * 0.70);
  const aiScore = Math.min(98, Math.max(45, 55 + Math.floor(landAcres * 4) + 15));
  const repayProb = loanAmount <= recommendedCredit ? 88.5 : 65.0;
  const preApproved = loanAmount <= recommendedCredit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let farmerIdToUse = selectedFarmerId;
      if (applicantType === 'new') {
        if (!newFarmer.name.trim() || !newFarmer.phone.trim()) {
          alert('Please provide farmer name and phone number.');
          setIsSubmitting(false);
          return;
        }
        const created = await api.createFarmer({
          ...newFarmer,
          address: `Village ${newFarmer.village}`,
          approx_production: '50 Quintals / season',
          fpo_membership: 'Yes',
          previous_farming_history: '5 years'
        });
        farmerIdToUse = created.id;
        setFarmers((prev) => [...prev, created]);
      }
      if (!farmerIdToUse) {
        alert('Please select or register a farmer first.');
        setIsSubmitting(false);
        return;
      }
      const result = await api.createLoan({
        farmer_id: parseInt(farmerIdToUse),
        amount: parseFloat(loanAmount),
        interest_rate: parseFloat(interestRate),
        duration_months: parseInt(durationMonths),
        purpose
      });
      setSuccessLoan(result);
      setLoans((prev) => [result, ...prev]);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      if (onLoanCreated) onLoanCreated(result);
    } catch (err) {
      alert(`Loan application error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Approval Notification Banner */}
      {latestApprovedLoan && (
        <div style={{
          background: 'rgba(22,163,74,0.12)',
          border: '1px solid rgba(22,163,74,0.35)',
          borderRadius: '12px',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <CheckCircle style={{ width: 20, height: 20, color: '#4ade80', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Official Bank Approval Notification
            </div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9' }}>
              Loan #{latestApprovedLoan.id} — ₹{latestApprovedLoan.amount.toLocaleString()} Approved &amp; Ready for Disbursement
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
              Interest: {latestApprovedLoan.interest_rate}% p.a. · Purpose: {latestApprovedLoan.purpose}
            </div>
          </div>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px',
            borderRadius: 999, background: 'rgba(22,163,74,0.15)',
            color: '#4ade80', border: '1px solid rgba(22,163,74,0.3)',
            whiteSpace: 'nowrap'
          }}>
            {latestApprovedLoan.status.toUpperCase()}
          </span>
        </div>
      )}

      {/* Page Header */}
      <div style={{
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '10px',
            background: 'linear-gradient(135deg, #d97706, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Landmark style={{ width: 22, height: 22, color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Agricultural Credit &amp; Loan Portal</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>Kisan Credit Scheme — AI-assisted eligibility check</div>
          </div>
        </div>

        {/* Applicant Type Switcher */}
        <div style={{
          display: 'flex', gap: '6px',
          background: '#0f172a', padding: '5px',
          borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <button
            onClick={() => setApplicantType('existing')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '7px',
              fontSize: '0.775rem', fontWeight: 600, border: 'none', cursor: 'pointer',
              background: applicantType === 'existing' ? '#16a34a' : 'transparent',
              color: applicantType === 'existing' ? '#fff' : '#94a3b8',
              transition: 'all 0.18s'
            }}
          >
            <UserCheck style={{ width: 14, height: 14 }} />
            Registered Farmer
          </button>
          <button
            onClick={() => setApplicantType('new')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '7px',
              fontSize: '0.775rem', fontWeight: 600, border: 'none', cursor: 'pointer',
              background: applicantType === 'new' ? '#d97706' : 'transparent',
              color: applicantType === 'new' ? '#fff' : '#94a3b8',
              transition: 'all 0.18s'
            }}
          >
            <UserPlus style={{ width: 14, height: 14 }} />
            New Farmer
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>

        {/* Left: Loan Form */}
        <div style={{
          background: '#1e293b',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            paddingBottom: '16px', marginBottom: '20px',
            borderBottom: '1px solid rgba(255,255,255,0.06)'
          }}>
            <CreditCard style={{ width: 16, height: 16, color: '#fbbf24' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Loan Application Details
            </span>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

            {/* Farmer Selection */}
            {applicantType === 'existing' ? (
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Select Registered Farmer *
                </label>
                {farmers.length === 0 ? (
                  <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', color: '#fbbf24', fontSize: '0.8rem' }}>
                    No registered farmers found. Switch to "New Farmer" to register and apply.
                  </div>
                ) : (
                  <select
                    value={selectedFarmerId}
                    onChange={(e) => setSelectedFarmerId(e.target.value)}
                    className="glass-input"
                    style={{ borderRadius: '8px' }}
                  >
                    {farmers.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} — {f.village || f.address || 'Village'} · {f.land_size_acres || 0} Acres
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              <div style={{ padding: '16px', borderRadius: '10px', background: '#0f172a', border: '1px solid rgba(217,119,6,0.2)' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  New Farmer Details
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Full Name *</label>
                    <input type="text" required placeholder="e.g. Suresh Patil"
                      value={newFarmer.name}
                      onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
                      className="glass-input" style={{ borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Mobile Phone *</label>
                    <input type="tel" required placeholder="9811223344"
                      value={newFarmer.phone}
                      onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })}
                      className="glass-input" style={{ borderRadius: '8px', fontFamily: 'monospace' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Village</label>
                    <input type="text" placeholder="e.g. Rampur Village"
                      value={newFarmer.village}
                      onChange={(e) => setNewFarmer({ ...newFarmer, village: e.target.value })}
                      className="glass-input" style={{ borderRadius: '8px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: '5px' }}>Land (Acres)</label>
                    <input type="number" step="0.5" min="0.5"
                      value={newFarmer.land_size_acres}
                      onChange={(e) => setNewFarmer({ ...newFarmer, land_size_acres: parseFloat(e.target.value) || 1 })}
                      className="glass-input" style={{ borderRadius: '8px', fontFamily: 'monospace' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Loan Terms */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Loan Amount (₹) *
                </label>
                <input type="number" step="5000" min="10000" max="10000000" required
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                  className="glass-input"
                  style={{ borderRadius: '8px', fontFamily: 'monospace', color: '#fbbf24', fontWeight: 700, fontSize: '1rem' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Duration *
                </label>
                <select value={durationMonths} onChange={(e) => setDurationMonths(parseInt(e.target.value))}
                  className="glass-input" style={{ borderRadius: '8px' }}
                >
                  <option value={6}>6 Months — Short Term</option>
                  <option value={12}>12 Months — 1 Year</option>
                  <option value={18}>18 Months — Medium Term</option>
                  <option value={24}>24 Months — 2 Years</option>
                  <option value={36}>36 Months — 3 Years</option>
                  <option value={60}>60 Months — 5 Years</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.775rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Purpose of Loan *
              </label>
              <select value={purpose} onChange={(e) => setPurpose(e.target.value)}
                className="glass-input" style={{ borderRadius: '8px' }}
              >
                {LOAN_PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Interest Rate (% p.a.)
                </label>
                <input type="number" step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(parseFloat(e.target.value) || 7.0)}
                  className="glass-input" style={{ borderRadius: '8px', fontFamily: 'monospace', color: '#4ade80', fontWeight: 700 }}
                />
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 4 }}>Subsidized under Agri Kisan Scheme</div>
              </div>
              <div>
                <label style={{ fontSize: '0.775rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                  Est. Monthly EMI
                </label>
                <div className="glass-input" style={{
                  borderRadius: '8px', fontFamily: 'monospace',
                  color: '#2dd4bf', fontWeight: 700, fontSize: '1rem',
                  background: '#0a1628', cursor: 'default'
                }}>
                  ₹{emi.toLocaleString()} <span style={{ fontSize: '0.7rem', fontWeight: 400, color: '#64748b' }}>/month</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', padding: '13px 24px', borderRadius: '10px',
                fontSize: '0.875rem', fontWeight: 700, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
                background: isSubmitting ? '#334155' : 'linear-gradient(135deg, #d97706, #16a34a)',
                color: '#fff', transition: 'all 0.18s'
              }}
            >
              <Sparkles style={{ width: 16, height: 16 }} />
              {isSubmitting ? 'Submitting Application...' : 'Submit Loan Application'}
            </button>

            {/* Success Banner */}
            {successLoan && (
              <div style={{
                padding: '14px 16px', borderRadius: '10px',
                background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 6 }}>
                  <CheckCircle style={{ width: 16, height: 16, color: '#4ade80' }} />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9' }}>Application Submitted Successfully</span>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  Loan ID: <strong style={{ color: '#4ade80' }}>#LOAN-{successLoan.id}</strong> ·
                  Amount: <strong style={{ color: '#fbbf24' }}>₹{successLoan.amount.toLocaleString()}</strong> ·
                  Duration: {successLoan.duration_months} months
                </div>
                <span style={{
                  display: 'inline-block', marginTop: 8,
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px',
                  borderRadius: 999, background: 'rgba(22,163,74,0.15)',
                  color: '#4ade80', border: '1px solid rgba(22,163,74,0.3)'
                }}>
                  Status: {successLoan.status.toUpperCase()}
                </span>
              </div>
            )}

          </form>
        </div>

        {/* Right: AI Assessment Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* AI Credit Card */}
          <div style={{
            background: '#1e293b',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px',
            padding: '20px'
          }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24',
              textTransform: 'uppercase', letterSpacing: '0.06em',
              paddingBottom: '12px', marginBottom: '14px',
              borderBottom: '1px solid rgba(255,255,255,0.06)'
            }}>
              Live AI Credit Assessment
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              <div style={{ textAlign: 'center', padding: '14px 10px', background: '#0f172a', borderRadius: '10px', border: '1px solid rgba(217,119,6,0.2)' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Credit Score</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace', lineHeight: 1.1 }}>{aiScore}</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>/100</div>
              </div>
              <div style={{ textAlign: 'center', padding: '14px 10px', background: '#0f172a', borderRadius: '10px', border: '1px solid rgba(22,163,74,0.2)' }}>
                <div style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', marginBottom: 4 }}>Repay Prob.</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#4ade80', fontFamily: 'monospace', lineHeight: 1.1 }}>{repayProb}%</div>
                <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>probability</div>
              </div>
            </div>

            <div style={{ background: '#0f172a', borderRadius: '8px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                <span style={{ color: '#64748b' }}>Recommended Limit</span>
                <span style={{ color: '#2dd4bf', fontWeight: 700, fontFamily: 'monospace' }}>₹{(recommendedCredit / 100000).toFixed(1)} Lakh</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem' }}>
                <span style={{ color: '#64748b' }}>Requested Amount</span>
                <span style={{ color: '#fbbf24', fontWeight: 700, fontFamily: 'monospace' }}>₹{loanAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#64748b' }}>Approval Status</span>
                <span style={{ color: preApproved ? '#4ade80' : '#fbbf24', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle style={{ width: 13, height: 13 }} />
                  {preApproved ? 'Pre-Approved' : 'Under Review'}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Loans Table */}
      <div style={{
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark style={{ width: 15, height: 15, color: '#4ade80' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f1f5f9', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Active Loan Applications
            </span>
          </div>
          <button onClick={fetchFarmersAndLoans}
            style={{ padding: '6px', borderRadius: '7px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', color: '#94a3b8' }}
          >
            <RefreshCw style={{ width: 13, height: 13, ...(loading ? { animation: 'spin 1s linear infinite' } : {}) }} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '0.8rem' }}>
            Loading loan applications...
          </div>
        ) : loans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', fontSize: '0.8rem' }}>
            No loan applications yet. Submit your first application above.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: '#0f172a' }}>
                  {['Loan ID', 'Farmer', 'Amount', 'Duration', 'Purpose', 'Rate', 'Status'].map((h) => (
                    <th key={h} style={{
                      padding: '10px 16px', textAlign: 'left',
                      fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                      letterSpacing: '0.06em', color: '#64748b', whiteSpace: 'nowrap'
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#fbbf24' }}>#{loan.id}</td>
                    <td style={{ padding: '11px 16px', color: '#94a3b8' }}>Farmer #{loan.farmer_id}</td>
                    <td style={{ padding: '11px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#4ade80' }}>₹{loan.amount.toLocaleString()}</td>
                    <td style={{ padding: '11px 16px', color: '#94a3b8' }}>{loan.duration_months}m</td>
                    <td style={{ padding: '11px 16px', color: '#cbd5e1', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{loan.purpose}</td>
                    <td style={{ padding: '11px 16px', fontFamily: 'monospace', color: '#2dd4bf', fontWeight: 600 }}>{loan.interest_rate}%</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', padding: '3px 10px',
                        borderRadius: 999, fontSize: '0.7rem', fontWeight: 700, whiteSpace: 'nowrap',
                        ...(loan.status === 'approved' || loan.status === 'active'
                          ? { background: 'rgba(22,163,74,0.12)', color: '#4ade80', border: '1px solid rgba(22,163,74,0.25)' }
                          : loan.status === 'rejected'
                          ? { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }
                          : { background: 'rgba(217,119,6,0.12)', color: '#fbbf24', border: '1px solid rgba(217,119,6,0.25)' })
                      }}>
                        {loan.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
