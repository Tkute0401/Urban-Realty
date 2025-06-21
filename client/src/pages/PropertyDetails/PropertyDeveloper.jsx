import { Box, Typography, Avatar } from '@mui/material';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';

const PropertyDeveloper = ({ property, developerRef }) => {
  return (
    <Box ref={developerRef} sx={{ mb: 6 }}>
      <SectionHeader variant="h4">About Developer</SectionHeader>
      <PremiumPaper>
        {property.developer ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar 
                src={property.developer.logo}
                sx={{ 
                  width: 64, 
                  height: 64,
                  mr: 3,
                  backgroundColor: '#78CADC',
                  color: '#0B1011'
                }}
              >
                {property.developer.name?.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#78CADC' }}>
                  {property.developer.name}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  {property.developer.description}
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ 
              whiteSpace: 'pre-line',
              color: 'rgba(255, 255, 255, 0.85)'
            }}>
              {property.developer.details}
            </Typography>
          </>
        ) : (
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Developer information will be displayed here when available.
          </Typography>
        )}
      </PremiumPaper>
    </Box>
  );
};

export default PropertyDeveloper;