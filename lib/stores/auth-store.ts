import { create } from 'zustand';
import { AuthState, LoginCredentials, RegisterCredentials } from '@/lib/types/auth';

// Check for saved session on load (for initial hydration)
const getSavedSession = () => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('peraluna_session');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        set({ isLoading: false });
        throw new Error(data.error || 'Login failed');
      }

      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        createdAt: new Date(),
      };

      // Save session for hydration (Supabase handles actual session via cookies)
      if (credentials.rememberMe) {
        localStorage.setItem('peraluna_session', JSON.stringify(user));
      }

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true });
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          name: credentials.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        set({ isLoading: false });
        throw new Error(data.error || 'Registration failed');
      }

      // If email confirmation is required
      if (data.requiresConfirmation) {
        set({ isLoading: false });
        throw new Error(data.message || 'Please check your email to confirm your account');
      }

      const user = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        createdAt: new Date(),
      };

      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore logout API errors
    }
    localStorage.removeItem('peraluna_session');
    set({ user: null, isAuthenticated: false });
  },

  // Check and restore saved session
  checkSession: () => {
    const savedUser = getSavedSession();
    if (savedUser) {
      set({ user: savedUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
}));
