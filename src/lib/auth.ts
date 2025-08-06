// This file is deprecated - use the AuthProvider context instead
// Located at: src/contexts/auth-context.tsx

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  username: string;
  roles: string[];
}

// Deprecated - use useAuth() hook instead
export const auth = {
  login: async (credentials: LoginCredentials) => {
    console.warn('auth.login is deprecated - use useAuth() hook instead');
    return { success: false, error: 'Use useAuth() hook instead' };
  },
  
  logout: async () => {
    console.warn('auth.logout is deprecated - use useAuth() hook instead');
  },
  
  isAuthenticated: () => {
    console.warn('auth.isAuthenticated is deprecated - use useAuth() hook instead');
    return false;
  },
  
  getCurrentUser: () => {
    console.warn('auth.getCurrentUser is deprecated - use useAuth() hook instead');
    return null;
  },
  
  checkSession: async () => {
    console.warn('auth.checkSession is deprecated - use useAuth() hook instead');
    return { valid: false };
  }
};