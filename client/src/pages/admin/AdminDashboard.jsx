import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
  Box, 
  Button,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Badge,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Switch,
  AlertTitle,
  CardActions,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon, 
  AttachMoney as MoneyIcon, 
  Business as BusinessIcon,
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as ShowChartIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Add as AddIcon,
  Search as SearchIcon,
  FilterAlt as FilterAltIcon,
  Sort as SortIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  AutoGraph as AutoGraphIcon,
  Psychology as PsychologyIcon,
  Insights as InsightsIcon,
  Campaign as CampaignIcon,
  Support as SupportIcon,
  BugReport as BugReportIcon,
  SystemUpdate as SystemUpdateIcon,
  Storage as StorageIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  VerifiedUser as VerifiedUserIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
  Group as GroupIcon,
  PersonAdd as PersonAddIcon,
  PersonRemove as PersonRemoveIcon,
  PersonOff as PersonOffIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Flag as FlagIcon,
  Report as ReportIcon,
  Block as BlockIcon,
  Unblock as UnblockIcon,
  Delete as DeleteIcon,
  Archive as ArchiveIcon,
  Restore as RestoreIcon,
  VisibilityOff as VisibilityOffIcon,
  Public as PublicIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  VpnKey as VpnKeyIcon,
  Key as KeyIcon,
  KeyOff as KeyOffIcon,
  Password as PasswordIcon,
  Shield as ShieldIcon,
  ShieldCheck as ShieldCheckIcon,
  ShieldAlert as ShieldAlertIcon,
  ShieldOff as ShieldOffIcon,
  Verified as VerifiedIcon,
  Unverified as UnverifiedIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  CancelOutlined as CancelOutlinedIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Success as SuccessIcon,
  Info as InfoIcon,
  QuestionMark as QuestionMarkIcon,
  Lightbulb as LightbulbIcon,
  TipsAndUpdates as TipsAndUpdatesIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Article as ArticleIcon,
  Description as DescriptionIcon,
  Assignment as AssignmentIcon,
  Task as TaskIcon,
  Checklist as ChecklistIcon,
  Done as DoneIcon,
  Pending as PendingIcon,
  Schedule as ScheduleIcon,
  Event as EventIcon,
  Today as TodayIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  Timer as TimerIcon,
  HourglassEmpty as HourglassEmptyIcon,
  HourglassFull as HourglassFullIcon,
  Update as UpdateIcon,
  Sync as SyncIcon,
  Cached as CachedIcon,
  Autorenew as AutorenewIcon,
  Loop as LoopIcon,
  RotateRight as RotateRightIcon,
  RotateLeft as RotateLeftIcon,
  Refresh as RefreshIcon,
  GetApp as GetAppIcon,
  FileDownload as FileDownloadIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Save as SaveIcon,
  SaveAlt as SaveAltIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Description as DescriptionIcon,
  PictureAsPdf as PictureAsPdfIcon,
  Image as ImageIcon,
  VideoFile as VideoFileIcon,
  AudioFile as AudioFileIcon,
  Code as CodeIcon,
  DataObject as DataObjectIcon,
  Functions as FunctionsIcon,
  Calculate as CalculateIcon,
  Functions as FunctionsIcon,
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  TrendingFlat as TrendingFlatIcon,
  ShowChart as ShowChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  BubbleChart as BubbleChartIcon,
  ScatterPlot as ScatterPlotIcon,
  MultilineChart as MultilineChartIcon,
  StackedLineChart as StackedLineChartIcon,
  SplineChart as SplineChartIcon,
  CandlestickChart as CandlestickChartIcon,
  WaterfallChart as WaterfallChartIcon,
  Radar as RadarIcon,
  PolarAreaChart as PolarAreaChartIcon,
  DoughnutChart as DoughnutChartIcon,
  DonutLarge as DonutLargeIcon,
  DonutSmall as DonutSmallIcon,
  PieChart as PieChartIcon,
  PieChartOutline as PieChartOutlineIcon,
  BarChart as BarChartIcon,
  BarChartOutlined as BarChartOutlinedIcon,
  StackedBarChart as StackedBarChartIcon,
  GroupedBarChart as GroupedBarChartIcon,
  HorizontalBarChart as HorizontalBarChartIcon,
  VerticalBarChart as VerticalBarChartIcon,
  ColumnChart as ColumnChartIcon,
  RowChart as RowChartIcon,
  AreaChart as AreaChartIcon,
  StackedAreaChart as StackedAreaChartIcon,
  LineChart as LineChartIcon,
  SplineChart as SplineChartIcon,
  StepChart as StepChartIcon,
  StepLineChart as StepLineChartIcon,
  StepAreaChart as StepAreaChartIcon,
  StepBarChart as StepBarChartIcon,
  StepColumnChart as StepColumnChartIcon,
  StepPieChart as StepPieChartIcon,
  StepDonutChart as StepDonutChartIcon,
  StepRadarChart as StepRadarChartIcon,
  StepPolarChart as StepPolarChartIcon,
  StepBubbleChart as StepBubbleChartIcon,
  StepScatterChart as StepScatterChartIcon,
  StepCandlestickChart as StepCandlestickChartIcon,
  StepWaterfallChart as StepWaterfallChartIcon,
  StepFunnelChart as StepFunnelChartIcon,
  StepGaugeChart as StepGaugeChartIcon,
  StepHeatmapChart as StepHeatmapChartIcon,
  StepTreemapChart as StepTreemapChartIcon,
  StepSunburstChart as StepSunburstChartIcon,
  StepSankeyChart as StepSankeyChartIcon,
  StepChordChart as StepChordChartIcon,
  StepForceChart as StepForceChartIcon,
  StepVoronoiChart as StepVoronoiChartIcon,
  StepDelaunayChart as StepDelaunayChartIcon,
  StepConvexHullChart as StepConvexHullChartIcon,
  StepAlphaShapeChart as StepAlphaShapeChartIcon,
  StepBetaShapeChart as StepBetaShapeChartIcon,
  StepGammaShapeChart as StepGammaShapeChartIcon,
  StepDeltaShapeChart as StepDeltaShapeChartIcon,
  StepEpsilonShapeChart as StepEpsilonShapeChartIcon,
  StepZetaShapeChart as StepZetaShapeChartIcon,
  StepEtaShapeChart as StepEtaShapeChartIcon,
  StepThetaShapeChart as StepThetaShapeChartIcon,
  StepIotaShapeChart as StepIotaShapeChartIcon,
  StepKappaShapeChart as StepKappaShapeChartIcon,
  StepLambdaShapeChart as StepLambdaShapeChartIcon,
  StepMuShapeChart as StepMuShapeChartIcon,
  StepNuShapeChart as StepNuShapeChartIcon,
  StepXiShapeChart as StepXiShapeChartIcon,
  StepOmicronShapeChart as StepOmicronShapeChartIcon,
  StepPiShapeChart as StepPiShapeChartIcon,
  StepRhoShapeChart as StepRhoShapeChartIcon,
  StepSigmaShapeChart as StepSigmaShapeChartIcon,
  StepTauShapeChart as StepTauShapeChartIcon,
  StepUpsilonShapeChart as StepUpsilonShapeChartIcon,
  StepPhiShapeChart as StepPhiShapeChartIcon,
  StepChiShapeChart as StepChiShapeChartIcon,
  StepPsiShapeChart as StepPsiShapeChartIcon,
  StepOmegaShapeChart as StepOmegaShapeChartIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from '../../services/axios';
import RecentUsers from '../../components/admin/RecentUsers';
import RecentProperties from '../../components/admin/RecentProperties';
import RecentContacts from '../../components/admin/RecentContacts';
import SubscriptionAnalytics from '../../components/admin/SubscriptionAnalytics';
import SubscriptionProtected from '../../components/common/SubscriptionProtected';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      agents: 0,
      properties: 0,
      contacts: 0,
      subscriptions: 0,
      revenue: 0,
      accessViolations: 0,
      pendingUpgrades: 0
    },
    recent: {
      users: [],
      properties: [],
      contacts: [],
      accessViolations: [],
      subscriptionChanges: []
    },
    subscriptionBreakdown: {
      free: 0,
      basic: 0,
      premium: 0,
      enterprise: 0
    },
    accessControl: {
      totalChecks: 0,
      deniedAccess: 0,
      upgradePrompts: 0,
      successfulUpgrades: 0
    },
    analytics: {
      userGrowth: [],
      revenueGrowth: [],
      propertyViews: [],
      conversionRates: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [violationDialogOpen, setViolationDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    fetchStats();
    
    // Auto-refresh every 30 seconds if enabled
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchStats, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setStats({
          counts: response.data.data.counts || {
            users: 0,
            agents: 0,
            properties: 0,
            contacts: 0,
            subscriptions: 0,
            revenue: 0,
            accessViolations: 0,
            pendingUpgrades: 0
          },
          recent: response.data.data.recent || {
            users: [],
            properties: [],
            contacts: [],
            accessViolations: [],
            subscriptionChanges: []
          },
          subscriptionBreakdown: response.data.data.subscriptionBreakdown || {
            free: 0,
            basic: 0,
            premium: 0,
            enterprise: 0
          },
          accessControl: response.data.data.accessControl || {
            totalChecks: 0,
            deniedAccess: 0,
            upgradePrompts: 0,
            successfulUpgrades: 0
          },
          analytics: response.data.data.analytics || {
            userGrowth: [],
            revenueGrowth: [],
            propertyViews: [],
            conversionRates: []
          }
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViolationClick = (violation) => {
    setSelectedViolation(violation);
    setViolationDialogOpen(true);
  };

  const handleViolationAction = async (action) => {
    try {
      if (selectedViolation) {
        await axios.put(`/admin/access-violations/${selectedViolation.id}`, {
          action: action
        });
        // Refresh stats
        fetchStats();
        setViolationDialogOpen(false);
        setSelectedViolation(null);
      }
    } catch (err) {
      console.error('Error handling violation:', err);
    }
  };

  const getAccessControlPercentage = () => {
    if (stats.accessControl.totalChecks === 0) return 0;
    return ((stats.accessControl.totalChecks - stats.accessControl.deniedAccess) / stats.accessControl.totalChecks) * 100;
  };

  const getGrowthRate = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const speedDialActions = [
    { icon: <RefreshIcon />, name: 'Refresh Data', action: fetchStats },
    { icon: <DownloadIcon />, name: 'Export Report', action: () => console.log('Export') },
    { icon: <PrintIcon />, name: 'Print Dashboard', action: () => window.print() },
    { icon: <ShareIcon />, name: 'Share Dashboard', action: () => console.log('Share') },
    { icon: <AddIcon />, name: 'Add New User', action: () => console.log('Add User') },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading Dashboard...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
          <Button onClick={fetchStats} sx={{ ml: 2 }}>Retry</Button>
        </Alert>
      </Box>
    );
  }
  
  return (
    <Box sx={{ position: 'relative' }}>
      {/* Header Section */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Box>
          <Typography variant="h3" sx={{ 
            fontWeight: 700,
            background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's what's happening with your platform today.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Tooltip title="Toggle Auto Refresh">
            <Switch
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              color="primary"
            />
          </Tooltip>
          
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchStats} color="primary" sx={{ bgcolor: 'primary.light', color: 'white' }}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Toggle Fullscreen">
            <IconButton onClick={() => setFullscreen(!fullscreen)} color="primary">
              {fullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <PeopleIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Total Users</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +12% this month
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.counts.users.toLocaleString()}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">Active users</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Properties</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +8% this month
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.counts.properties.toLocaleString()}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <HomeIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">Listed properties</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Revenue</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +15% this month
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>${stats.counts.revenue.toLocaleString()}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">Monthly revenue</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100px',
              height: '100px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              transform: 'translate(30px, -30px)'
            }
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2 }}>
                  <TrendingUpIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6">Subscriptions</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    +20% this month
                  </Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>{stats.counts.subscriptions.toLocaleString()}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 16, mr: 0.5 }} />
                <Typography variant="body2">Active plans</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Analytics Tabs */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
              <Tab label="Overview" icon={<DashboardIcon />} />
              <Tab label="Analytics" icon={<AnalyticsIcon />} />
              <Tab label="Security" icon={<SecurityIcon />} />
              <Tab label="Performance" icon={<SpeedIcon />} />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <Grid container spacing={3}>
              {/* Subscription Breakdown */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <PieChartIcon sx={{ mr: 1 }} />
                  Subscription Distribution
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center" sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                      <Typography variant="h4" color="text.secondary">
                        {stats.subscriptionBreakdown.free}
                      </Typography>
                      <Chip label="Free" color="default" size="small" />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white">
                        {stats.subscriptionBreakdown.basic}
                      </Typography>
                      <Chip label="Basic" color="primary" size="small" />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" sx={{ p: 2, bgcolor: 'secondary.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white">
                        {stats.subscriptionBreakdown.premium}
                      </Typography>
                      <Chip label="Premium" color="secondary" size="small" />
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center" sx={{ p: 2, bgcolor: 'success.light', borderRadius: 2 }}>
                      <Typography variant="h4" color="white">
                        {stats.subscriptionBreakdown.enterprise}
                      </Typography>
                      <Chip label="Enterprise" color="success" size="small" />
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              {/* Recent Activity */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimelineIcon sx={{ mr: 1 }} />
                  Recent Activity
                </Typography>
                <List dense>
                  {stats.recent.subscriptionChanges.slice(0, 5).map((change, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={change.userName}
                        secondary={`${change.action} • ${new Date(change.timestamp).toLocaleDateString()}`}
                      />
                      <ListItemSecondaryAction>
                        <Chip label={change.action} size="small" color="primary" />
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          )}

          {activeTab === 1 && (
            <SubscriptionProtected requiredPlan="enterprise" feature="Advanced Analytics">
              <SubscriptionAnalytics />
            </SubscriptionProtected>
          )}

          {activeTab === 2 && (
            <SubscriptionProtected requiredPlan="enterprise" feature="Security Monitoring">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <SecurityIcon sx={{ mr: 1 }} />
                    Access Control Overview
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Access Control Success Rate
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ flex: 1, mr: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={getAccessControlPercentage()} 
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Typography variant="body2">
                        {getAccessControlPercentage().toFixed(1)}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box textAlign="center" sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2 }}>
                        <Typography variant="h6" color="white">
                          {stats.accessControl.totalChecks}
                        </Typography>
                        <Typography variant="body2" color="white">
                          Total Checks
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box textAlign="center" sx={{ p: 2, bgcolor: 'error.light', borderRadius: 2 }}>
                        <Typography variant="h6" color="white">
                          {stats.accessControl.deniedAccess}
                        </Typography>
                        <Typography variant="body2" color="white">
                          Denied Access
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>
                    Recent Access Violations
                  </Typography>
                  <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Feature</TableCell>
                          <TableCell>Required Plan</TableCell>
                          <TableCell>Action</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.recent.accessViolations.slice(0, 5).map((violation, index) => (
                          <TableRow key={index} hover>
                            <TableCell>{violation.userName}</TableCell>
                            <TableCell>{violation.feature}</TableCell>
                            <TableCell>
                              <Chip 
                                label={violation.requiredPlan} 
                                size="small" 
                                color="warning"
                              />
                            </TableCell>
                            <TableCell>
                              <IconButton 
                                size="small" 
                                onClick={() => handleViolationClick(violation)}
                              >
                                <VisibilityIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </Grid>
            </SubscriptionProtected>
          )}

          {activeTab === 3 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <SpeedIcon sx={{ mr: 1 }} />
                  System Performance
                </Typography>
                <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="h6" color="primary">98.5%</Typography>
                      <Typography variant="body2" color="text.secondary">Uptime</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color="success.main">245ms</Typography>
                      <Typography variant="body2" color="text.secondary">Avg Response</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color="warning.main">1.2GB</Typography>
                      <Typography variant="body2" color="text.secondary">Memory Usage</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="h6" color="info.main">45%</Typography>
                      <Typography variant="body2" color="text.secondary">CPU Usage</Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                  <StorageIcon sx={{ mr: 1 }} />
                  Storage Usage
                </Typography>
                <Box sx={{ p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Database Storage
                    </Typography>
                    <LinearProgress variant="determinate" value={65} sx={{ height: 8, borderRadius: 4 }} />
                    <Typography variant="body2">65% used (6.5GB / 10GB)</Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      File Storage
                    </Typography>
                    <LinearProgress variant="determinate" value={45} sx={{ height: 8, borderRadius: 4 }} />
                    <Typography variant="body2">45% used (4.5GB / 10GB)</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Backup Storage
                    </Typography>
                    <LinearProgress variant="determinate" value={30} sx={{ height: 8, borderRadius: 4 }} />
                    <Typography variant="body2">30% used (3GB / 10GB)</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Section */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#78CADC', fontWeight: 600 }}>
        Recent Activity
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RecentUsers users={stats.recent.users} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentProperties properties={stats.recent.properties} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentContacts contacts={stats.recent.contacts} />
        </Grid>
      </Grid>

      {/* Speed Dial */}
      <SpeedDial
        ariaLabel="Admin actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {speedDialActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>

      {/* Access Violation Dialog */}
      <Dialog 
        open={violationDialogOpen} 
        onClose={() => setViolationDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Access Violation Details
        </DialogTitle>
        <DialogContent>
          {selectedViolation && (
            <Box>
              <Typography variant="body1" gutterBottom>
                <strong>User:</strong> {selectedViolation.userName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Feature:</strong> {selectedViolation.feature}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Required Plan:</strong> {selectedViolation.requiredPlan}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Current Plan:</strong> {selectedViolation.currentPlan}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Timestamp:</strong> {new Date(selectedViolation.timestamp).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>IP Address:</strong> {selectedViolation.ipAddress}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViolationDialogOpen(false)}>
            Close
          </Button>
          <Button 
            onClick={() => handleViolationAction('warn')}
            color="warning"
          >
            Send Warning
          </Button>
          <Button 
            onClick={() => handleViolationAction('block')}
            color="error"
          >
            Block User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;