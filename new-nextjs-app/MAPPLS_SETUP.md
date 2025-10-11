# Mappls Maps Integration Guide

This document explains how to set up and use Mappls (formerly MapmyIndia) Maps in the Urban Realty Next.js application.

## Prerequisites

1. A Mappls API account
2. Mappls API Key

## Getting Your Mappls API Key

1. Visit [Mappls Console](https://apis.mappls.com/console/)
2. Sign up or log in to your account
3. Navigate to your project dashboard
4. Copy your API key from the project settings

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the `new-nextjs-app` directory:

```bash
# Mappls API Configuration
NEXT_PUBLIC_MAPPLS_API_KEY=your_mappls_api_key_here
```

**Important:** Replace `your_mappls_api_key_here` with your actual Mappls API key.

### 2. Verify Integration

The Mappls integration is already set up in the following components:
- `src/components/property/PropertyMap.tsx` - Main map component
- `src/app/properties/[id]/page.tsx` - Property detail page with map

### 3. Usage Example

```tsx
import PropertyMap from '@/components/property/PropertyMap';

// In your component
<PropertyMap
  latitude={28.5355}  // Property latitude
  longitude={77.3910}  // Property longitude
  address="Property Address"
  height="400px"
  zoom={15}
  showMarker={true}
/>
```

## Component Props

### PropertyMap Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| latitude | number | required | Latitude coordinate |
| longitude | number | required | Longitude coordinate |
| address | string | optional | Address to display in marker popup |
| height | string\|number | '400px' | Map container height |
| zoom | number | 15 | Initial zoom level (1-20) |
| showMarker | boolean | true | Whether to show marker on map |

## Data Format

### Backend Location Data Structure

The backend stores location data in GeoJSON format:

```javascript
{
  location: {
    type: 'Point',
    coordinates: [longitude, latitude],  // Note: [lng, lat] order
    formattedAddress: 'Full address string'
  }
}
```

### Frontend Usage

When using the location data in the frontend:

```tsx
// Backend sends coordinates as [longitude, latitude]
const property = {
  location: {
    type: 'Point',
    coordinates: [77.3910, 28.5355]  // [lng, lat]
  }
};

// Use like this:
<PropertyMap
  latitude={property.location.coordinates[1]}   // lat (second element)
  longitude={property.location.coordinates[0]}  // lng (first element)
/>
```

## Troubleshooting

### Map Not Loading

1. **Check API Key**: Ensure your API key is correctly set in `.env.local`
2. **Check Console**: Look for error messages in browser console
3. **Verify Coordinates**: Ensure latitude and longitude are valid numbers
4. **API Key Restrictions**: Check if your API key has domain restrictions

### Common Errors

#### "Failed to load Mappls Maps"
- Your API key might be invalid or expired
- Check if the API key is properly set in environment variables
- Restart your development server after adding environment variables

#### "Location information not available"
- The property doesn't have location coordinates in the database
- Check backend data to ensure location is properly geocoded

### Development Tips

1. **Restart Server**: After changing `.env.local`, restart your Next.js dev server
2. **Clear Cache**: If maps aren't updating, try clearing browser cache
3. **Check Network**: Ensure you have internet connection for loading map tiles

## Features

The PropertyMap component includes:
- ✅ Interactive map with zoom controls
- ✅ Custom markers for property locations
- ✅ Address popup on marker click
- ✅ Responsive design
- ✅ Dark/Light theme support
- ✅ Loading states
- ✅ Error handling

## API Rate Limits

Mappls API has rate limits based on your subscription plan:
- Free tier: Limited requests per day
- Paid tiers: Check your plan details

## Support

For Mappls API issues:
- [Mappls Documentation](https://www.mapmyindia.com/api/docs/)
- [Mappls Support](https://www.mapmyindia.com/api/support/)

For application issues:
- Check the component code in `src/components/property/PropertyMap.tsx`
- Review console errors for debugging

