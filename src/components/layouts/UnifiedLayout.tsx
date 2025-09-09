// src/components/layouts/UnifiedLayout.tsx
'use client';

import React from 'react';
import { ThemeProvider } from '@/contexts/theme-context';
import { useThemedColors } from '@/contexts/theme-context';
import { designTokens } from '@/lib/design-system/tokens';
import { cn } from '@/lib/utils';

interface UnifiedLayoutProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'hero' | 'section' | 'console' | 'admin';
  background?: 'default' | 'gradient' | 'pattern' | 'transparent';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

const spacingClasses = {
  none: '',
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
  xl: 'py-32',
};

const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-4xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-8xl',
  full: 'max-w-none',
};

export function UnifiedLayoutInner({
  children,
  className = '',
  variant = 'default',
  background = 'default',
  spacing = 'md',
  maxWidth = 'xl',
}: UnifiedLayoutProps) {
  const colors = useThemedColors();
  
  const getBackgroundStyles = () => {
    switch (background) {
      case 'gradient':
        return 'bg-gradient-to-br from-cl-yellow/10 via-transparent to-cl-pink/10';
      case 'pattern':
        return 'bg-background bg-[url("/pattern.svg")] bg-repeat';
      case 'transparent':
        return 'bg-transparent';
      default:
        return 'bg-background';
    }
  };
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return 'min-h-screen flex flex-col justify-center';
      case 'section':
        return 'relative overflow-hidden';
      case 'console':
        return 'min-h-screen bg-muted/5';
      case 'admin':
        return 'min-h-screen bg-sidebar';
      default:
        return '';
    }
  };

  return (
    <div
      className={cn(
        'relative',
        getBackgroundStyles(),
        getVariantStyles(),
        className
      )}
      style={{
        '--background': colors.background,
        '--foreground': colors.foreground,
        '--card': colors.card,
        '--muted': colors.muted,
      } as React.CSSProperties}
    >
      <div 
        className={cn(
          'container mx-auto px-4',
          spacingClasses[spacing],
          maxWidthClasses[maxWidth]
        )}
      >
        {children}
      </div>
    </div>
  );
}

// Wrapped with Theme Provider
export function UnifiedLayout(props: UnifiedLayoutProps) {
  return (
    <ThemeProvider>
      <UnifiedLayoutInner {...props} />
    </ThemeProvider>
  );
}

// Specialized Layout Components
export function HeroLayout(props: Omit<UnifiedLayoutProps, 'variant'>) {
  return <UnifiedLayout {...props} variant="hero" background="gradient" />;
}

export function SectionLayout(props: Omit<UnifiedLayoutProps, 'variant'>) {
  return <UnifiedLayout {...props} variant="section" />;
}

export function ConsoleLayout(props: Omit<UnifiedLayoutProps, 'variant'>) {
  return <UnifiedLayout {...props} variant="console" spacing="lg" />;
}

export function AdminLayout(props: Omit<UnifiedLayoutProps, 'variant'>) {
  return <UnifiedLayout {...props} variant="admin" spacing="lg" />;
}