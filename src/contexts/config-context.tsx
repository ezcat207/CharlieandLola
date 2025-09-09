// src/contexts/config-context.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { appConfig, type AppConfig, type FeatureFlags } from '@/lib/config/app-config';

interface ConfigContextType {
  config: AppConfig;
  isFeatureEnabled: (feature: keyof FeatureFlags) => boolean;
  isLoading: boolean;
  reload: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig>(appConfig.get());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize config
    setConfig(appConfig.get());
    setIsLoading(false);

    // Hot reload in development
    if (config.env === 'development') {
      const handleStorageChange = () => {
        appConfig.reload();
        setConfig(appConfig.get());
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [config.env]);

  const isFeatureEnabled = (feature: keyof FeatureFlags): boolean => {
    return config.features[feature];
  };

  const reload = () => {
    appConfig.reload();
    setConfig(appConfig.get());
  };

  return (
    <ConfigContext.Provider value={{
      config,
      isFeatureEnabled,
      isLoading,
      reload,
    }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}

// Specialized hooks
export function useFeatureFlags() {
  const { config, isFeatureEnabled } = useConfig();
  return {
    features: config.features,
    isEnabled: isFeatureEnabled,
  };
}

export function useEnvironment() {
  const { config } = useConfig();
  return {
    env: config.env,
    isProduction: config.env === 'production',
    isDevelopment: config.env === 'development',
    deploymentTarget: config.deploymentTarget,
  };
}

export function useServices() {
  const { config } = useConfig();
  return config.services;
}

export function useLimits() {
  const { config } = useConfig();
  return config.limits;
}

export function useCreditsConfig() {
  const { config } = useConfig();
  return config.credits;
}