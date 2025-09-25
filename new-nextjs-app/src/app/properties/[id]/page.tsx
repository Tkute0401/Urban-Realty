'use client'

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import { api } from '@/lib/services/api';
import { 
  Box, Grid, CircularProgress, Alert, Container, useMediaQuery
} from '@mui/material';

// Import the new modular components
import {
  PropertyHeader,
  PropertyNavigation,
  PropertyOverview,
  PropertyHighlights,
  PropertyNearby,
  PropertyMoreInfo,
  PropertyFloorPlan,
  PropertyAmenities,
  PropertyDeveloper,
  PropertySimilar,
  PropertySidebar
} from '@/components/property/PropertyDetailsComponents';

const PropertyDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [property, setProperty] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(true);
  const [errorProperty, setErrorProperty] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  // Refs for section navigation
  const overviewRef = useRef(null);
  const highlightsRef = useRef(null);
  const nearbyRef = useRef(null);
  const moreRef = useRef(null);
  const floorplanRef = useRef(null);
  const amenitiesRef = useRef(null);
  const developerRef = useRef(null);
  const similarRef = useRef(null);

  const sections = [
    { id: 'overview', label: 'Overview', ref: overviewRef },
    { id: 'highlights', label: 'Highlights', ref: highlightsRef },
    { id: 'nearby', label: 'Around', ref: nearbyRef },
    { id: 'more', label: 'More Info', ref: moreRef },
    { id: 'floorplan', label: 'Floor Plan', ref: floorplanRef },
    { id: 'amenities', label: 'Amenities', ref: amenitiesRef },
    { id: 'developer', label: 'Developer', ref: developerRef },
    { id: 'similar', label: 'Similar', ref: similarRef }
  ];

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoadingProperty(true);
        // Ensure id is a string (handle case where it might be an array)
        const propertyId = Array.isArray(id) ? id[0] : id;
        const response = await api.properties.getById(propertyId as string);
        const prop = (response as any).data?.data ?? response.data;
        setProperty(prop);
        
        // add to recently viewed (best-effort)
        try {
          await api.auth.addRecentlyViewed(propertyId as string);
        } catch (_) {}
        
        // fetch favorite status if authenticated
        if (isAuthenticated) {
          try {
            const favRes = await api.auth.favoriteStatus(propertyId as string);
            setIsFavorite(Boolean((favRes as any)?.data?.isFavorite));
          } catch (_) {}
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setErrorProperty('Failed to load property details');
      } finally {
        setLoadingProperty(false);
      }
    };

    if (id) {
      fetchProperty();
    }
  }, [id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      // Ensure id is a string (handle case where it might be an array)
      const propertyId = Array.isArray(id) ? id[0] : id;
      const res = await api.auth.toggleFavorite(propertyId as string, !isFavorite);
      const toggled = Boolean((res as any)?.data?.isFavorite ?? !isFavorite);
      setIsFavorite(toggled);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      try {
        const propertyId = Array.isArray(id) ? id[0] : id;
        const status = await api.auth.favoriteStatus(propertyId as string);
        setIsFavorite(Boolean((status as any)?.data?.isFavorite));
      } catch (_) {}
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  if (loadingProperty) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Box>
    );
  }

  if (errorProperty || !property) {
    return (
      <Box p={4}>
        <Alert severity="error">
          {errorProperty || 'Property not found'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>
      {/* Property Images Gallery */}
      <Box sx={{ mb: 2 }}>
        <PropertyImageGallery images={Array.isArray(property.images) ? property.images : []} />
      </Box>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Property Header */}
        <Box sx={{ mb: 4 }}>
          <PropertyHeader 
            property={property}
            isFavorite={isFavorite}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </Box>

        {/* Navigation */}
        <PropertyNavigation 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          sections={sections}
          isSticky={!isMobile}
        />

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Property Overview */}
            <PropertyOverview 
              property={property} 
              sectionRef={overviewRef}
            />

            {/* Property Highlights */}
            <PropertyHighlights 
              property={property} 
              sectionRef={highlightsRef}
            />

            {/* Nearby Amenities */}
            <PropertyNearby 
              property={property} 
              sectionRef={nearbyRef}
            />

            {/* Additional Information */}
            <PropertyMoreInfo 
              property={property} 
              sectionRef={moreRef}
            />

            {/* Floor Plans */}
            <PropertyFloorPlan 
              property={property} 
              sectionRef={floorplanRef}
            />

            {/* Amenities */}
            <PropertyAmenities 
              property={property} 
              sectionRef={amenitiesRef}
            />

            {/* Developer Info */}
            <PropertyDeveloper 
              property={property} 
              sectionRef={developerRef}
            />

            {/* Map */}
            <Box sx={{ mb: 4 }}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'var(--color-surface)', 
                  border: '1px solid var(--color-border)',
                  borderRadius: 2
                }}
              >
                <PropertyMap location={property.location} address={property.address} />
              </Box>
            </Box>

            {/* Similar Properties */}
            <PropertySimilar 
              property={property} 
              sectionRef={similarRef}
            />
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <PropertySidebar property={property} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyDetails;