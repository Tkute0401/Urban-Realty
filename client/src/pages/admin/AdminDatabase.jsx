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
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Add,
  Delete,
  Edit,
  Visibility,
  Refresh,
  Download,
  Upload,
  Database,
  Storage,
  Speed,
  Timeline,
  Code,
  Security,
  Settings,
  Analytics,
  BugReport,
  ExpandMore,
  PlayArrow,
  Stop,
  Backup,
  Restore,
  Optimize,
  Monitor
} from '@mui/icons-material';
import { LinearProgress } from '@mui/material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import axios from '../../services/axios';

const AdminDatabase = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [dbStats, setDbStats] = useState({});
  const [collections, setCollections] = useState([]);
  const [queries, setQueries] = useState([]);
  const [backups, setBackups] = useState([]);
  const [queryDialog, setQueryDialog] = useState(false);
  const [backupDialog, setBackupDialog] = useState(false);
  const [query, setQuery] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const fetchDatabaseData = async () => {
    try {
      const [statsResponse, collectionsResponse, queriesResponse, backupsResponse] = await Promise.all([
        axios.get('/admin/database/stats'),
        axios.get('/admin/database/collections'),
        axios.get('/admin/database/queries'),
        axios.get('/admin/database/backups')
      ]);

      if (statsResponse.data.success) {
        setDbStats(statsResponse.data.data);
      }
      if (collectionsResponse.data.success) {
        setCollections(collectionsResponse.data.data);
      }
      if (queriesResponse.data.success) {
        setQueries(queriesResponse.data.data);
      }
      if (backupsResponse.data.success) {
        setBackups(backupsResponse.data.data);
      }
    } catch (err) {
      console.error('Error fetching database data:', err);
      setError('Failed to load database data');
    } finally {
      setLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!query.trim()) return;

    setExecuting(true);
    try {
      const response = await axios.post('/admin/database/query', { query });
      if (response.data.success) {
        setQueryResult(response.data.data);
      }
    } catch (err) {
      console.error('Error executing query:', err);
      setError('Failed to execute query');
    } finally {
      setExecuting(false);
    }
  };

  const createBackup = async () => {
    try {
      const response = await axios.post('/admin/database/backup');
      if (response.data.success) {
        setBackups([...backups, response.data.data]);
        setBackupDialog(false);
      }
    } catch (err) {
      console.error('Error creating backup:', err);
      setError('Failed to create backup');
    }
  };

  const restoreBackup = async (backupId) => {
    try {
      const response = await axios.post(`/admin/database/restore/${backupId}`);
      if (response.data.success) {
        fetchDatabaseData();
      }
    } catch (err) {
      console.error('Error restoring backup:', err);
      setError('Failed to restore backup');
    }
  };

  const optimizeDatabase = async () => {
    try {
      const response = await axios.post('/admin/database/optimize');
      if (response.data.success) {
        fetchDatabaseData();
      }
    } catch (err) {
      console.error('Error optimizing database:', err);
      setError('Failed to optimize database');
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
        <Typography variant="h4">Database Management</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchDatabaseData}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="outlined"
            startIcon={<Backup />}
            onClick={() => setBackupDialog(true)}
            sx={{ mr: 1 }}
          >
            Create Backup
          </Button>
          <Button
            variant="contained"
            startIcon={<Optimize />}
            onClick={optimizeDatabase}
          >
            Optimize DB
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Database Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Database sx={{ mr: 1 }} />
                <Typography variant="h6">Database Size</Typography>
              </Box>
              <Typography variant="h3">{dbStats.size || '0'} MB</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total storage used
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
                <Storage sx={{ mr: 1 }} />
                <Typography variant="h6">Collections</Typography>
              </Box>
              <Typography variant="h3">{collections.length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total collections
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
                <Typography variant="h6">Queries/sec</Typography>
              </Box>
              <Typography variant="h3">{dbStats.queriesPerSecond || 0}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Average performance
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
                <Backup sx={{ mr: 1 }} />
                <Typography variant="h6">Backups</Typography>
              </Box>
              <Typography variant="h3">{backups.length}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Available backups
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Main Content */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Collections" icon={<Storage />} />
          <Tab label="Query Console" icon={<Code />} />
          <Tab label="Performance" icon={<Speed />} />
          <Tab label="Backups" icon={<Backup />} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>Database Collections</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Collection Name</TableCell>
                      <TableCell>Documents</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Indexes</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {collections.map((collection) => (
                      <TableRow key={collection.name}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {collection.name}
                          </Typography>
                        </TableCell>
                        <TableCell>{collection.documents.toLocaleString()}</TableCell>
                        <TableCell>{collection.size} MB</TableCell>
                        <TableCell>{collection.indexes}</TableCell>
                        <TableCell>
                          <Chip 
                            label={collection.status} 
                            color={collection.status === 'active' ? 'success' : 'default'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Collection">
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

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>Query Console</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Execute Query</Typography>
                      <TextField
                        fullWidth
                        multiline
                        rows={8}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter your MongoDB query here..."
                        sx={{ fontFamily: 'monospace' }}
                      />
                      <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                        <Button
                          variant="contained"
                          startIcon={<PlayArrow />}
                          onClick={executeQuery}
                          disabled={executing || !query.trim()}
                        >
                          {executing ? 'Executing...' : 'Execute'}
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => setQuery('')}
                        >
                          Clear
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Query Result</Typography>
                      {queryResult ? (
                        <Box sx={{ 
                          maxHeight: 400, 
                          overflow: 'auto',
                          bgcolor: 'grey.100',
                          p: 2,
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '0.875rem'
                        }}>
                          <pre>{JSON.stringify(queryResult, null, 2)}</pre>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Execute a query to see results here
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Recent Queries */}
              <Card sx={{ mt: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Recent Queries</Typography>
                  <List>
                    {queries.slice(0, 5).map((query, index) => (
                      <ListItem key={index} divider>
                        <ListItemText
                          primary={query.query}
                          secondary={`${query.executionTime}ms - ${new Date(query.timestamp).toLocaleString()}`}
                        />
                        <Chip 
                          label={query.status} 
                          color={query.status === 'success' ? 'success' : 'error'}
                          size="small"
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>Database Performance</Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Query Performance Over Time</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dbStats.performanceHistory || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="executionTime" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Collection Sizes</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={collections}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="size" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Performance Metrics */}
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Slow Queries</Typography>
                      <List>
                        {dbStats.slowQueries?.map((query, index) => (
                          <ListItem key={index} divider>
                            <ListItemText
                              primary={query.query}
                              secondary={`${query.executionTime}ms - ${new Date(query.timestamp).toLocaleString()}`}
                            />
                            <Chip label="Slow" color="warning" size="small" />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Index Usage</Typography>
                      <List>
                        {dbStats.indexUsage?.map((index, indexKey) => (
                          <ListItem key={indexKey} divider>
                            <ListItemText
                              primary={index.name}
                              secondary={`${index.usage}% usage`}
                            />
                            <LinearProgress 
                              variant="determinate" 
                              value={index.usage} 
                              sx={{ width: 100 }}
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

          {activeTab === 3 && (
            <Box>
              <Typography variant="h6" gutterBottom>Database Backups</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Backup Name</TableCell>
                      <TableCell>Size</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell>{backup.name}</TableCell>
                        <TableCell>{backup.size} MB</TableCell>
                        <TableCell>{new Date(backup.createdAt).toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={backup.status} 
                            color={backup.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Tooltip title="Download Backup">
                              <IconButton size="small">
                                <Download />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Restore Backup">
                              <IconButton 
                                size="small"
                                onClick={() => restoreBackup(backup.id)}
                              >
                                <Restore />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete Backup">
                              <IconButton size="small" color="error">
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
        </Box>
      </Paper>

      {/* Create Backup Dialog */}
      <Dialog open={backupDialog} onClose={() => setBackupDialog(false)}>
        <DialogTitle>Create Database Backup</DialogTitle>
        <DialogContent>
          <Typography>
            This will create a complete backup of the database. The backup will include all collections and data.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBackupDialog(false)}>Cancel</Button>
          <Button onClick={createBackup} variant="contained">Create Backup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDatabase;