import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
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
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Visibility as ViewIcon,
  Block as BlockIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Computer as ComputerIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Shield as ShieldIcon,
  Lock as LockIcon,
  VpnKey as KeyIcon,
  NetworkCheck as NetworkIcon,
  BugReport as BugIcon,
  SecurityUpdate as SecurityUpdateIcon,
  Report as ReportIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import axios from '../../services/axios';

const AdminSecurity = () => {
  const [securityData, setSecurityData] = useState({
    overview: {
      totalViolations: 0,
      criticalAlerts: 0,
      blockedUsers: 0,
      securityScore: 0,
      lastIncident: null,
      threatLevel: 'low'
    },
    violations: [],
    alerts: [],
    blockedUsers: [],
    securityEvents: [],
    threatIndicators: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedViolation, setSelectedViolation] = useState(null);
  const [violationDialogOpen, setViolationDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      setLoading(true);
      // In a real app, you'd fetch from security endpoints
      // For now, using mock data
      setSecurityData({
        overview: {
          totalViolations: 15,
          criticalAlerts: 3,
          blockedUsers: 8,
          securityScore: 85,
          lastIncident: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          threatLevel: 'medium'
        },
        violations: [
          {
            id: 1,
            user: { name: 'John Doe', email: 'john@example.com' },
            type: 'Unauthorized Access',
            resource: '/admin/users',
            severity: 'high',
            status: 'pending',
            timestamp: new Date(Date.now() - 30 * 60 * 1000),
            ipAddress: '192.168.1.100',
            userAgent: 'Mozilla/5.0...',
            location: 'New York, US'
          },
          {
            id: 2,
            user: { name: 'Jane Smith', email: 'jane@example.com' },
            type: 'Suspicious Activity',
            resource: '/api/properties',
            severity: 'medium',
            status: 'resolved',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            ipAddress: '192.168.1.101',
            userAgent: 'Mozilla/5.0...',
            location: 'Los Angeles, US'
          }
        ],
        alerts: [
          {
            id: 1,
            type: 'Multiple Failed Logins',
            severity: 'high',
            description: 'User account locked due to multiple failed login attempts',
            timestamp: new Date(Date.now() - 15 * 60 * 1000),
            status: 'active'
          },
          {
            id: 2,
            type: 'Suspicious IP Activity',
            severity: 'medium',
            description: 'Unusual activity detected from IP address 192.168.1.100',
            timestamp: new Date(Date.now() - 45 * 60 * 1000),
            status: 'investigating'
          }
        ],
        blockedUsers: [
          {
            id: 1,
            name: 'Unknown User',
            email: 'suspicious@example.com',
            reason: 'Multiple failed login attempts',
            blockedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
            ipAddress: '192.168.1.102'
          }
        ],
        securityEvents: [
          {
            id: 1,
            type: 'User Login',
            user: 'admin@example.com',
            timestamp: new Date(Date.now() - 5 * 60 * 1000),
            ipAddress: '192.168.1.50',
            status: 'success'
          },
          {
            id: 2,
            type: 'File Upload',
            user: 'agent@example.com',
            timestamp: new Date(Date.now() - 10 * 60 * 1000),
            ipAddress: '192.168.1.51',
            status: 'success'
          }
        ],
        threatIndicators: [
          {
            id: 1,
            type: 'Brute Force Attack',
            severity: 'high',
            description: 'Multiple failed login attempts from single IP',
            timestamp: new Date(Date.now() - 20 * 60 * 1000),
            status: 'active'
          }
        ]
      });
    } catch (err) {
      console.error('Error fetching security data:', err);
      setError('Failed to load security data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleViolationAction = async (violationId, action) => {
    try {
      await axios.put(`/admin/access-violations/${violationId}`, {
        action: action
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchSecurityData();
      setViolationDialogOpen(false);
      setSelectedViolation(null);
    } catch (err) {
      console.error('Error handling violation:', err);
      setError('Failed to handle violation. Please try again.');
    }
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'error';
      case 'critical': return 'error';
      default: return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'error';
      case 'investigating': return 'warning';
      case 'resolved': return 'success';
      case 'pending': return 'info';
      default: return 'default';
    }
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
          <Typography variant="h4" gutterBottom>Security Monitoring</Typography>
          <Typography variant="body2" color="text.secondary">
            Monitor and manage security threats and access violations
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchSecurityData}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            color="primary"
          >
            Export Report
          </Button>
        </Box>
      </Box>

      {/* Security Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Security Score
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {securityData.overview.securityScore}/100
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Overall security rating
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <ShieldIcon />
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
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Threat Level
                  </Typography>
                  <Typography variant="h4" color={getThreatLevelColor(securityData.overview.threatLevel)}>
                    {securityData.overview.threatLevel.charAt(0).toUpperCase() + securityData.overview.threatLevel.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Current threat assessment
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: getThreatLevelColor(securityData.overview.threatLevel) }}>
                  <WarningIcon />
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
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Active Violations
                  </Typography>
                  <Typography variant="h4" color="error">
                    {securityData.overview.totalViolations}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Pending resolution
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <ErrorIcon />
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
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Blocked Users
                  </Typography>
                  <Typography variant="h4" color="warning">
                    {securityData.overview.blockedUsers}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Temporarily blocked
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <BlockIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Security Alerts */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ mr: 1 }} />
            Active Security Alerts
          </Typography>
          <Grid container spacing={2}>
            {securityData.alerts.map((alert) => (
              <Grid item xs={12} md={6} key={alert.id}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {alert.type}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {alert.description}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {alert.timestamp.toLocaleString()}
                      </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                      <Chip 
                        label={alert.severity} 
                        color={getSeverityColor(alert.severity)}
                        size="small"
                      />
                      <Chip 
                        label={alert.status} 
                        color={getStatusColor(alert.status)}
                        size="small"
                      />
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Access Violations Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <SecurityIcon sx={{ mr: 1 }} />
              Access Violations
            </Typography>
            <Box display="flex" gap={2}>
              <TextField
                size="small"
                placeholder="Search violations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
              <FormControl size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="investigating">Investigating</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </FormControl>
              <FormControl size="small">
                <InputLabel>Severity</InputLabel>
                <Select
                  value={filterSeverity}
                  onChange={(e) => setFilterSeverity(e.target.value)}
                  label="Severity"
                >
                  <MenuItem value="all">All Severities</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Violation Type</TableCell>
                  <TableCell>Resource</TableCell>
                  <TableCell>Severity</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {securityData.violations
                  .filter(violation => {
                    const matchesSearch = violation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                         violation.type.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchesStatus = filterStatus === 'all' || violation.status === filterStatus;
                    const matchesSeverity = filterSeverity === 'all' || violation.severity === filterSeverity;
                    return matchesSearch && matchesStatus && matchesSeverity;
                  })
                  .map((violation) => (
                    <TableRow key={violation.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                            {violation.user.name.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{violation.user.name}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {violation.user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{violation.type}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="textSecondary">
                          {violation.resource}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={violation.severity} 
                          color={getSeverityColor(violation.severity)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={violation.status} 
                          color={getStatusColor(violation.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {violation.timestamp.toLocaleString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small" 
                              onClick={() => {
                                setSelectedViolation(violation);
                                setViolationDialogOpen(true);
                              }}
                            >
                              <ViewIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Block User">
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => handleViolationAction(violation.id, 'block')}
                            >
                              <BlockIcon />
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

      {/* Security Timeline */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TimelineIcon sx={{ mr: 1 }} />
                Recent Security Events
              </Typography>
              <Timeline>
                {securityData.securityEvents.slice(0, 5).map((event) => (
                  <TimelineItem key={event.id}>
                    <TimelineOppositeContent>
                      <Typography variant="caption" color="textSecondary">
                        {event.timestamp.toLocaleTimeString()}
                      </Typography>
                    </TimelineOppositeContent>
                    <TimelineSeparator>
                      <TimelineDot color={event.status === 'success' ? 'success' : 'error'} />
                      <TimelineConnector />
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2">
                        {event.type} by {event.user}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        IP: {event.ipAddress}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <BugIcon sx={{ mr: 1 }} />
                Threat Indicators
              </Typography>
              <List dense>
                {securityData.threatIndicators.map((threat) => (
                  <ListItem key={threat.id}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: getSeverityColor(threat.severity) }}>
                        <WarningIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={threat.type}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="textSecondary">
                            {threat.description}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {threat.timestamp.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                    <Chip 
                      label={threat.status} 
                      color={getStatusColor(threat.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Violation Details Dialog */}
      <Dialog open={violationDialogOpen} onClose={() => setViolationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Violation Details</DialogTitle>
        <DialogContent>
          {selectedViolation && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>User Information</Typography>
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>{selectedViolation.user.name.charAt(0)}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={selectedViolation.user.name}
                      secondary={selectedViolation.user.email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <LocationIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={selectedViolation.ipAddress}
                      secondary={selectedViolation.location}
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Violation Details</Typography>
                <List dense>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'error.main' }}>
                        <SecurityIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={selectedViolation.type}
                      secondary={selectedViolation.resource}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'warning.main' }}>
                        <ScheduleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={selectedViolation.timestamp.toLocaleString()}
                      secondary="Occurrence Time"
                    />
                  </ListItem>
                </List>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Technical Details</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>User Agent:</strong> {selectedViolation.userAgent}
                  </Typography>
                  <Typography variant="body2">
                    <strong>IP Address:</strong> {selectedViolation.ipAddress}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViolationDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            color="warning"
            onClick={() => handleViolationAction(selectedViolation?.id, 'warn')}
          >
            Send Warning
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={() => handleViolationAction(selectedViolation?.id, 'block')}
          >
            Block User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminSecurity;