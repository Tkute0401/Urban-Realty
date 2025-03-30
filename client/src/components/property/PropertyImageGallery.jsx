import { useState } from 'react';
import { Box, Modal, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Close, NavigateBefore, NavigateNext } from '@mui/icons-material';

const PropertyImageGallery = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  return (
    <>
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
        {validImages.map((img, index) => (
          <Box
            key={index}
            component="img"
            src={img}
            alt={`Property ${index + 1}`}
            onError={(e) => { 
              e.target.src = '/default-property.jpg';
              e.target.style.objectFit = 'contain';
            }}
            onClick={() => handleOpen(index)}
            sx={{
              height: isMobile ? 150 : 200,
              width: 'auto',
              minWidth: isMobile ? 250 : 300,
              borderRadius: 1,
              cursor: 'pointer',
              objectFit: 'cover',
              border: '1px solid',
              borderColor: 'divider'
            }}
          />
        ))}
      </Box>

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
          maxWidth: isMobile ? '100%' : 800,
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
            height: isMobile ? '60vh' : '70vh',
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