'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/services/api';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Avatar,
  Link,
  Autocomplete,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  MoreVert,
  Edit,
  Delete,
  Add,
  Business,
  LocationOn,
  CalendarToday,
  Close,
  Save,
  Visibility,
  Home,
  Construction,
  CheckCircle,
  PauseCircle,
  Cancel,
  Sync,
  Publish,
  Unpublished as UnpublishedIcon
} from '@mui/icons-material';
import http from '@/lib/services/http';

interface Project {
  _id: string;
  developers?: Array<{
    _id: string;
    name: string;
    logo?: {
      url: string;
    };
    website?: string;
    userId?: string;
  }>;
  name: string;
  description: string;
  shortDescription?: string;
  type: string;
  status: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  totalUnits?: number;
  totalArea?: number;
  launchDate?: string;
  possessionDate?: string;
  constructionStartDate?: string;
  estimatedCompletionDate?: string;
  startingPrice?: number;
  pricePerSqFt?: number;
  priceRange?: {
    min?: number;
    max?: number;
  };
  unitTypes?: Array<{
    type: string;
    count: number;
    area: number;
    priceRange: {
      min: number;
      max: number;
    };
  }>;
  amenities?: Array<{ name: string; description?: string }> | string[];
  features?: Array<{ name: string; description?: string }> | string[];
  keywords?: string[];
  reraNumber?: string;
  metaDescription?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  isPublished?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Developer {
  _id: string;
  name: string;
}

const ProjectsTable = () => {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const projectTypes = [
    'Residential',
    'Commercial',
    'Mixed-Use',
    'Industrial',
    'Hospitality',
    'Retail',
    'Office',
    'Other'
  ];

  const projectStatuses = [
    'Planning',
    'Under Construction',
    'Completed',
    'On Hold',
    'Cancelled'
  ];

  const commonAmenities = [
    'Swimming Pool',
    'Gymnasium',
    'Parking',
    'Security',
    'Garden',
    'Clubhouse',
    'Playground',
    'Power Backup',
    'Water Supply',
    'Elevator',
    'Balcony',
    'Terrace'
  ];

  const commonFeatures = [
    'Green Building',
    'Smart Home',
    'Solar Power',
    'Rainwater Harvesting',
    'Waste Management',
    'Fire Safety',
    'Earthquake Resistant',
    'Vastu Compliant',
    'Premium Finishes',
    'Modern Architecture'
  ];

  useEffect(() => {
    fetchProjects();
    fetchDevelopers();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await http.get('/api/v1/admin/projects');
      setProjects(response.data.data);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchDevelopers = async () => {
    try {
      const response = await http.get('/api/v1/admin/developers/profiles');
      setDevelopers(response.data.data);
    } catch (err: any) {
      console.error('Failed to fetch developers:', err);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, project: Project) => {
    setAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProject(null);
  };

  const handleSync = async () => {
    try {
      setSyncing(true);
      const response = await http.post('/api/v1/admin/projects/sync');
      if (response.data.success) {
        alert(response.data.message || 'Sync completed successfully');
        fetchProjects();
      }
    } catch (err: any) {
      console.error('Sync failed:', err);
      setError(err.response?.data?.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleEditClick = () => {
    if (selectedProject) {
      router.push(`/admin/projects/edit/${selectedProject._id}`);
    }
    handleMenuClose();
  };

  const handleViewClick = () => {
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handlePublishToggle = async () => {
    if (selectedProject) {
      try {
        const newStatus = !selectedProject.isPublished;
        await http.put(`/api/v1/admin/projects/${selectedProject._id}`, {
          isPublished: newStatus
        });
        await fetchProjects();
        // Show success message or toast
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update publish status');
      }
    }
    handleMenuClose();
  };

  const handleDeleteClick = async () => {
    if (selectedProject && window.confirm('Are you sure you want to delete this project?')) {
      try {
        await http.delete(`/api/v1/admin/projects/${selectedProject._id}`);
        await fetchProjects();
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete project');
      }
    }
    handleMenuClose();
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle color="success" />;
      case 'Under Construction':
        return <Construction color="warning" />;
      case 'On Hold':
        return <PauseCircle color="warning" />;
      case 'Cancelled':
        return <Cancel color="error" />;
      default:
        return <CalendarToday color="info" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'success';
      case 'Under Construction':
        return 'warning';
      case 'On Hold':
        return 'warning';
      case 'Cancelled':
        return 'error';
      default:
        return 'info';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Projects Management
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={syncing ? <CircularProgress size={20} /> : <Sync />}
            onClick={handleSync}
            disabled={syncing}
          >
            {syncing ? 'Syncing...' : 'Sync Sheet'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => router.push('/admin/projects/add')}
          >
            Add Project
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Developer</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Units</TableCell>
              <TableCell>Visibility</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project._id}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Home sx={{ mr: 2, color: 'primary.main' }} />
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {project.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                        {project.shortDescription || project.description}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    {(project.developers || []).slice(0, 2).map((developer: any, index: number) => (
                      <Box key={developer._id || index} display="flex" alignItems="center" sx={{ mb: index < Math.min((project.developers || []).length, 2) - 1 ? 1 : 0 }}>
                        <Avatar
                          src={typeof developer?.logo === 'string' ? developer.logo : developer?.logo?.url}
                          sx={{ mr: 1, width: 32, height: 32 }}
                        >
                          <Business />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {typeof developer === 'string' ? developer : developer?.name || 'Unknown'}
                          </Typography>
                          {developer?.website && (
                            <Link href={developer.website} target="_blank" variant="caption">
                              Website
                            </Link>
                          )}
                        </Box>
                      </Box>
                    ))}
                    {(project.developers || []).length > 2 && (
                      <Typography variant="caption" color="text.secondary">
                        +{(project.developers || []).length - 2} more
                      </Typography>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={project.type}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    {getStatusIcon(project.status)}
                    <Chip
                      label={project.status}
                      color={getStatusColor(project.status) as any}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                    <Typography variant="body2">
                      {project.location.city}, {project.location.state}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {project.totalUnits || 'N/A'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={project.isPublished ? 'Published' : 'Draft'}
                    color={project.isPublished ? 'success' : 'default'}
                    size="small"
                    variant={project.isPublished ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(project.createdAt)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, project)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewClick}>
          <Visibility sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditClick}>
          <Edit sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handlePublishToggle}>
          {selectedProject?.isPublished ? (
            <>
              <UnpublishedIcon sx={{ mr: 1 }} />
              Unpublish
            </>
          ) : (
            <>
              <Publish sx={{ mr: 1 }} />
              Publish
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create and Edit dialogs removed - now using dedicated pages at /admin/projects/add and /admin/projects/edit/[id] */}

      {/* View Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Project Details</DialogTitle>
        <DialogContent>
          {selectedProject && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader
                    title={selectedProject.name}
                    subheader={`${selectedProject.type} Project`}
                  />
                  <CardContent>
                    <Typography variant="body1" paragraph>
                      {selectedProject.description}
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                        <Box display="flex" alignItems="center">
                          {getStatusIcon(selectedProject.status)}
                          <Chip
                            label={selectedProject.status}
                            color={getStatusColor(selectedProject.status) as any}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {(selectedProject.developers || []).length > 1 ? 'Developers' : 'Developer'}
                        </Typography>
                        <Box>
                          {(selectedProject.developers || []).map((developer: any, index: number) => (
                            <Box key={developer._id || index} display="flex" alignItems="center" sx={{ mb: index < (selectedProject.developers || []).length - 1 ? 1 : 0 }}>
                              <Avatar
                                src={typeof developer?.logo === 'string' ? developer.logo : developer?.logo?.url}
                                sx={{ mr: 1, width: 24, height: 24 }}
                              >
                                <Business />
                              </Avatar>
                              <Typography variant="body1">{typeof developer === 'string' ? developer : developer?.name || 'Unknown'}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Location" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                        <Typography variant="body1">{selectedProject.location.address}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">City, State</Typography>
                        <Typography variant="body1">
                          {selectedProject.location.city}, {selectedProject.location.state}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Pincode</Typography>
                        <Typography variant="body1">{selectedProject.location.pincode}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card>
                  <CardHeader title="Project Details" />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Total Units</Typography>
                        <Typography variant="body1">{selectedProject.totalUnits || 'N/A'}</Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" color="text.secondary">Total Area</Typography>
                        <Typography variant="body1">
                          {selectedProject.totalArea ? `${selectedProject.totalArea} sq ft` : 'N/A'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Created</Typography>
                        <Typography variant="body1">{formatDate(selectedProject.createdAt)}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                        <Typography variant="body1">{formatDate(selectedProject.updatedAt)}</Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {selectedProject.amenities && selectedProject.amenities.length > 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Amenities" />
                    <CardContent>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {selectedProject.amenities.map((amenity, index) => (
                          <Chip key={index} label={amenity} size="small" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {selectedProject.features && selectedProject.features.length > 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardHeader title="Features" />
                    <CardContent>
                      <Box display="flex" flexWrap="wrap" gap={1}>
                        {selectedProject.features.map((feature, index) => (
                          <Chip key={index} label={feature} size="small" color="primary" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectsTable;
