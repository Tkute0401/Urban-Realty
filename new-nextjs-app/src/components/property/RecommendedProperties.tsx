'use client';

import React, { useEffect, useState } from 'react';
import { Box, Typography, Card, CardContent, CardMedia, Button, Chip, CircularProgress, Alert } from '@mui/material';
import { TrendingUp, Favorite, LocationOn, AttachMoney } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { formatPrice } from '@/lib/utils/format';
import PropertyCard from './PropertyCard';

interface Property {
  _id: string;
  title: string;
  price: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: string;
  images?: Array<{ url: string }>;
  address?: {
    city?: string;
    locality?: string;
  };
  relevanceScore?: number;
  reasoning?: string;
}

interface RecommendedPropertiesProps {
  userId?: string;
  propertyId?: string;
  type?: 'personalized' | 'similar' | 'trending';
  limit?: number;
  title?: string;
  showReasoning?: boolean;
}

const RecommendedProperties: React.FC<RecommendedPropertiesProps> = ({
  userId,
  propertyId,
  type = 'personalized',
  limit = 6,
  title,
  showReasoning = true
}) => {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId && type !== 'trending') {
      setLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          limit: limit.toString(),
          type: type === 'similar' && propertyId ? 'similar' : type
        });

        if (propertyId && type === 'similar') {
          params.append('propertyId', propertyId);
        }

        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json'
        };

        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/v1/properties/recommendations?${params}`, {
          headers
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        setProperties(data.data || []);
      } catch (err: any) {
        console.error('Error fetching recommendations:', err);
        setError(err.message || 'Failed to load recommendations');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, propertyId, type, limit]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  const displayTitle = title || 
    (type === 'similar' ? 'Similar Properties' : 
     type === 'trending' ? 'Trending Properties' : 
     'Recommended for You');

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUp sx={{ mr: 1, color: 'var(--color-primary)' }} />
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--color-text-primary)' }}>
          {displayTitle}
        </Typography>
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(3, 1fr)'
        },
        gap: 3
      }}>
        {properties.map((property) => (
          <Box key={property._id} sx={{ position: 'relative' }}>
            <PropertyCard
              property={property as any}
              onClick={() => {
                const slug = (property as any).slug || property.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || property._id;
                router.push(`/properties/${slug}`);
              }}
            />
            {showReasoning && property.reasoning && (
              <Chip
                label={property.reasoning}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  fontSize: '0.7rem',
                  maxWidth: '200px',
                  '& .MuiChip-label': {
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }
                }}
              />
            )}
            {property.relevanceScore && (
              <Box sx={{
                position: 'absolute',
                bottom: 8,
                left: 8,
                background: 'rgba(25, 118, 210, 0.9)',
                color: 'white',
                px: 1,
                py: 0.5,
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600
              }}>
                {Math.round(property.relevanceScore * 100)}% Match
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default RecommendedProperties;



