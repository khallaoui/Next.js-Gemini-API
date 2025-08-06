// This file has been moved to auth-old.ts and is no longer used
// The new authentication system is in src/contexts/auth-context.tsx
// This file is kept for reference only

// Simple authentication utilities for Spring Security integration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  username: string;
  roles: string[];
}

// Simple authentication functions
export const auth = {
  // Login with Spring Security
  login: async (credentials: LoginCredentials): Promise<{ success: boolean; user?: User; error?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Include cookies for session management
      });

      if (response.ok) {
        const user = await response.json();
        // Store user info in localStorage for simple session management
        localStorage.setItem('cimr-user', JSON.stringify(user));
        localStorage.setItem('cimr-authenticated', 'true');
        return { success: true, user };
      } else {
        const error = await response.text();
        return { success: false, error: error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Network error' };
    }
  },

  // Logout
  logout: async (): Promise<void> => {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('cimr-user');
      localStorage.removeItem('cimr-authenticated');
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('cimr-authenticated') === 'true';
  },

  // Get current user
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('cimr-user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check user session with backend
  checkSession: async (): Promise<{ valid: boolean; user?: User }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        const user = await response.json();
        localStorage.setItem('cimr-user', JSON.stringify(user));
        localStorage.setItem('cimr-authenticated', 'true');
        return { valid: true, user };
      } else {
        // Session invalid, clear local storage
        localStorage.removeItem('cimr-user');
        localStorage.removeItem('cimr-authenticated');
        return { valid: false };
      }
    } catch (error) {
      console.error('Session check error:', error);
      // If it's a network error and we have local auth, consider it valid for now
      if (error instanceof Error && (error.name === 'AbortError' || error.message.includes('fetch'))) {
        const localAuth = localStorage.getItem('cimr-authenticated') === 'true';
        if (localAuth) {
          console.log('Network error but local auth exists, considering valid');
          return { valid: true, user: auth.getCurrentUser() || undefined };
        }
      }
      return { valid: false };
    }
  },
};