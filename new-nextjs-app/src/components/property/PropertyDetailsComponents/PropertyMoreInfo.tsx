'use client'

import React from 'react';
import { Box, Typography, Paper, Grid, Divider, Chip } from '@mui/material';
import { 
  Business,
  CalendarToday,
  Assignment,
  Domain,
  Info,
  Construction,
  DateRange
} from '@mui/icons-material';

interface PropertyMoreInfoProps {
  property: any;
  sectionRef?: React.RefObject<HTMLDivElement>;
}

const PropertyMoreInfo: React.FC<PropertyMoreInfoProps> = ({ property, sectionRef }) => {
  const projectDetails = property.projectDetails || {};
  const approvals = property.approvals || [];

  const hasProjectDetails = Object.values(projectDetails).some(value => value && String(value).trim());
  const hasApprovals = approvals.length > 0;

  return (
    <Paper 
      ref={sectionRef}
      id="section-more"
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
        <Info sx={{ color: 'var(--color-primary)' }} />
        Additional Information
      </Typography>

      {/* Project Details Section */}
      {hasProjectDetails && (
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: 'var(--color-secondary)', 
              fontWeight: 600,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Domain sx={{ color: 'var(--color-secondary)' }} />
            Project Details
          </Typography>

          <Grid container spacing={3}>
            {projectDetails.projectArea && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Assignment sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                      Project Area
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                      {projectDetails.projectArea}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {projectDetails.totalUnits && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Business sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                      Total Units
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                      {projectDetails.totalUnits}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {projectDetails.launchDate && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <CalendarToday sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                      Launch Date
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                      {new Date(projectDetails.launchDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {projectDetails.reraId && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Assignment sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                      RERA ID
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                      {projectDetails.reraId}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {projectDetails.configurations && (
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Construction sx={{ color: 'var(--color-primary)', fontSize: 20 }} />
                  <Box>
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                      Configurations
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color-text)', fontWeight: 500 }}>
                      {projectDetails.configurations}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      )}

      {/* Approvals Section */}
      {hasApprovals && (
        <Box sx={{ mb: 4 }}>
          {hasProjectDetails && <Divider sx={{ borderColor: 'var(--color-border)', mb: 3 }} />}
          
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: 'var(--color-secondary)', 
              fontWeight: 600,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Assignment sx={{ color: 'var(--color-secondary)' }} />
            Approvals & Certifications
          </Typography>

          <Grid container spacing={2}>
            {approvals.map((approval: any, index: number) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box 
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    backgroundColor: 'var(--color-bg)',
                    border: '1px solid var(--color-border)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'var(--color-success)',
                      backgroundColor: 'var(--color-surface-elevated)'
                    }
                  }}
                >
                  <Typography 
                    variant="subtitle2" 
                    sx={{ 
                      color: 'var(--color-text)',
                      fontWeight: 600,
                      mb: 1
                    }}
                  >
                    {approval.name}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'var(--color-text-muted)',
                      mb: 1
                    }}
                  >
                    Number: {approval.number}
                  </Typography>
                  
                  {approval.date && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <DateRange sx={{ color: 'var(--color-primary)', fontSize: 16 }} />
                      <Typography 
                        variant="caption" 
                        sx={{ color: 'var(--color-text-muted)' }}
                      >
                        {new Date(approval.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  )}
                  
                  <Chip 
                    label="Approved"
                    size="small"
                    sx={{ 
                      backgroundColor: 'var(--color-success)',
                      color: 'white',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      mt: 1
                    }} 
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Construction Status */}
      {property.constructionStatus && (
        <Box sx={{ mt: hasProjectDetails || hasApprovals ? 0 : 2 }}>
          {(hasProjectDetails || hasApprovals) && (
            <Divider sx={{ borderColor: 'var(--color-border)', mb: 3 }} />
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Construction sx={{ color: 'var(--color-primary)' }} />
            <Box>
              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                Construction Status
              </Typography>
              <Chip 
                label={property.constructionStatus}
                sx={{ 
                  backgroundColor: property.constructionStatus === 'Ready to Move' 
                    ? 'var(--color-success)' 
                    : 'var(--color-warning)',
                  color: 'white',
                  fontWeight: 600,
                  mt: 0.5
                }} 
              />
            </Box>
          </Box>
        </Box>
      )}

      {/* If no additional info */}
      {!hasProjectDetails && !hasApprovals && !property.constructionStatus && (
        <Box 
          sx={{ 
            textAlign: 'center',
            py: 4,
            px: 2
          }}
        >
          <Info 
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
            No additional information available for this property.
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default PropertyMoreInfo;