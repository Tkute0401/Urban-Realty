import { Grid, Typography, Card, CardContent, CircularProgress, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from '../../services/axios';
import RecentUsers from '../../components/admin/RecentUsers';
import RecentProperties from '../../components/admin/RecentProperties';
import RecentContacts from '../../components/admin/RecentContacts';
import SubscriptionAnalytics from '../../components/admin/SubscriptionAnalytics';
import { TrendingUp as TrendingUpIcon, People as PeopleIcon, AttachMoney as MoneyIcon, Business as BusinessIcon } from '@mui/icons-material';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    counts: {
      users: 0,
      agents: 0,
      properties: 0,
      contacts: 0,
      subscriptions: 0,
      revenue: 0
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
        const response = await axios.get('/admin/stats', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.data.success) {
          setStats({
            counts: response.data.data.counts || {
              users: 0,
              agents: 0,
              properties: 0,
              contacts: 0,
              subscriptions: 0,
              revenue: 0
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
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Total Users</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.users}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Registered users
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Agents</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.agents}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Active agents
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BusinessIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Properties</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.properties}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Listed properties
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PeopleIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Contacts</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.contacts}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Total inquiries
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Subscriptions</Typography>
              </Box>
              <Typography variant="h3">{stats.counts.subscriptions}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Active plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            color: 'white'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <MoneyIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Revenue</Typography>
              </Box>
              <Typography variant="h3">${stats.counts.revenue}</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Monthly revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Subscription Analytics Section */}
      <Box sx={{ mb: 4 }}>
        <SubscriptionAnalytics />
      </Box>

      {/* Recent Activity Section */}
      <Typography variant="h5" gutterBottom sx={{ mb: 3, color: '#78CADC' }}>
        Recent Activity
      </Typography>
      
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