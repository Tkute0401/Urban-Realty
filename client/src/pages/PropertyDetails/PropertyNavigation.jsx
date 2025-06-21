import { Tabs, Tab, IconButton, Container, Box } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const PropertyNavigation = ({
  activeTab,
  setActiveTab,
  isSticky,
  headerHeight,
  navRef,
  tabsRef,
  showLeftScroll,
  showRightScroll,
  handleScroll,
  scrollToSection,
  overviewRef,
  highlightsRef,
  aroundRef,
  moreRef,
  floorplanRef,
  amenitiesRef,
  developerRef,
  similarRef
}) => {
  return (
    <Box 
      ref={navRef}
      sx={{
        backgroundColor: '#0B1011',
        borderBottom: '2px solid #78CADC',
        borderTop: '2px solid #78CADC',
        position: isSticky ? 'fixed' : 'static',
        top: isSticky ? `${headerHeight}px` : 'auto',
        left: 0,
        right: 0,
        zIndex: 1000,
        transition: 'all 0.3s ease',
        boxShadow: isSticky ? '0 2px 20px rgba(0, 0, 0, 0.5)' : 'none',
        borderBottomLeftRadius: '16px',
        borderBottomRightRadius: '16px'
      }}
    >
      <Container maxWidth="xl" sx={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        px: 0
      }}>
        {showLeftScroll && (
          <IconButton
            onClick={() => handleScroll('left')}
            sx={{
              position: 'absolute',
              left: 0,
              zIndex: 1,
              backgroundColor: '#0B1011',
              color: '#78CADC',
              '&:hover': {
                backgroundColor: 'rgba(120, 202, 220, 0.1)'
              }
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}

        <Box
          ref={tabsRef}
          sx={{
            flex: 1,
            overflowX: 'hidden',
            position: 'relative',
            display: 'flex'
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => {
              setActiveTab(newValue);
              const refMap = {
                overview: overviewRef,
                highlights: highlightsRef,
                around: aroundRef,
                more: moreRef,
                floorplan: floorplanRef,
                amenities: amenitiesRef,
                developer: developerRef,
                similar: similarRef
              };
              if (refMap[newValue]) {
                scrollToSection(refMap[newValue]);
              }
            }}
            variant="scrollable"
            scrollButtons={false}
            sx={{
              flex: 1,
              '& .MuiTabs-scroller': {
                overflowX: 'auto !important',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#78CADC',
                height: '4px'
              },
              '& .MuiTab-root': {
                color: '#fff',
                fontFamily: '"Poppins", sans-serif',
                fontWeight: 600,
                textTransform: 'none',
                fontSize: '0.95rem',
                minWidth: 'unset',
                px: 3,
                '&.Mui-selected': {
                  color: '#78CADC'
                }
              }
            }}
          >
            <Tab label="Overview" value="overview" />
            <Tab label="Highlights" value="highlights" />
            <Tab label="Around This Project" value="around" />
            <Tab label="More About Project" value="more" />
            <Tab label="Floor Plan" value="floorplan" />
            <Tab label="Amenities" value="amenities" />
            <Tab label="About Developer" value="developer" />
            <Tab label="Similar Projects" value="similar" />
          </Tabs>
        </Box>

        {showRightScroll && (
          <IconButton
            onClick={() => handleScroll('right')}
            sx={{
              position: 'absolute',
              right: 0,
              zIndex: 1,
              backgroundColor: '#0B1011',
              color: '#78CADC',
              '&:hover': {
                backgroundColor: 'rgba(120, 202, 220, 0.1)'
              }
            }}
          >
            <ChevronRight />
          </IconButton>
        )}
      </Container>
    </Box>
  );
};

export default PropertyNavigation;