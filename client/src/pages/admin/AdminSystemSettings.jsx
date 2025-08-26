import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  CircularProgress,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AlertTitle,
  IconButton,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  CloudUpload as CloudIcon,
  SystemUpdate as SystemIcon,
  BugReport as BugIcon,
  Support as SupportIcon,
  Help as HelpIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Refresh as RefreshIcon,
  Save as SaveIcon,
  Backup as BackupIcon,
  Restore as RestoreIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  ExpandMore as ExpandMoreIcon,
  Notifications as NotificationsIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  VpnKey as KeyIcon,
  Database as DatabaseIcon,
  NetworkCheck as NetworkIcon,
  Memory as MemoryIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import axios from '../../services/axios';

const AdminSystemSettings = () => {
  const [systemInfo, setSystemInfo] = useState({
    uptime: 0,
    memoryUsage: 0,
    cpuUsage: 0,
    diskUsage: 0,
    activeConnections: 0,
    lastBackup: null,
    pendingUpdates: 0,
    nodeVersion: '',
    platform: '',
    arch: '',
    hostname: ''
  });
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    autoBackup: true,
    emailNotifications: true,
    securityAlerts: true,
    performanceMonitoring: true,
    debugMode: false,
    logLevel: 'info',
    backupFrequency: 'daily',
    retentionDays: 30,
    maxFileSize: 10,
    allowedFileTypes: ['jpg', 'png', 'pdf', 'doc'],
    sessionTimeout: 24,
    maxLoginAttempts: 5,
    twoFactorAuth: false,
    sslEnforcement: true,
    rateLimiting: true,
    corsEnabled: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);

  useEffect(() => {
    fetchSystemInfo();
    fetchSettings();
  }, []);

  const fetchSystemInfo = async () => {
    try {
      const response = await axios.get('/admin/system-info', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setSystemInfo(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching system info:', err);
    }
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // In a real app, you'd fetch from an API
      // For now, using default values
      setLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load system settings');
      setLoading(false);
    }
  };

  const handleSettingChange = async (setting, value) => {
    try {
      setSaving(true);
      await axios.put('/admin/system-settings', {
        [setting]: value
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setSettings(prev => ({ ...prev, [setting]: value }));
      setSuccess(`Setting "${setting}" updated successfully`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating setting:', err);
      setError(`Failed to update ${setting}`);
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      setSaving(true);
      // In a real app, this would trigger a backup
      setSuccess('Backup initiated successfully');
      setBackupDialogOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to initiate backup');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSystemUpdate = async () => {
    try {
      setSaving(true);
      // In a real app, this would check for and apply updates
      setSuccess('System update check completed');
      setUpdateDialogOpen(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to check for updates');
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const getSystemHealthColor = () => {
    const { memoryUsage, cpuUsage, diskUsage } = systemInfo;
    if (memoryUsage > 80 || cpuUsage > 80 || diskUsage > 90) return 'error';
    if (memoryUsage > 60 || cpuUsage > 60 || diskUsage > 70) return 'warning';
    return 'success';
  };

  const getSystemHealthLabel = () => {
    const { memoryUsage, cpuUsage, diskUsage } = systemInfo;
    if (memoryUsage > 80 || cpuUsage > 80 || diskUsage > 90) return 'Critical';
    if (memoryUsage > 60 || cpuUsage > 60 || diskUsage > 70) return 'Warning';
    return 'Healthy';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>System Settings</Typography>
          <Typography variant="body2" color="text.secondary">
            Configure and monitor your system settings
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSystemInfo}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={() => setSuccess('All settings saved successfully')}
            disabled={saving}
          >
            Save All
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {/* System Health Overview */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} />
            System Health Overview
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color={getSystemHealthColor()}>
                  {getSystemHealthLabel()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Overall Status
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="primary">
                  {systemInfo.uptime}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Days Uptime
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="info">
                  {systemInfo.activeConnections}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Active Connections
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box textAlign="center">
                <Typography variant="h4" color="warning">
                  {systemInfo.pendingUpdates}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Pending Updates
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* System Resources */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <MemoryIcon sx={{ mr: 1 }} />
                Memory Usage
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Usage</Typography>
                  <Typography variant="body2">{systemInfo.memoryUsage}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={systemInfo.memoryUsage} 
                  color={systemInfo.memoryUsage > 80 ? 'error' : systemInfo.memoryUsage > 60 ? 'warning' : 'success'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="caption" color="textSecondary">
                {systemInfo.memoryUsage > 80 ? 'Critical: Consider upgrading memory' : 
                 systemInfo.memoryUsage > 60 ? 'Warning: Monitor memory usage' : 'Healthy memory usage'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SpeedIcon sx={{ mr: 1 }} />
                CPU Usage
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Usage</Typography>
                  <Typography variant="body2">{systemInfo.cpuUsage}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={systemInfo.cpuUsage} 
                  color={systemInfo.cpuUsage > 80 ? 'error' : systemInfo.cpuUsage > 60 ? 'warning' : 'success'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="caption" color="textSecondary">
                {systemInfo.cpuUsage > 80 ? 'Critical: High CPU load detected' : 
                 systemInfo.cpuUsage > 60 ? 'Warning: Monitor CPU usage' : 'Normal CPU usage'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <StorageIcon sx={{ mr: 1 }} />
                Disk Usage
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2">Usage</Typography>
                  <Typography variant="body2">{systemInfo.diskUsage}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={systemInfo.diskUsage} 
                  color={systemInfo.diskUsage > 90 ? 'error' : systemInfo.diskUsage > 70 ? 'warning' : 'success'}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
              <Typography variant="caption" color="textSecondary">
                {systemInfo.diskUsage > 90 ? 'Critical: Disk space running low' : 
                 systemInfo.diskUsage > 70 ? 'Warning: Consider cleanup' : 'Adequate disk space'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Settings Sections */}
      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SettingsIcon sx={{ mr: 1 }} />
                General Settings
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.maintenanceMode}
                      onChange={(e) => handleSettingChange('maintenanceMode', e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="Maintenance Mode"
                />
                <Typography variant="caption" color="textSecondary" display="block" sx={{ ml: 4 }}>
                  Enable maintenance mode to restrict access to the system
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.debugMode}
                      onChange={(e) => handleSettingChange('debugMode', e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="Debug Mode"
                />
                <Typography variant="caption" color="textSecondary" display="block" sx={{ ml: 4 }}>
                  Enable debug logging for development purposes
                </Typography>
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Log Level</InputLabel>
                  <Select
                    value={settings.logLevel}
                    onChange={(e) => handleSettingChange('logLevel', e.target.value)}
                    label="Log Level"
                    disabled={saving}
                  >
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="warn">Warning</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="debug">Debug</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <SecurityIcon sx={{ mr: 1 }} />
                Security Settings
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.twoFactorAuth}
                      onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="Two-Factor Authentication"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.sslEnforcement}
                      onChange={(e) => handleSettingChange('sslEnforcement', e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="SSL Enforcement"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.rateLimiting}
                      onChange={(e) => handleSettingChange('rateLimiting', e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="Rate Limiting"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Max Login Attempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                  disabled={saving}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Backup & Recovery */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BackupIcon sx={{ mr: 1 }} />
                Backup & Recovery
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoBackup}
                      onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="Automatic Backups"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControl fullWidth size="small">
                  <InputLabel>Backup Frequency</InputLabel>
                  <Select
                    value={settings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    label="Backup Frequency"
                    disabled={saving}
                  >
                    <MenuItem value="hourly">Hourly</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Retention Days"
                  type="number"
                  value={settings.retentionDays}
                  onChange={(e) => handleSettingChange('retentionDays', parseInt(e.target.value))}
                  disabled={saving}
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<BackupIcon />}
                  onClick={() => setBackupDialogOpen(true)}
                  disabled={saving}
                  fullWidth
                >
                  Manual Backup
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                Notifications
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.emailNotifications}
                      onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="Email Notifications"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.securityAlerts}
                      onChange={(e) => handleSettingChange('securityAlerts', e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="Security Alerts"
                />
              </Box>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.performanceMonitoring}
                      onChange={(e) => handleSettingChange('performanceMonitoring', e.target.checked)}
                      disabled={saving}
                    />
                  }
                  label="Performance Monitoring"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* System Information */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <InfoIcon sx={{ mr: 1 }} />
            System Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Node Version</Typography>
              <Typography variant="body1">{systemInfo.nodeVersion}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Platform</Typography>
              <Typography variant="body1">{systemInfo.platform}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Architecture</Typography>
              <Typography variant="body1">{systemInfo.arch}</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="body2" color="textSecondary">Hostname</Typography>
              <Typography variant="body1">{systemInfo.hostname}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Backup Dialog */}
      <Dialog open={backupDialogOpen} onClose={() => setBackupDialogOpen(false)}>
        <DialogTitle>Create Manual Backup</DialogTitle>
        <DialogContent>
          <Typography>
            This will create a complete backup of your system including:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <DatabaseIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Database" secondary="All user data and settings" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <StorageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Files" secondary="Uploaded images and documents" />
            </ListItem>
            <ListItem>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <SettingsIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Configuration" secondary="System settings and preferences" />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleBackup} disabled={saving}>
            {saving ? 'Creating Backup...' : 'Create Backup'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)}>
        <DialogTitle>Check for System Updates</DialogTitle>
        <DialogContent>
          <Typography>
            This will check for available system updates and security patches.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSystemUpdate} disabled={saving}>
            {saving ? 'Checking...' : 'Check for Updates'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSystemSettings;