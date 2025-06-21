import { Box, Typography, Grid, Chip } from '@mui/material';
import { LocationOn, SquareFoot, KingBed, Apartment } from '@mui/icons-material';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';
import { formatPrice } from '../../utils/format';

const PropertySimilar = ({ property, similarRef, navigate }) => {
  return (
    <Box ref={similarRef} sx={{ mb: 6 }}>
      <SectionHeader variant="h4">Similar Projects Nearby</SectionHeader>
      <PremiumPaper>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#78CADC' }}>
          Properties Similar to {property.title} within 20km
        </Typography>
        
        {property.similarProperties?.length > 0 ? (
          <Grid container spacing={3}>
            {property.similarProperties.map((similarProp) => (
              <Grid item xs={12} key={similarProp._id}>
                <Box 
                  onClick={() => navigate(`/properties/${similarProp._id}`)}
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 3,
                    p: 3,
                    backgroundColor: 'rgba(120, 202, 220, 0.1)',
                    border: '1px solid rgba(120, 202, 220, 0.3)',
                    borderRadius: '12px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(120, 202, 220, 0.2)',
                      backgroundColor: 'rgba(120, 202, 220, 0.2)'
                    }
                  }}
                >
                  <Box sx={{
                    width: { xs: '100%', sm: '200px' },
                    height: '150px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0
                  }}>
                    {similarProp.images?.[0]?.url ? (
                      <img 
                        src={similarProp.images[0].url} 
                        alt={similarProp.title} 
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }}
                      />
                    ) : (
                      <Box sx={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(120, 202, 220, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Apartment sx={{ fontSize: 60, color: 'rgba(120, 202, 220, 0.5)' }} />
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#78CADC', mb: 1 }}>
                      {similarProp.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                      <LocationOn sx={{ fontSize: '1rem', verticalAlign: 'middle', mr: 0.5 }} />
                      {[
                        similarProp.address?.line1,
                        similarProp.address?.street,
                        similarProp.address?.city,
                        similarProp.address?.state,
                        similarProp.address?.zipCode
                      ].filter(Boolean).join(', ')}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<SquareFoot sx={{ color: '#78CADC' }} />}
                        label={`${similarProp.area} sqft`}
                        size="small"
                        sx={{ 
                          backgroundColor: 'rgba(120, 202, 220, 0.15)',
                          color: '#fff',
                          fontFamily: '"Poppins", sans-serif'
                        }}
                      />
                      <Chip 
                        icon={<KingBed sx={{ color: '#78CADC' }} />}
                        label={`${similarProp.bedrooms} BHK`}
                        size="small"
                        sx={{ 
                          backgroundColor: 'rgba(120, 202, 220, 0.15)',
                          color: '#fff',
                          fontFamily: '"Poppins", sans-serif'
                        }}
                      />
                      {similarProp.type && (
                        <Chip 
                          icon={<Apartment sx={{ color: '#78CADC' }} />}
                          label={similarProp.type}
                          size="small"
                          sx={{ 
                            backgroundColor: 'rgba(120, 202, 220, 0.15)',
                            color: '#fff',
                            fontFamily: '"Poppins", sans-serif'
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#78CADC' }}>
                      {formatPrice(similarProp.price)}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', py: 4 }}>
            No similar properties found within 20km radius.
          </Typography>
        )}
      </PremiumPaper>
    </Box>
  );
};

export default PropertySimilar;