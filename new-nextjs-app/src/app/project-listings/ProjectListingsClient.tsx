'use client';

import React, { useEffect, useState } from 'react';
import { useProjects } from '../../contexts/ProjectsContext';
import {
    Box, Grid, Typography, CircularProgress, Container
} from '@mui/material';
import ProjectListingCard from '../../components/projects/ProjectListingCard';

const ProjectListingsClient = () => {
    const { projects, loading, error, getProjects } = useProjects();
    const [displayProjects, setDisplayProjects] = useState<any[]>([]);

    useEffect(() => {
        // Fetch all published projects
        getProjects({ isPublished: true });
    }, [getProjects]);

    useEffect(() => {
        // Filter only published projects
        if (projects && projects.length > 0) {
            const published = projects.filter((project: any) => project.isPublished !== false);
            setDisplayProjects(published);
        } else {
            setDisplayProjects([]);
        }
    }, [projects]);

    if (loading && displayProjects.length === 0) {
        return (
            <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, textAlign: 'center' }}>
                <CircularProgress sx={{ color: 'var(--color-primary)' }} />
                <Typography variant="h6" sx={{ mt: 2, color: 'var(--color-text-primary)' }}>
                    Loading projects...
                </Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: 'error.main', mb: 2 }}>
                    Error loading projects
                </Typography>
                <Typography variant="body1" sx={{ color: 'var(--color-text-secondary)' }}>
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ backgroundColor: 'var(--color-background)', minHeight: '100vh', py: { xs: 3, sm: 4, md: 6 } }}>
            <Container maxWidth="lg">
                {/* Page Header */}
                <Box sx={{ mb: { xs: 3, sm: 4, md: 5 }, textAlign: 'center' }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            color: 'var(--color-primary)',
                            fontWeight: 700,
                            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                            mb: 1.5
                        }}
                    >
                        Developer Projects
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: 'var(--color-text-secondary)',
                            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                            maxWidth: '600px',
                            mx: 'auto'
                        }}
                    >
                        Explore our curated collection of premium real estate projects
                    </Typography>
                </Box>

                {/* Projects Grid */}
                {displayProjects.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: { xs: 6, sm: 8, md: 10 } }}>
                        <Typography
                            variant="h5"
                            sx={{
                                color: 'var(--color-text-primary)',
                                mb: 1,
                                fontSize: { xs: '1.25rem', sm: '1.5rem' }
                            }}
                        >
                            No Projects Available
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                color: 'var(--color-text-secondary)',
                                fontSize: { xs: '0.95rem', sm: '1rem' }
                            }}
                        >
                            Please check back later for new projects.
                        </Typography>
                    </Box>
                ) : (
                    <Grid
                        container
                        spacing={{ xs: 2, sm: 2.5, md: 3 }}
                        sx={{
                            // Ensure consistent card heights in each row
                            '& .MuiGrid-item': {
                                display: 'flex'
                            }
                        }}
                    >
                        {displayProjects.map((project) => (
                            <Grid
                                item
                                xs={12}
                                sm={6}
                                md={4}
                                key={project._id}
                                sx={{ display: 'flex' }}
                            >
                                <ProjectListingCard project={project} />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {/* Projects Count - Mobile Friendly */}
                {displayProjects.length > 0 && (
                    <Box sx={{ mt: { xs: 3, sm: 4 }, textAlign: 'center' }}>
                        <Typography
                            variant="body2"
                            sx={{
                                color: 'var(--color-text-muted)',
                                fontSize: { xs: '0.875rem', sm: '0.9rem' }
                            }}
                        >
                            Showing {displayProjects.length} {displayProjects.length === 1 ? 'project' : 'projects'}
                        </Typography>
                    </Box>
                )}
            </Container>
        </Box>
    );
};

export default ProjectListingsClient;
