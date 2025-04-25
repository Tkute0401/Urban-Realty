// src/components/Layout.jsx
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return <Box sx={{ p: 0, m: 0 }}>{children}</Box>;
};

export default Layout;