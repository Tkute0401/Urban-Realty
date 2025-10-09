'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeProvider';
import PropertyCard from './PropertyCard';
import { CircularProgress, Alert, Box, Typography, Pagination } from '@mui/material';

interface Property {
  _id: string;
  title: string;
  buildingName?: string;
  price: number;
  area: number;
  bedrooms: number;
  bathrooms: number;
  type: string;
  status: string;
  description?: string;
  address?: {
    street?: string;
    city: string;
    state: string;
  };
  images?: Array<{ url: string }>;
  projectDetails?: {
    launchDate?: string;
  };
}

interface PropertyListProps {
  properties: Property[];
  loading?: boolean;
  error?: string;
  onPropertyClick?: (property: Property) => void;
  selectedProperty?: Property | null;
  showPagination?: boolean;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  emptyMessage?: string;
}

const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  loading = false,
  error,
  onPropertyClick,
  selectedProperty,
  showPagination = true,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  emptyMessage = "No properties found"
}) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '400px',
        background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}>
        <CircularProgress 
          size={80} 
          thickness={4}
          sx={{ color: '#78CADC' }} 
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (properties.length === 0) {
    return (
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        minHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            mb: 2
          }}
        >
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: isDark ? 'linear-gradient(135deg, #0B1011 0%, #1a2a32 100%)' : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      minHeight: '100vh'
    }}>
      {/* Property Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)'
        },
        gap: 3,
        p: 3
      }}>
        {properties.map((property, index) => (
          <motion.div
            key={property._id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: (index % 4) * 0.1 }}
          >
            <PropertyCard
              property={property}
              index={index}
              isSelected={selectedProperty?._id === property._id}
              onClick={onPropertyClick}
            />
          </motion.div>
        ))}
      </Box>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          p: 3,
          background: isDark ? 'rgba(11, 16, 17, 0.8)' : 'rgba(248, 250, 252, 0.8)',
          backdropFilter: 'blur(10px)'
        }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(_, page) => onPageChange?.(page)}
            color="primary"
            sx={{
              '& .MuiPaginationItem-root': {
                color: isDark ? 'white' : 'black',
                '&.Mui-selected': {
                  backgroundColor: '#78CADC',
                  color: '#0B1011',
                  '&:hover': {
                    backgroundColor: '#5fb4c9',
                  }
                },
                '&:hover': {
                  backgroundColor: isDark ? 'rgba(120, 202, 220, 0.2)' : 'rgba(120, 202, 220, 0.1)',
                }
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default PropertyList;
