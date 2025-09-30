'use client'

import React, { useEffect, useRef, useState } from 'react';
import { useDevelopers } from '../../contexts/DevelopersContext';
import { unstable_noStore as noStore } from 'next/cache';

// Force dynamic rendering to prevent static generation issues
export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, Grid, Typography, CircularProgress, Button, 
  Container, Pagination, Stack, useMediaQuery, useTheme,
  Drawer, IconButton, Collapse
} from '@mui/material';
import DeveloperCard from './DeveloperCard';
import { 
  Add, Refresh, FilterAlt, KeyboardArrowDown, KeyboardArrowUp,
  ArrowBack, Close as CloseIcon, Search as SearchIcon, 
  Clear as ClearIcon, Tune as TuneIcon
} from '@mui/icons-material';
import './DeveloperList.css';

const DeveloperList = () => {
  // Force dynamic rendering
  noStore();
  
  console.log('🔧 Developers Page rendering...');

  useEffect(() => {
    console.log('🔧 Developers Page mounted on client side!');
    window.scrollTo(0, 0);
  }, []);
  
  const { developers, loading, error, getDevelopers } = useDevelopers();
  const searchParams = useSearchParams();
  const initialLoad = useRef(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const itemsPerPage = 12;
  
  // Mobile specific state
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [expandedSearch, setExpandedSearch] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState(false);

  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState(() => {
    const params = Object.fromEntries(searchParams.entries());
    return {
      search: params.search || '',
      city: params.city || '',
      state: params.state || '',
      country: params.country || '',
      minYear: params.minYear || '',
      maxYear: params.maxYear || '',
      minProjects: params.minProjects || '',
      maxProjects: params.maxProjects || '',
      specialization: params.specialization || ''
    };
  });
  const router = useRouter();

  // Fetch developers when filters change
  useEffect(() => {
    const fetchData = async () => {
      let apiParams = {};
      await getDevelopers();
      
      const newSearchParams = new URLSearchParams();
      Object.entries(apiParams).forEach(([key, value]) => {
        if (value) {
          if (typeof value === 'object') {
            Object.entries(value).forEach(([op, val]) => {
              if (op === '$gte') newSearchParams.set(key.startsWith('$') ? `min${key.slice(1)}` : `min${key}`, val);
              if (op === '$lte') newSearchParams.set(key.startsWith('$') ? `max${key.slice(1)}` : `max${key}`, val);
            });
          } else {
            newSearchParams.set(key, String(value));
          }
        }
      });
      router.push(`?${newSearchParams.toString()}`);

      setTimeout(() => setIsLoaded(true), 100);
      initialLoad.current = false;
    };

    fetchData();
  }, [filters, getDevelopers, router]);


  const paginatedDevelopers = developers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && initialLoad.current) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '50vh',
        background: '#08171A'
      }}>
        <CircularProgress size={isMobile ? 40 : 60} sx={{ color: '#78CADC' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center', color: 'white', background: '#08171A' }}>
        <Typography color="error" gutterBottom>
          Error loading developers
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: 'white' }}>{error}</Typography>
        <Button 
          variant="contained" 
          onClick={() => getDevelopers()}
          startIcon={<Refresh />}
          size={isMobile ? 'small' : 'medium'}
          sx={{ backgroundColor: '#78CADC', '&:hover': { backgroundColor: '#5cb3c5' } }}
        >
          Retry
        </Button>
      </Container>
    );
  }


  return (
    <div className={`main-container ${isLoaded ? 'fade-in-delay-1' : ''}`}>

      {/* Breadcrumb */}
      <div className={`breadcrumb fade-in-delay-1 ${isMobile ? 'mobile-breadcrumb' : ''}`}>
        <a href="/">HOME</a>
        <span className="separator">&gt;</span>
        <a href="#">DEVELOPERS</a>
      </div>

      {/* Page Title */}
      <div className="page-title fade-in-delay-2">
        <h1>
          Top <span className='highlight-words'>Real Estate Developers</span> in India
        </h1>
        <div className="listings-count">
          {developers.length} DEVELOPER{developers.length !== 1 ? 'S' : ''}
        </div>
      </div>


      {/* Empty state with responsive design */}
      {!developers || developers.length === 0 ? (
        <Container maxWidth="md" className="empty-state fade-in-delay-4">
          <Typography variant="h6" gutterBottom>
            No developers found matching your criteria
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Try adjusting your filters or search terms
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => getDevelopers()}
            startIcon={<Refresh />}
            size={isMobile ? 'small' : 'medium'}
            sx={{ 
              mr: 1, 
              backgroundColor: '#78CADC', 
              '&:hover': { 
                backgroundColor: '#5cb3c5', 
                transform: 'translateY(-2px)', 
                boxShadow: '0 6px 10px rgba(0,0,0,0.2)' 
              },
              transition: 'all 0.3s ease'
            }}
          >
            Refresh
          </Button>
        </Container>
      ) : (
        <>
          <div className="developer-listings fade-in-delay-4">
            <div className="developer-grid">
              {paginatedDevelopers.map(developer => (
                <DeveloperCard 
                  key={developer._id} 
                  developer={developer} 
                  isMobile={isMobile}
                />
              ))}
            </div>
          </div>

          {/* Pagination with responsive design */}
          {developers.length > itemsPerPage && (
            <Stack spacing={1} className="pagination-container fade-in-delay-4">
              <Pagination
                count={Math.ceil(developers.length / itemsPerPage)}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? 'small' : 'medium'}
                siblingCount={isMobile ? 0 : 1}
                boundaryCount={isMobile ? 1 : 2}
                className="custom-pagination"
                sx={{
                  '& .MuiPaginationItem-root': { 
                    color: 'white',
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  },
                  '& .MuiPaginationItem-root.Mui-selected': { 
                    backgroundColor: '#78CADC', 
                    color: '#08171A',
                    '&:hover': {
                      backgroundColor: '#5cb3c5'
                    }
                  },
                  '& .MuiPaginationItem-root:hover': { 
                    backgroundColor: 'rgba(120, 202, 220, 0.2)' 
                  },
                }}
              />
              <Typography 
                variant="caption" 
                className="pagination-count"
                sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
              >
                {paginatedDevelopers.length} of {developers.length} developers
              </Typography>
            </Stack>
          )}
        </>
      )}
    </div>
  );
};

export default DeveloperList;