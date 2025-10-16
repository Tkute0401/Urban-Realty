'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { MAPPLS_CONFIG } from '../../config/maps';

interface Project {
  _id: string;
  name: string;
  location?: {
    coordinates?: {
      type: string;
      coordinates: [number, number];
    };
    address?: string;
    city?: string;
    state?: string;
  };
}

interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface ProjectsMapProps {
  projects: Project[];
  selectedProject?: Project | null;
  userLocation?: UserLocation | null;
  onMarkerClick?: (project: Project) => void;
  height?: string;
}

const ProjectsMap: React.FC<ProjectsMapProps> = ({
  projects,
  selectedProject,
  userLocation,
  onMarkerClick,
  height = '500px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Load Mappls script
  useEffect(() => {
    const loadMapScript = () => {
      if (window.mappls) {
        setScriptLoaded(true);
        return;
      }

      const existingScript = document.querySelector('script[src*="mappls"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          setScriptLoaded(true);
        });
        return;
      }

      // Use centralized API key configuration
      if (!MAPPLS_CONFIG.apiKey) {
        setMapError('Mappls API key not found');
        return;
      }

      const script = document.createElement('script');
      script.src = MAPPLS_CONFIG.getScriptUrl();
      script.async = true;
      script.defer = true;
      
      script.onload = () => setScriptLoaded(true);
      script.onerror = () => setMapError('Failed to load Mappls Maps');
      
      document.head.appendChild(script);
    };

    loadMapScript();
  }, []);

  // Initialize map and markers
  useEffect(() => {
    if (!scriptLoaded || !projects || projects.length === 0) {
      return;
    }

    // Ensure mapRef.current exists
    if (!mapRef.current) {
      console.warn('Map ref not available');
      return;
    }

    // Clean up existing markers
    markersRef.current.forEach(marker => {
      try {
        marker.remove();
      } catch (e) {
        console.warn('Error removing marker:', e);
      }
    });
    markersRef.current = [];

    // Clean up existing map
    if (mapInstanceRef.current) {
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

        // Verify the container element is valid and visible
        const container = mapRef.current;
        if (!container || !container.offsetParent) {
          console.warn('Map container not ready, retrying...');
          setTimeout(initializeMap, 200);
          return;
        }

        // Filter projects with valid coordinates
        const validProjects = projects.filter(
          p => p.location?.coordinates?.coordinates?.length === 2
        );

        if (validProjects.length === 0) {
          setMapError('No projects with valid coordinates');
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
        } else if (validProjects.length > 0) {
          // Center on first project
          const firstProject = validProjects[0];
          mapCenter = firstProject.location.coordinates.coordinates;
          mapZoom = validProjects.length > 1 ? 6 : 12;
          console.log('Initializing map centered on first project:', mapCenter);
        } else {
          // Default to Delhi
          mapCenter = [77.2090, 28.6139];
          mapZoom = 10;
          console.log('Initializing map with default center (Delhi):', mapCenter);
        }

        // Initialize map
        mapInstanceRef.current = new window.mappls.Map(container, {
          center: mapCenter,
          zoom: mapZoom,
          zoomControl: true,
          fullscreenControl: true,
          scrollWheel: true,
        });

        // Add markers for each project
        const newMarkers = validProjects.map(project => {
          const [lng, lat] = project.location.coordinates.coordinates;
          const isSelected = selectedProject?._id === project._id;

          const marker = new window.mappls.Marker({
            map: mapInstanceRef.current,
            position: [lng, lat], // Mappls expects [lng, lat] format
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 0C8.373 0 3 5.373 3 12c0 8.25 12 28 12 28s12-19.75 12-28c0-6.627-5.373-12-12-12z" 
                        fill="${isSelected ? '#FF4081' : '#78CADC'}" 
                        stroke="#fff" 
                        stroke-width="2"/>
                  <circle cx="15" cy="12" r="5" fill="#fff"/>
                </svg>
              `)}`,
              width: 30,
              height: 40
            }
          });

          // Add click listener
          marker.addListener('click', () => {
            if (onMarkerClick) {
              onMarkerClick(project);
            }
          });

          // Add info window
          if (project.name) {
            const infoWindow = new window.mappls.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 250px;">
                  <h3 style="margin: 0 0 5px 0; color: var(--color-text-primary); font-size: 14px; font-weight: bold;">
                    ${project.name}
                  </h3>
                  <p style="margin: 0; color: var(--color-text-muted); font-size: 12px;">
                    ${project.location.city || ''}, ${project.location.state || ''}
                  </p>
                </div>
              `,
              position: [lng, lat] // Mappls expects [lng, lat] format
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current);
            });
          }

          return marker;
        });

        // Add user location marker if available
        if (userLocation) {
          try {
            const userMarker = new window.mappls.Marker({
              map: mapInstanceRef.current,
              position: {
                lat: userLocation.latitude,
                lng: userLocation.longitude
              },
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" fill="#4CAF50" stroke="#2E7D32" stroke-width="2"/>
                    <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
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

        markersRef.current = newMarkers;

        // Fit bounds if multiple projects (only if no user location)
        if (validProjects.length > 1 && !userLocation) {
          const bounds = validProjects.map(p => ({
            lat: p.location.coordinates.coordinates[1],
            lng: p.location.coordinates.coordinates[0]
          }));
          mapInstanceRef.current.fitBounds(bounds);
        }

        setMapLoaded(true);
        setMapError(null);
      } catch (error: any) {
        console.error('Error initializing map:', error);
        setMapError(`Failed to initialize map: ${error?.message || 'Unknown error'}`);
      }
    };

    // Delay to ensure DOM is fully ready
    const timer = setTimeout(initializeMap, 300);
    
    return () => {
      clearTimeout(timer);
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (e) {
          console.warn('Error cleaning up marker:', e);
        }
      });
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error cleaning up map:', e);
        }
      }
    };
  }, [scriptLoaded, projects, selectedProject, onMarkerClick]);

  if (!projects || projects.length === 0) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)'
      }}>
        <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
          No projects to display on map
        </Typography>
      </Box>
    );
  }

  if (mapError) {
    return (
      <Box sx={{
        height: height,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>
          {mapError}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative', height: height, borderRadius: '12px', overflow: 'hidden' }}>
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
          <CircularProgress size={40} sx={{ color: 'var(--color-primary)', mb: 2 }} />
          <Typography variant="body2" sx={{ color: 'var(--color-text-muted)' }}>
            Loading map...
          </Typography>
        </Box>
      )}
      
      <div
        ref={mapRef}
        id={`projects-map-container-${Math.random().toString(36).substr(2, 9)}`}
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

export default ProjectsMap;

