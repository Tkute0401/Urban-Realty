'use client'

import React, { useState, useEffect } from 'react';
import { Box, Tabs, Tab, useMediaQuery } from '@mui/material';
import { 
  Dashboard,
  Star,
  LocationOn,
  Info,
  Architecture,
  Pool,
  Business,
  Home
} from '@mui/icons-material';

interface PropertyNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: Array<{
    id: string;
    label: string;
    icon?: React.ReactNode;
  }>;
  isSticky?: boolean;
}

const PropertyNavigation: React.FC<PropertyNavigationProps> = ({
  activeSection,
  onSectionChange,
  sections,
  isSticky = false
}) => {
  const isMobile = useMediaQuery('(max-width:900px)');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultSections = [
    { id: 'overview', label: 'Overview', icon: <Dashboard /> },
    { id: 'highlights', label: 'Highlights', icon: <Star /> },
    { id: 'nearby', label: 'Around', icon: <LocationOn /> },
    { id: 'more', label: 'More Info', icon: <Info /> },
    { id: 'floorplan', label: 'Floor Plan', icon: <Architecture /> },
    { id: 'amenities', label: 'Amenities', icon: <Pool /> },
    { id: 'developer', label: 'Developer', icon: <Business /> },
    { id: 'similar', label: 'Similar', icon: <Home /> }
  ];

  const navigationSections = sections.length > 0 ? sections : defaultSections;

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    onSectionChange(newValue);
    
    // Smooth scroll to section
    const element = document.getElementById(`section-${newValue}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.offsetTop - headerOffset;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Box
      sx={{
        position: isSticky ? (scrolled ? 'fixed' : 'relative') : 'relative',
        top: isSticky && scrolled ? 0 : 'auto',
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'var(--color-bg)' : 'var(--color-surface)',
        borderBottom: scrolled ? '1px solid var(--color-border)' : 'none',
        transition: 'all 0.3s ease',
        boxShadow: scrolled ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
        px: { xs: 1, sm: 2 },
        py: 1
      }}
    >
      <Tabs
        value={activeSection}
        onChange={handleTabChange}
        variant={isMobile ? "scrollable" : "fullWidth"}
        scrollButtons={isMobile ? "auto" : false}
        allowScrollButtonsMobile={isMobile}
        sx={{
          '& .MuiTabs-indicator': {
            backgroundColor: 'var(--color-primary)',
            height: 3
          },
          '& .MuiTab-root': {
            color: 'var(--color-text-muted)',
            fontWeight: 500,
            fontSize: '0.9rem',
            minHeight: 48,
            '&.Mui-selected': {
              color: 'var(--color-primary)',
              fontWeight: 600
            },
            '&:hover': {
              color: 'var(--color-primary)',
              backgroundColor: 'rgba(247, 107, 28, 0.05)'
            }
          }
        }}
      >
        {navigationSections.map((section) => (
          <Tab
            key={section.id}
            value={section.id}
            label={section.label}
            icon={section.icon}
            iconPosition={isMobile ? undefined : "start"}
            sx={{
              textTransform: 'none',
              '& .MuiTab-iconWrapper': {
                marginBottom: isMobile ? '4px' : 0,
                marginRight: isMobile ? 0 : '8px'
              }
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

export default PropertyNavigation;