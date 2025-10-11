'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardMedia, Typography, Box, Chip, IconButton } from '@mui/material';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartFilled } from '@heroicons/react/24/solid';
import { LocationOn, Bed, Bathroom, SquareFoot } from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import http from '@/lib/services/http';
import { Property } from '@/types/property';

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (mounted && user && property?._id) {
        try {
          const response = await http.get(`/api/v1/auth/favorites/${property._id}/status`);
          setIsFavorite(response.data.isFavorite);
        } catch (err) {
          console.error('Error checking favorite status:', err);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [mounted, user, property?._id]);

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

  const handleCardClick = () => {
    if (onClick) {
      onClick(property);
    } else {
      router.push(`/properties/${property._id}`);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!mounted) {
    return (
      <Card sx={{ 
        height: '100%',
        background: 'var(--color-surface)',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ aspectRatio: '16/10', background: 'var(--color-accent)' }} />
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ height: 20, background: 'var(--color-accent)', borderRadius: 1, mb: 2 }} />
          <Box sx={{ height: 16, background: 'var(--color-accent)', borderRadius: 1, mb: 2, width: '60%' }} />
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
        background: 'var(--color-surface)',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderColor: 'var(--color-primary)'
        }
      }}
      onClick={handleCardClick}
    >
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
        />
        
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

        <Chip
          label={property.status}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: property.status === 'For Sale' ? 'var(--color-success)' : 'var(--color-secondary)',
            color: 'var(--color-primary-contrast)',
            fontWeight: 'bold',
            textTransform: 'capitalize',
            fontSize: '0.75rem'
          }}
        />
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Typography 
          variant="h6" 
          component="h3" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 1,
            color: 'var(--color-text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            fontSize: '1.1rem'
          }}
        >
          {property.title}
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'var(--color-primary)', 
            fontWeight: 'bold', 
            mb: 2,
            fontSize: '1.25rem'
          }}
        >
          {formatPrice(property.price)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOn sx={{ fontSize: 18, color: 'var(--color-primary)', mr: 1 }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-muted)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
            }}
          >
            {property.address?.locality && `${property.address.locality}, `}
            {property.address?.city}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bed sx={{ fontSize: 16, color: 'var(--color-primary)' }} />
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
              {property.bedrooms}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bathroom sx={{ fontSize: 16, color: 'var(--color-primary)' }} />
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
              {property.bathrooms}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SquareFoot sx={{ fontSize: 16, color: 'var(--color-primary)' }} />
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
              {property.area} sq ft
            </Typography>
          </Box>
        </Box>

        <Chip 
          label={property.type} 
          size="small" 
          sx={{ 
            background: 'var(--color-primary)', 
            color: 'var(--color-primary-contrast)',
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

