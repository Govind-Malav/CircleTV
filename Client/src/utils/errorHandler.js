import toast from 'react-hot-toast';

/**
 * handleAPIError — extract message from axios error and optionally toast it
 */
export const handleAPIError = (error, showToast = true) => {
  const message =
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'Something went wrong';

  if (showToast) {
    toast.error(message);
  }

  // Log in development
  if (import.meta.env.MODE === 'development') {
    console.error('[API Error]', message, error);
  }

  return message;
};

/**
 * handleSuccess — show a success toast
 */
export const handleSuccess = (message) => {
  toast.success(message);
};

/**
 * isNetworkError — check if error is a network failure
 */
export const isNetworkError = (error) => {
  return !error.response && error.request;
};

/**
 * isAuthError — 401 Unauthorized
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401;
};

/**
 * isForbiddenError — 403 Forbidden
 */
export const isForbiddenError = (error) => {
  return error?.response?.status === 403;
};

/**
 * isNotFoundError — 404 Not Found
 */
export const isNotFoundError = (error) => {
  return error?.response?.status === 404;
};

/**
 * isValidationError — 400 Bad Request / 422 Unprocessable
 */
export const isValidationError = (error) => {
  return [400, 422].includes(error?.response?.status);
};
