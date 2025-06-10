import { Box, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data - in a real app, you would fetch this from your API
  const favorites = [
    {
      id: 1,
      image: "/building_1.jpg",
      title: "Luxury Apartment",
      price: "₹85.0 L",
      location: "Hinjewadi, Pune",
      seller: "XYZ Realty"
    },
    {
      id: 2,
      image: "/building_5.jpg",
      title: "Modern Villa",
      price: "₹1.2 Cr",
      location: "Baner, Pune",
      seller: "ABC Builders"
    }
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 4,
      px: 2,
      backgroundColor: '#0B1011',
      color: 'white'
    }}>
      <Typography variant="h3" sx={{ mb: 4, textAlign: 'center', color: '#78CADC' }}>
        Your Favorite Properties
      </Typography>
      
      {favorites.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          You haven't saved any properties yet.
        </Typography>
      ) : (
        <Grid container spacing={3} sx={{ px: 2 }}>
          {favorites.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property.id}>
              <Card sx={{ 
                backgroundColor: '#1a2a32',
                border: '1px solid #78CADC',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={property.image}
                  alt={property.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {property.title}
                  </Typography>
                  <Typography variant="h6" color="#78CADC">
                    {property.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {property.location}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    sx={{ color: '#78CADC' }}
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Favorites;