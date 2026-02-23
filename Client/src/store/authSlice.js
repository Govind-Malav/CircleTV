import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../services/api';

// Login thunk - handles the login API call
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login({ email, password });
      // Store token and user in localStorage for persistence
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Register thunk - handles new user registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Logout thunk - clears user data
export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    try {
      await authAPI.logout();
    } finally {
      // Always clear local storage, even if API fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
);

// Check auth status on app load
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        return {
          token,
          user: JSON.parse(user)
        };
      }
      return rejectWithValue('No token found');
    } catch (error) {
      return rejectWithValue('Auth check failed');
    }
  }
);

// INITIAL STATE
const initialState = {
  user: null,              // Logged in user's data
  token: null,             // JWT token for API calls
  isAuthenticated: false,  // Whether user is logged in
  loading: false,          // Loading state for API calls
  error: null,             // Error message if any
  success: false,          // Success state for operations
};

// AUTH SLICE
const authSlice = createSlice({
  name: 'auth',
  initialState,
  
  // Reducers - synchronous actions
  reducers: {
    // Clear any error messages
    clearError: (state) => {
      state.error = null;
    },
    
    // Clear success state
    clearSuccess: (state) => {
      state.success = false;
    },
    
    // Manually set user (used after profile update)
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    
    // Logout without API call (used for forced logout)
    forceLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  
  // Extra reducers - handle async thunk actions
  extraReducers: (builder) => {
    builder
      // ===== LOGIN CASES =====
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // ===== REGISTER CASES =====
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        // Note: User not logged in automatically - they must login
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // ===== LOGOUT CASES =====
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // ===== CHECK AUTH CASES =====
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

// SELECTORS - Helper functions to get state
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthSuccess = (state) => state.auth.success;

// EXPORTS
export const { clearError, clearSuccess, setUser, forceLogout } = authSlice.actions;
export default authSlice.reducer;