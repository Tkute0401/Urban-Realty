'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Typography
} from '@mui/material';
import { Visibility, Edit, Delete, Search } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useProperties } from '@/contexts/PropertiesContext';

const PropertiesTable = () => {
  const router = useRouter();
  const { properties, loading, getProperties, pagination } = useProperties();
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    getProperties({ page: 1, limit: 10 });
  }, []);

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    getProperties({ ...filters, [field]: value, page: 1 });
  };

  const handlePageChange = (event: unknown, newPage: number) => {
    getProperties({ ...filters, page: newPage + 1, limit: pagination.limit });
  };

  const handleRowsPerPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const limit = parseInt(event.target.value, 10);
    getProperties({ ...filters, page: 1, limit });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'For Sale':
        return 'success';
      case 'For Rent':
        return 'info';
      case 'Sold':
        return 'default';
      case 'Rented':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ 
      background: 'var(--color-surface)', 
      border: '1px solid var(--color-border)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <CardContent>
        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search properties..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'var(--color-text-muted)' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  background: 'var(--color-bg)',
                  borderColor: 'var(--color-border)',
                  color: 'var(--color-text-primary)'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                sx={{
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-border)'
                  }
                }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="For Sale">For Sale</MenuItem>
                <MenuItem value="For Rent">For Rent</MenuItem>
                <MenuItem value="Sold">Sold</MenuItem>
                <MenuItem value="Rented">Rented</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: 'var(--color-text-muted)' }}>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                sx={{
                  background: 'var(--color-bg)',
                  color: 'var(--color-text-primary)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--color-border)'
                  }
                }}
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="House">House</MenuItem>
                <MenuItem value="Apartment">Apartment</MenuItem>
                <MenuItem value="Villa">Villa</MenuItem>
                <MenuItem value="Condo">Condo</MenuItem>
                <MenuItem value="Land">Land</MenuItem>
                <MenuItem value="Commercial">Commercial</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Table */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress sx={{ color: 'var(--color-primary)' }} />
          </Box>
        ) : properties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ color: 'var(--color-text-muted)' }}>
              No properties found
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ background: 'var(--color-accent)' }}>
                    <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Title</TableCell>
                    <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Type</TableCell>
                    <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Price</TableCell>
                    <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Location</TableCell>
                    <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow 
                      key={property._id}
                      sx={{ 
                        '&:hover': { 
                          background: 'var(--color-accent)' 
                        }
                      }}
                    >
                      <TableCell sx={{ color: 'var(--color-text-primary)' }}>
                        {property.title}
                      </TableCell>
                      <TableCell sx={{ color: 'var(--color-text-primary)' }}>
                        {property.type}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={property.status} 
                          color={getStatusColor(property.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell sx={{ color: 'var(--color-text-primary)' }}>
                        {formatPrice(property.price)}
                      </TableCell>
                      <TableCell sx={{ color: 'var(--color-text-muted)' }}>
                        {property.address?.city}, {property.address?.state}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/properties/${property._id}`)}
                          sx={{ color: 'var(--color-secondary)' }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => router.push(`/properties/edit/${property._id}`)}
                          sx={{ color: 'var(--color-warning)' }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: 'var(--color-danger)' }}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            <TablePagination
              component="div"
              count={pagination.total}
              page={pagination.page - 1}
              onPageChange={handlePageChange}
              rowsPerPage={pagination.limit}
              onRowsPerPageChange={handleRowsPerPageChange}
              sx={{ 
                color: 'var(--color-text-primary)',
                borderTop: '1px solid var(--color-border)'
              }}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default PropertiesTable;

