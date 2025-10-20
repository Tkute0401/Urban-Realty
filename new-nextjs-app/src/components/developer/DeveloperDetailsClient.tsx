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

  // Load projects for this developer
  useEffect(() => {
    const developerId = Array.isArray(id) ? id[0] : id;
    if (developerId) {
      getProjectsByDeveloper(developerId).catch(() => {});
    }
  }, [id, getProjectsByDeveloper]);

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
                {safeDeveloper.logo?.url ? (
                  <img 
                    src={safeDeveloper.logo.url} 
                    alt={`${safeDeveloper.name} logo`} 
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
                {safeDeveloper.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocationOn sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
                  {getHeadquarters()}
                </Typography>
              </Box>
              
              {safeDeveloper.foundedYear && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarToday sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Typography variant="body1" sx={{ color: 'var(--color-primary)' }}>
                    Established in {safeDeveloper.foundedYear}
                  </Typography>
                </Box>
              )}
              
              {safeDeveloper.website && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Language sx={{ mr: 1, color: 'rgba(255, 255, 255, 0.7)' }} />
                  <Link 
                    href={safeDeveloper.website} 
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
                  {formatNumber(safeDeveloper.completedProjects || 0)} Completed Projects •{' '}
                  {formatNumber(safeDeveloper.ongoingProjects || 0)} Ongoing •{' '}
                  {formatNumber(safeDeveloper.upcomingProjects || 0)} Upcoming
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
        {/* Overview Section */}
        <Box ref={overviewRef} sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
            Overview
          </Typography>
          <Paper sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(120, 202, 220, 0.3)' }}>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8 }}>
              {safeDeveloper.description || 'No description available for this developer.'}
            </Typography>
            
            {safeDeveloper.flagshipProjects && safeDeveloper.flagshipProjects.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                  Flagship Projects
                </Typography>
                <Grid container spacing={2}>
                  {safeDeveloper.flagshipProjects.map((project, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Box sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {project.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                          {project.description}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Projects Section */}
        <Box ref={projectsRef} sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
            Projects
          </Typography>
          <Paper sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(120, 202, 220, 0.3)' }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h3" sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {formatNumber(safeDeveloper.completedProjects || 0)}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Completed Projects
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h3" sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {formatNumber(safeDeveloper.ongoingProjects || 0)}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Ongoing Projects
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Typography variant="h3" sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                    {formatNumber(safeDeveloper.upcomingProjects || 0)}
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Upcoming Projects
                  </Typography>
                </Box>
              </Grid>
              <Divider sx={{ my: 4, borderColor: 'rgba(120, 202, 220, 0.3)' }} />

              {/* Developer Projects Grid */}
              {projectsLoading ? (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <CircularProgress />
                  </Box>
                </Grid>
              ) : projectsError ? (
                <Grid item xs={12}>
                  <Alert severity="error">{projectsError}</Alert>
                </Grid>
              ) : (
                <>
                  {projects && projects.length > 0 ? (
                    <Grid item xs={12}>
                      <Grid container spacing={3}>
                        {projects.map((proj: any) => (
                          <Grid item xs={12} sm={6} md={4} lg={3} key={proj._id}>
                            <Box sx={{
                              backgroundColor: 'rgba(255, 255, 255, 0.04)',
                              border: '1px solid rgba(120, 202, 220, 0.2)',
                              borderRadius: 2,
                              overflow: 'hidden',
                              height: '100%'
                            }}>
                              <Box sx={{
                                position: 'relative',
                                pt: '56.25%',
                                backgroundColor: 'rgba(255, 255, 255, 0.06)'
                              }}>
                                {proj.images?.length ? (
                                  <img
                                    src={proj.images.find((i: any) => i.isPrimary)?.url || proj.images[0].url}
                                    alt={proj.name}
                                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                ) : null}
                              </Box>
                              <Box sx={{ p: 2.5 }}>
                                <Typography variant="h6" sx={{ mb: 1, color: 'white' }}>
                                  {proj.name}
                                </Typography>
                                {proj.location?.city && (
                                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                    {proj.location.city}{proj.location?.state ? `, ${proj.location.state}` : ''}
                                  </Typography>
                                )}
                                <Stack direction="row" spacing={1} sx={{ mb: 1, flexWrap: 'wrap' }}>
                                  {proj.status && (
                                    <Chip size="small" label={proj.status} sx={{ color: 'white', borderColor: 'rgba(120, 202, 220, 0.5)' }} variant="outlined" />
                                  )}
                                  {proj.type && (
                                    <Chip size="small" label={proj.type} sx={{ color: 'white', borderColor: 'rgba(120, 202, 220, 0.5)' }} variant="outlined" />
                                  )}
                                </Stack>
                                <Button
                                  fullWidth
                                  variant="contained"
                                  color="primary"
                                  onClick={() => router.push(`/projects/${proj._id}`)}
                                >
                                  View Details
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        No projects found for this developer.
                      </Typography>
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Paper>
        </Box>

        {/* Team Section */}
        <Box ref={teamRef} sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
            Team
          </Typography>
          <Paper sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(120, 202, 220, 0.3)' }}>
            {safeDeveloper.team && safeDeveloper.team.length > 0 ? (
              <Grid container spacing={3}>
                {safeDeveloper.team.map((member, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ textAlign: 'center', p: 2 }}>
                      <Avatar
                        src={member.image?.url}
                        sx={{ 
                          width: 80, 
                          height: 80, 
                          mx: 'auto', 
                          mb: 2,
                          backgroundColor: 'var(--color-primary)'
                        }}
                      >
                        <Groups />
                      </Avatar>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {member.designation}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                No team information available.
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Specializations Section */}
        <Box ref={specializationsRef} sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
            Specializations
          </Typography>
          <Paper sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(120, 202, 220, 0.3)' }}>
            {safeDeveloper.specializations && safeDeveloper.specializations.length > 0 ? (
              <Grid container spacing={2}>
                {safeDeveloper.specializations.map((spec, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Box sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {spec.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {spec.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
                No specializations information available.
              </Typography>
            )}
          </Paper>
        </Box>

        {/* Contact Section */}
        <Box ref={contactRef} sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ mb: 3, color: 'var(--color-primary)' }}>
            Contact Information
          </Typography>
          <Paper sx={{ p: 4, backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(120, 202, 220, 0.3)' }}>
            <Grid container spacing={4}>
              {safeDeveloper.contact?.email && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Email sx={{ mr: 2, color: 'var(--color-primary)' }} />
                    <Typography variant="body1">
                      {safeDeveloper.contact.email}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {safeDeveloper.contact?.phone && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Phone sx={{ mr: 2, color: 'var(--color-primary)' }} />
                    <Typography variant="body1">
                      {safeDeveloper.contact.phone}
                    </Typography>
                  </Box>
                </Grid>
              )}
              
              {safeDeveloper.website && (
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Language sx={{ mr: 2, color: 'var(--color-primary)' }} />
                    <Link 
                      href={safeDeveloper.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ color: 'var(--color-primary)' }}
                    >
                      Visit Website
                    </Link>
                  </Box>
                </Grid>
              )}
            </Grid>

            {/* Social Media Links */}
            {safeDeveloper.socialMedia && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                  Follow Us
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {safeDeveloper.socialMedia.facebook && (
                    <IconButton 
                      component="a" 
                      href={safeDeveloper.socialMedia.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ color: 'var(--color-primary)' }}
                    >
                      <FacebookIcon />
                    </IconButton>
                  )}
                  {safeDeveloper.socialMedia.twitter && (
                    <IconButton 
                      component="a" 
                      href={safeDeveloper.socialMedia.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ color: 'var(--color-primary)' }}
                    >
                      <XIcon />
                    </IconButton>
                  )}
                  {safeDeveloper.socialMedia.linkedin && (
                    <IconButton 
                      component="a" 
                      href={safeDeveloper.socialMedia.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ color: 'var(--color-primary)' }}
                    >
                      <LinkedInIcon />
                    </IconButton>
                  )}
                  {safeDeveloper.socialMedia.instagram && (
                    <IconButton 
                      component="a" 
                      href={safeDeveloper.socialMedia.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      sx={{ color: 'var(--color-primary)' }}
                    >
                      <InstagramIcon />
                    </IconButton>
                  )}
                </Box>
              </Box>
            )}
          </Paper>
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