// src/pages/Admin/AdminDashboard.jsx
import { Box, Grid, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { 
  People, Home, RealEstateAgent, Mail, TrendingUp 
} from '@mui/icons-material';
import { useEffect, useState } from 'react';
import axios from '../../services/axios';
import { formatPrice } from '../../utils/format';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/admin/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
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
      <Typography color="error" align="center">
        {error}
      </Typography>
    );
  }

  const statCards = [
    { 
      title: 'Total Users', 
      value: stats?.totalUsers, 
      icon: <People fontSize="large" />,
      color: 'primary' 
    },
    { 
      title: 'Total Properties', 
      value: stats?.totalProperties, 
      icon: <Home fontSize="large" />,
      color: 'secondary' 
    },
    { 
      title: 'Total Agents', 
      value: stats?.totalAgents, 
      icon: <RealEstateAgent fontSize="large" />,
      color: 'success' 
    },
    { 
      title: 'New Contacts', 
      value: stats?.newContacts, 
      icon: <Mail fontSize="large" />,
      color: 'warning' 
    },
    { 
      title: 'Total Revenue', 
      value: formatPrice(stats?.totalRevenue), 
      icon: <TrendingUp fontSize="large" />,
      color: 'info' 
    },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {card.value}
                  </Typography>
                </Box>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  color: theme => theme.palette[card.color].main
                }}>
                  {card.icon}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Recent Activity Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recent Activity
        </Typography>
        {/* Add activity timeline or table here */}
      </Box>
    </Box>
  );
};

export default AdminDashboard;