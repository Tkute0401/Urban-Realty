'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  CircularProgress, 
  Alert,
  Container,
  Grid
} from '@mui/material';
import { useProperties } from '@/contexts/PropertiesContext';
import { useProjects } from '@/contexts/ProjectsContext';
import PropertyCard from '@/components/property/PropertyCard';
import ProjectCard from '@/components/projects/ProjectCard';

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { properties, loading: propertiesLoading, getProperties } = useProperties();
  const { projects, loading: projectsLoading, getProjects } = useProjects();
  
  const [activeTab, setActiveTab] = useState(0);
  const [allProjects, setAllProjects] = useState<any[]>([]);
  const searchQuery = searchParams.get('search') || '';
  const cityQuery = searchParams.get('city') || '';
  const propertyTypeQuery = searchParams.get('propertyType') || '';

  useEffect(() => {
    // Load properties
    const propertyParams: any = {
      page: 1,
      limit: 50
    };
    if (searchQuery) propertyParams.search = searchQuery;
    if (cityQuery) propertyParams.city = cityQuery;
    if (propertyTypeQuery && propertyTypeQuery !== 'ALL') {
      propertyParams.status = propertyTypeQuery === 'BUY' ? 'For Sale' : 'For Rent';
    }
    getProperties(propertyParams);

    // Load projects - use city filter if available, otherwise fetch all and filter client-side
    const projectParams: any = {};
    if (cityQuery) {
      projectParams['location.city'] = cityQuery;
    }
    getProjects(projectParams).then(() => {
      // Store all projects for client-side filtering
      // This will be updated when projects are loaded
    });
  }, [searchQuery, cityQuery, propertyTypeQuery, getProperties, getProjects]);

  // Update allProjects when projects context updates
  useEffect(() => {
    setAllProjects(projects);
  }, [projects]);

  // Filter projects client-side for search query (since backend may not support text search)
  const filteredProjects = useMemo(() => {
    if (!searchQuery) return allProjects;
    
    const query = searchQuery.toLowerCase();
    return allProjects.filter((project: any) => {
      const name = project.name?.toLowerCase() || '';
      const description = project.description?.toLowerCase() || '';
      const city = project.location?.city?.toLowerCase() || '';
      const state = project.location?.state?.toLowerCase() || '';
      
      return name.includes(query) || 
             description.includes(query) || 
             city.includes(query) || 
             state.includes(query);
    });
  }, [allProjects, searchQuery]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ color: 'var(--color-text-primary)', mb: 1 }}>
          Search Results
        </Typography>
        {searchQuery && (
          <Typography variant="body1" sx={{ color: 'var(--color-text-muted)' }}>
            {activeTab === 0 
              ? `Found ${properties.length} ${properties.length === 1 ? 'property' : 'properties'}`
              : `Found ${filteredProjects.length} ${filteredProjects.length === 1 ? 'project' : 'projects'}`
            }
            {searchQuery && ` for "${searchQuery}"`}
            {cityQuery && ` in ${cityQuery}`}
          </Typography>
        )}
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: 'var(--color-text-muted)',
              '&.Mui-selected': {
                color: 'var(--color-primary)'
              }
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--color-primary)'
            }
          }}
        >
          <Tab 
            label={`Properties (${properties.length})`} 
            icon={propertiesLoading ? <CircularProgress size={16} /> : undefined}
            iconPosition="end"
          />
          <Tab 
            label={`Projects (${filteredProjects.length})`}
            icon={projectsLoading ? <CircularProgress size={16} /> : undefined}
            iconPosition="end"
          />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Box>
          {propertiesLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: 'var(--color-primary)' }} />
            </Box>
          ) : properties.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No properties found. Try adjusting your search criteria.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {properties.map((property, index) => (
                <Grid item xs={12} sm={6} md={4} key={property._id}>
                  <PropertyCard 
                    property={property} 
                    index={index}
                    id={`property-${property._id}`}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {activeTab === 1 && (
        <Box>
          {projectsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress sx={{ color: 'var(--color-primary)' }} />
            </Box>
          ) : filteredProjects.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No projects found. Try adjusting your search criteria.
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {filteredProjects.map((project) => (
                <Grid item xs={12} sm={6} md={4} key={project._id}>
                  <ProjectCard 
                    project={project}
                    showFavoriteButton={true}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Container>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Container>
    }>
      <SearchContent />
    </Suspense>
  );
}
