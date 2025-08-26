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
  Tabs,
  Tab,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Switch,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AlertTitle,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon
} from '@mui/material';
import { 
  TrendingUp as TrendingUpIcon, 
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
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Star as StarIcon,
  Assessment as AssessmentIcon,
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  ContactSupport as ContactIcon,
  MonetizationOn as RevenueIcon,
  Timeline as TimelineIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Security as SecurityIcon,
  VpnKey as KeyIcon,
  Storage as StorageIcon,
  CloudUpload as CloudIcon,
  SystemUpdate as SystemIcon,
  BugReport as BugIcon,
  Support as SupportIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  History as HistoryIcon
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from '../../services/axios';
import RecentUsers from '../../components/admin/RecentUsers';
import RecentProperties from '../../components/admin/RecentProperties';
import RecentContacts from '../../components/admin/RecentContacts';
import SubscriptionAnalytics from '../../components/admin/SubscriptionAnalytics';
import SubscriptionProtected from '../../components/common/SubscriptionProtected';
import AdminReports from './AdminReports';
import AdminAuditLogs from './AdminAuditLogs';
import UsersTable from './UsersTable';
import PropertiesTable from './PropertiesTable';

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
    system: {
      uptime: 0,
      memoryUsage: 0,
      cpuUsage: 0,
      diskUsage: 0,
      activeConnections: 0,
      lastBackup: null,
      pendingUpdates: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [violationDialogOpen, setViolationDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true,
    securityAlerts: true,
    performanceMonitoring: true
  });
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchSystemInfo();
    setupQuickActions();
  }, []);

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
          system: response.data.data.system || {
            uptime: 0,
            memoryUsage: 0,
            cpuUsage: 0,
            diskUsage: 0,
            activeConnections: 0,
            lastBackup: null,
            pendingUpdates: 0
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

  const fetchSystemInfo = async () => {
    try {
      const response = await axios.get('/admin/system-info', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setStats(prev => ({
          ...prev,
          system: { ...prev.system, ...response.data.data }
        }));
      }
    } catch (err) {
      console.error('Error fetching system info:', err);
    }
  };

  const setupQuickActions = () => {
    setQuickActions([
      { icon: <AddIcon />, name: 'Add User', action: () => console.log('Add User') },
      { icon: <HomeIcon />, name: 'Add Property', action: () => console.log('Add Property') },
      { icon: <PersonIcon />, name: 'Verify Agent', action: () => console.log('Verify Agent') },
      { icon: <BackupIcon />, name: 'Backup Data', action: () => console.log('Backup Data') },
      { icon: <SettingsIcon />, name: 'System Settings', action: () => console.log('System Settings') },
      { icon: <SupportIcon />, name: 'Support Ticket', action: () => console.log('Support Ticket') }
    ]);
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
        fetchStats();
        setViolationDialogOpen(false);
        setSelectedViolation(null);
      }
    } catch (err) {
      console.error('Error handling violation:', err);
    }
  };

  const handleSystemSettingChange = async (setting, value) => {
    try {
      await axios.put('/admin/system-settings', {
        [setting]: value
      });
      setSystemSettings(prev => ({ ...prev, [setting]: value }));
    } catch (err) {
      console.error('Error updating system setting:', err);
    }
  };

  const getAccessControlPercentage = () => {
    if (stats.accessControl.totalChecks === 0) return 0;
    return ((stats.accessControl.totalChecks - stats.accessControl.deniedAccess) / stats.accessControl.totalChecks) * 100;
  };

  const getSystemHealthColor = () => {
    const { memoryUsage, cpuUsage, diskUsage } = stats.system;
    if (memoryUsage > 80 || cpuUsage > 80 || diskUsage > 90) return 'error';
    if (memoryUsage > 60 || cpuUsage > 60 || diskUsage > 70) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back! Here's what's happening with your system.
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={fetchStats}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setActiveTab(4)}
          >
            Settings
          </Button>
        </Box>
      </Box>

      {/* System Health Alert */}
      {getSystemHealthColor() !== 'success' && (
        <Alert 
          severity={getSystemHealthColor()} 
          sx={{ mb: 3 }}
          action={
            <Button color="inherit" size="small">
              View Details
            </Button>
          }
        >
          <AlertTitle>System Health Alert</AlertTitle>
          {getSystemHealthColor() === 'error' 
            ? 'Critical system resources are running low. Immediate attention required.'
            : 'System resources are above recommended thresholds.'
          }
        </Alert>
      )}
      
      {/* Main Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Users
                  </Typography>
                  <Typography variant="h4">{stats.counts.users}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    +12% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Properties
                  </Typography>
                  <Typography variant="h4">{stats.counts.properties}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    +8% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <HomeIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Revenue
                  </Typography>
                  <Typography variant="h4">${stats.counts.revenue.toLocaleString()}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    +15% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    System Health
                  </Typography>
                  <Typography variant="h4" color={getSystemHealthColor()}>
                    {getSystemHealthColor() === 'success' ? 'Good' : 
                     getSystemHealthColor() === 'warning' ? 'Fair' : 'Poor'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {stats.system.uptime} days uptime
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: getSystemHealthColor() === 'success' ? 'success.main' : 
                                        getSystemHealthColor() === 'warning' ? 'warning.main' : 'error.main' }}>
                  <SecurityIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different sections */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Overview" icon={<DashboardIcon />} />
          <Tab label="Users & Agents" icon={<PeopleIcon />} />
          <Tab label="Properties" icon={<HomeIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
          <Tab label="System" icon={<SettingsIcon />} />
          <Tab label="Security" icon={<SecurityIcon />} />
          <Tab label="Reports" icon={<AssessmentIcon />} />
          <Tab label="Audit Logs" icon={<HistoryIcon />} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          {/* Subscription Analytics */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Subscription Breakdown</Typography>
                <Box sx={{ mt: 2 }}>
                  {Object.entries(stats.subscriptionBreakdown).map(([plan, count]) => (
                    <Box key={plan} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                        {plan} Plan
                      </Typography>
                      <Chip label={count} size="small" color="primary" />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Access Control */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Access Control</Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Success Rate</Typography>
                    <Typography variant="body2">{getAccessControlPercentage().toFixed(1)}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={getAccessControlPercentage()} 
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Total Checks</Typography>
                    <Typography variant="body2">{stats.accessControl.totalChecks}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Denied Access</Typography>
                    <Typography variant="body2">{stats.accessControl.deniedAccess}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Recent Users</Typography>
                    <List dense>
                      {stats.recent.users.slice(0, 3).map((user, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar>{user.name?.charAt(0) || 'U'}</Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={user.name || 'Unknown User'}
                            secondary={user.email}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Recent Properties</Typography>
                    <List dense>
                      {stats.recent.properties.slice(0, 3).map((property, index) => (
                        <ListItem key={index}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                              <HomeIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={property.title || 'Untitled Property'}
                            secondary={`$${property.price?.toLocaleString() || '0'}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>User Management</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Add New User
                  </Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />}>
                    Export Users
                  </Button>
                  <Button variant="outlined" startIcon={<UploadIcon />}>
                    Import Users
                  </Button>
                </Box>
                <UsersTable />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Property Management</Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                  <Button variant="contained" startIcon={<AddIcon />}>
                    Add New Property
                  </Button>
                  <Button variant="outlined" startIcon={<FilterIcon />}>
                    Filter Properties
                  </Button>
                  <Button variant="outlined" startIcon={<DownloadIcon />}>
                    Export Properties
                  </Button>
                </Box>
                <PropertiesTable />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Analytics Dashboard</Typography>
                <SubscriptionAnalytics />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 4 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>System Settings</Typography>
                <Box sx={{ mt: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onChange={(e) => handleSystemSettingChange('maintenanceMode', e.target.checked)}
                      />
                    }
                    label="Maintenance Mode"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings.autoBackup}
                        onChange={(e) => handleSystemSettingChange('autoBackup', e.target.checked)}
                      />
                    }
                    label="Auto Backup"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings.emailNotifications}
                        onChange={(e) => handleSystemSettingChange('emailNotifications', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={systemSettings.securityAlerts}
                        onChange={(e) => handleSystemSettingChange('securityAlerts', e.target.checked)}
                      />
                    }
                    label="Security Alerts"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>System Resources</Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Memory Usage</Typography>
                    <Typography variant="body2">{stats.system.memoryUsage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.system.memoryUsage} 
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">CPU Usage</Typography>
                    <Typography variant="body2">{stats.system.cpuUsage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.system.cpuUsage} 
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Disk Usage</Typography>
                    <Typography variant="body2">{stats.system.diskUsage}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.system.diskUsage} 
                    sx={{ mb: 2 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 5 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Security Overview</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Access Violations</Typography>
                    <List dense>
                      {stats.recent.accessViolations.slice(0, 5).map((violation, index) => (
                        <ListItem key={index} button onClick={() => handleViolationClick(violation)}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'error.main' }}>
                              <WarningIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={violation.user?.email || 'Unknown User'}
                            secondary={violation.resource || 'Unknown Resource'}
                          />
                          <Chip 
                            label={violation.status || 'Pending'} 
                            size="small" 
                            color={violation.status === 'Resolved' ? 'success' : 'warning'}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" gutterBottom>Security Metrics</Typography>
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Total Violations</Typography>
                        <Typography variant="body2">{stats.counts.accessViolations}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Pending Resolution</Typography>
                        <Typography variant="body2">
                          {stats.recent.accessViolations.filter(v => v.status !== 'Resolved').length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">Security Score</Typography>
                        <Typography variant="body2">
                          {Math.max(0, 100 - (stats.counts.accessViolations * 5))}/100
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 6 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AdminReports />
          </Grid>
        </Grid>
      )}

      {activeTab === 7 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <AdminAuditLogs />
          </Grid>
        </Grid>
      )}

      {/* Violation Dialog */}
      <Dialog open={violationDialogOpen} onClose={() => setViolationDialogOpen(false)}>
        <DialogTitle>Handle Access Violation</DialogTitle>
        <DialogContent>
          {selectedViolation && (
            <Box>
              <Typography variant="body1" gutterBottom>
                User: {selectedViolation.user?.email || 'Unknown'}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Resource: {selectedViolation.resource || 'Unknown'}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Time: {new Date(selectedViolation.timestamp).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViolationDialogOpen(false)}>Cancel</Button>
          <Button onClick={() => handleViolationAction('warn')} color="warning">
            Warn User
          </Button>
          <Button onClick={() => handleViolationAction('block')} color="error">
            Block Access
          </Button>
        </DialogActions>
      </Dialog>

      {/* Quick Actions Speed Dial */}
      <SpeedDial
        ariaLabel="Quick Actions"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {quickActions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>
    </Box>
  );
};

export default AdminDashboard;