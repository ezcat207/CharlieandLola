// src/components/ui/UnifiedSection.tsx
'use client';

import React from 'react';
import { useTheme } from '@/contexts/theme-context';
import { cn } from '@/lib/utils';

interface UnifiedSectionProps {
  children: React.ReactNode;
  
  // Layout & Spacing
  className?: string;
  id?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  
  // Visual
  background?: 'default' | 'muted' | 'card' | 'gradient' | 'accent' | 'transparent';
  border?: boolean;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'charlie' | 'lola';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  
  // Header
  title?: string;
  subtitle?: string;
  description?: string;
  label?: string;
  
  // Behavior
  variant?: 'default' | 'hero' | 'feature' | 'content' | 'card';
  textAlign?: 'left' | 'center' | 'right';
  
  // Animation
  animated?: boolean;
  animationDelay?: number;
}

const spacingClasses = {
  none: '',
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
  xl: 'py-32',
};

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
};

const maxWidthClasses = {
  sm: 'max-w-2xl mx-auto',
  md: 'max-w-4xl mx-auto',
  lg: 'max-w-6xl mx-auto',
  xl: 'max-w-7xl mx-auto',
  '2xl': 'max-w-8xl mx-auto',
  full: 'max-w-none',
};

const roundedClasses = {
  none: '',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const shadowClasses = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  charlie: 'shadow-charlie',
  lola: 'shadow-lola',
};

const textAlignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function UnifiedSection({
  children,
  className = '',
  id,
  spacing = 'md',
  padding = 'none',
  maxWidth = 'xl',
  background = 'default',
  border = false,
  shadow = 'none',
  rounded = 'none',
  title,
  subtitle,
  description,
  label,
  variant = 'default',
  textAlign = 'left',
  animated = false,
  animationDelay = 0,
}: UnifiedSectionProps) {
  const { actualTheme, tokens } = useTheme();
  
  const getBackgroundStyles = () => {
    switch (background) {
      case 'muted':
        return 'bg-muted';
      case 'card':
        return 'bg-card border border-border';
      case 'gradient':
        return 'bg-gradient-to-r from-cl-yellow/10 to-cl-pink/10';
      case 'accent':
        return 'bg-cl-yellow/5';
      case 'transparent':
        return 'bg-transparent';
      default:
        return 'bg-background';
    }
  };
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return 'min-h-[60vh] flex flex-col justify-center';
      case 'feature':
        return 'relative overflow-hidden';
      case 'content':
        return 'prose prose-lg max-w-none';
      case 'card':
        return 'bg-card border-2 border-border shadow-charlie transition-all hover:shadow-lola hover:translate-y-[-2px]';
      default:
        return '';
    }
  };

  const animationClass = animated 
    ? 'opacity-0 translate-y-8 animate-fade-in-up' 
    : '';

  const sectionHeader = (title || subtitle || description || label) && (
    <header className={cn('mb-8', textAlignClasses[textAlign])}>
      {label && (
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 bg-cl-yellow/20 rounded-full border border-cl-yellow">
          <span className="text-cl-yellow text-sm font-medium uppercase tracking-wide">
            {label}
          </span>
        </div>
      )}
      
      {title && (
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground leading-tight">
          {title}
        </h2>
      )}
      
      {subtitle && (
        <h3 className="text-xl md:text-2xl font-semibold mb-4 text-muted-foreground">
          {subtitle}
        </h3>
      )}
      
      {description && (
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </header>
  );

  return (
    <section
      id={id}
      className={cn(
        'relative',
        spacingClasses[spacing],
        paddingClasses[padding],
        getBackgroundStyles(),
        getVariantStyles(),
        border && 'border border-border',
        shadowClasses[shadow],
        roundedClasses[rounded],
        animationClass,
        className
      )}
      style={animated ? { animationDelay: `${animationDelay}ms` } : undefined}
    >
      <div className={maxWidthClasses[maxWidth]}>
        {sectionHeader}
        <div className={textAlignClasses[textAlign]}>
          {children}
        </div>
      </div>
    </section>
  );
}

// Specialized Section Components
export function HeroSection(props: Omit<UnifiedSectionProps, 'variant'>) {
  return <UnifiedSection {...props} variant="hero" spacing="xl" textAlign="center" />;
}

export function FeatureSection(props: Omit<UnifiedSectionProps, 'variant'>) {
  return <UnifiedSection {...props} variant="feature" background="muted" />;
}

export function ContentSection(props: Omit<UnifiedSectionProps, 'variant'>) {
  return <UnifiedSection {...props} variant="content" />;
}

export function CardSection(props: Omit<UnifiedSectionProps, 'variant'>) {
  return <UnifiedSection {...props} variant="card" padding="lg" rounded="lg" />;
}