const API_BASE_URL = 'http://127.0.0.1:8000';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(errorData.detail || 'An unexpected API error occurred');
  }
  return response.json();
}

export const api = {
  // Health
  checkHealth: async () => {
    const res = await fetch(`${API_BASE_URL}/health`);
    return handleResponse(res);
  },

  // Farmers
  getFarmers: async (skip = 0, limit = 100) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/farmers/?skip=${skip}&limit=${limit}`);
    return handleResponse(res);
  },

  getFarmerById: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/farmers/${id}`);
    return handleResponse(res);
  },

  createFarmer: async (farmerData) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/farmers/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData),
    });
    return handleResponse(res);
  },

  updateFarmer: async (id, farmerData) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/farmers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData),
    });
    return handleResponse(res);
  },

  deleteFarmer: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/farmers/${id}`, {
      method: 'DELETE',
    });
    if (res.status === 204) return true;
    return handleResponse(res);
  },

  parseVoiceRegistration: async (transcript, language = 'en-US') => {
    const res = await fetch(`${API_BASE_URL}/api/v1/farmers/voice-parse`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript, language }),
    });
    return handleResponse(res);
  },

  // AI/ML & AgriCredit Passport
  getFarmerPassport: async (farmerId) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/farmers/${farmerId}/passport`);
    return handleResponse(res);
  },

  getFarmerCreditAnalysis: async (farmerId) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/farmers/${farmerId}/credit-analysis`);
    return handleResponse(res);
  },

  getAgmarknetPrices: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/farmers/ai-market-prices`);
    return handleResponse(res);
  },

  // Organizations (FPOs)
  getOrganizations: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/organizations/`);
    return handleResponse(res);
  },

  createOrganization: async (orgData) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/organizations/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orgData),
    });
    return handleResponse(res);
  },

  // Loans
  getLoans: async () => {
    const res = await fetch(`${API_BASE_URL}/api/v1/loans/`);
    return handleResponse(res);
  },

  createLoan: async (loanData) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/loans/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loanData),
    });
    return handleResponse(res);
  },

  updateLoan: async (id, loanData) => {
    const res = await fetch(`${API_BASE_URL}/api/v1/loans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loanData),
    });
    return handleResponse(res);
  }
};
