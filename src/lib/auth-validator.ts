// src/lib/auth-validator.ts
// 🔧 Authentication Configuration Validator

export interface AuthValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

export function validateAuthConfiguration(): AuthValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const suggestions: string[] = [];

  // Check required environment variables
  const requiredEnvVars = [
    'AUTH_SECRET',
    'AUTH_URL',
    'NEXT_PUBLIC_WEB_URL'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      errors.push(`Missing required environment variable: ${envVar}`);
    }
  }

  // Validate AUTH_URL
  const authUrl = process.env.AUTH_URL;
  if (authUrl) {
    // Check for double slashes
    if (authUrl.includes('//api/auth')) {
      errors.push('AUTH_URL contains double slashes: should be "https://domain.com/api/auth"');
    }
    
    // Check HTTPS in production
    if (process.env.NODE_ENV === 'production' && authUrl.startsWith('http://')) {
      errors.push('AUTH_URL should use HTTPS in production');
    }
    
    // Check proper ending
    if (!authUrl.endsWith('/api/auth')) {
      warnings.push('AUTH_URL should end with "/api/auth"');
    }
  }

  // Validate Web URL
  const webUrl = process.env.NEXT_PUBLIC_WEB_URL;
  if (webUrl) {
    if (process.env.NODE_ENV === 'production' && webUrl.startsWith('http://')) {
      errors.push('NEXT_PUBLIC_WEB_URL should use HTTPS in production');
    }
    
    if (webUrl.endsWith('/')) {
      warnings.push('NEXT_PUBLIC_WEB_URL should not end with a trailing slash');
    }
  }

  // Check Google Auth configuration
  const googleEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ENABLED === 'true';
  const googleOneTapEnabled = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ONE_TAP_ENABLED === 'true';
  
  if (googleEnabled || googleOneTapEnabled) {
    if (!process.env.AUTH_GOOGLE_ID) {
      errors.push('Google Auth enabled but AUTH_GOOGLE_ID is missing');
    }
    
    if (!process.env.AUTH_GOOGLE_SECRET && googleEnabled) {
      errors.push('Google Auth enabled but AUTH_GOOGLE_SECRET is missing');
    }
    
    if (!process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID) {
      errors.push('Google One Tap enabled but NEXT_PUBLIC_AUTH_GOOGLE_ID is missing');
    }

    // Check client ID format
    const clientId = process.env.AUTH_GOOGLE_ID;
    if (clientId && !clientId.includes('.apps.googleusercontent.com')) {
      warnings.push('Google Client ID format may be incorrect - should end with .apps.googleusercontent.com');
    }

    // Consistency check
    const publicClientId = process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID;
    if (clientId && publicClientId && clientId !== publicClientId) {
      errors.push('AUTH_GOOGLE_ID and NEXT_PUBLIC_AUTH_GOOGLE_ID should be the same');
    }
  }

  // Check GitHub Auth configuration  
  const githubEnabled = process.env.NEXT_PUBLIC_AUTH_GITHUB_ENABLED === 'true';
  if (githubEnabled) {
    if (!process.env.AUTH_GITHUB_ID) {
      errors.push('GitHub Auth enabled but AUTH_GITHUB_ID is missing');
    }
    
    if (!process.env.AUTH_GITHUB_SECRET) {
      errors.push('GitHub Auth enabled but AUTH_GITHUB_SECRET is missing');
    }
  }

  // Suggestions
  if (googleOneTapEnabled) {
    suggestions.push('For Google One Tap, ensure your domain is verified in Google Cloud Console');
    suggestions.push('Add /.well-known/web-identity file for FedCM support');
  }

  if (process.env.NODE_ENV === 'production') {
    suggestions.push('Verify OAuth redirect URLs in Google/GitHub console match your production domain');
    suggestions.push('Test authentication flow after deployment');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    suggestions
  };
}

// Console validator for development
export function logAuthValidation(): void {
  const result = validateAuthConfiguration();
  
  console.log('🔧 Auth Configuration Validation');
  console.log('================================');
  
  if (result.isValid) {
    console.log('✅ Configuration is valid!');
  } else {
    console.log('❌ Configuration has errors:');
    result.errors.forEach(error => console.log(`   • ${error}`));
  }
  
  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`   • ${warning}`));
  }
  
  if (result.suggestions.length > 0) {
    console.log('💡 Suggestions:');
    result.suggestions.forEach(suggestion => console.log(`   • ${suggestion}`));
  }
  
  console.log('================================');
}

// Runtime check function
export function checkAuthConfiguration(): boolean {
  const result = validateAuthConfiguration();
  
  if (!result.isValid && process.env.NODE_ENV === 'development') {
    console.warn('Auth configuration issues detected:');
    result.errors.forEach(error => console.warn(`❌ ${error}`));
  }
  
  return result.isValid;
}