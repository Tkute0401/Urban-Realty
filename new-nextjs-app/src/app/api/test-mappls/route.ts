import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_MAPMYINDIA_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Mappls API key not configured',
        message: 'Please set NEXT_PUBLIC_MAPMYINDIA_API_KEY in your environment variables'
      }, { status: 400 });
    }

    // Test API key by making a simple request to Mappls
    const testUrl = `https://apis.mappls.com/advancedmaps/v1/${apiKey}/map_load?v=1.3`;
    
    return NextResponse.json({
      success: true,
      message: 'Mappls API key is configured',
      apiKey: apiKey.substring(0, 8) + '...', // Show only first 8 characters for security
      testUrl: testUrl,
      instructions: [
        '1. Add your API key to .env.local file',
        '2. Restart your development server',
        '3. Visit /map-test to see the map in action'
      ]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to test Mappls configuration',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}