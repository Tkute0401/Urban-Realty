'use client';

import React, { useState } from 'react';
import { Box, IconButton, Dialog, DialogContent } from '@mui/material';
import { ChevronLeft, ChevronRight, Close } from '@mui/icons-material';
import Image from 'next/image';

interface PropertyImage {
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
}

interface PropertyImageGalleryProps {
  images: PropertyImage[];
  title?: string;
}

const PropertyImageGallery: React.FC<PropertyImageGalleryProps> = ({ images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openLightbox, setOpenLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          height: 500,
          background: 'var(--color-accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 3,
          border: '1px solid var(--color-border)'
        }}
      >
        <Box sx={{ textAlign: 'center', color: 'var(--color-text-muted)' }}>
          No images available
        </Box>
      </Box>
    );
  }

  const handlePrevious = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleOpenLightbox = () => {
    setOpenLightbox(true);
  };

  const handleCloseLightbox = () => {
    setOpenLightbox(false);
  };

  return (
    <>
      <Box sx={{ position: 'relative', width: '100%' }}>
        {/* Main Image */}
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: 500,
            borderRadius: 3,
            overflow: 'hidden',
            cursor: 'pointer',
            border: '1px solid var(--color-border)'
          }}
          onClick={handleOpenLightbox}
        >
          <img
            src={images[currentIndex].url}
            alt={`${title || 'Property'} - Image ${currentIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />

          {/* Navigation Buttons */}
          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                  },
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(8px)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 1)',
                  },
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}

          {/* Image Counter */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 2,
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {currentIndex + 1} / {images.length}
          </Box>
        </Box>

        {/* Thumbnail Strip */}
        {images.length > 1 && (
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              mt: 2,
              overflowX: 'auto',
              pb: 1,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-track': {
                background: 'var(--color-accent)',
                borderRadius: 4,
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'var(--color-primary)',
                borderRadius: 4,
              },
            }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                onClick={() => setCurrentIndex(index)}
                sx={{
                  minWidth: 120,
                  height: 80,
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: currentIndex === index 
                    ? '3px solid var(--color-primary)' 
                    : '1px solid var(--color-border)',
                  opacity: currentIndex === index ? 1 : 0.6,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    opacity: 1,
                  }
                }}
              >
                <img
                  src={image.url}
                  alt={`Thumbnail ${index + 1}`}
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

      {/* Lightbox Dialog */}
      <Dialog
        open={openLightbox}
        onClose={handleCloseLightbox}
        maxWidth="xl"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            background: 'rgba(0, 0, 0, 0.95)',
            maxHeight: '95vh'
          }
        }}
      >
        <IconButton
          onClick={handleCloseLightbox}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            color: 'white',
            background: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.2)',
            },
            zIndex: 1
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '80vh'
            }}
          >
            <img
              src={images[currentIndex].url}
              alt={`${title || 'Property'} - Image ${currentIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '90vh',
                objectFit: 'contain'
              }}
            />
          </Box>

          {images.length > 1 && (
            <>
              <IconButton
                onClick={handlePrevious}
                sx={{
                  position: 'absolute',
                  left: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <ChevronLeft />
              </IconButton>

              <IconButton
                onClick={handleNext}
                sx={{
                  position: 'absolute',
                  right: 16,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'white',
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                <ChevronRight />
              </IconButton>
            </>
          )}

          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 2,
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {currentIndex + 1} / {images.length}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyImageGallery;

