import React, { useState, useEffect } from 'react';
import { Building2, Landmark, Plus, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { api } from '../api';

export default function FPOCreditDashboard() {
  const [organizations, setOrganizations] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  // FPO Form Modal State
  const [showFpoModal, setShowFpoModal] = useState(false);
  const [fpoForm, setFpoForm] = useState({
    name: '',
    registration_number: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    member_count: 50
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [orgs, loanData] = await Promise.all([
        api.getOrganizations().catch(() => []),
        api.getLoans().catch(() => [])
      ]);
      setOrganizations(orgs);
      setLoans(loanData);
    } catch (err) {
      console.error('Error fetching FPO data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFpo = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createOrganization(fpoForm);
      setOrganizations((prev) => [...prev, created]);
      setShowFpoModal(false);
      alert(`FPO Organization '${created.name}' registered successfully!`);
    } catch (err) {
      alert(`Error creating FPO: ${err.message}`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Dashboard Banner */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-slate-950 shadow-lg shadow-teal-500/30">
            <Building2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">🏛️ FPO & Credit Lifecycle Dashboard</h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Coordinate Farmer Producer Organizations and monitor agricultural loan lifecycles across banks & lenders.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFpoModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Register New FPO</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-emerald-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total FPOs Registered</span>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono my-1">{organizations.length}</div>
          <span className="text-[11px] text-slate-400">Coordinating Member Farmers</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-teal-500/20">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Active Loans Tracked</span>
          <div className="text-3xl font-extrabold text-teal-300 font-mono my-1">{loans.length}</div>
          <span className="text-[11px] text-slate-400">Monitored in Real-time</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-amber-400/20">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Total Credit Volume</span>
          <div className="text-3xl font-extrabold text-amber-400 font-mono my-1">
            ₹{loans.reduce((acc, l) => acc + (l.amount || 0), 0).toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400">Disbursed Agricultural Credit</span>
        </div>
      </div>

      {/* FPO List Section */}
      <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Registered Farmer Producer Organizations</h3>
          <span className="text-xs text-slate-400">{organizations.length} Organizations</span>
        </div>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400 font-mono">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-400" />
            Loading FPO directory...
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No FPOs registered yet. Click "Register New FPO" above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {organizations.map((org) => (
              <div key={org.id} className="bg-slate-950/70 rounded-xl p-4 border border-emerald-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white">{org.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300">
                    Reg #{org.registration_number}
                  </span>
                </div>
                <p className="text-xs text-slate-300">Contact: {org.contact_person} ({org.phone})</p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-900">
                  <span className="text-slate-400">Members:</span>
                  <span className="font-bold text-emerald-400">{org.member_count} Farmers</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FPO Registration Modal */}
      {showFpoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card rounded-2xl p-6 border border-emerald-500/40 w-full max-w-md space-y-4">
            <h3 className="text-base font-bold text-white">Register New Farmer Producer Organization (FPO)</h3>

            <form onSubmit={handleCreateFpo} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">FPO Name *</label>
                <input
                  type="text"
                  required
                  value={fpoForm.name}
                  onChange={(e) => setFpoForm({ ...fpoForm, name: e.target.value })}
                  placeholder="e.g. Green Harvest Farmers Co-op"
                  className="w-full glass-input rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Registration Number *</label>
                <input
                  type="text"
                  required
                  value={fpoForm.registration_number}
                  onChange={(e) => setFpoForm({ ...fpoForm, registration_number: e.target.value })}
                  placeholder="e.g. FPO-MH-2026-9042"
                  className="w-full glass-input rounded-xl p-2.5 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={fpoForm.contact_person}
                    onChange={(e) => setFpoForm({ ...fpoForm, contact_person: e.target.value })}
                    placeholder="e.g. Anil Sharma"
                    className="w-full glass-input rounded-xl p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={fpoForm.phone}
                    onChange={(e) => setFpoForm({ ...fpoForm, phone: e.target.value })}
                    placeholder="e.g. 9811223344"
                    className="w-full glass-input rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={fpoForm.email}
                  onChange={(e) => setFpoForm({ ...fpoForm, email: e.target.value })}
                  placeholder="e.g. fpo@greenharvest.org"
                  className="w-full glass-input rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowFpoModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400"
                >
                  Register FPO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
