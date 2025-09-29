import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Paper,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Home,
  AttachMoney,
  Business,
  Email,
  Visibility,
  Star,
  LocationOn,
  CalendarToday,
  Assessment
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import http from '@/lib/services/http';

const COLORS = ['var(--chart-color-3)', 'var(--chart-color-4)', 'var(--color-warning)', 'var(--color-primary)', 'var(--chart-color-1)'];

const AdminAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [analytics, setAnalytics] = useState({
    overview: {
      totalUsers: 0,
      userGrowth: 0,
      totalProperties: 0,
      propertyGrowth: 0,
      totalRevenue: 0,
      revenueGrowth: 0,
      totalAgents: 0,
      agentGrowth: 0,
      totalInquiries: 0,
      inquiryGrowth: 0
    },
    userGrowth: [],
    propertyStats: {
      activeProperties: 0,
      pendingProperties: 0,
      soldProperties: 0,
      totalViews: 0,
      types: [],
      priceRanges: []
    },
    revenueData: [],
    topAgents: [],
    topProperties: [],
    contactTrends: [],
    subscriptionStats: {
      activeSubscriptions: 0,
      expiredSubscriptions: 0,
      totalRevenue: 0,
      revenue: []
    },
    locationStats: [],
    activityLog: [],
    userStats: {
      byRole: [],
      activity: []
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await http.get('/api/v1/admin/analytics');
      if (response.success) {
        setAnalytics(response.data);
      } else {
        setError('Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Box>
    );
  }

  const renderOverviewCards = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'var(--chart-gradient-1)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <People sx={{ mr: 1 }} />
              <Typography variant="h6">Total Users</Typography>
            </Box>
            <Typography variant="h3">{analytics.overview.totalUsers || 0}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {analytics.overview.userGrowth > 0 ? (
                <TrendingUp sx={{ mr: 0.5, fontSize: 'small' }} />
              ) : (
                <TrendingDown sx={{ mr: 0.5, fontSize: 'small' }} />
              )}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {analytics.overview.userGrowth || 0}% this month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'var(--chart-gradient-2)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Home sx={{ mr: 1 }} />
              <Typography variant="h6">Properties</Typography>
            </Box>
            <Typography variant="h3">{analytics.overview.totalProperties || 0}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {analytics.overview.propertyGrowth > 0 ? (
                <TrendingUp sx={{ mr: 0.5, fontSize: 'small' }} />
              ) : (
                <TrendingDown sx={{ mr: 0.5, fontSize: 'small' }} />
              )}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {analytics.overview.propertyGrowth || 0}% this month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'var(--chart-gradient-3)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <AttachMoney sx={{ mr: 1 }} />
              <Typography variant="h6">Revenue</Typography>
            </Box>
            <Typography variant="h3">${analytics.overview.totalRevenue || 0}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {analytics.overview.revenueGrowth > 0 ? (
                <TrendingUp sx={{ mr: 0.5, fontSize: 'small' }} />
              ) : (
                <TrendingDown sx={{ mr: 0.5, fontSize: 'small' }} />
              )}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {analytics.overview.revenueGrowth || 0}% this month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'var(--chart-gradient-4)',
          color: 'white'
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Email sx={{ mr: 1 }} />
              <Typography variant="h6">Inquiries</Typography>
            </Box>
            <Typography variant="h3">{analytics.overview.totalInquiries || 0}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {analytics.overview.inquiryGrowth > 0 ? (
                <TrendingUp sx={{ mr: 0.5, fontSize: 'small' }} />
              ) : (
                <TrendingDown sx={{ mr: 0.5, fontSize: 'small' }} />
              )}
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {analytics.overview.inquiryGrowth || 0}% this month
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderUserGrowthChart = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>User Growth Trend</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.userGrowth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="var(--chart-color-1)" strokeWidth={2} />
            <Line type="monotone" dataKey="agents" stroke="var(--chart-color-2)" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderRevenueChart = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Revenue Analytics</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="revenue" stackId="1" stroke="var(--chart-color-1)" fill="var(--chart-color-1)" />
            <Area type="monotone" dataKey="subscriptions" stackId="1" stroke="var(--chart-color-2)" fill="var(--chart-color-2)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );

  const renderTopAgents = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Top Performing Agents</Typography>
        <List>
          {analytics.topAgents.map((agent, index) => (
            <ListItem key={agent._id} divider>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                  {agent.name.charAt(0)}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={agent.name}
                secondary={`${agent.propertiesCount} properties • ${agent.inquiriesCount} inquiries`}
              />
              <Chip 
                label={`$${agent.revenue}`} 
                color="primary" 
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  const renderPropertyStats = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Property Types Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.propertyStats.types || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="var(--chart-color-1)"
                  dataKey="value"
                >
                  {(analytics.propertyStats.types || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Price Range Distribution</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.propertyStats.priceRanges || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="var(--chart-color-1)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderLocationStats = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>Popular Locations</Typography>
        <Grid container spacing={2}>
          {analytics.locationStats.map((location, index) => (
            <Grid item xs={12} sm={6} md={4} key={location.name}>
              <Paper sx={{ p: 2, textAlign: 'center' }}>
                <LocationOn sx={{ fontSize: 40, color: COLORS[index % COLORS.length], mb: 1 }} />
                <Typography variant="h6">{location.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {location.propertiesCount} properties
                </Typography>
                <Chip 
                  label={`${location.avgPrice}`} 
                  size="small" 
                  sx={{ mt: 1 }}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderActivityLog = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>Recent Activity</Typography>
        <List>
          {analytics.activityLog.map((activity, index) => (
            <ListItem key={index} divider>
              <ListItemIcon>
                <Avatar sx={{ bgcolor: COLORS[index % COLORS.length] }}>
                  {activity.type === 'user' && <People />}
                  {activity.type === 'property' && <Home />}
                  {activity.type === 'inquiry' && <Email />}
                  {activity.type === 'subscription' && <AttachMoney />}
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={activity.description}
                secondary={new Date(activity.timestamp).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Analytics Dashboard</Typography>
      
      {renderOverviewCards()}

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Overview" />
          <Tab label="User Analytics" />
          <Tab label="Property Analytics" />
          <Tab label="Revenue Analytics" />
          <Tab label="Performance" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              {renderUserGrowthChart()}
              {renderRevenueChart()}
              {renderTopAgents()}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              {renderUserGrowthChart()}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>User Registration by Role</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.userStats?.byRole || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="role" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="var(--chart-color-1)" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>User Activity</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.userStats?.activity || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="active" stroke="var(--chart-color-1)" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              {renderPropertyStats()}
              {renderLocationStats()}
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              {renderRevenueChart()}
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Subscription Revenue</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analytics.subscriptionStats?.revenue || []}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="var(--chart-color-1)"
                            dataKey="value"
                          >
                            {analytics.subscriptionStats?.revenue?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>Monthly Revenue Trend</Typography>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={analytics.revenueData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="revenue" stroke="var(--chart-color-1)" fill="var(--chart-color-1)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 4 && (
            <Box>
              {renderTopAgents()}
              {renderActivityLog()}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminAnalytics;