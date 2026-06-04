import { authAPI } from './api';

const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    const response = await authAPI.register(userData);
    return response.data;
  },

  /**
   * Login and persist token + user
   */
  login: async (credentials) => {
    const response = await authAPI.login(credentials);
    if (response.data?.data?.accessToken) {
      localStorage.setItem('token', response.data.data.accessToken);
    }
    if (response.data?.data?.user) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  /**
   * Logout and clear local storage
   */
  logout: async () => {
    try {
      await authAPI.logout();
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current authenticated user
   */
  getMe: async () => {
    const response = await authAPI.getMe();
    return response.data;
  },

  /**
   * Send forgot-password email
   */
  forgotPassword: async (email) => {
    const response = await authAPI.forgotPassword(email);
    return response.data;
  },

  /**
   * Reset password using emailed token
   */
  resetPassword: async (token, password) => {
    const response = await authAPI.resetPassword(token, password);
    return response.data;
  },

  /**
   * Check if user session is valid from localStorage
   */
  checkLocalSession: () => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
    return null;
  },
};

export default authService;
