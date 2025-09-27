/**
 * Environment detection utilities
 * Helps handle differences between server-side and client-side rendering
 */

/**
 * Check if the code is running in a browser environment
 */
export const isBrowser = (): boolean => {
  return (
    typeof window !== 'undefined' &&
    typeof window.document !== 'undefined' &&
    typeof window.localStorage !== 'undefined'
  );
};

/**
 * Safely access browser APIs
 * Returns a default value if not in a browser environment
 */
export const safeBrowserAccess = <T>(
  accessor: () => T,
  defaultValue: T
): T => {
  return isBrowser() ? accessor() : defaultValue;
};

/**
 * Run a callback only in the browser
 */
export const runInBrowser = (callback: () => void): void => {
  if (isBrowser()) {
    callback();
  }
};

/**
 * Get a value from localStorage safely
 */
export const getLocalStorage = (key: string, defaultValue: any = null): any => {
  if (!isBrowser()) return defaultValue;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error accessing localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Set a value in localStorage safely
 */
export const setLocalStorage = (key: string, value: any): void => {
  if (!isBrowser()) return;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};
