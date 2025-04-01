// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { 
  Box, Grid, Typography, Card, CardContent, 
  CircularProgress, Paper, Table, TableBody, 
  TableCell, TableContainer, TableHead, 
  TableRow, Avatar, Chip 
} from '@mui/material';
import { 
  People, Home, Mail, Star, 
  Person, House, Email 
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProperties, setRecentProperties] = useState([]);
  const [recentInquiries, setRecentInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/v1/admin/dashboard');
        setStats(response.data.data.stats);
        setRecentProperties(response.data.data.featuredProperties);
        setRecentInquiries(response.data.data.recentInquiries);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const StatCard = ({ icon, title, value, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={1}>
          <Avatar sx={{ bgcolor: `${color}.light`, color: `${color}.dark`, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" fontWeight="bold">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Admin Dashboard
      </Typography>

      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              icon={<People />} 
              title="Total Users" 
              value={stats.totalUsers} 
              color="primary" 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              icon={<Person />} 
              title="Agents" 
              value={stats.totalAgents} 
              color="secondary" 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              icon={<Home />} 
              title="Properties" 
              value={stats.totalProperties} 
              color="success" 
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              icon={<Mail />} 
              title="Inquiries" 
              value={stats.totalInquiries} 
              color="warning" 
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Star color="primary" sx={{ mr: 1 }} /> Featured Properties
            </Typography>
            <TableContainer>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell>Property</TableCell>
                    <TableCell align="right">Price</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentProperties.map((property) => (
                    <TableRow key={property._id}>
                      <TableCell>
                        <Typography fontWeight="500">{property.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {property.address?.city}, {property.address?.state}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        ₹{property.price?.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={property.status} 
                          size="small"
                          color={
                            property.status === 'For Sale' ? 'primary' : 
                            property.status === 'For Rent' ? 'secondary' : 'default'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <Email color="primary" sx={{ mr: 1 }} /> Recent Inquiries
            </Typography>
            <TableContainer>
              <Table size={isMobile ? 'small' : 'medium'}>
                <TableHead>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>Property</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentInquiries.map((inquiry) => (
                    <TableRow key={inquiry._id}>
                      <TableCell>
                        <Typography fontWeight="500">{inquiry.from.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {inquiry.from.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {inquiry.property?.title || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={inquiry.status} 
                          size="small"
                          color={
                            inquiry.status === 'pending' ? 'default' : 
                            inquiry.status === 'contacted' ? 'primary' : 
                            inquiry.status === 'completed' ? 'success' : 'error'
                          }
                        />
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