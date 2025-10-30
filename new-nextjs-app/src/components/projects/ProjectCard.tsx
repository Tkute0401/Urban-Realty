'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Chip,
  Box,
  Stack,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  LocationOn,
  Business,
  CalendarToday,
  AttachMoney,
  Visibility,
  Favorite,
  FavoriteBorder
} from '@mui/icons-material';
import { toast } from 'react-toastify';

interface ProjectCardProps {
  project: any;
  showFavoriteButton?: boolean;
  onFavoriteToggle?: (projectId: string, isFavorite: boolean) => void;
  sx?: any;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  showFavoriteButton = true,
  onFavoriteToggle,
  sx = {}
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // Check if project is in favorites when component mounts
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user || !project?._id) return;
      
      try {
        const response = await fetch(
          `/api/auth/project-favorites/${project._id}/status?userId=${user.id}`
        );
        const data = await response.json();
        if (data.success) {
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [user, project?._id]);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      router.push('/login');
      toast.info('Please login to save favorites');
      return;
    }

    setLoadingFavorite(true);
    try {
      const url = `/api/auth/project-favorites/${project._id}`;
      const method = isFavorite ? 'DELETE' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsFavorite(!isFavorite);
        toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
        onFavoriteToggle?.(project._id, !isFavorite);
      } else {
        toast.error(data.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const formatPrice = (price: number) => {
    if (!price) return 'Price not available';
    if (price >= 10000000) {
      return `₹ ${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹ ${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹ ${price.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'under construction':
        return 'warning';
      case 'planning':
        return 'info';
      case 'on hold':
        return 'error';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleCardClick = () => {
    router.push(`/projects/${project._id}`);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 3,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(var(--color-shadow-rgb), 0.15)',
          transform: 'translateY(-4px)',
        },
        ...sx
      }}
      onClick={handleCardClick}
    >
      {/* Favorite Button */}
      {showFavoriteButton && (
        <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
          <IconButton
            onClick={handleFavoriteClick}
            disabled={loadingFavorite}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
          >
            {loadingFavorite ? (
              <CircularProgress size={20} />
            ) : isFavorite ? (
              <Favorite sx={{ color: 'red' }} />
            ) : (
              <FavoriteBorder sx={{ color: 'gray' }} />
            )}
          </IconButton>
        </Tooltip>
      )}

      {/* Project Image */}
      <CardMedia
        component="img"
        height="200"
        image={
          typeof project.images?.[0] === 'string'
            ? project.images[0]
            : project.images?.[0]?.url || '/placeholder-project.jpg'
        }
        alt={project.name}
        sx={{ objectFit: 'cover' }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
        {/* Project Header */}
        <Box sx={{ mb: 2 }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              mb: 1,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {project.name}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
            <Chip
              label={project.type}
              size="small"
              variant="outlined"
              sx={{
                borderColor: 'var(--color-primary)',
                color: 'var(--color-primary)',
                fontSize: '0.75rem',
              }}
            />
            <Chip
              label={project.status}
              size="small"
              color={getStatusColor(project.status) as any}
              sx={{ fontSize: '0.75rem' }}
            />
          </Stack>
        </Box>

        {/* Project Details */}
        <Box sx={{ flexGrow: 1 }}>
          <Stack spacing={1} sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
              <Typography
                variant="body2"
                sx={{
                  color: 'var(--color-text-secondary)',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {project.location?.address || 'Location not specified'}
              </Typography>
            </Box>

            {project.developer && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Business sx={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'var(--color-text-secondary)',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {typeof project.developer === 'string' ? project.developer : project.developer.name}
                </Typography>
              </Box>
            )}

            {project.startingPrice && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney sx={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                <Typography
                  variant="body2"
                  sx={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}
                >
                  Starting from {formatPrice(project.startingPrice)}
                </Typography>
              </Box>
            )}

            {project.views && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Visibility sx={{ fontSize: 16, color: 'var(--color-text-secondary)' }} />
                <Typography variant="body2" sx={{ color: 'var(--color-text-secondary)' }}>
                  {project.views} views
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Short Description */}
          {project.shortDescription && (
            <Typography
              variant="body2"
              sx={{
                color: 'var(--color-text-secondary)',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 2,
              }}
            >
              {project.shortDescription}
            </Typography>
          )}
        </Box>

        {/* Action Button */}
        <Button
          variant="outlined"
          fullWidth
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          sx={{
            mt: 'auto',
            borderColor: 'var(--color-primary)',
            color: 'var(--color-primary)',
            '&:hover': {
              borderColor: 'var(--color-primary)',
              bgcolor: 'var(--color-primary)',
              color: 'var(--color-primary-contrast)',
            },
          }}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
