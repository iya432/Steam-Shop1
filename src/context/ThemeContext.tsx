import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDarkModePreference, saveDarkModePreference } from '../services/userPreferencesService';
import { useAuth } from './AuthContext';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  // Initialize with saved preference or system preference
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // First check user preference
    if (user?.id) {
      const savedPreference = getDarkModePreference(userId);
      if (savedPreference !== null) {
        return savedPreference;
      }
    }

    // Check local storage (for guest users)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Update document with current theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      // Only update if user hasn't set a preference
      if (user?.id) {
        const savedPreference = getDarkModePreference(userId);
        if (savedPreference === null) {
          setIsDarkMode(mediaQuery.matches);
        }
      } else if (!localStorage.getItem('theme')) {
        setIsDarkMode(mediaQuery.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [user, userId]);

  // Save preference when it changes and user is logged in
  useEffect(() => {
    if (user?.id) {
      saveDarkModePreference(userId, isDarkMode);
    }
  }, [isDarkMode, user, userId]);

  // Toggle theme function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
