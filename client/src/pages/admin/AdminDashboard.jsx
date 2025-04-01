// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { 
  Box, Grid, Typography, Card, CardContent, CircularProgress,
  Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Button
} from '@mui/material';
import { 
  People, Home, Mail, Star, Refresh 
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { formatPrice } from '../../utils/format';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const theme = useTheme();
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get('/admin/dashboard');
      console.log(response.data);
      const { stats, featuredProperties, recentInquiries } = response.data.data;
      
      setStats(stats);
      setRecentProperties(featuredProperties);
      setRecentInquiries(recentInquiries);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: <People fontSize="large" />,
      color: theme.palette.primary.main,
      path: '/admin/users'
    },
    {
      title: 'Total Agents',
      value: stats?.totalAgents || 0,
      icon: <People fontSize="large" />,
      color: theme.palette.secondary.main,
      path: '/admin/users?role=agent'
    },
    {
      title: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: <Home fontSize="large" />,
      color: theme.palette.success.main,
      path: '/admin/properties'
    },
    {
      title: 'Total Inquiries',
      value: stats?.totalInquiries || 0,
      icon: <Mail fontSize="large" />,
      color: theme.palette.warning.main,
      path: '/admin/inquiries'
    }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3} textAlign="center">
        <Typography color="error" gutterBottom>{error}</Typography>
        <Button 
          variant="contained" 
          startIcon={<Refresh />}
          onClick={fetchDashboardData}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {card.value}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Recent Properties */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                Featured Properties
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/properties')}
              >
                View All
              </Button>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentProperties.map((property) => (
                    <TableRow 
                      key={property._id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/properties/${property._id}`)}
                    >
                      <TableCell>{property.title}</TableCell>
                      <TableCell align="right">{formatPrice(property.price)}</TableCell>
                      <TableCell align="right">
                        <Box 
                          component="span" 
                          sx={{
                            color: property.status === 'For Sale' ? 'primary.main' : 
                                  property.status === 'For Rent' ? 'secondary.main' : 'text.secondary',
                            fontWeight: 500
                          }}
                        >
                          {property.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        
        {/* Recent Inquiries */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" component="h2">
                Recent Inquiries
              </Typography>
              <Button 
                size="small" 
                onClick={() => navigate('/admin/inquiries')}
              >
                View All
              </Button>
            </Box>
            
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell>From</TableCell>
                    <TableCell align="right">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentInquiries.map((inquiry) => (
                    <TableRow 
                      key={inquiry._id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/admin/inquiries/${inquiry._id}`)}
                    >
                      <TableCell>{inquiry.property?.title || 'N/A'}</TableCell>
                      <TableCell>{inquiry.from?.name || 'N/A'}</TableCell>
                      <TableCell align="right">
                        <Box 
                          component="span" 
                          sx={{
                            color: inquiry.status === 'pending' ? 'warning.main' : 
                                  inquiry.status === 'completed' ? 'success.main' : 'text.secondary',
                            fontWeight: 500
                          }}
                        >
                          {inquiry.status}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;