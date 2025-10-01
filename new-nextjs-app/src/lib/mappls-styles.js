// Mappls map styles configuration
// Mappls uses different style options compared to Google Maps

export const getMapplsMapStyle = () => {
  // Mappls provides several built-in styles
  // You can choose from: 'mappls://styles/streets', 'mappls://styles/satellite', 'mappls://styles/hybrid'
  return 'mappls://styles/streets';
};

export const getMapplsMapOptions = () => {
  return {
    style: getMapplsMapStyle(),
    interactive: true,
    bearing: 0,
    pitch: 0,
    attributionControl: true,
    logoPosition: 'bottom-left'
  };
};

// Custom marker styles for Mappls
export const getMarkerStyles = (isSelected = false) => {
  return {
    width: isSelected ? '20px' : '16px',
    height: isSelected ? '20px' : '16px',
    backgroundColor: isSelected ? '#F76B1C' : '#1A2BFF',
    border: '2px solid #0c0d0e',
    borderRadius: '50%',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '10px',
    color: 'white',
    fontWeight: 'bold'
  };
};

// Map theme configurations
export const MAP_THEMES = {
  LIGHT: 'mappls://styles/streets',
  DARK: 'mappls://styles/dark', // If available
  SATELLITE: 'mappls://styles/satellite',
  HYBRID: 'mappls://styles/hybrid'
};

// Default map configuration
export const DEFAULT_MAP_CONFIG = {
  center: [77.2090, 28.6139], // Delhi coordinates
  zoom: 10,
  style: MAP_THEMES.LIGHT,
  interactive: true,
  bearing: 0,
  pitch: 0
};

