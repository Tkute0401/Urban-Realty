'use client'

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, Typography, Grid, Divider, Chip, Button, Paper, 
  CircularProgress, Alert, Dialog, DialogActions, 
  DialogContent, DialogTitle, IconButton, useMediaQuery, 
  Stack, Avatar, Tabs, Tab, Container, Link, Rating,
  Card, CardContent, CardMedia, Fade, Slide, Zoom
} from '@mui/material';
import { 
  LocationOn, Phone, Email, Delete, 
  WhatsApp, Apartment, Check, Close,
  School, LocalHospital, ShoppingCart, Park, DirectionsBus,
  Language, CalendarToday, Business, Groups, Star,
  KeyboardArrowUp, TrendingUp, Work, People, 
  Architecture, Verified, EmojiEvents, Timeline
} from '@mui/icons-material';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { useDevelopers } from '../../contexts/DevelopersContext';
import { useProjects } from '../../contexts/ProjectsContext';
import { api } from '../../lib/services/api';
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

const slideInFromLeft = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideInFromRight = keyframes`
  from { opacity: 0; transform: translateX(30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(247, 107, 28, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(247, 107, 28, 0); }
  100% { box-shadow: 0 0 0 0 rgba(247, 107, 28, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Styled Components
const HeroSection = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, var(--color-bg-dark) 0%, #1a1a2e 50%, #16213e 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at 20% 80%, rgba(247, 107, 28, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(26, 43, 255, 0.1) 0%, transparent 50%)',
    zIndex: 1,
  },
  '& > *': {
    position: 'relative',
    zIndex: 2,
  }
}));

const GlassCard = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.08)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
  }
}));

const StatCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, rgba(247, 107, 28, 0.1) 0%, rgba(26, 43, 255, 0.1) 100%)',
  border: '1px solid rgba(247, 107, 28, 0.2)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(247, 107, 28, 0.15)',
  }
}));

const ProjectCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  overflow: 'hidden',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
    borderColor: 'var(--color-primary)',
  }
}));

const AnimatedBox = styled(Box)(({ theme }) => ({
  animation: `${fadeIn} 0.6s ease-out`,
}));

interface DeveloperDetailsClientProps {
  developer: any;
}

const DeveloperDetailsClient = ({ developer }: DeveloperDetailsClientProps) => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { developers, getDevelopers } = useDevelopers();
  const { projects, loading: projectsLoading, error: projectsError, getProjectsByDeveloper } = useProjects();

  // Fallback data if developer is null or undefined
  const safeDeveloper = developer || {
    name: 'Unknown Developer',
    description: 'No description available',
    completedProjects: 0,
    ongoingProjects: 0,
    upcomingProjects: 0,
    headquarters: {
      city: 'Unknown',
      state: 'Unknown',
      country: 'Unknown'
    }
  };
  
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
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
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load projects for this developer
  useEffect(() => {
    const developerId = Array.isArray(id) ? id[0] : id;
    if (developerId) {
      getProjectsByDeveloper(developerId).catch(() => {});
    }
  }, [id, getProjectsByDeveloper]);

  const scrollToSection = (ref) => {
    if (!ref.current) return;
    const offset = headerHeight + 80; // Account for sticky header and navigation
    window.scrollTo({
      top: ref.current.offsetTop - offset,
      behavior: 'smooth'
    });
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setDeleteError(null);
      await api.developers.delete(Array.isArray(id) ? id[0] : id);
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
    if (!safeDeveloper || !safeDeveloper.headquarters) return '';
    const { city, state, country } = safeDeveloper.headquarters;
    return [city, state, country].filter(Boolean).join(', ');
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, var(--color-bg-dark) 0%, #1a1a2e 50%, #16213e 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Hero Section */}
      <HeroSection sx={{ pt: { xs: 6, md: 8 }, pb: { xs: 4, md: 6 } }}>
        <Container maxWidth="xl">
          <AnimatedBox>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={4}>
                <Fade in timeout={800}>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    mb: { xs: 4, md: 0 }
                  }}>
                    <Box sx={{
                      position: 'relative',
                      p: 4,
                      borderRadius: '20px',
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      backdropFilter: 'blur(10px)',
                      border: '2px solid rgba(247, 107, 28, 0.3)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                      animation: `${pulse} 2s infinite`,
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: -2,
                        left: -2,
                        right: -2,
                        bottom: -2,
                        background: 'linear-gradient(45deg, var(--color-primary), var(--color-secondary))',
                        borderRadius: '20px',
                        zIndex: -1,
                        opacity: 0.3
                      }
                    }}>
                      {safeDeveloper.logo?.url ? (
                        <img 
                          src={safeDeveloper.logo.url} 
                          alt={`${safeDeveloper.name} logo`} 
                          style={{ 
                            width: '100%', 
                            height: 'auto', 
                            maxWidth: '200px',
                            borderRadius: '12px'
                          }}
                        />
                      ) : (
                        <Apartment sx={{ 
                          fontSize: 120, 
                          color: 'var(--color-primary)',
                          filter: 'drop-shadow(0 4px 8px rgba(247, 107, 28, 0.3))'
                        }} />
                      )}
                    </Box>
                  </Box>
                </Fade>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Slide direction="left" in timeout={1000}>
                  <Box>
                    <Typography variant="h1" sx={{ 
                      fontWeight: 800,
                      mb: 2,
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2
                    }}>
                      {safeDeveloper.name}
                    </Typography>
                    
                    <Typography variant="h5" sx={{ 
                      mb: 3, 
                      color: 'rgba(255, 255, 255, 0.8)',
                      fontWeight: 300,
                      fontSize: { xs: '1.1rem', md: '1.3rem' }
                    }}>
                      {safeDeveloper.tagline || 'Building Tomorrow\'s Communities Today'}
                    </Typography>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ mr: 1, color: 'var(--color-primary)', fontSize: '1.2rem' }} />
                        <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                          {getHeadquarters()}
                        </Typography>
                      </Box>
                      
                      {safeDeveloper.foundedYear && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <CalendarToday sx={{ mr: 1, color: 'var(--color-primary)', fontSize: '1.2rem' }} />
                          <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                            Since {safeDeveloper.foundedYear}
                          </Typography>
                        </Box>
                      )}
                    </Stack>
                    
                    <Stack direction="row" spacing={2} sx={{ mb: 4, flexWrap: 'wrap', gap: 1 }}>
                      <Chip 
                        icon={<Work />}
                        label={`${formatNumber(safeDeveloper.completedProjects || 0)} Completed`}
                        sx={{ 
                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
                          color: 'white',
                          fontWeight: 600,
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                      <Chip 
                        icon={<TrendingUp />}
                        label={`${formatNumber(safeDeveloper.ongoingProjects || 0)} Ongoing`}
                        sx={{ 
                          background: 'linear-gradient(135deg, var(--color-secondary) 0%, #3b82f6 100%)',
                          color: 'white',
                          fontWeight: 600,
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                      <Chip 
                        icon={<Timeline />}
                        label={`${formatNumber(safeDeveloper.upcomingProjects || 0)} Upcoming`}
                        sx={{ 
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          color: 'white',
                          fontWeight: 600,
                          '& .MuiChip-icon': { color: 'white' }
                        }}
                      />
                    </Stack>
                    
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                      {safeDeveloper.website && (
                        <Button
                          variant="contained"
                          startIcon={<Language />}
                          href={safeDeveloper.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
                            borderRadius: '25px',
                            px: 3,
                            py: 1.5,
                            fontWeight: 600,
                            textTransform: 'none',
                            fontSize: '1rem',
                            boxShadow: '0 4px 15px rgba(247, 107, 28, 0.3)',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 6px 20px rgba(247, 107, 28, 0.4)',
                            }
                          }}
                        >
                          Visit Website
                        </Button>
                      )}
                      
                      {user?.role === 'admin' && (
                        <>
                          <Button 
                            variant="outlined"
                            startIcon={<Architecture />}
                            onClick={() => router.push(`/developers/${id}/edit`)}
                            sx={{
                              borderColor: 'var(--color-primary)',
                              color: 'var(--color-primary)',
                              borderRadius: '25px',
                              px: 3,
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: 'none',
                              fontSize: '1rem',
                              '&:hover': {
                                borderColor: 'var(--color-primary-hover)',
                                backgroundColor: 'rgba(247, 107, 28, 0.1)',
                                transform: 'translateY(-2px)',
                              }
                            }}
                          >
                            Edit Developer
                          </Button>
                          <Button 
                            variant="outlined"
                            startIcon={<Delete />}
                            onClick={() => setDeleteConfirmOpen(true)}
                            sx={{
                              borderColor: '#ef4444',
                              color: '#ef4444',
                              borderRadius: '25px',
                              px: 3,
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: 'none',
                              fontSize: '1rem',
                              '&:hover': {
                                borderColor: '#dc2626',
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                transform: 'translateY(-2px)',
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </Stack>
                  </Box>
                </Slide>
              </Grid>
            </Grid>
          </AnimatedBox>
        </Container>
      </HeroSection>

      {/* Navigation Tabs */}
      <Box 
        ref={navRef}
        sx={{
          position: 'sticky',
          top: `${headerHeight}px`,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: 'rgba(11, 16, 17, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(247, 107, 28, 0.2)',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
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
                background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                height: 3,
                borderRadius: '2px'
              },
              '& .MuiTabs-scrollButtons': {
                color: 'var(--color-primary)'
              }
            }}
          >
            <Tab 
              label="Overview" 
              value="overview" 
              onClick={() => scrollToSection(overviewRef)}
              sx={{ 
                color: activeTab === 'overview' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: activeTab === 'overview' ? 600 : 400,
                textTransform: 'none',
                fontSize: '1rem',
                py: 2,
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'var(--color-primary)',
                  backgroundColor: 'rgba(247, 107, 28, 0.1)'
                }
              }}
            />
            <Tab 
              label="Projects" 
              value="projects" 
              onClick={() => scrollToSection(projectsRef)}
              sx={{ 
                color: activeTab === 'projects' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: activeTab === 'projects' ? 600 : 400,
                textTransform: 'none',
                fontSize: '1rem',
                py: 2,
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'var(--color-primary)',
                  backgroundColor: 'rgba(247, 107, 28, 0.1)'
                }
              }}
            />
            <Tab 
              label="Team" 
              value="team" 
              onClick={() => scrollToSection(teamRef)}
              sx={{ 
                color: activeTab === 'team' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: activeTab === 'team' ? 600 : 400,
                textTransform: 'none',
                fontSize: '1rem',
                py: 2,
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'var(--color-primary)',
                  backgroundColor: 'rgba(247, 107, 28, 0.1)'
                }
              }}
            />
            <Tab 
              label="Specializations" 
              value="specializations" 
              onClick={() => scrollToSection(specializationsRef)}
              sx={{ 
                color: activeTab === 'specializations' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: activeTab === 'specializations' ? 600 : 400,
                textTransform: 'none',
                fontSize: '1rem',
                py: 2,
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'var(--color-primary)',
                  backgroundColor: 'rgba(247, 107, 28, 0.1)'
                }
              }}
            />
            <Tab 
              label="Contact" 
              value="contact" 
              onClick={() => scrollToSection(contactRef)}
              sx={{ 
                color: activeTab === 'contact' ? 'var(--color-primary)' : 'rgba(255, 255, 255, 0.7)',
                fontWeight: activeTab === 'contact' ? 600 : 400,
                textTransform: 'none',
                fontSize: '1rem',
                py: 2,
                px: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  color: 'var(--color-primary)',
                  backgroundColor: 'rgba(247, 107, 28, 0.1)'
                }
              }}
            />
          </Tabs>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Overview Section */}
        <Box ref={overviewRef} sx={{ mb: 8 }}>
          <Fade in timeout={1200}>
            <Box>
              <Typography variant="h3" sx={{ 
                mb: 4, 
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: 'center'
              }}>
                About {safeDeveloper.name}
              </Typography>
              
              <GlassCard sx={{ p: { xs: 3, md: 6 }, mb: 4 }}>
                <Typography variant="h6" sx={{ 
                  mb: 3, 
                  lineHeight: 1.8,
                  fontSize: { xs: '1.1rem', md: '1.2rem' },
                  color: 'rgba(255, 255, 255, 0.9)',
                  textAlign: 'justify'
                }}>
                  {safeDeveloper.description || 'No description available for this developer.'}
                </Typography>
                
                {safeDeveloper.flagshipProjects && safeDeveloper.flagshipProjects.length > 0 && (
                  <Box sx={{ mt: 5 }}>
                    <Typography variant="h5" sx={{ 
                      mb: 3, 
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      textAlign: 'center',
                      fontSize: { xs: '1.5rem', md: '1.8rem' }
                    }}>
                      Flagship Projects
                    </Typography>
                    <Grid container spacing={3}>
                      {safeDeveloper.flagshipProjects.map((project, index) => (
                        <Grid item xs={12} md={6} key={index}>
                          <Zoom in timeout={1400 + (index * 200)}>
                            <Card sx={{
                              background: 'linear-gradient(135deg, rgba(247, 107, 28, 0.1) 0%, rgba(26, 43, 255, 0.1) 100%)',
                              border: '1px solid rgba(247, 107, 28, 0.2)',
                              borderRadius: '12px',
                              height: '100%',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 8px 25px rgba(247, 107, 28, 0.15)',
                              }
                            }}>
                              <CardContent sx={{ p: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <EmojiEvents sx={{ 
                                    color: 'var(--color-primary)', 
                                    mr: 1.5,
                                    fontSize: '1.5rem'
                                  }} />
                                  <Typography variant="h6" sx={{ 
                                    fontWeight: 600, 
                                    color: 'white',
                                    fontSize: '1.2rem'
                                  }}>
                                    {project.name}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ 
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  lineHeight: 1.6
                                }}>
                                  {project.description}
                                </Typography>
                              </CardContent>
                            </Card>
                          </Zoom>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </GlassCard>
            </Box>
          </Fade>
        </Box>

        {/* Projects Section */}
        <Box ref={projectsRef} sx={{ mb: 8 }}>
          <Fade in timeout={1400}>
            <Box>
              <Typography variant="h3" sx={{ 
                mb: 4, 
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: 'center'
              }}>
                Project Portfolio
              </Typography>
              
              {/* Statistics Cards */}
              <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} md={4}>
                  <Zoom in timeout={1600}>
                    <StatCard sx={{ textAlign: 'center', p: 4, height: '100%' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Work sx={{ 
                          fontSize: '3rem', 
                          color: 'var(--color-primary)',
                          mr: 2
                        }} />
                        <Typography variant="h2" sx={{ 
                          color: 'var(--color-primary)', 
                          fontWeight: 800,
                          fontSize: { xs: '2.5rem', md: '3rem' }
                        }}>
                          {formatNumber(safeDeveloper.completedProjects || 0)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', md: '1.3rem' }
                      }}>
                        Completed Projects
                      </Typography>
                    </StatCard>
                  </Zoom>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Zoom in timeout={1800}>
                    <StatCard sx={{ textAlign: 'center', p: 4, height: '100%' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <TrendingUp sx={{ 
                          fontSize: '3rem', 
                          color: 'var(--color-secondary)',
                          mr: 2
                        }} />
                        <Typography variant="h2" sx={{ 
                          color: 'var(--color-secondary)', 
                          fontWeight: 800,
                          fontSize: { xs: '2.5rem', md: '3rem' }
                        }}>
                          {formatNumber(safeDeveloper.ongoingProjects || 0)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', md: '1.3rem' }
                      }}>
                        Ongoing Projects
                      </Typography>
                    </StatCard>
                  </Zoom>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Zoom in timeout={2000}>
                    <StatCard sx={{ textAlign: 'center', p: 4, height: '100%' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center',
                        mb: 2
                      }}>
                        <Timeline sx={{ 
                          fontSize: '3rem', 
                          color: '#10b981',
                          mr: 2
                        }} />
                        <Typography variant="h2" sx={{ 
                          color: '#10b981', 
                          fontWeight: 800,
                          fontSize: { xs: '2.5rem', md: '3rem' }
                        }}>
                          {formatNumber(safeDeveloper.upcomingProjects || 0)}
                        </Typography>
                      </Box>
                      <Typography variant="h6" sx={{ 
                        color: 'rgba(255, 255, 255, 0.9)',
                        fontWeight: 600,
                        fontSize: { xs: '1.1rem', md: '1.3rem' }
                      }}>
                        Upcoming Projects
                      </Typography>
                    </StatCard>
                  </Zoom>
                </Grid>
              </Grid>
              
              <GlassCard sx={{ p: { xs: 3, md: 6 } }}>

                {/* Developer Projects Grid */}
                <Typography variant="h5" sx={{ 
                  mb: 4, 
                  color: 'var(--color-primary)',
                  fontWeight: 600,
                  textAlign: 'center',
                  fontSize: { xs: '1.5rem', md: '1.8rem' }
                }}>
                  Featured Projects
                </Typography>
                
                {projectsLoading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                    <CircularProgress size={60} sx={{ color: 'var(--color-primary)' }} />
                  </Box>
                ) : projectsError ? (
                  <Alert severity="error" sx={{ 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: 'white'
                  }}>
                    {projectsError}
                  </Alert>
                ) : (
                  <>
                    {projects && projects.length > 0 ? (
                      <Grid container spacing={4}>
                        {projects.map((proj: any, index: number) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={proj._id}>
                            <Zoom in timeout={2200 + (index * 200)}>
                              <ProjectCard sx={{ height: '100%' }}>
                                <Box sx={{
                                  position: 'relative',
                                  pt: '56.25%',
                                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                  overflow: 'hidden'
                                }}>
                                  {proj.images?.length ? (
                                    <img
                                      src={proj.images.find((i: any) => i.isPrimary)?.url || proj.images[0].url}
                                      alt={proj.name}
                                      style={{ 
                                        position: 'absolute', 
                                        inset: 0, 
                                        width: '100%', 
                                        height: '100%', 
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                      }}
                                      onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                      }}
                                      onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                      }}
                                    />
                                  ) : (
                                    <Box sx={{
                                      position: 'absolute',
                                      inset: 0,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      backgroundColor: 'rgba(247, 107, 28, 0.1)'
                                    }}>
                                      <Apartment sx={{ 
                                        fontSize: '4rem', 
                                        color: 'var(--color-primary)',
                                        opacity: 0.5
                                      }} />
                                    </Box>
                                  )}
                                  <Box sx={{
                                    position: 'absolute',
                                    top: 12,
                                    right: 12,
                                    background: 'rgba(0, 0, 0, 0.7)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: '20px',
                                    px: 2,
                                    py: 0.5
                                  }}>
                                    <Typography variant="caption" sx={{ 
                                      color: 'white',
                                      fontWeight: 600,
                                      fontSize: '0.75rem'
                                    }}>
                                      {proj.status || 'Active'}
                                    </Typography>
                                  </Box>
                                </Box>
                                <CardContent sx={{ p: 3 }}>
                                  <Typography variant="h6" sx={{ 
                                    mb: 1, 
                                    color: 'white',
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    lineHeight: 1.3
                                  }}>
                                    {proj.name}
                                  </Typography>
                                  {proj.location?.city && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                      <LocationOn sx={{ 
                                        fontSize: '1rem', 
                                        color: 'var(--color-primary)', 
                                        mr: 0.5 
                                      }} />
                                      <Typography variant="body2" sx={{ 
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        fontSize: '0.9rem'
                                      }}>
                                        {proj.location.city}{proj.location?.state ? `, ${proj.location.state}` : ''}
                                      </Typography>
                                    </Box>
                                  )}
                                  <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 0.5 }}>
                                    {proj.type && (
                                      <Chip 
                                        size="small" 
                                        label={proj.type} 
                                        sx={{ 
                                          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
                                          color: 'white',
                                          fontWeight: 500,
                                          fontSize: '0.75rem'
                                        }} 
                                      />
                                    )}
                                    {proj.status && (
                                      <Chip 
                                        size="small" 
                                        label={proj.status} 
                                        sx={{ 
                                          background: 'linear-gradient(135deg, var(--color-secondary) 0%, #3b82f6 100%)',
                                          color: 'white',
                                          fontWeight: 500,
                                          fontSize: '0.75rem'
                                        }} 
                                      />
                                    )}
                                  </Stack>
                                  <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => router.push(`/projects/${proj._id}`)}
                                    sx={{
                                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
                                      borderRadius: '25px',
                                      py: 1.5,
                                      fontWeight: 600,
                                      textTransform: 'none',
                                      fontSize: '0.95rem',
                                      boxShadow: '0 4px 15px rgba(247, 107, 28, 0.3)',
                                      '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(247, 107, 28, 0.4)',
                                      }
                                    }}
                                  >
                                    View Details
                                  </Button>
                                </CardContent>
                              </ProjectCard>
                            </Zoom>
                          </Grid>
                        ))}
                      </Grid>
                    ) : (
                      <Box sx={{ 
                        textAlign: 'center', 
                        py: 6,
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <Apartment sx={{ 
                          fontSize: '4rem', 
                          color: 'rgba(255, 255, 255, 0.3)',
                          mb: 2
                        }} />
                        <Typography variant="h6" sx={{ 
                          color: 'rgba(255, 255, 255, 0.7)',
                          fontWeight: 500
                        }}>
                          No projects found for this developer
                        </Typography>
                      </Box>
                    )}
                  </>
                )}
              </GlassCard>
            </Box>
          </Fade>
        </Box>

        {/* Team Section */}
        <Box ref={teamRef} sx={{ mb: 8 }}>
          <Fade in timeout={1600}>
            <Box>
              <Typography variant="h3" sx={{ 
                mb: 4, 
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: 'center'
              }}>
                Our Team
              </Typography>
              
              <GlassCard sx={{ p: { xs: 3, md: 6 } }}>
                {safeDeveloper.team && safeDeveloper.team.length > 0 ? (
                  <Grid container spacing={4}>
                    {safeDeveloper.team.map((member, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Zoom in timeout={1800 + (index * 200)}>
                          <Card sx={{
                            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-8px)',
                              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.2)',
                              borderColor: 'var(--color-primary)',
                            }
                          }}>
                            <CardContent sx={{ p: 4, textAlign: 'center' }}>
                              <Box sx={{ position: 'relative', mb: 3 }}>
                                <Avatar
                                  src={member.image?.url}
                                  sx={{ 
                                    width: 100, 
                                    height: 100, 
                                    mx: 'auto', 
                                    mb: 2,
                                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                                    border: '3px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 8px 25px rgba(247, 107, 28, 0.3)'
                                  }}
                                >
                                  <Groups sx={{ fontSize: '2.5rem' }} />
                                </Avatar>
                                <Box sx={{
                                  position: 'absolute',
                                  top: 0,
                                  right: '50%',
                                  transform: 'translateX(50%)',
                                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
                                  borderRadius: '50%',
                                  width: 24,
                                  height: 24,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: '2px solid rgba(11, 16, 17, 1)'
                                }}>
                                  <Verified sx={{ fontSize: '1rem', color: 'white' }} />
                                </Box>
                              </Box>
                              
                              <Typography variant="h6" sx={{ 
                                mb: 1, 
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1.2rem'
                              }}>
                                {member.name}
                              </Typography>
                              
                              <Typography variant="body2" sx={{ 
                                color: 'var(--color-primary)',
                                fontWeight: 500,
                                mb: 2,
                                fontSize: '1rem'
                              }}>
                                {member.designation}
                              </Typography>
                              
                              {member.bio && (
                                <Typography variant="body2" sx={{ 
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  lineHeight: 1.5,
                                  fontSize: '0.9rem'
                                }}>
                                  {member.bio}
                                </Typography>
                              )}
                            </CardContent>
                          </Card>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <People sx={{ 
                      fontSize: '4rem', 
                      color: 'rgba(255, 255, 255, 0.3)',
                      mb: 2
                    }} />
                    <Typography variant="h6" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 500
                    }}>
                      No team information available
                    </Typography>
                  </Box>
                )}
              </GlassCard>
            </Box>
          </Fade>
        </Box>

        {/* Specializations Section */}
        <Box ref={specializationsRef} sx={{ mb: 8 }}>
          <Fade in timeout={1800}>
            <Box>
              <Typography variant="h3" sx={{ 
                mb: 4, 
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: 'center'
              }}>
                Our Expertise
              </Typography>
              
              <GlassCard sx={{ p: { xs: 3, md: 6 } }}>
                {safeDeveloper.specializations && safeDeveloper.specializations.length > 0 ? (
                  <Grid container spacing={3}>
                    {safeDeveloper.specializations.map((spec, index) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Zoom in timeout={2000 + (index * 200)}>
                          <Card sx={{
                            background: 'linear-gradient(135deg, rgba(247, 107, 28, 0.1) 0%, rgba(26, 43, 255, 0.1) 100%)',
                            border: '1px solid rgba(247, 107, 28, 0.2)',
                            borderRadius: '16px',
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-6px)',
                              boxShadow: '0 12px 30px rgba(247, 107, 28, 0.2)',
                              borderColor: 'var(--color-primary)',
                            }
                          }}>
                            <CardContent sx={{ p: 4 }}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                mb: 2 
                              }}>
                                <Architecture sx={{ 
                                  color: 'var(--color-primary)', 
                                  mr: 2,
                                  fontSize: '2rem'
                                }} />
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 600, 
                                  color: 'white',
                                  fontSize: '1.2rem'
                                }}>
                                  {spec.name}
                                </Typography>
                              </Box>
                              <Typography variant="body2" sx={{ 
                                color: 'rgba(255, 255, 255, 0.8)',
                                lineHeight: 1.6,
                                fontSize: '0.95rem'
                              }}>
                                {spec.description}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Zoom>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 6,
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <Architecture sx={{ 
                      fontSize: '4rem', 
                      color: 'rgba(255, 255, 255, 0.3)',
                      mb: 2
                    }} />
                    <Typography variant="h6" sx={{ 
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 500
                    }}>
                      No specializations information available
                    </Typography>
                  </Box>
                )}
              </GlassCard>
            </Box>
          </Fade>
        </Box>

        {/* Contact Section */}
        <Box ref={contactRef} sx={{ mb: 8 }}>
          <Fade in timeout={2000}>
            <Box>
              <Typography variant="h3" sx={{ 
                mb: 4, 
                color: 'var(--color-primary)',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                textAlign: 'center'
              }}>
                Get In Touch
              </Typography>
              
              <GlassCard sx={{ p: { xs: 3, md: 6 } }}>
                <Grid container spacing={4}>
                  {/* Contact Information */}
                  <Grid item xs={12} md={8}>
                    <Typography variant="h5" sx={{ 
                      mb: 3, 
                      color: 'var(--color-primary)',
                      fontWeight: 600,
                      fontSize: { xs: '1.3rem', md: '1.5rem' }
                    }}>
                      Contact Information
                    </Typography>
                    
                    <Grid container spacing={3}>
                      {safeDeveloper.contact?.email && (
                        <Grid item xs={12} sm={6}>
                          <Card sx={{
                            background: 'linear-gradient(135deg, rgba(247, 107, 28, 0.1) 0%, rgba(26, 43, 255, 0.1) 100%)',
                            border: '1px solid rgba(247, 107, 28, 0.2)',
                            borderRadius: '12px',
                            p: 3,
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(247, 107, 28, 0.15)',
                            }
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Email sx={{ 
                                mr: 2, 
                                color: 'var(--color-primary)',
                                fontSize: '1.5rem'
                              }} />
                              <Box>
                                <Typography variant="body2" sx={{ 
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '0.9rem',
                                  mb: 0.5
                                }}>
                                  Email
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                  color: 'white',
                                  fontWeight: 500
                                }}>
                                  {safeDeveloper.contact.email}
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )}
                      
                      {safeDeveloper.contact?.phone && (
                        <Grid item xs={12} sm={6}>
                          <Card sx={{
                            background: 'linear-gradient(135deg, rgba(247, 107, 28, 0.1) 0%, rgba(26, 43, 255, 0.1) 100%)',
                            border: '1px solid rgba(247, 107, 28, 0.2)',
                            borderRadius: '12px',
                            p: 3,
                            height: '100%',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(247, 107, 28, 0.15)',
                            }
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Phone sx={{ 
                                mr: 2, 
                                color: 'var(--color-primary)',
                                fontSize: '1.5rem'
                              }} />
                              <Box>
                                <Typography variant="body2" sx={{ 
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '0.9rem',
                                  mb: 0.5
                                }}>
                                  Phone
                                </Typography>
                                <Typography variant="body1" sx={{ 
                                  color: 'white',
                                  fontWeight: 500
                                }}>
                                  {safeDeveloper.contact.phone}
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )}
                      
                      {safeDeveloper.website && (
                        <Grid item xs={12}>
                          <Card sx={{
                            background: 'linear-gradient(135deg, rgba(247, 107, 28, 0.1) 0%, rgba(26, 43, 255, 0.1) 100%)',
                            border: '1px solid rgba(247, 107, 28, 0.2)',
                            borderRadius: '12px',
                            p: 3,
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 8px 25px rgba(247, 107, 28, 0.15)',
                            }
                          }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Language sx={{ 
                                mr: 2, 
                                color: 'var(--color-primary)',
                                fontSize: '1.5rem'
                              }} />
                              <Box>
                                <Typography variant="body2" sx={{ 
                                  color: 'rgba(255, 255, 255, 0.7)',
                                  fontSize: '0.9rem',
                                  mb: 0.5
                                }}>
                                  Website
                                </Typography>
                                <Link 
                                  href={safeDeveloper.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  sx={{ 
                                    color: 'var(--color-primary)',
                                    fontWeight: 500,
                                    textDecoration: 'none',
                                    '&:hover': {
                                      textDecoration: 'underline'
                                    }
                                  }}
                                >
                                  Visit Website
                                </Link>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  
                  {/* Social Media Links */}
                  {safeDeveloper.socialMedia && (
                    <Grid item xs={12} md={4}>
                      <Typography variant="h5" sx={{ 
                        mb: 3, 
                        color: 'var(--color-primary)',
                        fontWeight: 600,
                        fontSize: { xs: '1.3rem', md: '1.5rem' }
                      }}>
                        Follow Us
                      </Typography>
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        {safeDeveloper.socialMedia.facebook && (
                          <Button
                            component="a"
                            href={safeDeveloper.socialMedia.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<FacebookIcon />}
                            sx={{
                              background: 'linear-gradient(135deg, #1877f2 0%, #0d47a1 100%)',
                              color: 'white',
                              borderRadius: '25px',
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: 'none',
                              justifyContent: 'flex-start',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(24, 119, 242, 0.4)',
                              }
                            }}
                          >
                            Facebook
                          </Button>
                        )}
                        
                        {safeDeveloper.socialMedia.twitter && (
                          <Button
                            component="a"
                            href={safeDeveloper.socialMedia.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<XIcon />}
                            sx={{
                              background: 'linear-gradient(135deg, #000000 0%, #333333 100%)',
                              color: 'white',
                              borderRadius: '25px',
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: 'none',
                              justifyContent: 'flex-start',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                              }
                            }}
                          >
                            Twitter
                          </Button>
                        )}
                        
                        {safeDeveloper.socialMedia.linkedin && (
                          <Button
                            component="a"
                            href={safeDeveloper.socialMedia.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<LinkedInIcon />}
                            sx={{
                              background: 'linear-gradient(135deg, #0077b5 0%, #004471 100%)',
                              color: 'white',
                              borderRadius: '25px',
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: 'none',
                              justifyContent: 'flex-start',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0, 119, 181, 0.4)',
                              }
                            }}
                          >
                            LinkedIn
                          </Button>
                        )}
                        
                        {safeDeveloper.socialMedia.instagram && (
                          <Button
                            component="a"
                            href={safeDeveloper.socialMedia.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<InstagramIcon />}
                            sx={{
                              background: 'linear-gradient(135deg, #e4405f 0%, #c13584 100%)',
                              color: 'white',
                              borderRadius: '25px',
                              py: 1.5,
                              fontWeight: 600,
                              textTransform: 'none',
                              justifyContent: 'flex-start',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(228, 64, 95, 0.4)',
                              }
                            }}
                          >
                            Instagram
                          </Button>
                        )}
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </GlassCard>
            </Box>
          </Fade>
        </Box>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete {safeDeveloper.name}? This action cannot be undone.
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
        <Zoom in timeout={300}>
          <IconButton
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)',
              color: 'white',
              zIndex: 1000,
              width: 56,
              height: 56,
              boxShadow: '0 8px 25px rgba(247, 107, 28, 0.3)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 35px rgba(247, 107, 28, 0.4)',
                background: 'linear-gradient(135deg, var(--color-primary-hover) 0%, #3b82f6 100%)',
              },
              transition: 'all 0.3s ease'
            }}
          >
            <KeyboardArrowUp sx={{ fontSize: '1.5rem' }} />
          </IconButton>
        </Zoom>
      )}
    </Box>
  );
};

export default DeveloperDetailsClient;