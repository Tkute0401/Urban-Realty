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

  // Helper to validate coordinates array [lng, lat]
  const isValidCoordinates = (coords?: [number, number] | null) => {
    if (!Array.isArray(coords) || coords.length !== 2) return false;

    const lng = Number(coords[0]);
    const lat = Number(coords[1]);

    return (
      !Number.isNaN(lng) &&
      !Number.isNaN(lat) &&
      Number.isFinite(lng) &&
      Number.isFinite(lat)
    );
  };

  // Safely extract [lng, lat] from a project, or null if invalid
  const getProjectLngLat = (project: Project): [number, number] | null => {
    try {
      // Support both GeoJSON-style and flat coordinate shapes:
      // 1) location.coordinates.coordinates -> [lng, lat]
      // 2) location.coordinates -> [lng, lat]
      let raw: [number, number] | undefined;

      const anyProject = project as any;

      if (
        Array.isArray(anyProject.location?.coordinates?.coordinates) &&
        anyProject.location.coordinates.coordinates.length === 2
      ) {
        raw = anyProject.location.coordinates.coordinates as [number, number];
      } else if (
        Array.isArray(anyProject.location?.coordinates) &&
        anyProject.location.coordinates.length === 2
      ) {
        raw = anyProject.location.coordinates as [number, number];
      }

      if (!isValidCoordinates(raw)) {
        return null;
      }

      const lng = Number(raw![0]);
      const lat = Number(raw![1]);

      return [lng, lat];
    } catch (e) {
      console.warn('Failed to extract coordinates from project', {
        id: (project as any)?._id,
        name: (project as any)?.name,
        error: e,
      });
      return null;
    }
  };

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
        const validProjects = projects.filter((p) => {
          const coords = getProjectLngLat(p);
          return isValidCoordinates(coords);
        });

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
          // Center on first project with valid coordinates
          const firstProject = validProjects[0];
          const firstCoords = getProjectLngLat(firstProject);

          if (isValidCoordinates(firstCoords)) {
            mapCenter = firstCoords as [number, number]; // [lng, lat]
            mapZoom = validProjects.length > 1 ? 6 : 12;
            console.log('Initializing map centered on first project:', {
              mapCenter,
              projectId: firstProject._id,
            });
          } else {
            console.warn(
              'First project has invalid coordinates after normalization, falling back to default center',
              {
                projectId: firstProject._id,
                rawCoordinates: firstProject.location?.coordinates,
              }
            );
            mapCenter = [77.209, 28.6139];
            mapZoom = 10;
          }
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
        const newMarkers = validProjects.map((project) => {
          const coords = getProjectLngLat(project);

          if (!isValidCoordinates(coords)) {
            console.warn('Skipping project with invalid coordinates:', {
              id: project._id,
              name: project.name,
              coordinates: coords,
            });
            return null;
          }

          const [lng, lat] = coords as [number, number]; // [lng, lat]
          const isSelected = selectedProject?._id === project._id;

          const marker = new window.mappls.Marker({
            map: mapInstanceRef.current,
            // Mappls markers use [lat, lng]
            position: [lat, lng],
            icon: {
              url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                <svg width="30" height="40" viewBox="0 0 30 40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 0C8.373 0 3 5.373 3 12c0 8.25 12 28 12 28s12-19.75 12-28c0-6.627-5.373-12-12-12z" 
                        fill="${isSelected ? 'var(--color-primary)' : 'var(--color-secondary)'}" 
                        stroke="var(--color-white)" 
                        stroke-width="2"/>
                  <circle cx="15" cy="12" r="5" fill="var(--color-white)"/>
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
          if (project.name && isValidCoordinates([lng, lat])) {
            try {
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
                // Mappls InfoWindow expects [lng, lat]
                position: [lng, lat],
              });

              marker.addListener('click', () => {
                infoWindow.open(mapInstanceRef.current);
              });
            } catch (e) {
              console.warn('Failed to create info window for project', {
                id: project._id,
                name: project.name,
                error: e,
              });
            }
          }

          return marker;
        });

        // Add user location marker if available
        if (userLocation) {
          try {
            const userMarker = new window.mappls.Marker({
              map: mapInstanceRef.current,
              position: [userLocation.latitude, userLocation.longitude], // Mappls expects [lat, lng]
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

        markersRef.current = newMarkers.filter(Boolean);

        // Fit bounds if multiple projects (only if no user location)
        if (validProjects.length > 1 && !userLocation) {
          // Mappls fitBounds expects an array of [lng, lat] coordinates
          const bounds = validProjects
            .map((p) => getProjectLngLat(p))
            .filter((coords) => isValidCoordinates(coords)) as [number, number][];

          if (bounds.length > 0) {
            try {
          mapInstanceRef.current.fitBounds(bounds);
            } catch (err) {
              console.warn('Failed to fit bounds for projects map, keeping current center/zoom', err);
            }
          }
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

