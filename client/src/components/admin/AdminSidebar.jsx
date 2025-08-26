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
  Avatar,
  Badge,
  Chip,
  Collapse,
  Tooltip,
  ListItemSecondaryAction,
  Switch,
  Menu,
  MenuItem,
  ListItemAvatar
} from '@mui/material';
import {
  Dashboard,
  People,
  Home,
  Mail,
  VerifiedUser,
  Settings,
  Analytics,
  Security,
  Assessment,
  Business,
  ContactSupport,
  Notifications,
  AccountCircle,
  ExpandLess,
  ExpandMore,
  Add,
  Search,
  FilterList,
  ViewList,
  ViewModule,
  Refresh,
  Download,
  Print,
  Share,
  Help,
  Info,
  BugReport,
  Feedback,
  Support,
  AdminPanelSettings,
  SupervisedUserCircle,
  Group,
  PersonAdd,
  PersonRemove,
  PersonOff,
  Person,
  Email,
  Phone,
  LocationOn,
  CalendarToday,
  AccessTime,
  Star,
  StarBorder,
  Favorite,
  FavoriteBorder,
  ThumbUp,
  ThumbDown,
  Flag,
  Report,
  Block,
  Unblock,
  Delete,
  Archive,
  Restore,
  VisibilityOff,
  Public,
  Lock,
  LockOpen,
  VpnKey,
  Key,
  KeyOff,
  Password,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldOff,
  Verified,
  Unverified,
  CheckCircleOutline,
  CancelOutlined,
  QuestionMark,
  Lightbulb,
  TipsAndUpdates,
  School,
  Book,
  Article,
  Description,
  Assignment,
  Task,
  Checklist,
  Done,
  Pending,
  Schedule,
  Event,
  Today,
  DateRange,
  Timer,
  HourglassEmpty,
  HourglassFull,
  Update,
  Sync,
  Cached,
  Autorenew,
  Loop,
  RotateRight,
  RotateLeft,
  GetApp,
  FileDownload,
  CloudDownload,
  CloudUpload,
  Backup,
  Save,
  SaveAlt,
  Cloud,
  Storage,
  Folder,
  FolderOpen,
  InsertDriveFile,
  PictureAsPdf,
  Image,
  VideoFile,
  AudioFile,
  Code,
  DataObject,
  Functions,
  Calculate,
  Timeline,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  ShowChart,
  BarChart,
  PieChart,
  BubbleChart,
  ScatterPlot,
  MultilineChart,
  StackedLineChart,
  SplineChart,
  CandlestickChart,
  WaterfallChart,
  Radar,
  PolarAreaChart,
  DoughnutChart,
  DonutLarge,
  DonutSmall,
  PieChartOutline,
  BarChartOutlined,
  StackedBarChart,
  GroupedBarChart,
  HorizontalBarChart,
  VerticalBarChart,
  ColumnChart,
  RowChart,
  AreaChart,
  StackedAreaChart,
  LineChart,
  StepChart,
  StepLineChart,
  StepAreaChart,
  StepBarChart,
  StepColumnChart,
  StepPieChart,
  StepDonutChart,
  StepRadarChart,
  StepPolarChart,
  StepBubbleChart,
  StepScatterChart,
  StepCandlestickChart,
  StepWaterfallChart,
  StepFunnelChart,
  StepGaugeChart,
  StepHeatmapChart,
  StepTreemapChart,
  StepSunburstChart,
  StepSankeyChart,
  StepChordChart,
  StepForceChart,
  StepVoronoiChart,
  StepDelaunayChart,
  StepConvexHullChart,
  StepAlphaShapeChart,
  StepBetaShapeChart,
  StepGammaShapeChart,
  StepDeltaShapeChart,
  StepEpsilonShapeChart,
  StepZetaShapeChart,
  StepEtaShapeChart,
  StepThetaShapeChart,
  StepIotaShapeChart,
  StepKappaShapeChart,
  StepLambdaShapeChart,
  StepMuShapeChart,
  StepNuShapeChart,
  StepXiShapeChart,
  StepOmicronShapeChart,
  StepPiShapeChart,
  StepRhoShapeChart,
  StepSigmaShapeChart,
  StepTauShapeChart,
  StepUpsilonShapeChart,
  StepPhiShapeChart,
  StepChiShapeChart,
  StepPsiShapeChart,
  StepOmegaShapeChart
} from '@mui/icons-material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const drawerWidth = 280;

const menuItems = [
  {
    text: 'Dashboard',
    icon: <Dashboard />,
    path: '/admin',
    badge: null,
    color: 'primary'
  },
  {
    text: 'User Management',
    icon: <People />,
    path: '/admin/users',
    badge: '12',
    color: 'success',
    subItems: [
      { text: 'All Users', path: '/admin/users', icon: <Group /> },
      { text: 'Add User', path: '/admin/users/add', icon: <PersonAdd /> },
      { text: 'User Roles', path: '/admin/users/roles', icon: <VerifiedUser /> },
      { text: 'User Activity', path: '/admin/users/activity', icon: <Timeline /> }
    ]
  },
  {
    text: 'Agent Management',
    icon: <VerifiedUser />,
    path: '/admin/agents',
    badge: '5',
    color: 'warning',
    subItems: [
      { text: 'All Agents', path: '/admin/agents', icon: <SupervisedUserCircle /> },
      { text: 'Add Agent', path: '/admin/agents/add', icon: <PersonAdd /> },
      { text: 'Agent Performance', path: '/admin/agents/performance', icon: <Assessment /> },
      { text: 'Agent Reviews', path: '/admin/agents/reviews', icon: <Star /> }
    ]
  },
  {
    text: 'Property Management',
    icon: <Home />,
    path: '/admin/properties',
    badge: '45',
    color: 'info',
    subItems: [
      { text: 'All Properties', path: '/admin/properties', icon: <ViewList /> },
      { text: 'Add Property', path: '/admin/properties/add', icon: <Add /> },
      { text: 'Property Analytics', path: '/admin/properties/analytics', icon: <Analytics /> },
      { text: 'Property Reviews', path: '/admin/properties/reviews', icon: <Star /> }
    ]
  },
  {
    text: 'Contact Management',
    icon: <Mail />,
    path: '/admin/contacts',
    badge: '23',
    color: 'secondary',
    subItems: [
      { text: 'All Contacts', path: '/admin/contacts', icon: <ContactSupport /> },
      { text: 'Contact Analytics', path: '/admin/contacts/analytics', icon: <Assessment /> },
      { text: 'Contact Templates', path: '/admin/contacts/templates', icon: <Description /> }
    ]
  },
  {
    text: 'Analytics & Reports',
    icon: <Analytics />,
    path: '/admin/analytics',
    badge: null,
    color: 'primary',
    subItems: [
      { text: 'Dashboard Analytics', path: '/admin/analytics', icon: <Dashboard /> },
      { text: 'User Analytics', path: '/admin/analytics/users', icon: <People /> },
      { text: 'Property Analytics', path: '/admin/analytics/properties', icon: <Home /> },
      { text: 'Revenue Analytics', path: '/admin/analytics/revenue', icon: <TrendingUp /> },
      { text: 'Performance Reports', path: '/admin/analytics/reports', icon: <Assessment /> }
    ]
  },
  {
    text: 'Security & Access',
    icon: <Security />,
    path: '/admin/security',
    badge: '3',
    color: 'error',
    subItems: [
      { text: 'Access Control', path: '/admin/security/access', icon: <Lock /> },
      { text: 'Security Logs', path: '/admin/security/logs', icon: <Security /> },
      { text: 'User Permissions', path: '/admin/security/permissions', icon: <VpnKey /> },
      { text: 'Security Settings', path: '/admin/security/settings', icon: <Shield /> }
    ]
  },
  {
    text: 'System Settings',
    icon: <Settings />,
    path: '/admin/settings',
    badge: null,
    color: 'default',
    subItems: [
      { text: 'General Settings', path: '/admin/settings/general', icon: <Settings /> },
      { text: 'Email Settings', path: '/admin/settings/email', icon: <Email /> },
      { text: 'Payment Settings', path: '/admin/settings/payment', icon: <Payment /> },
      { text: 'Notification Settings', path: '/admin/settings/notifications', icon: <Notifications /> },
      { text: 'Backup & Restore', path: '/admin/settings/backup', icon: <Backup /> }
    ]
  }
];

const AdminSidebar = ({ mobileOpen, collapsed, onDrawerToggle, onToggleCollapse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);

  const handleExpandClick = (itemText) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: theme.palette.background.paper,
      borderRight: `1px solid ${theme.palette.divider}`,
      background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
    }}>
      {/* Header */}
      <Toolbar sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: [2],
        minHeight: '80px !important',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        {!collapsed && (
          <Box>
            <Typography variant="h6" noWrap component="div" sx={{ 
              fontWeight: 700,
              fontSize: '1.2rem'
            }}>
              Admin Panel
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              Urban Realty
            </Typography>
          </Box>
        )}
        <IconButton 
          onClick={onToggleCollapse}
          sx={{ color: 'white' }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Toolbar>

      <Divider />

      {/* Quick Actions */}
      {!collapsed && (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Tooltip title="Add User">
              <IconButton size="small" sx={{ bgcolor: 'primary.light', color: 'white' }}>
                <PersonAdd fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Add Property">
              <IconButton size="small" sx={{ bgcolor: 'success.light', color: 'white' }}>
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Reports">
              <IconButton size="small" sx={{ bgcolor: 'warning.light', color: 'white' }}>
                <Assessment fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton size="small" sx={{ bgcolor: 'info.light', color: 'white' }}>
                <Settings fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      <Divider />

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, px: 1 }}>
        {menuItems.map((item) => {
          const isExpanded = expandedItems[item.text];
          const isActive = location.pathname === item.path || 
                          (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path));
          const hasSubItems = item.subItems && item.subItems.length > 0;

          return (
            <Box key={item.text}>
              <ListItem 
                disablePadding
                sx={{ 
                  mb: 0.5,
                  '& .MuiListItemButton-root': {
                    borderRadius: 2,
                    mx: 0.5,
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
                  component={hasSubItems ? 'div' : Link}
                  to={hasSubItems ? undefined : item.path}
                  selected={isActive}
                  onClick={hasSubItems ? () => handleExpandClick(item.text) : undefined}
                  sx={{
                    py: 1.5,
                    px: collapsed ? 2.5 : 3,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    minHeight: 48,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: collapsed ? 0 : 40,
                    color: isActive ? theme.palette.primary.contrastText : theme.palette.text.secondary
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  
                  {!collapsed && (
                    <>
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: isActive ? 600 : 400
                        }}
                      />
                      
                      {item.badge && (
                        <Badge 
                          badgeContent={item.badge} 
                          color={item.color}
                          sx={{ mr: 1 }}
                        />
                      )}
                      
                      {hasSubItems && (
                        <IconButton size="small">
                          {isExpanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      )}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Sub Items */}
              {hasSubItems && !collapsed && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => {
                      const isSubActive = location.pathname === subItem.path;
                      
                      return (
                        <ListItemButton
                          key={subItem.text}
                          component={Link}
                          to={subItem.path}
                          selected={isSubActive}
                          sx={{
                            pl: 6,
                            py: 1,
                            mx: 0.5,
                            borderRadius: 1,
                            minHeight: 40,
                            '&.Mui-selected': {
                              backgroundColor: theme.palette.primary.light,
                              '& .MuiListItemText-primary': {
                                color: theme.palette.primary.main,
                                fontWeight: 600
                              }
                            },
                            '&:hover': {
                              backgroundColor: theme.palette.action.hover
                            }
                          }}
                        >
                          <ListItemIcon sx={{ 
                            minWidth: 32,
                            color: isSubActive ? theme.palette.primary.main : theme.palette.text.secondary
                          }}>
                            {subItem.icon}
                          </ListItemIcon>
                          <ListItemText 
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: '0.85rem'
                            }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>

      {/* Footer */}
      <Divider />
      <Box sx={{ p: 2 }}>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
              <AdminPanelSettings />
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                Admin User
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Super Admin
              </Typography>
            </Box>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', gap: 1, justifyContent: collapsed ? 'center' : 'space-between' }}>
          <Tooltip title="Help & Support">
            <IconButton size="small" color="primary">
              <Help fontSize="small" />
            </IconButton>
          </Tooltip>
          
          {!collapsed && (
            <Chip 
              label="v2.1.0" 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          )}
          
          <Tooltip title="Settings">
            <IconButton size="small" color="primary">
              <Settings fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: collapsed ? 80 : drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
          },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: collapsed ? 80 : drawerWidth,
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)'
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;