'use client'

import React, { useState } from 'react';
import { Box, Typography, Paper, Grid, Dialog, IconButton, Button } from '@mui/material';
import { Architecture, Close, ZoomIn, Download } from '@mui/icons-material';
import Image from 'next/image';

interface PropertyFloorPlanProps {
  property: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const PropertyFloorPlan: React.FC<PropertyFloorPlanProps> = ({ property, sectionRef }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const floorPlans = Array.isArray(property.floorPlans) ? property.floorPlans : [];

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setImageDialogOpen(false);
    setSelectedImage(null);
  };

  const handleDownload = (imageUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getImageUrl = (image: string) => {
    if (!image) return '';
    
    // If it's already a full URL, return it
    if (image.startsWith('http') || image.startsWith('/')) {
      return image;
    }
    
    // Otherwise, construct the URL (assuming it's stored in uploads)
    return `/uploads/${image}`;
  };

  return (
    <Paper 
      ref={sectionRef}
      id="section-floorplan"
      sx={{ 
        p: 3, 
        mb: 4, 
        bgcolor: 'var(--color-surface)', 
        border: '1px solid var(--color-border)',
        borderRadius: 2
      }}
    >
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: 'var(--color-primary)', 
          fontWeight: 600,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Architecture sx={{ color: 'var(--color-primary)' }} />
        Floor Plans
      </Typography>

      {floorPlans.length > 0 ? (
        <Grid container spacing={2}>
          {floorPlans.map((floorPlan: string, index: number) => {
            const imageUrl = getImageUrl(floorPlan);
            return (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box 
                  sx={{
                    position: 'relative',
                    borderRadius: 2,
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: 'var(--color-primary)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(247, 107, 28, 0.15)'
                    }
                  }}
                  onClick={() => handleImageClick(imageUrl)}
                >
                  <Box sx={{ position: 'relative', height: 200 }}>
                    <Image
                      src={imageUrl}
                      alt={`Floor Plan ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        // Fallback for broken images
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/placeholder-floorplan.jpg';
                      }}
                    />
                    
                    {/* Overlay on hover */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        '&:hover': {
                          opacity: 1
                        }
                      }}
                    >
                      <ZoomIn sx={{ color: 'white', fontSize: 32 }} />
                    </Box>
                  </Box>
                  
                  <Box sx={{ p: 2 }}>
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        color: 'var(--color-text)',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      Floor Plan {index + 1}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 6,
            px: 2
          }}
        >
          <Architecture 
            sx={{ 
              fontSize: 48,
              color: 'var(--color-text-muted)',
              mb: 2
            }} 
          />
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'var(--color-text-muted)',
              fontStyle: 'italic',
              mb: 2
            }}
          >
            No floor plans available for this property.
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'var(--color-text-muted)',
              fontSize: '0.875rem'
            }}
          >
            Contact the agent for detailed floor plan information.
          </Typography>
        </Box>
      )}

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            backgroundColor: 'var(--color-bg)',
            backgroundImage: 'none'
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          {/* Close button */}
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1000,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)'
              }
            }}
          >
            <Close />
          </IconButton>

          {/* Download button */}
          {selectedImage && (
            <Button
              onClick={() => handleDownload(selectedImage, 'floorplan.jpg')}
              startIcon={<Download />}
              sx={{
                position: 'absolute',
                left: 8,
                top: 8,
                zIndex: 1000,
                backgroundColor: 'var(--color-primary)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'var(--color-primary-hover)'
                }
              }}
            >
              Download
            </Button>
          )}

          {/* Image */}
          {selectedImage && (
            <Box sx={{ position: 'relative', minHeight: '60vh' }}>
              <Image
                src={selectedImage}
                alt="Floor Plan"
                fill
                style={{ objectFit: 'contain' }}
              />
            </Box>
          )}
        </Box>
      </Dialog>
    </Paper>
  );
};

export default PropertyFloorPlan;