'use client';
import { useState, useEffect } from 'react';
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
  Cancel
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    developers: [] as string[],
    name: '',
    description: '',
    shortDescription: '',
    type: '',
    status: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    totalUnits: '',
    totalArea: '',
    launchDate: '',
    possessionDate: '',
    constructionStartDate: '',
    estimatedCompletionDate: '',
    startingPrice: '',
    pricePerSqFt: '',
    priceRange: {
      min: '',
      max: ''
    },
    amenities: [] as string[],
    features: [] as string[],
    keywords: [] as string[],
    reraNumber: '',
    metaDescription: '',
    isActive: true,
    isFeatured: false,
    isPublished: false
  });
  const [createFormData, setCreateFormData] = useState({
    developers: [] as string[],
    name: '',
    description: '',
    type: '',
    status: '',
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    totalUnits: '',
    totalArea: '',
    amenities: [] as string[],
    features: [] as string[]
  });

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

  const handleEditClick = () => {
    if (selectedProject) {
      setEditFormData({
        developers: (selectedProject.developers || []).map((dev: any) => 
          typeof dev === 'string' ? dev : dev._id || dev
        ),
        name: selectedProject.name,
        description: selectedProject.description,
        type: selectedProject.type,
        status: selectedProject.status,
        shortDescription: selectedProject.shortDescription || '',
        location: {
          address: selectedProject.location.address,
          city: selectedProject.location.city,
          state: selectedProject.location.state,
          pincode: selectedProject.location.pincode,
          country: selectedProject.location.country || 'India'
        },
        totalUnits: selectedProject.totalUnits?.toString() || '',
        totalArea: selectedProject.totalArea?.toString() || '',
        launchDate: selectedProject.launchDate ? new Date(selectedProject.launchDate).toISOString().split('T')[0] : '',
        possessionDate: selectedProject.possessionDate ? new Date(selectedProject.possessionDate).toISOString().split('T')[0] : '',
        constructionStartDate: selectedProject.constructionStartDate ? new Date(selectedProject.constructionStartDate).toISOString().split('T')[0] : '',
        estimatedCompletionDate: selectedProject.estimatedCompletionDate ? new Date(selectedProject.estimatedCompletionDate).toISOString().split('T')[0] : '',
        startingPrice: selectedProject.startingPrice?.toString() || '',
        pricePerSqFt: selectedProject.pricePerSqFt?.toString() || '',
        priceRange: {
          min: selectedProject.priceRange?.min?.toString() || '',
          max: selectedProject.priceRange?.max?.toString() || ''
        },
        amenities: (selectedProject.amenities || []).map((a: any) => a.name || a),
        features: (selectedProject.features || []).map((f: any) => f.name || f),
        keywords: selectedProject.keywords || [],
        reraNumber: selectedProject.reraNumber || '',
        metaDescription: selectedProject.metaDescription || '',
        isActive: selectedProject.isActive !== undefined ? selectedProject.isActive : true,
        isFeatured: selectedProject.isFeatured || false,
        isPublished: selectedProject.isPublished || false
      });
      setEditDialogOpen(true);
    }
    handleMenuClose();
  };

  const handleViewClick = () => {
    setViewDialogOpen(true);
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

  const handleEditSubmit = async () => {
    if (!selectedProject) return;

    try {
      const submitData = {
        ...editFormData,
        totalUnits: editFormData.totalUnits ? parseInt(editFormData.totalUnits) : undefined,
        totalArea: editFormData.totalArea ? parseInt(editFormData.totalArea) : undefined,
        startingPrice: editFormData.startingPrice ? parseFloat(editFormData.startingPrice) : undefined,
        pricePerSqFt: editFormData.pricePerSqFt ? parseFloat(editFormData.pricePerSqFt) : undefined,
        priceRange: {
          min: editFormData.priceRange.min ? parseFloat(editFormData.priceRange.min) : undefined,
          max: editFormData.priceRange.max ? parseFloat(editFormData.priceRange.max) : undefined
        },
        launchDate: editFormData.launchDate || undefined,
        possessionDate: editFormData.possessionDate || undefined,
        constructionStartDate: editFormData.constructionStartDate || undefined,
        estimatedCompletionDate: editFormData.estimatedCompletionDate || undefined,
        amenities: editFormData.amenities.map((a: string) => ({ name: a, description: '' })),
        features: editFormData.features.map((f: string) => ({ name: f, description: '' }))
      };
      await http.put(`/api/v1/admin/projects/${selectedProject._id}`, submitData);
      await fetchProjects();
      setEditDialogOpen(false);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update project');
    }
  };

  const handleCreateSubmit = async () => {
    try {
      const submitData = {
        ...createFormData,
        totalUnits: createFormData.totalUnits ? parseInt(createFormData.totalUnits) : undefined,
        totalArea: createFormData.totalArea ? parseInt(createFormData.totalArea) : undefined
      };
      await http.post('/api/v1/admin/projects', submitData);
      await fetchProjects();
      setCreateDialogOpen(false);
      setCreateFormData({
        developers: [],
        name: '',
        description: '',
        type: '',
        status: '',
        location: {
          address: '',
          city: '',
          state: '',
          pincode: ''
        },
        totalUnits: '',
        totalArea: '',
        amenities: [],
        features: []
      });
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
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
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Project
        </Button>
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
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create Project</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={developers || []}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name || ''}
                value={createFormData.developers.map(id => developers.find(d => d._id === id)).filter(Boolean)}
                onChange={(_, newValue) => {
                  const developerIds = newValue.map(dev => typeof dev === 'string' ? dev : dev._id);
                  setCreateFormData({ ...createFormData, developers: developerIds });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Developers *"
                    placeholder="Select developers..."
                    required
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={typeof option === 'string' ? option : option._id}>
                    {typeof option === 'string' ? option : option.name}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={createFormData.name}
                onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={createFormData.description}
                onChange={(e) => setCreateFormData({ ...createFormData, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={createFormData.type}
                  onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value })}
                >
                  {projectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={createFormData.status}
                  onChange={(e) => setCreateFormData({ ...createFormData, status: e.target.value })}
                >
                  {projectStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Location</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={createFormData.location.address}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  location: { ...createFormData.location, address: e.target.value }
                })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={createFormData.location.city}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  location: { ...createFormData.location, city: e.target.value }
                })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={createFormData.location.state}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  location: { ...createFormData.location, state: e.target.value }
                })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={createFormData.location.pincode}
                onChange={(e) => setCreateFormData({
                  ...createFormData,
                  location: { ...createFormData.location, pincode: e.target.value }
                })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Project Details</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Units"
                type="number"
                value={createFormData.totalUnits}
                onChange={(e) => setCreateFormData({ ...createFormData, totalUnits: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Area (sq ft)"
                type="number"
                value={createFormData.totalArea}
                onChange={(e) => setCreateFormData({ ...createFormData, totalArea: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={commonAmenities}
                value={createFormData.amenities}
                onChange={(event, newValue) => {
                  setCreateFormData({ ...createFormData, amenities: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Amenities"
                    placeholder="Select amenities"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={commonFeatures}
                value={createFormData.features}
                onChange={(event, newValue) => {
                  setCreateFormData({ ...createFormData, features: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Features"
                    placeholder="Select features"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateSubmit} variant="contained" startIcon={<Save />}>
            Create Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={developers || []}
                getOptionLabel={(option) => typeof option === 'string' ? option : option.name || ''}
                value={editFormData.developers.map(id => developers.find(d => d._id === id)).filter(Boolean)}
                onChange={(_, newValue) => {
                  const developerIds = newValue.map(dev => typeof dev === 'string' ? dev : dev._id);
                  setEditFormData({ ...editFormData, developers: developerIds });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Developers *"
                    placeholder="Select developers..."
                    required
                  />
                )}
                renderOption={(props, option) => (
                  <Box component="li" {...props} key={typeof option === 'string' ? option : option._id}>
                    {typeof option === 'string' ? option : option.name}
                  </Box>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Project Name"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Short Description"
                multiline
                rows={2}
                value={editFormData.shortDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setEditFormData({ ...editFormData, shortDescription: value });
                  }
                }}
                inputProps={{ maxLength: 500 }}
                helperText={`${editFormData.shortDescription.length}/500 characters`}
                placeholder="Brief summary for project cards..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={4}
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select
                  value={editFormData.type}
                  onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                >
                  {projectTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editFormData.status}
                  onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                >
                  {projectStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Location</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                value={editFormData.location.address}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  location: { ...editFormData.location, address: e.target.value }
                })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={editFormData.location.city}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  location: { ...editFormData.location, city: e.target.value }
                })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={editFormData.location.state}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  location: { ...editFormData.location, state: e.target.value }
                })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={editFormData.location.pincode}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  location: { ...editFormData.location, pincode: e.target.value }
                })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Project Details</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Units"
                type="number"
                value={editFormData.totalUnits}
                onChange={(e) => setEditFormData({ ...editFormData, totalUnits: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Total Area (sq ft)"
                type="number"
                value={editFormData.totalArea}
                onChange={(e) => setEditFormData({ ...editFormData, totalArea: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Timeline & Dates</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Launch Date"
                type="date"
                value={editFormData.launchDate}
                onChange={(e) => setEditFormData({ ...editFormData, launchDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Possession Date"
                type="date"
                value={editFormData.possessionDate}
                onChange={(e) => setEditFormData({ ...editFormData, possessionDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Construction Start Date"
                type="date"
                value={editFormData.constructionStartDate}
                onChange={(e) => setEditFormData({ ...editFormData, constructionStartDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Estimated Completion Date"
                type="date"
                value={editFormData.estimatedCompletionDate}
                onChange={(e) => setEditFormData({ ...editFormData, estimatedCompletionDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Pricing</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Starting Price (₹)"
                type="number"
                value={editFormData.startingPrice}
                onChange={(e) => setEditFormData({ ...editFormData, startingPrice: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price per Sq Ft (₹)"
                type="number"
                value={editFormData.pricePerSqFt}
                onChange={(e) => setEditFormData({ ...editFormData, pricePerSqFt: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price Range - Min (₹)"
                type="number"
                value={editFormData.priceRange.min}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  priceRange: { ...editFormData.priceRange, min: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price Range - Max (₹)"
                type="number"
                value={editFormData.priceRange.max}
                onChange={(e) => setEditFormData({
                  ...editFormData,
                  priceRange: { ...editFormData.priceRange, max: e.target.value }
                })}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Amenities & Features</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={commonAmenities}
                value={editFormData.amenities}
                onChange={(event, newValue) => {
                  setEditFormData({ ...editFormData, amenities: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Amenities"
                    placeholder="Select amenities"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={commonFeatures}
                value={editFormData.features}
                onChange={(event, newValue) => {
                  setEditFormData({ ...editFormData, features: newValue });
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Features"
                    placeholder="Select features"
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Legal & SEO</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="RERA Number"
                value={editFormData.reraNumber}
                onChange={(e) => setEditFormData({ ...editFormData, reraNumber: e.target.value })}
                placeholder="Enter RERA registration number"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Meta Description (for SEO)"
                multiline
                rows={3}
                value={editFormData.metaDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 160) {
                    setEditFormData({ ...editFormData, metaDescription: value });
                  }
                }}
                inputProps={{ maxLength: 160 }}
                helperText={`${editFormData.metaDescription.length}/160 characters`}
                placeholder="Brief description for search engines..."
              />
            </Grid>
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }}>
                <Typography variant="subtitle2">Project Status & Visibility</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editFormData.isActive}
                    onChange={(e) => setEditFormData({ ...editFormData, isActive: e.target.checked })}
                  />
                }
                label="Active Project"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editFormData.isFeatured}
                    onChange={(e) => setEditFormData({ ...editFormData, isFeatured: e.target.checked })}
                  />
                }
                label="Featured Project"
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editFormData.isPublished}
                    onChange={(e) => setEditFormData({ ...editFormData, isPublished: e.target.checked })}
                  />
                }
                label="Published"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" startIcon={<Save />}>
            Update Project
          </Button>
        </DialogActions>
      </Dialog>

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
