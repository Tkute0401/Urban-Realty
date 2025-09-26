import React from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Button, Typography } from '@mui/material';

const FavoritesGrid = ({ items, onView }) => (
  <Grid container spacing={3}>
    {items.map((property) => (
      <Grid item xs={12} sm={6} md={4} key={property._id || property.id}>
        <Card sx={{
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          color: 'var(--color-text)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '12px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: 'var(--color-primary)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-2px)'
          }
        }}>
          <CardMedia
            component="img"
            height="200"
            image={property.images?.[0]?.url || property.image || '/placeholder-property.jpg'}
            alt={property.title || property.location}
            sx={{
              objectFit: 'cover'
            }}
          />
          <CardContent sx={{ 
            flexGrow: 1,
            backgroundColor: 'var(--color-surface)',
            color: 'var(--color-text)'
          }}>
            <Typography 
              gutterBottom 
              variant="h6" 
              component="div"
              sx={{ 
                color: 'var(--color-text)',
                fontWeight: 600,
                fontSize: '1.1rem'
              }}
            >
              {property.title || property.location}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1,
                color: 'var(--color-primary)',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}
            >
              {property.price}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem'
              }}
            >
              {property.location?.address || property.location}
            </Typography>
          </CardContent>
          <CardActions sx={{ 
            backgroundColor: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
            padding: '16px'
          }}>
            <Button
              size="small"
              variant="outlined"
              sx={{ 
                color: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                '&:hover': {
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-primary-contrast)',
                  borderColor: 'var(--color-primary)'
                },
                fontWeight: 500,
                textTransform: 'none'
              }}
              onClick={() => onView(property._id || property.id)}
            >
              View Details
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
);

export default FavoritesGrid;

