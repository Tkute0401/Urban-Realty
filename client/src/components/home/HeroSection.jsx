import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useThemeContext } from "../../context/ThemeContext";
import { Box, Button, Container, Stack, Typography, useMediaQuery } from "@mui/material";
import { urbanRealtyTheme } from "../../Theme/NewTheme";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useThemeContext();
  const isMobile = useMediaQuery(urbanRealtyTheme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundImage: `
          linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
          url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')
        `,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed',
        height: { xs: '60vh', sm: '80vh' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <Container maxWidth="md" sx={{ 
        position: 'relative',
        zIndex: 2,
        px: { xs: 2, sm: 3 }
      }}>
        <Typography 
          align="center"
          variant={isMobile ? 'h3' : 'h2'} 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 800,
            mb: 3,
            fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            lineHeight: 1.2
          }}
        >
          Find Your Dream Home
        </Typography>
        <Typography 
          align="center"
          variant={isMobile ? 'h6' : 'h5'} 
          sx={{ 
            mb: 4,
            fontSize: { xs: '1.1rem', sm: '1.5rem' },
            textShadow: '0 1px 2px rgba(0,0,0,0.3)',
            maxWidth: '800px',
            mx: 'auto'
          }}
        >
          Discover the perfect property that matches your lifestyle and budget
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          justifyContent="center"
          sx={{ mt: 3 }}
        >
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/properties')}
            sx={{ 
              px: 4, 
              py: 2,
              width: { xs: '100%', sm: 'auto' },
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 600,
              backgroundColor: 'primary.main',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            Browse Properties
          </Button>
          
          {user?.role === 'agent' && (
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/add-property')}
              sx={{ 
                px: 4, 
                py: 2, 
                color: 'red', 
                borderColor: 'blue',
                width: { xs: '100%', sm: 'auto' },
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: 'rgba(66, 157, 113, 0.1)',
                  borderColor: 'yellow',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Add Property
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;