// src/pages/admin/PropertiesPage.jsx
import { useState, useEffect } from 'react';
import { Box, Button, Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import axios from '../../services/axios';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/format';

const PropertiesPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/v1/admin/properties');
        setProperties(response.data.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDelete = async (propertyId) => {
    try {
      await axios.delete(`/api/v1/admin/properties/${propertyId}`);
      setProperties(properties.filter(prop => prop._id !== propertyId));
    } catch (err) {
      console.error('Error deleting property:', err);
    }
  };

  const toggleFeatured = async (propertyId, isFeatured) => {
    try {
      await axios.patch(`/api/v1/admin/properties/${propertyId}/featured`, { featured: !isFeatured });
      setProperties(properties.map(prop => 
        prop._id === propertyId ? { ...prop, featured: !isFeatured } : prop
      ));
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Properties Management
      </Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Featured</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {properties
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((property) => (
                  <TableRow hover key={property._id}>
                    <TableCell>{property.title}</TableCell>
                    <TableCell>{property.type}</TableCell>
                    <TableCell>{property.status}</TableCell>
                    <TableCell>{formatPrice(property.price)}</TableCell>
                    <TableCell>
                      {property.address?.city}, {property.address?.state}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant={property.featured ? 'contained' : 'outlined'}
                        color={property.featured ? 'primary' : 'default'}
                        size="small"
                        onClick={() => toggleFeatured(property._id, property.featured)}
                      >
                        {property.featured ? 'Featured' : 'Feature'}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          component={Link}
                          to={`/properties/${property._id}`}
                          size="small"
                          color="primary"
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                        <IconButton
                          component={Link}
                          to={`/properties/${property._id}/edit`}
                          size="small"
                          color="secondary"
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(property._id)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={properties.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default PropertiesPage;