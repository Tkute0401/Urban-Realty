'use client';

import { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useProperties } from '@/contexts/PropertiesContext';
import PropertyList from '../property/PropertyList';

const RecentProperties = () => {
  const { properties, loading, getProperties } = useProperties();
  const [recentProperties, setRecentProperties] = useState(properties.slice(0, 4));

  useEffect(() => {
    getProperties({ sort: '-createdAt', limit: 4 });
  }, []);

  useEffect(() => {
    setRecentProperties(properties.slice(0, 4));
  }, [properties]);

  return (
    <Card sx={{ 
      background: 'var(--color-surface)', 
      border: '1px solid var(--color-border)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    }}>
      <CardContent>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3,
            color: 'var(--color-text-primary)',
            fontWeight: 'bold'
          }}
        >
          Recent Properties
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress sx={{ color: 'var(--color-primary)' }} />
          </Box>
        ) : (
          <PropertyList
            properties={recentProperties}
            loading={false}
            emptyMessage="No recent properties"
            columns={{ xs: 12, sm: 12, md: 6, lg: 6 }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProperties;

