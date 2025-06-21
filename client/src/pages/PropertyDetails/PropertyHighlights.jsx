import { Box, Typography } from '@mui/material';
import PremiumPaper from './PremiumPaper';
import SectionHeader from './SectionHeader';

const PropertyHighlights = ({ property, highlightsRef }) => {
  return (
    <Box ref={highlightsRef} sx={{ mb: 6 }}>
      <SectionHeader variant="h4">Highlights</SectionHeader>
      <PremiumPaper>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#78CADC' }}>
          Why {property.title}?
        </Typography>
        <Box component="ul" sx={{ pl: 3 }}>
          {property.highlights?.length > 0 ? (
            property.highlights.map((highlight, index) => (
              highlight && (
                <Typography 
                  key={index} 
                  component="li" 
                  sx={{ 
                    mb: 2, 
                    fontSize: '1.1rem', 
                    lineHeight: 1.7,
                    color: 'rgba(255, 255, 255, 0.85)'
                  }}
                >
                  {highlight}
                </Typography>
              )
            ))
          ) : (
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              No highlights available
            </Typography>
          )}
        </Box>
      </PremiumPaper>
    </Box>
  );
};

export default PropertyHighlights;