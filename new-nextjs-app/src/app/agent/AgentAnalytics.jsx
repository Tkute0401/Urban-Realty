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
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Badge,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Visibility as VisibilityIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { mockApi } from '@/lib/services/mockApi';
import { useAuth } from '@/contexts/AuthContext';
import { formatDate } from '@/lib/utils/format';

const AgentAnalytics = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState('30');
  const [activeTab, setActiveTab] = useState(0);

  // Fetch agent's analytics
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['agentAnalytics', user?.id],
    queryFn: async () => {
      const res = await mockApi.agent.getAnalytics(user?.id || 'agent1');
      return res.data;
    },
    enabled: !!user?.id
  });

  // Use analytics data from mock API
  const analytics = analyticsData || {
    overview: {
      totalProperties: 0,
      activeProperties: 0,
      totalLeads: 0,
      conversionRate: 0,
      avgResponseTime: 0
    },
    performance: {
      topPerformingProperties: [],
      leadSources: {},
      leadStatusBreakdown: {}
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'contacted': return 'info';
      case 'followup': return 'primary';
      case 'closed': return 'success';
      default: return 'default';
    }
  };

  const getContactMethodIcon = (method) => {
    switch (method) {
      case 'email': return <EmailIcon />;
      case 'phone': return <PhoneIcon />;
      case 'whatsapp': return <WhatsAppIcon />;
      default: return <EmailIcon />;
    }
  };

  if (analyticsLoading) {
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
            Analytics & Insights
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Track your performance and property insights
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="7">Last 7 days</MenuItem>
              <MenuItem value="30">Last 30 days</MenuItem>
              <MenuItem value="90">Last 90 days</MenuItem>
              <MenuItem value="365">Last year</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      {/* Key Metrics */}
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
                    {analytics.overview.totalProperties}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {analytics.overview.activeProperties} active
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
                    Total Leads
                  </Typography>
                  <Typography variant="h4">
                    {analytics.overview.totalLeads}
                  </Typography>
                  <Typography variant="body2" color="primary.main">
                    +12% this month
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
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4">
                    {analytics.overview.conversionRate.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    +2.5% vs last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingUpIcon />
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
                    Avg Response Time
                  </Typography>
                  <Typography variant="h4">
                    {analytics.overview.avgResponseTime.toFixed(1)}h
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    <TrendingDownIcon sx={{ fontSize: 14, mr: 0.5 }} />
                    -1.2h vs last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <CalendarIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Top Performing Properties */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Performing Properties
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Property</TableCell>
                      <TableCell>Views</TableCell>
                      <TableCell>Leads</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.performance.topPerformingProperties.map((property) => (
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
                            {property.views || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography>
                            {contacts?.data?.filter(c => c.property?._id === property._id).length || 0}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={property.status || 'active'}
                            color={getStatusColor(property.status)}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Sources */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Sources
              </Typography>
              <List>
                {Object.entries(analytics.performance.leadSources).map(([method, count]) => (
                  <ListItem key={method}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getContactMethodIcon(method)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={method.charAt(0).toUpperCase() + method.slice(1)}
                      secondary={`${count} leads`}
                    />
                    <Typography variant="h6" color="primary">
                      {((count / analytics.overview.totalLeads) * 100).toFixed(1)}%
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Lead Status Breakdown */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Lead Status Breakdown
              </Typography>
              <List>
                {['pending', 'contacted', 'followup', 'closed'].map((status) => {
                  const count = analytics.performance.leadStatusBreakdown[status] || 0;
                  const percentage = analytics.overview.totalLeads > 0 ? (count / analytics.overview.totalLeads) * 100 : 0;
                  
                  return (
                    <ListItem key={status}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: `${getStatusColor(status)}.main` }}>
                          {status.charAt(0).toUpperCase()}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={status.charAt(0).toUpperCase() + status.slice(1)}
                        secondary={`${count} leads`}
                      />
                      <Typography variant="h6" color="primary">
                        {percentage.toFixed(1)}%
                      </Typography>
                    </ListItem>
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {analytics.performance.recentActivity?.slice(0, 5).map((contact) => (
                  <ListItem key={contact._id}>
                    <ListItemAvatar>
                      <Avatar>
                        {contact.user?.name?.charAt(0) || 'U'}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={`${contact.user?.name || 'Unknown'} inquired about ${contact.property?.title || 'property'}`}
                      secondary={formatDate(contact.createdAt)}
                    />
                    <Chip
                      label={contact.status}
                      color={getStatusColor(contact.status)}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AgentAnalytics;