import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarToday as CalendarIcon,
  Payment as PaymentIcon
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useAuth } from '../../context/AuthContext';

const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [upcomingBilling, setUpcomingBilling] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subscriptionRes, billingRes, upcomingRes] = await Promise.all([
        axios.get('/subscriptions/my-subscription'),
        axios.get('/subscriptions/billing-history'),
        axios.get('/subscriptions/upcoming-billing')
      ]);
      
      setSubscription(subscriptionRes.data.data);
      setBillingHistory(billingRes.data.data || []);
      setUpcomingBilling(upcomingRes.data.data);
    } catch (err) {
      setError('Failed to load subscription data');
      console.error('Error fetching subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Payment method is handled on Razorpay. No manual update UI.

  const handleCancelSubscription = async () => {
    try {
      setUpdating(true);
      await axios.put('/subscriptions/cancel');
      setCancelDialog(false);
      fetchSubscriptionData();
    } catch (err) {
      setError('Failed to cancel subscription');
    } finally {
      setUpdating(false);
    }
  };

  const handleDownloadInvoice = async (subscriptionId) => {
    try {
      const response = await axios.get(`/subscriptions/invoice/${subscriptionId}/download`, {
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
      case 'active': return 'success';
      case 'cancelled': return 'error';
      case 'expired': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getPaymentStatusChip = (paymentStatus) => {
    const color = paymentStatus === 'paid' ? 'success' : paymentStatus === 'failed' ? 'error' : 'warning';
    return <Chip label={`Payment: ${paymentStatus}`} color={color} size="small" sx={{ ml: 1 }} />
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ color: '#78CADC' }}>
          Subscription Management
        </Typography>
        <Button
          variant="outlined"
          href="/billing-dashboard"
          sx={{ borderColor: '#4CAF50', color: '#4CAF50' }}
        >
          View Billing Dashboard
        </Button>
      </Box>

      {subscription ? (
        <>
          {/* Current Subscription Card */}
          <Card sx={{ mb: 4, border: '2px solid #78CADC' }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={8}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {getStatusIcon(subscription.status)}
                    <Typography variant="h5" component="h2" sx={{ ml: 1, fontWeight: 'bold' }}>
                      {subscription.subscription?.name}
                    </Typography>
                    <Chip 
                      label={subscription.status.toUpperCase()} 
                      color={getStatusColor(subscription.status)}
                      sx={{ ml: 2 }}
                    />
                    {getPaymentStatusChip(subscription.paymentStatus || 'pending')}
                  </Box>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {subscription.subscription?.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Billing Cycle</Typography>
                      <Typography variant="body1" fontWeight="bold">{subscription.billingCycle}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Amount</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        ${subscription.amount} {subscription.currency}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Next Billing</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {new Date(subscription.endDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Payments are processed via Razorpay. You can choose method at checkout.
                  </Typography>
                  {subscription.status === 'active' && (
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<CancelIcon />}
                      onClick={() => setCancelDialog(true)}
                      sx={{ width: '100%' }}
                    >
                      Cancel Subscription
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Upcoming Billing */}
          {upcomingBilling && (
            <Card sx={{ mb: 4, border: '2px solid #4CAF50' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: '#4CAF50' }}>
                  <CalendarIcon sx={{ mr: 1 }} />
                  Upcoming Billing
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Next Billing Date</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {new Date(upcomingBilling.nextBillingDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Days Until Billing</Typography>
                      <Typography variant="body1" fontWeight="bold" color={upcomingBilling.daysUntilBilling <= 7 ? 'error' : 'inherit'}>
                        {upcomingBilling.daysUntilBilling} days
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Amount</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        ${upcomingBilling.amount} {upcomingBilling.currency}
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={3}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Auto-Renew</Typography>
                      <Typography variant="body1" fontWeight="bold">
                        {upcomingBilling.autoRenew ? 'Enabled' : 'Disabled'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {/* Billing History */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ReceiptIcon sx={{ mr: 1 }} />
                Billing History
              </Typography>
              
              {billingHistory.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Billing Cycle</TableCell>
                        <TableCell>Invoice</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {billingHistory.map((bill) => (
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
            </CardContent>
          </Card>
        </>
      ) : (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <Typography variant="h6" gutterBottom>
            No Active Subscription
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            You don't have an active subscription. Browse our plans to get started.
          </Typography>
          <Button
            variant="contained"
            href="/subscriptions"
            sx={{ bgcolor: '#78CADC' }}
          >
            View Plans
          </Button>
        </Card>
      )}

      {/* Manual payment method update removed; handled on Razorpay checkout. */}

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Cancel Subscription</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to cancel your subscription? This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You'll continue to have access to your current plan until the end of your billing period.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>Keep Subscription</Button>
          <Button 
            onClick={handleCancelSubscription}
            variant="contained"
            color="error"
            disabled={updating}
          >
            {updating ? 'Cancelling...' : 'Cancel Subscription'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionManagement;