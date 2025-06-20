import { useEffect, useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { LoadScript, GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '8px',
  border: '1px solid #78CADC'
};

const PropertiesMap = ({ properties, selectedProperty, onMarkerClick }) => {
  const mapRef = useRef(null);
  const [activeMarker, setActiveMarker] = useState(null);
  const [bounds, setBounds] = useState(null);
  
  // Use environment variable from Vite
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (properties?.length > 0 && mapRef.current) {
      // Calculate bounds to fit all markers
      const newBounds = new window.google.maps.LatLngBounds();
      properties.forEach(property => {
        if (property.location?.coordinates?.length === 2) {
          newBounds.extend({
            lat: property.location.coordinates[1],
            lng: property.location.coordinates[0]
          });
        }
      });
      setBounds(newBounds);
      mapRef.current.fitBounds(newBounds);
    }
  }, [properties]);

  if (!properties || properties.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No properties to display on map.
      </Typography>
    );
  }

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };

  return (
    <LoadScript googleMapsApiKey={googleMapsApiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={10}
        onLoad={(map) => {
          mapRef.current = map;
          // Fit bounds after map loads
          if (bounds) {
            map.fitBounds(bounds);
          }
        }}
        options={{
          styles: [
            {
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#1d2c2e"
                }
              ]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#8ec3b9"
                }
              ]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1a3646"
                }
              ]
            },
            {
              "featureType": "administrative.country",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#4b6878"
                }
              ]
            },
            {
              "featureType": "administrative.land_parcel",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#64779e"
                }
              ]
            },
            {
              "featureType": "administrative.province",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#4b6878"
                }
              ]
            },
            {
              "featureType": "landscape.man_made",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#334e87"
                }
              ]
            },
            {
              "featureType": "landscape.natural",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#023e58"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#283d6a"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#6f9ba5"
                }
              ]
            },
            {
              "featureType": "poi",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1d2c4d"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#023e58"
                }
              ]
            },
            {
              "featureType": "poi.park",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#3C7680"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#304a7d"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#98a5be"
                }
              ]
            },
            {
              "featureType": "road",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1d2c4d"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#2c6675"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "geometry.stroke",
              "stylers": [
                {
                  "color": "#255763"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#b0d5ce"
                }
              ]
            },
            {
              "featureType": "road.highway",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#023e58"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#98a5be"
                }
              ]
            },
            {
              "featureType": "transit",
              "elementType": "labels.text.stroke",
              "stylers": [
                {
                  "color": "#1d2c4d"
                }
              ]
            },
            {
              "featureType": "transit.line",
              "elementType": "geometry.fill",
              "stylers": [
                {
                  "color": "#283d6a"
                }
              ]
            },
            {
              "featureType": "transit.station",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#3a4762"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "geometry",
              "stylers": [
                {
                  "color": "#0e1626"
                }
              ]
            },
            {
              "featureType": "water",
              "elementType": "labels.text.fill",
              "stylers": [
                {
                  "color": "#4e6d70"
                }
              ]
            }
          ]
        }}
      >
        {properties.map((property, index) => {
          if (!property.location?.coordinates || property.location.coordinates.length !== 2) {
            return null;
          }
          
          const position = {
            lat: property.location.coordinates[1],
            lng: property.location.coordinates[0]
          };
          
          const isSelected = selectedProperty?._id === property._id;
          const markerColor = isSelected ? '#FF4081' : '#78CADC';
          
          return (
            <Marker
              key={property._id}
              position={position}
              onClick={() => {
                handleActiveMarker(index);
                if (onMarkerClick) {
                  onMarkerClick(property);
                }
              }}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: markerColor,
                fillOpacity: 1,
                strokeColor: '#0B1011',
                strokeWeight: 1,
                scale: isSelected ? 10 : 8
              }}
            >
              {activeMarker === index && (
                <InfoWindow onCloseClick={() => setActiveMarker(null)}>
                  <div style={{ color: '#0B1011', maxWidth: '200px' }}>
                    <h3 style={{ margin: '4px 0', fontSize: '16px' }}>{property.title}</h3>
                    <p style={{ margin: '4px 0', fontSize: '14px' }}>
                      {property.address?.street}, {property.address?.city}
                    </p>
                    <p style={{ margin: '4px 0', fontSize: '14px', fontWeight: 'bold' }}>
                      {property.price ? `$${property.price.toLocaleString()}` : 'Price not available'}
                    </p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default PropertiesMap;