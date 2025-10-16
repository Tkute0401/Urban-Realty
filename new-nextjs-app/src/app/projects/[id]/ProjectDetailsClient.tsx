'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjects } from '../../../contexts/ProjectsContext';
import { useAuth } from '../../../contexts/AuthContext';
import PropertyMap from '../../../components/property/PropertyMap';
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
  AttachMoney,
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

interface ProjectDetailsClientProps {
  projectId: string;
}

const ProjectDetailsClient: React.FC<ProjectDetailsClientProps> = ({ projectId }) => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const { getProject, deleteProject, loading, error } = useProjects();
  
  const [project, setProject] = useState<any>(null);
  const [loadingProject, setLoadingProject] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoadingProject(true);
        const projectData = await getProject(projectId);
        setProject(projectData);
      } catch (err) {
        console.error('Error fetching project:', err);
      } finally {
        setLoadingProject(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId, getProject]);

  const handleDeleteProject = async () => {
    try {
      await deleteProject(projectId);
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
      // You could add a toast notification here
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

      {/* Hero Section */}
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
          {/* Main Content */}
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

            {/* Project Details */}
            <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 3, color: 'var(--color-text-primary)' }}>
                  Project Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <LocationOn color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Location"
                          secondary={`${project.location?.address || ''}, ${project.location?.city || ''}, ${project.location?.state || ''} ${project.location?.pincode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '')}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Business color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Developer"
                          secondary={project.developer?.name}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <Home color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Total Units"
                          secondary={project.totalUnits || 'TBD'}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <List dense>
                      <ListItem>
                        <ListItemIcon>
                          <AttachMoney color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Starting Price"
                          secondary={project.startingPrice ? formatPrice(project.startingPrice) : 'TBD'}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarToday color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Launch Date"
                          secondary={formatDate(project.launchDate)}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemIcon>
                          <CalendarToday color="primary" />
                        </ListItemIcon>
                        <ListItemText
                          primary="Possession Date"
                          secondary={formatDate(project.possessionDate)}
                        />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Project Configurations */}
            {project.configurations && project.configurations.length > 0 && (
              <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: 'var(--color-text-primary)' }}>
                    Available Configurations
                  </Typography>
                  <Grid container spacing={3}>
                    {project.configurations.map((config: any, index: number) => (
                      <Grid item xs={12} md={6} key={index}>
                        <Card sx={{ 
                          border: '1px solid var(--color-border)', 
                          '&:hover': { 
                            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)',
                            transition: 'all 0.3s ease'
                          }
                        }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" sx={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                                {config.name}
                              </Typography>
                              <Chip 
                                label={config.isAvailable ? 'Available' : 'Sold Out'} 
                                color={config.isAvailable ? 'success' : 'default'}
                                size="small"
                              />
                            </Box>
                            
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                  Unit Type
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                  {config.type}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                  Area
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                  {config.area} sq ft
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                  Bedrooms
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                  {config.bedrooms}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                                  Bathrooms
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                  {config.bathrooms}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="h6" sx={{ color: 'var(--color-primary)', fontWeight: 700 }}>
                                ₹{config.price.toLocaleString()}
                              </Typography>
                              {config.pricePerSqFt && (
                                <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
                                  ₹{config.pricePerSqFt}/sq ft
                                </Typography>
                              )}
                            </Box>

                            {config.unitsAvailable && (
                              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mb: 1 }}>
                                {config.unitsAvailable} units available
                              </Typography>
                            )}

                            {config.description && (
                              <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', mt: 1 }}>
                                {config.description}
                              </Typography>
                            )}

                            {config.floorPlan && config.floorPlan.url && (
                              <Button
                                variant="outlined"
                                size="small"
                                startIcon={<PictureAsPdf />}
                                sx={{ 
                                  mt: 2,
                                  borderColor: 'var(--color-primary)',
                                  color: 'var(--color-primary)',
                                  '&:hover': {
                                    borderColor: 'var(--color-primary)',
                                    backgroundColor: 'var(--color-primary)',
                                    color: 'white'
                                  }
                                }}
                                onClick={() => window.open(config.floorPlan.url, '_blank')}
                              >
                                View Floor Plan
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Gallery */}
            {images.length > 1 && (
              <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: 'var(--color-text-primary)' }}>
                    Project Gallery
                  </Typography>
                  <Grid container spacing={2}>
                    {images.map((image: any, index: number) => (
                      <Grid item xs={6} sm={4} md={3} key={index}>
                        <CardMedia
                          component="img"
                          image={typeof image === 'string' ? image : image?.url || ''}
                          alt={`${project.name} - Image ${index + 1}`}
                          sx={{
                            height: 120,
                            cursor: 'pointer',
                            borderRadius: 1,
                            '&:hover': {
                              opacity: 0.8,
                              transition: 'opacity 0.3s ease'
                            }
                          }}
                          onClick={() => {
                            setCurrentImageIndex(index);
                            setImageDialogOpen(true);
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Brochures */}
            {brochures.length > 0 && (
              <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: 'var(--color-text-primary)' }}>
                    Project Brochures
                  </Typography>
                  <Grid container spacing={2}>
                    {brochures.map((brochure: any, index: number) => (
                      <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'var(--color-primary-light)',
                              transition: 'background-color 0.3s ease'
                            }
                          }}
                          onClick={() => window.open(brochure.url, '_blank')}
                        >
                          <PictureAsPdf sx={{ color: 'var(--color-danger)', mr: 2, fontSize: 32 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              {brochure.name}
                            </Typography>
                            <Typography variant="body2" color="var(--color-text-muted)">
                              PDF Document
                            </Typography>
                          </Box>
                          <Download sx={{ color: 'var(--color-primary)' }} />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Virtual Tours */}
            {virtualTours.length > 0 && (
              <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" sx={{ mb: 3, color: 'var(--color-text-primary)' }}>
                    Virtual Tours
                  </Typography>
                  <Grid container spacing={2}>
                    {virtualTours.map((tour: any, index: number) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Card
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            cursor: 'pointer',
                            '&:hover': {
                              backgroundColor: 'var(--color-primary-light)',
                              transition: 'background-color 0.3s ease'
                            }
                          }}
                          onClick={() => window.open(tour.url, '_blank')}
                        >
                          <VideoLibrary sx={{ color: 'var(--color-primary)', mr: 2, fontSize: 32 }} />
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="body1" sx={{ fontWeight: 500 }}>
                              Virtual Tour {index + 1}
                            </Typography>
                            <Typography variant="body2" color="var(--color-text-muted)">
                              Video Tour
                            </Typography>
                          </Box>
                          <Download sx={{ color: 'var(--color-primary)' }} />
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Action Buttons */}
            <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Phone />}
                    sx={{
                      bgcolor: 'var(--color-primary)',
                      color: 'var(--color-primary-contrast)',
                      '&:hover': {
                        bgcolor: 'var(--color-primary-hover)'
                      }
                    }}
                  >
                    Contact Developer
                  </Button>
                  
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
                  </Stack>

                  <Button
                    variant="outlined"
                    startIcon={isFavorite ? <Favorite /> : <FavoriteBorder />}
                    onClick={() => setIsFavorite(!isFavorite)}
                    sx={{
                      color: isFavorite ? 'var(--color-danger)' : 'var(--color-primary)',
                      borderColor: isFavorite ? 'var(--color-danger)' : 'var(--color-primary)'
                    }}
                  >
                    {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                  </Button>

                  {user?.role === 'developer' && user?.id === project.developer?.userId && (
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

            {/* Developer Info */}
            <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                  Developer Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar
                    src={typeof project.developer?.logo === 'string' ? project.developer.logo : project.developer?.logo?.url}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  >
                    <Business />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ color: 'var(--color-text-primary)' }}>
                      {project.developer?.name}
                    </Typography>
                    <Typography variant="body2" color="var(--color-text-muted)">
                      Developer
                    </Typography>
                  </Box>
                </Box>
                
                {project.developer?.description && (
                  <Typography variant="body2" sx={{ color: 'var(--color-text-primary)', mb: 2 }}>
                    {project.developer.description}
                  </Typography>
                )}

                <Stack spacing={1}>
                  {project.developer?.website && (
                    <Button
                      variant="outlined"
                      startIcon={<Language />}
                      onClick={() => window.open(project.developer.website, '_blank')}
                      size="small"
                      fullWidth
                    >
                      Visit Website
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    startIcon={<Phone />}
                    size="small"
                    fullWidth
                  >
                    Contact Developer
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* Location Map */}
            {project.location?.coordinates && project.location.coordinates.coordinates?.length === 2 && (
              <Card sx={{ mb: 3, backgroundColor: 'var(--color-surface)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                    Project Location
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <PropertyMap
                      latitude={project.location.coordinates.coordinates[1]}
                      longitude={project.location.coordinates.coordinates[0]}
                      address={`${project.location.address}, ${project.location.city}, ${project.location.state}`}
                      height="300px"
                    />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
                    <LocationOn sx={{ color: 'var(--color-primary)', mr: 1, mt: 0.5 }} />
                    <Typography variant="body2" sx={{ color: 'var(--color-text-primary)' }}>
                      {`${project.location?.address || ''}, ${project.location?.city || ''}, ${project.location?.state || ''} - ${project.location?.pincode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Project Stats */}
            <Card sx={{ backgroundColor: 'var(--color-surface)' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                  Project Statistics
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <Visibility color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Views"
                      secondary={project.views || 0}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <Home color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Area"
                      secondary={project.totalArea ? `${project.totalArea.toLocaleString()} sq ft` : 'TBD'}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AttachMoney color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Price per Sq Ft"
                      secondary={project.pricePerSqFt ? `₹${project.pricePerSqFt.toLocaleString()}` : 'TBD'}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Image Dialog */}
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

      {/* Delete Confirmation Dialog */}
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

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            zIndex: 1000
          }}
          onClick={() => router.push('/projects')}
        >
          <ArrowBack />
        </Fab>
      )}
    </Box>
  );
};

export default ProjectDetailsClient;
