import { Box, Typography, Chip, Divider } from '@mui/material';
import { LocationOn, KingBed, Bathtub, SquareFoot, Apartment } from '@mui/icons-material';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';
import { formatPrice } from '../../utils/format';

const PropertyOverview = ({ property, fullAddress, overviewRef }) => {
  return (
    <Box ref={overviewRef} sx={{ mb: 6 }}>
      <SectionHeader variant="h4">Overview</SectionHeader>
      <PremiumPaper>
        <Typography variant="h3" sx={{ 
          fontWeight: 700, 
          mb: 3,
          color: '#78CADC'
        }}>
          {property.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationOn sx={{ color: '#78CADC', mr: 1 }} />
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.85)' }}>
            {fullAddress}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Chip 
            icon={<SquareFoot sx={{ color: '#78CADC' }} />} 
            label={`${property.area} sqft`} 
            sx={{ 
              backgroundColor: 'rgba(120, 202, 220, 0.15)',
              border: '1px solid #78CADC',
              color: '#fff',
              fontFamily: '"Poppins", sans-serif'
            }}
          />
          <Chip 
            icon={<KingBed sx={{ color: '#78CADC' }} />} 
            label={`${property.bedrooms} BHK`} 
            sx={{ 
              backgroundColor: 'rgba(120, 202, 220, 0.15)',
              border: '1px solid #78CADC',
              color: '#fff',
              fontFamily: '"Poppins", sans-serif'
            }}
          />
          <Chip 
            icon={<Bathtub sx={{ color: '#78CADC' }} />} 
            label={`${property.bathrooms} Bath`} 
            sx={{ 
              backgroundColor: 'rgba(120, 202, 220, 0.15)',
              border: '1px solid #78CADC',
              color: '#fff',
              fontFamily: '"Poppins", sans-serif'
            }}
          />
          {property.type && (
            <Chip 
              icon={<Apartment sx={{ color: '#78CADC' }} />} 
              label={property.type} 
              sx={{ 
                backgroundColor: 'rgba(120, 202, 220, 0.15)',
                border: '1px solid #78CADC',
                color: '#fff',
                fontFamily: '"Poppins", sans-serif'
              }}
            />
          )}
        </Box>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(120, 202, 220, 0.3)' }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#78CADC' }}>
            {formatPrice(property.price || 0)}
          </Typography>
          <Chip 
            label={property.status} 
            sx={{ 
              fontWeight: 700,
              backgroundColor: property.status === 'For Sale' ? '#78CADC' : '#e74c3c',
              color: '#0B1011',
              fontFamily: '"Poppins", sans-serif'
            }}
          />
        </Box>
      </PremiumPaper>
    </Box>
  );
};

export default PropertyOverview;