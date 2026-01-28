/**
 * Auth Service
 * Handles Login, Register, Logout
 */
import api from './api';
import { authStorage } from '../utils/authStorage';

export const authService = {
    /**
     * Register new user
     * @param {Object} data { name, email, password }
     */
    register: async (data) => {
        try {
            const response = await api.post('/auth/register', data);
            if (response.sessionToken && response.user) {
                authStorage.setToken(response.sessionToken);
                authStorage.setUser(response.user);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Login user
     * @param {Object} data { email, password }
     */
    login: async (data) => {
        try {
            const response = await api.post('/auth/login', data);
            if (response.sessionToken && response.user) {
                authStorage.setToken(response.sessionToken);
                authStorage.setUser(response.user);
            }
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Logout user
     */
    logout: () => {
        authStorage.clear();
        // Optional: Redirect or reload is handled by component or page
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },

    /**
     * Check if logged in
     */
    isLoggedIn: () => {
        return authStorage.isAuthenticated();
    },

    /**
     * Get current user
     */
    getUser: () => {
        return authStorage.getUser();
    }
};
