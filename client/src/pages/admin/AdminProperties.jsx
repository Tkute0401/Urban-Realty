// src/pages/admin/AdminProperties.jsx
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, 
  IconButton, CircularProgress, TextField, MenuItem,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Checkbox, Tooltip
} from '@mui/material';
import { 
  Add, Edit, Delete, Search, Refresh, 
  Home, Star, StarBorder
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { formatPrice, formatDate } from '../../utils/format';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const navigate = useNavigate();

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let url = '/api/v1/admin/properties';
      if (statusFilter !== 'all') {
        url += `?status=${statusFilter}`;
      }
      
      const response = await axios.get(url);
      setProperties(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  const handleDeleteProperty = async () => {
    try {
      await axios.delete(`/api/v1/admin/properties/${selectedProperty._id}`);
      setOpenDeleteDialog(false);
      fetchProperties();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete property');
    }
  };

  const toggleFeatured = async (propertyId, isFeatured) => {
    try {
      await axios.patch(`/api/v1/admin/properties/${propertyId}/featured`, {
        featured: !isFeatured
      });
      fetchProperties();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property');
    }
  };

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && properties.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
      <CircularProgress size={60} />
    </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Property Management</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={() => navigate('/add-property')}
        >
          Add Property
        </Button>
      </Box>

      {error && (
        <Box mb={3} p={2} bgcolor="error.light" borderRadius={1}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Box display="flex" gap={2} mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1 }} />
          }}
        />
        
        <TextField
          select
          variant="outlined"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value="all">All Statuses</MenuItem>
          <MenuItem value="For Sale">For Sale</MenuItem>
          <MenuItem value="For Rent">For Rent</MenuItem>
          <MenuItem value="Sold">Sold</MenuItem>
          <MenuItem value="Rented">Rented</MenuItem>
        </TextField>
        
        <IconButton onClick={fetchProperties}>
          <Refresh />
        </IconButton>
      </Box>

      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property._id} hover>
                  <TableCell>
                    <Typography fontWeight="500">{property.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.type}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {property.address.city}, {property.address.state}
                  </TableCell>
                  <TableCell>{formatPrice(property.price)}</TableCell>
                  <TableCell>
                    <Chip 
                      label={property.status} 
                      color={
                        property.status === 'For Sale' ? 'primary' : 
                        property.status === 'For Rent' ? 'secondary' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title={property.featured ? "Unfeature this property" : "Feature this property"}>
                      <Checkbox
                        icon={<StarBorder />}
                        checkedIcon={<Star color="primary" />}
                        checked={property.featured}
                        onChange={() => toggleFeatured(property._id, property.featured)}
                      />
                    </Tooltip>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => navigate(`/properties/${property._id}/edit`)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton 
                      onClick={() => {
                        setSelectedProperty(property);
                        setOpenDeleteDialog(true);
                      }}
                    >
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete property {selectedProperty?.title}? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteProperty} 
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProperties;