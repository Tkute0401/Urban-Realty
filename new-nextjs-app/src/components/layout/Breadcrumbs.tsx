import React from 'react';
import { Breadcrumbs as MUIBreadcrumbs, Link as MUILink, Typography, Box } from '@mui/material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function titleCase(segment) {
  return segment
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const breadcrumbStyles = {
  container: {
    backgroundColor: 'var(--color-surface)',
    padding: '8px 0',
  },
  breadcrumbs: {
    padding: '8px 16px',
    '& .MuiBreadcrumbs-separator': {
      color: 'var(--color-text-muted)',
    }
  },
  link: {
    color: 'var(--color-text-muted)',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    transition: 'color 0.3s ease',
    '&:hover': {
      color: 'var(--color-primary)',
      textDecoration: 'underline',
    },
  },
  typography: {
    color: 'var(--color-text)',
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 'bold',
  }
};

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathnames = pathname.split('/').filter(Boolean);

  if (pathnames.length === 0) {
    return null;
  }

  return (
    <Box sx={breadcrumbStyles.container}>
      <MUIBreadcrumbs 
        aria-label="breadcrumb" 
        sx={breadcrumbStyles.breadcrumbs}
      >
        <MUILink component={Link} underline="hover" href="/" sx={breadcrumbStyles.link}>
          Home
        </MUILink>
        {pathnames.map((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          const isLast = index === pathnames.length - 1;
          const label = titleCase(value);
          
          return isLast ? (
            <Typography key={to} sx={breadcrumbStyles.typography}>
              {label}
            </Typography>
          ) : (
            <MUILink key={to} component={Link} underline="hover" href={to} sx={breadcrumbStyles.link}>
              {label}
            </MUILink>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;