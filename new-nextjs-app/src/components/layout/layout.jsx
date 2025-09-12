// src/components/Layout.jsx
import { Box } from '@mui/material';
import Breadcrumbs from '../layout/Breadcrumbs';

const Layout = ({ children }) => {
  return (
    <Box sx={{ p: 0, m: 0 }}>
      <Breadcrumbs />
      {children}
    </Box>
  );
};

export default Layout;