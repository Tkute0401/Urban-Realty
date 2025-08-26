import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Badge
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import axios from '../../services/axios';
import { useAuth } from '../../context/AuthContext';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscriptionLoading, setSubscriptionLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribeDialog, setSubscribeDialog] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState(null);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/subscriptions');
      console.log('Fetched subscription plans:', response.data);
      setPlans(response.data.data);
    } catch (err) {
      setError('Failed to load subscription plans');
      console.error('Error fetching plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      setSubscriptionLoading(true);
      if (user) {
        const response = await axios.get('/subscriptions/my-subscription');
        console.log('Fetched current subscription:', response.data);
        setCurrentSubscription(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching current subscription:', err);
      // Don't set error here as it's not critical for the plans page
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleSubscribe = (plan) => {
    setSelectedPlan(plan);
    setSubscribeDialog(true);
    setSubscribeError(null);
    setSubscribeSuccess(false);
  };

  const handleSubscribeConfirm = async () => {
    try {
      setSubscribing(true);
      setSubscribeError(null);

      const response = await axios.post('/subscriptions/subscribe', {
        subscriptionId: selectedPlan._id,
        billingCycle,
        paymentMethod
      });

      setSubscribeSuccess(true);
      setTimeout(() => {
        setSubscribeDialog(false);
        setSubscribeSuccess(false);
        // Refresh subscription data
        fetchCurrentSubscription();
      }, 2000);
    } catch (err) {
      setSubscribeError(err.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const getFeatureIcon = (feature) => {
    return feature ? <CheckIcon color="success" /> : <CloseIcon color="error" />;
  };

  const getPlanColor = (type) => {
    switch (type) {
      case 'free': return 'default';
      case 'basic': return 'primary';
      case 'premium': return 'secondary';
      case 'enterprise': return 'warning';
      default: return 'default';
    }
  };

  const getPlanIcon = (type) => {
    if (type === 'premium' || type === 'enterprise') {
      return <StarIcon sx={{ color: '#FFD700', mr: 1 }} />;
    }
    return null;
  };

  const isCurrentPlan = (plan) => {
    if (!currentSubscription?.currentSubscription) return false;
    return currentSubscription.currentSubscription.subscription?._id === plan._id;
  };

  const getCurrentPlanBadge = (plan) => {
    if (!isCurrentPlan(plan)) return null;

    const subscription = currentSubscription.currentSubscription;
    const isActive = subscription.status === 'active';
    const isPending = subscription.status === 'pending';
    const isExpired = subscription.status === 'expired' || subscription.status === 'cancelled';

    let badgeColor = 'success';
    let badgeText = 'Current Plan';
    let badgeIcon = <CheckCircleIcon />;

    if (isPending) {
      badgeColor = 'warning';
      badgeText = 'Pending';
      badgeIcon = <ScheduleIcon />;
    } else if (isExpired) {
      badgeColor = 'error';
      badgeText = 'Expired';
      badgeIcon = <CloseIcon />;
    }

    return (
      <Chip
        icon={badgeIcon}
        label={badgeText}
        color={badgeColor}
        variant="filled"
        size="small"
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 1,
          fontWeight: 'bold'
        }}
      />
    );
  };

  const getPlanCardStyle = (plan) => {
    const isCurrent = isCurrentPlan(plan);
    const baseStyle = {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      '&:hover': {
        transform: 'translateY(-4px)',
        transition: 'transform 0.3s ease-in-out'
      }
    };

    if (isCurrent) {
      return {
        ...baseStyle,
        border: '3px solid #4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.05)',
        boxShadow: '0 8px 32px rgba(76, 175, 80, 0.3)',
        '&:hover': {
          ...baseStyle['&:hover'],
          boxShadow: '0 12px 40px rgba(76, 175, 80, 0.4)'
        }
      };
    }

    if (plan.type === 'premium') {
      return {
        ...baseStyle,
        border: '2px solid #FFD700',
        boxShadow: '0 8px 32px rgba(255, 215, 0, 0.3)',
        '&:hover': {
          ...baseStyle['&:hover'],
          boxShadow: '0 12px 40px rgba(255, 215, 0, 0.4)'
        }
      };
    }

    return {
      ...baseStyle,
      border: '1px solid #e0e0e0'
    };
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" align="center">Loading subscription plans...</Typography>
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
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 4, color: '#78CADC' }}>
        Choose Your Plan
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Select the perfect plan for your real estate needs
      </Typography>
      
      {/* Current Subscription Summary */}
      {user && (
        <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 2, border: '1px solid #4CAF50' }}>
          <Typography variant="h6" sx={{ color: '#4CAF50', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CheckCircleIcon />
            Current Subscription
          </Typography>
          
          {subscriptionLoading ? (
            <Typography variant="body2" color="text.secondary">
              Loading subscription details...
            </Typography>
          ) : currentSubscription?.currentSubscription ? (
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {currentSubscription.currentSubscription.subscription?.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {currentSubscription.currentSubscription.billingCycle} billing • ${currentSubscription.currentSubscription.amount}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="body2" color="text.secondary">
                  Status: <Chip 
                    label={currentSubscription.currentSubscription.status} 
                    color={currentSubscription.currentSubscription.status === 'active' ? 'success' : 'warning'}
                    size="small"
                  />
                </Typography>
                {currentSubscription.currentSubscription.endDate && (
                  <Typography variant="body2" color="text.secondary">
                    Expires: {new Date(currentSubscription.currentSubscription.endDate).toLocaleDateString()}
                  </Typography>
                )}
              </Grid>
            </Grid>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No active subscription found. Choose a plan below to get started.
            </Typography>
          )}
        </Box>
      )}

      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Button
          variant="outlined"
          href="/subscription-comparison"
          sx={{ 
            borderColor: '#78CADC',
            color: '#78CADC',
            '&:hover': {
              borderColor: '#5BA3B3',
              backgroundColor: 'rgba(120, 202, 220, 0.1)'
            }
          }}
        >
          Compare All Plans
        </Button>
      </Box>

      <Grid container spacing={4}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} lg={3} key={plan._id}>
            <Card 
              elevation={isCurrentPlan(plan) ? 12 : plan.type === 'premium' ? 8 : 2}
              sx={getPlanCardStyle(plan)}
            >
              {/* Current Plan Badge */}
              {getCurrentPlanBadge(plan)}

              {/* Premium Badge */}
              {plan.type === 'premium' && !isCurrentPlan(plan) && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: '#FFD700',
                    color: '#000',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    zIndex: 1
                  }}
                >
                  MOST POPULAR
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: isCurrentPlan(plan) ? 4 : 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  {getPlanIcon(plan.type)}
                  <Typography 
                    variant="h5" 
                    component="h2" 
                    sx={{ 
                      fontWeight: 'bold',
                      color: isCurrentPlan(plan) ? '#4CAF50' : 'inherit'
                    }}
                  >
                    {plan.name}
                  </Typography>
                </Box>
                
                <Typography variant="h4" component="div" sx={{ mb: 2, color: isCurrentPlan(plan) ? '#4CAF50' : '#78CADC' }}>
                  ${plan.price}
                  <Typography variant="body2" component="span" color="text.secondary">
                    /{plan.billingCycle}
                  </Typography>
                </Typography>

                {/* Current Plan Details */}
                {isCurrentPlan(plan) && currentSubscription?.currentSubscription && (
                  <Box sx={{ mb: 2, p: 1, bgcolor: 'rgba(76, 175, 80, 0.1)', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Billing Cycle: {currentSubscription.currentSubscription.billingCycle}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Status: {currentSubscription.currentSubscription.status}
                    </Typography>
                    {currentSubscription.currentSubscription.endDate && (
                      <Typography variant="body2" color="text.secondary">
                        Expires: {new Date(currentSubscription.currentSubscription.endDate).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {plan.description}
                </Typography>

                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      {getFeatureIcon(plan.features.propertyListings > 0)}
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${plan.features.propertyListings} Property Listings`}
                    />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      {getFeatureIcon(plan.features.advancedSearch)}
                    </ListItemIcon>
                    <ListItemText primary="Advanced Search" />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      {getFeatureIcon(plan.features.prioritySupport)}
                    </ListItemIcon>
                    <ListItemText primary="Priority Support" />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      {getFeatureIcon(plan.features.analytics)}
                    </ListItemIcon>
                    <ListItemText primary="Analytics & Insights" />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      {getFeatureIcon(plan.features.customBranding)}
                    </ListItemIcon>
                    <ListItemText primary="Custom Branding" />
                  </ListItem>
                  
                  <ListItem>
                    <ListItemIcon>
                      {getFeatureIcon(plan.features.apiAccess)}
                    </ListItemIcon>
                    <ListItemText primary="API Access" />
                  </ListItem>
                </List>
              </CardContent>

              <CardActions sx={{ justifyContent: 'center', pb: 3 }}>
                {isCurrentPlan(plan) ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
                    <Chip 
                      icon={<CheckCircleIcon />}
                      label="Current Plan" 
                      color="success" 
                      variant="filled"
                      size="large"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Button
                      variant="outlined"
                      size="medium"
                      onClick={() => window.location.href = '/subscription-change'}
                      sx={{ 
                        borderColor: '#4CAF50',
                        color: '#4CAF50',
                        '&:hover': {
                          borderColor: '#45a049',
                          backgroundColor: 'rgba(76, 175, 80, 0.1)'
                        }
                      }}
                    >
                      Change Plan
                    </Button>
                  </Box>
                ) : plan.type === 'free' ? (
                  <Chip 
                    label="Free Plan" 
                    color="default" 
                    variant="outlined"
                    size="large"
                  />
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleSubscribe(plan)}
                    disabled={!user}
                    sx={{ 
                      bgcolor: plan.type === 'premium' ? '#FFD700' : '#78CADC',
                      color: plan.type === 'premium' ? '#000' : '#fff',
                      '&:hover': {
                        bgcolor: plan.type === 'premium' ? '#FFC700' : '#5BA3B3'
                      }
                    }}
                  >
                    {!user ? 'Login to Subscribe' : 'Subscribe'}
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Subscribe Dialog */}
      <Dialog open={subscribeDialog} onClose={() => setSubscribeDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Subscribe to {selectedPlan?.name}
        </DialogTitle>
        <DialogContent>
          {subscribeSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Subscription successful! You will be redirected shortly.
            </Alert>
          ) : (
            <>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Complete your subscription to {selectedPlan?.name} for ${selectedPlan?.price}/{billingCycle}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Billing Cycle"
                    value={billingCycle}
                    onChange={(e) => setBillingCycle(e.target.value)}
                  >
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly (20% discount)</MenuItem>
                  </TextField>
                </Grid>
                
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
              </Grid>

              {subscribeError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {subscribeError}
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubscribeDialog(false)}>
            Cancel
          </Button>
          {!subscribeSuccess && (
            <Button 
              onClick={handleSubscribeConfirm}
              variant="contained"
              disabled={subscribing}
            >
              {subscribing ? 'Processing...' : 'Subscribe'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubscriptionPlans;