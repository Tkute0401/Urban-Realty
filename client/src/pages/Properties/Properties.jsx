import { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, CircularProgress } from '@mui/material';
import PropertyCard from '../../components/property/PropertyCard';
import axios from '../../services/axios';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/properties');
        setProperties(response.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
        All Properties
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {properties.map((property) => (
            <Grid item key={property._id} xs={12} sm={6} md={4} lg={3}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Properties;