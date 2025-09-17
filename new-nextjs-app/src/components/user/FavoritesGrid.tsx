import React from 'react';
import { Grid, Card, CardMedia, CardContent, CardActions, Button, Typography } from '@mui/material';

const FavoritesGrid = ({ items, onView }) => (
  <Grid container spacing={3}>
    {items.map((property) => (
      <Grid item xs={12} sm={6} md={4} key={property._id || property.id}>
        <Card sx={{
          backgroundColor: 'var(--color-bg-dark)',
          border: '1px solid var(--color-primary)',
          color: 'var(--color-text-inverse)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <CardMedia
            component="img"
            height="200"
            image={property.images?.[0]?.url || property.image || '/placeholder-property.jpg'}
            alt={property.title || property.location}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h6" component="div">
              {property.title || property.location}
            </Typography>
            <Typography variant="body2" color="var(--color-primary)" sx={{ mb: 1 }}>
              {property.price}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {property.location?.address || property.location}
            </Typography>
          </CardContent>
          <CardActions>
            <Button
              size="small"
              sx={{ color: 'var(--color-primary)' }}
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

