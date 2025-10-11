'use client';

import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton } from '@mui/material';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilled } from '@heroicons/react/24/solid';
import { LocationOn, Bed, Bathroom, SquareFoot } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeContext } from '@/contexts/ThemeProvider';
import http from '@/lib/services/http';

interface Property {
  _id: string;
  title: string;
  buildingName?: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  description?: string;
  address?: {
    street?: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  images?: Array<{ url: string; alt?: string; caption?: string }>;
  projectDetails?: {
    launchDate?: string;
    possessionDate?: string;
    developer?: string;
  };
  location?: {
    latitude: number;
    longitude: number;
  };
  amenities?: string[];
  highlights?: string[];
  floorPlan?: {
    image: string;
    description: string;
  };
  nearbyPlaces?: Array<{
    name: string;
    type: string;
    distance: string;
  }>;
  similarProperties?: Property[];
  createdAt?: string;
  updatedAt?: string;
}

interface PropertyCardProps {
  property: Property;
  index?: number;
  isSelected?: boolean;
  onClick?: (property: Property) => void;
  id?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  index = 0, 
  isSelected = false, 
  onClick, 
  id 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isDark = theme === 'dark';

  // Client-side mounting check
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check if property is in favorites when component mounts or user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (mounted && user && property?._id) {
        try {
          const response = await http.get(`/api/v1/auth/favorites/${property._id}/status`);
          const data = response.data;
          setIsFavorite(data.isFavorite);
        } catch (err) {
          console.error('Error checking favorite status:', err);
        }
      } else {
        setIsFavorite(false);
      }
    };
    
    checkFavoriteStatus();
  }, [mounted, user, property?._id]);

  // Handle favorite toggle
  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      router.push('/login');
      return;
    }

    if (!mounted) return;

    try {
      setLoadingFavorite(true);
      
      if (isFavorite) {
        await http.delete(`/api/v1/auth/favorites/${property._id}`);
        setIsFavorite(false);
      } else {
        await http.put(`/api/v1/auth/favorites/${property._id}`);
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoadingFavorite(false);
    }
  };

  // Handle card click
  const handleCardClick = () => {
    if (onClick) {
      onClick(property);
    } else {
      router.push(`/properties/${property._id}`);
    }
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Show loading state until mounted
  if (!mounted) {
    return (
      <Card sx={{ 
        height: '100%',
        background: isDark ? '#1a202c' : '#ffffff',
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ aspectRatio: '16/10', background: '#f3f4f6' }} />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ height: 20, background: '#e5e7eb', borderRadius: 1, mb: 2 }} />
          <Box sx={{ height: 16, background: '#e5e7eb', borderRadius: 1, mb: 2, width: '60%' }} />
          <Box sx={{ height: 14, background: '#e5e7eb', borderRadius: 1, mb: 2 }} />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Box sx={{ height: 24, background: '#e5e7eb', borderRadius: 1, width: 60 }} />
            <Box sx={{ height: 24, background: '#e5e7eb', borderRadius: 1, width: 60 }} />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        background: isDark ? '#1a202c' : '#ffffff',
        borderRadius: 3,
        overflow: 'hidden',
        border: `1px solid ${isDark ? '#2d3748' : '#e2e8f0'}`,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderColor: '#78CADC'
        }
      }}
      onClick={handleCardClick}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', aspectRatio: '16/10' }}>
        <CardMedia
          component="img"
          image={property.images?.[0]?.url || '/placeholder-property.jpg'}
          alt={property.title}
          sx={{ 
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)'
            }
          }}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Favorite Button */}
        <IconButton
          onClick={handleFavoriteToggle}
          disabled={loadingFavorite}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(8px)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 1)',
            },
            width: 40,
            height: 40,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        >
          {isFavorite ? (
            <HeartFilled className="w-5 h-5 text-red-500" />
          ) : (
            <HeartOutline className="w-5 h-5 text-gray-600" />
          )}
        </IconButton>

        {/* Status Badge */}
        <Chip
          label={property.status}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: property.status === 'sale' ? '#10b981' : '#3b82f6',
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'capitalize',
            fontSize: '0.75rem'
          }}
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        {/* Title */}
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            color: isDark ? '#ffffff' : '#1a202c',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '1.1rem'
          }}
        >
          {property.title}
        </Typography>
        
        {/* Price */}
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#78CADC', 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: '1.25rem'
          }}
        >
          {formatPrice(property.price)}
        </Typography>

        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ fontSize: 18, color: '#78CADC', mr: 1 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: isDark ? '#a0aec0' : '#4a5568',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}
          >
            {property.address?.street}, {property.address?.city}
          </Typography>
        </Box>

        {/* Property Details */}
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bed sx={{ fontSize: 16, color: '#78CADC' }} />
            <Typography variant="body2" sx={{ color: isDark ? '#a0aec0' : '#4a5568' }}>
              {property.bedrooms}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bathroom sx={{ fontSize: 16, color: '#78CADC' }} />
            <Typography variant="body2" sx={{ color: isDark ? '#a0aec0' : '#4a5568' }}>
              {property.bathrooms}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SquareFoot sx={{ fontSize: 16, color: '#78CADC' }} />
            <Typography variant="body2" sx={{ color: isDark ? '#a0aec0' : '#4a5568' }}>
              {property.area} sq ft
            </Typography>
          </Box>
        </Box>

        {/* Property Type */}
        <Chip 
          label={property.type} 
          size="small" 
          sx={{ 
            background: '#78CADC', 
            color: 'white',
            textTransform: 'capitalize',
            fontWeight: 'bold',
            fontSize: '0.75rem'
          }} 
        />
      </CardContent>
    </Card>
  );
};

export default PropertyCard;