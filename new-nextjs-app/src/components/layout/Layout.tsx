import React, { ReactNode } from 'react';
import { Box } from '@mui/material';
import Breadcrumbs from './Breadcrumbs';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ p: 0, m: 0 }}>
      <Breadcrumbs />
      {children}
    </Box>
  );
};

export default Layout;