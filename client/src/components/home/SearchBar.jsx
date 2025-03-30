import { Box, Button, Container, Grid, InputAdornment, TextField, useMediaQuery } from "@mui/material";
import { useThemeContext } from "../../context/ThemeContext";
import { urbanRealtyTheme } from "../../Theme/NewTheme";
import { LocationOn, Search } from "@mui/icons-material";

const SearchBar = () => {
  const theme = useThemeContext();
  const isMobile = useMediaQuery(urbanRealtyTheme.breakpoints.down('md'));

  return (
    <Container maxWidth="lg" sx={{ 
      mt: -6, 
      mb: 4, 
      position: 'relative', 
      zIndex: 1,
      px: { xs: 1, sm: 2 }
    }}>
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          p: { xs: 2, sm: 3 },
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 4
          }
        }}
      >
        <Grid Container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Location"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="primary" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 1,
                  backgroundColor: 'background.paper'
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Property Type"
              variant="outlined"
              select
              size="small"
              SelectProps={{ 
                native: true,
                sx: {
                  borderRadius: 1,
                  backgroundColor: 'background.paper'
                }
              }}
            >
              <option value="">All Types</option>
              <option value="House">House</option>
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
              <option value="Land">Land</option>
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              fullWidth
              variant="contained"
              size={isMobile ? 'medium' : 'large'}
              startIcon={<Search />}
              sx={{
                height: '100%',
                py: isMobile ? 1 : 1.5,
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default SearchBar;