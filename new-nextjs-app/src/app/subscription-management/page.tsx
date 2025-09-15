'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Switch,
  FormControlLabel,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  CreditCard as CreditCardIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Settings as SettingsIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Edit as EditIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import apiService from '@/lib/services/apiService';

interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: string;
  lastPaymentDate: string;
  nextPaymentDate: string;
  totalPaid: number;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
}

const SubscriptionManagement = () => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelDialog, setCancelDialog] = useState(false);
  const [upgradeDialog, setUpgradeDialog] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);

  const { user } = useAuth();

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [subscriptionResponse, plansResponse] = await Promise.all([
        apiService.getUserSubscription(user.id),
        apiService.getSubscriptionPlans()
      ]) as [{ data: any; status: number }, { data: any; status: number }];

      if (subscriptionResponse.data.success) {
        setSubscription(subscriptionResponse.data.subscription);
        
        // Find the current plan
        const currentPlan = plansResponse.data.plans.find(
          (p: SubscriptionPlan) => p.id === subscriptionResponse.data.subscription.planId
        );
        setPlan(currentPlan || null);
      }

      setAvailablePlans(plansResponse.data.plans || []);
    } catch (err) {
      setError('Failed to load subscription data');
      console.error('Error fetching subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!user || !subscription) return;

    try {
      const response = await apiService.cancelSubscription(user.id) as { data: any; status: number };
      if (response.data.success) {
        setSubscription({
          ...subscription,
          status: 'cancelled',
          autoRenew: false
        });
        setCancelDialog(false);
        alert('Subscription cancelled successfully');
      } else {
        setError(response.data.error || 'Failed to cancel subscription');
      }
    } catch (err) {
      setError('Failed to cancel subscription. Please try again.');
    }
  };

  const handleUpgradeSubscription = async (newPlanId: string) => {
    if (!user || !subscription) return;

    try {
      const response = await apiService.updateSubscription(user.id, newPlanId) as { data: any; status: number };
      if (response.data.success) {
        setSubscription(response.data.subscription);
        
        // Find the new plan
        const newPlan = availablePlans.find(p => p.id === newPlanId);
        setPlan(newPlan || null);
        
        setUpgradeDialog(false);
        alert('Subscription upgraded successfully');
      } else {
        setError(response.data.error || 'Failed to upgrade subscription');
      }
    } catch (err) {
      setError('Failed to upgrade subscription. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'cancelled': return 'error';
      case 'expired': return 'warning';
      case 'pending': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckIcon sx={{ color: 'var(--color-success)' }} />;
      case 'cancelled': return <CloseIcon sx={{ color: 'var(--color-error)' }} />;
      case 'expired': return <WarningIcon sx={{ color: 'var(--color-warning)' }} />;
      case 'pending': return <InfoIcon sx={{ color: 'var(--color-info)' }} />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDaysUntilRenewal = () => {
    if (!subscription) return null;
    const nextDate = new Date(subscription.nextPaymentDate);
    const today = new Date();
    const diffTime = nextDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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

  if (!subscription || !plan) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">
          No active subscription found. <Button href="/subscriptions">View Plans</Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: 'var(--color-primary)',
            fontWeight: 'bold'
          }}
        >
          Subscription Management
        </Typography>
        <Typography variant="h6" color="var(--color-text-secondary)">
          Manage your subscription, billing, and plan settings
        </Typography>
      </Box>

      {/* Current Subscription Overview */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)', mb: 1 }}>
                Current Plan: {plan.name}
              </Typography>
              <Typography variant="body1" color="var(--color-text-secondary)" sx={{ mb: 2 }}>
                {plan.description}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Chip 
                  label={subscription.status.toUpperCase()} 
                  color={getStatusColor(subscription.status)}
                  icon={getStatusIcon(subscription.status)}
                />
                <Typography variant="h4" color="var(--color-primary)" sx={{ fontWeight: 'bold' }}>
                  ${plan.price}/month
                </Typography>
              </Box>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" color="var(--color-text-secondary)">
                Next billing date
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                {formatDate(subscription.nextPaymentDate)}
              </Typography>
              {getDaysUntilRenewal() !== null && (
                <Typography 
                  variant="body2" 
                  color={getDaysUntilRenewal()! <= 7 ? 'var(--color-error)' : 'var(--color-text-secondary)'}
                >
                  {getDaysUntilRenewal()} days remaining
                </Typography>
              )}
            </Box>
          </Box>

          {/* Billing Information */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CreditCardIcon sx={{ color: 'var(--color-primary)', mr: 1 }} />
                <Typography variant="body2" color="var(--color-text-secondary)">
                  Payment Method
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {subscription.paymentMethod}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <CalendarIcon sx={{ color: 'var(--color-primary)', mr: 1 }} />
                <Typography variant="body2" color="var(--color-text-secondary)">
                  Last Payment
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {formatDate(subscription.lastPaymentDate)}
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TrendingUpIcon sx={{ color: 'var(--color-primary)', mr: 1 }} />
                <Typography variant="body2" color="var(--color-text-secondary)">
                  Total Paid
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                ${subscription.totalPaid}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Plan Features */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
            <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Plan Features
          </Typography>
          
          <Grid container spacing={2}>
            {plan.features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckIcon sx={{ color: 'var(--color-success)', mr: 1, fontSize: 20 }} />
                  <Typography variant="body2" color="var(--color-text-secondary)">
                    {feature}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Auto-Renewal Settings */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h6" sx={{ color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
                Auto-Renewal
              </Typography>
              <Typography variant="body2" color="var(--color-text-secondary)">
                {subscription.autoRenew 
                  ? 'Your subscription will automatically renew on the next billing date'
                  : 'Your subscription will not automatically renew'
                }
              </Typography>
            </Box>
            <FormControlLabel
              control={
                <Switch
                  checked={subscription.autoRenew}
                  disabled={subscription.status === 'cancelled'}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'var(--color-primary)',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'var(--color-primary)',
                    },
                  }}
                />
              }
              label=""
            />
          </Box>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => setUpgradeDialog(true)}
            disabled={subscription.status === 'cancelled'}
            sx={{ 
              bgcolor: 'var(--color-primary)',
              '&:hover': {
                bgcolor: 'var(--color-primary-hover)',
              }
            }}
          >
            <EditIcon sx={{ mr: 1 }} />
            Upgrade Plan
          </Button>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Button
            variant="outlined"
            fullWidth
            href="/billing-dashboard"
            sx={{ 
              borderColor: 'var(--color-primary)',
              color: 'var(--color-primary)',
              '&:hover': {
                borderColor: 'var(--color-primary-hover)',
                bgcolor: 'var(--color-bg-secondary)',
              }
            }}
          >
            <CreditCardIcon sx={{ mr: 1 }} />
            Billing History
          </Button>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => setCancelDialog(true)}
            disabled={subscription.status === 'cancelled'}
            sx={{ 
              borderColor: 'var(--color-error)',
              color: 'var(--color-error)',
              '&:hover': {
                borderColor: 'var(--color-error)',
                bgcolor: 'var(--color-bg-secondary)',
              }
            }}
          >
            <CancelIcon sx={{ mr: 1 }} />
            Cancel Subscription
          </Button>
        </Grid>
      </Grid>

      {/* Warning for Cancelled Subscription */}
      {subscription.status === 'cancelled' && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          <WarningIcon sx={{ mr: 1 }} />
          Your subscription has been cancelled. You will continue to have access until {formatDate(subscription.endDate)}.
        </Alert>
      )}

      {/* Cancel Subscription Dialog */}
      <Dialog open={cancelDialog} onClose={() => setCancelDialog(false)}>
        <DialogTitle sx={{ color: 'var(--color-error)', fontWeight: 'bold' }}>
          <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Cancel Subscription
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your current billing period.
          </Typography>
          <Typography variant="body2" color="var(--color-text-secondary)">
            You can reactivate your subscription at any time before the end date.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelDialog(false)}>
            Keep Subscription
          </Button>
          <Button 
            onClick={handleCancelSubscription}
            variant="contained"
            sx={{ 
              bgcolor: 'var(--color-error)',
              '&:hover': {
                bgcolor: 'var(--color-error)',
              }
            }}
          >
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upgrade Subscription Dialog */}
      <Dialog open={upgradeDialog} onClose={() => setUpgradeDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
          <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Upgrade Your Plan
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Choose a new plan to upgrade your subscription. You'll be charged the prorated amount for the upgrade.
          </Typography>
          
          <Grid container spacing={2}>
            {availablePlans
              .filter(p => p.id !== plan.id)
              .map((upgradePlan) => (
                <Grid item xs={12} md={6} key={upgradePlan.id}>
                  <Card 
                    sx={{ 
                      border: '1px solid var(--color-border-light)',
                      '&:hover': {
                        borderColor: 'var(--color-primary)',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        {upgradePlan.name}
                      </Typography>
                      <Typography variant="h4" color="var(--color-primary)" sx={{ fontWeight: 'bold', mb: 2 }}>
                        ${upgradePlan.price}/month
                      </Typography>
                      <Typography variant="body2" color="var(--color-text-secondary)" sx={{ mb: 2 }}>
                        {upgradePlan.description}
                      </Typography>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleUpgradeSubscription(upgradePlan.id)}
                        sx={{ 
                          bgcolor: 'var(--color-primary)',
                          '&:hover': {
                            bgcolor: 'var(--color-primary-hover)',
                          }
                        }}
                      >
                        Upgrade to {upgradePlan.name}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialog(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionManagement;