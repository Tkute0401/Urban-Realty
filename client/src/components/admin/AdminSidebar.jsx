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
  IconButton,
  Collapse,
  Badge,
  Chip
} from '@mui/material';
import {
  Dashboard,
  People,
  Home,
  Mail,
  VerifiedUser,
  Settings,
  TrendingUp,
  MonetizationOn,
  Assessment,
  Notifications,
  Security,
  Storage,
  Analytics,
  Business,
  ContactSupport,
  Report,
  SystemUpdate,
  Backup,
  Monitor,
  Code,
  Extension,
  Folder,
  Image,
  VideoLibrary,
  Description,
  Schedule,
  Payment,
  Receipt,
  AccountBalance,
  ShowChart,
  Timeline,
  PieChart,
  BarChart,
  TableChart,
  Map,
  LocationOn,
  Category,
  Tag
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight, ExpandLess, ExpandMore } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/admin',
    badge: null
  },
  {
    text: 'User Management',
    icon: <People />,
    path: '/admin/users',
    badge: null,
    subItems: [
      { text: 'All Users', path: '/admin/users', icon: <People /> },
      { text: 'Agents', path: '/admin/agents', icon: <VerifiedUser /> },
      { text: 'User Types', path: '/admin/user-types', icon: <Category /> },
      { text: 'Verifications', path: '/admin/verifications', icon: <Security /> }
    ]
  },
  {
    text: 'Property Management',
    icon: <Home />,
    path: '/admin/properties',
    badge: null,
    subItems: [
      { text: 'All Properties', path: '/admin/properties', icon: <Home /> },
      { text: 'Property Types', path: '/admin/property-types', icon: <Category /> },
      { text: 'Dynamic Fields', path: '/admin/dynamic-fields', icon: <Extension /> },
      { text: 'Media Library', path: '/admin/media', icon: <Image /> }
    ]
  },
  {
    text: 'Subscriptions',
    icon: <MonetizationOn />,
    path: '/admin/subscriptions',
    badge: 'New',
    subItems: [
      { text: 'Subscription Plans', path: '/admin/subscription-plans', icon: <Payment /> },
      { text: 'User Subscriptions', path: '/admin/subscriptions', icon: <Receipt /> },
      { text: 'Billing History', path: '/admin/billing', icon: <AccountBalance /> },
      { text: 'Payment Methods', path: '/admin/payment-methods', icon: <Payment /> }
    ]
  },
  {
    text: 'Analytics & Reports',
    icon: <Analytics />,
    path: '/admin/analytics',
    badge: null,
    subItems: [
      { text: 'Dashboard Analytics', path: '/admin/analytics', icon: <ShowChart /> },
      { text: 'User Analytics', path: '/admin/user-analytics', icon: <Timeline /> },
      { text: 'Property Analytics', path: '/admin/property-analytics', icon: <BarChart /> },
      { text: 'Revenue Reports', path: '/admin/revenue-reports', icon: <PieChart /> },
      { text: 'Performance Metrics', path: '/admin/performance', icon: <TableChart /> }
    ]
  },
  {
    text: 'Communication',
    icon: <Mail />,
    path: '/admin/contacts',
    badge: null,
    subItems: [
      { text: 'Contact Requests', path: '/admin/contacts', icon: <ContactSupport /> },
      { text: 'Inquiries', path: '/admin/inquiries', icon: <Mail /> },
      { text: 'Notifications', path: '/admin/notifications', icon: <Notifications /> },
      { text: 'Email Templates', path: '/admin/email-templates', icon: <Description /> }
    ]
  },
  {
    text: 'System Management',
    icon: <Settings />,
    path: '/admin/settings',
    badge: null,
    subItems: [
      { text: 'General Settings', path: '/admin/settings', icon: <Settings /> },
      { text: 'Security Settings', path: '/admin/security', icon: <Security /> },
      { text: 'Backup & Restore', path: '/admin/backup', icon: <Backup /> },
      { text: 'System Monitor', path: '/admin/monitor', icon: <Monitor /> },
      { text: 'API Management', path: '/admin/api', icon: <Code /> },
      { text: 'Logs', path: '/admin/logs', icon: <Description /> }
    ]
  }
];

const AdminSidebar = ({ mobileOpen, collapsed, onDrawerToggle, onToggleCollapse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState(new Set());

  const handleExpandClick = (itemText) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemText)) {
      newExpanded.delete(itemText);
    } else {
      newExpanded.add(itemText);
    }
    setExpandedItems(newExpanded);
  };

  const isItemActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const renderMenuItem = (item, level = 0) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isActive = isItemActive(item.path);
    const isExpanded = expandedItems.has(item.text);

    return (
      <Box key={item.text}>
        <ListItem 
          disablePadding
          sx={{ 
            mb: level === 0 ? 1 : 0.5,
            '& .MuiListItemButton-root': {
              borderRadius: level === 0 ? 2 : 1,
              mx: level === 0 ? 1 : 0,
              ml: level === 0 ? 1 : level * 2 + 1,
              '&.Mui-selected': {
                backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
                },
                '&:hover': {
                  backgroundColor: isActive ? theme.palette.primary.dark : theme.palette.action.hover,
                }
              }
            }
          }}
        >
          <ListItemButton
            component={hasSubItems ? 'div' : Link}
            to={hasSubItems ? undefined : item.path}
            selected={isActive}
            onClick={hasSubItems ? () => handleExpandClick(item.text) : undefined}
            sx={{
              py: level === 0 ? 1.5 : 1,
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
              color: isActive 
                ? theme.palette.primary.contrastText 
                : theme.palette.text.secondary
            }}>
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <>
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {item.text}
                      {item.badge && (
                        <Chip 
                          label={item.badge} 
                          size="small" 
                          color="error" 
                          sx={{ height: 20, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  }
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 'normal',
                    fontSize: level === 0 ? '0.9rem' : '0.8rem'
                  }} 
                />
                {hasSubItems && (
                  <IconButton size="small" sx={{ ml: 'auto' }}>
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )}
              </>
            )}
          </ListItemButton>
        </ListItem>
        
        {hasSubItems && !collapsed && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem) => (
                <ListItem 
                  key={subItem.text} 
                  disablePadding
                  sx={{ 
                    '& .MuiListItemButton-root': {
                      borderRadius: 1,
                      mx: 1,
                      ml: 3,
                      '&.Mui-selected': {
                        backgroundColor: isItemActive(subItem.path) ? theme.palette.primary.main : 'transparent',
                        '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                          color: isItemActive(subItem.path) ? theme.palette.primary.contrastText : theme.palette.text.primary,
                        },
                      }
                    }
                  }}
                >
                  <ListItemButton
                    component={Link}
                    to={subItem.path}
                    selected={isItemActive(subItem.path)}
                    sx={{
                      py: 1,
                      px: 3,
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: 'auto',
                      mr: 2,
                      color: isItemActive(subItem.path) 
                        ? theme.palette.primary.contrastText 
                        : theme.palette.text.secondary,
                      fontSize: '1.2rem'
                    }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={subItem.text} 
                      primaryTypographyProps={{
                        fontWeight: isItemActive(subItem.path) ? 600 : 'normal',
                        fontSize: '0.8rem'
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

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
        minHeight: '64px !important',
        background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
        color: 'white'
      }}>
        {!collapsed && (
          <Typography variant="h6" noWrap component="div" sx={{ 
            color: 'white',
            fontWeight: 700
          }}>
            Admin Panel
          </Typography>
        )}
        <IconButton onClick={onToggleCollapse} sx={{ color: 'white' }}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {menuItems.map((item) => renderMenuItem(item))}
      </List>
      <Divider />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        {!collapsed && (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Urban Realty Admin
            </Typography>
            <Typography variant="caption" color="text.secondary">
              v2.1.0
            </Typography>
          </>
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