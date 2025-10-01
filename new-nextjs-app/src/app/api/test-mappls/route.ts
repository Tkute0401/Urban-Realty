import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'No MapTiles API key found'
    });
  }

  try {
    // Test the API key by making a request to MapTiles API
    const testUrl = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?v=3.0&layer=vector`;
    
    const response = await fetch(testUrl);
    
    return NextResponse.json({
      success: true,
      apiKey: `${apiKey.substring(0, 10)}...`,
      status: response.status,
      statusText: response.statusText,
      testUrl: testUrl
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      apiKey: `${apiKey.substring(0, 10)}...`
    });
  }
}