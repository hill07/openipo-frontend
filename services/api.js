/**
 * API Service - Centralized API call
 */


// Use local network IP to allow mobile access
const API_BASE = "http://localhost:5000/api";
// const API_BASE = "https://openipo-backend.onrender.com/api";



async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  };

  // Add auth token if available (admin or regular)
  if (typeof window !== "undefined") {
    // Check for admin token first (for admin routes)
    const adminToken = localStorage.getItem("adminToken");
    const token = adminToken || localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(url, config);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || `API ${res.status}: ${res.statusText}`);
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// IPO endpoints
export const iposAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/ipos${query ? `?${query}` : ""}`);
  },

  getBySlug: (slug) => request(`/ipos/${slug}`),

  getOpen: () => request("/ipos/status/open"),
  getUpcoming: () => request("/ipos/status/upcoming"),
  getClosed: () => request("/ipos/status/closed"),
  getListedToday: () => request("/ipos/status/listed-today")
};

// Stats endpoint
export const statsAPI = {
  getDashboard: () => request("/stats")
};

// GMP endpoints
export const gmpAPI = {
  get: (slug) => request(`/gmp/${slug}`),
  getTrend: (slug) => request(`/gmp/trend/${slug}`)
};

// Subscription endpoints
export const subscriptionAPI = {
  get: (slug) => request(`/subscription/${slug}`),
  getTrend: (slug) => request(`/subscription/trend/${slug}`)
};

// Listing endpoints
export const listingAPI = {
  getToday: () => request("/listing/today"),
  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/listing/history${query ? `?${query}` : ""}`);
  }
};

// Auth endpoints
export const authAPI = {
  register: (data) => request("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  login: (data) => request("/auth/login", { method: "POST", body: JSON.stringify(data) }),
  adminLogin: (data) => request("/auth/admin/login", { method: "POST", body: JSON.stringify(data) }),
  getProfile: () => request("/auth/profile")
};

// Admin endpoints
export const adminAPI = {
  getDashboard: () => request("/admin/dashboard"),
  getAllIPOs: () => request("/admin/ipos"),
  getIPO: (id) => request(`/admin/ipos/${id}`),
  createIPO: (data) => request("/admin/ipos", { method: "POST", body: JSON.stringify(data) }),
  updateIPO: (id, data) => request(`/admin/ipos/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  deleteIPO: (id) => request(`/admin/ipos/${id}`, { method: "DELETE" })
};

// Watchlist endpoints
export const watchlistAPI = {
  get: () => request("/watchlist"),
  add: (ipoId) => request("/watchlist/add", { method: "POST", body: JSON.stringify({ ipoId }) }),
  remove: (ipoId) => request("/watchlist/remove", { method: "POST", body: JSON.stringify({ ipoId }) })
};
