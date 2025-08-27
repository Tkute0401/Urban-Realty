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
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Visibility,
  VisibilityOff,
  Refresh,
  Download,
  Api,
  Security,
  Speed,
  Timeline,
  Code,
  Key,
  Lock,
  Public,
  Settings,
  Analytics,
  BugReport
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

const AdminAPIManagement = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [apiKeys, setApiKeys] = useState([]);
  const [endpoints, setEndpoints] = useState([]);
  const [usage, setUsage] = useState({});
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [newKey, setNewKey] = useState({
    name: '',
    description: '',
    permissions: [],
    rateLimit: 1000,
    expiresAt: ''
  });

  useEffect(() => {
    fetchAPIData();
  }, []);

  const fetchAPIData = async () => {
    try {
      const [keysResponse, endpointsResponse, usageResponse] = await Promise.all([
        axios.get('/admin/api/keys'),
        axios.get('/admin/api/endpoints'),
        axios.get('/admin/api/usage')
      ]);

      if (keysResponse.data.success) {
        setApiKeys(keysResponse.data.data);
      }
      if (endpointsResponse.data.success) {
        setEndpoints(endpointsResponse.data.data);
      }
      if (usageResponse.data.success) {
        setUsage(usageResponse.data.data);
      }
    } catch (err) {
      console.error('Error fetching API data:', err);
      setError('Failed to load API data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async () => {
    try {
      const response = await axios.post('/admin/api/keys', newKey);
      if (response.data.success) {
        setApiKeys([...apiKeys, response.data.data]);
        setCreateDialog(false);
        setNewKey({
          name: '',
          description: '',
          permissions: [],
          rateLimit: 1000,
          expiresAt: ''
        });
      }
    } catch (err) {
      console.error('Error creating API key:', err);
      setError('Failed to create API key');
    }
  };

  const handleDeleteKey = async (keyId) => {
    try {
      await axios.delete(`/admin/api/keys/${keyId}`);
      setApiKeys(apiKeys.filter(key => key.id !== keyId));
    } catch (err) {
      console.error('Error deleting API key:', err);
      setError('Failed to delete API key');
    }
  };

  const handleToggleKeyStatus = async (keyId, active) => {
    try {
      const response = await axios.put(`/admin/api/keys/${keyId}`, { active });
      if (response.data.success) {
        setApiKeys(apiKeys.map(key => 
          key.id === keyId ? { ...key, active } : key
        ));
      }
    } catch (err) {
      console.error('Error updating API key:', err);
      setError('Failed to update API key');
    }
  };

  const permissions = [
    { value: 'read', label: 'Read Access' },
    { value: 'write', label: 'Write Access' },
    { value: 'delete', label: 'Delete Access' },
    { value: 'admin', label: 'Admin Access' }
  ];

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
        <Typography variant="h4">API Management</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchAPIData}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setCreateDialog(true)}
          >
            Create API Key
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* API Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Key sx={{ mr: 1 }} />
                <Typography variant="h6">Active Keys</Typography>
              </Box>
              <Typography variant="h3">{apiKeys.filter(k => k.active).length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total: {apiKeys.length}
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
                <Api sx={{ mr: 1 }} />
                <Typography variant="h6">Endpoints</Typography>
              </Box>
              <Typography variant="h3">{endpoints.length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Available APIs
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
                <Speed sx={{ mr: 1 }} />
                <Typography variant="h6">Requests</Typography>
              </Box>
              <Typography variant="h3">{usage.totalRequests || 0}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Today
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
                <Security sx={{ mr: 1 }} />
                <Typography variant="h6">Success Rate</Typography>
              </Box>
              <Typography variant="h3">{usage.successRate || 0}%</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                API calls
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="API Keys" icon={<Key />} />
          <Tab label="Endpoints" icon={<Api />} />
          <Tab label="Usage Analytics" icon={<Analytics />} />
          <Tab label="Rate Limiting" icon={<Speed />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>API Keys Management</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Key</TableCell>
                      <TableCell>Permissions</TableCell>
                      <TableCell>Rate Limit</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {apiKeys.map((key) => (
                      <TableRow key={key.id}>
                        <TableCell>{key.name}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {key.key.substring(0, 20)}...
                            </Typography>
                            <Tooltip title="Show/Hide Key">
                              <IconButton size="small">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {key.permissions.map((perm) => (
                              <Chip 
                                key={perm} 
                                label={perm} 
                                size="small" 
                                color="primary" 
                                variant="outlined"
                              />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>{key.rateLimit}/hour</TableCell>
                        <TableCell>
                          <Chip 
                            label={key.active ? 'Active' : 'Inactive'} 
                            color={key.active ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Box>
                            <Tooltip title="Toggle Status">
                              <Switch
                                checked={key.active}
                                onChange={(e) => handleToggleKeyStatus(key.id, e.target.checked)}
                                size="small"
                              />
                            </Tooltip>
                            <Tooltip title="Delete Key">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteKey(key.id)}
                                color="error"
                              >
                                <Delete />
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

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>API Endpoints</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Endpoint</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Response Time</TableCell>
                      <TableCell>Requests Today</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {endpoints.map((endpoint) => (
                      <TableRow key={endpoint.id}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {endpoint.path}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={endpoint.method} 
                            color={
                              endpoint.method === 'GET' ? 'success' :
                              endpoint.method === 'POST' ? 'primary' :
                              endpoint.method === 'PUT' ? 'warning' :
                              'error'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={endpoint.status} 
                            color={endpoint.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{endpoint.responseTime}ms</TableCell>
                        <TableCell>{endpoint.requestsToday}</TableCell>
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
              <Typography variant="h6" gutterBottom>Usage Analytics</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>API Requests Over Time</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={usage.requestHistory || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Response Times</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={usage.responseTimes || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="endpoint" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="time" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Rate Limiting Configuration</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Global Rate Limits</Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Default Rate Limit"
                            secondary="1000 requests per hour"
                          />
                          <ListItemSecondaryAction>
                            <Button size="small">Edit</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText
                            primary="Burst Limit"
                            secondary="100 requests per minute"
                          />
                          <ListItemSecondaryAction>
                            <Button size="small">Edit</Button>
                          </ListItemSecondaryAction>
                        </ListItem>
                        <Divider />
                        <ListItem>
                          <ListItemText
                            primary="IP-based Limits"
                            secondary="Enabled"
                          />
                          <ListItemSecondaryAction>
                            <Switch defaultChecked />
                          </ListItemSecondaryAction>
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Rate Limit Violations</Typography>
                      <List>
                        {usage.violations?.map((violation, index) => (
                          <ListItem key={index} divider>
                            <ListItemText
                              primary={violation.ip}
                              secondary={`${violation.endpoint} - ${new Date(violation.timestamp).toLocaleString()}`}
                            />
                            <Chip label={violation.type} color="error" size="small" />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Create API Key Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New API Key</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Key Name"
              value={newKey.name}
              onChange={(e) => setNewKey(prev => ({ ...prev, name: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Description"
              value={newKey.description}
              onChange={(e) => setNewKey(prev => ({ ...prev, description: e.target.value }))}
              margin="normal"
              multiline
              rows={2}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Permissions</InputLabel>
              <Select
                multiple
                value={newKey.permissions}
                onChange={(e) => setNewKey(prev => ({ ...prev, permissions: e.target.value }))}
              >
                {permissions.map((perm) => (
                  <MenuItem key={perm.value} value={perm.value}>
                    {perm.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Rate Limit (requests per hour)"
              type="number"
              value={newKey.rateLimit}
              onChange={(e) => setNewKey(prev => ({ ...prev, rateLimit: parseInt(e.target.value) }))}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Expires At"
              type="datetime-local"
              value={newKey.expiresAt}
              onChange={(e) => setNewKey(prev => ({ ...prev, expiresAt: e.target.value }))}
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateKey} variant="contained">Create Key</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminAPIManagement;