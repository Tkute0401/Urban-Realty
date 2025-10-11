'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add,
  Refresh,
  Download
} from '@mui/icons-material';
import PropertiesTable from './PropertiesTable';
import { api } from '@/lib/services/api';

const AdminProperties = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    sold: 0,
    averagePrice: 0
  });

  useEffect(() => {
    fetchPropertyStats();
  }, []);

  const fetchPropertyStats = async () => {
    setLoading(true);
    try {
      const response = await api.admin.stats();
      if (response.success) {
        setStats(response.data || stats);
      }
    } catch (err) {
      console.error('Error fetching property stats:', err);
      setError('Failed to load property statistics');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Exporting properties...');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
          Property Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchPropertyStats}
            sx={{ 
              mr: 1,
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              '&:hover': {
                borderColor: 'var(--color-primary)',
                background: 'var(--color-primary-light)'
              }
            }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={handleExport}
            sx={{ 
              mr: 1,
              borderColor: 'var(--color-border)',
              color: 'var(--color-text-primary)',
              '&:hover': {
                borderColor: 'var(--color-primary)',
                background: 'var(--color-primary-light)'
              }
            }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => window.open('/add-property', '_blank')}
            sx={{
              background: 'var(--color-primary)',
              color: 'var(--color-primary-contrast)',
              '&:hover': {
                background: 'var(--color-primary-hover)'
              }
            }}
          >
            Add Property
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Property Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)',
            color: 'var(--color-primary-contrast)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Total Properties</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : stats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-success) 0%, #16a34a 100%)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Active</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-warning) 0%, #f59e0b 100%)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Pending</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : stats.pending}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, #1A2BFF 100%)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Sold</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : stats.sold}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Avg Price</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', fontSize: '1.75rem' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : `₹${(stats.averagePrice / 100000).toFixed(1)}L`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Properties Table */}
      <PropertiesTable />
    </Box>
  );
};

export default AdminProperties;

