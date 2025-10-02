'use client';

import { Box, Typography, IconButton, Tooltip, Container, CircularProgress } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import { Share } from '@mui/icons-material';

interface Property {
  _id: string;
  title: string;
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    locality: string;
    country: string;
  };
  type: string;
  status: string;
}

interface PropertyHeaderProps {
  property: Property;
  fullAddress: string;
  isFavorite: boolean;
  loadingFavorite: boolean;
  handleFavoriteClick: () => void;
}

const PropertyHeader = ({ 
  property, 
  fullAddress, 
  isFavorite, 
  loadingFavorite, 
  handleFavoriteClick 
}: PropertyHeaderProps) => {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property: ${property.title}`,
        url: window.location.href
      }).catch(err => console.log('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Container maxWidth="xl" sx={{ pt: 4 }}>
      <Box sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: 2,
        p: 4,
        mb: 3,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: 'rgba(255,255,255,0.1)',
          clipPath: 'polygon(30% 0%, 100% 0%, 100% 100%)',
          zIndex: 0
        }} />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Property Type and Status */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                px: 2, 
                py: 0.5, 
                borderRadius: 1,
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: 0.5
              }}
            >
              {property.type}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                px: 2, 
                py: 0.5, 
                borderRadius: 1,
                textTransform: 'uppercase',
                fontWeight: 600,
                letterSpacing: 0.5
              }}
            >
              {property.status}
            </Typography>
          </Box>

          {/* Property Title */}
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700, 
              mb: 2,
              fontSize: { xs: '1.75rem', md: '2.5rem' },
              lineHeight: 1.2
            }}
          >
            {property.title}
          </Typography>

          {/* Price */}
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 600, 
              mb: 3,
              fontSize: { xs: '1.5rem', md: '2rem' },
              color: '#ffd700'
            }}
          >
            ₹{property.price.toLocaleString('en-IN')}
          </Typography>

          {/* Address */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocationOn sx={{ mr: 1, fontSize: '1.2rem' }} />
            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
              {fullAddress}
            </Typography>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
              <IconButton
                onClick={handleFavoriteClick}
                disabled={loadingFavorite}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }
                }}
              >
                {loadingFavorite ? (
                  <CircularProgress size={20} color="inherit" />
                ) : isFavorite ? (
                  <HeartFilled className="h-6 w-6" />
                ) : (
                  <HeartOutline className="h-6 w-6" />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Share property">
              <IconButton
                onClick={handleShare}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                  }
                }}
              >
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default PropertyHeader;
