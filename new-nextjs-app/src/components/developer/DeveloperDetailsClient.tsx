'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, Typography, Grid, Divider, Chip, Button, Paper, 
  CircularProgress, Alert, Dialog, DialogActions, 
  DialogContent, DialogTitle, IconButton, useMediaQuery, 
  Stack, Avatar, Tabs, Tab, Container, Link, Rating
} from '@mui/material';
import { 
  LocationOn, Phone, Email, Delete, 
  WhatsApp, Apartment, Check, Close,
  School, LocalHospital, ShoppingCart, Park, DirectionsBus,
  Language, CalendarToday, Business, Groups, Star,
  KeyboardArrowUp
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useDevelopers } from '../../contexts/DevelopersContext';
import { formatNumber } from '../../lib/utils/format';
import http from '../../lib/services/http';
import { styled, keyframes } from '@mui/material/styles';
import { toast } from 'react-toastify';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';

// Animation keyframes
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(120, 202, 220, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(120, 202, 220, 0); }
  100% { box-shadow: 0 0 0 0 rgba(120, 202, 220, 0); }
`;

interface DeveloperDetailsClientProps {
  developer: any;
}

const DeveloperDetailsClient = ({ developer }: DeveloperDetailsClientProps) => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { developers, getDevelopers } = useDevelopers();
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSticky, setIsSticky] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  
  // Refs for section navigation
  const overviewRef = useRef(null);
  const projectsRef = useRef(null);
  const teamRef = useRef(null);
  const specializationsRef = useRef(null);
  const contactRef = useRef(null);
  const navRef = useRef(null);
  const tabsRef = useRef(null);

  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector('.header') || document.querySelector('header');
      setHeaderHeight((header as HTMLElement)?.offsetHeight || 70);
    };

    calculateHeaderHeight();
    window.addEventListener('resize', calculateHeaderHeight);
    return () => window.removeEventListener('resize', calculateHeaderHeight);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setShowBackToTop(scrollPosition > 300);
      
      if (navRef.current) {
        const navOffset = navRef.current.offsetTop;
        setIsSticky(scrollPosition > (navOffset - headerHeight) && scrollPosition > 50);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headerHeight]);

  const scrollToSection = (ref) => {
    if (!ref.current) return;
    const offset = isSticky ? headerHeight + 80 : 150;
    window.scrollTo({
      top: ref.current.offsetTop - offset,
      behavior: 'smooth'
    });
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await http.delete(`/developers/${id}`);
      toast.success('Developer deleted successfully');
      getDevelopers(); // Refresh developers list
      router.push('/developers');
    } catch (err) {
      console.error('Delete error:', err);
      setDeleteError(err.response?.data?.message || 'Failed to delete developer');
      toast.error('Failed to delete developer');
    } finally {
      setDeleting(false);
    }
  };

  const getHeadquarters = () => {
    if (!developer || !developer.headquarters) return '';
    const { city, state, country } = developer.headquarters;
    return [city, state, country].filter(Boolean).join(', ');
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Header Section */}
      <Box sx={{ pt: 8, pb: 4, px: 2 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                p: 3,
                height: '100%',
                border: '1px solid rgba(120, 202, 220, 0.3)'
              }}>
                {developer.logo?.url ? (
                  <img 
                    src={developer.logo.url} 
                    alt={`${developer.name} logo`} 
                    className="w-100 h-auto"
                  />
                ) : (
                  <Apartment sx={{ fontSize: 100, color: 'var(--color-primary)' }} />
                )}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={9}>
              <Typography variant="h2" sx={{ 
                fontWeight: 700,
                mb: 2,
                color: 'var(--color-primary)'
              }}>
                {developer.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
                  {getHeadquarters()}
                </Typography>
              </Box>
              
              {developer.foundedYear && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
                    Established in {developer.foundedYear}
                  </Typography>
                </Box>
              )}
              
              {developer.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Language sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Link 
                    href={developer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    sx={{ color: 'var(--color-primary)' }}
                  >
                    Visit Website
                  </Link>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Business sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
                  {formatNumber(developer.completedProjects || 0)} Completed Projects •{' '}
                  {formatNumber(developer.ongoingProjects || 0)} Ongoing •{' '}
                  {formatNumber(developer.upcomingProjects || 0)} Upcoming
                </Typography>
              </Box>
              
              {user?.role === 'admin' && (
                <Box sx={{ mt: 3 }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    sx={{ mr: 2 }}
                    onClick={() => router.push(`/developers/${id}/edit`)}
                  >
                    Edit Developer
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    Delete Developer
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Navigation Tabs */}
      <Box 
        ref={navRef}
        sx={{
          position: isSticky ? 'fixed' : 'relative',
          top: isSticky ? `${headerHeight}px` : 'auto',
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: 'rgba(11, 16, 17, 0.95)',
          borderBottom: '1px solid rgba(120, 202, 220, 0.3)',
          transition: 'all 0.3s ease'
        }}
      >
        <Container maxWidth="xl">
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'var(--color-primary)'
              }
            }}
          >
            <Tab 
              label="Overview" 
              value="overview" 
              onClick={() => scrollToSection(overviewRef)}
              sx={{ color: activeTab === 'overview' ? 'var(--color-primary)' : 'var(--color-text)' }}
            />
            <Tab 
              label="Projects" 
              value="projects" 
              onClick={() => scrollToSection(projectsRef)}
              sx={{ color: activeTab === 'projects' ? 'var(--color-primary)' : 'var(--color-text)' }}
            />
            <Tab 
              label="Team" 
              value="team" 
              onClick={() => scrollToSection(teamRef)}
              sx={{ color: activeTab === 'team' ? 'var(--color-primary)' : 'var(--color-text)' }}
            />
            <Tab 
              label="Specializations" 
              value="specializations" 
              onClick={() => scrollToSection(specializationsRef)}
              sx={{ color: activeTab === 'specializations' ? 'var(--color-primary)' : 'var(--color-text)' }}
            />
            <Tab 
              label="Contact" 
              value="contact" 
              onClick={() => scrollToSection(contactRef)}
              sx={{ color: activeTab === 'contact' ? 'var(--color-primary)' : 'var(--color-text)' }}
            />
          </Tabs>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6, pt: isSticky ? `${headerHeight + 100}px` : '40px' }}>
        {/* Content sections would go here - rest of the original component content */}
        <Typography variant="body1">Content sections to be added here</Typography>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(true)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {developer.name}? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : <Delete />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Back to Top Button */}
      {showBackToTop && (
        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            zIndex: 1000,
            '&:hover': {
              backgroundColor: 'var(--color-primary-dark)'
            }
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      )}
    </Box>
  );
};

export default DeveloperDetailsClient;