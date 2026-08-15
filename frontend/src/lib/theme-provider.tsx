'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuthStore } from '@/store';

type ThemeMode = 'light' | 'dark';
type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  colorMode: ColorMode;
  setColorMode: (color: ColorMode) => void;
  colorModes: { id: ColorMode; name: string; preview: string }[];
}

const colorModes: { id: ColorMode; name: string; preview: string }[] = [
  { id: 'amber', name: 'Amber', preview: '#f59e0b' },
  { id: 'blue', name: 'Blue', preview: '#3b82f6' },
  { id: 'pink', name: 'Pink', preview: '#ec4899' },
  { id: 'rose', name: 'Rose', preview: '#f43f5e' },
  { id: 'emerald', name: 'Emerald', preview: '#10b981' },
  { id: 'black', name: 'Black', preview: '#0f172a' },
];

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  setThemeMode: () => {},
  colorMode: 'blue',
  setColorMode: () => {},
  colorModes,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');
  const { user, updateTheme, updateColorMode, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Load theme from localStorage or user preference
    const savedTheme = localStorage.getItem('app-theme') as ThemeMode;
    const savedColor = localStorage.getItem('app-color') as ColorMode;
    
    if (user?.theme) {
      setThemeModeState(user.theme as ThemeMode);
      document.documentElement.setAttribute('data-theme', user.theme);
    } else if (savedTheme) {
      setThemeModeState(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    if (user?.colorMode) {
      setColorModeState(user.colorMode as ColorMode);
      document.documentElement.setAttribute('data-color', user.colorMode);
    } else if (savedColor) {
      setColorModeState(savedColor);
      document.documentElement.setAttribute('data-color', savedColor);
    }
  }, [user]);

  const setThemeMode = async (newTheme: ThemeMode) => {
    setThemeModeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('app-theme', newTheme);

    if (isAuthenticated) {
      try {
        await updateTheme(newTheme);
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };

  const setColorMode = async (newColor: ColorMode) => {
    setColorModeState(newColor);
    document.documentElement.setAttribute('data-color', newColor);
    localStorage.setItem('app-color', newColor);

    if (isAuthenticated) {
      try {
        await updateColorMode(newColor);
      } catch (error) {
        console.error('Failed to save color preference:', error);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colorMode, setColorMode, colorModes }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
