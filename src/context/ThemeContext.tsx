import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ThemeContextType } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    try {
      const savedTheme = localStorage.getItem('bakery-theme');
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      if (savedTheme) {
        setIsDark(savedTheme === 'dark');
      } else {
        setIsDark(systemDark);
      }
    } catch (error) {
      // Handle localStorage access errors gracefully
      console.error('Failed to access localStorage:', error);
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Save theme preference to localStorage (with error handling)
    try {
      localStorage.setItem('bakery-theme', isDark ? 'dark' : 'light');
    } catch (error) {
      // Handle localStorage access errors gracefully
      console.error('Failed to save theme preference:', error);
    }
  }, [isDark]);

  const toggleTheme = (): void => {
    setIsDark(!isDark);
  };

  const value: ThemeContextType = {
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};