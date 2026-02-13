'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '../../../contexts/ProjectsContext';
import { useAuth } from '../../../contexts/AuthContext';
import PropertyMap from '../../../components/property/PropertyMap';
import ContactButton from '../../../components/contact/ContactButton';
import ContactModal from '../../../components/contact/ContactModal';
import { useContactModal } from '../../../hooks/useContact';
import { getSlug } from '@/lib/utils/slug';
import http from '@/lib/services/http';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  useMediaQuery,
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Tooltip,
  Fab
} from '@mui/material';
import {
  ArrowBack,
  LocationOn,
  Business,
  CalendarToday,
  CurrencyRupee,
  Visibility,
  Edit,
  Delete,
  Share,
  Download,
  PictureAsPdf,
  VideoLibrary,
  Home,
  Apartment,
  Store,
  Factory,
  Hotel,
  ShoppingCart,
  BusinessCenter,
  Construction,
  Pause,
  CheckCircle,
  Cancel,
  Phone,
  Email,
  Language,
  Facebook,
  Twitter,
  LinkedIn,
  Instagram,
  YouTube,
  WhatsApp,
  Print,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { toast } from 'react-toastify';

interface ProjectDetailsClientProps {
  projectSlug: string;
}

const ProjectDetailsClient: React.FC<ProjectDetailsClientProps> = ({ projectSlug }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { deleteProject, loading, error } = useProjects();
  const {
    isOpen: contactModalOpen,
    contactType,
    contactInfo,
    propertyInfo,
    projectInfo,
    openModal,
    closeModal
  } = useContactModal();

  const [project, setProject] = useState<any>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoadingProject(true);
        // Fetch by slug or ID (for backward compatibility)
        let response;

        // Check if it looks like a MongoDB ObjectId (24 hex characters)
        const isObjectId = /^[0-9a-fA-F]{24}$/.test(projectSlug);

        if (isObjectId) {
          // It's an ID, fetch by ID
          try {
            response = await http.get(`/api/v1/projects/${projectSlug}`);
          } catch (idError) {
            // If ID fetch fails, try as slug
            response = await http.get(`/api/v1/projects/slug/${projectSlug}`);
          }
        } else {
          // It's a slug, fetch by slug first
          try {
            response = await http.get(`/api/v1/projects/slug/${projectSlug}`);
          } catch (slugError) {
            // If slug fetch fails, try as ID (for backward compatibility)
            response = await http.get(`/api/v1/projects/${projectSlug}`);
          }
        }

        const projectData = response.data.data || response.data;
        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoadingProject(false);
      }
    };

    if (projectSlug) {
      fetchProject();
    }
  }, [projectSlug]);

  // Check if project is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !project?._id) return;

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `/api/v1/auth/project-favorites/${project._id}/status`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const data = await response.json();
        if (data.success) {
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [user, project?._id]);

  const handleFavoriteToggle = async () => {
    if (!user) {
      router.push('/login');
      toast.info('Please login to save favorites');
      return;
    }

    if (!project?._id) return;

    setLoadingFavorite(true);
    try {
      const token = localStorage.getItem('token');
      const url = `/api/v1/auth/project-favorites/${project._id}`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      } else {
        toast.error(data.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!project?._id) return;
    try {
      await deleteProject(project._id);
      setDeleteDialogOpen(false);
      router.push('/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project?.name,
        text: project?.shortDescription || project?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Under Construction': return 'warning';
      case 'Planning': return 'info';
      case 'On Hold': return 'error';
      case 'Cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle />;
      case 'Under Construction': return <Construction />;
      case 'Planning': return <CalendarToday />;
      case 'On Hold': return <Pause />;
      case 'Cancelled': return <Cancel />;
      default: return <CalendarToday />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Residential': return <Home />;
      case 'Commercial': return <Business />;
      case 'Mixed-Use': return <Apartment />;
      case 'Industrial': return <Factory />;
      case 'Hospitality': return <Hotel />;
      case 'Retail': return <ShoppingCart />;
      case 'Office': return <BusinessCenter />;
      default: return <Home />;
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    } else {
      return `₹${price.toLocaleString()}`;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loadingProject) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress size={60} sx={{ color: 'var(--color-primary)', mb: 3 }} />
        <Typography variant="h6" color="textSecondary">
          Loading project details...
        </Typography>
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={() => router.push('/projects')}>
            Back
          </Button>
        }>
          {error || 'Project not found'}
        </Alert>
      </Container>
    );
  }

  const images = project.images || [];
  const brochures = project.brochures || [];
  const virtualTours = project.virtualTours || [];
  const amenities = project.amenities || [];
  const configurations = project.configurations || [];
  const developers = project.developers || [];
  const primaryDeveloper = developers.length > 0 ? developers[0] : null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--color-background)', pb: 8 }}>
      {/* Breadcrumbs */}
      <Box sx={{ bgcolor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            <Link
              component="button"
              variant="body2"
              onClick={() => router.push('/')}
              sx={{ color: 'var(--color-text-secondary)', textDecoration: 'none', '&:hover': { color: 'var(--color-primary)' } }}
            >
              Home
            </Link>
            <Link
              component="button"
              variant="body2"
              onClick={() => router.push('/projects')}
              sx={{ color: 'var(--color-text-secondary)', textDecoration: 'none', '&:hover': { color: 'var(--color-primary)' } }}
            >
              Projects
            </Link>
            <Typography variant="body2" color="text.primary" fontWeight={500}>
              {project.name}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* Hero Section */}
      <Box sx={{ position: 'relative', height: { xs: '40vh', md: '60vh' }, bgcolor: 'black', overflow: 'hidden' }}>
        {images.length > 0 ? (
          <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
            <CardMedia
              component="img"
              image={typeof images[currentImageIndex] === 'string' ? images[currentImageIndex] : images[currentImageIndex]?.url || ''}
              alt={project.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.8
              }}
              onClick={() => setImageDialogOpen(true)}
            />
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)',
            }} />
          </Box>
        ) : (
          <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'var(--color-surface-variant)' }}>
            <Business sx={{ fontSize: 80, color: 'var(--color-text-disabled)' }} />
          </Box>
        )}

        <Container maxWidth="xl" sx={{ position: 'absolute', bottom: { xs: 24, md: 48 }, left: 0, right: 0, zIndex: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'flex-start', md: 'flex-end' }, justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ color: 'white' }}>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip
                  icon={getStatusIcon(project.status)}
                  label={project.status}
                  color={getStatusColor(project.status) as any}
                  size="small"
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  variant="outlined"
                />
                <Chip
                  icon={getTypeIcon(project.type)}
                  label={project.type}
                  size="small"
                  sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                  variant="outlined"
                />
              </Stack>
              <Typography variant="h2" component="h1" fontWeight={800} sx={{ typography: { xs: 'h4', md: 'h2' }, mb: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {project.name}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ opacity: 0.9 }}>
                <LocationOn fontSize="small" />
                <Typography variant="subtitle1">
                  {project.location?.address}, {project.location?.city}
                </Typography>
              </Stack>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Phone />}
                onClick={() => {
                  const dev = project.developers?.[0];
                  openModal('developer',
                    dev ? { id: dev._id, name: dev.name, email: dev.email, phone: dev.phone, avatar: dev.logo?.url, role: 'Developer' } : { id: 'sales', name: 'Sales Team', role: 'Sales' },
                    null,
                    { id: project._id, name: project.name, developer: dev?.name }
                  );
                }}
                sx={{
                  bgcolor: 'white',
                  color: 'black',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                  px: 3,
                  py: 1.5,
                  fontWeight: 600
                }}
              >
                Contact Builder
              </Button>
              <Button
                variant="outlined"
                startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                onClick={handleFavoriteToggle}
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                  px: 3,
                  py: 1.5
                }}
              >
                {isFavorite ? 'Saved' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Navigation Tabs (Sticky) */}
      <Box sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Container maxWidth="xl">
          <Stack direction="row" spacing={4} sx={{ overflowX: 'auto', py: 2 }}>
            {['Overview', 'Configurations', 'Amenities', 'Location', 'Developer'].map((tab, index) => (
              <Typography
                key={tab}
                variant="subtitle2"
                fontWeight={600}
                onClick={() => {
                  setActiveTab(index);
                  document.getElementById(tab.toLowerCase())?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                sx={{
                  cursor: 'pointer',
                  color: activeTab === index ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  borderBottom: activeTab === index ? '2px solid var(--color-primary)' : '2px solid transparent',
                  pb: 0.5,
                  whiteSpace: 'nowrap'
                }}
              >
                {tab}
              </Typography>
            ))}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>

            {/* Overview Section */}
            <Box id="overview" sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>About {project.name}</Typography>
              <Typography variant="body1" color="text.secondary" paragraph sx={{ lineHeight: 1.8 }}>
                {project.description}
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: 'var(--color-surface-variant)', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">Starting Price</Typography>
                    <Typography variant="h6" fontWeight={600} color="var(--color-primary)">{formatPrice(project.startingPrice)}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: 'var(--color-surface-variant)', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">Configuration</Typography>
                    <Typography variant="h6" fontWeight={600}>{project.configurations?.map((c: any) => c.type).join(', ') || 'N/A'}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: 'var(--color-surface-variant)', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">Possession Date</Typography>
                    <Typography variant="h6" fontWeight={600}>{formatDate(project.possessionDate)}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box sx={{ p: 2, bgcolor: 'var(--color-surface-variant)', borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">RERA ID</Typography>
                    <Typography variant="h6" fontWeight={600}>{project.reraNumber || 'N/A'}</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Configurations Section */}
            <Box id="configurations" sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Configurations & Pricing</Typography>

              {configurations.length > 0 ? (
                <Grid container spacing={3}>
                  {configurations.map((config: any, index: number) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', '&:hover': { borderColor: 'var(--color-primary)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' } }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                          <Typography variant="h6" fontWeight={700}>{config.type}</Typography>
                          <Chip label={config.isAvailable ? 'Available' : 'Sold Out'} color={config.isAvailable ? 'success' : 'default'} size="small" />
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2} sx={{ mb: 3, flexGrow: 1 }}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Carpet Area</Typography>
                            <Typography variant="body2" fontWeight={600}>{config.area} sq.ft</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Bedrooms</Typography>
                            <Typography variant="body2" fontWeight={600}>{config.bedrooms} BHK</Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">Bathrooms</Typography>
                            <Typography variant="body2" fontWeight={600}>{config.bathrooms}</Typography>
                          </Stack>
                        </Stack>

                        <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px dashed var(--color-border)' }}>
                          <Typography variant="caption" color="text.secondary">Price starts from</Typography>
                          <Typography variant="h5" fontWeight={700} color="var(--color-primary)">{formatPrice(config.price)}</Typography>
                          <Button
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 2 }}
                            onClick={() => {
                              const dev = project.developers?.[0];
                              openModal('developer',
                                dev ? { id: dev._id, name: dev.name, email: dev.email, phone: dev.phone, avatar: dev.logo?.url, role: 'Developer' } : { id: 'sales', name: 'Sales Team', role: 'Sales' },
                                null,
                                { id: project._id, name: project.name, developer: dev?.name }
                              );
                            }}
                          >
                            Request Price Breakup
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info" variant="outlined">No configuration details available at the moment.</Alert>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Amenities Section */}
            <Box id="amenities" sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Amenities</Typography>
              {amenities.length > 0 ? (
                <Grid container spacing={2}>
                  {amenities.map((amenity: any, index: number) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                      <Box sx={{
                        p: 2,
                        border: '1px solid var(--color-border)',
                        borderRadius: 2,
                        textAlign: 'center',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                        '&:hover': { bgcolor: 'var(--color-surface-variant)', borderColor: 'transparent' }
                      }}>
                        {/* You can add icon mapping logic here if accessible */}
                        <CheckCircle sx={{ color: 'var(--color-primary)', fontSize: 28 }} />
                        <Typography variant="body2" fontWeight={500}>{amenity.name}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info" variant="outlined">Amenities list coming soon.</Alert>
              )}
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Location Section */}
            <Box id="location" sx={{ mb: 6 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Location & Neighborhoods</Typography>
              <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden', borderRadius: 3, height: 400, bgcolor: '#f0f0f0' }}>
                {project.location?.coordinates ? (
                  <PropertyMap
                    latitude={project.location.coordinates.coordinates[1]}
                    longitude={project.location.coordinates.coordinates[0]}
                    address={project.location.address}
                  />
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Map location not available</Typography>
                  </Box>
                )}
              </Paper>
              <Box sx={{ mt: 3 }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                  <LocationOn color="action" />
                  <Typography variant="h6">{project.location?.address}</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {project.location?.city}, {project.location?.state} - {project.location?.pincode}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* Developer Section (Spotlight) */}
            <Box id="developer" sx={{ mb: 4 }}>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>About The Developer</Typography>

              {primaryDeveloper ? (
                <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} sm={3} sx={{ textAlign: 'center' }}>
                      <Avatar
                        src={primaryDeveloper.logo?.url}
                        alt={primaryDeveloper.name}
                        sx={{ width: 120, height: 120, mb: 2, mx: 'auto', border: '1px solid var(--color-border)' }}
                      >
                        {primaryDeveloper.name?.[0]}
                      </Avatar>
                      <Typography variant="h6" fontWeight={700}>{primaryDeveloper.name}</Typography>
                      {primaryDeveloper.website && (
                        <Button
                          component="a"
                          href={primaryDeveloper.website}
                          target="_blank"
                          size="small"
                          startIcon={<Language />}
                          sx={{ mt: 1 }}
                        >
                          Website
                        </Button>
                      )}
                    </Grid>

                    <Grid item xs={12} sm={9}>
                      <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Experience</Typography>
                          <Typography variant="h6">{primaryDeveloper.foundedYear ? `${new Date().getFullYear() - primaryDeveloper.foundedYear} Years` : 'N/A'}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Total Projects</Typography>
                          <Typography variant="h6">{(primaryDeveloper.completedProjects || 0) + (primaryDeveloper.ongoingProjects || 0)}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="caption" color="text.secondary">Ongoing</Typography>
                          <Typography variant="h6">{primaryDeveloper.ongoingProjects || 0}</Typography>
                        </Grid>
                      </Grid>

                      <Typography variant="body2" color="text.secondary" paragraph>
                        {primaryDeveloper.description || `One of the prominent developers in ${project.location?.city || 'the region'}, known for delivering quality residential and commercial projects.`}
                      </Typography>

                      <Button
                        variant="outlined"
                        onClick={() => router.push(`/developers/${primaryDeveloper._id}`)}
                      >
                        View Developer Profile
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              ) : (
                <Alert severity="info" variant="outlined">Developer information details not available.</Alert>
              )}
            </Box>

          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              {/* Pricing / Contact Card */}
              <Card sx={{ p: 3, borderRadius: 3, mb: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Starting Price</Typography>
                <Typography variant="h4" fontWeight={700} color="var(--color-primary)">{formatPrice(project.startingPrice)}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 3 }}>+ Govt. Charts & Taxes</Typography>

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<Phone />}
                    onClick={() => {
                      const dev = project.developers?.[0];
                      openModal('developer',
                        dev ? { id: dev._id, name: dev.name, email: dev.email, phone: dev.phone, avatar: dev.logo?.url, role: 'Developer' } : { id: 'sales', name: 'Sales Team', role: 'Sales' },
                        null,
                        { id: project._id, name: project.name, developer: dev?.name }
                      );
                    }}
                    sx={{ bgcolor: 'var(--color-primary)', color: 'white' }}
                  >
                    Request a Call Back
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    startIcon={<WhatsApp />}
                    href={`https://wa.me/919689772801?text=Hi, I am interested in ${project.name}`}
                    target="_blank"
                    sx={{ color: '#25D366', borderColor: '#25D366' }}
                  >
                    Chat on WhatsApp
                  </Button>
                </Stack>
              </Card>

              {/* Brochure Download */}
              {brochures.length > 0 && (
                <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                    <PictureAsPdf color="error" fontSize="large" />
                    <Box>
                      <Typography variant="subtitle1" fontWeight={600}>project Brochure</Typography>
                      <Typography variant="caption" color="text.secondary">Download official brochure</Typography>
                    </Box>
                  </Stack>
                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    endIcon={<Download />}
                    href={brochures[0].url}
                    target="_blank"
                    sx={{ bgcolor: 'var(--color-surface-variant)' }}
                  >
                    Download Now
                  </Button>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Image Gallery Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="xl"
        fullWidth
        PaperProps={{
          sx: { bgcolor: 'black', color: 'white', m: 0, height: '100%', maxHeight: '100%' }
        }}
      >
        <Box sx={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <IconButton
            sx={{ position: 'absolute', top: 16, right: 16, color: 'white' }}
            onClick={() => setImageDialogOpen(false)}
          >
            <Cancel />
          </IconButton>

          <CardMedia
            component="img"
            image={typeof images[currentImageIndex] === 'string' ? images[currentImageIndex] : images[currentImageIndex]?.url || ''}
            alt={project.name}
            sx={{ maxHeight: '90vh', maxWidth: '100%', objectFit: 'contain' }}
          />

          {images.length > 1 && (
            <Box sx={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 1 }}>
              {images.map((_, idx) => (
                <Box
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: idx === currentImageIndex ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                    borderRadius: '50%',
                    cursor: 'pointer'
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
      </Dialog>

      <ContactModal
        open={contactModalOpen}
        onClose={closeModal}
        contactType={contactType}
        contactInfo={contactInfo}
        propertyInfo={propertyInfo}
        projectInfo={projectInfo}
      />
    </Box>
  );
};

export default ProjectDetailsClient;

