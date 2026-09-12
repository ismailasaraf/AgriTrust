import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, CheckCircle2, XCircle, Clock, Eye,
  Landmark, RefreshCw, Sparkles, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { api } from '../api';

const STATUS_MAP = {
  approved:  { bg: 'rgba(22,163,74,0.12)',   color: '#4ade80', border: 'rgba(22,163,74,0.3)',   label: 'Approved'  },
  active:    { bg: 'rgba(20,184,166,0.12)',  color: '#2dd4bf', border: 'rgba(20,184,166,0.3)',  label: 'Active'    },
  pending:   { bg: 'rgba(217,119,6,0.12)',   color: '#fbbf24', border: 'rgba(217,119,6,0.3)',   label: 'Pending'   },
  rejected:  { bg: 'rgba(239,68,68,0.12)',   color: '#f87171', border: 'rgba(239,68,68,0.3)',   label: 'Rejected'  },
  completed: { bg: 'rgba(100,116,139,0.12)', color: '#94a3b8', border: 'rgba(100,116,139,0.3)', label: 'Completed' },
  defaulted: { bg: 'rgba(185,28,28,0.12)',   color: '#fca5a5', border: 'rgba(185,28,28,0.3)',   label: 'Defaulted' },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] || STATUS_MAP.pending;
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px',
      borderRadius: 999, fontSize: '0.7rem', fontWeight: 700,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      whiteSpace: 'nowrap'
    }}>
      {s.label}
    </span>
  );
}

export default function AdminPortal({ refreshTrigger, onDataUpdated }) {
  const [loans, setLoans]               = useState([]);
  const [farmers, setFarmers]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [updatingId, setUpdatingId]     = useState(null);
  const [expandedId, setExpandedId]     = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => { fetchData(); }, [refreshTrigger]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loanList, farmerList] = await Promise.all([
        api.getLoans().catch(() => []),
        api.getFarmers(0, 100).catch(() => [])
      ]);
      setLoans(loanList);
      setFarmers(farmerList);
    } catch (err) {
      console.error('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (loanId, newStatus) => {
    setUpdatingId(loanId);
    try {
      await api.updateLoan(loanId, { status: newStatus });
      setLoans(prev => prev.map(l => l.id === loanId ? { ...l, status: newStatus } : l));
      if (expandedId === loanId && (newStatus === 'rejected')) setExpandedId(null);
      if (onDataUpdated) onDataUpdated();
    } catch (err) {
      alert(`Failed to update: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  const getFarmerById = (id) => farmers.find(f => f.id === id);

  const pendingCount  = loans.filter(l => l.status === 'pending').length;
  const approvedCount = loans.filter(l => l.status === 'approved' || l.status === 'active').length;
  const rejectedCount = loans.filter(l => l.status === 'rejected').length;
  const totalApproved = loans
    .filter(l => l.status === 'approved' || l.status === 'active')
    .reduce((s, l) => s + (l.amount || 0), 0);

  const filteredLoans = filterStatus === 'all'
    ? loans
    : loans.filter(l => l.status === filterStatus);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{
        background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, padding: '18px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg, #d97706, #16a34a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <ShieldCheck style={{ width: 22, height: 22, color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Loan Approval Portal</div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>
              Review applicant details and approve or reject Kisan Credit loans
            </div>
          </div>
        </div>
        <button onClick={fetchData} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8, fontSize: '0.775rem', fontWeight: 600,
          background: '#0f172a', border: '1px solid rgba(255,255,255,0.08)',
          color: '#94a3b8', cursor: 'pointer'
        }}>
          <RefreshCw style={{ width: 13, height: 13, ...(loading ? { animation: 'spin 1s linear infinite' } : {}) }} />
          Refresh
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Pending',  val: pendingCount,  color: '#fbbf24', bg: 'rgba(217,119,6,0.1)',   border: 'rgba(217,119,6,0.2)'   },
          { label: 'Approved', val: approvedCount, color: '#4ade80', bg: 'rgba(22,163,74,0.1)',   border: 'rgba(22,163,74,0.2)'   },
          { label: 'Rejected', val: rejectedCount, color: '#f87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.2)'   },
          { label: 'Credit Disbursed', val: `₹${(totalApproved/100000).toFixed(1)}L`, color: '#2dd4bf', bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)' },
        ].map((k, i) => (
          <div key={i} style={{
            background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 10, padding: '14px 16px'
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              {k.label}
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: k.color, fontFamily: 'monospace', lineHeight: 1 }}>
              {k.val}
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, background: '#0f172a', padding: 5, borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)', width: 'fit-content' }}>
        {[
          { id: 'all',      label: 'All Loans' },
          { id: 'pending',  label: `Pending (${pendingCount})` },
          { id: 'approved', label: 'Approved' },
          { id: 'rejected', label: 'Rejected' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setFilterStatus(tab.id)} style={{
            padding: '7px 14px', borderRadius: 7,
            fontSize: '0.775rem', fontWeight: 600, border: 'none', cursor: 'pointer',
            background: filterStatus === tab.id ? '#16a34a' : 'transparent',
            color: filterStatus === tab.id ? '#fff' : '#64748b',
            transition: 'all 0.15s'
          }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loans Table */}
      <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b', fontSize: '0.8rem' }}>
            <RefreshCw style={{ width: 20, height: 20, margin: '0 auto 10px', animation: 'spin 1s linear infinite' }} />
            Loading loan applications...
          </div>
        ) : filteredLoans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 24px', color: '#64748b', fontSize: '0.8rem' }}>
            <Landmark style={{ width: 28, height: 28, margin: '0 auto 10px', opacity: 0.4 }} />
            {filterStatus === 'pending' ? 'No pending applications. All loans have been reviewed.' : 'No loan applications found.'}
          </div>
        ) : (
          <>
            {/* Table header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr 110px 70px 60px 90px 110px 160px',
              padding: '10px 20px',
              background: '#0f172a',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              fontSize: '0.68rem', fontWeight: 700, color: '#64748b',
              textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>
              <span>Loan ID</span>
              <span>Farmer</span>
              <span>Amount</span>
              <span>Rate</span>
              <span>Term</span>
              <span>Status</span>
              <span>Purpose</span>
              <span style={{ textAlign: 'right' }}>Decision</span>
            </div>

            {/* Rows */}
            {filteredLoans.map(loan => {
              const farmer = getFarmerById(loan.farmer_id);
              const isExpanded = expandedId === loan.id;
              const isBusy = updatingId === loan.id;

              return (
                <div key={loan.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

                  {/* Main row */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '80px 1fr 110px 70px 60px 90px 110px 160px',
                    padding: '13px 20px',
                    alignItems: 'center',
                    background: isExpanded ? 'rgba(22,163,74,0.04)' : 'transparent',
                    transition: 'background 0.15s'
                  }}>

                    {/* Loan ID */}
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#fbbf24', fontSize: '0.8rem' }}>
                      #{loan.id}
                    </span>

                    {/* Farmer */}
                    <div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#f1f5f9' }}>
                        {farmer ? farmer.name : `Farmer #${loan.farmer_id}`}
                      </div>
                      {farmer && (
                        <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 1 }}>
                          {farmer.village || farmer.address || '—'} · {farmer.land_size_acres || 0} ac
                        </div>
                      )}
                    </div>

                    {/* Amount */}
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#4ade80', fontSize: '0.875rem' }}>
                      ₹{loan.amount.toLocaleString()}
                    </span>

                    {/* Rate */}
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2dd4bf', fontSize: '0.8rem' }}>
                      {loan.interest_rate}%
                    </span>

                    {/* Term */}
                    <span style={{ color: '#94a3b8', fontSize: '0.775rem' }}>
                      {loan.duration_months}m
                    </span>

                    {/* Status */}
                    <StatusBadge status={loan.status} />

                    {/* Purpose — truncated */}
                    <span style={{
                      fontSize: '0.75rem', color: '#94a3b8',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                    }} title={loan.purpose}>
                      {loan.purpose}
                    </span>

                    {/* Action buttons */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                      {/* Expand/collapse detail */}
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : loan.id)}
                        title="View full details"
                        style={{
                          padding: '6px 8px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.08)',
                          background: isExpanded ? 'rgba(22,163,74,0.15)' : '#0f172a',
                          color: isExpanded ? '#4ade80' : '#64748b', cursor: 'pointer'
                        }}>
                        {isExpanded
                          ? <ChevronUp style={{ width: 13, height: 13 }} />
                          : <Eye style={{ width: 13, height: 13 }} />
                        }
                      </button>

                      {loan.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(loan.id, 'approved')}
                            disabled={isBusy}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              padding: '6px 12px', borderRadius: 7,
                              fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: isBusy ? 'not-allowed' : 'pointer',
                              background: isBusy ? '#334155' : '#16a34a', color: '#fff', transition: 'all 0.15s'
                            }}>
                            <CheckCircle2 style={{ width: 12, height: 12 }} />
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(loan.id, 'rejected')}
                            disabled={isBusy}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 4,
                              padding: '6px 12px', borderRadius: 7,
                              fontSize: '0.75rem', fontWeight: 700, cursor: isBusy ? 'not-allowed' : 'pointer',
                              background: 'rgba(239,68,68,0.1)', color: '#f87171',
                              border: '1px solid rgba(239,68,68,0.25)', transition: 'all 0.15s'
                            }}>
                            <XCircle style={{ width: 12, height: 12 }} />
                            Reject
                          </button>
                        </>
                      )}

                      {loan.status === 'approved' && (
                        <button
                          onClick={() => updateStatus(loan.id, 'active')}
                          disabled={isBusy}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 4,
                            padding: '6px 12px', borderRadius: 7,
                            fontSize: '0.75rem', fontWeight: 700, border: 'none', cursor: isBusy ? 'not-allowed' : 'pointer',
                            background: isBusy ? '#334155' : 'linear-gradient(135deg, #0d9488, #16a34a)',
                            color: '#fff', transition: 'all 0.15s'
                          }}>
                          <Sparkles style={{ width: 12, height: 12 }} />
                          Disburse
                        </button>
                      )}

                      {(loan.status === 'active' || loan.status === 'completed' || loan.status === 'defaulted') && (
                        <span style={{ fontSize: '0.7rem', color: '#475569', fontFamily: 'monospace' }}>Closed</span>
                      )}

                      {loan.status === 'rejected' && (
                        <span style={{ fontSize: '0.7rem', color: '#475569', fontFamily: 'monospace' }}>Declined</span>
                      )}
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div style={{
                      background: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.05)',
                      padding: '20px 24px', display: 'flex', gap: 24, flexWrap: 'wrap'
                    }}>

                      {/* Loan Details */}
                      <div style={{ flex: '1 1 280px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                          Loan Details
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                          {[
                            ['Loan ID',       `#${loan.id}`],
                            ['Amount',        `₹${loan.amount.toLocaleString()}`],
                            ['Interest Rate', `${loan.interest_rate}% p.a.`],
                            ['Duration',      `${loan.duration_months} months`],
                            ['Status',        (STATUS_MAP[loan.status] || STATUS_MAP.pending).label],
                            ['Purpose',       loan.purpose],
                          ].map(([label, value]) => (
                            <div key={label} style={{ padding: '8px 10px', background: '#1e293b', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                              <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', wordBreak: 'break-word' }}>{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Farmer Details */}
                      {farmer && (
                        <div style={{ flex: '1 1 280px' }}>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                            Applicant Profile
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                              ['Name',          farmer.name],
                              ['Phone',         farmer.phone],
                              ['Village',       farmer.village || farmer.address || '—'],
                              ['Land',          `${farmer.land_size_acres || 0} Acres`],
                              ['Crops',         farmer.crops_cultivated || farmer.crop_type || '—'],
                              ['Farming Type',  farmer.farming_type || '—'],
                              ['FPO',           farmer.fpo_membership || 'Independent'],
                              ['Market',        farmer.market_sold_to || '—'],
                            ].map(([label, value]) => (
                              <div key={label} style={{ padding: '8px 10px', background: '#1e293b', borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '0.65rem', color: '#64748b', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</div>
                                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9', wordBreak: 'break-word' }}>{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* AI Credit Score */}
                      <div style={{ flex: '0 0 180px' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                          AI Credit Score
                        </div>
                        <div style={{ padding: '20px 16px', background: '#1e293b', borderRadius: 10, border: '1px solid rgba(22,163,74,0.2)', textAlign: 'center' }}>
                          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace', lineHeight: 1 }}>
                            {Math.min(98, Math.max(45, 55 + Math.floor((farmer?.land_size_acres || 3) * 4) + 15))}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#64748b', margin: '4px 0 10px' }}>/100</div>
                          <div style={{ fontSize: '0.7rem', color: '#4ade80', fontWeight: 600 }}>
                            {farmer?.land_size_acres >= 5 ? 'Prime Credit' : 'Good Standing'}
                          </div>
                          <div style={{ marginTop: 12, fontSize: '0.7rem', color: '#64748b', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 10 }}>
                            Repayment probability
                          </div>
                          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#4ade80', fontFamily: 'monospace' }}>
                            {loan.amount <= Math.round((farmer?.land_size_acres || 3) * 20 * 2250 * 0.65 * 0.70) ? '88.5%' : '65.0%'}
                          </div>
                        </div>

                        {/* Quick decision buttons in expanded panel too */}
                        {loan.status === 'pending' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                            <button
                              onClick={() => updateStatus(loan.id, 'approved')}
                              disabled={updatingId === loan.id}
                              style={{
                                padding: '10px', borderRadius: 8, border: 'none',
                                fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer',
                                background: '#16a34a', color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                              }}>
                              <CheckCircle2 style={{ width: 14, height: 14 }} /> Approve Loan
                            </button>
                            <button
                              onClick={() => updateStatus(loan.id, 'rejected')}
                              disabled={updatingId === loan.id}
                              style={{
                                padding: '10px', borderRadius: 8,
                                fontSize: '0.825rem', fontWeight: 700, cursor: 'pointer',
                                background: 'rgba(239,68,68,0.1)', color: '#f87171',
                                border: '1px solid rgba(239,68,68,0.25)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
                              }}>
                              <XCircle style={{ width: 14, height: 14 }} /> Reject Loan
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </>
        )}
      </div>

    </div>
  );
}
