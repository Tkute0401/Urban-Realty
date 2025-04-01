// src/pages/admin/AdminProperties.jsx
import { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, 
  TableRow, Chip, Button, IconButton, 
  Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, MenuItem, 
  CircularProgress, Avatar 
} from '@mui/material';
import { 
  Edit, Delete, Home, Star, 
  StarBorder, Close, Check, Cancel 
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { formatPrice } from '../../utils/format';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/admin/properties');
      setProperties(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeatured = async (propertyId, currentStatus) => {
    try {
      await axios.patch(`/api/v1/admin/properties/${propertyId}/featured`, {
        featured: !currentStatus
      });
      fetchProperties();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update property');
    }
  };

  const handleDelete = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await axios.delete(`/api/v1/admin/properties/${propertyId}`);
        fetchProperties();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete property');
      }
    }
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
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Property Management</Typography>
      </Box>

      <Paper elevation={3}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Featured</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar 
                        src={property.images[0]?.url} 
                        variant="square"
                        sx={{ mr: 2, width: 56, height: 56 }}
                      >
                        <Home />
                      </Avatar>
                      <Box>
                        <Typography fontWeight="500">{property.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.address?.city}, {property.address?.state}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography>{property.agent?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {property.agent?.email}
                    </Typography>
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
                  <TableCell align="center">
                    <IconButton onClick={() => toggleFeatured(property._id, property.featured)}>
                      {property.featured ? (
                        <Star color="primary" />
                      ) : (
                        <StarBorder color="action" />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(property._id)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AdminProperties;