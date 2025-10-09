# MapmyIndia (Mappls) Integration

This project uses MapmyIndia (Mappls) for map functionality instead of Google Maps.

## Setup

1. **Get API Key**: Sign up at [MapmyIndia Developer Console](https://www.mapmyindia.com/api/) and get your API key.

2. **Environment Variables**: Add your API key to your environment variables:
   ```bash
   NEXT_PUBLIC_MAPMYINDIA_API_KEY=your_mapmyindia_api_key_here
   ```

3. **API Documentation**: Refer to [MapmyIndia Advanced Maps API](https://www.mapmyindia.com/api/advanced-maps/doc) for detailed documentation.

## Features

- **Interactive Maps**: Display property locations with markers
- **Dark/Light Theme**: Automatic theme switching based on app theme
- **Responsive Design**: Works on all device sizes
- **Popup Information**: Click markers to see property details
- **Error Handling**: Graceful fallback when maps fail to load

## Usage

The `PropertyMap` component is used throughout the application:

```tsx
import PropertyMap from '@/components/property/PropertyMap';

<PropertyMap
  latitude={19.0760}
  longitude={72.8777}
  address="123 Main Street, Mumbai, Maharashtra"
  height="400px"
  zoom={15}
  showMarker={true}
/>
```

## API Reference

### PropertyMap Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `latitude` | number | - | Latitude coordinate |
| `longitude` | number | - | Longitude coordinate |
| `address` | string | - | Property address for popup |
| `height` | string/number | '400px' | Map container height |
| `zoom` | number | 15 | Initial zoom level |
| `showMarker` | boolean | true | Show property marker |
| `className` | string | '' | Additional CSS classes |

## Troubleshooting

1. **Map not loading**: Check if `NEXT_PUBLIC_MAPMYINDIA_API_KEY` is set correctly
2. **API errors**: Verify your API key has the correct permissions
3. **Styling issues**: Ensure the map container has proper dimensions

## Migration from Google Maps

If you were previously using Google Maps, the main differences are:

- Coordinate format: Mappls uses `[longitude, latitude]` instead of `{lat, lng}`
- API loading: Different script URL and initialization
- Styling: Uses `mapType: 'dark'` instead of custom styles
- Markers: Different marker and popup API

The component interface remains the same, so no changes are needed in parent components.
