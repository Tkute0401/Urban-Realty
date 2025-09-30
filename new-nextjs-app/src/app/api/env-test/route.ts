import { NextResponse } from 'next/server';

export async function GET() {
  const envVars = {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    NODE_ENV: process.env.NODE_ENV,
    RAILWAY_ENVIRONMENT: process.env.RAILWAY_ENVIRONMENT,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  };

  return NextResponse.json({
    success: true,
    environment: envVars,
    timestamp: new Date().toISOString()
  });
}
