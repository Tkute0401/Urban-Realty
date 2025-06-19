import { useState } from 'react';
import { 
  Box, Modal, IconButton, Typography, useMediaQuery, useTheme,
  Stack, Button
} from '@mui/material';
import { Close, NavigateBefore, NavigateNext, Share, Bookmark } from '@mui/icons-material';

const PropertyImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Process images array safely
  const getValidImages = () => {
    if (!images || !Array.isArray(images)) return [];
    
    return images
      .map(img => {
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (typeof img === 'object' && img.url) return img.url;
        return null;
      })
      .filter(img => img !== null);
  };

  const validImages = getValidImages();

  if (validImages.length === 0) {
    return (
      <Box 
        sx={{ 
          height: 200, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          bgcolor: '#f0f0f0',
          borderRadius: 1,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          No images available
        </Typography>
      </Box>
    );
  }

  const handleOpen = (index) => {
    setCurrentIndex(index);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? validImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === validImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Show first 4 images in grid (main + 3 thumbnails)
  const visibleImages = validImages.slice(0, 4);
  const remainingCount = validImages.length - 4;

  if (isMobile) {
    // Mobile: Keep vertical layout
    return (
      <>
        <Box sx={{ position: 'relative', mb: 2 }}>
          {/* Main cover image */}
          <Box
            component="img"
            src={validImages[0]}
            alt="Property cover"
            onError={(e) => { 
              e.target.src = '/default-property.jpg';
              e.target.style.objectFit = 'contain';
            }}
            onClick={() => handleOpen(0)}
            sx={{
              width: '100%',
              height: 300,
              borderRadius: 2,
              cursor: 'pointer',
              objectFit: 'cover',
              border: '1px solid',
              borderColor: 'divider'
            }}
          />
        </Box>

        {/* Thumbnail images row for mobile */}
        {validImages.length > 1 && (
          <Box sx={{ 
            display: 'flex', 
            gap: 1, 
            overflowX: 'auto', 
            py: 1,
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }}>
            {validImages.slice(1).map((img, index) => (
              <Box
                key={index + 1}
                component="img"
                src={img}
                alt={`Property ${index + 2}`}
                onError={(e) => { 
                  e.target.src = '/default-property.jpg';
                  e.target.style.objectFit = 'contain';
                }}
                onClick={() => handleOpen(index + 1)}
                sx={{
                  height: 80,
                  width: 'auto',
                  minWidth: 120,
                  borderRadius: 1,
                  cursor: 'pointer',
                  objectFit: 'cover',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              />
            ))}
          </Box>
        )}

        {/* Modal remains the same */}
        <Modal 
          open={open} 
          onClose={handleClose}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}
        >
          <Box sx={{
            position: 'relative',
            width: '100%',
            maxWidth: '100%',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            outline: 'none',
            borderRadius: 1,
            overflow: 'hidden'
          }}>
            <IconButton 
              onClick={handleClose}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: 8, 
                color: 'white', 
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 1
              }}
            >
              <Close />
            </IconButton>
            
            <Box sx={{ 
              position: 'relative', 
              height: '60vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Box 
                component="img"
                src={validImages[currentIndex]}
                alt={`Property view ${currentIndex + 1}`}
                onError={(e) => { 
                  e.target.src = '/default-property.jpg';
                  e.target.style.objectFit = 'contain';
                }}
                sx={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                sx={{ 
                  position: 'absolute', 
                  left: 8, 
                  top: '50%', 
                  color: 'white', 
                  bgcolor: 'rgba(0,0,0,0.5)',
                  zIndex: 1,
                  transform: 'translateY(-50%)'
                }}
              >
                <NavigateBefore />
              </IconButton>
              
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                sx={{ 
                  position: 'absolute', 
                  right: 8, 
                  top: '50%', 
                  color: 'white', 
                  bgcolor: 'rgba(0,0,0,0.5)',
                  zIndex: 1,
                  transform: 'translateY(-50%)'
                }}
              >
                <NavigateNext />
              </IconButton>
            </Box>

            {validImages.length > 1 && (
              <Box sx={{
                position: 'absolute',
                bottom: 16,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                gap: 1
              }}>
                {validImages.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: currentIndex === index ? 'primary.main' : 'rgba(255,255,255,0.5)',
                      cursor: 'pointer',
                      transition: 'all 0.3s'
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Modal>
      </>
    );
  }

  // Desktop: Horizontal layout like in screenshot
  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        gap: 1, 
        height: 400,
        mb: 2,
        position: 'relative'
      }}>
        {/* Main image on the left */}
        <Box sx={{ 
          flex: '0 0 70%',
          position: 'relative'
        }}>
          <Box
            component="img"
            src={validImages[0]}
            alt="Property main view"
            onError={(e) => { 
              e.target.src = '/default-property.jpg';
              e.target.style.objectFit = 'contain';
            }}
            onClick={() => handleOpen(0)}
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 2,
              cursor: 'pointer',
              objectFit: 'cover',
              border: '1px solid',
              borderColor: 'divider'
            }}
          />
          
          {/* "Cover Image" label */}
          <Box sx={{
            position: 'absolute',
            top: 16,
            left: 16,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: '0.75rem',
            fontWeight: 'medium'
          }}>
            Cover Image
          </Box>
        </Box>

        {/* Thumbnail grid on the right */}
        <Box sx={{ 
          flex: '0 0 30%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          {/* Top thumbnail */}
          {validImages[1] && (
            <Box
              component="img"
              src={validImages[1]}
              alt="Property view 2"
              onError={(e) => { 
                e.target.src = '/default-property.jpg';
                e.target.style.objectFit = 'contain';
              }}
              onClick={() => handleOpen(1)}
              sx={{
                width: '100%',
                height: '49%',
                borderRadius: 1,
                cursor: 'pointer',
                objectFit: 'cover',
                border: '1px solid',
                borderColor: 'divider'
              }}
            />
          )}

          {/* Bottom thumbnail with overlay if more images exist */}
          {validImages[2] && (
            <Box sx={{ 
              position: 'relative',
              height: '49%'
            }}>
              <Box
                component="img"
                src={validImages[2]}
                alt="Property view 3"
                onError={(e) => { 
                  e.target.src = '/default-property.jpg';
                  e.target.style.objectFit = 'contain';
                }}
                onClick={() => handleOpen(2)}
                sx={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 1,
                  cursor: 'pointer',
                  objectFit: 'cover',
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              />
              
              {/* "+X more" overlay */}
              {remainingCount > 0 && (
                <Box 
                  onClick={() => handleOpen(2)}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    borderRadius: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                    +
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {remainingCount + 1} more
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* Modal for full-screen viewing */}
      <Modal 
        open={open} 
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2
        }}
      >
        <Box sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 800,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          boxShadow: 24,
          outline: 'none',
          borderRadius: 1,
          overflow: 'hidden'
        }}>
          <IconButton 
            onClick={handleClose}
            sx={{ 
              position: 'absolute', 
              right: 8, 
              top: 8, 
              color: 'white', 
              bgcolor: 'rgba(0,0,0,0.5)',
              zIndex: 1
            }}
          >
            <Close />
          </IconButton>
          
          <Box sx={{ 
            position: 'relative', 
            height: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box 
              component="img"
              src={validImages[currentIndex]}
              alt={`Property view ${currentIndex + 1}`}
              onError={(e) => { 
                e.target.src = '/default-property.jpg';
                e.target.style.objectFit = 'contain';
              }}
              sx={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain',
                display: 'block'
              }}
            />
            
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              sx={{ 
                position: 'absolute', 
                left: 8, 
                top: '50%', 
                color: 'white', 
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 1,
                transform: 'translateY(-50%)'
              }}
            >
              <NavigateBefore />
            </IconButton>
            
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              sx={{ 
                position: 'absolute', 
                right: 8, 
                top: '50%', 
                color: 'white', 
                bgcolor: 'rgba(0,0,0,0.5)',
                zIndex: 1,
                transform: 'translateY(-50%)'
              }}
            >
              <NavigateNext />
            </IconButton>
          </Box>

          {validImages.length > 1 && (
            <Box sx={{
              position: 'absolute',
              bottom: 16,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
              gap: 1
            }}>
              {validImages.map((_, index) => (
                <Box
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: currentIndex === index ? 'primary.main' : 'rgba(255,255,255,0.5)',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Modal>
    </>
  );
};

export default PropertyImageGallery;