// src/lib/design-system/tokens.ts
// 🎨 Charlie & Lola Design System - Unified Design Tokens

export const designTokens = {
  // Color System
  colors: {
    // Primary Charlie & Lola Palette
    primary: {
      yellow: 'oklch(0.9 0.15 85)',
      orange: 'oklch(0.8 0.15 60)',
      blue: 'oklch(0.8 0.08 200)',
      pink: 'oklch(0.8 0.1 340)',
      green: 'oklch(0.85 0.15 140)',
      red: 'oklch(0.7 0.2 25)',
      brown: 'oklch(0.6 0.1 60)',
    },
    
    // Semantic Colors (Light Theme)
    light: {
      background: 'oklch(1 0 0)',
      foreground: 'oklch(0.17 0 0)',
      card: 'oklch(0.98 0.01 90)',
      cardForeground: 'oklch(0.17 0 0)',
      muted: 'oklch(0.95 0.02 90)',
      mutedForeground: 'oklch(0.4 0.02 50)',
      border: 'oklch(0.17 0 0)',
      input: 'oklch(0.98 0.01 90)',
      ring: 'oklch(0.9 0.15 85 / 0.5)',
    },
    
    // Semantic Colors (Dark Theme)  
    dark: {
      background: 'oklch(0.17 0 0)',
      foreground: 'oklch(1 0 0)',
      card: 'oklch(0.25 0.01 90)',
      cardForeground: 'oklch(1 0 0)',
      muted: 'oklch(0.3 0.02 90)',
      mutedForeground: 'oklch(0.8 0.02 90)',
      border: 'oklch(1 0 0)',
      input: 'oklch(0.25 0.01 90)',
      ring: 'oklch(0.9 0.15 85 / 0.5)',
    }
  },
  
  // Typography System
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['JetBrains Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem', 
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    }
  },
  
  // Spacing System
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    32: '8rem',
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    base: '0.5rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  // Shadow System
  shadows: {
    xs: '0px 1px 2px oklch(0.17 0 0 / 0.05)',
    sm: '0px 1px 3px oklch(0.17 0 0 / 0.1), 0px 2px 4px oklch(0.17 0 0 / 0.1)',
    md: '0px 4px 6px oklch(0.17 0 0 / 0.1), 0px 2px 4px oklch(0.17 0 0 / 0.06)',
    lg: '0px 10px 15px oklch(0.17 0 0 / 0.1), 0px 4px 6px oklch(0.17 0 0 / 0.05)',
    xl: '0px 20px 25px oklch(0.17 0 0 / 0.1), 0px 8px 10px oklch(0.17 0 0 / 0.04)',
    '2xl': '0px 25px 50px oklch(0.17 0 0 / 0.25)',
    
    // Charlie & Lola Signature Shadows
    charlie: '4px 4px 0px var(--foreground)',
    lola: '2px 2px 0px var(--foreground)',
  },
  
  // Animation & Transitions
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '1000ms',
    },
    easing: {
      linear: 'linear',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    }
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px', 
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
} as const;

export type DesignTokens = typeof designTokens;
export type ColorToken = keyof typeof designTokens.colors.primary;
export type SpacingToken = keyof typeof designTokens.spacing;
export type TypographyToken = keyof typeof designTokens.typography.fontSize;