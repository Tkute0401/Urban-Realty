import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { mappls } from 'mappls-web-maps';
import './PropertyMap.css';

// Styles moved to CSS to avoid inline-style usage

const PropertyMap = ({ location, address }) => {
  const mapRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Use environment variable from Vite
  const mapplsApiKey = import.meta.env.VITE_MAPPLS_API_KEY;

  useEffect(() => {
    if (!mapplsApiKey || !location || !location.coordinates || location.coordinates.length !== 2) {
      return;
    }

    // Initialize Mappls
    const mapplsInstance = new mappls();
    mapplsInstance.initialize(mapplsApiKey, {
      mapSdkLibraries: ['marker', 'infoWindow']
    }, () => {
      console.log('🔧 Mappls initialized successfully');
      setIsLoaded(true);
    });

    return () => {
      // Cleanup if needed
    };
  }, [mapplsApiKey, location]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !location || !location.coordinates || location.coordinates.length !== 2) {
      return;
    }

    try {
      const center = {
        lat: location.coordinates[1],
        lng: location.coordinates[0]
      };

      // Create map
      const mapplsInstance = new mappls();
      const map = mapplsInstance.Map({
        id: mapRef.current,
        center: center,
        zoom: 15
      });

      // Add marker
      const marker = mapplsInstance.Marker({
        map: map,
        position: center
      });

      // Add info window
      const infoWindow = mapplsInstance.InfoWindow({
        map: map,
        position: center,
        content: `
          <div style="padding: 10px;">
            <h4>${address?.street || 'Address'}</h4>
            <p>${address?.city || ''}, ${address?.state || ''} ${address?.zipCode || ''}</p>
          </div>
        `
      });

      // Show info window on marker click
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

    } catch (err) {
      console.error('Error creating Mappls map:', err);
      setError('Failed to load map');
    }
  }, [isLoaded, location, address]);

  if (!location || !location.coordinates || location.coordinates.length !== 2) {
    return (
      <Typography variant="body2" color="text.secondary">
        Location information is not available.
      </Typography>
    );
  }

  if (!mapplsApiKey) {
    return (
      <Typography variant="body2" color="text.secondary">
        Map unavailable. Missing Mappls API key.
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="body2" color="error">
        Map unavailable. {error}
      </Typography>
    );
  }

  return (
    <div 
      ref={mapRef}
      className="map-container map-container--sm"
      style={{
        height: '300px',
        width: '100%'
      }}
    />
  );
};

export default PropertyMap;