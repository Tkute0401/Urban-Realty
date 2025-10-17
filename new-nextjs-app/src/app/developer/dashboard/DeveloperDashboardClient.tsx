'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
  Snackbar,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Stack,
  Container
} from '@mui/material';
import {
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  Assessment as AnalyticsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Visibility as ViewsIcon,
  Construction as ConstructionIcon,
  Apartment as ApartmentIcon,
  Store as StoreIcon,
  Villa as VillaIcon,
  Hotel as HotelIcon,
  School as SchoolIcon,
  LocalHospital as HospitalIcon,
  ShoppingCart as ShoppingIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useDeveloperDashboard, useDeveloperAnalytics } from '@/hooks/api/developer';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils/format';

const DeveloperDashboardClient = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [timeRange, setTimeRange] = useState('30');
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });

  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError, refetch: refetchDashboard, isFetching: dashboardFetching } = useDeveloperDashboard({
    dateRange: timeRange
  }, {
    refetchInterval: 30 * 1000,
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useDeveloperAnalytics({
    timeframe: timeRange + 'd'
  }, {
    retry: (failureCount) => (failureCount < 2),
  });

  const dashboard = (dashboardData as any)?.data || dashboardData || {
    stats: {
      totalProjects: 0,
      activeProjects: 0,
      totalUnits: 0,
      totalViews: 0,
      totalInquiries: 0,
      conversionRate: 0,
      avgResponseTime: 0
    },
    projects: [],
    inquiries: [],
    topPerformingProject: null,
    monthlyData: [],
    trends: {}
  };

  const analytics = (analyticsData as any)?.data || analyticsData || {
    overview: {
      totalProjects: 0,
      activeProjects: 0,
      totalUnits: 0,
      totalViews: 0,
      totalInquiries: 0,
      conversionRate: 0,
      avgResponseTime: 0
    },
    performance: {
      topPerformingProjects: [],
      inquirySources: {},
      inquiryStatusBreakdown: {}
    },
    monthlyData: [],
    trends: {},
    recentActivity: []
  };

  // Quick actions
  const quickActions = [
    { id: 1, title: 'Add Project', icon: <AddIcon />, action: () => router.push('/projects/add'), color: 'primary' },
    { id: 2, title: 'View Projects', icon: <HomeIcon />, action: () => router.push('/projects'), color: 'success' },
    { id: 3, title: 'Analytics', icon: <AnalyticsIcon />, action: () => router.push('/developer/analytics'), color: 'info' },
    { id: 4, title: 'Profile', icon: <EditIcon />, action: () => router.push('/developer/profile'), color: 'warning' }
  ];

  // Project type icons
  const getProjectTypeIcon = (type: string) => {
    switch (type) {
      case 'residential': return <ApartmentIcon />;
      case 'commercial': return <StoreIcon />;
      case 'luxury': return <VillaIcon />;
      case 'hotel': return <HotelIcon />;
      case 'school': return <SchoolIcon />;
      case 'hospital': return <HospitalIcon />;
      case 'shopping': return <ShoppingIcon />;
      default: return <HomeIcon />;
    }
  };

  // Handle notification close
  const handleNotificationClose = () => {
    setNotification({ ...notification, open: false });
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || dashboardLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (dashboardError) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load dashboard data. Please try again.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'var(--color-bg-primary)' }}>
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h3" fontWeight="bold" sx={{ color: 'var(--color-text-primary)' }}>
              Developer Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Welcome back, {user?.name}! Manage your projects and track performance.
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            {dashboardFetching && (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Updating...
                </Typography>
              </Box>
            )}
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetchDashboard()}
              disabled={dashboardFetching}
            >
              Refresh
            </Button>
          </Box>
        </Box>

        {/* Quick Actions */}
        <Grid container spacing={3} mb={4}>
          {quickActions.map((action) => (
            <Grid item xs={12} sm={6} md={3} key={action.id}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)'
                    }
                  }}
                  onClick={action.action}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Avatar
                      sx={{
                        bgcolor: `${action.color}.main`,
                        width: 56,
                        height: 56,
                        mx: 'auto',
                        mb: 2
                      }}
                    >
                      {action.icon}
                    </Avatar>
                    <Typography variant="h6" fontWeight="bold">
                      {action.title}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        {/* Stats Overview */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {dashboard.stats.totalProjects}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Projects
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <HomeIcon />
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
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {dashboard.stats.activeProjects}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Active Projects
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <ConstructionIcon />
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
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {dashboard.stats.totalUnits}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Units
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <ApartmentIcon />
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
                    <Typography variant="h4" fontWeight="bold" color="warning.main">
                      {dashboard.stats.totalViews}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Views
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <ViewsIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Stats */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="secondary.main">
                      {dashboard.stats.totalInquiries}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Inquiries
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'secondary.main' }}>
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
                    <Typography variant="h4" fontWeight="bold" color="success.main">
                      {dashboard.stats.conversionRate}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Conversion Rate
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <TrendingUpIcon />
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
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {dashboard.stats.avgResponseTime}h
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Response Time
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <CalendarIcon />
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
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {dashboard.trends.growthRate || 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Growth Rate
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <TrendingUpIcon />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Projects */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight="bold">
                    Recent Projects
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/projects/add')}
                  >
                    Add Project
                  </Button>
                </Box>
                <List>
                  {dashboard.projects.slice(0, 5).map((project: any, index: number) => (
                    <ListItem key={project._id || index} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {getProjectTypeIcon(project.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={project.title}
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {typeof project.location === 'object' && project.location !== null 
                                ? `${project.location?.address || ''} ${project.location?.city || ''}`.trim() || 'Location not specified'
                                : project.location || 'Location not specified'}
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                              <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                              <Typography variant="caption" color="text.secondary">
                                {project.status || 'Active'}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip
                            label={project.status || 'Active'}
                            color={project.status === 'completed' ? 'success' : 'primary'}
                            size="small"
                          />
                          <IconButton size="small" onClick={() => router.push(`/projects/${project._id}`)}>
                            <EditIcon />
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                  Recent Inquiries
                </Typography>
                <List>
                  {dashboard.inquiries.slice(0, 5).map((inquiry: any, index: number) => (
                    <ListItem key={inquiry._id || index} divider>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'secondary.main' }}>
                          <PeopleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={inquiry.name || 'Anonymous'}
                        secondary={
                          <Typography variant="body2" color="text.secondary">
                            {inquiry.message?.substring(0, 50)}...
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Chart */}
        {dashboard.monthlyData && dashboard.monthlyData.length > 0 && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
                Project Performance
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dashboard.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="inquiries" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={handleNotificationClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleNotificationClose} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default DeveloperDashboardClient;
