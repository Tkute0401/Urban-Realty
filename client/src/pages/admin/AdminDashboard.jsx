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
  ListItemSecondaryAction
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
  Timeline as TimelineIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import axios from '../../services/axios';
import { motion } from 'framer-motion';
import { formatDate } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterDialog, setFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '30',
    userType: 'all',
    status: 'all'
  });

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
      users: [],
      properties: [],
      contacts: []
    },
    analytics: {
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

  // Enhanced queries with react-query
  const { data: dashboardData, isLoading, error } = useQuery(
    ['adminDashboard', filters],
    async () => {
      const response = await axios.get('/admin/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        params: filters
      });
      return response.data;
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 5 * 60 * 1000, // 5 minutes
      retry: 2
    }
  );

  const { data: analyticsData, isLoading: analyticsLoading } = useQuery(
    ['adminAnalytics'],
    async () => {
      const response = await axios.get('/admin/analytics');
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  // Refresh mutation
  const refreshMutation = useMutation(
    () => Promise.all([
      queryClient.invalidateQueries(['adminDashboard']),
      queryClient.invalidateQueries(['adminAnalytics'])
    ]),
    {
      onSuccess: () => {
        // Show success notification
      }
    }
  );

  useEffect(() => {
    if (dashboardData?.success) {
      setStats({
        counts: dashboardData.data.counts || {
          users: 0,
          agents: 0,
          properties: 0,
          contacts: 0,
          subscriptions: 0,
          revenue: 0
        },
        recent: dashboardData.data.recent || {
          users: [],
          properties: [],
          contacts: []
        },
        analytics: {
          growthRate: 15.5,
          conversionRate: 8.2,
          avgResponseTime: 2.3,
          topPerformingAgents: [
            { name: 'John Doe', properties: 25, revenue: 150000 },
            { name: 'Jane Smith', properties: 22, revenue: 135000 },
            { name: 'Mike Johnson', properties: 18, revenue: 120000 }
          ],
          systemHealth: {
            cpu: 45,
            memory: 62,
            storage: 78,
            network: 92
          }
        }
      });
    }
  }, [dashboardData]);

  // Chart data
  const monthlyData = [
    { month: 'Jan', users: 1200, properties: 450, revenue: 45000, leads: 180 },
    { month: 'Feb', users: 1400, properties: 520, revenue: 52000, leads: 210 },
    { month: 'Mar', users: 1600, properties: 580, revenue: 58000, leads: 240 },
    { month: 'Apr', users: 1800, properties: 650, revenue: 65000, leads: 270 },
    { month: 'May', users: 2000, properties: 720, revenue: 72000, leads: 300 },
    { month: 'Jun', users: 2200, properties: 800, revenue: 80000, leads: 330 }
  ];

  const userTypeData = [
    { name: 'Regular Users', value: stats.counts.users - stats.counts.agents, color: '#0088FE' },
    { name: 'Agents', value: stats.counts.agents, color: '#00C49F' },
    { name: 'Admins', value: 5, color: '#FFBB28' }
  ];

  const propertyStatusData = [
    { name: 'Active', value: Math.floor(stats.counts.properties * 0.7), color: '#00C49F' },
    { name: 'Pending', value: Math.floor(stats.counts.properties * 0.2), color: '#FFBB28' },
    { name: 'Sold', value: Math.floor(stats.counts.properties * 0.1), color: '#FF8042' }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const StatCard = ({ title, value, icon, color, subtitle, trend, trendValue }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
          border: `1px solid ${color}20`,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 8px 25px ${color}20`,
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
              <Typography variant="h3" fontWeight="bold" color={color}>
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
                    {trendValue || '+12%'} {trend}
                  </Typography>
                </Box>
              )}
            </Box>
            <Avatar sx={{ bgcolor: color, width: 56, height: 56 }}>
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const SystemHealthCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
          <Avatar sx={{ bgcolor: color, width: 40, height: 40 }}>
            {icon}
          </Avatar>
        </Box>
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Typography variant="h4" fontWeight="bold" color={color}>
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
            bgcolor: `${color}20`,
            '& .MuiLinearProgress-bar': {
              bgcolor: color
            }
          }}
        />
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" mt={2} color="text.secondary">
          Loading admin dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load dashboard data. Please try again.
        </Alert>
        <Button 
          variant="contained" 
          onClick={() => refreshMutation.mutate()}
          disabled={refreshMutation.isLoading}
        >
          {refreshMutation.isLoading ? <CircularProgress size={20} /> : 'Retry'}
        </Button>
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
              background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
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
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
            >
              Export Report
            </Button>
            <IconButton 
              onClick={() => refreshMutation.mutate()}
              disabled={refreshMutation.isLoading}
              sx={{ 
                bgcolor: 'background.paper',
                '&:hover': { transform: 'rotate(180deg)', transition: 'transform 0.3s ease' }
              }}
            >
              <RefreshIcon />
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

      {/* Enhanced Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Total Users"
            value={stats.counts.users.toLocaleString()}
            icon={<PeopleIcon />}
            color="#667eea"
            subtitle="Registered users"
            trend="this month"
            trendValue="+15%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Agents"
            value={stats.counts.agents}
            icon={<BusinessIcon />}
            color="#f093fb"
            subtitle="Active agents"
            trend="this month"
            trendValue="+8%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Properties"
            value={stats.counts.properties.toLocaleString()}
            icon={<HomeIcon />}
            color="#4facfe"
            subtitle="Listed properties"
            trend="this month"
            trendValue="+22%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Contacts"
            value={stats.counts.contacts.toLocaleString()}
            icon={<EmailIcon />}
            color="#43e97b"
            subtitle="Total inquiries"
            trend="this month"
            trendValue="+18%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Subscriptions"
            value={stats.counts.subscriptions}
            icon={<TrendingUpIcon />}
            color="#fa709a"
            subtitle="Active plans"
            trend="this month"
            trendValue="+12%"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <StatCard
            title="Revenue"
            value={`$${stats.counts.revenue.toLocaleString()}`}
            icon={<MoneyIcon />}
            color="#a8edea"
            subtitle="Monthly revenue"
            trend="this month"
            trendValue="+25%"
          />
        </Grid>
      </Grid>

      {/* System Health & Performance */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                System Health
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <SystemHealthCard
                    title="CPU Usage"
                    value={stats.analytics.systemHealth.cpu}
                    icon={<SpeedIcon />}
                    color="#667eea"
                    subtitle="Current load"
                  />
                </Grid>
                <Grid item xs={6}>
                  <SystemHealthCard
                    title="Memory"
                    value={stats.analytics.systemHealth.memory}
                    icon={<StorageIcon />}
                    color="#f093fb"
                    subtitle="RAM usage"
                  />
                </Grid>
                <Grid item xs={6}>
                  <SystemHealthCard
                    title="Storage"
                    value={stats.analytics.systemHealth.storage}
                    icon={<StorageIcon />}
                    color="#4facfe"
                    subtitle="Disk usage"
                  />
                </Grid>
                <Grid item xs={6}>
                  <SystemHealthCard
                    title="Network"
                    value={stats.analytics.systemHealth.network}
                    icon={<NetworkIcon />}
                    color="#43e97b"
                    subtitle="Uptime"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Platform Metrics
              </Typography>
              <Box display="flex" flexDirection="column" gap={3}>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Growth Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.analytics.growthRate}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.analytics.growthRate} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Conversion Rate</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.analytics.conversionRate}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.analytics.conversionRate} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Avg Response Time</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {stats.analytics.avgResponseTime}h
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((24 - stats.analytics.avgResponseTime) / 24 * 100, 100)} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              </Box>
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
                  <Area yAxisId="left" type="monotone" dataKey="users" stackId="1" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Area yAxisId="left" type="monotone" dataKey="properties" stackId="1" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#ff7300" strokeWidth={3} />
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
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

      {/* Top Performing Agents */}
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
                        <Avatar sx={{ bgcolor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32' }}>
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
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
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

      {/* Subscription Analytics Section */}
      <Box sx={{ mb: 4 }}>
        <SubscriptionAnalytics />
      </Box>

      {/* Tabs for different views */}
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
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Recent Users</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/users')}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recent.users?.slice(0, 5).map((user) => (
                      <TableRow key={user._id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar>{user.name?.charAt(0)}</Avatar>
                            <Box>
                              <Typography fontWeight="500">{user.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {user.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role} 
                            color={user.role === 'admin' ? 'error' : user.role === 'agent' ? 'warning' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.status || 'active'} 
                            color={user.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(user.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {selectedTab === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Recent Properties</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/properties')}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell>Agent</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Views</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recent.properties?.slice(0, 5).map((property) => (
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
                              <Typography fontWeight="500">{property.title}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                {property.location}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{property.agent?.name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontWeight="500">
                            ₹{property.price?.toLocaleString()}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={property.status || 'active'}
                            color={property.status === 'active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography>{property.views || 0}</Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {selectedTab === 2 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Recent Contacts</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/contacts')}
                >
                  View All
                </Button>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>User</TableCell>
                      <TableCell>Property</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stats.recent.contacts?.slice(0, 5).map((contact) => (
                      <TableRow key={contact._id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar>{contact.user?.name?.charAt(0)}</Avatar>
                            <Box>
                              <Typography fontWeight="500">{contact.user?.name}</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {contact.user?.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{contact.property?.title}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={contact.status}
                            color={contact.status === 'pending' ? 'warning' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(contact.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
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
    </Box>
  );
};

export default AdminDashboard;