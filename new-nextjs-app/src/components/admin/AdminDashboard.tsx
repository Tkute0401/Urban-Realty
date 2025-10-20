'use client'
import React, { useState, useEffect } from 'react';
import {
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CircularProgress, 
  Box, 
  Button,
  IconButton,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
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
  Snackbar
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon, 
  People as PeopleIcon, 
  AttachMoney as MoneyIcon, 
  Business as BusinessIcon,
  Home as HomeIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Notifications as NotificationsIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Speed as SpeedIcon,
  Assessment as AssessmentIcon,
  Analytics as AnalyticsIcon,
  Timeline as TimelineIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon
} from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import { useAdminAnalytics, useAdminDashboard } from '@/hooks/api/admin';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils/format';
import { useRouter } from 'next/navigation';
import SubscriptionAnalytics from '@/components/admin/SubscriptionAnalytics';
import QuickActions from '@/components/admin/QuickActions';
import SystemHealthSection from '@/components/admin/SystemHealth';
import PlatformMetrics from '@/components/admin/PlatformMetrics';
import RecentUsersTable from '@/components/admin/tables/RecentUsersTable';
import RecentPropertiesTable from '@/components/admin/tables/RecentPropertiesTable';
import RecentContactsTable from '@/components/admin/tables/RecentContactsTable';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';

const AdminDashboard: React.FC = () => {
  console.log('🔧 AdminDashboard rendering...');
  
  React.useEffect(() => {
    console.log('🔧 AdminDashboard mounted on client side!');
  }, []);

  const queryClient = useQueryClient();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterDialog, setFilterDialog] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  const [filters, setFilters] = useState({
    dateRange: '30',
    userType: 'all',
    status: 'all'
  });
  const [quickActions, setQuickActions] = useState([
    { id: 1, title: 'Manage Users', icon: <PeopleIcon />, action: () => router.push('/admin/users'), color: 'primary' as const },
    { id: 2, title: 'View Properties', icon: <HomeIcon />, action: () => router.push('/admin/properties'), color: 'success' as const },
    { id: 3, title: 'Analytics', icon: <AnalyticsIcon />, action: () => router.push('/admin/analytics'), color: 'info' as const },
    { id: 4, title: 'Settings', icon: <SettingsIcon />, action: () => router.push('/admin/settings'), color: 'warning' as const },
    { id: 5, title: 'Reports', icon: <AssessmentIcon />, action: () => router.push('/admin/reports'), color: 'secondary' as const },
    { id: 6, title: 'Media', icon: <StorageIcon />, action: () => router.push('/admin/media'), color: 'error' as const }
  ]);

  const [stats, setStats] = useState({
    counts: {
      users: 0,
      agents: 0,
      properties: 0,
      contacts: 0,
      subscriptions: 0,
      revenue: 0
    },
    recent: {
      users: [] as any[],
      properties: [] as any[],
      contacts: [] as any[]
    },
    analytics: {
      growthRate: 0,
      conversionRate: 0,
      avgResponseTime: 0,
      topPerformingAgents: [] as { name: string; properties: number; revenue: number }[],
      systemHealth: {
        cpu: 0,
        memory: 0,
        storage: 0,
        network: 0
      }
    }
  });

  const { data: dashboardData, isLoading, error, refetch: refetchDashboard } = useAdminDashboard();
  const { data: analyticsData, isLoading: analyticsLoading, error: analyticsError } = useAdminAnalytics();

  const refreshMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        refetchDashboard(),
        queryClient.invalidateQueries({ queryKey: ['adminAnalytics'] })
      ]);
    },
    onSuccess: () => {
      setNotification({
        open: true,
        message: 'Dashboard data refreshed successfully!',
        severity: 'success'
      });
    },
    onError: (err: any) => {
      setNotification({
        open: true,
        message: err?.message || 'Failed to refresh data',
        severity: 'error'
      });
    }
  });

  useEffect(() => {
    if (dashboardData) {
      setStats({
        counts: dashboardData.counts || {
          users: 0,
          agents: 0,
          properties: 0,
          contacts: 0,
          subscriptions: 0,
          revenue: 0
        },
        recent: dashboardData.recent || {
          users: [],
          properties: [],
          contacts: []
        },
        analytics: dashboardData.analytics || {
          growthRate: 0,
          conversionRate: 0,
          avgResponseTime: 0,
          topPerformingAgents: [],
          systemHealth: {
            cpu: 0,
            memory: 0,
            storage: 0,
            network: 0
          }
        }
      });
    }
  }, [dashboardData]);

  // Get monthly data from analytics API or use empty array
  const monthlyData = analyticsData?.monthlyData || [];

  const userTypeData = [
    { name: 'Regular Users', value: stats.counts.users - stats.counts.agents, color: 'var(--chart-color-3)' },
    { name: 'Agents', value: stats.counts.agents, color: 'var(--chart-color-4)' },
    { name: 'Admins', value: 0, color: 'var(--color-warning)' }
  ];

  const propertyStatusData = [
    { name: 'Active', value: Math.floor(stats.counts.properties * 0.7), color: 'var(--chart-color-4)' },
    { name: 'Pending', value: Math.floor(stats.counts.properties * 0.2), color: 'var(--color-warning)' },
    { name: 'Sold', value: Math.floor(stats.counts.properties * 0.1), color: 'var(--color-danger)' }
  ];

  const COLORS = ['var(--chart-color-3)', 'var(--chart-color-4)', 'var(--color-warning)', 'var(--color-danger)', 'var(--chart-color-1)'];

  const StatCard: React.FC<{ title: string; value: React.ReactNode; icon: React.ReactNode; color: string; subtitle?: string; trend?: string; trendValue?: string }> = ({ title, value, icon, color, subtitle, trend, trendValue }) => (
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
            boxShadow: 'var(--shadow-lg)',
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
              <Typography variant="h3" fontWeight="bold" sx={{ color: 'var(--color-primary)' }}>
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
                    {trendValue || ''} {trend}
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

  const SystemHealthCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string; subtitle: string }> = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: 'var(--color-primary)', width: 40, height: 40 }}>
            {icon}
          </Avatar>
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: 'var(--color-primary)' }}>
            {value}%
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={value} 
          sx={{ 
            height: 8, 
            borderRadius: 4,
            bgcolor: 'var(--color-bg-tertiary)',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'var(--color-primary)'
            }
          }}
        />
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return <LoadingSkeleton.Dashboard />;
  }

  if (error) {
    const errorMessage = (error as any)?.message || 'Failed to load dashboard data';
    
    return (
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
          <Alert 
            severity="error" 
            sx={{ mb: 3, maxWidth: 500 }}
            icon={<ErrorIcon />}
          >
            <Typography variant="h6" gutterBottom>
              Admin Dashboard Error
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
              disabled={refreshMutation.isPending}
              startIcon={refreshMutation.isPending ? <CircularProgress size={20} /> : <RefreshIcon />}
            >
              {refreshMutation.isPending ? 'Retrying...' : 'Retry'}
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={4} gap={2}>
          <Box>
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ 
              color: 'var(--color-primary)'
            }}>
              Admin Dashboard 🚀
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Complete overview of your real estate platform
            </Typography>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{ 
                backgroundColor: 'var(--color-primary)',
                '&:hover': { 
                  backgroundColor: 'var(--color-primary-hover)',
                  transform: 'translateY(-2px)' 
                }
              }}
            >
              Export Report
            </Button>
            <IconButton 
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isPending}
              sx={{ 
                bgcolor: 'background.paper',
                '&:hover': { transform: 'rotate(180deg)', transition: 'transform 0.3s ease' }
              }}
            >
              {refreshMutation.isPending ? <CircularProgress size={20} /> : <RefreshIcon />}
            </IconButton>
            <IconButton sx={{ bgcolor: 'background.paper' }}>
              <NotificationsIcon />
            </IconButton>
            <IconButton sx={{ bgcolor: 'background.paper' }}>
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>
      </motion.div>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Total Users"
            value={stats.counts.users.toLocaleString()}
            icon={<PeopleIcon />}
            color="var(--color-primary)"
            subtitle="Registered users"
            trend="this month"
            trendValue={dashboardData?.trends?.users || null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Agents"
            value={stats.counts.agents}
            icon={<BusinessIcon />}
            color="var(--color-primary)"
            subtitle="Active agents"
            trend="this month"
            trendValue={dashboardData?.trends?.agents || null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Properties"
            value={stats.counts.properties.toLocaleString()}
            icon={<HomeIcon />}
            color="var(--color-primary)"
            subtitle="Listed properties"
            trend="this month"
            trendValue={dashboardData?.trends?.properties || null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Contacts"
            value={stats.counts.contacts.toLocaleString()}
            icon={<EmailIcon />}
            color="var(--color-primary)"
            subtitle="Total inquiries"
            trend="this month"
            trendValue={dashboardData?.trends?.contacts || null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Subscriptions"
            value={stats.counts.subscriptions}
            icon={<TrendingUpIcon />}
            color="var(--color-primary)"
            subtitle="Active plans"
            trend="this month"
            trendValue={dashboardData?.trends?.subscriptions || null}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Revenue"
            value={`$${stats.counts.revenue.toLocaleString()}`}
            icon={<MoneyIcon />}
            color="var(--color-primary)"
            subtitle="Monthly revenue"
            trend="this month"
            trendValue={dashboardData?.trends?.revenue || null}
          />
        </Grid>
      </Grid>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
        <QuickActions actions={quickActions} />
      </motion.div>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <SystemHealthSection health={stats.analytics.systemHealth} />
        </Grid>
        <Grid item xs={12} md={6}>
          <PlatformMetrics growthRate={stats.analytics.growthRate} conversionRate={stats.analytics.conversionRate} avgResponseTime={stats.analytics.avgResponseTime} />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Platform Growth Overview
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <ComposedChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <RechartsTooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="users" stackId="1" stroke="var(--chart-color-1)" fill="var(--chart-color-1)" fillOpacity={0.6} />
                  <Area yAxisId="left" type="monotone" dataKey="properties" stackId="1" stroke="var(--chart-color-2)" fill="var(--chart-color-2)" fillOpacity={0.6} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="var(--color-primary)" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                User Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={userTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}`}
                    outerRadius={100}
                    fill="var(--chart-color-1)"
                    dataKey="value"
                  >
                    {userTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top Performing Agents
              </Typography>
              <List>
                {stats.analytics.topPerformingAgents.map((agent, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: index === 0 ? 'var(--color-warning)' : index === 1 ? 'var(--color-text-muted)' : 'var(--color-primary-dark)' }}>
                          {agent.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" fontWeight="bold">
                              {agent.name}
                            </Typography>
                            <Chip 
                              label={`#${index + 1}`} 
                              size="small" 
                              color={index === 0 ? 'warning' : index === 1 ? 'default' : 'primary'}
                            />
                          </Box>
                        }
                        secondary={
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body2" color="text.secondary">
                              {agent.properties} properties
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="primary">
                              ${agent.revenue.toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < stats.analytics.topPerformingAgents.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Property Status Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={propertyStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}`}
                    outerRadius={80}
                    fill="var(--chart-color-1)"
                    dataKey="value"
                  >
                    {propertyStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mb: 4 }}>
        <SubscriptionAnalytics />
      </Box>

      <Card sx={{ mb: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
            <Tab label="Recent Users" />
            <Tab label="Recent Properties" />
            <Tab label="Recent Contacts" />
            <Tab label="System Logs" />
          </Tabs>
        </Box>
        <CardContent>
          {selectedTab === 0 && (
            <RecentUsersTable users={stats.recent.users as any} />
          )}

          {selectedTab === 1 && (
            <RecentPropertiesTable />
          )}

          {selectedTab === 2 && (
            <RecentContactsTable contacts={stats.recent.contacts as any} />
          )}

          {selectedTab === 3 && (
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                System Logs
              </Typography>
              <List>
                {[
                  { type: 'info', message: 'System backup completed successfully', time: '2 minutes ago' },
                  { type: 'warning', message: 'High memory usage detected', time: '5 minutes ago' },
                  { type: 'success', message: 'New user registration', time: '10 minutes ago' },
                  { type: 'error', message: 'Database connection timeout', time: '15 minutes ago' },
                  { type: 'info', message: 'Cache cleared successfully', time: '20 minutes ago' }
                ].map((log, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ 
                        bgcolor: log.type === 'error' ? 'error.main' : 
                                log.type === 'warning' ? 'warning.main' : 
                                log.type === 'success' ? 'success.main' : 'info.main',
                        width: 32, height: 32
                      }}>
                        {log.type === 'error' ? <ErrorIcon /> :
                         log.type === 'warning' ? <WarningIcon /> :
                         log.type === 'success' ? <CheckCircleIcon /> : <InfoIcon />}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={log.message}
                      secondary={log.time}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>

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

export default AdminDashboard;

