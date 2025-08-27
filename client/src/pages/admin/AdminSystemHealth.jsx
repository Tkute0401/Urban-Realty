import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tooltip,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Info,
  Refresh,
  Settings,
  Memory,
  Storage,
  Speed,
  NetworkCheck,
  Security,
  BugReport,
  Timeline,
  Monitor,
  Storage as StorageIcon,
  Cpu,
  NetworkWifi,
  CloudQueue,
  Database,
  Code,
  Build
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import axios from '../../services/axios';

const AdminSystemHealth = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [systemHealth, setSystemHealth] = useState({
    overall: 'healthy',
    services: [],
    performance: {},
    logs: [],
    alerts: []
  });
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(30);
  const [logDialog, setLogDialog] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchSystemHealth();
    
    if (autoRefresh) {
      const interval = setInterval(fetchSystemHealth, refreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const fetchSystemHealth = async () => {
    try {
      const response = await axios.get('/admin/system/health');
      if (response.data.success) {
        setSystemHealth(response.data.data);
      } else {
        setError('Failed to fetch system health data');
      }
    } catch (err) {
      console.error('Error fetching system health:', err);
      setError('Failed to load system health data');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceAction = async (serviceId, action) => {
    try {
      const response = await axios.post(`/admin/system/services/${serviceId}/${action}`);
      if (response.data.success) {
        fetchSystemHealth();
      }
    } catch (err) {
      console.error('Error performing service action:', err);
      setError('Failed to perform service action');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'error':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">System Health & Monitoring</Typography>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
              />
            }
            label="Auto Refresh"
            sx={{ mr: 2 }}
          />
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchSystemHealth}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Overall System Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            {getStatusIcon(systemHealth.overall)}
            <Typography variant="h6" sx={{ ml: 1 }}>
              Overall System Status: {systemHealth.overall.toUpperCase()}
            </Typography>
            <Chip 
              label={systemHealth.overall} 
              color={getStatusColor(systemHealth.overall)}
              sx={{ ml: 2 }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {/* System Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Cpu sx={{ mr: 1, verticalAlign: 'middle' }} />
                CPU Usage
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemHealth.performance?.cpu || 0} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2">
                  {systemHealth.performance?.cpu || 0}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Average load: {systemHealth.performance?.loadAverage || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Memory sx={{ mr: 1, verticalAlign: 'middle' }} />
                Memory Usage
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemHealth.performance?.memory || 0} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2">
                  {systemHealth.performance?.memory || 0}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {systemHealth.performance?.memoryUsed || '0'} / {systemHealth.performance?.memoryTotal || '0'} MB
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <StorageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Disk Usage
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemHealth.performance?.disk || 0} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2">
                  {systemHealth.performance?.disk || 0}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {systemHealth.performance?.diskUsed || '0'} / {systemHealth.performance?.diskTotal || '0'} GB
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <NetworkWifi sx={{ mr: 1, verticalAlign: 'middle' }} />
                Network Status
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ flexGrow: 1, mr: 2 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={systemHealth.performance?.network || 0} 
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                <Typography variant="body2">
                  {systemHealth.performance?.network || 0}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Response time: {systemHealth.performance?.responseTime || 'N/A'}ms
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Performance Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>CPU Usage Over Time</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={systemHealth.performance?.cpuHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="usage" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Memory Usage Over Time</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={systemHealth.performance?.memoryHistory || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="usage" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Service Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            <Build sx={{ mr: 1, verticalAlign: 'middle' }} />
            Service Status
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Service</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Uptime</TableCell>
                  <TableCell>Response Time</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {systemHealth.services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {service.type === 'database' && <Database />}
                        {service.type === 'api' && <Code />}
                        {service.type === 'storage' && <CloudQueue />}
                        {service.type === 'network' && <NetworkCheck />}
                        <Typography sx={{ ml: 1 }}>{service.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={service.status} 
                        color={getStatusColor(service.status)}
                        icon={getStatusIcon(service.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{service.uptime}</TableCell>
                    <TableCell>{service.responseTime}ms</TableCell>
                    <TableCell>
                      <Box>
                        <Tooltip title="Restart Service">
                          <IconButton
                            size="small"
                            onClick={() => handleServiceAction(service.id, 'restart')}
                            disabled={service.status === 'error'}
                          >
                            <Refresh />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View Logs">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setSelectedService(service);
                              setLogDialog(true);
                            }}
                          >
                            <BugReport />
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

      {/* System Alerts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Alerts
              </Typography>
              <List>
                {systemHealth.alerts.slice(0, 5).map((alert, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      {alert.severity === 'error' && <Error color="error" />}
                      {alert.severity === 'warning' && <Warning color="warning" />}
                      {alert.severity === 'info' && <Info color="info" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={alert.message}
                      secondary={new Date(alert.timestamp).toLocaleString()}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
                System Logs
              </Typography>
              <List>
                {systemHealth.logs.slice(0, 5).map((log, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      {log.level === 'error' && <Error color="error" />}
                      {log.level === 'warning' && <Warning color="warning" />}
                      {log.level === 'info' && <Info color="info" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={log.message}
                      secondary={`${log.service} - ${new Date(log.timestamp).toLocaleString()}`}
                    />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => setLogDialog(true)}
                sx={{ mt: 2 }}
              >
                View All Logs
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Logs Dialog */}
      <Dialog 
        open={logDialog} 
        onClose={() => setLogDialog(false)} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          System Logs {selectedService && `- ${selectedService.name}`}
        </DialogTitle>
        <DialogContent>
          <List>
            {systemHealth.logs.map((log, index) => (
              <ListItem key={index} divider>
                <ListItemIcon>
                  {log.level === 'error' && <Error color="error" />}
                  {log.level === 'warning' && <Warning color="warning" />}
                  {log.level === 'info' && <Info color="info" />}
                </ListItemIcon>
                <ListItemText
                  primary={log.message}
                  secondary={`${log.service} - ${new Date(log.timestamp).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSystemHealth;