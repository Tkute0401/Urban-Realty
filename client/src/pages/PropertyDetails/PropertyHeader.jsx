import { Box, Typography, IconButton, Tooltip, Container, CircularProgress } from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartFilled } from "@heroicons/react/24/solid";
import { Share } from '@mui/icons-material';

const PropertyHeader = ({ 
  property, 
  fullAddress, 
  isFavorite, 
  loadingFavorite, 
  handleFavoriteClick 
}) => {
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
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        mb: 3 
      }}>
        <Box>
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            color: '#78CADC',
            mb: 1
          }}>
            {property.title}
          </Typography>
          
          <Typography variant="body1" sx={{ 
            color: 'rgba(255, 255, 255, 0.85)',
            mb: 2,
            fontSize: '1.1rem'
          }}>
            By {property.agent?.name || 'N/A'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LocationOn sx={{ color: '#78CADC', mr: 1 }} />
            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
              {fullAddress}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {/* Share Button */}
          <Tooltip title="Share this property">
            <IconButton
              onClick={handleShare}
              sx={{ 
                backgroundColor: 'rgba(120, 202, 220, 0.2)',
                color: '#78CADC',
                '&:hover': {
                  backgroundColor: 'rgba(120, 202, 220, 0.3)'
                }
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>

          {/* Favorite Button */}
          <Tooltip title={isFavorite ? "Remove from favorites" : "Add to favorites"}>
            <IconButton 
              onClick={handleFavoriteClick}
              disabled={loadingFavorite}
              sx={{ 
                backgroundColor: 'rgba(120, 202, 220, 0.2)',
                color: isFavorite ? '#ff4081' : '#78CADC',
                '&:hover': {
                  backgroundColor: 'rgba(120, 202, 220, 0.3)'
                }
              }}
            >
              {loadingFavorite ? (
                <CircularProgress size={24} sx={{ color: '#78CADC' }} />
              ) : isFavorite ? (
                <HeartFilled className="w-5 h-5" />
              ) : (
                <HeartOutline className="w-5 h-5" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Container>
  );
};

export default PropertyHeader;