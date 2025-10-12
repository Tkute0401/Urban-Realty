'use client';

import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Box, 
  Chip, 
  IconButton,
  Tooltip,
  CircularProgress,
  Button
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  LocationOn, 
  Home, 
  Bed, 
  Bathtub,
  Star
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Property } from '@/types/property';

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
    router.push(`/properties/${property._id}`);
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

  const getPropertyTypeIcon = () => {
    switch (property.type?.toLowerCase()) {
      case 'apartment':
        return <Home sx={{ color: 'var(--color-primary)', fontSize: 16 }} />;
      case 'villa':
        return <Home sx={{ color: 'var(--color-primary)', fontSize: 16 }} />;
      case 'land':
        return <Home sx={{ color: 'var(--color-primary)', fontSize: 16 }} />;
      case 'commercial':
        return <Home sx={{ color: 'var(--color-primary)', fontSize: 16 }} />;
      default:
        return <Home sx={{ color: 'var(--color-primary)', fontSize: 16 }} />;
    }
  };

  return (
    <Card 
      id={id}
      sx={{ 
        cursor: 'pointer',
        borderRadius: { xs: '12px', sm: '24px' },
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface)',
        border: isSelected ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
        boxShadow: isSelected ? '0 8px 25px rgba(247, 107, 28, 0.3)' : 'none',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 25px rgba(247, 107, 28, 0.2)',
          border: '1px solid var(--color-primary)'
        }
      }}
      onClick={handleClick}
    >
      {/* Status Badge */}
      {property.status && (
        <Chip
          label={property.status}
          size="small"
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 1,
            backgroundColor: property.status === 'For Sale' ? 'var(--color-primary)' : 'var(--color-error)',
            color: property.status === 'For Sale' ? 'var(--color-primary-contrast)' : 'var(--color-white)',
            fontSize: '12px',
            fontWeight: 'bold'
          }}
        />
      )}

      {/* Image Section */}
      <Box sx={{ position: 'relative', aspectRatio: '16/9' }}>
        {property.images?.length > 0 ? (
          <>
            {!imageLoaded && (
              <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'var(--color-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CircularProgress size={32} sx={{ color: 'var(--color-primary)' }} />
              </Box>
            )}
            <CardMedia
              component="img"
              image={property.images[0].url}
              alt={property.title}
              sx={{
                height: '100%',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease'
              }}
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <Box sx={{
            width: '100%',
            height: '100%',
            background: 'var(--color-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Home sx={{ color: 'var(--color-primary)', opacity: 0.5, fontSize: 48 }} />
          </Box>
        )}
        
        {/* Favorite Button */}
        <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"} arrow>
          <IconButton
            sx={{
              position: 'absolute',
              top: { xs: 8, sm: 16 },
              right: { xs: 8, sm: 16 },
              backgroundColor: 'var(--color-surface)',
              backdropFilter: 'blur(4px)',
              padding: { xs: 1, sm: 1.5 },
              '&:hover': {
                backgroundColor: 'var(--color-surface-elevated)'
              }
            }}
            onClick={handleFavoriteClick}
            disabled={loadingFavorite}
          >
            {loadingFavorite ? (
              <CircularProgress size={20} sx={{ color: 'var(--color-text-primary)' }} />
            ) : isFavorite ? (
              <Favorite sx={{ color: 'var(--color-error)', fontSize: { xs: 16, sm: 20 } }} />
            ) : (
              <FavoriteBorder sx={{ color: 'var(--color-text-primary)', fontSize: { xs: 16, sm: 20 } }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
        {/* Rating and Type */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} sx={{ color: 'var(--color-warning)', fontSize: { xs: 12, sm: 16 } }} />
            ))}
            <Typography variant="caption" sx={{ color: 'var(--color-text-muted)', ml: 1 }}>
              5.0 (??)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getPropertyTypeIcon()}
            <Typography variant="caption" sx={{ color: 'var(--color-primary)', textTransform: 'capitalize' }}>
              {property.type || 'Property'}
            </Typography>
          </Box>
        </Box>
        
        {/* Title */}
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'var(--color-text-primary)', 
            mb: { xs: 1, sm: 2 },
            fontSize: { xs: '18px', sm: '20px' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {property.buildingName || property.title}
        </Typography>
        
        {/* Location */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
          <LocationOn sx={{ color: 'var(--color-primary)', fontSize: { xs: 12, sm: 16 } }} />
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-primary)',
              fontSize: { xs: '12px', sm: '14px' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {property.address?.street && `${property.address.street}, `}
            {property.address?.city}, {property.address?.state}
          </Typography>
        </Box>
        
        {/* Description */}
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'var(--color-text-muted)', 
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '12px', sm: '14px' },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}
        >
          {property.description || 'No description available'}
        </Typography>
        
        {/* Features */}
        <Box sx={{ display: 'flex', gap: { xs: 3, sm: 6 }, mb: { xs: 3, sm: 4 } }}>
          <Tooltip title="Area" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Home sx={{ color: 'var(--color-primary)', fontSize: { xs: 14, sm: 16 } }} />
              <Typography variant="caption" sx={{ color: 'var(--color-text-primary)', fontSize: { xs: '12px', sm: '14px' } }}>
                {property.area ? `${property.area.toLocaleString()} sqft` : 'N/A'}
              </Typography>
            </Box>
          </Tooltip>
          
          <Tooltip title="Bedrooms" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Bed sx={{ color: 'var(--color-primary)', fontSize: { xs: 14, sm: 16 } }} />
              <Typography variant="caption" sx={{ color: 'var(--color-text-primary)', fontSize: { xs: '12px', sm: '14px' } }}>
                {property.bedrooms || '0'} Bed
              </Typography>
            </Box>
          </Tooltip>
          
          <Tooltip title="Bathrooms" arrow>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Bathtub sx={{ color: 'var(--color-primary)', fontSize: { xs: 14, sm: 16 } }} />
              <Typography variant="caption" sx={{ color: 'var(--color-text-primary)', fontSize: { xs: '12px', sm: '14px' } }}>
                {property.bathrooms || '0'} Bath
              </Typography>
            </Box>
          </Tooltip>
        </Box>
        
        {/* Price and CTA */}
        <Box sx={{ pt: 3, borderTop: '1px solid var(--color-border)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 2, sm: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)', fontSize: { xs: '20px', sm: '24px' } }}>
              {formatPrice(property.price)}
              {property.status === 'For Rent' && (
                <Typography component="span" variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                  /mo
                </Typography>
              )}
            </Typography>
            {property.projectDetails?.launchDate && (
              <Chip
                label={
                  typeof window !== 'undefined' && new Date(property.projectDetails.launchDate) > new Date() ? 
                    `Launch ${new Date(property.projectDetails.launchDate).toLocaleDateString()}` : 
                    'Ready to Move'
                }
                size="small"
                sx={{
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  fontSize: '12px'
                }}
              />
            )}
          </Box>
          
          <Button
            variant="outlined"
            fullWidth
            sx={{
              backgroundColor: 'transparent',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-text-primary)',
              padding: { xs: '6px 12px', sm: '8px 16px' },
              borderRadius: '8px',
              fontSize: { xs: '12px', sm: '14px' },
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'var(--color-primary-light)',
                border: '1px solid var(--color-primary)'
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            View Details
          </Button>
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
            border: '2px solid var(--color-primary)',
            borderRadius: { xs: '12px', sm: '24px' },
            opacity: 0,
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }
        }} />
      )}
    </Card>
  );
};

export default PropertyCard;