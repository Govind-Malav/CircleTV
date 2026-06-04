import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import {
  selectUser,
  selectIsAuthenticated,
  selectAuthLoading,
  selectAuthError,
  selectAuthSuccess,
  loginUser,
  registerUser,
  logoutUser,
  clearError,
  clearSuccess,
  setUser,
} from '../store/authSlice';

/**
 * useAuth — convenient access to all auth state and actions
 */
const useAuth = () => {
  const dispatch = useDispatch();

  const user          = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading       = useSelector(selectAuthLoading);
  const error         = useSelector(selectAuthError);
  const success       = useSelector(selectAuthSuccess);

  const login = useCallback(
    (credentials) => dispatch(loginUser(credentials)),
    [dispatch]
  );

  const register = useCallback(
    (userData) => dispatch(registerUser(userData)),
    [dispatch]
  );

  const logout = useCallback(
    () => dispatch(logoutUser()),
    [dispatch]
  );

  const dismissError = useCallback(() => dispatch(clearError()), [dispatch]);
  const dismissSuccess = useCallback(() => dispatch(clearSuccess()), [dispatch]);
  const updateUser = useCallback((data) => dispatch(setUser(data)), [dispatch]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    success,
    login,
    register,
    logout,
    dismissError,
    dismissSuccess,
    updateUser,
  };
};

export default useAuth;
export { useAuth };
