import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  IconButton,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TablePagination,
  Tooltip,
  Alert,
  Grid,
  CardActions
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Home as HomeIcon,
  LocationOn as LocationIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAgentProperties, useDeleteProperty } from '@/hooks/api/agent';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils/format';

const AgentProperties = () => {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch agent's properties
  const { data: properties, isLoading, error } = useAgentProperties(
    user?.id,
    {
      page: page + 1,
      limit: rowsPerPage,
      search: searchTerm,
      status: statusFilter !== 'all' ? statusFilter : undefined,
      priceRange: priceRange !== 'all' ? priceRange : undefined,
    }
  );

  // Delete property mutation
  const deletePropertyMutation = useDeleteProperty({
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentProperties'] });
      setDeleteDialogOpen(false);
      setSelectedProperty(null);
    },
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteProperty = () => {
    if (selectedProperty) {
      deletePropertyMutation.mutate({ propertyId: selectedProperty._id });
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

  const getPriceRangeLabel = (range) => {
    switch (range) {
      case '0-500000': return 'Under ₹5L';
      case '500000-1000000': return '₹5L - ₹10L';
      case '1000000-5000000': return '₹10L - ₹50L';
      case '5000000+': return 'Above ₹50L';
      default: return 'All Prices';
    }
  };

  const filteredProperties = properties?.data || [];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading properties...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            My Properties
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your property listings
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => router.push('/add-property')}
          >
            Add Property
          </Button>
          <IconButton onClick={() => queryClient.invalidateQueries({ queryKey: ['agentProperties'] })}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load properties: {error.message}
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="sold">Sold</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Price Range</InputLabel>
                <Select
                  value={priceRange}
                  label="Price Range"
                  onChange={(e) => setPriceRange(e.target.value)}
                >
                  <MenuItem value="all">All Prices</MenuItem>
                  <MenuItem value="0-500000">Under ₹5L</MenuItem>
                  <MenuItem value="500000-1000000">₹5L - ₹10L</MenuItem>
                  <MenuItem value="1000000-5000000">₹10L - ₹50L</MenuItem>
                  <MenuItem value="5000000+">Above ₹50L</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriceRange('all');
                }}
              >
                Clear
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Properties Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Views</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property._id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                          src={property.images?.[0]}
                          variant="rounded"
                          sx={{ width: 60, height: 60 }}
                        >
                          <HomeIcon />
                        </Avatar>
                        <Box>
                          <Typography fontWeight="500" gutterBottom>
                            {property.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" display="flex" alignItems="center">
                            <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {property.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {property.propertyType} • {property.bedrooms} BHK
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="500" sx={{ color: 'var(--color-primary)' }}>
                        ₹{property.price?.toLocaleString()}
                      </Typography>
                      {property.pricePerSqFt && (
                        <Typography variant="body2" color="text.secondary">
                          ₹{property.pricePerSqFt}/sq ft
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={property.status || 'active'}
                        color={getStatusColor(property.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography>{property.views || 0}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDate(property.createdAt)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" gap={1} justifyContent="flex-end">
                        <Tooltip title="View Property">
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/properties/${property._id}`)}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit Property">
                          <IconButton
                            size="small"
                            onClick={() => router.push(`/properties/${property._id}/edit`)}
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

          {filteredProperties.length === 0 && (
            <Box textAlign="center" py={4}>
              <Typography color="text.secondary" gutterBottom>
                No properties found
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push('/add-property')}
              >
                Add Your First Property
              </Button>
            </Box>
          )}

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={properties?.count || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete "{selectedProperty?.title}"? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteProperty}
            color="error"
            variant="contained"
            disabled={deletePropertyMutation.isLoading}
          >
            {deletePropertyMutation.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentProperties;