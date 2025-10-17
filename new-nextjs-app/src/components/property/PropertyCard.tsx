'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: 'var(--color-surface)',
          border: isSelected ? '3px solid var(--color-primary)' : '1px solid var(--color-border)',
          boxShadow: isSelected 
            ? '0 20px 40px rgba(247, 107, 28, 0.25), 0 0 0 1px rgba(247, 107, 28, 0.1)' 
            : '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          width: '100%',
          maxWidth: '380px',
          height: '580px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          background: 'linear-gradient(145deg, var(--color-surface) 0%, rgba(247, 107, 28, 0.02) 100%)',
          '&:hover': {
            boxShadow: '0 25px 50px rgba(247, 107, 28, 0.15), 0 0 0 1px rgba(247, 107, 28, 0.1)',
            border: '2px solid var(--color-primary)',
            transform: 'translateY(-4px)'
          }
        }}
        onClick={handleClick}
      >
      {/* Status Badge */}
      {property.status && (
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 2,
            px: 3,
            py: 1.5,
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            backgroundColor: property.status === 'For Sale' 
              ? 'linear-gradient(135deg, var(--color-primary) 0%, #FF8C42 100%)' 
              : 'linear-gradient(135deg, var(--color-error) 0%, #FF6B6B 100%)',
            color: 'var(--color-white)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {property.status}
        </Box>
      )}

      {/* Image Section */}
      <Box sx={{ 
        position: 'relative', 
        height: '240px', 
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
                background: 'linear-gradient(135deg, var(--color-bg) 0%, rgba(247, 107, 28, 0.05) 100%)',
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
            background: 'linear-gradient(135deg, var(--color-bg) 0%, rgba(247, 107, 28, 0.05) 100%)',
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
        
        {/* Favorite Button */}
        <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"} arrow>
          <Box
            component="button"
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              p: 2,
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
              zIndex: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
                transform: 'scale(1.1)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.2)'
              }
            }}
            onClick={handleFavoriteClick}
            disabled={loadingFavorite}
          >
            {loadingFavorite ? (
              <CircularProgress size={22} sx={{ color: 'var(--color-primary)' }} />
            ) : isFavorite ? (
              <Favorite sx={{ 
                color: 'var(--color-error)', 
                fontSize: 22,
                filter: 'drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3))'
              }} />
            ) : (
              <FavoriteBorder sx={{ 
                color: 'var(--color-text-muted)', 
                fontSize: 22,
                '&:hover': {
                  color: 'var(--color-error)'
                }
              }} />
            )}
          </Box>
        </Tooltip>
      </Box>

      {/* Content Section */}
      <CardContent sx={{ 
        p: 4, 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        background: 'linear-gradient(180deg, transparent 0%, rgba(247, 107, 28, 0.02) 100%)'
      }}>
        {/* Rating and Type */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          mb: 3,
          p: 2,
          backgroundColor: 'rgba(247, 107, 28, 0.05)',
          borderRadius: '12px',
          border: '1px solid rgba(247, 107, 28, 0.1)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} sx={{ 
                  color: 'var(--color-warning)', 
                  fontSize: 16,
                  filter: 'drop-shadow(0 1px 2px rgba(245, 158, 11, 0.3))'
                }} />
              ))}
            </Box>
            <Typography variant="caption" sx={{ 
              color: 'var(--color-text-primary)', 
              ml: 1, 
              fontSize: '14px',
              fontWeight: 600
            }}>
              5.0 (24 reviews)
            </Typography>
          </Box>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5,
            px: 2,
            py: 1,
            backgroundColor: 'var(--color-primary)',
            borderRadius: '8px',
            color: 'var(--color-white)'
          }}>
            {getPropertyTypeIcon()}
            <Typography variant="caption" sx={{ 
              textTransform: 'uppercase', 
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.5px'
            }}>
              {property.type || 'Property'}
            </Typography>
          </Box>
        </Box>
        
        {/* Title */}
        <Typography 
          variant="h5" 
          sx={{ 
            fontWeight: 700, 
            color: 'var(--color-text-primary)', 
            mb: 2,
            fontSize: '22px',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            background: 'linear-gradient(135deg, var(--color-text-primary) 0%, var(--color-primary) 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {property.buildingName || property.title}
        </Typography>
        
        {/* Location */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          p: 2,
          backgroundColor: 'rgba(26, 43, 255, 0.05)',
          borderRadius: '10px',
          border: '1px solid rgba(26, 43, 255, 0.1)'
        }}>
          <Box sx={{
            p: 1,
            backgroundColor: 'var(--color-secondary)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <LocationOn sx={{ color: 'var(--color-white)', fontSize: 18 }} />
          </Box>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-primary)',
              fontSize: '14px',
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              flex: 1
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
            mb: 4,
            fontSize: '14px',
            lineHeight: 1.6,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            fontStyle: 'italic'
          }}
        >
          {property.description || 'No description available'}
        </Typography>
        
        {/* Features */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: 2, 
          mb: 4,
          p: 3,
          backgroundColor: 'rgba(247, 107, 28, 0.03)',
          borderRadius: '12px',
          border: '1px solid rgba(247, 107, 28, 0.08)'
        }}>
          <Tooltip title="Area" arrow>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: 1,
              p: 2,
              backgroundColor: 'var(--color-white)',
              borderRadius: '10px',
              border: '1px solid rgba(247, 107, 28, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(247, 107, 28, 0.05)',
                transform: 'translateY(-2px)'
              }
            }}>
              <Home sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
              <Typography variant="caption" sx={{ 
                color: 'var(--color-text-primary)', 
                fontSize: '12px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                {property.area ? `${property.area.toLocaleString()}` : 'N/A'}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'var(--color-text-muted)', 
                fontSize: '10px',
                textAlign: 'center'
              }}>
                sqft
              </Typography>
            </Box>
          </Tooltip>
          
          <Tooltip title="Bedrooms" arrow>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: 1,
              p: 2,
              backgroundColor: 'var(--color-white)',
              borderRadius: '10px',
              border: '1px solid rgba(247, 107, 28, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(247, 107, 28, 0.05)',
                transform: 'translateY(-2px)'
              }
            }}>
              <Bed sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
              <Typography variant="caption" sx={{ 
                color: 'var(--color-text-primary)', 
                fontSize: '12px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                {property.bedrooms || '0'}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'var(--color-text-muted)', 
                fontSize: '10px',
                textAlign: 'center'
              }}>
                Bed
              </Typography>
            </Box>
          </Tooltip>
          
          <Tooltip title="Bathrooms" arrow>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              gap: 1,
              p: 2,
              backgroundColor: 'var(--color-white)',
              borderRadius: '10px',
              border: '1px solid rgba(247, 107, 28, 0.1)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'rgba(247, 107, 28, 0.05)',
                transform: 'translateY(-2px)'
              }
            }}>
              <Bathtub sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
              <Typography variant="caption" sx={{ 
                color: 'var(--color-text-primary)', 
                fontSize: '12px',
                fontWeight: 600,
                textAlign: 'center'
              }}>
                {property.bathrooms || '0'}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'var(--color-text-muted)', 
                fontSize: '10px',
                textAlign: 'center'
              }}>
                Bath
              </Typography>
            </Box>
          </Tooltip>
        </Box>
        
        {/* Price and CTA */}
        <Box sx={{ 
          pt: 4, 
          borderTop: '2px solid rgba(247, 107, 28, 0.1)', 
          mt: 'auto',
          background: 'linear-gradient(135deg, rgba(247, 107, 28, 0.02) 0%, transparent 100%)'
        }}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            mb: 3,
            p: 3,
            backgroundColor: 'var(--color-white)',
            borderRadius: '12px',
            border: '1px solid rgba(247, 107, 28, 0.1)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 800, 
                color: 'var(--color-text-primary)', 
                fontSize: '28px',
                lineHeight: 1.2,
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                {formatPrice(property.price)}
                {property.status === 'For Rent' && (
                  <Typography component="span" variant="body2" sx={{ 
                    color: 'var(--color-text-muted)', 
                    fontSize: '16px',
                    fontWeight: 500,
                    ml: 1
                  }}>
                    /mo
                  </Typography>
                )}
              </Typography>
              <Typography variant="caption" sx={{ 
                color: 'var(--color-text-muted)', 
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {property.status || 'For Sale'}
              </Typography>
            </Box>
            {property.projectDetails?.launchDate && (
              <Box
                sx={{
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, #FF8C42 100%)',
                  color: 'var(--color-white)',
                  px: 3,
                  py: 1.5,
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 4px 12px rgba(247, 107, 28, 0.3)'
                }}
              >
                {typeof window !== 'undefined' && new Date(property.projectDetails.launchDate) > new Date() ? 
                  `Launch ${new Date(property.projectDetails.launchDate).toLocaleDateString()}` : 
                  'Ready to Move'}
              </Box>
            )}
          </Box>
          
          <motion.button
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, var(--color-primary) 0%, #FF8C42 100%)',
              border: 'none',
              color: 'var(--color-white)',
              padding: '16px 24px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 15px rgba(247, 107, 28, 0.3)',
              position: 'relative',
              overflow: 'hidden'
            }}
            whileHover={{ 
              scale: 1.02,
              boxShadow: '0 8px 25px rgba(247, 107, 28, 0.4)'
            }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <span style={{ position: 'relative', zIndex: 1 }}>View Details</span>
          </motion.button>
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