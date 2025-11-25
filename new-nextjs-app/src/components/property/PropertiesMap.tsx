'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, ToggleButtonGroup, ToggleButton, Chip } from '@mui/material';
import { School, LocalHospital, ShoppingCart, Train, Park } from '@mui/icons-material';
import { MAPPLS_CONFIG } from '../../config/maps';

interface Property {
  _id: string;
  title: string;
  price: number;
  location?: {
    coordinates: [number, number];
  };
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface PropertiesMapProps {
  properties: Property[];
  selectedProperty?: Property | null;
  userLocation?: UserLocation | null;
  onMarkerClick?: (property: Property) => void;
  height?: string | number;
  searchQuery?: string;
  showAmenities?: boolean;
  enableClustering?: boolean;
}

const PropertiesMap: React.FC<PropertiesMapProps> = ({
  properties,
  selectedProperty,
  userLocation,
  onMarkerClick,
  height = '500px',
  searchQuery,
  showAmenities = false,
  enableClustering = true
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowsRef = useRef<any[]>([]);
  const clusterRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [containerId] = useState(() => `properties-map-container-${Math.random().toString(36).substr(2, 9)}`);
  const [refreshKey, setRefreshKey] = useState(0);
  const [amenityLayers, setAmenityLayers] = useState({
    schools: false,
    hospitals: false,
    malls: false,
    metro: false,
    parks: false
  });



  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) return;

    const loadMapplsScript = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if script already exists
        if (window.mappls) {
          console.log('Mappls SDK already loaded');
          setScriptLoaded(true);
          resolve();
          return;
        }

        // Check if script already exists in DOM
        const existingScript = document.querySelector('script[src*="mappls"]');
        if (existingScript) {
          console.log('Mappls script already in DOM, waiting for load');
          existingScript.addEventListener('load', () => {
            setScriptLoaded(true);
            resolve();
          });
          return;
        }

        // Use centralized API key configuration
        if (!MAPPLS_CONFIG.apiKey) {
          setMapError('Mappls API key not found. Please check your environment variables.');
          reject(new Error('API key not found'));
          return;
        }

        console.log('Loading Mappls script with API key:', MAPPLS_CONFIG.apiKey);
        console.log('Script URL:', MAPPLS_CONFIG.getScriptUrl());

        const script = document.createElement('script');
        script.src = MAPPLS_CONFIG.getScriptUrl();
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('Mappls script loaded successfully');
          setScriptLoaded(true);
          resolve();
        };
        
        script.onerror = (error) => {
          console.error('Failed to load Mappls script with primary URL:', error);
          console.log('Trying alternative script URL...');
          
          // Try alternative URL
          const altScript = document.createElement('script');
          altScript.src = MAPPLS_CONFIG.getAlternativeScriptUrl();
          altScript.async = true;
          altScript.defer = true;
          
          altScript.onload = () => {
            console.log('Mappls script loaded successfully with alternative URL');
            setScriptLoaded(true);
            resolve();
          };
          
          altScript.onerror = (altError) => {
            console.error('Failed to load Mappls script with alternative URL:', altError);
            setMapError('Failed to load Mappls Maps. Please check your API key.');
            reject(new Error('Script load failed'));
          };
          
          document.head.appendChild(altScript);
        };
        
        document.head.appendChild(script);
      });
    };

    loadMapplsScript().catch(console.error);
  }, [scriptLoaded]);

  // Function to add markers to the map
  const addMarkersToMap = useCallback(() => {
    if (!mapInstanceRef.current) {
      console.warn('Map instance not available for marker creation');
      return;
    }

    // Clean up existing markers
    markersRef.current.forEach(marker => {
      try {
        if (marker && marker.remove) {
          marker.remove();
        }
      } catch (e) {
        console.warn('Error removing marker:', e);
      }
    });
    markersRef.current = [];

    // Filter properties with valid coordinates
    const validProperties = properties.filter(property => 
      property.location?.coordinates?.length === 2
    );

    console.log('PropertiesMap Debug:', {
      totalProperties: properties.length,
      validProperties: validProperties.length,
      properties: properties.map(p => ({
        id: p._id,
        title: p.title,
        hasLocation: !!p.location,
        coordinates: p.location?.coordinates
      }))
    });

    if (validProperties.length === 0) {
      console.log('No valid properties found with coordinates');
      setMapLoaded(true);
      setMapError(null);
      return;
    }

    // Calculate bounds for multiple properties (only if no user location)
    if (validProperties.length > 1 && !userLocation) {
      const coordinates = validProperties.map(property => ({
        lat: property.location!.coordinates[1],
        lng: property.location!.coordinates[0]
      }));

      console.log('Fitting bounds to show all properties:', coordinates);
      // Mappls fitBounds expects an array of [lng, lat] coordinates
      const mapplsCoordinates = coordinates.map(coord => [coord.lng, coord.lat]);
      try {
        mapInstanceRef.current.fitBounds(mapplsCoordinates);
        console.log('Map bounds fitted successfully');
      } catch (error) {
        console.warn('Failed to fit bounds, centering on first property:', error);
        const firstProperty = validProperties[0];
        mapInstanceRef.current.setCenter([firstProperty.location!.coordinates[0], firstProperty.location!.coordinates[1]]);
        mapInstanceRef.current.setZoom(12);
      }
    } else if (validProperties.length === 1 && !userLocation) {
      // For single property, ensure it's visible
      const property = validProperties[0];
      const position = {
        lat: property.location!.coordinates[1],
        lng: property.location!.coordinates[0]
      };
      console.log('Centering map on single property:', position);
      try {
        mapInstanceRef.current.setCenter([position.lng, position.lat]); // Already in [lng, lat] format
        mapInstanceRef.current.setZoom(15);
        console.log('Map centered on single property successfully');
      } catch (error) {
        console.warn('Failed to center map on single property:', error);
      }
    }

    // Add markers for each property
    const newMarkers = [];
    
    for (let i = 0; i < validProperties.length; i++) {
      const property = validProperties[i];
      // Coordinates are already in [lng, lat] format from database
      // Don't swap them - use directly for marker position
      const position = {
        lng: property.location!.coordinates[0], // longitude is first element
        lat: property.location!.coordinates[1]  // latitude is second element
      };

      const isSelected = selectedProperty?._id === property._id;


      // Create marker using proper Mappls SDK format
      let marker;
      try {
        // Mappls markers use [lat, lng] format for position
        // Swap coordinates from database [lng, lat] to [lat, lng]
        marker = new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: [property.location!.coordinates[1], property.location!.coordinates[0]], // [lat, lng]
          title: property.title
        });
        
        // Try to add custom icon after marker creation
        try {
          marker.setIcon({
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="8" fill="${isSelected ? 'var(--color-primary)' : 'var(--color-secondary)'}" stroke="var(--color-text-primary)" stroke-width="2"/>
              </svg>
            `)}`,
            scaledSize: { width: 20, height: 20 }
          });
        } catch (iconError) {
          console.warn('Failed to set custom icon, using default marker:', iconError);
        }
      } catch (error) {
        console.error('Failed to create marker for property:', property.title, error);
        continue; // Skip this marker and continue with others
      }

      // Create info window content
      const infoWindowContent = `
        <div style="padding: 8px; min-width: 200px; font-family: Arial, sans-serif;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold; color: #333;">
            ${property.title || 'Property'}
          </h3>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            <strong>Price:</strong> ₹${property.price?.toLocaleString('en-IN') || 'N/A'}
          </p>
          ${property.address ? `
            <p style="margin: 4px 0; font-size: 12px; color: #666;">
              <strong>Location:</strong> ${property.address.street || ''} ${property.address.city || ''}
            </p>
          ` : ''}
          <button 
            onclick="window.openPropertyDetail && window.openPropertyDetail('${property._id}')"
            style="margin-top: 8px; padding: 6px 12px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
          >
            View Details
          </button>
        </div>
      `;

      // Create info window
      let infoWindow: any = null;
      try {
        infoWindow = new window.mappls.InfoWindow({
          content: infoWindowContent
        });
        infoWindowsRef.current.push(infoWindow);
      } catch (infoError) {
        console.warn('Failed to create info window:', infoError);
      }

      // Add click listener
      try {
        marker.addListener('click', () => {
          console.log('Marker clicked:', property.title);
          
          // Close all other info windows
          infoWindowsRef.current.forEach((iw: any) => {
            try {
              if (iw && iw.close) iw.close();
            } catch (e) {
              console.warn('Error closing info window:', e);
            }
          });

          // Open info window for this marker
          if (infoWindow) {
            try {
              infoWindow.open(mapInstanceRef.current, marker);
            } catch (openError) {
              console.warn('Failed to open info window:', openError);
            }
          }

          if (onMarkerClick) {
            onMarkerClick(property);
          }
        });
      } catch (listenerError) {
        console.warn('Failed to add click listener to marker:', listenerError);
      }

      newMarkers.push(marker);
    }

    // Add user location marker if available
    if (userLocation) {
      try {
        const userMarker = new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: [userLocation.longitude, userLocation.latitude], // Mappls expects [lng, lat]
          icon: {
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="var(--color-success)" stroke="var(--color-success)" stroke-width="2"/>
                <circle cx="12" cy="12" r="4" fill="var(--color-white)"/>
              </svg>
            `)}`,
            scaledSize: { width: 24, height: 24 }
          }
        });
        console.log('User location marker created successfully');
      } catch (error) {
        console.warn('Failed to create user location marker:', error);
      }
    }

    // Apply clustering if enabled and we have multiple markers
    // Note: MarkerClusterer may not be available in all MAPPLS SDK versions
    if (enableClustering && newMarkers.length > 1) {
      try {
        // Check if MarkerClusterer is available (using type assertion for TypeScript)
        const mapplsAny = window.mappls as any;
        if (mapplsAny?.MarkerClusterer) {
          // Remove existing cluster
          if (clusterRef.current) {
            clusterRef.current.clearMarkers();
          }

          // Create new cluster
          clusterRef.current = new mapplsAny.MarkerClusterer({
            map: mapInstanceRef.current,
            markers: newMarkers,
            algorithm: mapplsAny.GridAlgorithm ? new mapplsAny.GridAlgorithm({ gridSize: 60 }) : undefined,
            renderer: {
              render: ({ count, position }: any) => {
                return new window.mappls.Marker({
                  position: position,
                  icon: {
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#1976d2" opacity="0.8" stroke="#fff" stroke-width="2"/>
                        <text x="20" y="26" font-size="14" font-weight="bold" fill="white" text-anchor="middle">${count}</text>
                      </svg>
                    `)}`,
                    scaledSize: { width: 40, height: 40 }
                  }
                });
              }
            }
          });
        } else {
          // MarkerClusterer not available, use regular markers
          markersRef.current = newMarkers;
        }
      } catch (clusterError) {
        console.warn('Failed to create marker cluster:', clusterError);
        markersRef.current = newMarkers;
      }
    } else {
      markersRef.current = newMarkers;
    }

    setMapLoaded(true);
    setMapError(null);
  }, [properties, selectedProperty, userLocation, onMarkerClick, enableClustering]);

  // Initialize map and markers
  useEffect(() => {
    
    if (!scriptLoaded || !properties || properties.length === 0 || mapInitialized) {
      return;
    }

    // Check if Mappls SDK is available
    if (!window.mappls || !window.mappls.Map) {
      console.warn('Mappls SDK not available, retrying in 1 second');
      console.log('window.mappls:', window.mappls);
      console.log('window.mappls.Map:', window.mappls?.Map);
      setTimeout(() => {
        if (window.mappls && window.mappls.Map) {
          console.log('Mappls SDK now available, retrying map initialization');
          // Trigger re-initialization by updating a state or calling the effect again
        }
      }, 1000);
      return;
    }

    // Don't clean up existing map if it's already initialized
    if (mapInstanceRef.current && mapInitialized) {
      console.log('Map already initialized, skipping cleanup');
      return;
    }

    // Clean up existing map only if not initialized
    if (mapInstanceRef.current && !mapInitialized) {
      try {
        mapInstanceRef.current.remove();
      } catch (e) {
        console.warn('Error removing map:', e);
      }
    }

    const initializeMap = () => {
      try {
        if (!window.mappls) {
          setMapError('Mappls SDK not loaded');
          return;
        }


        // Get the container element by ID instead of ref
        const container = document.getElementById(containerId) || mapRef.current;
        
        if (!container) {
          console.warn('Map container not found, retrying...');
          setTimeout(initializeMap, 500);
          return;
        }

        // Verify the container element is valid and visible
        if (!container.offsetParent || container.offsetWidth === 0 || container.offsetHeight === 0) {
          console.warn('Map container not ready, retrying...', {
            container: !!container,
            offsetParent: !!container?.offsetParent,
            width: container?.offsetWidth,
            height: container?.offsetHeight
          });
          setTimeout(initializeMap, 500);
          return;
        }

        console.log('Container ready:', {
          width: container.offsetWidth,
          height: container.offsetHeight,
          visible: container.offsetParent !== null,
          containerId
        });

        // Filter properties with valid coordinates
        const validProperties = properties.filter(property => 
          property.location?.coordinates?.length === 2
        );

        if (validProperties.length === 0) {
          console.log('No valid properties found with coordinates');
          setMapLoaded(true);
          setMapError(null);
          return;
        }

        // Calculate center and zoom
        let mapCenter: [number, number];
        let mapZoom: number;

        if (userLocation) {
          // Center on user location
          mapCenter = [userLocation.longitude, userLocation.latitude];
          mapZoom = 12;
          console.log('Initializing map centered on user location:', mapCenter);
        } else if (validProperties.length > 0) {
          // Center on first property with moderate zoom
          const firstProperty = validProperties[0];
          // Mappls expects [lng, lat] for map center
          mapCenter = firstProperty.location!.coordinates; // Database is [lng, lat]
          mapZoom = 8; // Fixed moderate zoom level
          console.log('Initializing map centered on first property:', mapCenter, 'from property:', firstProperty.title);
          console.log('Property coordinates breakdown:', {
            raw: firstProperty.location!.coordinates,
            lng: firstProperty.location!.coordinates[0],
            lat: firstProperty.location!.coordinates[1]
          });
        } else {
          // Default to India center (Delhi)
          mapCenter = [77.2090, 28.6139];
          mapZoom = 6; // Show more of India
          console.log('Initializing map with default center (India):', mapCenter);
        }

        console.log('Final map center and zoom:', { mapCenter, mapZoom });

        // Add a delay to ensure Mappls SDK is fully ready
        setTimeout(() => {
          try {
            console.log('Creating Mappls map with:', { mapCenter, mapZoom, container });
            
            // Initialize map with proper Mappls SDK configuration
            mapInstanceRef.current = new window.mappls.Map(container, {
              center: mapCenter, // mapCenter is already in [lng, lat] format
              zoom: mapZoom,
              zoomControl: true,
              fullscreenControl: true,
              scrollWheel: true
            });

            console.log('Map initialized successfully with center:', mapCenter, 'zoom:', mapZoom);
            setMapInitialized(true);

            // Add markers immediately after map creation
            addMarkersToMap();

          } catch (mapError) {
            console.error('Error creating Mappls map:', mapError);
            setMapError('Failed to create map: ' + mapError.message);
          }
        }, 1000);

      } catch (err: any) {
        console.error('Error creating Mappls map:', err);
        setMapError('Failed to load map');
      }
    };

    // Wait for the container to be ready with retry mechanism
    let retryCount = 0;
    const maxRetries = 20;
    
    const tryInitialize = () => {
      const container = document.getElementById(containerId) || mapRef.current;
      if (!container || !container.offsetParent || container.offsetWidth === 0 || container.offsetHeight === 0) {
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Map container not ready, retry ${retryCount}/${maxRetries}...`, {
            container: !!container,
            offsetParent: !!container?.offsetParent,
            width: container?.offsetWidth,
            height: container?.offsetHeight,
            containerId
          });
          setTimeout(tryInitialize, 300);
        } else {
          setMapError('Map container failed to initialize after multiple retries');
        }
        return;
      }
      console.log('Container is ready, initializing map...');
      initializeMap();
    };
    
    const timer = setTimeout(tryInitialize, 500);
    
    return () => {
      clearTimeout(timer);
      // Cleanup markers
      markersRef.current.forEach(marker => {
        try {
          if (marker && marker.remove) {
            marker.remove();
          }
        } catch (e) {
          console.warn('Error removing marker:', e);
        }
      });
    };
  }, [scriptLoaded, properties, selectedProperty, userLocation, addMarkersToMap, mapInitialized]);

  // Update markers when properties change (only if map is already initialized)
  useEffect(() => {
    if (mapInitialized && mapInstanceRef.current && properties && properties.length > 0) {
      console.log('Updating markers for existing map');
      addMarkersToMap();
    }
  }, [properties, selectedProperty, userLocation, addMarkersToMap, mapInitialized]);

  // Center map on search results when search query changes
  useEffect(() => {
    if (mapInitialized && mapInstanceRef.current && searchQuery && properties && properties.length > 0) {
      console.log('Centering map on search results for:', searchQuery);
      const validProperties = properties.filter(property => 
        property.location?.coordinates?.length === 2
      );
      
      if (validProperties.length > 0) {
        if (validProperties.length === 1) {
          // Center on single result - Mappls expects [lng, lat] for setCenter
          const property = validProperties[0];
          mapInstanceRef.current.setCenter(property.location!.coordinates);
          mapInstanceRef.current.setZoom(15);
        } else {
          // Fit bounds for multiple results - Mappls expects [lng, lat] for fitBounds
          const mapplsCoordinates = validProperties.map(property => property.location!.coordinates);
          mapInstanceRef.current.fitBounds(mapplsCoordinates);
        }
      }
    }
  }, [searchQuery, properties, mapInitialized]);

  // Auto-refresh map every 15 seconds
  useEffect(() => {
    if (!mapInitialized) return;

    const interval = setInterval(() => {
      console.log('Auto-refreshing map markers...');
      setRefreshKey(prev => prev + 1);
      if (mapInstanceRef.current) {
        addMarkersToMap();
      }
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [mapInitialized, addMarkersToMap]);

  // Add amenity markers - MUST be before any early returns to maintain hook order
  useEffect(() => {
    if (!mapInitialized || !mapInstanceRef.current || !showAmenities) return;

    // This would integrate with MAPPLS Places API or similar
    // For now, we'll use the nearbyLocalities data from properties
    const amenityMarkers: any[] = [];

    properties.forEach(property => {
      if (!property.location?.coordinates) return;

      const lat = property.location.coordinates[1];
      const lng = property.location.coordinates[0];

      // Add school marker if property has nearby school
      if (amenityLayers.schools && (property as any).nearbyLocalities?.hasSchool) {
        try {
          const marker = new window.mappls.Marker({
            map: mapInstanceRef.current,
            position: [lat + 0.001, lng + 0.001], // Offset slightly
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" fill="#4CAF50" opacity="0.7"/>
                  <text x="12" y="16" font-size="12" fill="white" text-anchor="middle">S</text>
                </svg>
              `)}`,
              scaledSize: { width: 24, height: 24 }
            },
            title: 'School Nearby'
          });
          amenityMarkers.push(marker);
        } catch (e) {
          console.warn('Failed to add school marker:', e);
        }
      }

      // Similar for other amenities...
    });

    return () => {
      amenityMarkers.forEach(marker => {
        try {
          if (marker && marker.remove) marker.remove();
        } catch (e) {
          console.warn('Error removing amenity marker:', e);
        }
      });
    };
  }, [mapInitialized, amenityLayers, properties, showAmenities]);

  // Setup global function for info window button - MUST be before any early returns to maintain hook order
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).openPropertyDetail = (propertyId: string) => {
        if (onMarkerClick) {
          const property = properties.find(p => p._id === propertyId);
          if (property) {
            onMarkerClick(property);
          }
        }
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).openPropertyDetail;
      }
    };
  }, [properties, onMarkerClick]);

  // Early returns AFTER all hooks to maintain consistent hook order
  if (!properties || properties.length === 0) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Typography variant="body2" color="text.secondary">
          No properties to display on map.
        </Typography>
      </Box>
    );
  }

  if (!MAPPLS_CONFIG.apiKey) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Typography variant="body2" color="text.secondary">
          Map unavailable. Missing Mappls API key.
        </Typography>
      </Box>
    );
  }

  if (mapError) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Typography variant="body2" color="error">
          Map unavailable. {mapError}
        </Typography>
      </Box>
    );
  }

  console.log('🔍 PropertiesMap render - mapLoaded:', mapLoaded, 'mapError:', mapError, 'scriptLoaded:', scriptLoaded);

  return (
    <Box sx={{ position: 'relative', height: height, borderRadius: '12px', overflow: 'hidden' }}>
      {/* Amenity Layer Controls */}
      {showAmenities && mapLoaded && (
        <Box sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1000,
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Typography variant="caption" sx={{ fontWeight: 600, mb: 0.5 }}>
            Nearby Amenities
          </Typography>
          <Chip
            icon={<School />}
            label="Schools"
            size="small"
            color={amenityLayers.schools ? 'primary' : 'default'}
            onClick={() => setAmenityLayers(prev => ({ ...prev, schools: !prev.schools }))}
            sx={{ mb: 0.5 }}
          />
          <Chip
            icon={<LocalHospital />}
            label="Hospitals"
            size="small"
            color={amenityLayers.hospitals ? 'primary' : 'default'}
            onClick={() => setAmenityLayers(prev => ({ ...prev, hospitals: !prev.hospitals }))}
            sx={{ mb: 0.5 }}
          />
          <Chip
            icon={<ShoppingCart />}
            label="Malls"
            size="small"
            color={amenityLayers.malls ? 'primary' : 'default'}
            onClick={() => setAmenityLayers(prev => ({ ...prev, malls: !prev.malls }))}
            sx={{ mb: 0.5 }}
          />
          <Chip
            icon={<Train />}
            label="Metro"
            size="small"
            color={amenityLayers.metro ? 'primary' : 'default'}
            onClick={() => setAmenityLayers(prev => ({ ...prev, metro: !prev.metro }))}
            sx={{ mb: 0.5 }}
          />
          <Chip
            icon={<Park />}
            label="Parks"
            size="small"
            color={amenityLayers.parks ? 'primary' : 'default'}
            onClick={() => setAmenityLayers(prev => ({ ...prev, parks: !prev.parks }))}
          />
        </Box>
      )}

      {!mapLoaded && (
        <Box sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-surface)',
          zIndex: 1,
          p: 2
        }}>
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Loading map...
          </Typography>
        </Box>
      )}
      
      <div
        ref={mapRef}
        id={containerId}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          border: '1px solid var(--color-border)',
          minHeight: typeof height === 'string' ? height : `${height}px`,
          position: 'relative'
        }}
      />
    </Box>
  );
};

export default PropertiesMap;
