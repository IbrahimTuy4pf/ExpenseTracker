// Use relative URL to leverage Vite proxy (avoids CORS issues)
// The proxy in vite.config.js forwards /api-v1 to http://localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api-v1";

// Helper function to get auth token
const getToken = () => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem("token");
    }
    return null;
  } catch (error) {
    console.error('Error getting token from localStorage:', error);
    return null;
  }
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    ...options,
    credentials: "include", // Include cookies in requests
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Check if response is ok before trying to parse JSON
    if (!response.ok) {
      // Try to parse error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status} ${response.statusText}`);
      } catch (parseError) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    // Provide more helpful error messages
    if (error.message === "Failed to fetch" || error.name === "TypeError" || error.message.includes("fetch")) {
      throw new Error("Cannot connect to server. Make sure: 1) Backend server is running (npm start in backend folder), 2) Frontend server is running (npm run dev in frontend folder), 3) Backend is on port 8000.");
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  signup: (firstName, email, password) =>
    apiCall("/auth/sign-up", {
      method: "POST",
      body: JSON.stringify({ firstName, email, password }),
    }),

  signin: (email, password) =>
    apiCall("/auth/sign-in", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => apiCall("/auth/logout", { method: "POST" }),
};

// Transaction API
export const transactionAPI = {
  getTransactions: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiCall(`/transaction${queryString ? `?${queryString}` : ""}`);
  },

  getDashboard: () => apiCall("/transaction/dashboard"),

  addTransaction: (accountId, description, source, amount) =>
    apiCall(`/transaction/add-transaction/${accountId}`, {
      method: "POST",
      body: JSON.stringify({ description, source, amount }),
    }),
  
  transferMoney: (fromAccount, toAccount, amount) =>
    apiCall("/transaction/transfer-money", {
      method: "PUT",
      body: JSON.stringify({ from_account: fromAccount, to_account: toAccount, amount }),
    }),

  getExpenseAdvice: () => apiCall("/transaction/expense-advice"),
};

// Account API
export const accountAPI = {
  getAccounts: (id = null) =>
    apiCall(`/account${id ? `/${id}` : ""}`),

  createAccount: (name, accountNumber, amount) =>
    apiCall("/account/create", {
      method: "POST",
      body: JSON.stringify({ name, account_number: accountNumber, amount }),
    }),

  addMoney: (id, amount) =>
    apiCall(`/account/add-money/${id}`, {
      method: "PUT",
      body: JSON.stringify({ amount }),
    }),

  addExpense: (id, amount, description, source) =>
    apiCall(`/account/add-expense/${id}`, {
      method: "PUT",
      body: JSON.stringify({ amount, description, source }),
    }),
};

// User API
export const userAPI = {
  getUser: () => apiCall("/user"),

  updateUser: (userData) =>
    apiCall("/user", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),

  changePassword: (currentPassword, newPassword, confirmPassword) =>
    apiCall("/user/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
    }),
};


