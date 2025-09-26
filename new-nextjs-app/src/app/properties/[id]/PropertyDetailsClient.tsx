'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';
import { api } from '@/lib/services/api';
import { 
  Box, Grid, useMediaQuery, Container, CircularProgress
} from '@mui/material';

// Dynamic import all interactive components to prevent SSR serialization issues during Railway builds
const PropertyHeader = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertyHeader').then(mod => ({ default: mod.default })),
  { 
    ssr: false, // Critical: Prevent SSR to avoid event handler serialization during static generation
    loading: () => <CircularProgress size={24} />
  }
);

const PropertySidebar = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertySidebar').then(mod => ({ default: mod.default })),
  { 
    ssr: false, // Critical: Prevent SSR to avoid event handler serialization during static generation
    loading: () => <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  }
);

const PropertyNavigation = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertyNavigation').then(mod => ({ default: mod.default })),
  { 
    ssr: false, // Critical: Prevent SSR to avoid event handler serialization during static generation
    loading: () => <Box sx={{ height: 64, bgcolor: 'var(--color-surface)' }} />
  }
);

const PropertyFloorPlan = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertyFloorPlan').then(mod => ({ default: mod.default })),
  { 
    ssr: false, // Critical: Prevent SSR for download buttons with onClick handlers
    loading: () => <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  }
);

const PropertySimilar = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertySimilar').then(mod => ({ default: mod.default })),
  { 
    ssr: false, // Critical: Prevent SSR for property navigation with onClick handlers
    loading: () => <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  }
);

// Import the static components normally (no event handlers)
import {
  PropertyOverview,
  PropertyHighlights,
  PropertyNearby,
  PropertyMoreInfo,
  PropertyAmenities,
  PropertyDeveloper,
} from '@/components/property/PropertyDetailsComponents';

interface PropertyDetailsClientProps {
  property: any;
}

const PropertyDetailsClient: React.FC<PropertyDetailsClientProps> = ({ property }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [isFavorite, setIsFavorite] = useState(false);
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
    if (property?._id) {
      // Add to recently viewed (best-effort)
      const addToRecentlyViewed = async () => {
        try {
          await api.auth.addRecentlyViewed(property._id);
        } catch (error) {
          console.log('Failed to add to recently viewed:', error);
        }
      };

      // Fetch favorite status if authenticated
      const fetchFavoriteStatus = async () => {
        if (isAuthenticated) {
          try {
            const favRes = await api.auth.favoriteStatus(property._id);
            setIsFavorite(Boolean((favRes as any)?.data?.isFavorite));
          } catch (error) {
            console.log('Failed to fetch favorite status:', error);
          }
        }
      };

      addToRecentlyViewed();
      fetchFavoriteStatus();
    }
  }, [property?._id, isAuthenticated]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const res = await api.auth.toggleFavorite(property._id, !isFavorite);
      const toggled = Boolean((res as any)?.data?.isFavorite ?? !isFavorite);
      setIsFavorite(toggled);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Fallback: refresh favorite status
      try {
        const status = await api.auth.favoriteStatus(property._id);
        setIsFavorite(Boolean((status as any)?.data?.isFavorite));
      } catch (refreshError) {
        console.error('Error refreshing favorite status:', refreshError);
      }
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

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

export default PropertyDetailsClient;