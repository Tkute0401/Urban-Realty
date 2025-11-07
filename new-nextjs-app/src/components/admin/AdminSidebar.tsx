import React from 'react';
import { 
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  useTheme,
  useMediaQuery,
  Typography,
  IconButton
} from '@mui/material';
import {
  Dashboard,
  People,
  Home,
  Mail,
  VerifiedUser,
  Settings,
  Assessment,
  Image,
  Article
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Analytics', icon: <Assessment />, path: '/admin/analytics' },
  { text: 'Users', icon: <People />, path: '/admin/users' },
  { text: 'Agents', icon: <VerifiedUser />, path: '/admin/agents' },
  { text: 'Properties', icon: <Home />, path: '/admin/properties' },
  { text: 'Blogs', icon: <Article />, path: '/admin/blogs' },
  { text: 'Contacts', icon: <Mail />, path: '/admin/contacts' },
  { text: 'Media', icon: <Image />, path: '/admin/media' },
  { text: 'Reports', icon: <Assessment />, path: '/admin/reports' },
  { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
];

const AdminSidebar = ({ mobileOpen, collapsed, onDrawerToggle, onToggleCollapse }) => {
  console.log('🔧 AdminSidebar rendering...', { mobileOpen, collapsed });
  
  React.useEffect(() => {
    console.log('🔧 AdminSidebar mounted on client side!');
  }, []);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();

  const drawer = (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'var(--color-bg-primary)',
      borderRight: '1px solid var(--color-border-light)'
    }}>
      <Toolbar sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: [2],
        minHeight: '64px !important'
      }}>
        {!collapsed && (
          <Typography variant="h6" noWrap component="div" sx={{ 
            color: 'var(--color-text-primary)',
            fontWeight: 700
          }}>
            Admin Panel
          </Typography>
        )}
        <IconButton onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem 
            key={item.text} 
            disablePadding
            sx={{ 
              mb: 1,
              '& .MuiListItemButton-root': {
                borderRadius: 2,
                mx: 1,
                '&.Mui-selected': {
                  backgroundColor: 'var(--color-primary)',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'var(--color-white)',
                  },
                  '&:hover': {
                    backgroundColor: 'var(--color-primary-hover)',
                  }
                }
              }
            }}
          >
            <ListItemButton
              component={Link}
              href={item.path}
              selected={pathname === item.path}
              sx={{
                py: 1.5,
                px: collapsed ? 2.5 : 3,
                justifyContent: collapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: 'var(--color-bg-secondary)',
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 'auto',
                mr: collapsed ? 0 : 2,
                color: pathname === item.path 
                  ? 'var(--color-white)' 
                  : 'var(--color-text-secondary)'
              }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: pathname === item.path ? 600 : 'normal'
                  }} 
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
        {!collapsed && (
          <Typography variant="body2" color="text.secondary" align="center">
            Urban Realty Admin
          </Typography>
        )}
      </Box>
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? 72 : drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: collapsed ? 72 : drawerWidth,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
      open
    >
      {drawer}
    </Drawer>
  );
};

export default AdminSidebar;