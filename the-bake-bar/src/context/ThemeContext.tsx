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
    const savedTheme = localStorage.getItem('bakery-theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(systemDark);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bakery-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bakery-theme', 'light');
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