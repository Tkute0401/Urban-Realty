// src/components/admin/AdminLayout.jsx
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import { Dashboard, People, Home, Mail, Settings } from '@mui/icons-material';
import { Link, Outlet } from 'react-router-dom';
import AdminHeader from './AdminHeader';

const drawerWidth = 240;

const AdminLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <AdminHeader />
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar /> {/* Spacer for header */}
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {[
              { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
              { text: 'Users', icon: <People />, path: '/admin/users' },
              { text: 'Properties', icon: <Home />, path: '/admin/properties' },
              { text: 'Agents', icon: <People />, path: '/admin/agents' },
              { text: 'Inquiries', icon: <Mail />, path: '/admin/inquiries' },
              { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
            ].map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={Link} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* Spacer for header */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;