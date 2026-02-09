import axios from 'axios';

// Base URL (aligned with regular api.js strategies)
const API_BASE = process.env.NEXT_PUBLIC_API_BASE ||
    (typeof window === 'undefined' ? "http://localhost:5000/api" : "/api");
// 
// const API_BASE = (typeof window === 'undefined')
//     ? (process.env.API_PROXY_TARGET || "https://openipo-backend.onrender.com") + "/api"
//     : "/api";

const adminApi = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // Critical for HttpOnly cookies
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for auth errors
adminApi.interceptors.response.use(
    (response) => response.data,
    (error) => {
        // If 401 unauthorized (token expired/missing)
        if (error.response?.status === 401) {
            // Optionally redirect to login if we are not already there
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/admin/login')) {
                window.location.href = '/admin/login';
            }
        }
        return Promise.reject(error.response?.data || error);
    }
);

export const adminAuthAPI = {
    login: (creds) => adminApi.post('/admin/auth/login', creds),
    verify2FA: (data) => adminApi.post('/admin/auth/verify-2fa', data),
    logout: () => adminApi.post('/admin/auth/logout'),
    getMe: () => adminApi.get('/admin/auth/me'),
    setup2FA: (data) => adminApi.post('/admin/auth/2fa/setup', data), // data optional if logged in, tempToken if not
    confirm2FA: (data) => adminApi.post('/admin/auth/2fa/confirm', data),
    changePassword: (data) => adminApi.put('/admin/auth/password', data),
};

export const adminIpoAPI = {
    getAll: (params) => adminApi.get('/v2/admin/ipos', { params }),
    get: (slug) => adminApi.get(`/v2/admin/ipos/${slug}`),
    create: (data) => adminApi.post('/v2/admin/ipos', data),
    update: (slug, data) => adminApi.put(`/v2/admin/ipos/${slug}`, data),
    delete: (slug) => adminApi.delete(`/v2/admin/ipos/${slug}`),

    // Helpers for notes using the generic update

    // Toggle note requires fetching first or sending just the field?
    // Since PUT is partial in my implementation (using findOneAndUpdate with $set), sending just note.isActive is fine.
    // However, I need to know the current state to toggle? Or just strict set.
    // Let's assume the UI sends the new state or we create a specific function.
    // For now, I'll remove specific toggle and let the UI handle it via update.
};

export default adminApi;
