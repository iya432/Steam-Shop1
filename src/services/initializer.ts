import { clearAllTransactions } from './adminService';
import { clearPendingProducts, resetAllProductsStatus } from './userProductsService';

/**
 * Resets the entire application state by clearing all temporary data
 * This is useful for ensuring the application starts in a clean state
 */
export const resetApplicationState = (): void => {
  try {
    // Reset admin data
    clearAllTransactions();

    // Reset product data
    clearPendingProducts();
    resetAllProductsStatus();

    console.log('Application state reset successfully');
  } catch (error) {
    console.error('Error resetting application state:', error);
  }
};

/**
 * Initializes the application with default settings
 * Call this function when starting the application
 */
export const initializeApplication = (): void => {
  // First reset any existing state
  resetApplicationState();

  // Set up any initial data here if needed

  console.log('Application initialized successfully');
};
