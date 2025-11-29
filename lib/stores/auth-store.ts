import { create } from 'zustand';
import { AuthState, LoginCredentials, RegisterCredentials } from '@/lib/types/auth';

// Demo credentials (always work, even with Supabase configured)
const DEMO_EMAIL = 'demo@peraluna.com';
const DEMO_PASSWORD = 'demo123';

// Check for saved session on load
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

    // Check for demo login FIRST (before trying Supabase)
    if (credentials.email === DEMO_EMAIL && credentials.password === DEMO_PASSWORD) {
      const user = {
        id: 'demo-user',
        email: DEMO_EMAIL,
        name: 'Demo User',
        createdAt: new Date(),
      };

      localStorage.setItem('peraluna_session', JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
      return;
    }

    // Try Supabase API for non-demo users
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

      if (response.ok && data.user) {
        const user = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          createdAt: new Date(),
        };

        if (credentials.rememberMe) {
          localStorage.setItem('peraluna_session', JSON.stringify(user));
        }

        set({ user, isAuthenticated: true, isLoading: false });
        return;
      }

      // Supabase returned error
      set({ isLoading: false });
      throw new Error(data.error || 'Invalid email or password');
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
      // Ignore errors
    }
    localStorage.removeItem('peraluna_session');
    set({ user: null, isAuthenticated: false });
  },

  checkSession: () => {
    const savedUser = getSavedSession();
    if (savedUser) {
      set({ user: savedUser, isAuthenticated: true });
      return true;
    }
    return false;
  },
}));
