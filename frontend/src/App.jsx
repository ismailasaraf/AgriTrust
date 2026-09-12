import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import FarmerDashboard from './components/FarmerDashboard';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import FarmerRegistration from './components/FarmerRegistration';
import LoanApplication from './components/LoanApplication';
import AdminPortal from './components/AdminPortal';
import AgriCreditPassport from './components/AgriCreditPassport';
import AIAgricreditSuite from './components/AIAgricreditSuite';
import FarmerDirectory from './components/FarmerDirectory';
import FPOCreditDashboard from './components/FPOCreditDashboard';
import { api } from './api';

export default function App() {
  // Navigation State: 'landing' (public home), 'auth' (login screen), or 'portal' (authenticated dashboard)
  const [pageMode, setPageMode] = useState('landing');
  const [authRole, setAuthRole] = useState('farmer'); // 'farmer' or 'admin'

  // Authenticated User Session (null = logged out)
  const [currentUser, setCurrentUser] = useState(null);

  // Active Dashboard Tab
  const [activeTab, setActiveTab] = useState('farmer-dashboard');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [farmers, setFarmers] = useState([]);
  const [loans, setLoans] = useState([]);
  const [fpoList, setFpoList] = useState([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    checkHealthAndStats();
    const interval = setInterval(checkHealthAndStats, 8000);
    return () => clearInterval(interval);
  }, []);

  const checkHealthAndStats = async () => {
    try {
      await api.checkHealth();
      setBackendStatus('online');

      const farmerList = await api.getFarmers(0, 100).catch(() => []);
      setFarmers(farmerList);

      const loanList = await api.getLoans().catch(() => []);
      setLoans(loanList);

      const orgs = await api.getOrganizations().catch(() => []);
      setFpoList(orgs);
    } catch (err) {
      console.warn('Backend check:', err);
      setBackendStatus('offline');
    }
  };

  // Called from Landing Page when clicking "Farmer Login" or "Admin Login"
  const handleOpenLogin = (role) => {
    setAuthRole(role || 'farmer');
    setPageMode('auth');
  };

  // Called after successful authentication
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setPageMode('portal');
    if (userData.role === 'admin') {
      setActiveTab('admin-portal');
    } else {
      setActiveTab('farmer-dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPageMode('landing');
  };

  const handleFarmerRegistered = () => {
    setRefreshTrigger((prev) => prev + 1);
    checkHealthAndStats();
  };

  const handleLoanCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
    checkHealthAndStats();
  };

  const pendingLoansCount = loans.filter((l) => l.status === 'pending').length;

  // 1. PUBLIC WEBSITE VIEW (LANDING PAGE)
  if (pageMode === 'landing') {
    return (
      <LandingPage
        onOpenLogin={handleOpenLogin}
        totalFarmers={farmers.length}
        totalLoans={loans.length}
      />
    );
  }

  // 2. AUTHENTICATION VIEW (LOGIN / SIGN UP FOR FARMER & ADMIN)
  if (pageMode === 'auth') {
    return (
      <LoginPage
        initialRole={authRole}
        onLoginSuccess={handleLoginSuccess}
        onBackToHome={() => setPageMode('landing')}
      />
    );
  }

  // 3. FULL-SIZE AUTHENTICATED PORTAL (FARMER & ADMIN)
  return (
    <div className="app-container">
      
      {/* Fixed Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        backendStatus={backendStatus}
        totalFarmers={farmers.length}
        pendingLoans={pendingLoansCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <main className="main-viewport">
        
        {/* Top Header Bar */}
        <TopHeader
          activeTab={activeTab}
          onNavigate={(tab) => setActiveTab(tab)}
          currentUser={currentUser}
          onLogout={handleLogout}
        />

        {/* --- VIEW PORTALS --- */}

        {/* A. Farmer Dashboard Home (With Real-Time Loan Approval Banner) */}
        {activeTab === 'farmer-dashboard' && (
          <FarmerDashboard
            currentUser={currentUser}
            loans={loans}
            onNavigate={(tab) => setActiveTab(tab)}
            onOpenPassport={() => setActiveTab('passport')}
          />
        )}

        {/* B. Executive Analytics Dashboard */}
        {activeTab === 'dashboard' && (
          <ExecutiveDashboard
            farmers={farmers}
            loans={loans}
            fpos={fpoList}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {/* C. Farmer Registration & Multilingual Voice AI Assistant */}
        {activeTab === 'registration' && (
          <FarmerRegistration
            onFarmerRegistered={handleFarmerRegistered}
            fpoList={fpoList}
          />
        )}

        {/* D. Apply for Subsidized Kisan Credit Loan (7%) */}
        {activeTab === 'loan-application' && (
          <LoanApplication
            onLoanCreated={handleLoanCreated}
          />
        )}

        {/* E. Bank Admin Review & 1-Click Loan Approval Portal */}
        {activeTab === 'admin-portal' && (
          <AdminPortal
            refreshTrigger={refreshTrigger}
            onDataUpdated={checkHealthAndStats}
          />
        )}

        {/* F. Registered Farmer Passbooks Directory */}
        {activeTab === 'directory' && (
          <FarmerDirectory refreshTrigger={refreshTrigger} />
        )}

        {/* G. Digital AgriCredit Passport */}
        {activeTab === 'passport' && (
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f1f5f9', marginBottom: 4 }}>Agricultural Credit Passport</h2>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>
                Portable digital credit identity — credit score, risk matrix, and farmer-controlled data sharing.
              </p>
            </div>
            <AgriCreditPassport />
          </div>
        )}

        {/* H. AI / ML Credit & Yield Intelligence Suite */}
        {activeTab === 'ai-suite' && (
          <AIAgricreditSuite />
        )}

        {/* I. FPO & Cooperative Credit Registry */}
        {activeTab === 'fpo-loans' && (
          <FPOCreditDashboard />
        )}

        {/* Website Footer */}
        <footer className="mt-16 pt-6 border-t border-emerald-500/15 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>AgriTrust • National Agricultural Credit Infrastructure</span>
          <div className="flex items-center gap-4">
            <span className="font-mono text-emerald-400/90">Session: {currentUser?.name} ({currentUser?.role?.toUpperCase()})</span>
            <button 
              onClick={handleLogout}
              className="hover:text-amber-400 underline transition-colors"
            >
              Logout / Switch Account
            </button>
          </div>
        </footer>

      </main>

    </div>
  );
}
