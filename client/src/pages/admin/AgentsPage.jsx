// src/pages/admin/AgentsPage.jsx
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
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  InputAdornment,
  Pagination,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Badge,
  LinearProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  CheckCircle as VerifyIcon,
  Warning as PendingIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as MoneyIcon,
  Home as HomeIcon,
  Security as SecurityIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import axios from '../../services/axios';

const AgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterVerification, setFilterVerification] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [agentsPerPage] = useState(10);
  const [editingAgent, setEditingAgent] = useState({});

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/admin/agents', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.data.success) {
        setAgents(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
      setError('Failed to load agents. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditAgent = async () => {
    try {
      await axios.put(`/admin/agents/${editingAgent._id}`, editingAgent, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchAgents();
      setEditDialogOpen(false);
      setEditingAgent({});
    } catch (err) {
      console.error('Error updating agent:', err);
      setError('Failed to update agent. Please try again.');
    }
  };

  const handleDeleteAgent = async () => {
    try {
      await axios.delete(`/admin/agents/${selectedAgent._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchAgents();
      setDeleteDialogOpen(false);
      setSelectedAgent(null);
    } catch (err) {
      console.error('Error deleting agent:', err);
      setError('Failed to delete agent. Please try again.');
    }
  };

  const handleVerifyAgent = async (agentId) => {
    try {
      await axios.put(`/admin/agents/${agentId}/verify`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchAgents();
    } catch (err) {
      console.error('Error verifying agent:', err);
      setError('Failed to verify agent. Please try again.');
    }
  };

  const handleStatusChange = async (agentId, status) => {
    try {
      await axios.put(`/admin/agents/${agentId}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      fetchAgents();
    } catch (err) {
      console.error('Error updating agent status:', err);
      setError('Failed to update agent status. Please try again.');
    }
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    const matchesVerification = filterVerification === 'all' || 
                               (filterVerification === 'verified' && agent.verified) ||
                               (filterVerification === 'pending' && !agent.verified);
    const matchesPerformance = filterPerformance === 'all' || 
                              (filterPerformance === 'high' && agent.performanceScore >= 80) ||
                              (filterPerformance === 'medium' && agent.performanceScore >= 60 && agent.performanceScore < 80) ||
                              (filterPerformance === 'low' && agent.performanceScore < 60);
    
    return matchesSearch && matchesStatus && matchesVerification && matchesPerformance;
  });

  const indexOfLastAgent = currentPage * agentsPerPage;
  const indexOfFirstAgent = indexOfLastAgent - agentsPerPage;
  const currentAgents = filteredAgents.slice(indexOfFirstAgent, indexOfLastAgent);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'suspended': return 'warning';
      default: return 'default';
    }
  };

  const getVerificationColor = (verified) => {
    return verified ? 'success' : 'warning';
  };

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  const getPerformanceLabel = (score) => {
    if (score >= 80) return 'High';
    if (score >= 60) return 'Medium';
    return 'Low';
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
          <Typography variant="h4" gutterBottom>Agent Management</Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and monitor your real estate agents
          </Typography>
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mr: 1 }}
          >
            Add New Agent
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
          >
            Export Agents
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Agents
                  </Typography>
                  <Typography variant="h4">{agents.length}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Registered agents
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
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
                    Verified Agents
                  </Typography>
                  <Typography variant="h4">
                    {agents.filter(agent => agent.verified).length}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {Math.round((agents.filter(agent => agent.verified).length / agents.length) * 100)}% verified
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <VerifyIcon />
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
                    Active Listings
                  </Typography>
                  <Typography variant="h4">
                    {agents.reduce((total, agent) => total + (agent.activeListings || 0), 0)}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Total properties
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <HomeIcon />
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
                    Avg Performance
                  </Typography>
                  <Typography variant="h4">
                    {Math.round(agents.reduce((total, agent) => total + (agent.performanceScore || 0), 0) / agents.length)}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Performance score
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <AssessmentIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Verification</InputLabel>
                <Select
                  value={filterVerification}
                  onChange={(e) => setFilterVerification(e.target.value)}
                  label="Verification"
                >
                  <MenuItem value="all">All Agents</MenuItem>
                  <MenuItem value="verified">Verified</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Performance</InputLabel>
                <Select
                  value={filterPerformance}
                  onChange={(e) => setFilterPerformance(e.target.value)}
                  label="Performance"
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="high">High (80%+)</MenuItem>
                  <MenuItem value="medium">Medium (60-79%)</MenuItem>
                  <MenuItem value="low">Low (<60%)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchAgents}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Agent</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Performance</TableCell>
              <TableCell>Verification</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Listings</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentAgents.map((agent) => (
              <TableRow key={agent._id} hover>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      {agent.name?.charAt(0) || agent.email?.charAt(0) || 'A'}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">{agent.name || 'No Name'}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {agent.email}
                      </Typography>
                      {agent.phone && (
                        <Typography variant="caption" color="textSecondary">
                          📞 {agent.phone}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={agent.specialization || 'General'} 
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2" color={getPerformanceColor(agent.performanceScore || 0)}>
                      {agent.performanceScore || 0}%
                    </Typography>
                    <Chip 
                      label={getPerformanceLabel(agent.performanceScore || 0)} 
                      color={getPerformanceColor(agent.performanceScore || 0)}
                      size="small"
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={agent.verified ? 'Verified' : 'Pending'} 
                    color={getVerificationColor(agent.verified)}
                    size="small"
                    icon={agent.verified ? <VerifyIcon /> : <PendingIcon />}
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={agent.status || 'active'} 
                    color={getStatusColor(agent.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="body2">
                      {agent.activeListings || 0} active
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {agent.totalListings || 0} total
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Tooltip title="View Details">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setSelectedAgent(agent);
                          setViewDialogOpen(true);
                        }}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit Agent">
                      <IconButton 
                        size="small" 
                        onClick={() => {
                          setEditingAgent(agent);
                          setEditDialogOpen(true);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    {!agent.verified && (
                      <Tooltip title="Verify Agent">
                        <IconButton 
                          size="small" 
                          color="success"
                          onClick={() => handleVerifyAgent(agent._id)}
                        >
                          <VerifyIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Delete Agent">
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => {
                          setSelectedAgent(agent);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredAgents.length / agentsPerPage)}
          page={currentPage}
          onChange={(e, page) => setCurrentPage(page)}
          color="primary"
        />
      </Box>

      {/* View Agent Dialog */}
      <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Agent Details</DialogTitle>
        <DialogContent>
          {selectedAgent && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Personal Information</Typography>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            {selectedAgent.name?.charAt(0) || selectedAgent.email?.charAt(0) || 'A'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedAgent.name || 'No Name'}
                          secondary="Full Name"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <EmailIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedAgent.email}
                          secondary="Email Address"
                        />
                      </ListItem>
                      {selectedAgent.phone && (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.main' }}>
                              <PhoneIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={selectedAgent.phone}
                            secondary="Phone Number"
                          />
                        </ListItem>
                      )}
                      {selectedAgent.location && (
                        <ListItem>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'info.main' }}>
                              <LocationIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={selectedAgent.location}
                            secondary="Location"
                          />
                        </ListItem>
                      )}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Professional Details</Typography>
                    <List>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'warning.main' }}>
                            <BusinessIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedAgent.specialization || 'General'}
                          secondary="Specialization"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <AssessmentIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${selectedAgent.performanceScore || 0}%`}
                          secondary="Performance Score"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'info.main' }}>
                            <CalendarIcon />
                          </Avatar>
                        </ListItemText>
                        <ListItemText
                          primary={new Date(selectedAgent.createdAt).toLocaleDateString()}
                          secondary="Member Since"
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getVerificationColor(selectedAgent.verified) }}>
                            {selectedAgent.verified ? <VerifyIcon /> : <PendingIcon />}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={selectedAgent.verified ? 'Verified' : 'Pending Verification'}
                          secondary="Verification Status"
                        />
                      </ListItem>
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>Performance Metrics</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="primary">
                            {selectedAgent.activeListings || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Active Listings
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="success">
                            {selectedAgent.totalSales || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Total Sales
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="warning">
                            {selectedAgent.avgDaysOnMarket || 0}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Avg Days on Market
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setViewDialogOpen(false);
              setEditingAgent(selectedAgent);
              setEditDialogOpen(true);
            }}
          >
            Edit Agent
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Agent Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Agent</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={editingAgent.name || ''}
                onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                value={editingAgent.email || ''}
                onChange={(e) => setEditingAgent({ ...editingAgent, email: e.target.value })}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={editingAgent.phone || ''}
                onChange={(e) => setEditingAgent({ ...editingAgent, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specialization"
                value={editingAgent.specialization || ''}
                onChange={(e) => setEditingAgent({ ...editingAgent, specialization: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={editingAgent.status || 'active'}
                  onChange={(e) => setEditingAgent({ ...editingAgent, status: e.target.value })}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Performance Score</InputLabel>
                <Select
                  value={editingAgent.performanceScore || 0}
                  onChange={(e) => setEditingAgent({ ...editingAgent, performanceScore: e.target.value })}
                  label="Performance Score"
                >
                  <MenuItem value={0}>0%</MenuItem>
                  <MenuItem value={25}>25%</MenuItem>
                  <MenuItem value={50}>50%</MenuItem>
                  <MenuItem value={75}>75%</MenuItem>
                  <MenuItem value={100}>100%</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={editingAgent.verified || false}
                    onChange={(e) => setEditingAgent({ ...editingAgent, verified: e.target.checked })}
                  />
                }
                label="Verified Agent"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditAgent}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete agent "{selectedAgent?.name || selectedAgent?.email}"? 
            This action cannot be undone and will remove all associated listings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteAgent}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentsPage;