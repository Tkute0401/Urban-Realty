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
  Tooltip
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Receipt as ReceiptIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useAuth } from '../../context/AuthContext';

const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState(null);
  const [billingHistory, setBillingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editDialog, setEditDialog] = useState(false);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const { user } = useAuth();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const [subscriptionRes, billingRes] = await Promise.all([
        axios.get('/subscriptions/my-subscription'),
        axios.get('/subscriptions/billing-history')
      ]);
      
      setSubscription(subscriptionRes.data.data);
      setBillingHistory(billingRes.data.data || []);
    } catch (err) {
      setError('Failed to load subscription data');
      console.error('Error fetching subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentMethod = async () => {
    try {
      setUpdating(true);
      await axios.put('/subscriptions/payment-method', {
        paymentMethod,
        cardNumber,
        expiryDate,
        cvv
      });
      
      setEditDialog(false);
      fetchSubscriptionData();
      // Reset form
      setPaymentMethod('');
      setCardNumber('');
      setExpiryDate('');
      setCvv('');
    } catch (err) {
      setError('Failed to update payment method');
    } finally {
      setUpdating(false);
    }
  };

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'cancelled': return 'error';
      case 'expired': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
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
      <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#78CADC', mb: 4 }}>
        Subscription Management
      </Typography>

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
                  <Button
                    variant="outlined"
                    startIcon={<SettingsIcon />}
                    onClick={() => setEditDialog(true)}
                    sx={{ mb: 2, width: '100%' }}
                  >
                    Update Payment Method
                  </Button>
                  
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
                          <TableCell>
                            <Tooltip title="Download Invoice">
                              <IconButton size="small">
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

      {/* Update Payment Method Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Payment Method</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Payment Method"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="credit_card">Credit Card</MenuItem>
                <MenuItem value="debit_card">Debit Card</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              </TextField>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Card Number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="1234 5678 9012 3456"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Expiry Date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
              />
            </Grid>
            
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="CVV"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleUpdatePaymentMethod}
            variant="contained"
            disabled={updating || !paymentMethod || !cardNumber || !expiryDate || !cvv}
          >
            {updating ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

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