import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authService } from '@/services/auth.service';
import type { AuthUser } from '@/types/auth';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await authService.me();

      setUser(currentUser);
    } catch (error) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        error.status === 401
      ) {
        setUser(null);
        return;
      }

      console.error('Failed to check authentication', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Failed to logout', error);
    }
  }, []);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      logout,
      checkAuth,
    }),
    [user, loading, logout, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
