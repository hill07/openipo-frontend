/**
 * Auth Storage Utilities
 * Handles sessionToken and user object in localStorage
 */

const TOKEN_KEY = 'sessionToken';
const USER_KEY = 'user';

export const authStorage = {
    // Token methods
    getToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken: (token) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(TOKEN_KEY);
    },

    // User methods
    getUser: () => {
        if (typeof window === 'undefined') return null;
        try {
            const userStr = localStorage.getItem(USER_KEY);
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            console.error('Error parsing user from storage', e);
            return null;
        }
    },

    setUser: (user) => {
        if (typeof window === 'undefined') return;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },

    removeUser: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(USER_KEY);
    },

    // Clear all auth data
    clear: () => {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    },

    // Check if authenticated
    isAuthenticated: () => {
        if (typeof window === 'undefined') return false;
        return !!localStorage.getItem(TOKEN_KEY);
    }
};
