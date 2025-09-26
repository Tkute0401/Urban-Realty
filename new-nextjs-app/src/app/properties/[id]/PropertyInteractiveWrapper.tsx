'use client'

/**
 * Railway Build Fix: Complete Client-Side Wrapper
 * This component isolates ALL interactive components to prevent event handler serialization
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/services/api';
import { 
  Box, Grid, useMediaQuery, Container, CircularProgress
} from '@mui/material';

// Static components (no event handlers) - safe to import normally
import {
  PropertyOverview,
  PropertyHighlights,
  PropertyNearby,
  PropertyMoreInfo,
  PropertyAmenities,
  PropertyDeveloper,
} from '@/components/property/PropertyDetailsComponents';

import PropertyImageGallery from '@/components/property/PropertyImageGallery';
import PropertyMap from '@/components/property/PropertyMap';

// Dynamic imports for ALL interactive components to prevent serialization
import dynamic from 'next/dynamic';

// ALL components with onClick handlers MUST be dynamically imported with ssr: false
const PropertyHeader = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertyHeader'),
  { 
    ssr: false,
    loading: () => <Box sx={{ height: 200 }}><CircularProgress /></Box>
  }
);

const PropertySidebar = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertySidebar'),
  { 
    ssr: false,
    loading: () => <Box sx={{ height: 600 }}><CircularProgress /></Box>
  }
);

const PropertyNavigation = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertyNavigation'),
  { 
    ssr: false,
    loading: () => <Box sx={{ height: 64, bgcolor: 'var(--color-surface)' }} />
  }
);

const PropertyFloorPlan = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertyFloorPlan'),
  { 
    ssr: false,
    loading: () => <Box sx={{ height: 300 }}><CircularProgress /></Box>
  }
);

const PropertySimilar = dynamic(
  () => import('@/components/property/PropertyDetailsComponents/PropertySimilar'),
  { 
    ssr: false,
    loading: () => <Box sx={{ height: 400 }}><CircularProgress /></Box>
  }
);

interface PropertyInteractiveWrapperProps {
  property: any;
}

const PropertyInteractiveWrapper: React.FC<PropertyInteractiveWrapperProps> = ({ property }) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isClient, setIsClient] = useState(false);

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

  // Ensure client-side only rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !property?._id) return;

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
  }, [property?._id, isAuthenticated, isClient]);

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

  // Don't render interactive components until client-side
  if (!isClient) {
    return (
      <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>
        {/* Property Images Gallery - Static, safe to render */}
        <Box sx={{ mb: 2 }}>
          <PropertyImageGallery images={Array.isArray(property.images) ? property.images : []} />
        </Box>

        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {/* Static components only during SSR */}
              <PropertyOverview property={property} sectionRef={overviewRef} />
              <PropertyHighlights property={property} sectionRef={highlightsRef} />
              <PropertyNearby property={property} sectionRef={nearbyRef} />
              <PropertyMoreInfo property={property} sectionRef={moreRef} />
              <PropertyAmenities property={property} sectionRef={amenitiesRef} />
              <PropertyDeveloper property={property} sectionRef={developerRef} />
              
              {/* Map - Static, safe to render */}
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
            </Grid>
            
            <Grid item xs={12} md={4}>
              {/* Placeholder for sidebar during SSR */}
              <Box 
                sx={{ 
                  height: 600, 
                  bgcolor: 'var(--color-surface)',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <CircularProgress />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  // Client-side rendering with all interactive components
  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>
      {/* Property Images Gallery */}
      <Box sx={{ mb: 2 }}>
        <PropertyImageGallery images={Array.isArray(property.images) ? property.images : []} />
      </Box>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Property Header - Interactive */}
        <Box sx={{ mb: 4 }}>
          <PropertyHeader 
            property={property}
            isFavorite={isFavorite}
            onFavoriteToggle={handleFavoriteToggle}
          />
        </Box>

        {/* Navigation - Interactive */}
        <PropertyNavigation 
          activeSection={activeSection}
          onSectionChange={handleSectionChange}
          sections={sections}
          isSticky={!isMobile}
        />

        <Grid container spacing={4}>
          {/* Main Content */}
          <Grid item xs={12} md={8}>
            {/* Static components */}
            <PropertyOverview property={property} sectionRef={overviewRef} />
            <PropertyHighlights property={property} sectionRef={highlightsRef} />
            <PropertyNearby property={property} sectionRef={nearbyRef} />
            <PropertyMoreInfo property={property} sectionRef={moreRef} />
            
            {/* Interactive components */}
            <PropertyFloorPlan property={property} sectionRef={floorplanRef} />
            <PropertyAmenities property={property} sectionRef={amenitiesRef} />
            <PropertyDeveloper property={property} sectionRef={developerRef} />

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

            {/* Similar Properties - Interactive */}
            <PropertySimilar property={property} sectionRef={similarRef} />
          </Grid>

          {/* Sidebar - Interactive */}
          <Grid item xs={12} md={4}>
            <PropertySidebar property={property} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyInteractiveWrapper;