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
  InputLabel
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
  Notifications as NotificationsIcon
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
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [violationDialogOpen, setViolationDialogOpen] = useState(false);

  useEffect(() => {
    fetchStats();
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Admin Dashboard</Typography>
        <Box>
          <IconButton onClick={fetchStats} color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Main Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Users</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.users}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Registered users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Agents</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.agents}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Active agents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Properties</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.properties}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Listed properties
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Contacts</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.contacts}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total inquiries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subscription and Revenue Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Subscriptions</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.subscriptions}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Active plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="h3">${stats.counts.revenue}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Monthly revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <SecurityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Access Violations</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.accessViolations}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                This month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Pending Upgrades</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.pendingUpgrades}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Awaiting action
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Access Control Overview */}
      <SubscriptionProtected requiredPlan="enterprise" feature="Access Control Monitoring">
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              Access Control Overview
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 2 }}>
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
                    <Typography variant="h6" color="primary">
                      {stats.accessControl.totalChecks}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Checks
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" color="error">
                      {stats.accessControl.deniedAccess}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Denied Access
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" color="warning.main">
                      {stats.accessControl.upgradePrompts}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Upgrade Prompts
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" color="success.main">
                      {stats.accessControl.successfulUpgrades}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Successful Upgrades
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Recent Access Violations
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 200 }}>
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
          </CardContent>
        </Card>
      </SubscriptionProtected>

      {/* Subscription Breakdown */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon sx={{ mr: 1 }} />
            Subscription Plan Distribution
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="text.secondary">
                      {stats.subscriptionBreakdown.free}
                    </Typography>
                    <Chip label="Free" color="default" />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="primary">
                      {stats.subscriptionBreakdown.basic}
                    </Typography>
                    <Chip label="Basic" color="primary" />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="secondary">
                      {stats.subscriptionBreakdown.premium}
                    </Typography>
                    <Chip label="Premium" color="secondary" />
                  </Box>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <Box textAlign="center">
                    <Typography variant="h4" color="success.main">
                      {stats.subscriptionBreakdown.enterprise}
                    </Typography>
                    <Chip label="Enterprise" color="success" />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>
                Recent Subscription Changes
              </Typography>
              <Box>
                {stats.recent.subscriptionChanges.slice(0, 3).map((change, index) => (
                  <Box key={index} sx={{ mb: 1, p: 1, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2">
                      <strong>{change.userName}</strong> {change.action}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(change.timestamp).toLocaleDateString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Subscription Analytics Section */}
      <SubscriptionProtected requiredPlan="enterprise" feature="Advanced Analytics">
        <Box sx={{ mb: 4 }}>
          <SubscriptionAnalytics />
        </Box>
      </SubscriptionProtected>

      {/* Recent Activity Section */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#78CADC' }}>
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