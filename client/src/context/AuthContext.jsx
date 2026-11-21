/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, setAuthToken, getAuthToken } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => getAuthToken());
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('rk_auth_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  const [recentActivity, setRecentActivity] = useState(() => {
    const saved = localStorage.getItem('rk_admin_activity');
    return saved ? JSON.parse(saved) : [
      { id: '1', action: 'Dual-Admin session engine initialized', time: new Date().toLocaleTimeString(), type: 'auth' }
    ];
  });

  const logActivity = (action, type = 'info') => {
    const entry = {
      id: Date.now().toString(),
      action,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setRecentActivity((prev) => {
      const updated = [entry, ...prev.slice(0, 14)];
      localStorage.setItem('rk_admin_activity', JSON.stringify(updated));
      return updated;
    });
  };

  // Verify token on mount with server
  useEffect(() => {
    const verifySession = async () => {
      const existingToken = getAuthToken();
      if (!existingToken) {
        setIsLoading(false);
        return;
      }

      const res = await apiRequest('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('rk_auth_user', JSON.stringify(res.user));
      } else {
        // Token expired or invalid
        setAuthToken(null);
        setToken(null);
        setUser(null);
        localStorage.removeItem('rk_auth_user');
      }
      setIsLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password, requestedPortal = null) => {
    const res = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, requestedPortal })
    });

    if (res.success && res.token && res.user) {
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('rk_auth_user', JSON.stringify(res.user));
      logActivity(`Signed in to ${res.user.role} console as ${res.user.email}`, 'auth');
      return { success: true, user: res.user };
    }

    return {
      success: false,
      error: res.error || 'Authentication failed. Please verify credentials.'
    };
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem('rk_auth_user');
    logActivity('User signed out of administration console', 'auth');
  };

  const updateProfile = async (updates) => {
    const res = await apiRequest('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });

    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('rk_auth_user', JSON.stringify(res.user));
      logActivity('User profile details updated', 'settings');
      return { success: true, user: res.user };
    }

    return { success: false, error: res.error || 'Failed to update profile.' };
  };

  const changePassword = async (currentPassword, newPassword) => {
    const res = await apiRequest('/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword })
    });

    if (res.success) {
      logActivity('Password successfully updated', 'security');
      return { success: true };
    }

    return { success: false, error: res.error || 'Failed to update password.' };
  };

  const isAuthenticated = Boolean(user && token);
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isClientAdmin = user?.role === 'CLIENT_ADMIN' || user?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        adminUser: user, // backwards compatibility
        token,
        isAuthenticated,
        isClientAdmin,
        isSuperAdmin,
        isLoading,
        login,
        logout,
        updateProfile,
        changePassword,
        recentActivity,
        logActivity
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      adminUser: null,
      token: null,
      isAuthenticated: false,
      isClientAdmin: false,
      isSuperAdmin: false,
      isLoading: false,
      login: async () => ({ success: false }),
      logout: () => {},
      updateProfile: async () => ({ success: false }),
      changePassword: async () => ({ success: false }),
      recentActivity: [],
      logActivity: () => {}
    };
  }
  return context;
}
