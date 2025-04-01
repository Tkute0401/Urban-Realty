// src/pages/Admin/AdminProperties.jsx
import { 
    Box, Typography, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Button, Chip, TextField, 
    InputAdornment, IconButton, Pagination, Stack, Avatar, Badge
  } from '@mui/material';
  import { Search, Edit, Delete, Add, Star } from '@mui/icons-material';
  import { useState, useEffect } from 'react';
  import axios from '../../services/axios';
  import PropertyEditDialog from '../../components/Admin/PropertyEditDialog';
  import PropertyDeleteDialog from '../../components/Admin/PropertyDeleteDialog';
  import { useMediaQuery, useTheme } from '@mui/material';
  import { formatPrice } from '../../utils/format';
  
  const AdminProperties = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
    useEffect(() => {
      const fetchProperties = async () => {
        try {
          const response = await axios.get(`/admin/properties?page=${page}&search=${searchTerm}`);
          setProperties(response.data.properties);
          setTotalPages(response.data.totalPages);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load properties');
          setLoading(false);
        }
      };
  
      fetchProperties();
    }, [page, searchTerm]);
  
    const handleEditOpen = (property) => {
      setSelectedProperty(property);
      setEditOpen(true);
    };
  
    const handleDeleteOpen = (property) => {
      setSelectedProperty(property);
      setDeleteOpen(true);
    };
  
    const handlePropertyUpdated = (updatedProperty) => {
      setProperties(properties.map(property => 
        property._id === updatedProperty._id ? updatedProperty : property
      ));
    };
  
    const handlePropertyDeleted = (propertyId) => {
      setProperties(properties.filter(property => property._id !== propertyId));
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
        <Typography color="error" align="center">
          {error}
        </Typography>
      );
    }
  
    return (
      <Box>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 3
        }}>
          <Typography variant="h4" gutterBottom>
            Property Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            onClick={() => handleEditOpen({})}
          >
            Add Property
          </Button>
        </Box>
  
        <TextField
          fullWidth
          placeholder="Search properties..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Agent</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property._id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {property.featured && (
                        <Badge 
                          badgeContent={<Star fontSize="small" />} 
                          color="primary"
                          sx={{ mr: 1 }}
                        />
                      )}
                      {property.title}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={property.type} 
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
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
                  <TableCell>{formatPrice(property.price)}</TableCell>
                  <TableCell>
                    {property.agent?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEditOpen(property)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteOpen(property)}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
  
        <PropertyEditDialog
          open={editOpen}
          onClose={() => setEditOpen(false)}
          property={selectedProperty}
          onPropertyUpdated={handlePropertyUpdated}
        />
  
        <PropertyDeleteDialog
          open={deleteOpen}
          onClose={() => setDeleteOpen(false)}
          property={selectedProperty}
          onPropertyDeleted={handlePropertyDeleted}
        />
      </Box>
    );
  };
  
  export default AdminProperties;