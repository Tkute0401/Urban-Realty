import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  CalendarToday as CalendarIcon,
  Download as DownloadIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import http from '@/lib/services/http';
import { useAuth } from '@/contexts/AuthContext';

const BillingDashboard = () => {
  const [billingData, setBillingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const [billingHistory, upcomingBilling, subscription] = await Promise.all([
        http.get('/api/v1/subscriptions/billing-history'),
        http.get('/api/v1/subscriptions/upcoming-billing'),
        http.get('/api/v1/subscriptions/my-subscription')
      ]);
      
      setBillingData({
        billingHistory: billingHistory.data.data || [],
        upcomingBilling: upcomingBilling.data.data,
        subscription: subscription.data.data
      });
    } catch (err) {
      setError('Failed to load billing data');
      console.error('Error fetching billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (subscriptionId) => {
    try {
      const response = await http.get(`/subscriptions/invoice/${subscriptionId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${subscriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download invoice');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const calculateTotalSpent = () => {
    if (!billingData?.billingHistory) return 0;
    return billingData.billingHistory
      .filter(bill => bill.status === 'paid')
      .reduce((total, bill) => total + bill.amount, 0);
  };

  const getUpcomingBillingDays = () => {
    if (!billingData?.upcomingBilling) return null;
    return billingData.upcomingBilling.daysUntilBilling;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'var(--color-primary)', mb: 4 }}>
        Billing Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon sx={{ color: 'var(--color-primary)', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Total Spent
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                ${calculateTotalSpent().toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lifetime spending
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PaymentIcon sx={{ color: 'var(--color-success)', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Next Payment
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ color: 'var(--color-success)', fontWeight: 'bold' }}>
                ${billingData?.upcomingBilling?.amount || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {billingData?.upcomingBilling?.billingCycle || 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ color: 'var(--color-warning)', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Days Until Billing
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ 
                color: getUpcomingBillingDays() <= 7 ? 'var(--color-error)' : 'var(--color-warning)', 
                fontWeight: 'bold' 
              }}>
                {getUpcomingBillingDays() || 'N/A'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                days remaining
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ height: '100%', bgcolor: 'var(--color-bg-secondary)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ color: 'var(--color-primary)', mr: 1 }} />
                <Typography variant="h6" color="text.secondary">
                  Active Subscriptions
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
                {billingData?.billingHistory?.filter(bill => bill.status === 'paid').length || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                current plans
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upcoming Billing Alert */}
      {billingData?.upcomingBilling && getUpcomingBillingDays() <= 7 && (
        <Alert 
          severity="warning" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" href="/subscription-management">
              Manage Billing
            </Button>
          }
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <WarningIcon sx={{ mr: 1 }} />
            Your next billing date is in {getUpcomingBillingDays()} days. You will complete payment on Razorpay at checkout.
          </Box>
        </Alert>
      )}

      {/* Billing Progress */}
      {billingData?.upcomingBilling && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ mr: 1 }} />
              Billing Cycle Progress
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Current Billing Period
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getUpcomingBillingDays()} days remaining
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={Math.max(0, 100 - (getUpcomingBillingDays() / 30) * 100)} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">Billing Cycle</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {billingData.upcomingBilling.billingCycle}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">Next Billing Date</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {new Date(billingData.upcomingBilling.nextBillingDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="text.secondary">Auto-Renew</Typography>
                <Chip 
                  label={billingData.upcomingBilling.autoRenew ? 'Enabled' : 'Disabled'}
                  color={billingData.upcomingBilling.autoRenew ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Recent Billing History */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ReceiptIcon sx={{ mr: 1 }} />
            Recent Billing History
          </Typography>
          
          {billingData?.billingHistory?.length > 0 ? (
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Billing Cycle</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {billingData.billingHistory.slice(0, 10).map((bill) => (
                    <TableRow key={bill._id}>
                      <TableCell>{new Date(bill.date).toLocaleDateString()}</TableCell>
                      <TableCell>{bill.description}</TableCell>
                      <TableCell>${bill.amount} {bill.currency}</TableCell>
                      <TableCell>
                        <Chip 
                          label={bill.status} 
                          color={getStatusColor(bill.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{bill.billingCycle}</TableCell>
                      <TableCell>
                        <Tooltip title="Download Invoice">
                          <IconButton 
                            size="small"
                            onClick={() => handleDownloadInvoice(bill._id)}
                            disabled={bill.status === 'pending'}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
              No billing history available
            </Typography>
          )}
          
          {billingData?.billingHistory?.length > 10 && (
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                href="/subscription-management"
                sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                View All Billing History
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <CreditCardIcon sx={{ mr: 1 }} />
            Quick Actions
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                fullWidth
                href="/subscription-management"
                sx={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                Manage Subscription
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                fullWidth
                href="/subscriptions"
                sx={{ borderColor: 'var(--color-success)', color: 'var(--color-success)' }}
              >
                View Plans
              </Button>
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                variant="outlined"
                fullWidth
                href="/subscription-comparison"
                sx={{ borderColor: 'var(--color-warning)', color: 'var(--color-warning)' }}
              >
                Compare Plans
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Container>
  );
};

export default BillingDashboard;