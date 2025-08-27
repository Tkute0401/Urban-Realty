import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Business as BusinessIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  MonetizationOn as MonetizationOnIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import axios from '../../services/axios';
import RecentUsers from '../../components/admin/RecentUsers';
import RecentProperties from '../../components/admin/RecentProperties';
import RecentContacts from '../../components/admin/RecentContacts';
import SubscriptionAnalytics from '../../components/admin/SubscriptionAnalytics';
import RevenueChart from '../../components/admin/RevenueChart';
import UserGrowthChart from '../../components/admin/UserGrowthChart';
import PropertyAnalytics from '../../components/admin/PropertyAnalytics';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      agents: 0,
      properties: 0,
      contacts: 0,
      subscriptions: 0,
      revenue: 0,
      pendingVerifications: 0,
      activeListings: 0
    },
    recent: {
      users: [],
      properties: [],
      contacts: []
    },
    analytics: {
      userGrowth: [],
      revenueData: [],
      propertyTrends: [],
      subscriptionDistribution: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/admin/dashboard-stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setStats(response.data.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>Loading Dashboard...</Typography>
        <LinearProgress sx={{ width: '100%', mt: 2 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button variant="contained" onClick={handleRefresh}>Retry</Button>
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, gradient, subtitle, trend, trendValue }) => (
    <Card sx={{ 
      background: gradient,
      color: 'white',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>{title}</Typography>
        </Box>
        <Typography variant="h3" sx={{ mb: 1 }}>{value}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
          {subtitle}
        </Typography>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {trend === 'up' ? (
              <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5 }} />
            ) : (
              <WarningIcon sx={{ fontSize: 16, mr: 0.5 }} />
            )}
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {lastUpdated ? `Last updated: ${lastUpdated.toLocaleTimeString()}` : 'Loading...'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Refresh Data">
            <IconButton onClick={handleRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AssessmentIcon />}
            onClick={() => window.open('/admin/analytics', '_blank')}
          >
            Full Analytics
          </Button>
        </Box>
      </Box>

      {/* Quick Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.counts.users}
            icon={<PeopleIcon />}
            gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            subtitle="Registered users"
            trend="up"
            trendValue="+12% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Agents"
            value={stats.counts.agents}
            icon={<BusinessIcon />}
            gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
            subtitle="Verified agents"
            trend="up"
            trendValue="+8% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Properties"
            value={stats.counts.properties}
            icon={<BusinessIcon />}
            gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
            subtitle="Listed properties"
            trend="up"
            trendValue="+15% this month"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={`$${stats.counts.revenue.toLocaleString()}`}
            icon={<MonetizationOnIcon />}
            gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
            subtitle="Total revenue"
            trend="up"
            trendValue="+23% this month"
          />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Subscriptions"
            value={stats.counts.subscriptions}
            icon={<TrendingUpIcon />}
            gradient="linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
            subtitle="Active plans"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Inquiries"
            value={stats.counts.contacts}
            icon={<NotificationsIcon />}
            gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
            subtitle="Total inquiries"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Verifications"
            value={stats.counts.pendingVerifications}
            icon={<ScheduleIcon />}
            gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
            subtitle="Awaiting approval"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Listings"
            value={stats.counts.activeListings}
            icon={<VisibilityIcon />}
            gradient="linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
            subtitle="Live properties"
          />
        </Grid>
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label="Analytics" />
          <Tab label="Recent Activity" />
          <Tab label="Performance" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Revenue Trends</Typography>
                <RevenueChart data={stats.analytics.revenueData} />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>User Growth</Typography>
                <UserGrowthChart data={stats.analytics.userGrowth} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Box>
          <SubscriptionAnalytics />
          <Box sx={{ mt: 4 }}>
            <PropertyAnalytics data={stats.analytics.propertyTrends} />
          </Box>
        </Box>
      )}

      {activeTab === 2 && (
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
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>System Performance</Typography>
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Server Response Time</Typography>
                    <Typography variant="body2">120ms</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={85} sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Database Performance</Typography>
                    <Typography variant="body2">95%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={95} sx={{ mb: 2 }} />
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Uptime</Typography>
                    <Typography variant="body2">99.9%</Typography>
                  </Box>
                  <LinearProgress variant="determinate" value={99.9} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PeopleIcon />}
                      onClick={() => window.location.href = '/admin/users'}
                    >
                      Manage Users
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<BusinessIcon />}
                      onClick={() => window.location.href = '/admin/properties'}
                    >
                      View Properties
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<TrendingUpIcon />}
                      onClick={() => window.location.href = '/admin/subscriptions'}
                    >
                      Subscriptions
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<NotificationsIcon />}
                      onClick={() => window.location.href = '/admin/contacts'}
                    >
                      Contact Requests
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AdminDashboard;