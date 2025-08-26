import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Typography, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  Badge, 
  Tooltip, 
  Divider,
  ListItemIcon,
  ListItemText,
  Switch,
  FormControlLabel,
  Chip,
  Button,
  InputBase,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Settings,
  Help,
  Logout,
  DarkMode,
  LightMode,
  Language,
  AdminPanelSettings,
  SupervisedUserCircle,
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ onDrawerToggle, collapsed, onToggleCollapse }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleSearchMenuOpen = (event) => {
    setSearchAnchorEl(event.currentTarget);
  };

  const handleSearchMenuClose = () => {
    setSearchAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'New User Registration',
      message: 'John Doe has registered as a new user',
      time: '2 minutes ago',
      type: 'info',
      read: false
    },
    {
      id: 2,
      title: 'Property Added',
      message: 'New property "Sunset Villa" has been added',
      time: '5 minutes ago',
      type: 'success',
      read: false
    },
    {
      id: 3,
      title: 'Access Violation',
      message: 'User attempted to access premium feature',
      time: '10 minutes ago',
      type: 'warning',
      read: true
    },
    {
      id: 4,
      title: 'System Update',
      message: 'System maintenance completed successfully',
      time: '1 hour ago',
      type: 'info',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleOutline color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={onDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          {!isMobile && (
            <IconButton
              color="inherit"
              onClick={onToggleCollapse}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography 
            variant="h6" 
            noWrap 
            component="div"
            sx={{ 
              fontWeight: 700,
              display: { xs: 'none', sm: 'block' }
            }}
          >
            Urban Realty Admin
          </Typography>
        </Box>

        {/* Center Section - Search */}
        <Box sx={{ 
          display: { xs: 'none', md: 'flex' }, 
          flex: 1, 
          maxWidth: 600, 
          mx: 4 
        }}>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              bgcolor: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1, color: 'white' }}
              placeholder="Search users, properties, reports..."
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton type="button" sx={{ p: '10px', color: 'white' }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Search Button for Mobile */}
          <Tooltip title="Search">
            <IconButton
              color="inherit"
              onClick={handleSearchMenuOpen}
              sx={{ display: { xs: 'flex', md: 'none' } }}
            >
              <SearchIcon />
            </IconButton>
          </Tooltip>

          {/* Notifications */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={unreadCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Theme Toggle */}
          <Tooltip title="Toggle Theme">
            <IconButton
              color="inherit"
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {/* User Profile */}
          <Tooltip title="Account Settings">
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white'
                }}
              >
                <AdminPanelSettings />
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: {
            width: 400,
            maxHeight: 500,
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Notifications</Typography>
          <Chip 
            label={`${unreadCount} unread`} 
            size="small" 
            color="primary" 
            sx={{ ml: 1 }}
          />
        </Box>
        
        <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
          {notifications.map((notification) => (
            <MenuItem 
              key={notification.id}
              sx={{ 
                py: 2,
                borderBottom: 1,
                borderColor: 'divider',
                bgcolor: notification.read ? 'transparent' : 'action.hover'
              }}
            >
              <ListItemIcon>
                {getNotificationIcon(notification.type)}
              </ListItemIcon>
              <ListItemText
                primary={notification.title}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {notification.message}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {notification.time}
                    </Typography>
                  </Box>
                }
              />
              {!notification.read && (
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />
              )}
            </MenuItem>
          ))}
        </Box>
        
        <Divider />
        <MenuItem onClick={handleNotificationMenuClose}>
          <ListItemText primary="View All Notifications" />
        </MenuItem>
      </Menu>

      {/* Search Menu for Mobile */}
      <Menu
        anchorEl={searchAnchorEl}
        open={Boolean(searchAnchorEl)}
        onClose={handleSearchMenuClose}
        PaperProps={{
          sx: {
            width: '90vw',
            maxWidth: 400,
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search users, properties, reports..."
              inputProps={{ 'aria-label': 'search' }}
            />
            <IconButton type="button" sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
          </Paper>
        </Box>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: {
            width: 280,
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 48, height: 48, mr: 2 }}>
              <AdminPanelSettings />
            </Avatar>
            <Box>
              <Typography variant="h6">Admin User</Typography>
              <Typography variant="body2" color="text.secondary">
                Super Administrator
              </Typography>
            </Box>
          </Box>
          <Chip label="Online" color="success" size="small" />
        </Box>

        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </MenuItem>

        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Account Settings" />
        </MenuItem>

        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <AdminPanelSettings />
          </ListItemIcon>
          <ListItemText primary="Admin Settings" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Help />
          </ListItemIcon>
          <ListItemText primary="Help & Support" />
        </MenuItem>

        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemIcon>
            <Info />
          </ListItemIcon>
          <ListItemText primary="About" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default AdminHeader;