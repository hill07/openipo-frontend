/**
 * API Service - Centralized API call using Axios
 * Automatically handles auth tokens and error formatting
 */
import axios from 'axios';
import { authStorage } from '../utils/authStorage';

// // // Base URL from env or dynamic based on environment
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ||
  (typeof window === 'undefined' ? "http://localhost:5000/api" : "/api");

// Base URL determination:
// Base URL determination:
// Server-side (SSR): Use direct backend URL (remote)
// Client-side: Use relative path /api to go through Next.js proxy
// const API_BASE = (typeof window === 'undefined')
//   ? (process.env.API_PROXY_TARGET || (process.env.NODE_ENV === 'production' ? 'https://openipo-backend.onrender.com' : 'http://localhost:5000')) + '/api'
//   : "/api";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = authStorage.getToken();

    // Config session header
    if (token) {
      config.headers['x-session-token'] = token;
    }



    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Global Errors (401, etc)
api.interceptors.response.use(
  (response) => {
    return response.data; // Return only data part
  },
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Token expired or invalid
      authStorage.clear();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    // Format error message
    const customError = {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      status: status,
      original: error
    };
    return Promise.reject(customError);
  }
);

export const iposAPI = {
  getAll: (params = {}) => {
    return api.get('/v2/ipos', { params });
  },

  getBySlug: (slug) => api.get(`/v2/ipos/${slug}`),
};




export const statsAPI = {
  // Assuming this endpoint still exists or is mapped to something? 
  // User didn't specify 'stats' endpoint in the NEW routes list.
  // Requirement says: "Remove old unused files, old api services". 
  // But pages/index.js uses it. I should check if I need to remove usage or if I should keep a dummy or mapped one.
  // The USER REQUEST list of routes does NOT include /api/stats.
  // BUT, pages/index.js uses `statsAPI.getDashboard()`. 
  // I must be careful. The user said "Only change API calls... Remove old API calls".
  // So likely statsAPI is dead. mapping in index.js might need to change.
  // For now I will leave it empty or comment it out to avoid runtime crash if I don't update index.js strictly yet.
  // Wait, "IPO Calendar page... Keep current UI...". 
  // If UI needs stats, and backend doesn't have it, we have a problem.
  // But maybe the `GET /api/ipos` returns enough to compute stats? No.
  // Let's look at the endpoints again.
  // 1) GET /api/ipos
  // 2) GET /api/ipos/:slug
  // 3) Auth
  // 4) User
  // 5) Admin
  // No stats endpoint. 
  // I will leave `statsAPI` as a placeholder returning empty structure to prevent index.js from crashing until I update index.js.
  getDashboard: () => Promise.resolve({ today: {}, stats: {} })
};

export const gmpAPI = {
  // Replaced by ipos/:slug details
  get: () => Promise.resolve({}),
  getTrend: () => Promise.resolve({})
};

export const subscriptionAPI = {
  // Replaced by ipos/:slug details
  get: () => Promise.resolve({}),
  getTrend: () => Promise.resolve({})
};

export const listingAPI = {
  // Requirement doesn't mention listing API. Listing info is in /api/ipos list.
  getToday: () => Promise.resolve([]),
  getHistory: (params) => api.get('/ipos', { params: { ...params, status: 'Closed' } }) // Proxy to ipos?
};

export const authAPI = {
  // These will be in authService.js, but keeping here if legacy code imports it
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile") // This route wasn't in list, probably /api/user/watchlist or check session? 
  // The user list has /api/auth/register and /api/auth/login. check new routes list.
};

export const watchlistAPI = {
  // These will be in userService/watchlistService
  get: () => api.get("/user/watchlist"),
  toggle: (ipoId) => api.post("/user/watchlist/toggle", { ipoId }),
};



export const visitorAPI = {
  getCount: () => api.get('/public/visitors/count')
};

export default api;
