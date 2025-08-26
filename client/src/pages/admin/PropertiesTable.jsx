import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Tooltip,
  Grid,
  Card,
  CardContent,
  InputAdornment,
  Pagination,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  CheckCircle as VerifiedIcon,
  Warning as PendingIcon
} from '@mui/icons-material';
import axios from '../../services/axios';

const PropertiesTable = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPrice, setFilterPrice] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [editingProperty, setEditingProperty] = useState({});

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/properties', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setProperties(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to load properties. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditProperty = async () => {
    try {
      await axios.put(`/admin/properties/${editingProperty._id}`, editingProperty, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchProperties();
      setEditDialogOpen(false);
      setEditingProperty({});
    } catch (err) {
      console.error('Error updating property:', err);
      setError('Failed to update property. Please try again.');
    }
  };

  const handleDeleteProperty = async () => {
    try {
      await axios.delete(`/admin/properties/${selectedProperty._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchProperties();
      setDeleteDialogOpen(false);
      setSelectedProperty(null);
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Failed to delete property. Please try again.');
    }
  };

  const handleStatusChange = async (propertyId, status) => {
    try {
      await axios.put(`/admin/properties/${propertyId}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchProperties();
    } catch (err) {
      console.error('Error updating property status:', err);
      setError('Failed to update property status. Please try again.');
    }
  };

  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || property.type === filterType;
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;
    const matchesPrice = filterPrice === 'all' || 
                        (filterPrice === 'low' && property.price < 500000) ||
                        (filterPrice === 'medium' && property.price >= 500000 && property.price < 1000000) ||
                        (filterPrice === 'high' && property.price >= 1000000);
    
    return matchesSearch && matchesType && matchesStatus && matchesPrice;
  });

  const indexOfLastProperty = currentPage * usersPerPage;
  const indexOfFirstProperty = indexOfLastProperty - usersPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);

  const getTypeColor = (type) => {
    switch (type) {
      case 'house': return 'primary';
      case 'apartment': return 'secondary';
      case 'condo': return 'success';
      case 'land': return 'warning';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'sold': return 'info';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const getPriceRange = (price) => {
    if (price < 500000) return 'low';
    if (price < 1000000) return 'medium';
    return 'high';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  label="Type"
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="house">House</MenuItem>
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="condo">Condo</MenuItem>
                  <MenuItem value="land">Land</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="sold">Sold</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Price Range</InputLabel>
                <Select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  label="Price Range"
                >
                  <MenuItem value="all">All Prices</MenuItem>
                  <MenuItem value="low">Under $500K</MenuItem>
                  <MenuItem value="medium">$500K - $1M</MenuItem>
                  <MenuItem value="high">Over $1M</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchProperties}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Property</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Agent</TableCell>
              <TableCell>Created</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentProperties.map((property) => (
              <TableRow key={property._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <HomeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{property.title || 'Untitled Property'}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {property.location || 'No location'}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={property.type} 
                    color={getTypeColor(property.type)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2">
                    ${property.price?.toLocaleString() || '0'}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {getPriceRange(property.price)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={property.status} 
                    color={getStatusColor(property.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {property.agent?.name || 'No Agent'}
                  </Typography>
                  <Chip 
                    label={property.agent?.verified ? 'Verified' : 'Pending'} 
                    color={property.agent?.verified ? 'success' : 'warning'}
                    size="small"
                    icon={property.agent?.verified ? <VerifiedIcon /> : <PendingIcon />}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setSelectedProperty(property);
                          setViewDialogOpen(true);
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Property">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setEditingProperty(property);
                          setEditDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete Property">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                          setSelectedProperty(property);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredProperties.length / usersPerPage)}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>

      {/* View Property Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Property Details</DialogTitle>
        <DialogContent>
          {selectedProperty && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Basic Information</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1">{selectedProperty.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {selectedProperty.description}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Type:</Typography>
                      <Chip label={selectedProperty.type} color={getTypeColor(selectedProperty.type)} />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Price:</Typography>
                      <Typography variant="subtitle2">${selectedProperty.price?.toLocaleString()}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Status:</Typography>
                      <Chip label={selectedProperty.status} color={getStatusColor(selectedProperty.status)} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Location & Details</Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        {selectedProperty.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Bedrooms:</Typography>
                      <Typography variant="body2">{selectedProperty.bedrooms || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Bathrooms:</Typography>
                      <Typography variant="body2">{selectedProperty.bathrooms || 'N/A'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Area:</Typography>
                      <Typography variant="body2">{selectedProperty.area || 'N/A'} sq ft</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setViewDialogOpen(false);
              setEditingProperty(selectedProperty);
              setEditDialogOpen(true);
            }}
          >
            Edit Property
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Property Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={editingProperty.title || ''}
                onChange={(e) => setEditingProperty({ ...editingProperty, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={editingProperty.description || ''}
                onChange={(e) => setEditingProperty({ ...editingProperty, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={editingProperty.price || ''}
                onChange={(e) => setEditingProperty({ ...editingProperty, price: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={editingProperty.type || 'house'}
                  onChange={(e) => setEditingProperty({ ...editingProperty, type: e.target.value })}
                  label="Type"
                >
                  <MenuItem value="house">House</MenuItem>
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="condo">Condo</MenuItem>
                  <MenuItem value="land">Land</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingProperty.status || 'active'}
                  onChange={(e) => setEditingProperty({ ...editingProperty, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="sold">Sold</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Location"
                value={editingProperty.location || ''}
                onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditProperty}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete property "{selectedProperty?.title}"? 
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteProperty}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PropertiesTable;