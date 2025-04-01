import { Grid, Typography, Card, CardContent, CircularProgress, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '../../services/axios';
import RecentUsers from '../../components/admin/RecentUsers';
import RecentProperties from '../../components/admin/RecentProperties';
import RecentContacts from '../../components/admin/RecentContacts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      agents: 0,
      properties: 0,
      contacts: 0
    },
    recent: {
      users: [],
      properties: [],
      contacts: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/v1/admin/stats');
        if (response.data.success) {
          setStats({
            counts: response.data.data.counts || {
              users: 0,
              agents: 0,
              properties: 0,
              contacts: 0
            },
            recent: response.data.data.recent || {
              users: [],
              properties: [],
              contacts: []
            }
          });
        }
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  console.log(stats);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h3">{stats.counts.users}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Agents</Typography>
              <Typography variant="h3">{stats.counts.agents}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Properties</Typography>
              <Typography variant="h3">{stats.counts.properties}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6">Contacts</Typography>
              <Typography variant="h3">{stats.counts.contacts}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RecentUsers users={stats.recent.users} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentProperties properties={stats.recent.properties} />
        </Grid>
        <Grid item xs={12} md={4}>
          <RecentContacts contacts={stats.recent.contacts} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;