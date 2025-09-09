// src/app/api/auth/validate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { validateAuthConfiguration } from '@/lib/auth-validator';

export async function GET(request: NextRequest) {
  // Only allow in development or with special header
  const isDevelopment = process.env.NODE_ENV === 'development';
  const hasValidationHeader = request.headers.get('x-auth-validate') === 'true';
  
  if (!isDevelopment && !hasValidationHeader) {
    return NextResponse.json({ error: 'Not allowed' }, { status: 403 });
  }

  try {
    const result = validateAuthConfiguration();
    
    // Additional runtime checks
    const runtimeChecks = {
      nextAuthUrl: process.env.NEXTAUTH_URL,
      authTrustHost: process.env.AUTH_TRUST_HOST,
      nodeEnv: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({
      ...result,
      runtime: runtimeChecks,
      status: result.isValid ? 'valid' : 'invalid'
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Validation failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}