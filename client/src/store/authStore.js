import { create } from 'zustand';

/**
 * In-memory authentication store.
 * Strictly avoids localStorage/sessionStorage as mandated by security rules.
 */
export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuth: (user, accessToken) =>
    set({
      user,
      accessToken,
      isAuthenticated: Boolean(user && accessToken),
      isInitialized: true,
    }),

  setUser: (user) =>
    set((state) => ({
      user,
      isAuthenticated: Boolean(user && state.accessToken),
    })),

  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken,
      isAuthenticated: Boolean(state.user && accessToken),
    })),

  clearAuth: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    }),

  setInitialized: (isInitialized) =>
    set({
      isInitialized,
    }),
}));
