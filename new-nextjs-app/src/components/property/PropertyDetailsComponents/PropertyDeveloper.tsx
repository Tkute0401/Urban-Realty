'use client'

import React from 'react';
import { Box, Typography, Paper, Avatar, Button, Divider, Chip } from '@mui/material';
import { Business, Phone, Email, LocationOn, Star } from '@mui/icons-material';

interface PropertyDeveloperProps {
  property: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const PropertyDeveloper: React.FC<PropertyDeveloperProps> = ({ property, sectionRef }) => {
  const developer = property.developer;

  // If no developer info, return placeholder
  if (!developer || (typeof developer === 'string')) {
    return (
      <Paper 
        ref={sectionRef}
        id="section-developer"
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
          <Business sx={{ color: 'var(--color-primary)' }} />
          Developer Information
        </Typography>
        
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 4,
            px: 2
          }}
        >
          <Business 
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
              fontStyle: 'italic'
            }}
          >
            No developer information available for this property.
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper 
      ref={sectionRef}
      id="section-developer"
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
        <Business sx={{ color: 'var(--color-primary)' }} />
        Developer Information
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start' }}>
        {/* Developer Avatar */}
        <Avatar
          src={developer.logo || developer.image}
          sx={{
            width: 80,
            height: 80,
            border: '2px solid var(--color-primary)',
            backgroundColor: 'var(--color-bg)'
          }}
        >
          <Business sx={{ fontSize: 32, color: 'var(--color-primary)' }} />
        </Avatar>

        {/* Developer Details */}
        <Box sx={{ flex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: 'var(--color-text)',
                fontWeight: 600
              }}
            >
              {developer.name || developer.companyName || 'Unknown Developer'}
            </Typography>
            
            {developer.verified && (
              <Chip 
                label="Verified"
                size="small"
                sx={{ 
                  backgroundColor: 'var(--color-success)',
                  color: 'white',
                  fontWeight: 500
                }} 
              />
            )}
          </Box>

          {developer.establishedYear && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-muted)',
                mb: 2
              }}
            >
              Established: {developer.establishedYear}
            </Typography>
          )}

          {developer.description && (
            <Typography 
              variant="body2" 
              paragraph
              sx={{ 
                color: 'var(--color-text)',
                mb: 2,
                lineHeight: 1.6
              }}
            >
              {developer.description}
            </Typography>
          )}

          {/* Contact Information */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
            {developer.email && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: 'var(--color-primary)', fontSize: 18 }} />
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--color-text)' }}
                >
                  {developer.email}
                </Typography>
              </Box>
            )}

            {developer.phone && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: 'var(--color-primary)', fontSize: 18 }} />
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--color-text)' }}
                >
                  {developer.phone}
                </Typography>
              </Box>
            )}

            {developer.address && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: 'var(--color-primary)', fontSize: 18 }} />
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--color-text)' }}
                >
                  {typeof developer.address === 'string' 
                    ? developer.address 
                    : `${developer.address.city}, ${developer.address.state}`}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {developer.phone && (
              <Button
                variant="contained"
                startIcon={<Phone />}
                size="small"
                sx={{
                  backgroundColor: 'var(--color-success)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'var(--color-success-hover)'
                  }
                }}
                href={`tel:${developer.phone}`}
              >
                Call
              </Button>
            )}

            {developer.email && (
              <Button
                variant="outlined"
                startIcon={<Email />}
                size="small"
                sx={{
                  borderColor: 'var(--color-primary)',
                  color: 'var(--color-primary)',
                  '&:hover': {
                    borderColor: 'var(--color-primary-hover)',
                    backgroundColor: 'rgba(247, 107, 28, 0.05)'
                  }
                }}
                href={`mailto:${developer.email}`}
              >
                Email
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Additional Developer Stats */}
      {(developer.totalProjects || developer.experienceYears || developer.rating) && (
        <>
          <Divider sx={{ borderColor: 'var(--color-border)', my: 3 }} />
          
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
            {developer.totalProjects && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'var(--color-primary)',
                    fontWeight: 600
                  }}
                >
                  {developer.totalProjects}+
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--color-text-muted)' }}
                >
                  Projects
                </Typography>
              </Box>
            )}

            {developer.experienceYears && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: 'var(--color-primary)',
                    fontWeight: 600
                  }}
                >
                  {developer.experienceYears}+
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--color-text-muted)' }}
                >
                  Years Experience
                </Typography>
              </Box>
            )}

            {developer.rating && (
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: 'var(--color-primary)',
                      fontWeight: 600
                    }}
                  >
                    {developer.rating}
                  </Typography>
                  <Star sx={{ color: 'var(--color-warning)', fontSize: 20 }} />
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ color: 'var(--color-text-muted)' }}
                >
                  Rating
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default PropertyDeveloper;