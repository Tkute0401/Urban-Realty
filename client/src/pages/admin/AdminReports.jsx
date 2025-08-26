import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Timeline as TimelineIcon,
  ExpandMore as ExpandMoreIcon,
  Visibility as ViewIcon,
  Print as PrintIcon,
  Share as ShareIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material';
import axios from '../../services/axios';

const AdminReports = () => {
  const [reports, setReports] = useState({
    overview: {
      totalRevenue: 0,
      totalUsers: 0,
      totalProperties: 0,
      conversionRate: 0,
      avgResponseTime: 0,
      customerSatisfaction: 0
    },
    trends: {
      revenue: [],
      users: [],
      properties: [],
      inquiries: []
    },
    topPerformers: {
      agents: [],
      properties: [],
      locations: []
    },
    insights: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [timeRange, setTimeRange] = useState('month');
  const [reportType, setReportType] = useState('overview');
  const [customDateRange, setCustomDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchReports();
  }, [timeRange, reportType]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      // In a real app, you'd fetch from reports endpoints
      // For now, using mock data
      setReports({
        overview: {
          totalRevenue: 125000,
          totalUsers: 1250,
          totalProperties: 450,
          conversionRate: 68.5,
          avgResponseTime: 2.3,
          customerSatisfaction: 4.6
        },
        trends: {
          revenue: [
            { month: 'Jan', value: 100000, change: 0 },
            { month: 'Feb', value: 110000, change: 10 },
            { month: 'Mar', value: 115000, change: 4.5 },
            { month: 'Apr', value: 120000, change: 4.3 },
            { month: 'May', value: 122000, change: 1.7 },
            { month: 'Jun', value: 125000, change: 2.5 }
          ],
          users: [
            { month: 'Jan', value: 1000, change: 0 },
            { month: 'Feb', value: 1050, change: 5 },
            { month: 'Mar', value: 1100, change: 4.8 },
            { month: 'Apr', value: 1150, change: 4.5 },
            { month: 'May', value: 1200, change: 4.3 },
            { month: 'Jun', value: 1250, change: 4.2 }
          ],
          properties: [
            { month: 'Jan', value: 400, change: 0 },
            { month: 'Feb', value: 410, change: 2.5 },
            { month: 'Mar', value: 420, change: 2.4 },
            { month: 'Apr', value: 430, change: 2.4 },
            { month: 'May', value: 440, change: 2.3 },
            { month: 'Jun', value: 450, change: 2.3 }
          ],
          inquiries: [
            { month: 'Jan', value: 150, change: 0 },
            { month: 'Feb', value: 160, change: 6.7 },
            { month: 'Mar', value: 170, change: 6.3 },
            { month: 'Apr', value: 180, change: 5.9 },
            { month: 'May', value: 190, change: 5.6 },
            { month: 'Jun', value: 200, change: 5.3 }
          ]
        },
        topPerformers: {
          agents: [
            { name: 'John Doe', sales: 15, revenue: 45000, rating: 4.8 },
            { name: 'Jane Smith', sales: 12, revenue: 38000, rating: 4.7 },
            { name: 'Bob Johnson', sales: 10, revenue: 32000, rating: 4.6 }
          ],
          properties: [
            { title: 'Luxury Villa', views: 1250, inquiries: 45, price: 850000 },
            { title: 'Modern Apartment', views: 980, inquiries: 32, price: 450000 },
            { title: 'Family Home', views: 850, inquiries: 28, price: 650000 }
          ],
          locations: [
            { name: 'Downtown', properties: 45, avgPrice: 750000, demand: 'High' },
            { name: 'Suburbs', properties: 38, avgPrice: 550000, demand: 'Medium' },
            { name: 'Rural Area', properties: 22, avgPrice: 350000, demand: 'Low' }
          ]
        },
        insights: [
          {
            type: 'positive',
            title: 'Revenue Growth',
            description: 'Monthly revenue increased by 12.5% compared to last month',
            impact: 'High',
            recommendation: 'Continue current marketing strategies'
          },
          {
            type: 'warning',
            title: 'Response Time',
            description: 'Average response time increased by 0.5 hours',
            impact: 'Medium',
            recommendation: 'Review customer service processes'
          },
          {
            type: 'info',
            title: 'User Engagement',
            description: 'New user registrations are up 8% this month',
            impact: 'Medium',
            recommendation: 'Monitor user retention rates'
          }
        ]
      });
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to load reports. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (format) => {
    // In a real app, this would generate and download the report
    console.log(`Exporting ${reportType} report in ${format} format`);
  };

  const handleScheduleReport = () => {
    // In a real app, this would schedule a report
    console.log('Scheduling report');
  };

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive': return 'success';
      case 'warning': return 'warning';
      case 'negative': return 'error';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const getInsightIcon = (type) => {
    switch (type) {
      case 'positive': return <CheckIcon />;
      case 'warning': return <WarningIcon />;
      case 'negative': return <ErrorIcon />;
      case 'info': return <InfoIcon />;
      default: return <InfoIcon />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" gutterBottom>Reports & Analytics</Typography>
          <Typography variant="body2" color="text.secondary">
            Comprehensive insights and performance metrics
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={fetchReports}
            sx={{ mr: 1 }}
          >
            Refresh
          </Button>
          <Button
            variant="contained"
            startIcon={<ScheduleIcon />}
            onClick={handleScheduleReport}
          >
            Schedule Report
          </Button>
        </Box>
      </Box>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Report Type</InputLabel>
                <Select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  label="Report Type"
                >
                  <MenuItem value="overview">Overview</MenuItem>
                  <MenuItem value="financial">Financial</MenuItem>
                  <MenuItem value="performance">Performance</MenuItem>
                  <MenuItem value="user">User Analytics</MenuItem>
                  <MenuItem value="property">Property Analytics</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Time Range</InputLabel>
                <Select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  label="Time Range"
                >
                  <MenuItem value="week">Last Week</MenuItem>
                  <MenuItem value="month">Last Month</MenuItem>
                  <MenuItem value="quarter">Last Quarter</MenuItem>
                  <MenuItem value="year">Last Year</MenuItem>
                  <MenuItem value="custom">Custom Range</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {timeRange === 'custom' && (
              <>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Start Date"
                    value={customDateRange.startDate}
                    onChange={(e) => setCustomDateRange({ ...customDateRange, startDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    fullWidth
                    type="date"
                    label="End Date"
                    value={customDateRange.endDate}
                    onChange={(e) => setCustomDateRange({ ...customDateRange, endDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={fetchReports}
              >
                Apply
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Overview Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Revenue
                  </Typography>
                  <Typography variant="h4" color="primary">
                    ${reports.overview.totalRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +12.5% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <MoneyIcon />
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
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Total Users
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {reports.overview.totalUsers.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +8% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <PersonIcon />
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
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Conversion Rate
                  </Typography>
                  <Typography variant="h4" color="success">
                    {reports.overview.conversionRate}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +2.1% from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
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
                  <Typography color="textSecondary" gutterBottom variant="h6">
                    Customer Satisfaction
                  </Typography>
                  <Typography variant="h4" color="warning">
                    {reports.overview.customerSatisfaction}/5
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    +0.2 from last month
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <CheckIcon />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Trends Analysis */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                Revenue Trends
              </Typography>
              <Box sx={{ mt: 2 }}>
                {reports.trends.revenue.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">{item.month}</Typography>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          ${item.value.toLocaleString()}
                        </Typography>
                        <Chip 
                          label={`${item.change > 0 ? '+' : ''}${item.change}%`}
                          color={item.change >= 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(item.value / Math.max(...reports.trends.revenue.map(r => r.value))) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                User Growth Trends
              </Typography>
              <Box sx={{ mt: 2 }}>
                {reports.trends.users.map((item, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2">{item.month}</Typography>
                      <Box display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          {item.value.toLocaleString()}
                        </Typography>
                        <Chip 
                          label={`${item.change > 0 ? '+' : ''}${item.change}%`}
                          color={item.change >= 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(item.value / Math.max(...reports.trends.users.map(r => r.value))) * 100}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Performers */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} />
                Top Performing Agents
              </Typography>
              <List dense>
                {reports.topPerformers.agents.map((agent, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {agent.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={agent.name}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {agent.sales} sales • ${agent.revenue.toLocaleString()} revenue
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Rating: {agent.rating}/5
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <HomeIcon sx={{ mr: 1 }} />
                Top Properties
              </Typography>
              <List dense>
                {reports.topPerformers.properties.map((property, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'success.main' }}>
                        <HomeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={property.title}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {property.views} views • {property.inquiries} inquiries
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Price: ${property.price.toLocaleString()}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1 }} />
                Top Locations
              </Typography>
              <List dense>
                {reports.topPerformers.locations.map((location, index) => (
                  <ListItem key={index}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'info.main' }}>
                        <LocationIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={location.name}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {location.properties} properties • ${location.avgPrice.toLocaleString()} avg
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Demand: {location.demand}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Key Insights */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <AnalyticsIcon sx={{ mr: 1 }} />
            Key Insights & Recommendations
          </Typography>
          <Grid container spacing={2}>
            {reports.insights.map((insight, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box display="flex" alignItems="flex-start" mb={2}>
                    <Avatar sx={{ bgcolor: `${getInsightColor(insight.type)}.main`, mr: 1 }}>
                      {getInsightIcon(insight.type)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        {insight.title}
                      </Typography>
                      <Chip 
                        label={insight.impact} 
                        color={insight.impact === 'High' ? 'error' : insight.impact === 'Medium' ? 'warning' : 'success'}
                        size="small"
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    {insight.description}
                  </Typography>
                  <Typography variant="caption" color="primary">
                    <strong>Recommendation:</strong> {insight.recommendation}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <DownloadIcon sx={{ mr: 1 }} />
            Export Reports
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportReport('pdf')}
              >
                Export as PDF
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportReport('excel')}
              >
                Export as Excel
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => handleExportReport('csv')}
              >
                Export as CSV
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<EmailIcon />}
                onClick={() => handleExportReport('email')}
              >
                Email Report
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Report Details Dialog */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Report Details</DialogTitle>
        <DialogContent>
          {selectedReport && (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedReport.title}</Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {selectedReport.description}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<PrintIcon />}>
            Print
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminReports;