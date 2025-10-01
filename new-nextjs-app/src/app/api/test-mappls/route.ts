import { NextResponse } from 'next/server';

export async function GET() {
  const mapplsApiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
  
  return NextResponse.json({
    mapplsApiKey: mapplsApiKey ? 'Found' : 'Missing',
    apiKeyLength: mapplsApiKey?.length || 0,
    apiKeyPreview: mapplsApiKey ? `${mapplsApiKey.substring(0, 10)}...` : 'N/A',
    nodeEnv: process.env.NODE_ENV,
    allEnvVars: Object.keys(process.env).filter(key => key.includes('MAPPLS')),
  });
}
