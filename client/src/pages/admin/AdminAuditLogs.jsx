import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Badge,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  AlertTitle,
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/material';
import {
  History as HistoryIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as CheckIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Search as SearchIcon,
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Block as BlockIcon,
  Unblock as UnblockIcon,
  AdminPanelSettings as AdminIcon,
  SupervisedUserCircle as UserIcon,
  Business as BusinessIcon,
  AttachMoney as MoneyIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Computer as ComputerIcon,
  Public as PublicIcon,
  VpnKey as KeyIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  FileDownload as ExportIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Notifications as NotificationIcon,
  BugReport as BugIcon,
  Build as BuildIcon,
  Storage as StorageIcon,
  NetworkCheck as NetworkIcon,
  Speed as SpeedIcon,
  Memory as MemoryIcon,
  Storage as DiskIcon,
  CloudDownload as CloudIcon,
  CloudUpload as UploadIcon,
  Sync as SyncIcon,
  Update as UpdateIcon,
  Restore as RestoreIcon,
  Backup as BackupIcon,
  Shield as ShieldIcon,
  VerifiedUser as VerifiedIcon,
  GppBad as BadIcon,
  GppGood as GoodIcon,
  GppMaybe as MaybeIcon
} from '@mui/icons-material';
import axios from '../../services/axios';

const AdminAuditLogs = () => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState(null);
  const [logDialogOpen, setLogDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({
    actionType: 'all',
    severity: 'all',
    userType: 'all',
    dateRange: '7days',
    searchQuery: ''
  });
  const [realTimeMonitoring, setRealTimeMonitoring] = useState(false);
  const [stats, setStats] = useState({
    totalLogs: 0,
    criticalEvents: 0,
    securityEvents: 0,
    userActions: 0,
    systemEvents: 0
  });

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  }, [auditLogs, filters]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      // In a real app, you'd fetch from audit logs endpoints
      // For now, using mock data
      const mockLogs = [
        {
          id: 1,
          timestamp: new Date(Date.now() - 1000 * 60 * 5),
          action: 'USER_LOGIN',
          description: 'User login successful',
          userId: 'user123',
          userName: 'john.doe@example.com',
          userType: 'user',
          severity: 'info',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          location: 'New York, US',
          details: {
            loginMethod: 'email',
            twoFactorEnabled: true,
            sessionDuration: '2 hours'
          },
          metadata: {
            browser: 'Chrome',
            os: 'Windows 10',
            device: 'Desktop'
          }
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
          action: 'PROPERTY_CREATED',
          description: 'New property listing created',
          userId: 'agent456',
          userName: 'jane.smith@realty.com',
          userType: 'agent',
          severity: 'info',
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          location: 'Los Angeles, US',
          details: {
            propertyId: 'prop789',
            propertyType: 'House',
            price: 750000,
            location: 'Downtown'
          },
          metadata: {
            browser: 'Safari',
            os: 'macOS',
            device: 'Desktop'
          }
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          action: 'ADMIN_SETTINGS_CHANGED',
          description: 'System settings modified',
          userId: 'admin001',
          userName: 'admin@urbanrealty.com',
          userType: 'admin',
          severity: 'warning',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          location: 'Chicago, US',
          details: {
            settingName: 'maintenance_mode',
            oldValue: 'false',
            newValue: 'true',
            reason: 'Scheduled maintenance'
          },
          metadata: {
            browser: 'Firefox',
            os: 'Windows 10',
            device: 'Desktop'
          }
        },
        {
          id: 4,
          timestamp: new Date(Date.now() - 1000 * 60 * 45),
          action: 'SECURITY_VIOLATION',
          description: 'Multiple failed login attempts detected',
          userId: 'unknown',
          userName: 'suspicious@email.com',
          userType: 'unknown',
          severity: 'critical',
          ipAddress: '203.0.113.1',
          userAgent: 'Mozilla/5.0 (Unknown)',
          location: 'Unknown',
          details: {
            failedAttempts: 15,
            timeWindow: '5 minutes',
            actionTaken: 'IP blocked',
            threatLevel: 'High'
          },
          metadata: {
            browser: 'Unknown',
            os: 'Unknown',
            device: 'Unknown'
          }
        },
        {
          id: 5,
          timestamp: new Date(Date.now() - 1000 * 60 * 60),
          action: 'USER_SUBSCRIPTION_UPDATED',
          description: 'User subscription plan changed',
          userId: 'user789',
          userName: 'bob.wilson@example.com',
          userType: 'user',
          severity: 'info',
          ipAddress: '192.168.1.103',
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)',
          location: 'Miami, US',
          details: {
            oldPlan: 'basic',
            newPlan: 'premium',
            priceChange: '+$25/month',
            reason: 'User upgrade'
          },
          metadata: {
            browser: 'Safari',
            os: 'iOS',
            device: 'Mobile'
          }
        },
        {
          id: 6,
          timestamp: new Date(Date.now() - 1000 * 60 * 90),
          action: 'SYSTEM_BACKUP',
          description: 'Automated system backup completed',
          userId: 'system',
          userName: 'system@urbanrealty.com',
          userType: 'system',
          severity: 'info',
          ipAddress: '127.0.0.1',
          userAgent: 'System Process',
          location: 'Server',
          details: {
            backupType: 'full',
            size: '2.5 GB',
            duration: '15 minutes',
            status: 'success'
          },
          metadata: {
            process: 'backup_service',
            version: '2.1.0',
            environment: 'production'
          }
        },
        {
          id: 7,
          timestamp: new Date(Date.now() - 1000 * 60 * 120),
          action: 'AGENT_VERIFIED',
          description: 'Real estate agent verification completed',
          userId: 'admin001',
          userName: 'admin@urbanrealty.com',
          userType: 'admin',
          severity: 'info',
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          location: 'Chicago, US',
          details: {
            agentId: 'agent789',
            agentName: 'Sarah Johnson',
            verificationType: 'license_check',
            status: 'approved'
          },
          metadata: {
            browser: 'Firefox',
            os: 'Windows 10',
            device: 'Desktop'
          }
        },
        {
          id: 8,
          timestamp: new Date(Date.now() - 1000 * 60 * 180),
          action: 'PAYMENT_PROCESSED',
          description: 'Subscription payment received',
          userId: 'user456',
          userName: 'alice.brown@example.com',
          userType: 'user',
          severity: 'info',
          ipAddress: '192.168.1.104',
          userAgent: 'Mozilla/5.0 (Android 11)',
          location: 'Seattle, US',
          details: {
            amount: 99.99,
            currency: 'USD',
            paymentMethod: 'credit_card',
            transactionId: 'txn_123456'
          },
          metadata: {
            browser: 'Chrome',
            os: 'Android',
            device: 'Mobile'
          }
        }
      ];

      setAuditLogs(mockLogs);
      setStats({
        totalLogs: mockLogs.length,
        criticalEvents: mockLogs.filter(log => log.severity === 'critical').length,
        securityEvents: mockLogs.filter(log => log.action.includes('SECURITY')).length,
        userActions: mockLogs.filter(log => log.userType === 'user').length,
        systemEvents: mockLogs.filter(log => log.userType === 'system').length
      });
    } catch (err) {
      console.error('Error fetching audit logs:', err);
      setError('Failed to load audit logs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterLogs = () => {
    let filtered = [...auditLogs];

    if (filters.actionType !== 'all') {
      filtered = filtered.filter(log => log.action === filters.actionType);
    }

    if (filters.severity !== 'all') {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    if (filters.userType !== 'all') {
      filtered = filtered.filter(log => log.userType === filters.userType);
    }

    if (filters.searchQuery) {
      filtered = filtered.filter(log =>
        log.description.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(filters.searchQuery.toLowerCase())
      );
    }

    // Apply date range filter
    const now = new Date();
    switch (filters.dateRange) {
      case '1day':
        filtered = filtered.filter(log => (now - log.timestamp) <= 24 * 60 * 60 * 1000);
        break;
      case '7days':
        filtered = filtered.filter(log => (now - log.timestamp) <= 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        filtered = filtered.filter(log => (now - log.timestamp) <= 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        break;
    }

    setFilteredLogs(filtered);
  };

  const getActionIcon = (action) => {
    if (action.includes('LOGIN')) return <LoginIcon />;
    if (action.includes('LOGOUT')) return <LogoutIcon />;
    if (action.includes('PROPERTY')) return <HomeIcon />;
    if (action.includes('ADMIN')) return <AdminIcon />;
    if (action.includes('SECURITY')) return <SecurityIcon />;
    if (action.includes('USER')) return <UserIcon />;
    if (action.includes('AGENT')) return <BusinessIcon />;
    if (action.includes('PAYMENT')) return <MoneyIcon />;
    if (action.includes('SYSTEM')) return <SettingsIcon />;
    if (action.includes('BACKUP')) return <BackupIcon />;
    return <InfoIcon />;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <ErrorIcon />;
      case 'warning': return <WarningIcon />;
      case 'info': return <InfoIcon />;
      case 'success': return <CheckIcon />;
      default: return <InfoIcon />;
    }
  };

  const getUserTypeIcon = (userType) => {
    switch (userType) {
      case 'admin': return <AdminIcon />;
      case 'agent': return <BusinessIcon />;
      case 'user': return <UserIcon />;
      case 'system': return <SettingsIcon />;
      default: return <PersonIcon />;
    }
  };

  const handleExportLogs = (format) => {
    // In a real app, this would export the filtered logs
    console.log(`Exporting ${filteredLogs.length} logs in ${format} format`);
  };

  const handleRealTimeToggle = () => {
    setRealTimeMonitoring(!realTimeMonitoring);
    // In a real app, this would start/stop real-time monitoring
    console.log(`Real-time monitoring ${!realTimeMonitoring ? 'enabled' : 'disabled'}`);
  };

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>Audit Logs & Monitoring</Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive tracking of system activities and security events
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchAuditLogs}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => handleExportLogs('csv')}
          >
            Export Logs
          </Button>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Logs
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {stats.totalLogs}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <HistoryIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Critical Events
                  </Typography>
                  <Typography variant="h4" color="error">
                    {stats.criticalEvents}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <ErrorIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Security Events
                  </Typography>
                  <Typography variant="h4" color="warning">
                    {stats.securityEvents}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <SecurityIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    User Actions
                  </Typography>
                  <Typography variant="h4" color="info">
                    {stats.userActions}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <UserIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    System Events
                  </Typography>
                  <Typography variant="h4" color="success">
                    {stats.systemEvents}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <SettingsIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Controls */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Action Type</InputLabel>
                <Select
                  value={filters.actionType}
                  onChange={(e) => setFilters({ ...filters, actionType: e.target.value })}
                  label="Action Type"
                >
                  <MenuItem value="all">All Actions</MenuItem>
                  <MenuItem value="USER_LOGIN">User Login</MenuItem>
                  <MenuItem value="PROPERTY_CREATED">Property Created</MenuItem>
                  <MenuItem value="ADMIN_SETTINGS_CHANGED">Admin Settings</MenuItem>
                  <MenuItem value="SECURITY_VIOLATION">Security Violation</MenuItem>
                  <MenuItem value="USER_SUBSCRIPTION_UPDATED">Subscription Update</MenuItem>
                  <MenuItem value="SYSTEM_BACKUP">System Backup</MenuItem>
                  <MenuItem value="AGENT_VERIFIED">Agent Verification</MenuItem>
                  <MenuItem value="PAYMENT_PROCESSED">Payment Processed</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filters.severity}
                  onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                  label="Severity"
                >
                  <MenuItem value="all">All Severities</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                  <MenuItem value="warning">Warning</MenuItem>
                  <MenuItem value="info">Info</MenuItem>
                  <MenuItem value="success">Success</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>User Type</InputLabel>
                <Select
                  value={filters.userType}
                  onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                  label="User Type"
                >
                  <MenuItem value="all">All Users</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="agent">Agent</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Date Range</InputLabel>
                <Select
                  value={filters.dateRange}
                  onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                  label="Date Range"
                >
                  <MenuItem value="1day">Last 24 Hours</MenuItem>
                  <MenuItem value="7days">Last 7 Days</MenuItem>
                  <MenuItem value="30days">Last 30 Days</MenuItem>
                  <MenuItem value="all">All Time</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                placeholder="Search logs..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>

            <Grid item xs={12} md={1}>
              <FormControlLabel
                control={
                  <Switch
                    checked={realTimeMonitoring}
                    onChange={handleRealTimeToggle}
                    color="primary"
                  />
                }
                label="Real-time"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="All Logs" />
          <Tab label="Security Events" />
          <Tab label="User Activities" />
          <Tab label="System Events" />
        </Tabs>
      </Box>

      {/* Logs Table */}
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getActionIcon(log.action)}
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {log.action.replace(/_/g, ' ')}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {log.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        {getUserTypeIcon(log.userType)}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="body2" noWrap>
                            {log.userName}
                          </Typography>
                          <Chip 
                            label={log.userType} 
                            size="small" 
                            variant="outlined"
                          />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getSeverityIcon(log.severity)}
                        label={log.severity}
                        color={getSeverityColor(log.severity)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {log.ipAddress}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {log.location}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap>
                        {formatTimestamp(log.timestamp)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedLog(log);
                            setLogDialogOpen(true);
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Log Details Dialog */}
      <Dialog open={logDialogOpen} onClose={() => setLogDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            {selectedLog && getActionIcon(selectedLog.action)}
            <Typography variant="h6" sx={{ ml: 1 }}>
              Log Details
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedLog && (
            <Box>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Basic Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="Action"
                        secondary={selectedLog.action.replace(/_/g, ' ')}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Description"
                        secondary={selectedLog.description}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Timestamp"
                        secondary={selectedLog.timestamp.toLocaleString()}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Severity"
                        secondary={
                          <Chip
                            icon={getSeverityIcon(selectedLog.severity)}
                            label={selectedLog.severity}
                            color={getSeverityColor(selectedLog.severity)}
                            size="small"
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>User Information</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="User ID"
                        secondary={selectedLog.userId}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="User Name"
                        secondary={selectedLog.userName}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="User Type"
                        secondary={
                          <Chip
                            icon={getUserTypeIcon(selectedLog.userType)}
                            label={selectedLog.userType}
                            size="small"
                            variant="outlined"
                          />
                        }
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Technical Details</Typography>
                  <List dense>
                    <ListItem>
                      <ListItemText
                        primary="IP Address"
                        secondary={selectedLog.ipAddress}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="User Agent"
                        secondary={selectedLog.userAgent}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Location"
                        secondary={selectedLog.location}
                      />
                    </ListItem>
                  </List>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Additional Details</Typography>
                  <List dense>
                    {Object.entries(selectedLog.details || {}).map(([key, value]) => (
                      <ListItem key={key}>
                        <ListItemText
                          primary={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          secondary={String(value)}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>

                {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" gutterBottom>Metadata</Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Grid container spacing={2}>
                        {Object.entries(selectedLog.metadata).map(([key, value]) => (
                          <Grid item xs={12} sm={6} md={4} key={key}>
                            <Typography variant="caption" color="textSecondary">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </Typography>
                            <Typography variant="body2">
                              {String(value)}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Paper>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLogDialogOpen(false)}>Close</Button>
          <Button variant="outlined" startIcon={<PrintIcon />}>
            Print
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Export
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminAuditLogs;