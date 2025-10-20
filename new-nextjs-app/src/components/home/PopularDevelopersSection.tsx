'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, CircularProgress, useMediaQuery, useTheme } from '@mui/material';
import { ArrowForward, Star, LocationOn, Business } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useDevelopers } from '@/contexts/DevelopersContext';
import { motion } from 'framer-motion';

const PopularDevelopersSection: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { developers, loading, error, getDevelopers } = useDevelopers();
  const [imageLoaded, setImageLoaded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Fetch developers
    getDevelopers();
  }, [getDevelopers]);

  const formatProjectsCount = (count: number) => {
    if (!count) return '0';
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const handleImageLoad = (developerId: string) => {
    setImageLoaded(prev => ({ ...prev, [developerId]: true }));
  };

  if (loading) {
    return (
      <Box
        component="section"
        sx={{
          py: 8,
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
            <CircularProgress sx={{ color: 'var(--color-primary)' }} />
          </Box>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        component="section"
        sx={{
          py: 8,
          background: 'var(--color-bg)',
          borderTop: '1px solid var(--color-border)'
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="error">
              Error loading developers
            </Typography>
            <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mt: 1 }}>
              {error}
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      sx={{
        py: 8,
        background: 'var(--color-bg)',
        borderTop: '1px solid var(--color-border)'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                color: 'var(--color-text-primary)',
                mb: 1,
                fontSize: { xs: '2rem', md: '2.5rem' }
              }}
            >
              Popular Developers
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: 'var(--color-text-muted)',
                maxWidth: 600
              }}
            >
              Trusted real estate developers with proven track records
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={() => router.push('/developers')}
            sx={{
              background: 'var(--color-primary)',
              color: 'var(--color-primary-contrast)',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 'bold',
              '&:hover': {
                background: 'var(--color-primary-hover)',
              }
            }}
          >
            View All Developers
          </Button>
        </Box>

        {developers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Business sx={{ fontSize: 64, color: 'var(--color-text-muted)', mb: 2 }} />
            <Typography variant="h5" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>
              No Developers Available
            </Typography>
            <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
              No developers are currently available.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }, gap: 3 }}>
            {developers.slice(0, 6).map((developer, index) => (
              <motion.div
                key={developer._id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative rounded-xl sm:rounded-3xl overflow-hidden border transition-all duration-300 cursor-pointer hover:shadow-lg group"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  borderColor: 'var(--color-primary)',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}
                onClick={() => router.push(`/developers/${developer._id}`)}
                whileHover={{ y: -5 }}
              >
                {/* Image Section */}
                <div className="relative aspect-video">
                  {developer.logo?.url ? (
                    <>
                      {!imageLoaded[developer._id] && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)' }}
                        >
                          <div 
                            className="w-8 h-8 border-2 border-transparent rounded-full animate-spin"
                            style={{ 
                              borderTopColor: 'var(--color-primary)',
                              borderLeftColor: 'var(--color-primary)' 
                            }}
                          />
                        </div>
                      )}
                      <img 
                        src={developer.logo.url} 
                        alt={developer.name} 
                        className={`w-full h-full object-contain transition-opacity duration-300 ${imageLoaded[developer._id] ? 'opacity-100' : 'opacity-0'}`}
                        style={{ backgroundColor: 'var(--color-surface)' }}
                        loading="lazy"
                        onLoad={() => handleImageLoad(developer._id)}
                      />
                    </>
                  ) : (
                    <div 
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)' }}
                    >
                      <Business className="text-[var(--color-primary)]/50 w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-3 sm:p-5">
                  {/* Rating */}
                  <div className="flex items-center mb-2 sm:mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    ))}
                    <span className="text-xs sm:text-sm text-gray-400 ml-1">5.0 (??)</span>
                  </div>
                  
                  {/* Title */}
                  <h3 className="font-poppins text-lg sm:text-xl font-bold text-[var(--color-text-primary)] mb-1 sm:mb-2 line-clamp-1">
                    {developer.name}
                  </h3>
                  
                  {/* Location */}
                  <div className="flex items-center gap-1 sm:gap-2 text-[var(--color-primary)] mb-2 sm:mb-3">
                    <LocationOn className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="font-poppins text-xs sm:text-sm line-clamp-1">
                      {developer.headquarters?.city && `${developer.headquarters.city}, `}
                      {developer.headquarters?.state}
                      {developer.headquarters?.country && `, ${developer.headquarters.country}`}
                    </span>
                  </div>
                  
                  {/* Description */}
                  <p className="text-[var(--color-text-muted)] text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                    {developer.description || 'No description available'}
                  </p>
                  
                  {/* Features */}
                  <div className="flex gap-3 sm:gap-6 mb-3 sm:mb-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Business className="text-[var(--color-primary)] w-4 h-4" />
                      <span className="text-[var(--color-text-muted)] text-xs sm:text-sm">
                        {developer.foundedYear || 'N/A'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Business className="text-[var(--color-primary)] w-4 h-4" />
                      <span className="text-[var(--color-text-muted)] text-xs sm:text-sm">
                        {formatProjectsCount(developer.completedProjects)} Projects
                      </span>
                    </div>
                  </div>
                  
                  {/* Specializations */}
                  {developer.specializations?.length > 0 && (
                    <div className="mb-3 sm:mb-4">
                      <div className="text-xs text-[var(--color-text-muted)] mb-1">Specializations:</div>
                      <div className="flex flex-wrap gap-1">
                        {developer.specializations.slice(0, 3).map((spec, index) => (
                          <span key={index} className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-1 rounded">
                            {spec.name}
                          </span>
                        ))}
                        {developer.specializations.length > 3 && (
                          <span className="text-xs bg-[var(--color-primary)]/10 text-[var(--color-primary)] px-2 py-1 rounded">
                            +{developer.specializations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* CTA */}
                  <div className="pt-3 border-t border-[var(--color-border)]">
                    <motion.button 
                      className="w-full bg-transparent border border-[var(--color-primary)] text-[var(--color-text-primary)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-[var(--color-primary)]/20 transition-all text-xs sm:text-sm
                                group-hover:bg-[var(--color-primary)] group-hover:text-[var(--color-bg-dark)] group-hover:font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/developers/${developer._id}`);
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="font-poppins">View Developer</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default PopularDevelopersSection;
