'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  LocationOn, 
  Home, 
  Bed, 
  Bathtub,
  CompareArrows
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useComparison } from '@/contexts/ComparisonContext';
import { Property } from '@/types/property';
import { getSlug } from '@/lib/utils/slug';

interface PropertyCardProps {
  property: Property;
  onClick?: (property: Property) => void;
  index?: number;
  isSelected?: boolean;
  id?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onClick, 
  index = 0, 
  isSelected = false, 
  id 
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { addToComparison, isInComparison, canAddMore } = useComparison();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if property is in favorites when component mounts or user changes
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && property?._id && typeof window !== 'undefined') {
        try {
          const response = await fetch(`/api/v1/auth/favorites/${property._id}/status`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          const data = await response.json();
          setIsFavorite(data.isFavorite);
        } catch (err) {
          console.error('Error checking favorite status:', err);
        }
      } else {
        setIsFavorite(false);
      }
    };
    
    checkFavoriteStatus();
  }, [user, property?._id]);

  const handleClick = () => {
    router.push(`/properties/${getSlug(property)}`);
    if (onClick) {
      onClick(property);
    }
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      router.push('/login');
      return;
    }

    setLoadingFavorite(true);
    try {
      if (typeof window !== 'undefined') {
        if (isFavorite) {
          await fetch(`/api/v1/auth/favorites/${property._id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        } else {
          await fetch(`/api/v1/auth/favorites/${property._id}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        }
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('Error updating favorite:', err);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return 'Price not available';
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹ ${price.toLocaleString()}`;
  };

  const getPossessionLabel = () => {
    const launch = property.projectDetails?.launchDate;
    if (launch) {
      const isFuture = typeof window !== 'undefined' && new Date(launch) > new Date();
      return isFuture ? `Possession ${new Date(launch).toLocaleDateString()}` : 'Ready to Move';
    }
    return 'Ready to Move';
  };

  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
    >
      <Card 
        sx={{ 
          cursor: 'pointer',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface)',
          border: isSelected ? '3px solid var(--color-primary)' : '1px solid var(--color-border)',
          boxShadow: isSelected 
            ? '0 22px 44px rgba(var(--color-primary-rgb), 0.25), 0 0 0 1px rgba(var(--color-primary-rgb), 0.1)' 
            : '0 8px 28px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          width: '100%',
          maxWidth: '420px',
          height: 'auto',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: 'linear-gradient(145deg, var(--color-surface) 0%, rgba(var(--color-primary-rgb), 0.02) 100%)',
          '&:hover': {
            boxShadow: '0 28px 56px rgba(var(--color-primary-rgb), 0.18), 0 0 0 1px rgba(var(--color-primary-rgb), 0.1)',
            border: '2px solid var(--color-primary)',
            transform: 'translateY(-6px)'
          }
        }}
        onClick={handleClick}
      >
      {/* Status/Possession Badge simplified */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 2,
          px: 2,
          py: 1,
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 700,
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-white)'
        }}
      >
        {getPossessionLabel()}
      </Box>

      {/* Image Section */}
      <Box sx={{ 
        position: 'relative', 
        height: '260px', 
        flexShrink: 0,
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
          zIndex: 1,
          pointerEvents: 'none'
        }
      }}>
        {property.images?.length > 0 ? (
          <>
            {!imageLoaded && (
              <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, var(--color-bg) 0%, rgba(var(--color-primary-rgb), 0.05) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}>
                <CircularProgress size={40} sx={{ color: 'var(--color-primary)' }} />
              </Box>
            )}
            <CardMedia
              component="img"
              image={property.images[0].url}
              alt={property.title}
              sx={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                opacity: imageLoaded ? 1 : 0,
                transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: imageLoaded ? 'scale(1)' : 'scale(1.1)',
                filter: 'brightness(0.95) contrast(1.05)'
              }}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <Box sx={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, var(--color-bg) 0%, rgba(var(--color-primary-rgb), 0.05) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2
          }}>
            <Home sx={{ color: 'var(--color-primary)', opacity: 0.6, fontSize: 56 }} />
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              No Image Available
            </Typography>
          </Box>
        )}
        
      {/* Action Buttons */}
      <Box sx={{ 
        position: 'absolute', 
        top: 16, 
        right: 16, 
        display: 'flex', 
        gap: 1, 
        zIndex: 2 
      }}>
        {/* Compare Button */}
        <Tooltip title={isInComparison(property._id) ? "Remove from comparison" : canAddMore ? "Add to comparison" : "Maximum 4 properties can be compared"} arrow>
          <Box
            component="button"
            onClick={(e) => {
              e.stopPropagation();
              if (isInComparison(property._id)) {
                return;
              }
              if (canAddMore) {
                addToComparison(property);
              } else {
                alert('You can compare up to 4 properties at a time');
              }
            }}
            sx={{
              p: 1.5,
              backgroundColor: isInComparison(property._id) 
                ? 'rgba(var(--color-primary-rgb), 0.9)' 
                : 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: '50%',
              border: `1px solid ${isInComparison(property._id) ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.3)'}`,
              cursor: canAddMore || isInComparison(property._id) ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: 40,
              minHeight: 40,
              opacity: canAddMore || isInComparison(property._id) ? 1 : 0.6,
              '&:hover': {
                backgroundColor: isInComparison(property._id) 
                  ? 'rgba(var(--color-primary-rgb), 1)' 
                  : 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
              }
            }}
          >
            <CompareArrows sx={{ 
              color: isInComparison(property._id) ? 'white' : 'var(--color-primary)', 
              fontSize: 20 
            }} />
          </Box>
        </Tooltip>

        {/* Favorite Button */}
        <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"} arrow>
          <Box
            component="button"
            sx={{
              p: 1.5,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              borderRadius: '50%',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              minWidth: 40,
              minHeight: 40,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
              },
              '@media (max-width: 768px)': {
                minWidth: 44,
                minHeight: 44,
                p: 2
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleFavoriteClick(e);
            }}
            disabled={loadingFavorite}
          >
            {loadingFavorite ? (
              <CircularProgress size={20} sx={{ color: 'var(--color-primary)' }} />
            ) : isFavorite ? (
              <Favorite sx={{ 
                color: 'var(--color-error)', 
                fontSize: 20,
                filter: 'drop-shadow(0 2px 4px rgba(var(--color-error-rgb), 0.3))'
              }} />
            ) : (
              <FavoriteBorder sx={{ 
                color: 'var(--color-text-muted)', 
                fontSize: 20,
                '&:hover': {
                  color: 'var(--color-error)'
                }
              }} />
            )}
          </Box>
        </Tooltip>
      </Box>

      {/* Content Section simplified */}
      <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 1.75 }}>
        <Typography 
          variant="h6" 
          sx={{ fontWeight: 700, color: 'var(--color-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          {property.buildingName || property.title}
        </Typography>

        <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
          <LocationOn sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
          {property.address?.city}{property.address?.state ? `, ${property.address.state}` : ''}
        </Typography>

        <Typography variant="h5" sx={{ fontWeight: 800, color: 'var(--color-primary)', mt: 1 }}>
          {formatPrice(property.price)}{property.status === 'For Rent' ? ' /mo' : ''}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2.5, mt: 1.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bed sx={{ fontSize: 20, color: 'var(--color-text-muted)' }} />
            <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
              {property.bedrooms || 0} BHK
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Bathtub sx={{ fontSize: 20, color: 'var(--color-text-muted)' }} />
            <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
              {property.bathrooms || 0} Bath
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Home sx={{ fontSize: 20, color: 'var(--color-text-muted)' }} />
            <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
              {property.area ? `${property.area.toLocaleString()} sqft` : 'N/A'}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      {/* Highlight animation when selected */}
      {isSelected && (
        <Box sx={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            border: '3px solid var(--color-primary)',
            borderRadius: '20px',
            opacity: 0,
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }
        }} />
      )}
      </Card>
    </motion.div>
  );
};

export default PropertyCard;