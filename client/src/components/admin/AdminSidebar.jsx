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
  Settings
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin' },
  { text: 'Users', icon: <People />, path: '/admin/users' },
  { text: 'Agents', icon: <VerifiedUser />, path: '/admin/agents' },
  { text: 'Properties', icon: <Home />, path: '/admin/properties' },
  { text: 'Contacts', icon: <Mail />, path: '/admin/contacts' },
  { text: 'Settings', icon: <Settings />, path: '/admin/settings' },
];

const AdminSidebar = ({ mobileOpen, collapsed, onDrawerToggle, onToggleCollapse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const drawer = (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`
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
            color: theme.palette.text.primary,
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
                  backgroundColor: theme.palette.primary.main,
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: theme.palette.primary.contrastText,
                  },
                  '&:hover': {
                    backgroundColor: theme.palette.primary.dark,
                  }
                }
              }
            }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                py: 1.5,
                px: collapsed ? 2.5 : 3,
                justifyContent: collapsed ? 'center' : 'flex-start',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 'auto',
                mr: collapsed ? 0 : 2,
                color: location.pathname === item.path 
                  ? theme.palette.primary.contrastText 
                  : theme.palette.text.secondary
              }}>
                {item.icon}
              </ListItemIcon>
              {!collapsed && (
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 'normal'
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