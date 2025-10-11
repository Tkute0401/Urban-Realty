# Mappls Geocoding Integration

## Overview

The property system now uses a **hybrid geocoding approach** that provides the best of both worlds:

1. **Primary**: Mappls (MapmyIndia) for India-specific, accurate geocoding
2. **Fallback**: OpenStreetMap for global coverage when Mappls is unavailable

## How It Works

### 1. Address Geocoding Process

When a property is created or updated, the system automatically geocodes the address:

```javascript
// Address from form: "123 MG Road, Bangalore, Karnataka, India"
const addressString = [
  req.body.address.line1,      // "123"
  req.body.address.street,     // "MG Road"
  req.body.address.city,       // "Bangalore"
  req.body.address.state,      // "Karnataka"
  req.body.address.zipCode,     // "560001"
  req.body.address.country      // "India"
].filter(Boolean).join(', ');

const loc = await geocoder.geocode(addressString);
```

### 2. Hybrid Geocoding Logic

The `HybridGeocoder` class automatically chooses the best geocoding service:

```javascript
// 1. Try Mappls first (if API key is available)
if (this.useMappls) {
  try {
    const result = await mapplsGeocoder.geocode(address);
    if (result && result.length > 0) {
      return result; // Success with Mappls
    }
  } catch (error) {
    console.warn('Mappls failed, falling back to OpenStreetMap');
  }
}

// 2. Fallback to OpenStreetMap
const result = await osmGeocoder.geocode(address);
return result;
```

### 3. Location Data Storage

The geocoded result is stored in the property's `location` field:

```javascript
property.location = {
  type: 'Point',
  coordinates: [longitude, latitude],  // [77.5946, 12.9716]
  formattedAddress: 'MG Road, Bangalore, Karnataka, India',
  street: 'MG Road',
  city: 'Bangalore',
  state: 'Karnataka',
  zipCode: '560001',
  country: 'India'
};
```

## Configuration

### Environment Variables

Add your Mappls API key to your environment variables:

```bash
# Railway Environment Variables
MAPPLS_API_KEY=your_mappls_api_key_here
NEXT_PUBLIC_MAPPLS_API_KEY=your_mappls_api_key_here
```

### Getting Mappls API Key

1. Visit [Mappls Developer Portal](https://developer.mappls.com/)
2. Sign up for an account
3. Create a new project
4. Get your API key from the project dashboard
5. Add it to your Railway environment variables

## API Endpoints Used

### Mappls Geocoding API
- **Forward Geocoding**: `https://apis.mappls.com/advancedmaps/v1/{API_KEY}/places/geocode`
- **Reverse Geocoding**: `https://apis.mappls.com/advancedmaps/v1/{API_KEY}/places/reverse`

### Response Format

Mappls returns detailed location information:

```json
{
  "suggestedLocations": [
    {
      "latitude": "12.9716",
      "longitude": "77.5946",
      "placeName": "MG Road, Bangalore, Karnataka, India",
      "streetName": "MG Road",
      "city": "Bangalore",
      "state": "Karnataka",
      "pincode": "560001",
      "country": "India",
      "locality": "Central Bangalore",
      "district": "Bangalore Urban",
      "houseNumber": "123",
      "poi": "Commercial Area"
    }
  ]
}
```

## Benefits of Mappls Integration

### 1. **India-Specific Accuracy**
- Better coverage for Indian addresses
- Accurate pincode mapping
- Local landmark recognition
- Regional language support

### 2. **Enhanced Data Quality**
- More detailed address components
- Better locality and district information
- Accurate POI (Point of Interest) data
- House number recognition

### 3. **Reliability**
- Automatic fallback to OpenStreetMap
- No service interruption
- Maintains existing functionality
- Backward compatibility

## Testing

Run the test script to verify geocoding functionality:

```bash
node test-geocoding.js
```

This will test both forward and reverse geocoding with sample Indian addresses.

## Usage in Frontend

The geocoding happens automatically on the backend when:

1. **Creating a Property**: Address is geocoded during property creation
2. **Updating a Property**: Address is geocoded when address fields are modified
3. **Search by Radius**: Zipcode is geocoded to find nearby properties

### Frontend Form Fields

The address form fields that get geocoded:

```javascript
// From AddProperty form
const addressFields = {
  line1: 'House/Building Number',
  street: 'Street Name',
  city: 'City',
  state: 'State',
  zipCode: 'Pincode',
  country: 'Country (defaults to India)'
};
```

## Error Handling

The system gracefully handles geocoding failures:

1. **Mappls API Error**: Falls back to OpenStreetMap
2. **Both Services Fail**: Property is created with default coordinates (0,0)
3. **Invalid Address**: Property is created with provided address but no coordinates
4. **Network Issues**: Retries with exponential backoff

## Monitoring

Check the server logs for geocoding status:

```bash
# Successful Mappls geocoding
✅ Mappls geocoding successful: MG Road, Bangalore

# Fallback to OpenStreetMap
⚠️ Mappls geocoding failed, falling back to OpenStreetMap

# Both services failed
❌ Both Mappls and OpenStreetMap geocoding failed
```

## Migration Notes

- **Existing Properties**: Will be geocoded when updated
- **No Breaking Changes**: Existing API endpoints work unchanged
- **Backward Compatible**: Works with or without Mappls API key
- **Performance**: Mappls is faster for Indian addresses

## Cost Considerations

- **Mappls**: Pay-per-use pricing (check current rates)
- **OpenStreetMap**: Free but less accurate for India
- **Hybrid Approach**: Optimizes costs by using free service when Mappls fails

## Next Steps

1. **Add Mappls API Key**: Configure in Railway environment variables
2. **Test Geocoding**: Run the test script to verify functionality
3. **Monitor Performance**: Check logs for geocoding success rates
4. **Optimize Usage**: Consider caching frequently geocoded addresses
