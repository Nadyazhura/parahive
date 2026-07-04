import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { apiClient, clearStoredTokens, getStoredAccessToken, getStoredRefreshToken, setStoredTokens } from '@/lib/api-client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken());
  const [refreshToken, setRefreshToken] = useState(() => getStoredRefreshToken());
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [status, setStatus] = useState(accessToken ? 'loading' : 'anonymous');
  const [error, setError] = useState(null);

  const applySession = useCallback((session) => {
    setStoredTokens(session);
    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken ?? getStoredRefreshToken());
    setUser(session.user ?? null);
    setPermissions(session.permissions ?? []);
    setStatus('authenticated');
    setError(null);
  }, []);

  const clearSession = useCallback(() => {
    clearStoredTokens();
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    setPermissions([]);
    setStatus('anonymous');
  }, []);

  const loadCurrentUser = useCallback(async () => {
    const token = getStoredAccessToken();

    if (!token) {
      clearSession();
      return;
    }

    setStatus('loading');

    try {
      const result = await apiClient.auth.me(token);
      setAccessToken(token);
      setUser(result.user);
      setPermissions(result.permissions ?? []);
      setStatus('authenticated');
      setError(null);
    } catch (requestError) {
      clearSession();
      setError(requestError);
    }
  }, [clearSession]);

  const signIn = useCallback(
    async ({ loginOrEmail, password }) => {
      setStatus('loading');

      try {
        const result = await apiClient.auth.login({ loginOrEmail, password });
        setStoredTokens(result);
        const current = await apiClient.auth.me(result.accessToken);

        applySession({
          ...result,
          user: current.user,
          permissions: current.permissions,
        });
        return {
          ...result,
          user: current.user,
          permissions: current.permissions,
        };
      } catch (requestError) {
        setStatus('anonymous');
        setError(requestError);
        throw requestError;
      }
    },
    [applySession],
  );

  const signOut = useCallback(async () => {
    const token = getStoredAccessToken();

    try {
      if (token) {
        await apiClient.auth.logout(token);
      }
    } finally {
      clearSession();
    }
  }, [clearSession]);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const value = useMemo(
    () => ({
      accessToken,
      refreshToken,
      user,
      permissions,
      status,
      error,
      isAuthenticated: status === 'authenticated',
      hasPermission: (permission) => !permission || permissions.includes(permission),
      loadCurrentUser,
      signIn,
      signOut,
      clearSession,
    }),
    [accessToken, refreshToken, user, permissions, status, error, loadCurrentUser, signIn, signOut, clearSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }

  return context;
}
