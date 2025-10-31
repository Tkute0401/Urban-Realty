'use client';

import React, { useState } from 'react';
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
  Stack
} from '@mui/material';
import {
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CurrencyRupee as MoneyIcon,
  Home as HomeIcon,
  Assessment as AnalyticsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Visibility as ViewsIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Language as WebsiteIcon,
  Construction as ConstructionIcon,
  Apartment as ApartmentIcon,
  Store as StoreIcon,
  Villa as VillaIcon,
  Hotel as HotelIcon,
  School as SchoolIcon,
  LocalHospital as HospitalIcon,
  ShoppingCart as ShoppingIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDeveloperAnalytics } from '@/hooks/api/developer';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';

const DeveloperAnalyticsClient: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState(0);

  // Fetch developer's analytics with real-time data
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError, isFetching } = useDeveloperAnalytics({
    timeframe: timeRange + 'd'
  }, {
    refetchInterval: 30 * 1000, // Refetch every 30 seconds for real-time updates
    retry: (failureCount) => (failureCount < 3),
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Use real analytics data from API
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
    }
  };

  // Ensure overview exists with defensive programming
  const overview = analytics?.overview || {
    totalProjects: 0,
    activeProjects: 0,
    totalUnits: 0,
    totalViews: 0,
    totalInquiries: 0,
    conversionRate: 0,
    avgResponseTime: 0
  };

  // Ensure performance exists with defensive programming
  const performance = analytics?.performance || {
    topPerformingProjects: [],
    inquirySources: {},
    inquiryStatusBreakdown: {}
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'contacted': return 'info';
      case 'followup': return 'primary';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const getProjectTypeIcon = (type) => {
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

  if (analyticsLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading analytics data...
        </Typography>
      </Box>
    );
  }

  if (analyticsError) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error" sx={{ mb: 3, maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Analytics Error
          </Typography>
          <Typography variant="body2" gutterBottom>
            {analyticsError?.message || 'Failed to load analytics data'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Please check your internet connection and try again
          </Typography>
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => window.location.reload()}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h4" gutterBottom>
              Developer Analytics & Insights
            </Typography>
            {isFetching && (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} />
                <Typography variant="caption" color="text.secondary">
                  Updating...
                </Typography>
              </Box>
            )}
          </Box>
          <Typography variant="body1" color="text.secondary">
            Track your project performance and development insights
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Overview Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="var(--color-primary)">
                    {overview.totalProjects}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Projects
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'var(--color-primary)' }}>
                  <HomeIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="var(--color-success)">
                    {overview.activeProjects}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Projects
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'var(--color-success)' }}>
                  <ConstructionIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="var(--color-info)">
                    {overview.totalUnits}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Units
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'var(--color-info)' }}>
                  <ApartmentIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="var(--color-warning)">
                    {overview.totalViews}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Views
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'var(--color-warning)' }}>
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
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="var(--color-secondary)">
                    {overview.totalInquiries}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Inquiries
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'var(--color-secondary)' }}>
                  <PeopleIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="var(--color-success)">
                    {overview.conversionRate}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversion Rate
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'var(--color-success)' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="var(--color-info)">
                    {overview.avgResponseTime}h
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Response Time
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'var(--color-info)' }}>
                  <CalendarIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="var(--color-primary)">
                    {(analytics as any)?.trends?.growthRate || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Growth Rate
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'var(--color-primary)' }}>
                  <TrendingUpIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} mb={4}>
        {/* Project Performance Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Project Performance Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={(analytics as any)?.monthlyData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <RechartsTooltip />
                  <Area type="monotone" dataKey="views" stroke="var(--color-primary)" fill="var(--color-primary-20)" />
                  <Area type="monotone" dataKey="inquiries" stroke="var(--color-success)" fill="var(--color-success-20)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Inquiry Status Distribution */}
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inquiry Status Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={Object.entries(performance.inquiryStatusBreakdown || {}).map(([status, count]: [string, any]) => ({ name: status, value: count }))}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="var(--color-primary)"
                    dataKey="value"
                  >
                    {Object.entries(performance.inquiryStatusBreakdown || {}).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-error)', 'var(--color-info)'][index % 5]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Performing Projects */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Projects
              </Typography>
              <List>
                {(performance.topPerformingProjects || []).map((project, index) => (
                  <ListItem key={project.id || index} divider>
                    <ListItemAvatar>
                      <Avatar
                        src={typeof project.images?.[0] === 'string' 
                          ? project.images[0] 
                          : project.images?.[0]?.url || ''}
                        variant="rounded"
                        sx={{ width: 50, height: 50 }}
                      >
                        {getProjectTypeIcon(project.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={project.name}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                            {typeof project.location === 'string' 
                              ? project.location 
                              : `${project.location?.city || ''}, ${project.location?.state || ''}`.replace(/^,\s*|,\s*$/g, '')}
                          </Typography>
                          <Box display="flex" gap={1} mt={1}>
                            <Chip 
                              label={`${project.views || 0} views`} 
                              size="small" 
                              color="primary"
                            />
                            <Chip 
                              label={`${project.inquiries || 0} inquiries`} 
                              size="small" 
                              color="success"
                            />
                            <Chip 
                              label={`${project.units || 0} units`} 
                              size="small" 
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton onClick={() => router.push(`/projects/${project.id}`)}>
                        <EditIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Inquiry Sources */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inquiry Sources
              </Typography>
              <List>
                {Object.entries(performance.inquirySources || {}).map(([source, count]: [string, any]) => (
                  <ListItem key={source}>
                    <ListItemText
                      primary={source}
                      secondary={`${count} inquiries`}
                    />
                    <LinearProgress 
                      variant="determinate" 
                      value={((count as number) / Math.max(...(Object.values(performance.inquirySources || {}) as number[]))) * 100} 
                      sx={{ width: 100, mr: 2 }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={6}>
          <Card sx={{ background: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {((analytics as any)?.recentActivity || []).slice(0, 5).map((activity, index) => (
                  <ListItem key={index} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'var(--color-primary)' }}>
                        <PeopleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.message || 'New inquiry received'}
                      secondary={
                        <Typography variant="caption" color="text.secondary">
                          {new Date(activity.createdAt).toLocaleDateString()}
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
    </Box>
  );
};

export default DeveloperAnalyticsClient;
