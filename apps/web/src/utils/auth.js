import { useState, useEffect } from 'react';

const AUTH_KEY = 'svms_session';

export function getSession() {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEY) || 'null');
  } catch {
    return null;
  }
}

export function setSession(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_KEY);
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUser(getSession());
    setLoading(false);
  }, []);

  const logout = () => {
    clearSession();
    window.location.href = '/login';
  };

  return {
    user,
    loading,
    isAdmin: user?.role === 'admin',
    isPetugas: user?.role === 'petugas',
    logout,
  };
}
