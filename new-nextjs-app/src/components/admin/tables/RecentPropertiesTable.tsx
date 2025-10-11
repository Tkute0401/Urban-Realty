'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Typography
} from '@mui/material';
import { Visibility } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useProperties } from '@/contexts/PropertiesContext';
import { Property } from '@/types/property';

const RecentPropertiesTable = () => {
  const router = useRouter();
  const { properties, loading, getProperties } = useProperties();
  const [recentProperties, setRecentProperties] = useState<Property[]>([]);

  useEffect(() => {
    getProperties({ sort: '-createdAt', limit: 5 });
  }, []);

  useEffect(() => {
    setRecentProperties(properties.slice(0, 5));
  }, [properties]);

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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Box>
    );
  }

  if (recentProperties.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography sx={{ color: 'var(--color-text-muted)' }}>
          No recent properties
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ background: 'var(--color-accent)' }}>
            <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Title</TableCell>
            <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Type</TableCell>
            <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Status</TableCell>
            <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Price</TableCell>
            <TableCell sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {recentProperties.map((property) => (
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
              <TableCell>
                <IconButton
                  size="small"
                  onClick={() => router.push(`/properties/${property._id}`)}
                  sx={{ color: 'var(--color-secondary)' }}
                >
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecentPropertiesTable;

