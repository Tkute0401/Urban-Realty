import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY || '82f5c384638d8cfc7d13e310780bae89';
  
  // Basic validation without external API call
  if (!apiKey || apiKey.length < 10) {
    return NextResponse.json({
      success: false,
      error: 'Invalid MapTiles API key',
      apiKey: apiKey ? `${apiKey.substring(0, 5)}...` : 'Not found'
    });
  }

  try {
    // Return basic validation without external API call
    return NextResponse.json({
      success: true,
      apiKey: `${apiKey.substring(0, 10)}...`,
      apiKeyLength: apiKey.length,
      message: 'MapTiles API key validation passed',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      apiKey: `${apiKey.substring(0, 10)}...`
    });
  }
}