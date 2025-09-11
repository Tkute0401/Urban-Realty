import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link, Typography, Box } from '@mui/material';
import { useLocation, Link as RouterLink } from 'react-router-dom';

function titleCase(segment) {
  return segment
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const breadcrumbStyles = {
  container: {
    backgroundColor: '#08171A',
    padding: '8px 0',
  },
  breadcrumbs: {
    padding: '8px 16px',
    '& .MuiBreadcrumbs-separator': {
      color: 'rgba(255, 255, 255, 0.7)',
    }
  },
  link: {
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#78cadc',
      textDecoration: 'underline',
    },
  },
  typography: {
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 'bold',
  }
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <Box sx={breadcrumbStyles.container}>
      <MUIBreadcrumbs 
        aria-label="breadcrumb" 
        sx={breadcrumbStyles.breadcrumbs}
      >
        <Link 
          component={RouterLink} 
          underline="hover" 
          to="/"
          sx={breadcrumbStyles.link}
        >
          Home
        </Link>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = titleCase(value);
          
          return isLast ? (
            <Typography key={to} sx={breadcrumbStyles.typography}>
              {label}
            </Typography>
          ) : (
            <Link 
              key={to} 
              component={RouterLink} 
              underline="hover" 
              to={to}
              sx={breadcrumbStyles.link}
            >
              {label}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;