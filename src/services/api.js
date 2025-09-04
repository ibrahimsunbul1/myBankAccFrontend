// API Base URL - Backend sunucunuzun URL'ini buraya yazın
const API_BASE_URL = 'http://localhost:8080/api';

// API Helper function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Session-based authentication için credentials ekle
  config.credentials = 'include';
  console.log('API Request - Added credentials: include for session-based auth');

  console.log('API Request - URL:', url);
  console.log('API Request - Config:', config);
  
  try {
    const response = await fetch(url, config);
    
    // Response'u JSON olarak parse et
    let responseData;
    try {
      responseData = await response.json();
    } catch (parseError) {
      // JSON parse edilemezse boş obje döndür
      responseData = {};
    }
    
    if (!response.ok) {
      // Backend'den gelen hata mesajını kullan
      const errorMessage = responseData.message || responseData.error || `HTTP error! status: ${response.status}`;
      console.error(`API Error - URL: ${url}, Status: ${response.status}, Message: ${errorMessage}`);
      console.error('Response data:', responseData);
      throw new Error(errorMessage);
    }
    
    return responseData;
  } catch (error) {
    console.error('API Request Error:', error);
    // Network hatası veya diğer hatalar için fallback
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Sunucuya bağlanılamıyor. Lütfen internet bağlantınızı kontrol edin.');
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },
  
  register: async (userData) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/user/profile');
  },
  
  updateProfile: async (userData) => {
    return apiRequest('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },
  
  getBalance: async () => {
    return apiRequest('/user/balance');
  },
  
  getAccounts: async () => {
    return apiRequest('/user/accounts');
  }
};

// Payment API
export const paymentAPI = {
  getPayments: async () => {
    return apiRequest('/payments');
  },
  
  createPayment: async (paymentData) => {
    return apiRequest('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  
  getPaymentHistory: async (limit = 10) => {
    return apiRequest(`/payments/history?limit=${limit}`);
  },
  
  getQuickPayments: async () => {
    return apiRequest('/payments/quick');
  }
};

// Transfer API
export const transferAPI = {
  getTransfers: async () => {
    return apiRequest('/transfers');
  },
  
  createTransfer: async (transferData) => {
    return apiRequest('/transfers', {
      method: 'POST',
      body: JSON.stringify(transferData),
    });
  },
  
  getTransferHistory: async (limit = 10) => {
    return apiRequest(`/transfers/history?limit=${limit}`);
  },
  
  getRecentTransfers: async () => {
    return apiRequest('/transfers/recent');
  }
};

// Dashboard API
export const dashboardAPI = {
  getDashboardData: async () => {
    return apiRequest('/dashboard');
  },
  
  getRecentActivity: async () => {
    return apiRequest('/dashboard/activity');
  },
  
  getQuickStats: async () => {
    return apiRequest('/dashboard/stats');
  }
};

export const API = {
  authAPI,
  userAPI,
  paymentAPI,
  transferAPI,
  dashboardAPI
};

export default API;