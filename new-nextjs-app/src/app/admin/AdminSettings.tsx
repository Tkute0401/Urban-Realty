import { useState, useEffect } from 'react';
import { api } from '@/lib/services/api';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Switch,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  FormControlLabel,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Settings,
  Security,
  Email,
  Payment,
  Notifications,
  Storage,
  Backup,
  Restore,
  Save,
  Refresh,
  ExpandMore,
  Edit,
  Delete,
  Add
} from '@mui/icons-material';
import http from '@/lib/services/http';

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Squarefooot',
      siteDescription: 'Premium Real Estate Platform',
      maintenanceMode: false,
      allowRegistration: true,
      requireEmailVerification: true,
      maxFileUploadSize: 10,
      sessionTimeout: 30
    },
    email: {
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      fromEmail: 'noreply@squarefooot.com',
      fromName: 'Squarefooot',
      enableEmailNotifications: true
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      maxLoginAttempts: 5,
      lockoutDuration: 15,
      enableTwoFactor: false,
      sessionTimeout: 30
    },
    payment: {
      stripeEnabled: false,
      stripePublishableKey: '',
      stripeSecretKey: '',
      paypalEnabled: false,
      paypalClientId: '',
      paypalSecret: '',
      currency: 'USD',
      taxRate: 0
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      newUserNotification: true,
      newPropertyNotification: true,
      newInquiryNotification: true
    },
    storage: {
      maxPropertyImages: 20,
      maxImageSize: 5,
      allowedImageTypes: ['jpg', 'jpeg', 'png', 'webp'],
      enableImageCompression: true,
      compressionQuality: 80
    },
    features: {
      enableAdvancedSearch: true,
      enableMapIntegration: true,
      enableVirtualTours: true,
      enableChat: true,
      enableReviews: true,
      enableFavorites: true,
      enableNewsletter: true,
      enableBlog: false
    },
    integrations: {
      googleAnalytics: '',
      facebookPixel: '',
      googleMapsApiKey: '',
      recaptchaSiteKey: '',
      recaptchaSecretKey: '',
      enableRecaptcha: false
    }
  });

  const [backupDialog, setBackupDialog] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editingSetting, setEditingSetting] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.admin.settings();
      if (response.success) {
        setSettings(response.data);
      } else {
        setError('Failed to fetch settings');
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await http.put('/admin/settings', settings);
      if (response.success) {
        setSuccess('Settings saved successfully!');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to save settings');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleBackup = async () => {
    try {
      const response = await http.post('/admin/backup');
      if (response.success) {
        setSuccess('Backup created successfully!');
        setBackupDialog(false);
      } else {
        setError('Failed to create backup');
      }
    } catch (err) {
      console.error('Error creating backup:', err);
      setError('Failed to create backup');
    }
  };

  const handleRestore = async (backupId) => {
    try {
      const response = await http.post(`/admin/restore/${backupId}`);
      if (response.success) {
        setSuccess('System restored successfully!');
        setRestoreDialog(false);
        fetchSettings();
      } else {
        setError('Failed to restore system');
      }
    } catch (err) {
      console.error('Error restoring system:', err);
      setError('Failed to restore system');
    }
  };

  const handleEditSetting = (category, key) => {
    setEditingSetting({ category, key, value: settings[category][key] });
    setEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (editingSetting) {
      handleSettingChange(editingSetting.category, editingSetting.key, editingSetting.value);
      setEditDialog(false);
      setEditingSetting(null);
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
        <Typography variant="h4">System Settings</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchSettings}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="General Settings"
              avatar={<Settings />}
            />
            <CardContent>
              <TextField
                fullWidth
                label="Site Name"
                value={settings.general.siteName}
                onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Site Description"
                value={settings.general.siteDescription}
                onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
                margin="normal"
                multiline
                rows={2}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.general.maintenanceMode}
                    onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
                  />
                }
                label="Maintenance Mode"
                sx={{ mt: 2 }}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.general.allowRegistration}
                    onChange={(e) => handleSettingChange('general', 'allowRegistration', e.target.checked)}
                  />
                }
                label="Allow User Registration"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.general.requireEmailVerification}
                    onChange={(e) => handleSettingChange('general', 'requireEmailVerification', e.target.checked)}
                  />
                }
                label="Require Email Verification"
              />
              <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                Max File Upload Size (MB)
              </Typography>
              <Slider
                value={settings.general.maxFileUploadSize}
                onChange={(e, value) => handleSettingChange('general', 'maxFileUploadSize', value)}
                min={1}
                max={50}
                marks
                valueLabelDisplay="auto"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Security Settings"
              avatar={<Security />}
            />
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Password Minimum Length
              </Typography>
              <Slider
                value={settings.security.passwordMinLength}
                onChange={(e, value) => handleSettingChange('security', 'passwordMinLength', value)}
                min={6}
                max={20}
                marks
                valueLabelDisplay="auto"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.security.requireSpecialChars}
                    onChange={(e) => handleSettingChange('security', 'requireSpecialChars', e.target.checked)}
                  />
                }
                label="Require Special Characters"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.security.requireNumbers}
                    onChange={(e) => handleSettingChange('security', 'requireNumbers', e.target.checked)}
                  />
                }
                label="Require Numbers"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={settings.security.requireUppercase}
                    onChange={(e) => handleSettingChange('security', 'requireUppercase', e.target.checked)}
                  />
                }
                label="Require Uppercase Letters"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.security.enableTwoFactor}
                    onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
                  />
                }
                label="Enable Two-Factor Authentication"
              />
              <TextField
                fullWidth
                label="Max Login Attempts"
                type="number"
                value={settings.security.maxLoginAttempts}
                onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Email Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Email Configuration"
              avatar={<Email />}
            />
            <CardContent>
              <TextField
                fullWidth
                label="SMTP Host"
                value={settings.email.smtpHost}
                onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="SMTP Port"
                type="number"
                value={settings.email.smtpPort}
                onChange={(e) => handleSettingChange('email', 'smtpPort', parseInt(e.target.value))}
                margin="normal"
              />
              <TextField
                fullWidth
                label="SMTP Username"
                value={settings.email.smtpUser}
                onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="SMTP Password"
                type="password"
                value={settings.email.smtpPassword}
                onChange={(e) => handleSettingChange('email', 'smtpPassword', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="From Email"
                value={settings.email.fromEmail}
                onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="From Name"
                value={settings.email.fromName}
                onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
                margin="normal"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.email.enableEmailNotifications}
                    onChange={(e) => handleSettingChange('email', 'enableEmailNotifications', e.target.checked)}
                  />
                }
                label="Enable Email Notifications"
                sx={{ mt: 2 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Payment Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Payment Configuration"
              avatar={<Payment />}
            />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.payment.stripeEnabled}
                    onChange={(e) => handleSettingChange('payment', 'stripeEnabled', e.target.checked)}
                  />
                }
                label="Enable Stripe Payments"
              />
              {settings.payment.stripeEnabled && (
                <>
                  <TextField
                    fullWidth
                    label="Stripe Publishable Key"
                    value={settings.payment.stripePublishableKey}
                    onChange={(e) => handleSettingChange('payment', 'stripePublishableKey', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Stripe Secret Key"
                    type="password"
                    value={settings.payment.stripeSecretKey}
                    onChange={(e) => handleSettingChange('payment', 'stripeSecretKey', e.target.value)}
                    margin="normal"
                  />
                </>
              )}
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.payment.paypalEnabled}
                    onChange={(e) => handleSettingChange('payment', 'paypalEnabled', e.target.checked)}
                  />
                }
                label="Enable PayPal Payments"
                sx={{ mt: 2 }}
              />
              {settings.payment.paypalEnabled && (
                <>
                  <TextField
                    fullWidth
                    label="PayPal Client ID"
                    value={settings.payment.paypalClientId}
                    onChange={(e) => handleSettingChange('payment', 'paypalClientId', e.target.value)}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="PayPal Secret"
                    type="password"
                    value={settings.payment.paypalSecret}
                    onChange={(e) => handleSettingChange('payment', 'paypalSecret', e.target.value)}
                    margin="normal"
                  />
                </>
              )}
              <FormControl fullWidth margin="normal">
                <InputLabel>Currency</InputLabel>
                <Select
                  value={settings.payment.currency}
                  onChange={(e) => handleSettingChange('payment', 'currency', e.target.value)}
                >
                  <MenuItem value="USD">USD ($)</MenuItem>
                  <MenuItem value="EUR">EUR (€)</MenuItem>
                  <MenuItem value="GBP">GBP (£)</MenuItem>
                  <MenuItem value="INR">INR (₹)</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Tax Rate (%)"
                type="number"
                value={settings.payment.taxRate}
                onChange={(e) => handleSettingChange('payment', 'taxRate', parseFloat(e.target.value))}
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Feature Toggles */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="Feature Management"
              avatar={<Settings />}
            />
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features.enableAdvancedSearch}
                        onChange={(e) => handleSettingChange('features', 'enableAdvancedSearch', e.target.checked)}
                      />
                    }
                    label="Advanced Search"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features.enableMapIntegration}
                        onChange={(e) => handleSettingChange('features', 'enableMapIntegration', e.target.checked)}
                      />
                    }
                    label="Map Integration"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features.enableVirtualTours}
                        onChange={(e) => handleSettingChange('features', 'enableVirtualTours', e.target.checked)}
                      />
                    }
                    label="Virtual Tours"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features.enableChat}
                        onChange={(e) => handleSettingChange('features', 'enableChat', e.target.checked)}
                      />
                    }
                    label="Live Chat"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features.enableReviews}
                        onChange={(e) => handleSettingChange('features', 'enableReviews', e.target.checked)}
                      />
                    }
                    label="Property Reviews"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features.enableFavorites}
                        onChange={(e) => handleSettingChange('features', 'enableFavorites', e.target.checked)}
                      />
                    }
                    label="Favorites System"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features.enableNewsletter}
                        onChange={(e) => handleSettingChange('features', 'enableNewsletter', e.target.checked)}
                      />
                    }
                    label="Newsletter"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.features.enableBlog}
                        onChange={(e) => handleSettingChange('features', 'enableBlog', e.target.checked)}
                      />
                    }
                    label="Blog System"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* System Management */}
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title="System Management"
              avatar={<Storage />}
            />
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<Backup />}
                  onClick={() => setBackupDialog(true)}
                >
                  Create Backup
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Restore />}
                  onClick={() => setRestoreDialog(true)}
                >
                  Restore System
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Refresh />}
                  onClick={() => window.location.reload()}
                >
                  Clear Cache
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Backup Dialog */}
      <Dialog open={backupDialog} onClose={() => setBackupDialog(false)}>
        <DialogTitle>Create System Backup</DialogTitle>
        <DialogContent>
          <Typography>
            This will create a complete backup of the system including all data and settings.
            The backup will be stored securely and can be used to restore the system if needed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialog(false)}>Cancel</Button>
          <Button onClick={handleBackup} variant="contained">Create Backup</Button>
        </DialogActions>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={restoreDialog} onClose={() => setRestoreDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Restore System</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Select a backup to restore the system. This action cannot be undone.
          </Typography>
          <List>
            {/* This would be populated with actual backup data */}
            <ListItem>
              <ListItemText
                primary="Backup - 2024-01-15 14:30"
                secondary="Complete system backup"
              />
              <ListItemSecondaryAction>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleRestore('backup-1')}
                >
                  Restore
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRestoreDialog(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Setting Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)}>
        <DialogTitle>Edit Setting</DialogTitle>
        <DialogContent>
          {editingSetting && (
            <TextField
              fullWidth
              label={editingSetting.key}
              value={editingSetting.value}
              onChange={(e) => setEditingSetting({
                ...editingSetting,
                value: e.target.value
              })}
              margin="normal"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSettings;