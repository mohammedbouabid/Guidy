// Utility functions for handling errors consistently

/**
 * Safely extracts error message from various error formats
 * @param {any} error - The error object
 * @returns {string} - Safe error message
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An error occurred';
  
  if (typeof error === 'string') return error;
  
  if (error?.message) return error.message;
  
  if (error?.error) return error.error;
  
  if (Array.isArray(error)) {
    return error.map(err => getErrorMessage(err)).join(', ');
  }
  
  // Fallback for objects
  try {
    return JSON.stringify(error);
  } catch {
    return 'An unknown error occurred';
  }
};

/**
 * Safely extracts error message for toast notifications
 * @param {any} error - The error object
 * @param {string} fallback - Fallback message
 * @returns {string} - Safe error message for toast
 */
export const getToastErrorMessage = (error, fallback = 'An error occurred') => {
  const message = getErrorMessage(error);
  return message || fallback;
};

/**
 * Safely extracts error message for console logging
 * @param {any} error - The error object
 * @returns {string} - Safe error message for console
 */
export const getConsoleErrorMessage = (error) => {
  if (!error) return 'No error provided';
  
  if (typeof error === 'string') return error;
  
  if (error?.message) return error.message;
  
  if (error?.error) return error.error;
  
  if (Array.isArray(error)) {
    return error.map(err => getConsoleErrorMessage(err)).join(', ');
  }
  
  return 'Unknown error format';
};
