'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';

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

interface ProjectsMapProps {
  projects: Project[];
  selectedProject?: Project | null;
  onMarkerClick?: (project: Project) => void;
  height?: string;
}

const ProjectsMap: React.FC<ProjectsMapProps> = ({
  projects,
  selectedProject,
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

      const apiKey = process.env.NEXT_PUBLIC_MAPPLS_API_KEY;
      if (!apiKey) {
        setMapError('Mappls API key not found');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://apis.mappls.com/advancedmaps/api/${apiKey}/map_sdk?layer=vector&v=3.0`;
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
    if (!scriptLoaded || !mapRef.current || !projects || projects.length === 0) {
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

        // Filter projects with valid coordinates
        const validProjects = projects.filter(
          p => p.location?.coordinates?.coordinates?.length === 2
        );

        if (validProjects.length === 0) {
          setMapError('No projects with valid coordinates');
          return;
        }

        // Calculate center and zoom
        const firstProject = validProjects[0];
        const [lng, lat] = firstProject.location.coordinates.coordinates;

        // Initialize map
        mapInstanceRef.current = new window.mappls.Map(mapRef.current, {
          center: [lng, lat],
          zoom: validProjects.length > 1 ? 6 : 12,
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
            position: { lat, lng },
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
              position: { lat, lng }
            });

            marker.addListener('click', () => {
              infoWindow.open(mapInstanceRef.current);
            });
          }

          return marker;
        });

        markersRef.current = newMarkers;

        // Fit bounds if multiple projects
        if (validProjects.length > 1) {
          const bounds = validProjects.map(p => ({
            lat: p.location.coordinates.coordinates[1],
            lng: p.location.coordinates.coordinates[0]
          }));
          mapInstanceRef.current.fitBounds(bounds);
        }

        setMapLoaded(true);
        setMapError(null);
      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError('Failed to initialize map');
      }
    };

    const timer = setTimeout(initializeMap, 100);
    
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
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '12px',
          border: '1px solid var(--color-border)'
        }}
      />
    </Box>
  );
};

export default ProjectsMap;

