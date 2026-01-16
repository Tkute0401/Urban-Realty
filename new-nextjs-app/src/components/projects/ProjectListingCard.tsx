'use client';

import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    MobileStepper,
    IconButton,
    useTheme,
    Stack
} from '@mui/material';
import {
    KeyboardArrowLeft,
    KeyboardArrowRight,
    WhatsApp,
    Phone
} from '@mui/icons-material';

interface ProjectListingCardProps {
    project: any;
}

const ProjectListingCard: React.FC<ProjectListingCardProps> = ({ project }) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);

    // Extract images from project
    const images = project.images && project.images.length > 0
        ? project.images.map((img: any) => typeof img === 'string' ? img : img.url)
        : ['/placeholder-project.jpg'];

    const maxSteps = images.length;

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
    };

    const handleBack = (e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
    };

    // Contact information
    const CALL_NUMBER = '7391990834';
    const WHATSAPP_NUMBER = '9689772801';

    // Format location
    const locality = project.location?.address || 'Location';
    const city = project.location?.city || '';

    // WhatsApp message template
    const whatsappMessage = `Hi, I'd like to know more about ${project.name} in ${locality}${city ? `, ${city}` : ''}`;
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    const callUrl = `tel:${CALL_NUMBER}`;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 8px 25px rgba(var(--color-shadow-rgb), 0.15)',
                    transform: 'translateY(-4px)',
                },
            }}
        >
            {/* Image Slider Section */}
            <Box sx={{ position: 'relative', width: '100%', height: { xs: 220, sm: 240, md: 260 } }}>
                {/* Current Image */}
                <Box
                    component="img"
                    src={images[activeStep]}
                    alt={`${project.name} - Image ${activeStep + 1}`}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                    }}
                />

                {/* Image Counter */}
                <Box
                    sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    {activeStep + 1} / {maxSteps}
                </Box>

                {/* Navigation Arrows - Only show if more than 1 image */}
                {maxSteps > 1 && (
                    <>
                        <IconButton
                            onClick={handleBack}
                            sx={{
                                position: 'absolute',
                                left: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                },
                                width: { xs: 32, sm: 36 },
                                height: { xs: 32, sm: 36 },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        >
                            <KeyboardArrowLeft />
                        </IconButton>
                        <IconButton
                            onClick={handleNext}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: '50%',
                                transform: 'translateY(-50%)',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 1)',
                                },
                                width: { xs: 32, sm: 36 },
                                height: { xs: 32, sm: 36 },
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                            }}
                        >
                            <KeyboardArrowRight />
                        </IconButton>
                    </>
                )}

                {/* Stepper Dots */}
                {maxSteps > 1 && (
                    <MobileStepper
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={<span />}
                        backButton={<span />}
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5) 0%, transparent 100%)',
                            padding: '8px 0',
                            '& .MuiMobileStepper-dots': {
                                margin: '0 auto'
                            },
                            '& .MuiMobileStepper-dot': {
                                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                                width: 8,
                                height: 8,
                                margin: '0 3px'
                            },
                            '& .MuiMobileStepper-dotActive': {
                                backgroundColor: 'white',
                                width: 10,
                                height: 10
                            }
                        }}
                    />
                )}
            </Box>

            {/* Content Section */}
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: { xs: 2, sm: 2.5, md: 3 } }}>
                {/* Project Name */}
                <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                        fontWeight: 600,
                        color: 'var(--color-text-primary)',
                        mb: 1,
                        fontSize: { xs: '1.1rem', sm: '1.15rem', md: '1.25rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3
                    }}
                >
                    {project.name}
                </Typography>

                {/* Location */}
                <Typography
                    variant="body2"
                    sx={{
                        color: 'var(--color-text-secondary)',
                        mb: 2.5,
                        fontSize: { xs: '0.875rem', sm: '0.9rem' },
                        display: '-webkit-box',
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    📍 {locality}{city ? `, ${city}` : ''}
                </Typography>

                {/* CTA Buttons */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={{ xs: 1.5, sm: 2 }}
                    sx={{ mt: 'auto' }}
                >
                    {/* WhatsApp Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<WhatsApp />}
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            backgroundColor: '#25D366',
                            color: 'white',
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                            py: { xs: 1.25, sm: 1.5 },
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
                            '&:hover': {
                                backgroundColor: '#20BA5A',
                                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Know More
                    </Button>

                    {/* Call Button */}
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<Phone />}
                        href={callUrl}
                        onClick={(e) => e.stopPropagation()}
                        sx={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-primary-contrast)',
                            fontWeight: 600,
                            fontSize: { xs: '0.875rem', sm: '0.9rem' },
                            py: { xs: 1.25, sm: 1.5 },
                            textTransform: 'none',
                            boxShadow: '0 2px 8px rgba(120, 202, 220, 0.3)',
                            '&:hover': {
                                backgroundColor: 'var(--color-primary-hover)',
                                boxShadow: '0 4px 12px rgba(120, 202, 220, 0.4)',
                                transform: 'translateY(-2px)',
                            },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        Call Now
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default ProjectListingCard;
