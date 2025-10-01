import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      error: 'No API key found'
    });
  }

  try {
    // Test the API key by making a request to Google Maps Geocoding API
    const testUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=New+York&key=${apiKey}`;
    
    const response = await fetch(testUrl);
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      apiKey: `${apiKey.substring(0, 10)}...`,
      status: data.status,
      errorMessage: data.error_message,
      results: data.results?.length || 0,
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
