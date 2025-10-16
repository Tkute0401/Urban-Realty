'use client'
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Avatar,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Badge,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction,
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
  Snackbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Code as CodeIcon,
  BugReport as BugIcon,
  Speed as SpeedIcon,
  Storage as StorageIcon,
  CloudUpload as DeployIcon,
  Timeline as TimelineIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Settings as SettingsIcon,
  Storage as DatabaseIcon,
  Api as ApiIcon,
  Security as SecurityIcon,
  Assessment as AnalyticsIcon,
  Build as BuildIcon,
  PlayArrow as PlayIcon,
  Stop as StopIcon,
  Pause as PauseIcon,
  RestartAlt as RestartIcon
} from '@mui/icons-material';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, ComposedChart, ScatterChart, Scatter } from 'recharts';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDate, formatBytes, formatDuration } from '@/lib/utils/format';

// Real API endpoints for developer metrics

export default function DeveloperDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' | 'warning' | 'info' });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');

  // Real API calls for developer metrics
  const { data: apiMetrics, isLoading: apiLoading, refetch: refetchApi } = useQuery({
    queryKey: ['developerApiMetrics'],
    queryFn: async () => {
      const response = await fetch('/api/v1/developer/api-metrics');
      if (!response.ok) throw new Error('Failed to fetch API metrics');
      return response.json();
    },
    refetchInterval: autoRefresh ? 10000 : false, // Refresh every 10 seconds
    retry: (failureCount) => (failureCount < 3),
  });

  const { data: databaseMetrics, isLoading: dbLoading, refetch: refetchDb } = useQuery({
    queryKey: ['developerDatabaseMetrics'],
    queryFn: async () => {
      const response = await fetch('/api/v1/developer/database-metrics');
      if (!response.ok) throw new Error('Failed to fetch database metrics');
      return response.json();
    },
    refetchInterval: autoRefresh ? 15000 : false, // Refresh every 15 seconds
    retry: (failureCount) => (failureCount < 3),
  });

  const { data: deploymentStatus, isLoading: deployLoading, refetch: refetchDeploy } = useQuery({
    queryKey: ['developerDeploymentStatus'],
    queryFn: async () => {
      const response = await fetch('/api/v1/developer/deployment-status');
      if (!response.ok) throw new Error('Failed to fetch deployment status');
      return response.json();
    },
    refetchInterval: autoRefresh ? 30000 : false, // Refresh every 30 seconds
    retry: (failureCount) => (failureCount < 3),
  });

  const { data: errorLogs, isLoading: logsLoading, refetch: refetchLogs } = useQuery({
    queryKey: ['developerErrorLogs'],
    queryFn: async () => {
      const response = await fetch('/api/v1/developer/error-logs');
      if (!response.ok) throw new Error('Failed to fetch error logs');
      return response.json();
    },
    refetchInterval: autoRefresh ? 2000 : false, // Refresh every 2 seconds
    retry: (failureCount) => (failureCount < 3),
  });

  const refreshAllMutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        refetchApi(),
        refetchDb(),
        refetchDeploy(),
        refetchLogs()
      ]);
    },
    onSuccess: () => {
      setNotification({
        open: true,
        message: 'All metrics refreshed successfully!',
        severity: 'success'
      });
    },
    onError: (error) => {
      setNotification({
        open: true,
        message: error.message || 'Failed to refresh metrics',
        severity: 'error'
      });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': case 'failed': return 'error';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': case 'success': return <SuccessIcon />;
      case 'warning': return <WarningIcon />;
      case 'error': case 'failed': return <ErrorIcon />;
      case 'info': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  const MetricCard = ({ title, value, subtitle, icon, color, trend, loading }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ height: '100%', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              <Typography variant="h4" fontWeight="bold" color={color}>
                {loading ? <CircularProgress size={24} /> : value}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Avatar sx={{ backgroundColor: color + '20', color: color }}>
              {icon}
            </Avatar>
          </Box>
          {trend && (
            <Box display="flex" alignItems="center" gap={1}>
              <Chip
                label={trend}
                size="small"
                color={trend.startsWith('+') ? 'success' : trend.startsWith('-') ? 'error' : 'default'}
                variant="outlined"
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );


  if (apiLoading && dbLoading) {
    return (
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
          Loading developer metrics...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} mb={4} gap={2}>
          <Box>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ color: 'var(--color-primary)' }}>
                Developer Dashboard 🚀
              </Typography>
              {autoRefresh && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} />
                  <Typography variant="caption" color="text.secondary">
                    Live Updates
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="h6" color="text.secondary">
              Real-time system monitoring and development insights
            </Typography>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <FormControlLabel
              control={
                <Switch
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  color="primary"
                />
              }
              label="Auto Refresh"
            />
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refreshAllMutation.mutate()}
              disabled={refreshAllMutation.isPending}
            >
              Refresh All
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => window.open('/api/developer/export', '_blank')}
            >
              Export Data
            </Button>
          </Box>
        </Box>
      </motion.div>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="API Performance" icon={<ApiIcon />} />
          <Tab label="Database" icon={<DatabaseIcon />} />
          <Tab label="Deployment" icon={<DeployIcon />} />
          <Tab label="Error Logs" icon={<BugIcon />} />
          <Tab label="Analytics" icon={<AnalyticsIcon />} />
        </Tabs>
      </Box>

      {/* API Performance Tab */}
      {activeTab === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Requests"
                value={apiMetrics?.data?.totalRequests?.toLocaleString() || '0'}
                subtitle="Last 24 hours"
                icon={<ApiIcon />}
                color="var(--color-primary)"
                loading={apiLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Success Rate"
                value={`${apiMetrics?.data?.successRate || 0}%`}
                subtitle="API reliability"
                icon={<SuccessIcon />}
                color="var(--color-success)"
                trend={apiMetrics?.data?.trends?.successRate || ''}
                loading={apiLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Avg Response Time"
                value={`${apiMetrics?.data?.avgResponseTime || 0}ms`}
                subtitle="Performance"
                icon={<SpeedIcon />}
                color="var(--color-warning)"
                trend={apiMetrics?.data?.trends?.responseTime || ''}
                loading={apiLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Error Rate"
                value={`${apiMetrics?.data?.errorRate || 0}%`}
                subtitle="Issues detected"
                icon={<ErrorIcon />}
                color="var(--color-error)"
                trend={apiMetrics?.data?.trends?.errorRate || ''}
                loading={apiLoading}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    API Endpoint Performance
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Endpoint</TableCell>
                          <TableCell align="right">Requests</TableCell>
                          <TableCell align="right">Avg Time (ms)</TableCell>
                          <TableCell align="right">Errors</TableCell>
                          <TableCell align="right">Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(apiMetrics?.data?.endpoints || []).map((endpoint, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {endpoint.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">{endpoint.requests?.toLocaleString() || 0}</TableCell>
                            <TableCell align="right">{endpoint.avgTime || 0}</TableCell>
                            <TableCell align="right">
                              <Chip
                                label={endpoint.errors || 0}
                                size="small"
                                color={endpoint.errors > 10 ? 'error' : endpoint.errors > 5 ? 'warning' : 'success'}
                                variant="outlined"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <Chip
                                label={endpoint.errors < 5 ? 'Healthy' : endpoint.errors < 10 ? 'Warning' : 'Critical'}
                                size="small"
                                color={endpoint.errors < 5 ? 'success' : endpoint.errors < 10 ? 'warning' : 'error'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Response Time Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Fast (<200ms)', value: 65, color: '#4caf50' },
                          { name: 'Medium (200-500ms)', value: 25, color: '#ff9800' },
                          { name: 'Slow (>500ms)', value: 10, color: '#f44336' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {[
                          { name: 'Fast (<200ms)', value: 65, color: '#4caf50' },
                          { name: 'Medium (200-500ms)', value: 25, color: '#ff9800' },
                          { name: 'Slow (>500ms)', value: 10, color: '#f44336' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* Database Tab */}
      {activeTab === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Active Connections"
                value={`${databaseMetrics?.data?.connections?.active || 0}/${databaseMetrics?.data?.connections?.max || 0}`}
                subtitle="Database pool"
                icon={<DatabaseIcon />}
                color="var(--color-primary)"
                loading={dbLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Total Queries"
                value={databaseMetrics?.data?.queries?.total?.toLocaleString() || '0'}
                subtitle="Last 24 hours"
                icon={<TimelineIcon />}
                color="var(--color-info)"
                loading={dbLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Cache Hit Rate"
                value={`${databaseMetrics?.data?.queries?.cacheHitRate || 0}%`}
                subtitle="Performance"
                icon={<SpeedIcon />}
                color="var(--color-success)"
                trend={databaseMetrics?.data?.trends?.cacheHitRate || ''}
                loading={dbLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Slow Queries"
                value={databaseMetrics?.data?.queries?.slow || 0}
                subtitle="Need optimization"
                icon={<WarningIcon />}
                color="var(--color-warning)"
                trend={databaseMetrics?.data?.trends?.slowQueries || ''}
                loading={dbLoading}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Database Collections
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Collection</TableCell>
                          <TableCell align="right">Documents</TableCell>
                          <TableCell align="right">Size</TableCell>
                          <TableCell align="right">Indexes</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(databaseMetrics?.data?.collections || []).map((collection, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {collection.name}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">{collection.count?.toLocaleString() || 0}</TableCell>
                            <TableCell align="right">{collection.size || '0MB'}</TableCell>
                            <TableCell align="right">{collection.indexes || 0}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Query Performance
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { type: 'SELECT', count: 35000, avgTime: 25 },
                      { type: 'INSERT', count: 8500, avgTime: 45 },
                      { type: 'UPDATE', count: 1200, avgTime: 60 },
                      { type: 'DELETE', count: 300, avgTime: 35 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* Deployment Tab */}
      {activeTab === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3} mb={3}>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Current Version"
                value={deploymentStatus?.data?.current?.version || 'Unknown'}
                subtitle={deploymentStatus?.data?.current?.environment || 'Unknown'}
                icon={<DeployIcon />}
                color="var(--color-primary)"
                loading={deployLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Uptime"
                value={deploymentStatus?.data?.current?.uptime || '0%'}
                subtitle="System availability"
                icon={<SuccessIcon />}
                color="var(--color-success)"
                loading={deployLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Last Deploy"
                value={deploymentStatus?.data?.current?.buildTime || 'Unknown'}
                subtitle="Build duration"
                icon={<BuildIcon />}
                color="var(--color-info)"
                loading={deployLoading}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <MetricCard
                title="Status"
                value={deploymentStatus?.data?.current?.status || 'Unknown'}
                subtitle="Health check"
                icon={getStatusIcon(deploymentStatus?.data?.current?.status || 'unknown')}
                color={getStatusColor(deploymentStatus?.data?.current?.status || 'unknown')}
                loading={deployLoading}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Card sx={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Recent Deployments
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Version</TableCell>
                          <TableCell align="center">Status</TableCell>
                          <TableCell align="right">Duration</TableCell>
                          <TableCell align="right">Time</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(deploymentStatus?.data?.recent || []).map((deploy, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <Typography variant="body2" fontFamily="monospace">
                                {deploy.version}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip
                                label={deploy.status}
                                size="small"
                                color={getStatusColor(deploy.status)}
                                icon={getStatusIcon(deploy.status)}
                              />
                            </TableCell>
                            <TableCell align="right">{deploy.duration || 'Unknown'}</TableCell>
                            <TableCell align="right">
                              {deploy.time ? new Date(deploy.time).toLocaleString() : 'Unknown'}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton size="small">
                                <PlayIcon />
                              </IconButton>
                              <IconButton size="small">
                                <StopIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Deployment Actions
                  </Typography>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<DeployIcon />}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Deploy to Staging
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeployIcon />}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Deploy to Production
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RestartIcon />}
                      fullWidth
                      sx={{ mb: 1 }}
                    >
                      Restart Services
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<SettingsIcon />}
                      fullWidth
                    >
                      Configuration
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {/* Error Logs Tab */}
      {activeTab === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card sx={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">
                  Real-time Error Logs
                </Typography>
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RefreshIcon />}
                    onClick={() => refetchLogs()}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<DownloadIcon />}
                  >
                    Export
                  </Button>
                </Box>
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Level</TableCell>
                      <TableCell>Message</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Count</TableCell>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(errorLogs?.data || []).map((log, index) => (
                      <TableRow key={log.id || index}>
                        <TableCell>
                          <Chip
                            label={log.level || 'unknown'}
                            size="small"
                            color={getStatusColor(log.level || 'unknown')}
                            icon={getStatusIcon(log.level || 'unknown')}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {log.message || 'No message'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={log.service || 'unknown'}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Badge badgeContent={log.count || 0} color="error">
                            <Typography variant="body2">
                              {log.count || 0}
                            </Typography>
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Unknown'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton size="small">
                            <InfoIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    System Performance Trends
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart data={[
                      { time: '00:00', requests: 1200, errors: 5, responseTime: 180 },
                      { time: '04:00', requests: 800, errors: 3, responseTime: 160 },
                      { time: '08:00', requests: 2500, errors: 12, responseTime: 220 },
                      { time: '12:00', requests: 3200, errors: 18, responseTime: 280 },
                      { time: '16:00', requests: 2800, errors: 15, responseTime: 250 },
                      { time: '20:00', requests: 1800, errors: 8, responseTime: 200 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <RechartsTooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="requests" fill="#8884d8" />
                      <Line yAxisId="right" type="monotone" dataKey="responseTime" stroke="#82ca9d" strokeWidth={2} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border-light)' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Error Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Database', value: 35, color: '#f44336' },
                          { name: 'API', value: 25, color: '#ff9800' },
                          { name: 'Authentication', value: 20, color: '#2196f3' },
                          { name: 'Storage', value: 15, color: '#9c27b0' },
                          { name: 'Other', value: 5, color: '#607d8b' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                      >
                        {[
                          { name: 'Database', value: 35, color: '#f44336' },
                          { name: 'API', value: 25, color: '#ff9800' },
                          { name: 'Authentication', value: 20, color: '#2196f3' },
                          { name: 'Storage', value: 15, color: '#9c27b0' },
                          { name: 'Other', value: 5, color: '#607d8b' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </motion.div>
      )}

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
}
