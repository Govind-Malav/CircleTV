import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUser, forceLogout, setUser } from '../store/authSlice';
import authService from '../services/authService';
import { userAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const [loading, setLoading] = useState(true);

  // Refresh user profile from server
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getMe();
      if (response?.data?.user) {
        dispatch(setUser(response.data.user));
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch {
      // token likely expired — forceLogout handled by axios interceptor
    }
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      const session = authService.checkLocalSession();
      if (session) {
        await refreshUser();
      }
      setLoading(false);
    };
    init();
  }, [refreshUser]);

  // Update user avatar locally
  const updateAvatar = useCallback(
    async (formData) => {
      const response = await userAPI.updateAvatar(formData);
      if (response?.data?.user) {
        dispatch(setUser(response.data.user));
      }
      return response.data;
    },
    [dispatch]
  );

  // Update banner locally
  const updateBanner = useCallback(
    async (formData) => {
      const response = await userAPI.updateBanner(formData);
      if (response?.data?.user) {
        dispatch(setUser(response.data.user));
      }
      return response.data;
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    await authService.logout();
    dispatch(forceLogout());
  }, [dispatch]);

  const value = {
    user,
    isAuthenticated,
    loading,
    refreshUser,
    updateAvatar,
    updateBanner,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
