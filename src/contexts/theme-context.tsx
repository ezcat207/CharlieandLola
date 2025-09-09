// src/contexts/theme-context.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { designTokens } from '@/lib/design-system/tokens';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // The actual resolved theme
  setTheme: (theme: Theme) => void;
  tokens: typeof designTokens;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // Resolve system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const updateActualTheme = () => {
      if (theme === 'system') {
        setActualTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setActualTheme(theme);
      }
    };

    updateActualTheme();
    mediaQuery.addEventListener('change', updateActualTheme);
    return () => mediaQuery.removeEventListener('change', updateActualTheme);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(actualTheme);
    
    // Update CSS custom properties
    const colors = actualTheme === 'dark' ? designTokens.colors.dark : designTokens.colors.light;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`, value);
    });
    
    // Update primary colors
    Object.entries(designTokens.colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--cl-${key}`, value);
    });
  }, [actualTheme]);

  // Load saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('charlie-lola-theme') as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      setTheme(savedTheme);
    }
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('charlie-lola-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      actualTheme,
      setTheme: handleSetTheme,
      tokens: designTokens,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Utility hook for getting themed colors
export function useThemedColors() {
  const { actualTheme, tokens } = useTheme();
  return actualTheme === 'dark' ? tokens.colors.dark : tokens.colors.light;
}

// Utility hook for responsive design
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<keyof typeof designTokens.breakpoints>('sm');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else setBreakpoint('sm');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}