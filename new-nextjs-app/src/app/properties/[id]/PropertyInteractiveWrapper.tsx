'use client'

/**
 * Railway Build Fix: Complete Client-Side Wrapper
 * This component isolates ALL interactive components to prevent event handler serialization
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertiesContext';
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
  const { getProperty: fetchProperty, property: contextProperty, loading: contextLoading } = useProperties();
  const isMobile = useMediaQuery('(max-width:900px)');
  
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [isClient, setIsClient] = useState(false);
  
  // Use property from context if available, otherwise use the passed property
  const currentProperty = contextProperty || property;

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
    if (!isClient || !currentProperty?._id) return;

    // Fetch property from context if not already available
    if (!contextProperty && currentProperty?._id) {
      fetchProperty(currentProperty._id);
    }

    // Add to recently viewed (best-effort)
    const addToRecentlyViewed = async () => {
      try {
        await api.auth.addRecentlyViewed(currentProperty._id);
      } catch (error) {
        console.log('Failed to add to recently viewed:', error);
      }
    };

    // Fetch favorite status if authenticated
    const fetchFavoriteStatus = async () => {
      if (isAuthenticated) {
        try {
          const favRes = await api.auth.favoriteStatus(currentProperty._id);
          setIsFavorite(Boolean((favRes as any)?.data?.isFavorite));
        } catch (error) {
          console.log('Failed to fetch favorite status:', error);
        }
      }
    };

    addToRecentlyViewed();
    fetchFavoriteStatus();
  }, [currentProperty?._id, isAuthenticated, isClient, contextProperty, fetchProperty]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      const res = await api.auth.toggleFavorite(currentProperty._id, !isFavorite);
      const toggled = Boolean((res as any)?.data?.isFavorite ?? !isFavorite);
      setIsFavorite(toggled);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      // Fallback: refresh favorite status
      try {
        const status = await api.auth.favoriteStatus(currentProperty._id);
        setIsFavorite(Boolean((status as any)?.data?.isFavorite));
      } catch (refreshError) {
        console.error('Error refreshing favorite status:', refreshError);
      }
    }
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  // Always render the same structure to prevent hydration mismatches
  return (
    <Box sx={{ bgcolor: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh' }}>
      {/* Property Images Gallery - Static, safe to render */}
      <Box sx={{ mb: 2 }}>
        <PropertyImageGallery images={Array.isArray(currentProperty.images) ? currentProperty.images : []} />
      </Box>

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Property Header - Only render on client side */}
        {isClient && (
          <Box sx={{ mb: 4 }}>
            <PropertyHeader 
              property={currentProperty}
              isFavorite={isFavorite}
              onFavoriteToggle={handleFavoriteToggle}
            />
          </Box>
        )}

        {/* Navigation - Only render on client side */}
        {isClient && (
          <PropertyNavigation 
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            sections={sections}
            isSticky={!isMobile}
          />
        )}

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Static components - safe to render on both server and client */}
            <PropertyOverview property={currentProperty} sectionRef={overviewRef} />
            <PropertyHighlights property={currentProperty} sectionRef={highlightsRef} />
            <PropertyNearby property={currentProperty} sectionRef={nearbyRef} />
            <PropertyMoreInfo property={currentProperty} sectionRef={moreRef} />
            
            {/* Floor Plans - Only render on client side */}
            {isClient && (
              <PropertyFloorPlan 
                property={currentProperty} 
                sectionRef={floorplanRef}
              />
            )}
            
            <PropertyAmenities property={currentProperty} sectionRef={amenitiesRef} />
            <PropertyDeveloper property={currentProperty} sectionRef={developerRef} />
            
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
                <PropertyMap location={currentProperty.location} address={currentProperty.address} />
              </Box>
            </Box>

            {/* Similar Properties - Only render on client side */}
            {isClient && (
              <PropertySimilar 
                property={currentProperty} 
                sectionRef={similarRef}
              />
            )}
          </Grid>
          
          <Grid item xs={12} md={4}>
            {/* Sidebar - Only render on client side */}
            {isClient ? (
              <PropertySidebar property={currentProperty} />
            ) : (
              <Box sx={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PropertyInteractiveWrapper;