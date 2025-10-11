# Property System Documentation

## Overview

The Urban Realty property system has been completely rebuilt with:
- ✅ Consistent theming using CSS variables
- ✅ Proper client-side rendering
- ✅ Mappls Maps integration
- ✅ Type-safe interfaces
- ✅ Proper data handling from backend

## File Structure

### Core Files

```
new-nextjs-app/
├── src/
│   ├── types/
│   │   └── property.ts                  # Property type definitions
│   ├── contexts/
│   │   └── PropertiesContext.tsx        # Properties state management
│   ├── components/
│   │   ├── property/
│   │   │   ├── PropertyCard.tsx         # Property card component
│   │   │   ├── PropertyList.tsx         # Property grid/list
│   │   │   ├── PropertyMap.tsx          # Mappls map integration
│   │   │   └── PropertyImageGallery.tsx # Image gallery with lightbox
│   │   ├── home/
│   │   │   └── PropertiesSection.tsx    # Featured properties section
│   │   └── admin/
│   │       ├── RecentProperties.tsx     # Recent properties widget
│   │       └── tables/
│   │           └── RecentPropertiesTable.tsx
│   └── app/
│       ├── properties/
│       │   ├── page.tsx                 # Properties listing page
│       │   └── [id]/
│       │       └── page.tsx             # Property detail page
│       ├── admin/
│       │   ├── AdminProperties.tsx      # Admin properties management
│       │   └── PropertiesTable.tsx      # Admin properties table
│       └── agent/
│           └── AgentProperties.tsx      # Agent properties dashboard
```

## Theme Integration

All components use CSS variables from `src/style-constants/themes.css`:

### Available CSS Variables

```css
/* Background Colors */
--color-bg           /* Main background */
--color-surface      /* Card/surface background */
--color-accent       /* Accent background */

/* Text Colors */
--color-text-primary   /* Main text */
--color-text-muted     /* Secondary text */

/* Brand Colors */
--color-primary           /* Primary brand color (#F76B1C) */
--color-primary-hover     /* Primary hover state */
--color-primary-contrast  /* Text on primary */
--color-secondary         /* Secondary brand color */

/* Utility Colors */
--color-success    /* Success state */
--color-warning    /* Warning state */
--color-danger     /* Error/danger state */
--color-border     /* Border color */
```

### Usage Example

```tsx
<Box sx={{ 
  background: 'var(--color-surface)',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border)'
}}>
  <Button sx={{
    background: 'var(--color-primary)',
    color: 'var(--color-primary-contrast)',
    '&:hover': {
      background: 'var(--color-primary-hover)'
    }
  }}>
    Click Me
  </Button>
</Box>
```

## Data Flow

### Backend → Frontend Data Structure

The backend sends data in this format:

```typescript
{
  success: true,
  data: {
    _id: "...",
    title: "Property Title",
    price: 5000000,
    area: 1200,
    bedrooms: 3,
    bathrooms: 2,
    type: "Apartment",
    status: "For Sale",
    address: {
      line1: "Building Name",
      street: "Street Address",
      city: "Mumbai",
      locality: "Andheri",
      state: "Maharashtra",
      zipCode: "400053",
      country: "India"
    },
    location: {
      type: "Point",
      coordinates: [77.3910, 28.5355],  // [longitude, latitude]
      formattedAddress: "Full address"
    },
    images: [
      {
        url: "https://...",
        publicId: "...",
        width: 1200,
        height: 800
      }
    ],
    amenities: ["Parking", "Gym", "Swimming Pool"],
    highlights: ["24/7 Security", "Power Backup"],
    // ... more fields
  }
}
```

### Frontend Components Usage

#### 1. Using PropertiesContext

```tsx
'use client';

import { useProperties } from '@/contexts/PropertiesContext';

function MyComponent() {
  const { 
    properties, 
    loading, 
    error, 
    pagination,
    getProperties 
  } = useProperties();

  useEffect(() => {
    getProperties({ page: 1, limit: 12 });
  }, []);

  return (
    <PropertyList
      properties={properties}
      loading={loading}
      error={error}
    />
  );
}
```

#### 2. Using PropertyCard

```tsx
import PropertyCard from '@/components/property/PropertyCard';

<PropertyCard 
  property={property} 
  onClick={(property) => router.push(`/properties/${property._id}`)}
/>
```

#### 3. Using PropertyMap

```tsx
import PropertyMap from '@/components/property/PropertyMap';

<PropertyMap
  latitude={property.location.coordinates[1]}
  longitude={property.location.coordinates[0]}
  address={fullAddress}
  height="400px"
  zoom={15}
/>
```

## Client-Side Rendering

All property components are client-side rendered using the `'use client'` directive. This ensures:
- Proper hydration
- Interactive features work correctly
- No SSR/CSR mismatches

### Example Pattern

```tsx
'use client';

import { useState, useEffect } from 'react';

function PropertyComponent() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <LoadingSkeleton />;
  }

  return <ActualComponent />;
}
```

## API Endpoints

### Properties API

```
GET /api/v1/properties                  # List all properties
GET /api/v1/properties/featured         # Get featured properties
GET /api/v1/properties/:id              # Get single property
GET /api/v1/properties/agent/:id        # Get agent's properties
POST /api/v1/properties                 # Create property (auth required)
PUT /api/v1/properties/:id              # Update property (auth required)
DELETE /api/v1/properties/:id           # Delete property (auth required)
```

### Query Parameters

```
?page=1                    # Page number
&limit=12                  # Items per page
&search=keyword            # Search term
&type=Apartment            # Property type
&status=For Sale           # Property status
&minPrice=1000000          # Minimum price
&maxPrice=10000000         # Maximum price
&bedrooms=3                # Number of bedrooms
&city=Mumbai               # City filter
&sort=-createdAt           # Sort order
```

## Best Practices

### 1. Always Use Type Definitions

```tsx
import { Property } from '@/types/property';

const property: Property = {
  _id: "...",
  // ... typed properties
};
```

### 2. Handle Loading States

```tsx
if (loading) {
  return <CircularProgress sx={{ color: 'var(--color-primary)' }} />;
}
```

### 3. Handle Errors Gracefully

```tsx
if (error) {
  return (
    <Alert severity="error">
      {error}
    </Alert>
  );
}
```

### 4. Use Consistent Theming

```tsx
// ✅ Good
<Box sx={{ background: 'var(--color-surface)' }} />

// ❌ Bad
<Box sx={{ background: '#ffffff' }} />
```

### 5. Client-Side Components

```tsx
// ✅ Good
'use client';
import { useState } from 'react';

// ❌ Bad (mixing SSR/CSR without proper handling)
```

## Testing

### Manual Testing Checklist

- [ ] Properties list page loads correctly
- [ ] Property cards display all information
- [ ] Filters work correctly
- [ ] Pagination functions properly
- [ ] Property detail page loads
- [ ] Images display in gallery
- [ ] Map shows correct location
- [ ] Favorite/share buttons work
- [ ] Responsive design works on mobile
- [ ] Dark/light theme switches correctly
- [ ] Admin property management works
- [ ] Agent property dashboard loads

## Troubleshooting

### Issue: Map Not Loading
**Solution**: Check `NEXT_PUBLIC_MAPPLS_API_KEY` in `.env.local`

### Issue: Properties Not Loading
**Solution**: 
1. Check backend server is running
2. Verify API URL in http service
3. Check browser console for errors

### Issue: Theme Colors Not Applying
**Solution**: 
1. Ensure `themes.css` is imported in layout
2. Use CSS variables correctly: `var(--color-name)`
3. Check if component is wrapped in ThemeProvider

### Issue: Hydration Errors
**Solution**: 
1. Ensure component has `'use client'` directive
2. Use `mounted` state pattern
3. Don't use browser APIs during initial render

## Future Enhancements

Potential improvements:
- [ ] Virtual scrolling for large property lists
- [ ] Advanced map clustering for multiple properties
- [ ] Property comparison feature
- [ ] Saved searches
- [ ] Property recommendations
- [ ] Social sharing enhancements
- [ ] Property tours/videos integration

## Support

For issues or questions:
1. Check this documentation
2. Review component code
3. Check browser console for errors
4. Verify backend API responses

