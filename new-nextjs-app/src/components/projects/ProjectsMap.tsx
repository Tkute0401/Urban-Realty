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
  const [mapInitialized, setMapInitialized] = useState(false);
  const [containerId] = useState(() => `projects-map-container-${Math.random().toString(36).substr(2, 9)}`);

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
      } else if (anyProject.location?.coordinates) {
        const c = anyProject.location.coordinates;
        const lng = c.lng ?? c.longitude;
        const lat = c.lat ?? c.latitude;
        if (lng != null && lat != null) {
          raw = [Number(lng), Number(lat)];
        }
      }

      if (!isValidCoordinates(raw)) return null;
      return [Number(raw![0]), Number(raw![1])];
    } catch (e) {
      console.warn('Failed to extract coordinates', e);
      return null;
    }
  };

  // Load Mappls script
  useEffect(() => {
    if (typeof window === 'undefined' || scriptLoaded) return;

    const loadMapScript = () => {
      if (window.mappls) {
        setScriptLoaded(true);
        return;
      }

      const existingScript = document.querySelector('script[src*="mappls"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => setScriptLoaded(true));
        return;
      }

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
  }, [scriptLoaded]);

  // Function to add markers
  const addMarkersToMap = () => {
    if (!mapInstanceRef.current) return;

    // Clean up existing markers
    markersRef.current.forEach(marker => {
      try {
        if (marker && marker.remove) marker.remove();
      } catch (e) {
        console.warn('Error removing marker:', e);
      }
    });
    markersRef.current = [];

    const validProjects = projects.filter(p => isValidCoordinates(getProjectLngLat(p)));

    console.log('🗺️ Adding markers for', validProjects.length, 'projects');

    const newMarkers = validProjects.map((project) => {
      const coords = getProjectLngLat(project);
      if (!coords) return null;

      const [lng, lat] = coords;
      const isSelected = selectedProject?._id === project._id;

      // Use [lat, lng] array format like PropertiesMap
      const marker = new window.mappls.Marker({
        map: mapInstanceRef.current,
        position: [lat, lng], // [lat, lng] format
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
        if (onMarkerClick) onMarkerClick(project);
      });

      // Info window
      if (project.name) {
        marker.addListener('click', () => {
          try {
            const infoWindow = new window.mappls.InfoWindow({
              content: `
                <div style="padding: 10px; max-width: 250px;">
                  <h3 style="margin: 0 0 5px 0; color: var(--color-text-primary); font-size: 14px; font-weight: bold;">
                    ${project.name}
                  </h3>
                  <p style="margin: 0; color: var(--color-text-muted); font-size: 12px;">
                    ${(project.location as any)?.city || ''}, ${(project.location as any)?.state || ''}
                  </p>
                </div>
              `,
              position: [lat, lng] // [lat, lng] format
            });
            infoWindow.open(mapInstanceRef.current);
          } catch (e) {
            console.warn('Failed to create info window', e);
          }
        });
      }

      return marker;
    });

    // User location marker
    if (userLocation) {
      try {
        new window.mappls.Marker({
          map: mapInstanceRef.current,
          position: [userLocation.latitude, userLocation.longitude], // [lat, lng]
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
      } catch (e) {
        console.warn('Failed to create user marker', e);
      }
    }

    markersRef.current = newMarkers.filter(Boolean);

    // Fit bounds
    if (validProjects.length > 1 && !userLocation) {
      const bounds = validProjects
        .map(p => getProjectLngLat(p))
        .filter(isValidCoordinates)
        .map(coords => [coords![0], coords![1]]); // [lng, lat] for fitBounds (Mappls quirk: fitBounds usually takes [lng, lat] or [lat, lng] depending on version, sticking to [lng, lat] as per PropertiesMap)

      if (bounds.length > 0) {
        try {
          // PropertiesMap uses [lng, lat] for fitBounds
          mapInstanceRef.current.fitBounds(bounds);
        } catch (err) {
          console.warn('Failed to fit bounds', err);
        }
      }
    }
  };

  // Initialize map
  useEffect(() => {
    if (!scriptLoaded || mapInitialized) return;

    const initializeMap = () => {
      try {
        if (!window.mappls) {
          setMapError('Mappls SDK not loaded');
          return;
        }

        const container = document.getElementById(containerId) || mapRef.current;
        if (!container || !container.offsetParent) {
          setTimeout(initializeMap, 200);
          return;
        }

        // Default center
        let mapCenter = [28.6139, 77.2090]; // [lat, lng]
        let mapZoom = 10;

        // Try to find a better center
        const validProjects = projects.filter(p => isValidCoordinates(getProjectLngLat(p)));
        if (userLocation) {
          mapCenter = [userLocation.latitude, userLocation.longitude];
          mapZoom = 12;
        } else if (validProjects.length > 0) {
          const coords = getProjectLngLat(validProjects[0]);
          if (coords) {
            mapCenter = [coords[1], coords[0]]; // [lat, lng]
            mapZoom = 12;
          }
        }

        mapInstanceRef.current = new window.mappls.Map(container, {
          center: mapCenter,
          zoom: mapZoom,
          zoomControl: true,
          fullscreenControl: true,
          scrollWheel: true,
        });

        setMapInitialized(true);
        setMapLoaded(true);

        // Add markers immediately
        addMarkersToMap();

      } catch (error: any) {
        console.error('Error initializing map:', error);
        setMapError(`Failed to initialize map: ${error?.message}`);
      }
    };

    const timer = setTimeout(initializeMap, 300);
    return () => clearTimeout(timer);
  }, [scriptLoaded, mapInitialized]);

  // Update markers when projects change
  useEffect(() => {
    if (mapInitialized && mapInstanceRef.current) {
      addMarkersToMap();
    }
  }, [projects, selectedProject, userLocation, mapInitialized]);

  // Cleanup
  useEffect(() => {
    return () => {
      markersRef.current.forEach(m => m?.remove?.());
      if (mapInstanceRef.current?.remove) {
        try { mapInstanceRef.current.remove(); } catch (e) { }
      }
    };
  }, []);

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
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-surface)',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        p: 2
      }}>
        <Typography variant="body2" color="error">{mapError}</Typography>
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
          zIndex: 1
        }}>
          <CircularProgress size={40} sx={{ color: 'var(--color-primary)', mb: 2 }} />
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
          minHeight: typeof height === 'string' ? height : `${height}px`
        }}
      />
    </Box>
  );
};

export default ProjectsMap;

