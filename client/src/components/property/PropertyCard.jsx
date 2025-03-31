import { Card, CardMedia, CardContent, Typography, Box, Chip, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { LocationOn, KingBed, Bathtub, SquareFoot, Star } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../../utils/format';
import { useState } from 'react';

const PropertyCard = ({ property, compact = false }) => {
  console.log('PropertyCard:', property);
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getImageUrl = (img) => {
    try {
      if (!img) return null;
      if (typeof img === 'string') return img;
      if (typeof img === 'object' && img.url) return img.url;
      return null;
    } catch (error) {
      console.error('Error parsing image URL:', error);
      return null;
    }
  };

  const getPrimaryImage = () => {
    if (imageError) return '/default-property.jpg';
    
    if (!property?.images || !Array.isArray(property.images) || property.images.length === 0) {
      return '/default-property.jpg';
    }

    const primaryImg = property.images.find(img => img.isPrimary) || property.images[0];
    return getImageUrl(primaryImg) || '/default-property.jpg';
  };

  const primaryImage = getPrimaryImage();

  const handleImageError = () => {
    setImageError(true);
  };

  const handleCardClick = () => {
    if (property?._id) {
      navigate(`/properties/${property._id}`);
    }
  };

  const getAddressComponent = (component) => {
    if (!property?.address) return '';
    if (typeof property.address === 'string') return property.address;
    return property.address[component] || '';
  };

  const city = getAddressComponent('city');
  const state = getAddressComponent('state');
  const locationText = city && state ? `${city}, ${state}` : city || state || 'Location not specified';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: isMobile ? 'none' : 'translateY(-8px)',
          boxShadow: isMobile ? 2 : 6
        },
        cursor: 'pointer',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        ...(compact && {
          '& .MuiCardContent-root': { p: 1 },
          '& .MuiTypography-h6': { fontSize: '0.875rem' }
        })
      }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      elevation={0}
    >
      {property?.featured && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            borderRadius: 1,
            px: 1.2,
            py: 0.5,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <Star fontSize="small" sx={{ mr: 0.5 }} />
          <Typography 
            variant="caption" 
            fontWeight="bold"
            sx={{ fontSize: '0.6rem' }}
          >
            Featured
          </Typography>
        </Box>
      )}

      <Box sx={{ 
        position: 'relative',
        overflow: 'hidden',
        height: compact ? 120 : isMobile ? 180 : 220
      }}>
        <CardMedia
          component="img"
          image={primaryImage}
          alt={property?.title || 'Property image'}
          onError={handleImageError}
          sx={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            backgroundColor: imageError ? '#f0f0f0' : 'transparent',
          }}
        />
        <Box sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '30%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
        }} />
      </Box>
      
      <CardContent sx={{ 
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        p: compact ? 1.5 : 2
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip
            label={property?.type || 'N/A'}
            color="primary"
            size="small"
            sx={{ 
              textTransform: 'capitalize',
              fontSize: compact ? '0.6rem' : '0.7rem',
              height: compact ? 22 : 24,
              fontWeight: 600
            }}
          />
          
          <Chip
            label={property?.status || 'N/A'}
            color={
              property?.status === 'For Sale' ? 'primary' : 
              property?.status === 'For Rent' ? 'secondary' : 'default'
            }
            size="small"
            variant="outlined"
            sx={{ 
              fontSize: compact ? '0.6rem' : '0.7rem',
              height: compact ? 22 : 24,
              fontWeight: 600
            }}
          />
        </Box>

        <Typography 
          variant={compact ? 'subtitle2' : 'subtitle1'} 
          component="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: compact ? '2.5em' : '3em',
            mb: compact ? 0.5 : 1,
            color: 'text.primary'
          }}
        >
          {property?.title || 'Untitled Property'}
        </Typography>

        <Tooltip title={locationText} arrow>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            mb={compact ? 1 : 1.5} 
            sx={{
              display: 'flex',
              alignItems: 'center',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: compact ? '0.7rem' : '0.8rem'
            }}
          >
            <LocationOn fontSize="small" sx={{ mr: 0.5, color: 'primary.main' }} />
            {locationText}
          </Typography>
        </Tooltip>

        <Box display="flex" justifyContent="space-between" mt="auto" sx={{ 
          gap: 1,
          mb: compact ? 0.5 : 1.5
        }}>
          <Tooltip title="Bedrooms" arrow>
            <Box display="flex" alignItems="center">
              <KingBed fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: compact ? '0.7rem' : '0.8rem',
                  color: 'text.secondary'
                }}
              >
                {property?.bedrooms || 'N/A'}
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Bathrooms" arrow>
            <Box display="flex" alignItems="center">
              <Bathtub fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: compact ? '0.7rem' : '0.8rem',
                  color: 'text.secondary'
                }}
              >
                {property?.bathrooms || 'N/A'}
              </Typography>
            </Box>
          </Tooltip>

          <Tooltip title="Area" arrow>
            <Box display="flex" alignItems="center">
              <SquareFoot fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: compact ? '0.7rem' : '0.8rem',
                  color: 'text.secondary'
                }}
              >
                {property?.area ? `${property.area.toLocaleString()} sqft` : 'N/A'}
              </Typography>
            </Box>
          </Tooltip>
        </Box>

        <Typography 
          variant={compact ? 'subtitle2' : 'subtitle1'} 
          color="primary" 
          fontWeight="bold" 
          textAlign="right"
          sx={{ 
            fontSize: compact ? '0.875rem' : '1rem',
            mt: 'auto'
          }}
        >
          {formatPrice(property?.price || 0)}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;