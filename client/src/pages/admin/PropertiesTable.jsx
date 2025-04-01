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
  InputAdornment
} from '@mui/material';
import { MoreVert, Delete, Visibility, Edit } from '@mui/icons-material';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/home/SearchBar';

const PropertiesTable = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/admin/properties');
        setProperties(response.data.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);

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

  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
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
                <SearchBar />
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
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProperties
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(property => (
                <TableRow key={property._id}>
                  <TableCell>
                    <Typography fontWeight="medium">{property.title}</Typography>
                  </TableCell>
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
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProperties.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

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
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
    </Paper>
  );
};

export default PropertiesTable;