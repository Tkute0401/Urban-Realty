import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AttachMoney as MoneyIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  Analytics as AnalyticsIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import axios from '../../services/axios';

const SubscriptionAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {
      totalRevenue: 0,
      monthlyGrowth: 0,
      activeSubscriptions: 0,
      churnRate: 0
    },
    planBreakdown: {
      free: { count: 0, revenue: 0, percentage: 0 },
      basic: { count: 0, revenue: 0, percentage: 0 },
      premium: { count: 0, revenue: 0, percentage: 0 },
      enterprise: { count: 0, revenue: 0, percentage: 0 }
    },
    trends: [],
    topUsers: [],
    recentChanges: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/admin/subscription-analytics?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setAnalytics(response.data.data || {
          overview: {
            totalRevenue: 125000,
            monthlyGrowth: 12.5,
            activeSubscriptions: 1250,
            churnRate: 2.3
          },
          planBreakdown: {
            free: { count: 800, revenue: 0, percentage: 64 },
            basic: { count: 300, revenue: 45000, percentage: 24 },
            premium: { count: 120, revenue: 60000, percentage: 9.6 },
            enterprise: { count: 30, revenue: 20000, percentage: 2.4 }
          },
          trends: [
            { month: 'Jan', revenue: 100000, subscriptions: 1000 },
            { month: 'Feb', revenue: 110000, subscriptions: 1100 },
            { month: 'Mar', revenue: 115000, subscriptions: 1150 },
            { month: 'Apr', revenue: 120000, subscriptions: 1200 },
            { month: 'May', revenue: 122000, subscriptions: 1220 },
            { month: 'Jun', revenue: 125000, subscriptions: 1250 }
          ],
          topUsers: [
            { name: 'John Doe', email: 'john@example.com', plan: 'enterprise', revenue: 5000, status: 'active' },
            { name: 'Jane Smith', email: 'jane@example.com', plan: 'premium', revenue: 3000, status: 'active' },
            { name: 'Bob Johnson', email: 'bob@example.com', plan: 'premium', revenue: 2800, status: 'active' }
          ],
          recentChanges: [
            { user: 'Alice Brown', action: 'upgraded', from: 'basic', to: 'premium', date: '2024-01-15' },
            { user: 'Charlie Wilson', action: 'downgraded', from: 'premium', to: 'basic', date: '2024-01-14' },
            { user: 'Diana Davis', action: 'cancelled', from: 'basic', to: 'none', date: '2024-01-13' }
          ]
        });
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    // In a real application, this would generate and download a CSV/Excel file
    console.log('Exporting analytics data...');
  };

  const getGrowthColor = (growth) => {
    return growth >= 0 ? 'success' : 'error';
  };

  const getGrowthIcon = (growth) => {
    return growth >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />;
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'enterprise': return 'error';
      case 'premium': return 'warning';
      case 'basic': return 'info';
      case 'free': return 'default';
      default: return 'default';
    }
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
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">Subscription Analytics</Typography>
        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="quarter">Last Quarter</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAnalytics}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4">
                    ${analytics.overview.totalRevenue.toLocaleString()}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    {getGrowthIcon(analytics.overview.monthlyGrowth)}
                    <Typography 
                      variant="body2" 
                      color={getGrowthColor(analytics.overview.monthlyGrowth)}
                      sx={{ ml: 0.5 }}
                    >
                      {analytics.overview.monthlyGrowth}%
                    </Typography>
                  </Box>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Active Subscriptions
                  </Typography>
                  <Typography variant="h4">
                    {analytics.overview.activeSubscriptions.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total active users
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
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Churn Rate
                  </Typography>
                  <Typography variant="h4">
                    {analytics.overview.churnRate}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Monthly churn
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingDownIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4">
                    {Math.round((1 - analytics.planBreakdown.free.percentage / 100) * 100)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Free to paid
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <AnalyticsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Plan Breakdown */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Plan Distribution</Typography>
              {Object.entries(analytics.planBreakdown).map(([plan, data]) => (
                <Box key={plan} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Box display="flex" alignItems="center">
                      <Chip 
                        label={plan.charAt(0).toUpperCase() + plan.slice(1)} 
                        color={getPlanColor(plan)}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Typography variant="body2">
                        {data.count} users ({data.percentage}%)
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2">
                      ${data.revenue.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={data.percentage} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Changes</Typography>
              <List dense>
                {analytics.recentChanges.slice(0, 5).map((change, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: change.action === 'upgraded' ? 'success.main' : 
                                change.action === 'downgraded' ? 'warning.main' : 'error.main' 
                      }}>
                        {change.action === 'upgraded' ? <TrendingUpIcon /> :
                         change.action === 'downgraded' ? <TrendingDownIcon /> : <CancelIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${change.user} ${change.action}`}
                      secondary={`${change.from} → ${change.to} • ${change.date}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Users Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Top Revenue Users</Typography>
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Plan</TableCell>
                  <TableCell>Revenue</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {analytics.topUsers.map((user, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar sx={{ mr: 2 }}>
                          {user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">{user.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.plan} 
                        color={getPlanColor(user.plan)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        ${user.revenue.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={user.status} 
                        color={user.status === 'active' ? 'success' : 'warning'}
                        size="small"
                        icon={user.status === 'active' ? <CheckCircleIcon /> : <WarningIcon />}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Tooltip title="View Details">
                          <IconButton 
                            size="small" 
                            onClick={() => {
                              setSelectedUser(user);
                              setUserDetailsOpen(true);
                            }}
                          >
                            <ViewIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit User">
                          <IconButton size="small">
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={userDetailsOpen} onClose={() => setUserDetailsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedUser.name}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {selectedUser.email}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Plan</Typography>
                  <Chip 
                    label={selectedUser.plan} 
                    color={getPlanColor(selectedUser.plan)}
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Revenue</Typography>
                  <Typography variant="subtitle1">
                    ${selectedUser.revenue.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">Status</Typography>
                  <Chip 
                    label={selectedUser.status} 
                    color={selectedUser.status === 'active' ? 'success' : 'warning'}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDetailsOpen(false)}>Close</Button>
          <Button variant="contained">Edit User</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SubscriptionAnalytics;