import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { AUTH_EXPIRED_EVENT, authService } from '@/services';
import { notify } from '@/shared/utils';
import type { AuthUser } from '@/types/auth';

import AuthContext, { type AuthContextValue } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef<AuthUser | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    await authService.login({
      email,
      password,
    });

    const currentUser = await authService.me();

    setUser(currentUser);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    const handleAuthExpired = () => {
      if (userRef.current) {
        notify.info('Session expired', 'Please log in again.');
      }

      setUser(null);
    };

    window.addEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);

    return () => {
      window.removeEventListener(AUTH_EXPIRED_EVENT, handleAuthExpired);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    void authService
      .me()
      .then((currentUser) => {
        if (isMounted) {
          setUser(currentUser);
        }
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          error.status === 401
        ) {
          setUser(null);
        } else {
          console.error('Failed to check authentication:', error);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
