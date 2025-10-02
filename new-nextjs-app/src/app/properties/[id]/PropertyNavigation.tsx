'use client';

import { Box, Paper, Tabs, Tab, useMediaQuery, useTheme } from '@mui/material';
import { 
  Info, 
  Star, 
  Home, 
  LocationOn, 
  MoreHoriz, 
  Business
} from '@mui/icons-material';

interface PropertyNavigationProps {
  scrollToSection: (ref: React.RefObject<HTMLDivElement>) => void;
  overviewRef: React.RefObject<HTMLDivElement>;
  highlightsRef: React.RefObject<HTMLDivElement>;
  amenitiesRef: React.RefObject<HTMLDivElement>;
  nearbyRef: React.RefObject<HTMLDivElement>;
  moreInfoRef: React.RefObject<HTMLDivElement>;
  floorPlanRef: React.RefObject<HTMLDivElement>;
  developerRef: React.RefObject<HTMLDivElement>;
  similarRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
}

const PropertyNavigation = ({
  scrollToSection,
  overviewRef,
  highlightsRef,
  amenitiesRef,
  nearbyRef,
  moreInfoRef,
  floorPlanRef,
  developerRef,
  similarRef,
  isMobile
}: PropertyNavigationProps) => {
  const theme = useTheme();

  const navigationItems = [
    { label: 'Overview', icon: <Info />, ref: overviewRef },
    { label: 'Highlights', icon: <Star />, ref: highlightsRef },
    { label: 'Amenities', icon: <Home />, ref: amenitiesRef },
    { label: 'Nearby', icon: <LocationOn />, ref: nearbyRef },
    { label: 'More Info', icon: <MoreHoriz />, ref: moreInfoRef },
    { label: 'Floor Plan', icon: <Home />, ref: floorPlanRef },
    { label: 'Developer', icon: <Business />, ref: developerRef },
    { label: 'Similar', icon: <Star />, ref: similarRef },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    const selectedItem = navigationItems[newValue];
    if (selectedItem) {
      scrollToSection(selectedItem.ref);
    }
  };

  if (isMobile) {
    return (
      <Paper 
        elevation={2} 
        sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 100,
          mb: 2,
          borderRadius: 0
        }}
      >
        <Tabs
          value={0}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            '& .MuiTab-root': {
              minWidth: 'auto',
              px: 1,
              fontSize: '0.75rem',
              '& .MuiSvgIcon-root': {
                fontSize: '1rem',
                mr: 0.5
              }
            }
          }}
        >
          {navigationItems.map((item, index) => (
            <Tab
              key={item.label}
              icon={item.icon}
              label={item.label}
              iconPosition="start"
              onClick={() => scrollToSection(item.ref)}
            />
          ))}
        </Tabs>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        position: 'sticky', 
        top: 20, 
        zIndex: 100,
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2 }}>
        <Tabs
          value={0}
          onChange={handleTabChange}
          orientation="vertical"
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              justifyContent: 'flex-start',
              textAlign: 'left',
              py: 1.5,
              px: 2,
              minHeight: 'auto',
              '& .MuiSvgIcon-root': {
                mr: 1.5,
                fontSize: '1.2rem'
              }
            },
            '& .MuiTabs-indicator': {
              left: 0,
              right: 'auto',
              width: 3,
              backgroundColor: theme.palette.primary.main
            }
          }}
        >
          {navigationItems.map((item, index) => (
            <Tab
              key={item.label}
              icon={item.icon}
              label={item.label}
              iconPosition="start"
              onClick={() => scrollToSection(item.ref)}
            />
          ))}
        </Tabs>
      </Box>
    </Paper>
  );
};

export default PropertyNavigation;
