import React from 'react';
import { api } from '@/lib/services/api';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Tooltip,
  Button
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  CurrencyRupee as MoneyIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon,
  Error as ErrorIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import http from '@/lib/services/http';

const SubscriptionAnalytics = () => {
  // Enhanced query with TanStack Query v5 object syntax and better error handling
  const { 
    data: analytics, 
    isLoading, 
    error,
    refetch
  } = useQuery({
    queryKey: ['subscriptionAnalytics'],
    queryFn: async () => {
      try {
        const response = await api.admin.analytics();
        
        if (response.success) {
          return response.data;
        } else {
          throw new Error(response.message || 'Failed to fetch subscription analytics');
        }
      } catch (error) {
        console.error('Error fetching subscription analytics:', error);
        throw new Error(error.message || 'Failed to load subscription analytics');
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      if ((error as any)?.response?.status >= 400 && (error as any)?.response?.status < 500) return false;
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'cancelled': return 'error';
      case 'expired': return 'warning';
      case 'pending': return 'info';
      default: return 'primary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircleIcon color="success" />;
      case 'cancelled': return <CancelIcon color="error" />;
      case 'expired': return <WarningIcon color="warning" />;
      case 'pending': return <WarningIcon color="info" />;
      default: return null;
    }
  };

  // Enhanced loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress size={40} />
            <Typography variant="h6" mt={2} color="text.secondary">
              Loading subscription analytics...
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              This may take a few moments
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Enhanced error handling
  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            icon={<ErrorIcon />}
            action={
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => refetch()}
                startIcon={<RefreshIcon />}
              >
                Retry
              </Button>
            }
          >
            <Typography variant="h6" gutterBottom>
              Subscription Analytics Error
            </Typography>
            <Typography variant="body2" gutterBottom>
              {error.message}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Please try again or contact support if the problem persists
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card>
        <CardContent>
          <Alert severity="info">
            <Typography variant="h6" gutterBottom>
              No Data Available
            </Typography>
            <Typography variant="body2">
              No subscription analytics data is currently available.
            </Typography>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUpIcon sx={{ mr: 1 }} />
        Subscription Analytics
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Total Subscribers</Typography>
              </Box>
              <Typography variant="h4" color="primary">
                {analytics.totalSubscribers || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analytics.activeSubscribers || 0} active
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MoneyIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Monthly Revenue</Typography>
              </Box>
              <Typography variant="h4" color="success">
                ${analytics.monthlyRevenue || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analytics.revenueGrowth > 0 ? '+' : ''}{analytics.revenueGrowth || 0}% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Active Plans</Typography>
              </Box>
              <Typography variant="h4" color="success">
                {analytics.activePlans || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {analytics.planTypes || 0} different plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">Churn Rate</Typography>
              </Box>
              <Typography variant="h4" color="error">
                {analytics.churnRate || 0}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Last 30 days
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Plan Distribution */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Plan Distribution</Typography>
              {analytics.planDistribution && analytics.planDistribution.length > 0 ? (
                <Box>
                  {analytics.planDistribution.map((plan) => (
                    <Box key={plan.name} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{plan.name}</Typography>
                        <Typography variant="body2" fontWeight="bold">
                          {plan.subscribers} ({plan.percentage}%)
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={plan.percentage} 
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No plan distribution data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Subscription Status</Typography>
              {analytics.statusDistribution && analytics.statusDistribution.length > 0 ? (
                <Box>
                  {analytics.statusDistribution.map((status) => (
                    <Box key={status.status} sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {getStatusIcon(status.status)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="bold">
                          {status.count} ({status.percentage}%)
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={status.percentage} 
                        color={getStatusColor(status.status)}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                  No status distribution data available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Subscriptions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent Subscriptions</Typography>
          {analytics.recentSubscriptions && analytics.recentSubscriptions.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.recentSubscriptions.map((subscription) => (
                    <TableRow key={subscription._id}>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {subscription.user?.name || 'Unknown User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {subscription.user?.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={subscription.plan?.name || 'Unknown Plan'} 
                          size="small"
                          color="primary"
                        />
                      </TableCell>
                      <TableCell>
                        ${subscription.amount} {subscription.currency}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={subscription.status} 
                          color={getStatusColor(subscription.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(subscription.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No recent subscriptions available
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default SubscriptionAnalytics;