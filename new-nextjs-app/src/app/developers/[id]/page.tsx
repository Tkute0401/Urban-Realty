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
import { useAuth } from '../../../contexts/AuthContext';
import { useDevelopers } from '../../../contexts/DevelopersContext';
//import ImageGallery from '../../components/common/ImageGallery';
//import MapComponent from '../../components/common/MapComponent';
import { formatNumber } from '../../../lib/utils/format';
import http from '../../../lib/services/http';
import { styled, keyframes } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
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

const DeveloperDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { developers, getDevelopers } = useDevelopers();
  
  const [developer, setDeveloper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    const fetchDeveloper = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First check if developer exists in context
        const contextDeveloper = developers.find(d => d._id === id);
        if (contextDeveloper) {
          setDeveloper(contextDeveloper);
          setLoading(false);
          return;
        }
        
        // If not, fetch from API
        const response = await http.get(`/developers/${id}`);
        setDeveloper(response.data.data || response.data);
      } catch (err) {
        console.error('Error fetching developer:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load developer');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeveloper();
  }, [id, developers]);

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

  if (loading || !developer) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)'
      }}>
        <CircularProgress 
          size={80} 
          thickness={4}
          sx={{ color: 'var(--color-primary)', animation: `${pulse} 2s infinite` }} 
        />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        p: 3, 
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)',
        minHeight: '100vh'
      }}>
        <Alert severity="error" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
          {error}
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => router.push('/developers')}
          sx={{ mt: 2 }}
        >
          Browse Developers
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface) 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <Helmet>
        <title>{developer.name} | Real Estate Developers</title>
        <meta name="description" content={developer.description.substring(0, 160)} />
        <meta property="og:title" content={`${developer.name} | Real Estate Developers`} />
        <meta property="og:description" content={developer.description.substring(0, 160)} />
        {developer.logo?.url && <meta property="og:image" content={developer.logo.url} />}
      </Helmet>

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
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {/* Overview Section */}
            <Box ref={overviewRef} sx={{ mb: 6 }}>
              <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
                About {developer.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
                {developer.description}
              </Typography>
              
              {developer.headquarters && (
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                    Headquarters
                  </Typography>
                  {/* <MapComponent 
                    location={`${developer.headquarters.city}, ${developer.headquarters.state}, ${developer.headquarters.country}`}
                    height="300px"
                  /> */}
                </Box>
              )}
            </Box>

            {/* Projects Section */}
            <Box ref={projectsRef} sx={{ mb: 6 }}>
              <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
                Projects
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, backgroundColor: 'rgba(120, 202, 220, 0.1)' }}>
                    <Typography variant="h6" sx={{ color: 'var(--color-primary)' }}>
                      Completed
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700  ,color: 'white'}}>
                      {formatNumber(developer.completedProjects || 0)}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, backgroundColor: 'rgba(120, 202, 220, 0.1)' }}>
                    <Typography variant="h6" sx={{ color: 'var(--color-primary)' }}>
                      Ongoing
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700  ,color: 'white'}}>
                      {formatNumber(developer.ongoingProjects || 0)}
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 3, backgroundColor: 'rgba(120, 202, 220, 0.1)' }}>
                    <Typography variant="h6" sx={{ color: 'var(--color-primary)' }}>
                      Upcoming
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700  ,color: 'white'}}>
                      {formatNumber(developer.upcomingProjects || 0)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              {developer.flagshipProjects?.length > 0 && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h5" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                    Flagship Projects
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {developer.flagshipProjects.map((project, index) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Paper sx={{ 
                          p: 3,
                          height: '100%',
                          backgroundColor: 'rgba(120, 202, 220, 0.1)',
                          border: '1px solid rgba(120, 202, 220, 0.3)'
                        }}>
                          <Typography variant="h6" sx={{ mb: 1, color: 'var(--color-primary)' }}>
                            {project.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'white' }}>
                            {project.description}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </Box>

            {/* Team Section */}
            {developer.team?.length > 0 && (
              <Box ref={teamRef} sx={{ mb: 6 }}>
                <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
                  Key Team Members
                </Typography>
                
                <Grid container spacing={3}>
                  {developer.team.map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Paper sx={{ 
                        p: 3,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        backgroundColor: 'rgba(120, 202, 220, 0.1)',
                        border: '1px solid rgba(120, 202, 220, 0.3)'
                      }}>
                        {member.image?.url ? (
                          <Avatar 
                            src={member.image.url} 
                            sx={{ 
                              width: 120, 
                              height: 120,
                              mb: 2
                            }} 
                          />
                        ) : (
                          <Avatar sx={{ 
                            width: 120, 
                            height: 120,
                            mb: 2,
                            backgroundColor: 'rgba(120, 202, 220, 0.3)'
                          }}>
                            <Groups sx={{ fontSize: 60 }} />
                          </Avatar>
                        )}
                        
                        <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                          {member.name}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                          {member.designation}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Specializations Section */}
            {developer.specializations?.length > 0 && (
              <Box ref={specializationsRef} sx={{ mb: 6 }}>
                <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
                  Specializations
                </Typography>
                
                <Grid container spacing={3}>
                  {developer.specializations.map((spec, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Paper sx={{ 
                        p: 3,
                        height: '100%',
                        backgroundColor: 'rgba(120, 202, 220, 0.1)',
                        border: '1px solid rgba(120, 202, 220, 0.3)'
                      }}>
                        <Typography variant="h6" sx={{ mb: 1, color: 'var(--color-primary)' }}>
                          {spec.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {spec.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Contact Section */}
            <Box ref={contactRef} sx={{ mb: 6 }}>
              <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
                Contact Information
              </Typography>
              
              <Grid container spacing={3}>
                {(developer.contact?.email || developer.contact?.phone) && (
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ 
                      p: 3,
                      height: '100%',
                      backgroundColor: 'rgba(120, 202, 220, 0.1)',
                      border: '1px solid rgba(120, 202, 220, 0.3)'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                        Get in Touch
                      </Typography>
                      
                      {developer.contact?.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Email sx={{ mr: 1 }} />
                          <Link 
                            href={`mailto:${developer.contact.email}`}
                            sx={{ color: 'white' }}
                          >
                            {developer.contact.email}
                          </Link>
                        </Box>
                      )}
                      
                      {developer.contact?.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Phone sx={{ mr: 1 }} />
                          <Link 
                            href={`tel:${developer.contact.phone}`}
                            sx={{ color: 'white' }}
                          >
                            {developer.contact.phone}
                          </Link>
                        </Box>
                      )}
                    </Paper>
                  </Grid>
                )}
                
                {(developer.socialMedia?.facebook || 
                  developer.socialMedia?.twitter || 
                  developer.socialMedia?.linkedin || 
                  developer.socialMedia?.instagram) && (
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ 
                      p: 3,
                      height: '100%',
                      backgroundColor: 'rgba(120, 202, 220, 0.1)',
                      border: '1px solid rgba(120, 202, 220, 0.3)'
                    }}>
                      <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                        Social Media
                      </Typography>
                      
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2}}>
                        {developer.socialMedia?.facebook && (
                          <Button 
                            variant="outlined" 
                            href={developer.socialMedia.facebook} 
                            target="_blank"
                            startIcon={<FacebookIcon sx={{color: '#FFFFFF'}}/>}
                          />
                        )}
                        
                        {developer.socialMedia?.twitter && (
                          <Button 
                            variant="outlined" 
                            href={developer.socialMedia.twitter} 
                            target="_blank"
                            startIcon={<XIcon sx={{color: '#FFFFFF'}}/>}
                          />
                        )}
                        
                        {developer.socialMedia?.linkedin && (
                          <Button 
                            variant="outlined" 
                            href={developer.socialMedia.linkedin} 
                            target="_blank"
                            startIcon={<LinkedInIcon sx={{color: '#FFFFFF'}}/>}
                          />
                        )}
                        
                        {developer.socialMedia?.instagram && (
                          <Button
                            variant="outlined" 
                            href={developer.socialMedia.instagram} 
                            target="_blank"
                            startIcon={<InstagramIcon sx={{color: '#FFFFFF', border: '#FFFFFF'}}/>}
                          />
                        )}
                      </Box>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
          
          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              position: isSticky ? 'sticky' : 'static',
              top: isSticky ? `${headerHeight + 20}px` : 'auto'
            }}>
              <Paper sx={{ 
                p: 3,
                mb: 3,
                backgroundColor: 'rgba(120, 202, 220, 0.1)',
                border: '1px solid rgba(120, 202, 220, 0.3)'
              }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                  Developer Summary
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Founded
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
                    {developer.foundedYear || 'Not specified'}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Headquarters
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
                    {getHeadquarters() || 'Not specified'}
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Total Projects
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
                    {formatNumber((developer.completedProjects || 0) + 
                     (developer.ongoingProjects || 0) + 
                     (developer.upcomingProjects || 0))}
                  </Typography>
                </Box>
                
                {developer.awards?.length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Awards
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
                      {developer.awards.length} awards received
                    </Typography>
                  </Box>
                )}
              </Paper>
              
              {developer.awards?.length > 0 && (
                <Paper sx={{ 
                  p: 3,
                  mb: 3,
                  backgroundColor: 'rgba(120, 202, 220, 0.1)',
                  border: '1px solid rgba(120, 202, 220, 0.3)'
                }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                    Recent Awards
                  </Typography>
                  
                  <Stack spacing={2}>
                    {developer.awards.slice(0, 3).map((award, index) => (
                      <Box key={index}>
                        <Typography variant="body1" sx={{ color: 'white' }}>
                          {award.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'var(--color-primary)' }}>
                          {award.year} • {award.category}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Paper>
              )}
              
              <Button 
                variant="contained" 
                fullWidth
                sx={{ 
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  '&:hover': { backgroundColor: 'var(--color-primary-hover)' }
                }}
                onClick={() => {
                  if (developer.contact?.email || developer.contact?.phone) {
                    if (developer.contact.email) {
                      window.location.href = `mailto:${developer.contact.email}`;
                    } else if (developer.contact.phone) {
                      window.location.href = `tel:${developer.contact.phone}`;
                    }
                  } else {
                    toast.info('No contact information available');
                  }
                }}
              >
                Contact Developer
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {showBackToTop && (
        <IconButton
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            position: 'fixed',
            bottom: 30,
            right: 30,
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-primary-contrast)',
            '&:hover': { backgroundColor: 'var(--color-primary-hover)' }
          }}
        >
          <KeyboardArrowUp />
        </IconButton>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
          <Typography>
            Are you sure you want to delete {developer.name}? This action cannot be undone.
          </Typography>
          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#0B1011' }}>
          <Button 
            onClick={() => setDeleteConfirmOpen(false)}
            sx={{ color: 'white' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={deleting}
          >
            {deleting ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeveloperDetails;