'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import http from '@/lib/services/http';
import PropertyList from '@/components/property/PropertyList';
import { Property } from '@/types/property';

const AgentProperties = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    sold: 0
  });

  useEffect(() => {
    if (user) {
      fetchAgentProperties();
    }
  }, [user]);

  const fetchAgentProperties = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const response = await http.get(`/api/v1/properties/agent/${user.id}`);
      const data = response.data;
      const agentProperties = data.data || [];
      
      setProperties(agentProperties);
      
      // Calculate stats
      setStats({
        total: agentProperties.length,
        active: agentProperties.filter((p: Property) => 
          p.status === 'For Sale' || p.status === 'For Rent'
        ).length,
        sold: agentProperties.filter((p: Property) => 
          p.status === 'Sold' || p.status === 'Rented'
        ).length
      });
    } catch (err) {
      console.error('Error fetching agent properties:', err);
      setError('Failed to load your properties');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
          My Properties
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => router.push('/add-property')}
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

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-success) 0%, #16a34a 100%)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Active Listings</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : stats.active}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, var(--color-secondary) 0%, #1A2BFF 100%)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <CardContent>
              <Typography variant="h6">Sold Properties</Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold' }}>
                {loading ? <CircularProgress size={32} sx={{ color: 'white' }} /> : stats.sold}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Properties List */}
      <PropertyList
        properties={properties}
        loading={loading}
        error={error}
        emptyMessage="You haven't added any properties yet"
        columns={{ xs: 12, sm: 6, md: 4, lg: 3 }}
        onPropertyClick={(property) => router.push(`/properties/${property._id}`)}
      />
    </Box>
  );
};

export default AgentProperties;

