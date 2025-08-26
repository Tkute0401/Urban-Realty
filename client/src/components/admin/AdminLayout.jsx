import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <AdminSidebar
        mobileOpen={mobileOpen}
        collapsed={collapsed}
        onDrawerToggle={handleDrawerToggle}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          bgcolor: 'background.default',
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
        }}
      >
        {/* Header */}
        <AdminHeader
          onDrawerToggle={handleDrawerToggle}
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        {/* Content Area */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            mt: { xs: 7, sm: 8 },
            ml: { sm: collapsed ? '80px' : '280px' },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
            minHeight: 'calc(100vh - 64px)',
            position: 'relative'
          }}
        >
          {/* Page Content */}
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              minHeight: 'calc(100vh - 120px)',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
              }
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;