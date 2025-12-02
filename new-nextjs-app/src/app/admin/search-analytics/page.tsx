'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  TrendingUp,
  Search,
  Visibility,
  Click,
  TrendingDown,
  BarChart
} from '@mui/icons-material';
import http from '@/lib/services/http';

interface SearchAnalytics {
  totalSearches: number;
  totalConversions: number;
  totalClicks: number;
  conversionRate: number;
  clickThroughRate: number;
  avgResultsPerSearch: number;
}

interface PopularSearch {
  query: string;
  count: number;
  avgResultsCount: number;
  conversionRate: number;
}

interface ZeroResultSearch {
  query: string;
  count: number;
  lastSearched: Date;
}

const SearchAnalyticsPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SearchAnalytics | null>(null);
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([]);
  const [zeroResultSearches, setZeroResultSearches] = useState<ZeroResultSearch[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [daysFilter, setDaysFilter] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [daysFilter]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load metrics
      const metricsResponse = await http.get(`/api/v1/admin/search-analytics/metrics?days=${daysFilter}`);
      setMetrics(metricsResponse.data);

      // Load popular searches
      const popularResponse = await http.get(`/api/v1/admin/search-analytics/popular?days=${daysFilter}&limit=20`);
      setPopularSearches(popularResponse.data);

      // Load zero-result searches
      const zeroResultResponse = await http.get(`/api/v1/admin/search-analytics/zero-results?days=${daysFilter}&limit=20`);
      setZeroResultSearches(zeroResultResponse.data);

      // Load trending searches
      const trendingResponse = await http.get(`/api/v1/admin/search-analytics/trending?hours=24&limit=10`);
      setTrendingSearches(trendingResponse.data);
    } catch (err: any) {
      console.error('Error loading search analytics:', err);
      setError(err.response?.data?.message || 'Failed to load search analytics');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 600 }}>
          Search Analytics Dashboard
        </Typography>
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Time Period</InputLabel>
          <Select
            value={daysFilter}
            label="Time Period"
            onChange={(e) => setDaysFilter(e.target.value as number)}
          >
            <MenuItem value={7}>Last 7 days</MenuItem>
            <MenuItem value={30}>Last 30 days</MenuItem>
            <MenuItem value={90}>Last 90 days</MenuItem>
            <MenuItem value={180}>Last 6 months</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Search sx={{ fontSize: 32, color: 'var(--color-primary)', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Searches
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                {formatNumber(metrics?.totalSearches || 0)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                Over {daysFilter} days
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Click sx={{ fontSize: 32, color: '#4CAF50', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Total Clicks
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50' }}>
                {formatNumber(metrics?.totalClicks || 0)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                Click-through rate: {formatPercentage(metrics?.clickThroughRate || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUp sx={{ fontSize: 32, color: '#FF9800', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Conversions
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF9800' }}>
                {formatNumber(metrics?.totalConversions || 0)}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                Conversion rate: {formatPercentage(metrics?.conversionRate || 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BarChart sx={{ fontSize: 32, color: '#9C27B0', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Avg Results
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#9C27B0' }}>
                {metrics?.avgResultsPerSearch?.toFixed(1) || '0'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'var(--color-text-muted)' }}>
                Per search query
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
          <Tab label="Popular Searches" />
          <Tab label="Zero Results" />
          <Tab label="Trending" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {activeTab === 0 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Query</strong></TableCell>
                <TableCell align="right"><strong>Search Count</strong></TableCell>
                <TableCell align="right"><strong>Avg Results</strong></TableCell>
                <TableCell align="right"><strong>Conversion Rate</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {popularSearches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', py: 4 }}>
                      No popular searches found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                popularSearches.map((search, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {index < 3 && (
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            color="primary"
                            sx={{ mr: 1 }}
                          />
                        )}
                        {search.query || '(empty query)'}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{formatNumber(search.count)}</TableCell>
                    <TableCell align="right">{formatNumber(search.avgResultsCount)}</TableCell>
                    <TableCell align="right">
                      <Chip
                        label={formatPercentage(search.conversionRate * 100)}
                        size="small"
                        color={search.conversionRate > 0.1 ? 'success' : 'default'}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 1 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Query</strong></TableCell>
                <TableCell align="right"><strong>Search Count</strong></TableCell>
                <TableCell><strong>Last Searched</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {zeroResultSearches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', py: 4 }}>
                      No zero-result searches found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                zeroResultSearches.map((search, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingDown sx={{ fontSize: 18, color: '#f44336', mr: 1 }} />
                        {search.query || '(empty query)'}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{formatNumber(search.count)}</TableCell>
                    <TableCell>
                      {new Date(search.lastSearched).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {activeTab === 2 && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Query</strong></TableCell>
                <TableCell align="right"><strong>Recent Searches</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {trendingSearches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Typography variant="body2" sx={{ color: 'var(--color-text-muted)', py: 4 }}>
                      No trending searches found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                trendingSearches.map((search, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TrendingUp sx={{ fontSize: 18, color: '#FF5722', mr: 1 }} />
                        {search.query || '(empty query)'}
                      </Box>
                    </TableCell>
                    <TableCell align="right">{formatNumber(search.count)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SearchAnalyticsPage;

