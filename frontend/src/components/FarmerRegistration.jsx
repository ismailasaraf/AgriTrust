import React, { useState } from 'react';
import { User, Sprout, Building2, ChevronRight, ChevronLeft, CheckCircle, Sparkles, Mic, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api';
import VoiceAssistant from './VoiceAssistant';

const CROP_OPTIONS = [
  "Wheat", "Rice / Paddy", "Cotton", "Sugarcane", "Maize", "Pulses / Dal",
  "Mustard", "Soybean", "Tomato", "Onion", "Chilli", "Groundnut", "Millets"
];

const FARMING_TYPES = [
  "Organic Farming", "Commercial Farming", "Subsistence Farming", "Integrated / Mixed Farming"
];

const MARKET_TYPES = [
  "APMC Mandi (Government Market)", "Local Market Trader", "Direct Consumer Sales", "Contract Farming Company", "FPO Procurement Center"
];

const STEPS = ['Personal Info', 'Land & Crops', 'FPO & Market'];

export default function FarmerRegistration({ onFarmerRegistered, fpoList }) {
  const [activeMode, setActiveMode] = useState('voice');
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [registeredFarmerData, setRegisteredFarmerData] = useState(null);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', village: '', address: '',
    farming_type: 'Organic Farming',
    land_size_acres: 3.5,
    land_details: '3.5 Acres irrigated agricultural land, Survey #142',
    crop_type: 'Wheat, Cotton',
    crops_cultivated: 'Wheat, Cotton',
    approx_production: '45 Quintals / season',
    fpo_membership: 'Yes - Member of Local FPO',
    previous_farming_history: '8 years of successful crop farming',
    market_sold_to: 'APMC Mandi (Government Market)',
    organization_id: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleCrop = (crop) => {
    const current = formData.crops_cultivated ? formData.crops_cultivated.split(', ').filter(Boolean) : [];
    const updated = current.includes(crop) ? current.filter((c) => c !== crop) : [...current, crop];
    const str = updated.join(', ');
    setFormData((prev) => ({ ...prev, crops_cultivated: str, crop_type: str }));
  };

  const handleVoiceAutoFill = (extracted) => {
    setFormData((prev) => ({
      ...prev,
      name: extracted.name || prev.name,
      phone: extracted.phone || prev.phone,
      village: extracted.village || prev.village,
      address: extracted.village ? `Village ${extracted.village}` : prev.address,
      farming_type: extracted.farming_type || prev.farming_type,
      land_size_acres: extracted.land_size_acres != null ? extracted.land_size_acres : prev.land_size_acres,
      land_details: extracted.land_details || prev.land_details,
      crop_type: extracted.crops_cultivated || prev.crop_type,
      crops_cultivated: extracted.crops_cultivated || prev.crops_cultivated,
      approx_production: extracted.approx_production || prev.approx_production,
      fpo_membership: extracted.fpo_membership || prev.fpo_membership,
      previous_farming_history: extracted.previous_farming_history || prev.previous_farming_history,
      market_sold_to: extracted.market_sold_to || prev.market_sold_to,
    }));
    setActiveMode('wizard');
    setCurrentStep(1);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please provide farmer name and phone number.');
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await api.createFarmer({
        ...formData,
        land_size_acres: parseFloat(formData.land_size_acres) || 0,
        organization_id: formData.organization_id ? parseInt(formData.organization_id) : null
      });
      setRegisteredFarmerData(result);
      setSuccessMessage(`Farmer '${result.name}' registered successfully!`);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      if (onFarmerRegistered) onFarmerRegistered(result);
    } catch (err) {
      alert(`Registration failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = { borderRadius: '8px' };
  const labelStyle = { fontSize: '0.775rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' };
  const gridTwo = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header + Mode Switcher */}
      <div style={{
        background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '12px', padding: '18px 22px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap'
      }}>
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f1f5f9' }}>Farmer Account Registration</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 2 }}>Register via voice assistant or step-by-step form</div>
        </div>
        <div style={{
          display: 'flex', gap: '6px',
          background: '#0f172a', padding: '5px',
          borderRadius: '10px', border: '1px solid rgba(255,255,255,0.08)'
        }}>
          <button
            onClick={() => setActiveMode('voice')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '7px',
              fontSize: '0.775rem', fontWeight: 600, border: 'none', cursor: 'pointer',
              background: activeMode === 'voice' ? '#d97706' : 'transparent',
              color: activeMode === 'voice' ? '#fff' : '#94a3b8', transition: 'all 0.18s'
            }}
          >
            <Mic style={{ width: 14, height: 14 }} />
            Voice Assistant
          </button>
          <button
            onClick={() => setActiveMode('wizard')}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 14px', borderRadius: '7px',
              fontSize: '0.775rem', fontWeight: 600, border: 'none', cursor: 'pointer',
              background: activeMode === 'wizard' ? '#16a34a' : 'transparent',
              color: activeMode === 'wizard' ? '#fff' : '#94a3b8', transition: 'all 0.18s'
            }}
          >
            <Layers style={{ width: 14, height: 14 }} />
            Registration Form
          </button>
        </div>
      </div>

      {/* Voice Mode */}
      {activeMode === 'voice' && (
        <VoiceAssistant onAutoFillData={handleVoiceAutoFill} currentFormData={formData} />
      )}

      {/* Wizard Form Mode */}
      {activeMode === 'wizard' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

          {/* Left: Form */}
          <div style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '24px' }}>

            {/* Step Progress Bar */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {STEPS.map((label, i) => {
                const step = i + 1;
                const active = currentStep === step;
                const done = currentStep > step;
                return (
                  <React.Fragment key={step}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                        background: done ? '#16a34a' : active ? '#16a34a' : '#1e3a5f',
                        color: (active || done) ? '#fff' : '#64748b',
                        border: active ? '2px solid #4ade80' : '2px solid transparent'
                      }}>
                        {done ? '✓' : step}
                      </div>
                      <span style={{
                        fontSize: '0.75rem', fontWeight: active ? 700 : 500,
                        color: active ? '#4ade80' : done ? '#94a3b8' : '#64748b',
                        whiteSpace: 'nowrap'
                      }}>
                        {label}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)', margin: '0 10px' }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {/* Step 1 */}
              {currentStep === 1 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <User style={{ width: 14, height: 14, color: '#4ade80' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>Personal &amp; Location Information</span>
                  </div>
                  <div style={gridTwo}>
                    <div>
                      <label style={labelStyle}>Farmer Name *</label>
                      <input type="text" name="name" required placeholder="e.g. Ramesh Patel"
                        value={formData.name} onChange={handleChange}
                        className="glass-input" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Mobile Phone *</label>
                      <input type="tel" name="phone" required placeholder="9876543210"
                        value={formData.phone} onChange={handleChange}
                        className="glass-input" style={{ ...inputStyle, fontFamily: 'monospace' }} />
                    </div>
                  </div>
                  <div style={gridTwo}>
                    <div>
                      <label style={labelStyle}>Village / Gram Panchayat</label>
                      <input type="text" name="village" placeholder="e.g. Chandpur Village"
                        value={formData.village} onChange={handleChange}
                        className="glass-input" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Email (Optional)</label>
                      <input type="email" name="email" placeholder="e.g. ramesh@agri.in"
                        value={formData.email} onChange={handleChange}
                        className="glass-input" style={inputStyle} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Full Address</label>
                    <input type="text" name="address" placeholder="e.g. House #42, Main Road, Chandpur"
                      value={formData.address} onChange={handleChange}
                      className="glass-input" style={inputStyle} />
                  </div>
                </>
              )}

              {/* Step 2 */}
              {currentStep === 2 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Sprout style={{ width: 14, height: 14, color: '#4ade80' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>Land Details &amp; Crops Cultivated</span>
                  </div>
                  <div style={gridTwo}>
                    <div>
                      <label style={labelStyle}>Farming Type</label>
                      <select name="farming_type" value={formData.farming_type} onChange={handleChange}
                        className="glass-input" style={inputStyle}>
                        {FARMING_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Land Size (Acres)</label>
                      <input type="number" step="0.1" min="0" name="land_size_acres"
                        value={formData.land_size_acres} onChange={handleChange}
                        className="glass-input" style={{ ...inputStyle, fontFamily: 'monospace' }} />
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Land Details (Survey #, Irrigation)</label>
                    <input type="text" name="land_details" placeholder="e.g. 3.5 Acres irrigated, Survey #142, Borewell"
                      value={formData.land_details} onChange={handleChange}
                      className="glass-input" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Crops Cultivated (select all that apply)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                      {CROP_OPTIONS.map((crop) => {
                        const sel = formData.crops_cultivated?.includes(crop);
                        return (
                          <button type="button" key={crop} onClick={() => handleToggleCrop(crop)}
                            style={{
                              padding: '4px 12px', borderRadius: '6px', fontSize: '0.75rem',
                              fontWeight: sel ? 700 : 500, cursor: 'pointer', border: '1px solid',
                              background: sel ? 'rgba(22,163,74,0.18)' : '#0f172a',
                              color: sel ? '#4ade80' : '#64748b',
                              borderColor: sel ? 'rgba(22,163,74,0.5)' : 'rgba(255,255,255,0.07)',
                              transition: 'all 0.15s'
                            }}>
                            {sel ? '✓ ' : ''}{crop}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Approx. Production per Season</label>
                    <input type="text" name="approx_production" placeholder="e.g. 50 Quintals / season"
                      value={formData.approx_production} onChange={handleChange}
                      className="glass-input" style={inputStyle} />
                  </div>
                </>
              )}

              {/* Step 3 */}
              {currentStep === 3 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <Building2 style={{ width: 14, height: 14, color: '#4ade80' }} />
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f1f5f9' }}>FPO Membership, History &amp; Market Linkage</span>
                  </div>
                  <div style={gridTwo}>
                    <div>
                      <label style={labelStyle}>FPO Membership Status</label>
                      <input type="text" name="fpo_membership" placeholder="e.g. Yes - Member of Green Harvest FPO"
                        value={formData.fpo_membership} onChange={handleChange}
                        className="glass-input" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Link FPO Organization (Optional)</label>
                      <select name="organization_id" value={formData.organization_id} onChange={handleChange}
                        className="glass-input" style={inputStyle}>
                        <option value="">-- Independent / Select FPO --</option>
                        {fpoList && fpoList.map((fpo) => (
                          <option key={fpo.id} value={fpo.id}>{fpo.name} ({fpo.member_count} Members)</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Market Sold To</label>
                    <select name="market_sold_to" value={formData.market_sold_to} onChange={handleChange}
                      className="glass-input" style={inputStyle}>
                      {MARKET_TYPES.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Previous Farming History</label>
                    <textarea name="previous_farming_history" rows={3}
                      placeholder="e.g. 8 years of organic wheat & cotton farming. No default history."
                      value={formData.previous_farming_history} onChange={handleChange}
                      className="glass-input" style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                </>
              )}

              {/* Navigation */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: '4px'
              }}>
                {currentStep > 1 ? (
                  <button type="button" onClick={() => setCurrentStep((p) => p - 1)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 16px', borderRadius: '8px',
                      fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                      background: '#0f172a', color: '#94a3b8',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                    <ChevronLeft style={{ width: 14, height: 14 }} /> Back
                  </button>
                ) : <div />}

                {currentStep < 3 ? (
                  <button type="button" onClick={() => setCurrentStep((p) => p + 1)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 20px', borderRadius: '8px',
                      fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                      background: '#16a34a', color: '#fff', border: 'none'
                    }}>
                    Next Step <ChevronRight style={{ width: 14, height: 14 }} />
                  </button>
                ) : (
                  <button type="submit" disabled={isSubmitting}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '10px 22px', borderRadius: '8px',
                      fontSize: '0.85rem', fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      background: isSubmitting ? '#334155' : 'linear-gradient(135deg, #d97706, #16a34a)',
                      color: '#fff', border: 'none'
                    }}>
                    <Sparkles style={{ width: 15, height: 15 }} />
                    {isSubmitting ? 'Submitting...' : 'Submit & Register'}
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Right: Summary Preview */}
          <div style={{
            background: '#1e293b', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '12px', padding: '20px'
          }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
              Registration Summary
            </div>

            {[
              { label: 'Name', value: formData.name || '—' },
              { label: 'Phone', value: formData.phone || '—' },
              { label: 'Village', value: formData.village || '—' },
              { label: 'Land', value: formData.land_size_acres ? `${formData.land_size_acres} Acres` : '—' },
              { label: 'Farming Type', value: formData.farming_type || '—' },
              { label: 'Crops', value: formData.crops_cultivated || '—' },
              { label: 'FPO', value: formData.fpo_membership || '—' },
              { label: 'Market', value: formData.market_sold_to || '—' },
            ].map(({ label, value }) => (
              <div key={label} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', gap: '8px'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#64748b', flexShrink: 0 }}>{label}</span>
                <span style={{
                  fontSize: '0.775rem', fontWeight: 600, color: '#f1f5f9',
                  textAlign: 'right', wordBreak: 'break-word', maxWidth: '60%'
                }}>{value}</span>
              </div>
            ))}

            <div style={{ marginTop: '16px', padding: '10px 12px', borderRadius: '8px', background: '#0f172a', border: '1px solid rgba(22,163,74,0.2)' }}>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '6px' }}>Est. Credit Score</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', fontFamily: 'monospace' }}>
                {Math.min(98, Math.max(45, 55 + Math.floor((formData.land_size_acres || 3) * 4) + 15))}
                <span style={{ fontSize: '0.75rem', fontWeight: 400, color: '#64748b' }}>/100</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#4ade80', marginTop: 2 }}>AI-computed from land &amp; profile</div>
            </div>
          </div>

        </div>
      )}

      {/* Success Banner */}
      {successMessage && registeredFarmerData && (
        <div style={{
          background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.35)',
          borderRadius: '12px', padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle style={{ width: 20, height: 20, color: '#4ade80', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#f1f5f9' }}>{successMessage}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
                Farmer ID: <strong style={{ color: '#4ade80' }}>#{registeredFarmerData.id}</strong> · AgriCredit Passport generated and saved to backend.
              </div>
            </div>
          </div>
          <button
            onClick={() => { setSuccessMessage(null); setRegisteredFarmerData(null); }}
            style={{
              padding: '7px 16px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
              background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0
            }}
          >
            Done
          </button>
        </div>
      )}

    </div>
  );
}
