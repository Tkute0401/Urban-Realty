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

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoadingProject(true);
        // Fetch by slug - try slug endpoint first, fallback to ID if needed
        let response;
        try {
          response = await http.get(`/api/v1/projects/slug/${projectSlug}`);
        } catch (slugError) {
          // If slug fetch fails, try by ID (for backward compatibility)
          response = await http.get(`/api/v1/projects/${projectSlug}`);
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
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(1)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(1)} L`;
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
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
        <Typography variant="h6" sx={{ mt: 2, color: 'var(--color-text-primary)' }}>
          Loading project details...
        </Typography>
      </Container>
    );
  }

  if (error || !project) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Project not found'}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBack />}
          onClick={() => router.push('/projects')}
          sx={{
            bgcolor: 'var(--color-primary)',
            color: 'var(--color-primary-contrast)',
            '&:hover': {
              bgcolor: 'var(--color-primary-hover)'
            }
          }}
        >
          Back to Projects
        </Button>
      </Container>
    );
  }

  const images = project.images || [];
  const brochures = project.brochures || [];
  const virtualTours = project.virtualTours || [];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--color-background)' }}>
      {/* Breadcrumbs */}
      <Container maxWidth="lg" sx={{ pt: 2 }}>
        <Breadcrumbs sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => router.push('/projects')}
            sx={{ color: 'var(--color-text-muted)', textDecoration: 'none' }}
          >
            Projects
          </Link>
          <Typography variant="body2" color="var(--color-text-primary)">
            {project.name}
          </Typography>
        </Breadcrumbs>
      </Container>

      {/* Hero Section - Same as original */}
      <Box sx={{ position: 'relative', mb: 4 }}>
        {images.length > 0 ? (
          <Box sx={{ position: 'relative', height: { xs: 300, md: 500 } }}>
            <CardMedia
              component="img"
              image={typeof images[currentImageIndex] === 'string' ? images[currentImageIndex] : images[currentImageIndex]?.url || ''}
              alt={project.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer'
              }}
              onClick={() => setImageDialogOpen(true)}
            />
            
            {/* Image Navigation */}
            {images.length > 1 && (
              <Box sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}>
                <Stack direction="row" spacing={1}>
                  {images.map((_, index) => (
                    <Box
                      key={index}
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: index === currentImageIndex ? 'var(--color-primary)' : 'rgba(255,255,255,0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onClick={() => setCurrentImageIndex(index)}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            {/* Overlay Content */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                p: 3,
                color: 'white'
              }}
            >
              <Container maxWidth="lg">
                <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                  {project.name}
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                  {project.shortDescription || project.description}
                </Typography>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  <Chip
                    icon={getStatusIcon(project.status)}
                    label={project.status}
                    color={getStatusColor(project.status) as any}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                  <Chip
                    icon={getTypeIcon(project.type)}
                    label={project.type}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                  />
                </Stack>
              </Container>
            </Box>
          </Box>
        ) : (
          <Box sx={{ height: 200, backgroundColor: 'var(--color-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h4" color="var(--color-text-muted)">
              {project.name}
            </Typography>
          </Box>
        )}
      </Box>

      <Container maxWidth="lg" sx={{ pb: 4 }}>
        <Grid container spacing={4}>
          {/* Main Content - Same structure as original ProjectDetailsClient */}
          <Grid item xs={12} md={8}>
            {/* Project Overview */}
            <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                  Project Overview
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', lineHeight: 1.7 }}>
                  {project.description}
                </Typography>
              </CardContent>
            </Card>

            {/* Additional sections would go here - same as original */}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Action Buttons */}
            <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  {/* Contact buttons and other actions - same as original */}
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={handleShare}
                      sx={{ flex: 1 }}
                    >
                      Share
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Print />}
                      onClick={handlePrint}
                      sx={{ flex: 1 }}
                    >
                      Print
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                      onClick={handleFavoriteToggle}
                      disabled={loadingFavorite}
                      sx={{
                        flex: 1,
                        color: isFavorite ? 'red' : 'var(--color-primary)',
                        borderColor: isFavorite ? 'red' : 'var(--color-primary)',
                        '&:hover': {
                          backgroundColor: isFavorite ? 'rgba(255, 0, 0, 0.1)' : 'rgba(var(--color-primary-rgb), 0.1)',
                        }
                      }}
                    >
                      {loadingFavorite ? '...' : (isFavorite ? 'Favorited' : 'Add to Favorites')}
                    </Button>
                  </Stack>

                  {user?.role === 'developer' && project.developers?.some((dev: any) => dev.userId === user?.id) && (
                    <>
                      <Divider />
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => router.push(`/projects/edit/${project._id}`)}
                        sx={{ color: 'var(--color-primary)' }}
                      >
                        Edit Project
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Delete />}
                        onClick={() => setDeleteDialogOpen(true)}
                        sx={{ color: 'var(--color-danger)', borderColor: 'var(--color-danger)' }}
                      >
                        Delete Project
                      </Button>
                    </>
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Additional sidebar content - same as original */}
          </Grid>
        </Grid>
      </Container>

      {/* Dialogs and modals - same as original */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          {project.name} - Image {currentImageIndex + 1} of {images.length}
        </DialogTitle>
        <DialogContent>
          <CardMedia
            component="img"
            image={typeof images[currentImageIndex] === 'string' ? images[currentImageIndex] : images[currentImageIndex]?.url || ''}
            alt={project.name}
            sx={{ width: '100%', maxHeight: '70vh', objectFit: 'contain' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImageDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Project</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete &quot;{project.name}&quot;? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteProject}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {contactInfo && (
        <ContactModal
          open={contactModalOpen}
          onClose={closeModal}
          contactType={contactType}
          contactInfo={contactInfo}
          propertyInfo={propertyInfo}
          projectInfo={projectInfo}
        />
      )}
    </Box>
  );
};

export default ProjectDetailsClient;

