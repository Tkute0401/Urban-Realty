import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Tooltip
} from '@mui/material';
import {
  Home as HomeIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axios';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/format';

const AgentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeLeads: 0,
    totalViews: 0,
    monthlyRevenue: 0
  });

  // Fetch agent's properties
  const { data: properties, isLoading: propertiesLoading } = useQuery(
    ['agentProperties', user?.id],
    async () => {
      const res = await axios.get(`/properties/agent/${user?.id}`);
      return res.data;
    },
    { enabled: !!user?.id }
  );

  // Fetch agent's contact requests
  const { data: contacts, isLoading: contactsLoading } = useQuery(
    ['agentContacts', user?.id],
    async () => {
      const res = await axios.get('/contacts/agent');
      return res.data;
    },
    { enabled: !!user?.id }
  );

  // Calculate dashboard stats
  useEffect(() => {
    if (properties?.data && contacts?.data) {
      const totalProperties = properties.data.length;
      const activeLeads = contacts.data.filter(contact => 
        ['pending', 'contacted', 'followup'].includes(contact.status)
      ).length;
      const totalViews = properties.data.reduce((sum, prop) => sum + (prop.views || 0), 0);
      const monthlyRevenue = properties.data.reduce((sum, prop) => {
        // Simple revenue calculation - you might want to adjust this based on your business logic
        return sum + (prop.price ? prop.price * 0.02 : 0); // 2% commission example
      }, 0);

      setStats({
        totalProperties,
        activeLeads,
        totalViews,
        monthlyRevenue
      });
    }
  }, [properties, contacts]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'contacted': return 'info';
      case 'followup': return 'primary';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const getPropertyStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'sold': return 'info';
      case 'inactive': return 'error';
      default: return 'default';
    }
  };

  if (propertiesLoading || contactsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome back, {user?.name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's what's happening with your properties and leads
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/add-property')}
          >
            Add Property
          </Button>
          <IconButton onClick={() => window.location.reload()}>
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Total Properties
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalProperties}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
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
                  <Typography color="text.secondary" gutterBottom>
                    Active Leads
                  </Typography>
                  <Typography variant="h4">
                    {stats.activeLeads}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <PeopleIcon />
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
                  <Typography color="text.secondary" gutterBottom>
                    Total Views
                  </Typography>
                  <Typography variant="h4">
                    {stats.totalViews.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <VisibilityIcon />
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
                  <Typography color="text.secondary" gutterBottom>
                    Monthly Revenue
                  </Typography>
                  <Typography variant="h4">
                    ₹{stats.monthlyRevenue.toLocaleString()}
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <MoneyIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Properties */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Recent Properties</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/agent/properties')}
                >
                  View All
                </Button>
              </Box>
              
              {properties?.data?.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Property</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Views</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {properties.data.slice(0, 5).map((property) => (
                        <TableRow key={property._id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar
                                src={property.images?.[0]}
                                variant="rounded"
                                sx={{ width: 50, height: 50 }}
                              >
                                <HomeIcon />
                              </Avatar>
                              <Box>
                                <Typography fontWeight="500">
                                  {property.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <LocationIcon sx={{ fontSize: 14, mr: 0.5 }} />
                                  {property.location}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography fontWeight="500">
                              ₹{property.price?.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={property.status || 'active'}
                              color={getPropertyStatusColor(property.status)}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography>{property.views || 0}</Typography>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => navigate(`/properties/${property._id}/edit`)}
                            >
                              <EditIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary" gutterBottom>
                    No properties found
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/add-property')}
                  >
                    Add Your First Property
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Leads */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Recent Leads</Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/agent/inquiries')}
                >
                  View All
                </Button>
              </Box>

              {contacts?.data?.length > 0 ? (
                <List>
                  {contacts.data.slice(0, 5).map((contact) => (
                    <React.Fragment key={contact._id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            {contact.user?.name?.charAt(0) || 'U'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Typography variant="subtitle2">
                                {contact.user?.name || 'Unknown'}
                              </Typography>
                              <Chip
                                label={contact.status}
                                color={getStatusColor(contact.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                {contact.property?.title || 'Property'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatDate(contact.createdAt)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box textAlign="center" py={4}>
                  <Typography color="text.secondary">
                    No leads yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentDashboard;