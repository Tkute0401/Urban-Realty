import { useState, useEffect } from 'react';
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
  TablePagination,
  TextField,
  InputAdornment,
  Avatar,
  Tooltip
} from '@mui/material';
import { MoreVert, Delete, Visibility, Edit, Search } from '@mui/icons-material';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const formatPrice = (price) => {
  if (!price) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const PropertiesTable = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const endpoint = user?.role === 'admin' ? '/admin/properties' : '/properties';
        const response = await axios.get(endpoint);
        if (response.data.success) {
          setProperties(response.data.data || []);
        } else {
          setError('Failed to fetch properties');
        }
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [user]);

  const handleMenuOpen = (event, property) => {
    setAnchorEl(event.currentTarget);
    setSelectedProperty(property);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedProperty(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/admin/properties/${selectedProperty._id}`);
      setProperties(properties.filter(property => property._id !== selectedProperty._id));
    } catch (err) {
      console.error('Error deleting property:', err);
      setError('Failed to delete property');
    } finally {
      handleMenuClose();
    }
  };

  const handleView = () => {
    navigate(`/properties/${selectedProperty._id}`);
    handleMenuClose();
  };

  const handleEdit = () => {
    navigate(`/properties/${selectedProperty._id}/edit`);
    handleMenuClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredProperties = properties.filter(property => {
    if (!property) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (property.title?.toLowerCase() || '').includes(searchLower) ||
      (property.agent?.name?.toLowerCase() || '').includes(searchLower) ||
      (property.address?.city?.toLowerCase() || '').includes(searchLower) ||
      (property.type?.toLowerCase() || '').includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Paper>
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              {user?.role === 'admin' && <TableCell>Agent</TableCell>}
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProperties.length > 0 ? (
              filteredProperties
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(property => (
                  <TableRow key={property._id}>
                    <TableCell>
                      <Typography fontWeight="medium">{property.title}</Typography>
                    </TableCell>
                    {user?.role === 'admin' && (
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar 
                            src={property.agent?.photo} 
                            sx={{ width: 24, height: 24, mr: 1 }}
                          />
                          <Typography variant="body2">
                            {property.agent?.name}
                          </Typography>
                        </Box>
                      </TableCell>
                    )}
                    <TableCell>
                      <Chip label={property.type} color="primary" size="small" />
                    </TableCell>
                    <TableCell>
                      {property.address?.city}, {property.address?.state}
                    </TableCell>
                    <TableCell>
                      {formatPrice(property.price)}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={property.status} 
                        color={
                          property.status === 'For Sale' ? 'primary' : 
                          property.status === 'For Rent' ? 'secondary' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(e) => handleMenuOpen(e, property)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
            ) : (
              <TableRow>
                <TableCell colSpan={user?.role === 'admin' ? 7 : 6} align="center">
                  <Typography>No properties found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredProperties.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProperties.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleView}>
          <Visibility fontSize="small" sx={{ mr: 1 }} /> View
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        {user?.role === 'admin' && (
          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

export default PropertiesTable;