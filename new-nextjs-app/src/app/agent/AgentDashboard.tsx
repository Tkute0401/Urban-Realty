import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Tooltip,
  LinearProgress,
  Fade,
  Zoom,
  Slide,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Notifications as NotificationsIcon,
  Assessment as AssessmentIcon,
  Speed as SpeedIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  MoreVert as MoreVertIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAgentAnalytics, useAgentDashboard } from '@/hooks/api/agent';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils/format';
import { motion } from 'framer-motion';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

const AgentDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterDialog, setFilterDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30',
    propertyType: 'all'
  });
  const [quickActions, setQuickActions] = useState([
    { id: 1, title: 'Add Property', icon: <AddIcon />, action: () => router.push('/add-property'), color: 'primary' },
    { id: 2, title: 'View Leads', icon: <PeopleIcon />, action: () => router.push('/agent/leads'), color: 'success' },
    { id: 3, title: 'Analytics', icon: <AnalyticsIcon />, action: () => router.push('/agent/analytics'), color: 'info' },
    { id: 4, title: 'Settings', icon: <EditIcon />, action: () => router.push('/agent/settings'), color: 'warning' }
  ]);

  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    activeLeads: 0,
    totalViews: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
    avgResponseTime: 0,
    topPerformingProperty: null,
    recentActivity: []
  });

  // Enhanced queries with TanStack Query v5 object syntax and better error handling
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard } = useAgentDashboard(filters, {
    refetchInterval: 5 * 60 * 1000,
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: analytics, isLoading: analyticsLoading } = useAgentAnalytics(undefined, {
    retry: (failureCount) => (failureCount < 2),
  });

  // Refresh mutation with better error handling
  const refreshMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        refetchDashboard(),
        queryClient.invalidateQueries({ queryKey: ['agentAnalytics'] })
      ]);
    },
    onSuccess: () => {
      setNotification({
        open: true,
        message: 'Dashboard data refreshed successfully!',
        severity: 'success'
      });
    },
    onError: (error) => {
      setNotification({
        open: true,
        message: error.message || 'Failed to refresh data',
        severity: 'error'
      });
    }
  });

  // Calculate enhanced dashboard stats
  useEffect(() => {
    if (dashboardData && dashboardData.stats) {
      const { stats: dashboardStats, properties, leads } = dashboardData;
      
      setStats({
        totalProperties: dashboardStats?.totalProperties || 0,
        activeProperties: dashboardStats?.activeProperties || 0,
        activeLeads: dashboardStats?.activeLeads || 0,
        totalViews: dashboardStats?.totalViews || 0,
        monthlyRevenue: dashboardStats?.monthlyRevenue || 0,
        conversionRate: dashboardStats?.conversionRate || 0,
        avgResponseTime: dashboardStats?.avgResponseTime || 0,
        topPerformingProperty: properties?.[0] || null,
        recentActivity: leads?.slice(0, 10) || []
      });
    }
  }, [dashboardData]);

  // Chart data preparation
  const viewsData = dashboardData?.properties?.map(prop => ({
    name: prop.title.substring(0, 15) + '...',
    views: prop.views || 0,
    price: prop.price || 0
  })) || [];

  const leadStatusData = dashboardData?.leads?.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {}) || {};

  // Get monthly data from analytics API or use empty array
  const monthlyData = analytics?.monthlyData || [];

  const COLORS = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)', 'var(--color-info)'];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'contacted': return 'info';
      case 'followup': return 'primary';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const getPropertyStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'sold': return 'info';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle, trend }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          background: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-light)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px var(--color-primary-20)',
            transition: 'all 0.3s ease'
          }
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box flex={1}>
              <Typography color="text.secondary" gutterBottom variant="body2" fontWeight={500}>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" sx={{ color: 'var(--color-primary)' }}>
                {value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                  <Typography variant="caption" color="success.main">
                    {trend}
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar sx={{ bgcolor: 'var(--color-primary)', width: 56, height: 56 }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  // Enhanced loading state with skeleton
  if (dashboardLoading) {
    return <LoadingSkeleton.Dashboard />;
  }

  // Enhanced error handling with retry options
  if (dashboardError) {
    const errorMessage = dashboardError?.message || 'Failed to load dashboard data';
    
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
          <Alert 
            severity="error" 
            sx={{ mb: 3, maxWidth: 500 }}
            icon={<ErrorIcon />}
          >
            <Typography variant="h6" gutterBottom>
              Dashboard Error
            </Typography>
            <Typography variant="body2" gutterBottom>
              {errorMessage}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Please check your internet connection and try again
            </Typography>
          </Alert>
          
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button 
              variant="contained" 
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isLoading}
              startIcon={refreshMutation.isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
            >
              {refreshMutation.isLoading ? 'Retrying...' : 'Retry'}
            </Button>
            <Button 
              variant="outlined"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={4} gap={2}>
          <Box>
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ 
              color: 'var(--color-text-primary)'
            }}>
              Welcome back, {user?.name}! 👋
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Here&apos;s your real estate performance overview
            </Typography>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/add-property')}
              sx={{ 
                backgroundColor: 'var(--color-primary)',
                '&:hover': { 
                  transform: 'translateY(-2px)',
                  backgroundColor: 'var(--color-primary-hover)'
                }
              }}
            >
              Add Property
            </Button>
            <IconButton 
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isLoading}
              sx={{ 
                bgcolor: 'background.paper',
                '&:hover': { transform: 'rotate(180deg)', transition: 'transform 0.3s ease' }
              }}
            >
              {refreshMutation.isLoading ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
            <IconButton sx={{ bgcolor: 'background.paper' }}>
              <NotificationsIcon />
            </IconButton>
          </Box>
        </Box>
      </motion.div>

      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={<HomeIcon />}
            subtitle={`${stats.activeProperties} active`}
            trend={dashboardData?.trends?.properties || null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Leads"
            value={stats.activeLeads}
            icon={<PeopleIcon />}
            subtitle="Require attention"
            trend={dashboardData?.trends?.leads || null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Views"
            value={stats.totalViews.toLocaleString()}
            icon={<VisibilityIcon />}
            subtitle="Property impressions"
            trend={dashboardData?.trends?.views || null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Revenue"
            value={`₹${stats.monthlyRevenue.toLocaleString()}`}
            icon={<MoneyIcon />}
            subtitle="Commission earned"
            trend={dashboardData?.trends?.revenue || null}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Card sx={{ mb: 4, background: 'var(--color-bg-secondary)' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 3 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={6} sm={3} key={action.id}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={action.icon}
                      onClick={action.action}
                      sx={{
                        height: 80,
                        flexDirection: 'column',
                        gap: 1,
                        borderColor: 'var(--color-primary)',
                        color: 'var(--color-primary)',
                        '&:hover': {
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-text-inverse)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 12px var(--color-primary-40)'
                        }
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {action.title}
                      </Typography>
                    </Button>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Performance Metrics
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Conversion Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.conversionRate.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(stats.conversionRate, 100)} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Avg Response Time</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.avgResponseTime.toFixed(1)}h
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((24 - stats.avgResponseTime) / 24 * 100, 100)} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top Performing Property
              </Typography>
              {stats.topPerformingProperty ? (
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={stats.topPerformingProperty.images?.[0]}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  >
                    <HomeIcon />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {stats.topPerformingProperty.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stats.topPerformingProperty.location}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <VisibilityIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                      <Typography variant="body2">
                        {stats.topPerformingProperty.views || 0} views
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={`₹${(stats.topPerformingProperty.price || 0).toLocaleString()}`}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              ) : (
                <Typography color="text.secondary">No properties yet</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Monthly Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Area type="monotone" dataKey="views" stackId="1" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="leads" stackId="1" stroke="var(--color-success)" fill="var(--color-success)" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Lead Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(leadStatusData).map(([status, count]) => ({ name: status, value: count }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="var(--color-primary)"
                    dataKey="value"
                  >
                    {Object.entries(leadStatusData).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="Recent Properties" />
            <Tab label="Recent Leads" />
            <Tab label="Analytics" />
          </Tabs>
        </Box>
        <CardContent>
          {selectedTab === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Recent Properties</Typography>
                <Box display="flex" gap={1}>
                  <IconButton size="small">
                    <FilterIcon />
                  </IconButton>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => router.push('/agent/properties')}
                  >
                    View All
                  </Button>
                </Box>
              </Box>
              
              {dashboardData?.properties?.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Views</TableCell>
                        <TableCell>Performance</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dashboardData?.properties?.slice(0, 5).map((property) => (
                        <TableRow key={property._id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar
                                src={property.images?.[0]}
                                variant="rounded"
                                sx={{ width: 50, height: 50 }}
                              >
                                <HomeIcon />
                              </Avatar>
                              <Box>
                                <Typography fontWeight="500">
                                  {property.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                  {property.location}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="500">
                              ₹{property.price?.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={property.status || 'active'}
                              color={getPropertyStatusColor(property.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>{property.views || 0}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                              <Typography variant="body2">
                                {((property.views || 0) / Math.max(...(dashboardData?.properties?.map(p => p.views || 0) || [0])) * 100).toFixed(0)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => router.push(`/properties/${property._id}/edit`)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary" gutterBottom>
                    No properties found
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/add-property')}
                  >
                    Add Your First Property
                  </Button>
                </Box>
              )}
            </Box>
          )}

          {selectedTab === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Recent Leads</Typography>
                <Button
                  variant="outlined"
                  size="small"
                    onClick={() => router.push('/agent/inquiries')}
                >
                  View All
                </Button>
              </Box>

              {dashboardData?.leads?.length > 0 ? (
                <List>
                  {dashboardData?.leads?.slice(0, 5).map((lead) => (
                    <React.Fragment key={lead.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            {lead.user?.name?.charAt(0) || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle2" fontWeight="bold">
                                {lead.user?.name || 'Unknown'}
                              </Typography>
                              <Chip
                                label={lead.status}
                                color={getStatusColor(lead.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {lead.property?.title || 'Property'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(lead.createdAt)}
                              </Typography>
                            </Box>
                          }
                          components={{
                            secondary: 'div'
                          }}
                        />
                        <IconButton size="small">
                          <MoreVertIcon />
                        </IconButton>
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No leads yet
                  </Typography>
                </Box>
              )}
            </Box>
          )}

          {selectedTab === 2 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Advanced Analytics
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Property Views Trend
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={viewsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Bar dataKey="views" fill="var(--color-primary)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Revenue vs Views
                      </Typography>
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={viewsData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Line type="monotone" dataKey="views" stroke="var(--color-primary)" />
                          <Line type="monotone" dataKey="price" stroke="var(--color-success)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setNotification({ ...notification, open: false })} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AgentDashboard;