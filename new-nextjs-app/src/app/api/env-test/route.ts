import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_MAPPLS_API_KEY: process.env.NEXT_PUBLIC_MAPPLS_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  };

  // Additional debugging info
  const debugInfo = {
    apiKeyExists: !!process.env.NEXT_PUBLIC_MAPPLS_API_KEY,
    apiKeyLength: process.env.NEXT_PUBLIC_MAPPLS_API_KEY?.length || 0,
    apiKeyPreview: process.env.NEXT_PUBLIC_MAPPLS_API_KEY ? 
      `${process.env.NEXT_PUBLIC_MAPPLS_API_KEY.substring(0, 10)}...` : 'N/A',
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('MAPPLS') || key.includes('MAPS')),
  };

  return NextResponse.json({
    success: true,
    environment: envVars,
    debug: debugInfo,
    timestamp: new Date().toISOString()
  });
}
