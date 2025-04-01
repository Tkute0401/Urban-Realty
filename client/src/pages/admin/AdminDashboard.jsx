import { useEffect, useState } from 'react';
import { Grid, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import axios from '../../services/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/admin/stats');
        setStats(response.data.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
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

      {/* Recent activities sections */}
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