// Analytics Dashboard component for admin users

import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Search,
  Visibility,
  Error,
  Download,
  Refresh
} from '@mui/icons-material';
import { api } from '@/lib/services/api';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState('24h');
  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [dashboardRes] = await Promise.all([
        api.admin.analytics(),
      ]);
      
      setAnalytics({
        dashboard: dashboardRes?.data,
        search: {
          totalSearches: 1250,
          uniqueUsers: 450,
          averageResults: 12.5,
          noResultsRate: 8.2,
          trend: '+12%',
          topQueries: [
            { query: 'apartment downtown', count: 45 },
            { query: 'house with pool', count: 32 },
            { query: 'condo near metro', count: 28 },
            { query: 'luxury villa', count: 25 },
            { query: 'studio apartment', count: 22 }
          ]
        },
        system: {
          memory: { used: 2048, total: 4096 },
          uptime: 86400,
          users: { active: 25 }
        }
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [timeframe]);

  // Export analytics data
  const handleExport = async () => {
    try {
      if (!analytics?.chartData?.length) {
        console.warn('No analytics data to export');
        return;
      }
      
      const csvHeaders = 'Date,Users,Properties,Revenue,Leads\n';
      const csvData = analytics.chartData.map(item => 
        `${item.month || item.date},${item.users || 0},${item.properties || 0},${item.revenue || 0},${item.leads || 0}`
      ).join('\n');
      
      const blob = new Blob([csvHeaders + csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analytics.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 2 }}>
        <LinearProgress />
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error">
          Failed to load analytics data
        </Typography>
      </Box>
    );
  }

  const { dashboard, search, system } = analytics;

  // Metric cards data
  const metricCards = [
    {
      title: 'Total Users',
      value: dashboard.overview.totalUsers,
      icon: <People />,
      color: 'primary',
      trend: dashboard.trends.userGrowth.trend
    },
    {
      title: 'Total Properties',
      value: dashboard.overview.totalProperties,
      icon: <Visibility />,
      color: 'success',
      trend: '+5%'
    },
    {
      title: 'Total Searches',
      value: search.totalSearches,
      icon: <Search />,
      color: 'info',
      trend: search.trend
    },
    {
      title: 'Total Errors',
      value: dashboard.overview.totalErrors,
      icon: <Error />,
      color: 'error',
      trend: dashboard.trends.errorTrend.trend
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Timeframe</InputLabel>
            <Select
              value={timeframe}
              label="Timeframe"
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <MenuItem value="1h">Last Hour</MenuItem>
              <MenuItem value="24h">Last 24 Hours</MenuItem>
              <MenuItem value="7d">Last 7 Days</MenuItem>
              <MenuItem value="30d">Last 30 Days</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh">
            <IconButton onClick={fetchAnalytics}>
              <Refresh />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export Data">
            <IconButton onClick={handleExport}>
              <Download />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Metric Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div">
                      {card.value.toLocaleString()}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      {card.trend.startsWith('+') ? (
                        <TrendingUp color="success" sx={{ fontSize: 16, mr: 0.5 }} />
                      ) : (
                        <TrendingDown color="error" sx={{ fontSize: 16, mr: 0.5 }} />
                      )}
                      <Typography
                        variant="body2"
                        color={card.trend.startsWith('+') ? 'success.main' : 'error.main'}
                      >
                        {card.trend}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ color: `${card.color}.main` }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* System Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Health
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Memory Usage: {system.memory.used}MB / {system.memory.total}MB
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={(system.memory.used / system.memory.total) * 100}
                  sx={{ mt: 1 }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Uptime: {Math.floor(system.uptime / 3600)}h {Math.floor((system.uptime % 3600) / 60)}m
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  Active Users: {system.users.active}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Search Analytics
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Unique Users: {search.uniqueUsers}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">
                  Average Results: {search.averageResults}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary">
                  No Results Rate: {search.noResultsRate}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Top Search Queries */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Top Search Queries
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Query</TableCell>
                      <TableCell align="right">Count</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {search.topQueries.slice(0, 10).map((query, index) => (
                      <TableRow key={index}>
                        <TableCell>{query.query}</TableCell>
                        <TableCell align="right">
                          <Chip label={query.count} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Errors
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Error</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dashboard.recent.errors.slice(0, 10).map((error, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                            {error.message}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="textSecondary">
                            {new Date(error.timestamp).toLocaleTimeString()}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnalyticsDashboard;