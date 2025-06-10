import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Avatar, Button, Paper, Divider, Chip, 
  Tabs, Tab, Grid, Card, CardMedia, CardContent, CardActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Favorite, Person, ExitToApp, Edit, AdminPanelSettings } from '@mui/icons-material';

// Mock data for favorites
const favoriteProperties = [
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

const ProfileCard = styled(Paper)(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  padding: theme.spacing(4),
  backgroundColor: '#0B1011',
  color: '#fff',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  border: `2px solid #78CADC`,
  fontFamily: '"Poppins", sans-serif',
}));

const ProfileButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#78CADC',
  color: '#0B1011',
  fontWeight: 600,
  padding: theme.spacing(1.5, 3),
  borderRadius: '8px',
  fontFamily: '"Poppins", sans-serif',
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#5fb4c9',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 8px rgba(120, 202, 220, 0.3)',
  },
  transition: 'all 0.3s ease',
}));

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      py: 8,
      px: 2,
      background: 'linear-gradient(to bottom, #0B1011 0%, #1a2a32 100%)',
      fontFamily: '"Poppins", sans-serif'
    }}>
      <ProfileCard elevation={3}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
          >
            <Tab 
              value="profile" 
              label="Profile" 
              icon={<Person />} 
              iconPosition="start"
              sx={{ color: '#78CADC' }}
            />
            <Tab 
              value="favorites" 
              label="Favorites" 
              icon={<Favorite />} 
              iconPosition="start"
              sx={{ color: '#78CADC' }}
            />
          </Tabs>
        </Box>

        {activeTab === 'profile' ? (
          <>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center', 
              gap: 4,
              mb: 4
            }}>
              <Avatar 
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '3px solid #78CADC',
                  boxShadow: '0 4px 20px rgba(120, 202, 220, 0.4)',
                }}
                src={user?.avatar}
              />
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                  {user?.name}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip 
                    label={user?.role} 
                    sx={{ 
                      backgroundColor: '#78CADC', 
                      color: '#0B1011',
                      fontWeight: 600,
                    }} 
                  />
                </Box>
                
                <Divider sx={{ my: 2, borderColor: 'rgba(120, 202, 220, 0.3)' }} />
                
                <Typography variant="body1" sx={{ mb: 1 }}>
                  <strong>Email:</strong> {user?.email}
                </Typography>
                
                {user?.phone && (
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Phone:</strong> {user?.phone}
                  </Typography>
                )}
              </Box>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 3,
              mt: 4,
              flexWrap: 'wrap'
            }}>
              <Button
                variant="contained"
                startIcon={<ExitToApp />}
                onClick={logout}
                sx={{
                  backgroundColor: '#e74c3c',
                  '&:hover': { backgroundColor: '#c0392b' }
                }}
              >
                Logout
              </Button>
              
              <Button 
                variant="contained"
                startIcon={<Edit />}
                sx={{ backgroundColor: '#78CADC', color: '#0B1011' }}
              >
                Edit Profile
              </Button>
              
              {user?.role === 'admin' && (
                <Button 
                  variant="contained"
                  startIcon={<AdminPanelSettings />}
                  sx={{ backgroundColor: '#78CADC', color: '#0B1011' }}
                >
                  Admin Dashboard
                </Button>
              )}
            </Box>
          </>
        ) : (
          <Box>
            <Typography variant="h5" sx={{ mb: 3, color: '#78CADC' }}>
              Your Favorite Properties
            </Typography>
            
            <Grid container spacing={3}>
              {favoriteProperties.map((property) => (
                <Grid item xs={12} sm={6} key={property.id}>
                  <Card sx={{ 
                    backgroundColor: '#0B1011',
                    border: '1px solid #78CADC',
                    color: 'white'
                  }}>
                    <CardMedia
                      component="img"
                      height="160"
                      image={property.image}
                      alt={property.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {property.title}
                      </Typography>
                      <Typography variant="body2" color="#78CADC" sx={{ mb: 1 }}>
                        {property.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {property.location}
                      </Typography>
                      <Typography variant="caption" display="block" color="text.secondary">
                        Listed by: {property.seller}
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
          </Box>
        )}
      </ProfileCard>
    </Box>
  );
};

export default Profile;