import { Box, Typography, Button, Grid, Stack, CircularProgress, Alert, Container } from '@mui/material';
import { Add, List, Login, PersonAdd } from '@mui/icons-material';
import PropertyCard from '../../components/property/PropertyCard';
import HeroSection from '../../components/home/HeroSection';
import SearchBar from '../../components/home/SearchBar';
import { useAuth } from '../../context/AuthContext';
import { useProperties } from '../../context/PropertiesContext';
import { useEffect } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

const Home = () => {
  const { 
    featuredProperties = [], 
    loading, 
    error, 
    getFeaturedProperties 
  } = useProperties();
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        await getFeaturedProperties();
      } catch (err) {
        console.error('Error fetching featured properties:', err);
      }
    };
    
    fetchFeaturedProperties();
  }, [getFeaturedProperties]);

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      <HeroSection />
      <SearchBar />

      <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }} >
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 4 }} >    
          {!user && (
            <>
              <Button 
                variant="outlined" 
                size={isMobile ? 'medium' : 'large'}
                href="/login"
                startIcon={<Login />}
                fullWidth={isMobile}
                sx={{ 
                  minWidth: { sm: 150 },
                  py: { xs: 1.5, sm: 1 },
                  px: { xs: 2, sm: 4 }
                }}
              >
                Login
              </Button>
              <Button 
                variant="outlined" 
                size={isMobile ? 'medium' : 'large'}
                href="/register"
                startIcon={<PersonAdd />}
                fullWidth={isMobile}
                sx={{ 
                  minWidth: { sm: 150 },
                  py: { xs: 1.5, sm: 1 },
                  px: { xs: 2, sm: 4 }
                }}
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      </Container>

      <Container maxWidth="xl" sx={{ 
        py: { xs: 3, sm: 6 },
        px: { xs: 1, sm: 2, md: 4 }
      }}>
        <Typography 
          variant={isMobile ? 'h5' : 'h4'} 
          component="h2" 
          gutterBottom 
          align="center" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 4,
            fontSize: { 
              xs: '1.5rem', 
              sm: '1.8rem', 
              md: '2.2rem' 
            }
          }}
        >
          Featured Properties
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={60} />
          </Box>
        ) : featuredProperties.length > 0 ? (
          <Grid container spacing={{ xs: 1.5, sm: 2, md: 3, lg: 4 }}>
            {featuredProperties.map((property) => (
              <Grid item key={property._id} xs={12} sm={6} md={4} lg={3}>
                <PropertyCard property={property} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography 
            variant="body1" 
            align="center" 
            color="text.secondary"
            sx={{ py: 4 }}
          >
            No featured properties available at the moment.
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default Home;