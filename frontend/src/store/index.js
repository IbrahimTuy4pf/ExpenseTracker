import { create } from "zustand";

// Safe localStorage access
const safeGetItem = (key, defaultValue = null) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const item = localStorage.getItem(key);
      return key === 'user' ? (item ? JSON.parse(item) : null) : item;
    }
    return defaultValue;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return defaultValue;
  }
};

const useStore = create((set) => ({
  theme: safeGetItem("theme", "light"),
  user: safeGetItem("user"),
  token: safeGetItem("token"),
  dashboardData: null,
  accounts: [],
  transactions: [],

  setTheme: (value) => {
    set({ theme: value });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem("theme", value);
        document.documentElement.classList.toggle("dark", value === "dark");
      }
    } catch (error) {
      console.error('Error setting theme in localStorage:', error);
    }
  },

  setUser: (user, token) => {
    set({ user, token });
    try {
      if (typeof window !== 'undefined' && window.localStorage && token) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error setting user data in localStorage:', error);
    }
  },

  logout: async () => {
    try {
      // Call logout API to clear cookies on backend
      const { authAPI } = await import("../services/api");
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('Error calling logout API:', error);
      }
    } catch (error) {
      console.error('Error importing authAPI:', error);
    }
    
    set({ user: null, token: null, dashboardData: null, accounts: [], transactions: [] });
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      // Redirect to login page
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  setDashboardData: (data) => set({ dashboardData: data }),
  setAccounts: (accounts) => set({ accounts }),
  setTransactions: (transactions) => set({ transactions }),
}));

export default useStore;

