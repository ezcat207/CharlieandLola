// src/lib/config/app-config.ts
// 🔧 Unified Application Configuration Management

// Environment types
export type Environment = 'development' | 'staging' | 'production';
export type DeploymentTarget = 'vercel' | 'cloudflare' | 'docker' | 'local';

// Feature flags interface
export interface FeatureFlags {
  // Core features
  imageGeneration: boolean;
  creditSystem: boolean;
  userAuthentication: boolean;
  shareFeature: boolean;
  
  // Social features  
  charlieLolaHashtag: boolean;
  tiktokIntegration: boolean;
  socialSharing: boolean;
  
  // Premium features
  premiumModels: boolean;
  priorityQueue: boolean;
  highResDownload: boolean;
  customPrompts: boolean;
  
  // Admin features
  adminDashboard: boolean;
  userManagement: boolean;
  analyticsTracking: boolean;
  
  // Experimental
  newThemeSystem: boolean;
  enhancedI18n: boolean;
  advancedImagegen: boolean;
}

// Application configuration
export interface AppConfig {
  // Environment
  env: Environment;
  deploymentTarget: DeploymentTarget;
  version: string;
  buildTime: string;
  
  // URLs
  baseUrl: string;
  cdnUrl: string;
  apiUrl: string;
  
  // Core settings
  defaultLocale: string;
  supportedLocales: string[];
  defaultTheme: 'light' | 'dark' | 'system';
  
  // Business logic
  credits: {
    newUserBonus: number;
    imageGenerationCost: number;
    maxFreeGenerations: number;
  };
  
  // Limits
  limits: {
    maxImageUploads: number;
    maxImageSize: number; // in MB
    rateLimitPerHour: number;
    sessionTimeout: number; // in minutes
  };
  
  // External services
  services: {
    gemini: {
      enabled: boolean;
      model: string;
      maxTokens: number;
    };
    stripe: {
      enabled: boolean;
      publishableKey: string;
    };
    analytics: {
      googleAnalyticsId: string;
      pixelId?: string;
    };
    storage: {
      r2Bucket: string;
      cdnDomain: string;
    };
  };
  
  // Feature flags
  features: FeatureFlags;
  
  // Security
  security: {
    corsOrigins: string[];
    rateLimitEnabled: boolean;
    requireAuth: boolean;
  };
  
  // Authentication
  auth: {
    googleEnabled: boolean;
    googleOneTapEnabled: boolean;
    githubEnabled: boolean;
    credentialsEnabled: boolean;
    authUrl: string;
    webUrl: string;
  };
}

// Default configuration
const defaultConfig: AppConfig = {
  env: (process.env.NODE_ENV as Environment) || 'development',
  deploymentTarget: (process.env.DEPLOYMENT_TARGET as DeploymentTarget) || 'local',
  version: process.env.npm_package_version || '1.0.0',
  buildTime: new Date().toISOString(),
  
  baseUrl: process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000',
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL || 'https://cdn.charlielola.com',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api',
  
  defaultLocale: 'en',
  supportedLocales: ['en', 'zh'],
  defaultTheme: 'system',
  
  credits: {
    newUserBonus: 30,
    imageGenerationCost: 10, 
    maxFreeGenerations: 5,
  },
  
  limits: {
    maxImageUploads: 5,
    maxImageSize: 10, // 10MB
    rateLimitPerHour: 100,
    sessionTimeout: 60, // 1 hour
  },
  
  services: {
    gemini: {
      enabled: !!process.env.OPENAI_API_KEY,
      model: 'gemini-2.5-flash-image-preview',
      maxTokens: 4000,
    },
    stripe: {
      enabled: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
    },
    analytics: {
      googleAnalyticsId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID || 'G-W1B7E18M9M',
      pixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID,
    },
    storage: {
      r2Bucket: process.env.R2_BUCKET || 'pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev',
      cdnDomain: process.env.CDN_DOMAIN || 'cdn.charlielola.com',
    },
  },
  
  features: {
    // Core features
    imageGeneration: true,
    creditSystem: true,
    userAuthentication: true,
    shareFeature: true,
    
    // Social features
    charlieLolaHashtag: true,
    tiktokIntegration: false, // Not implemented yet
    socialSharing: true,
    
    // Premium features
    premiumModels: false, // Future feature
    priorityQueue: true,
    highResDownload: true,
    customPrompts: true,
    
    // Admin features
    adminDashboard: true,
    userManagement: true,
    analyticsTracking: true,
    
    // Experimental (controlled by env vars)
    newThemeSystem: process.env.FEATURE_NEW_THEME === 'true',
    enhancedI18n: process.env.FEATURE_ENHANCED_I18N === 'true',
    advancedImagegen: process.env.FEATURE_ADVANCED_IMAGEGEN === 'true',
  },
  
  security: {
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    rateLimitEnabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    requireAuth: process.env.REQUIRE_AUTH === 'true',
  },
  
  auth: {
    googleEnabled: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === 'true',
    googleOneTapEnabled: process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED === 'true',
    githubEnabled: process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === 'true',
    credentialsEnabled: process.env.NEXT_PUBLIC_AUTH_CREDENTIALS_ENABLED === 'true',
    authUrl: process.env.AUTH_URL || '',
    webUrl: process.env.NEXT_PUBLIC_WEB_URL || '',
  },
};

// Configuration loader with environment overrides
class ConfigManager {
  private config: AppConfig;
  
  constructor() {
    this.config = this.loadConfig();
  }
  
  private loadConfig(): AppConfig {
    // Start with default config
    let config = { ...defaultConfig };
    
    // Environment-specific overrides
    switch (config.env) {
      case 'development':
        config = this.applyDevelopmentOverrides(config);
        break;
      case 'staging':
        config = this.applyStagingOverrides(config);
        break;
      case 'production':
        config = this.applyProductionOverrides(config);
        break;
    }
    
    // Deployment target overrides
    switch (config.deploymentTarget) {
      case 'cloudflare':
        config = this.applyCloudflareOverrides(config);
        break;
      case 'vercel':
        config = this.applyVercelOverrides(config);
        break;
    }
    
    return config;
  }
  
  private applyDevelopmentOverrides(config: AppConfig): AppConfig {
    return {
      ...config,
      security: {
        ...config.security,
        rateLimitEnabled: false,
      },
      features: {
        ...config.features,
        newThemeSystem: true, // Enable in dev
        enhancedI18n: true, // Enable in dev
      },
    };
  }
  
  private applyStagingOverrides(config: AppConfig): AppConfig {
    return {
      ...config,
      limits: {
        ...config.limits,
        rateLimitPerHour: 50, // Lower limits for staging
      },
    };
  }
  
  private applyProductionOverrides(config: AppConfig): AppConfig {
    return {
      ...config,
      security: {
        ...config.security,
        rateLimitEnabled: true,
      },
      features: {
        ...config.features,
        // Disable experimental features in production
        newThemeSystem: false,
        enhancedI18n: false,
        advancedImagegen: false,
      },
    };
  }
  
  private applyCloudflareOverrides(config: AppConfig): AppConfig {
    return {
      ...config,
      services: {
        ...config.services,
        // Cloudflare-specific service configurations
      },
    };
  }
  
  private applyVercelOverrides(config: AppConfig): AppConfig {
    return {
      ...config,
      services: {
        ...config.services,
        // Vercel-specific service configurations
      },
    };
  }
  
  // Public API
  get(): AppConfig {
    return this.config;
  }
  
  getFeature(feature: keyof FeatureFlags): boolean {
    return this.config.features[feature];
  }
  
  isProduction(): boolean {
    return this.config.env === 'production';
  }
  
  isDevelopment(): boolean {
    return this.config.env === 'development';
  }
  
  getBaseUrl(): string {
    return this.config.baseUrl;
  }
  
  getCdnUrl(): string {
    return this.config.cdnUrl;
  }
  
  getAuthConfig() {
    return this.config.auth;
  }
  
  isAuthEnabled(provider?: 'google' | 'github' | 'credentials' | 'google-one-tap'): boolean {
    if (!provider) {
      return this.config.auth.googleEnabled || 
             this.config.auth.githubEnabled || 
             this.config.auth.credentialsEnabled;
    }
    
    switch (provider) {
      case 'google': return this.config.auth.googleEnabled;
      case 'google-one-tap': return this.config.auth.googleOneTapEnabled;
      case 'github': return this.config.auth.githubEnabled;
      case 'credentials': return this.config.auth.credentialsEnabled;
      default: return false;
    }
  }
  
  // Hot reload config in development
  reload() {
    if (this.config.env === 'development') {
      this.config = this.loadConfig();
    }
  }
}

// Singleton instance
export const appConfig = new ConfigManager();

// Export the config for direct access
export const config = appConfig.get();

// Utility functions
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  return appConfig.getFeature(feature);
}

export function getEnvironment(): Environment {
  return appConfig.get().env;
}

export function isProduction(): boolean {
  return appConfig.isProduction();
}

export function isDevelopment(): boolean {
  return appConfig.isDevelopment();
}