import { Box, CssBaseline, Toolbar } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AdminHeader onMenuClick={handleDrawerToggle} />
      <AdminSidebar 
        mobileOpen={mobileOpen}
        collapsed={collapsed}
        onDrawerToggle={handleDrawerToggle}
        onToggleCollapse={handleToggleCollapse}
      />
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3,
          width: `calc(100% - ${collapsed ? '72px' : '240px'})`,
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;