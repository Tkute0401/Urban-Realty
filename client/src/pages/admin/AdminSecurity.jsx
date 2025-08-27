import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Security,
  Shield,
  Warning,
  CheckCircle,
  Error,
  Info,
  Refresh,
  Download,
  Visibility,
  Block,
  Lock,
  Public,
  VpnKey,
  TwoWheeler,
  Timeline,
  BugReport,
  Notifications,
  Settings,
  Analytics,
  History
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import axios from '../../services/axios';

const AdminSecurity = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [securityData, setSecurityData] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [threats, setThreats] = useState([]);
  const [securitySettings, setSecuritySettings] = useState({});
  const [settingsDialog, setSettingsDialog] = useState(false);

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const [securityResponse, auditResponse, threatsResponse, settingsResponse] = await Promise.all([
        axios.get('/admin/security/overview'),
        axios.get('/admin/security/audit-logs'),
        axios.get('/admin/security/threats'),
        axios.get('/admin/security/settings')
      ]);

      if (securityResponse.data.success) {
        setSecurityData(securityResponse.data.data);
      }
      if (auditResponse.data.success) {
        setAuditLogs(auditResponse.data.data);
      }
      if (threatsResponse.data.success) {
        setThreats(threatsResponse.data.data);
      }
      if (settingsResponse.data.success) {
        setSecuritySettings(settingsResponse.data.data);
      }
    } catch (err) {
      console.error('Error fetching security data:', err);
      setError('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityAction = async (action, data) => {
    try {
      const response = await axios.post(`/admin/security/${action}`, data);
      if (response.data.success) {
        fetchSecurityData();
      }
    } catch (err) {
      console.error('Error performing security action:', err);
      setError('Failed to perform security action');
    }
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'low':
        return 'success';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
      default:
        return 'default';
    }
  };

  const getThreatLevelIcon = (level) => {
    switch (level) {
      case 'low':
        return <CheckCircle color="success" />;
      case 'medium':
        return <Warning color="warning" />;
      case 'high':
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
        <Typography variant="h4">Security & Audit</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchSecurityData}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Settings />}
            onClick={() => setSettingsDialog(true)}
          >
            Security Settings
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Security Overview */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Shield sx={{ mr: 1 }} />
                <Typography variant="h6">Security Score</Typography>
              </Box>
              <Typography variant="h3">{securityData.securityScore || 85}%</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Overall security rating
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Warning sx={{ mr: 1 }} />
                <Typography variant="h6">Active Threats</Typography>
              </Box>
              <Typography variant="h3">{threats.filter(t => t.status === 'active').length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Threats detected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Lock sx={{ mr: 1 }} />
                <Typography variant="h6">Failed Logins</Typography>
              </Box>
              <Typography variant="h3">{securityData.failedLogins || 12}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Last 24 hours
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <VpnKey sx={{ mr: 1 }} />
                <Typography variant="h6">2FA Enabled</Typography>
              </Box>
              <Typography variant="h3">{securityData.twoFactorEnabled || 78}%</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                User accounts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Security Overview" icon={<Security />} />
          <Tab label="Audit Logs" icon={<History />} />
          <Tab label="Threat Detection" icon={<BugReport />} />
          <Tab label="Access Control" icon={<Lock />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Security Overview</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Security Events Over Time</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={securityData.securityEvents || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="events" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Threat Distribution</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={securityData.threatDistribution || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Security Status */}
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Security Status</Typography>
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Firewall Protection"
                            secondary="Active and up to date"
                          />
                          <Chip label="Active" color="success" size="small" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="SSL Certificate"
                            secondary="Valid until Dec 2024"
                          />
                          <Chip label="Valid" color="success" size="small" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <Warning color="warning" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Database Encryption"
                            secondary="Partially encrypted"
                          />
                          <Chip label="Partial" color="warning" size="small" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <CheckCircle color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary="Rate Limiting"
                            secondary="Configured and active"
                          />
                          <Chip label="Active" color="success" size="small" />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Recent Security Events</Typography>
                      <List>
                        {securityData.recentEvents?.map((event, index) => (
                          <ListItem key={index} divider>
                            <ListItemIcon>
                              {event.type === 'login' && <Lock />}
                              {event.type === 'threat' && <Warning />}
                              {event.type === 'update' && <CheckCircle />}
                            </ListItemIcon>
                            <ListItemText
                              primary={event.description}
                              secondary={new Date(event.timestamp).toLocaleString()}
                            />
                            <Chip 
                              label={event.severity} 
                              color={event.severity === 'high' ? 'error' : event.severity === 'medium' ? 'warning' : 'success'}
                              size="small"
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Audit Logs</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Action</TableCell>
                      <TableCell>Resource</TableCell>
                      <TableCell>IP Address</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                        <TableCell>{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>{log.resource}</TableCell>
                        <TableCell>{log.ipAddress}</TableCell>
                        <TableCell>
                          <Chip 
                            label={log.status} 
                            color={log.status === 'success' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Threat Detection</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Threat</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Severity</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Detected</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {threats.map((threat) => (
                      <TableRow key={threat.id}>
                        <TableCell>{threat.name}</TableCell>
                        <TableCell>{threat.type}</TableCell>
                        <TableCell>
                          <Chip 
                            label={threat.severity} 
                            color={getThreatLevelColor(threat.severity)}
                            icon={getThreatLevelIcon(threat.severity)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={threat.status} 
                            color={threat.status === 'resolved' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(threat.detectedAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Box>
                            <Tooltip title="Block IP">
                              <IconButton 
                                size="small"
                                onClick={() => handleSecurityAction('block-ip', { ip: threat.source })}
                              >
                                <Block />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="View Details">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Access Control</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Authentication Settings</Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Two-Factor Authentication"
                            secondary="Require 2FA for all users"
                          />
                          <ListItemSecondaryAction>
                            <Switch 
                              checked={securitySettings.require2FA}
                              onChange={(e) => handleSecurityAction('update-2fa', { enabled: e.target.checked })}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Password Policy"
                            secondary="Minimum 8 characters, uppercase, lowercase, numbers"
                          />
                          <ListItemSecondaryAction>
                            <Button size="small">Edit</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Session Timeout"
                            secondary="30 minutes of inactivity"
                          />
                          <ListItemSecondaryAction>
                            <Button size="small">Edit</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Failed Login Attempts"
                            secondary="Lock account after 5 failed attempts"
                          />
                          <ListItemSecondaryAction>
                            <Button size="small">Edit</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>IP Whitelist/Blacklist</Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="IP Whitelist"
                            secondary="Allow only specific IP addresses"
                          />
                          <ListItemSecondaryAction>
                            <Switch 
                              checked={securitySettings.ipWhitelist}
                              onChange={(e) => handleSecurityAction('update-ip-whitelist', { enabled: e.target.checked })}
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="IP Blacklist"
                            secondary="Block specific IP addresses"
                          />
                          <ListItemSecondaryAction>
                            <Button size="small">Manage</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Geographic Restrictions"
                            secondary="Block access from specific countries"
                          />
                          <ListItemSecondaryAction>
                            <Button size="small">Configure</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Security Settings Dialog */}
      <Dialog open={settingsDialog} onClose={() => setSettingsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Security Settings</DialogTitle>
        <DialogContent>
          <Typography>
            Advanced security configuration options will be available here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSecurity;