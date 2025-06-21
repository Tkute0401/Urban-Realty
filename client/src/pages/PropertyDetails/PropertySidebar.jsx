import { Box, Typography, Button, Avatar, Divider } from '@mui/material';
import { Phone, WhatsApp, Email, LocationOn } from '@mui/icons-material';
import PremiumPaper from './PremiumPaper';
import PropertyMap from '../../components/property/PropertyMap';
import { formatPrice } from '../../utils/format';
import PremiumButton from './PremiumButton';
import { pulse } from './animations';

const PropertySidebar = ({ property, fullAddress, isSticky, headerHeight, handleContactOpen }) => {
  return (
    <Box sx={{ 
      position: 'sticky', 
      top: isSticky ? `${headerHeight + 100}px` : '40px',
      transition: 'top 0.3s ease'
    }}>
      {/* Price and Status Card */}
      <PremiumPaper sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#78CADC' }}>
          Price Details
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Price
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#78CADC' }}>
            {formatPrice(property.price || 0)}
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Price per sqft
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#78CADC' }}>
            {formatPrice(property.price / property.area)}/sqft
          </Typography>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Possession Status
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#78CADC' }}>
            {property.projectDetails?.launchDate ? 
              `Ready by ${new Date(property.projectDetails.launchDate).toLocaleDateString()}` : 
              'Ready to Move'}
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3, borderColor: 'rgba(120, 202, 220, 0.3)' }} />
        
        <PremiumButton 
          fullWidth
          size="large"
          onClick={handleContactOpen}
          startIcon={<Email sx={{ fontSize: '1.4rem' }} />}
          sx={{
            py: 2,
            fontSize: '1.1rem',
            '&:hover': {
              animation: `${pulse} 1.5s infinite`
            }
          }}
        >
          Contact Agent
        </PremiumButton>
      </PremiumPaper>

      {/* Contact Agent Card */}
      <PremiumPaper sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#78CADC' }}>
          Contact Agent
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3,
          p: 3,
          backgroundColor: 'rgba(120, 202, 220, 0.1)',
          borderRadius: '12px',
          border: '1px solid rgba(120, 202, 220, 0.3)',
        }}>
          <Avatar 
            src={property.agent?.avatar}
            sx={{ 
              width: 64, 
              height: 64,
              mr: 3,
              backgroundColor: '#78CADC',
              color: '#0B1011',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            {property.agent?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#fff' }}>
              {property.agent?.name || 'N/A'}
            </Typography>
            {property.agent?.company && (
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                {property.agent.company}
              </Typography>
            )}
          </Box>
        </Box>
        
        <Button
          fullWidth
          variant="contained"
          startIcon={<Phone />}
          onClick={() => {
            setContactMethod('phone');
            handleContactOpen();
          }}
          sx={{
            mb: 2,
            backgroundColor: '#4CAF50',
            '&:hover': {
              backgroundColor: '#3e8e41'
            }
          }}
        >
          Call Agent
        </Button>
        
        <Button
          fullWidth
          variant="contained"
          startIcon={<WhatsApp />}
          onClick={() => {
            setContactMethod('whatsapp');
            handleContactOpen();
          }}
          sx={{
            backgroundColor: '#25D366',
            '&:hover': {
              backgroundColor: '#1da851'
            }
          }}
        >
          WhatsApp
        </Button>
      </PremiumPaper>

      {/* Location Map */}
      <PremiumPaper>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, color: '#78CADC' }}>
          Location
        </Typography>
        <Box sx={{ 
          height: 300,
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid rgba(120, 202, 220, 0.3)',
          mb: 2
        }}>
          <PropertyMap 
            location={property.location} 
            address={property.address || {}} 
            darkMode={true}
          />
        </Box>
        <Typography variant="body1" sx={{ 
          mt: 2,
          display: 'flex',
          alignItems: 'center',
          color: 'rgba(255, 255, 255, 0.85)'
        }}>
          <LocationOn sx={{ color: '#78CADC', mr: 1.5 }} />
          {fullAddress}
        </Typography>
      </PremiumPaper>
    </Box>
  );
};

export default PropertySidebar;