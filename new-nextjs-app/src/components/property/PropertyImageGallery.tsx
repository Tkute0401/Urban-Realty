'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Fullscreen, 
  Close,
  ZoomIn,
  ZoomOut
} from '@mui/icons-material';
import { IconButton, Box, Typography, Chip } from '@mui/material';
import { useThemeContext } from '@/contexts/ThemeContext';

interface Image {
  url: string;
  alt?: string;
  caption?: string;
}

interface PropertyImageGalleryProps {
  images: Image[];
  propertyTitle?: string;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({
  images,
  propertyTitle = 'Property',
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000
}) => {
  const { theme } = useThemeContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDark = theme === 'dark';

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, autoPlayInterval);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, autoPlayInterval, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsZoomed(false);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (isFullscreen) {
      switch (e.key) {
        case 'Escape':
          setIsFullscreen(false);
          setIsZoomed(false);
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case ' ':
          e.preventDefault();
          toggleZoom();
          break;
      }
    }
  };

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen]);

  if (!images || images.length === 0) {
    return (
      <Box sx={{
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        borderRadius: '12px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        <Typography variant="h6" color="text.secondary">
          No images available
        </Typography>
      </Box>
    );
  }

  const currentImage = images[currentIndex];

  return (
    <>
      {/* Main Gallery */}
      <Box sx={{
        position: 'relative',
        height: { xs: '300px', sm: '400px', md: '500px' },
        borderRadius: '12px',
        overflow: 'hidden',
        background: isDark ? '#0B1011' : '#f8fafc',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        {/* Main Image */}
        <Box sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!imageLoaded && (
            <Box sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
            }}>
              <Box sx={{
                width: 40,
                height: 40,
                border: '2px solid transparent',
                borderTop: '2px solid #78CADC',
                borderLeft: '2px solid #78CADC',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            </Box>
          )}
          
          <motion.img
            key={currentIndex}
            src={currentImage.url}
            alt={currentImage.alt || propertyTitle}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: imageLoaded ? 1 : 0,
              transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
              transition: 'transform 0.3s ease'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageLoaded(true)}
          />

          {/* Image Counter */}
          <Chip
            label={`${currentIndex + 1} / ${images.length}`}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              backdropFilter: 'blur(10px)'
            }}
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={goToPrevious}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>
              
              <IconButton
                onClick={goToNext}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}

          {/* Action Buttons */}
          <Box sx={{
            position: 'absolute',
            bottom: 16,
            right: 16,
            display: 'flex',
            gap: 1
          }}>
            <IconButton
              onClick={toggleZoom}
              sx={{
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              {isZoomed ? <ZoomOut /> : <ZoomIn />}
            </IconButton>
            
            <IconButton
              onClick={toggleFullscreen}
              sx={{
                background: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.7)'
                }
              }}
            >
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <Box sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.8))',
            p: 2,
            display: 'flex',
            gap: 1,
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              height: 4
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255, 255, 255, 0.1)'
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: 2
            }
          }}>
            {images.map((image, index) => (
              <Box
                key={index}
                onClick={() => goToSlide(index)}
                sx={{
                  minWidth: 60,
                  height: 40,
                  borderRadius: '4px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: currentIndex === index ? '2px solid #78CADC' : '2px solid transparent',
                  opacity: currentIndex === index ? 1 : 0.7,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    opacity: 1
                  }
                }}
              >
                <img
                  src={image.url}
                  alt={image.alt || `${propertyTitle} ${index + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.95)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
            onClick={() => setIsFullscreen(false)}
          >
            <Box sx={{
              position: 'relative',
              maxWidth: '90vw',
              maxHeight: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Close Button */}
              <IconButton
                onClick={() => setIsFullscreen(false)}
                sx={{
                  position: 'absolute',
                  top: -50,
                  right: 0,
                  color: 'white',
                  background: 'rgba(0, 0, 0, 0.5)',
                  '&:hover': {
                    background: 'rgba(0, 0, 0, 0.7)'
                  }
                }}
              >
                <Close />
              </IconButton>

              {/* Fullscreen Image */}
              <motion.img
                key={currentIndex}
                src={currentImage.url}
                alt={currentImage.alt || propertyTitle}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  transform: isZoomed ? 'scale(1.5)' : 'scale(1)',
                  transition: 'transform 0.3s ease'
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                onClick={(e) => e.stopPropagation()}
              />

              {/* Fullscreen Navigation */}
              {images.length > 1 && (
                <>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevious();
                    }}
                    sx={{
                      position: 'absolute',
                      left: -60,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'white',
                      background: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.7)'
                      }
                    }}
                  >
                    <ChevronLeft />
                  </IconButton>
                  
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      goToNext();
                    }}
                    sx={{
                      position: 'absolute',
                      right: -60,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'white',
                      background: 'rgba(0, 0, 0, 0.5)',
                      '&:hover': {
                        background: 'rgba(0, 0, 0, 0.7)'
                      }
                    }}
                  >
                    <ChevronRight />
                  </IconButton>
                </>
              )}

              {/* Fullscreen Image Counter */}
              <Typography
                variant="h6"
                sx={{
                  position: 'absolute',
                  bottom: -50,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  color: 'white',
                  background: 'rgba(0, 0, 0, 0.5)',
                  px: 2,
                  py: 1,
                  borderRadius: '4px'
                }}
              >
                {currentIndex + 1} / {images.length}
              </Typography>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PropertyImageGallery;
