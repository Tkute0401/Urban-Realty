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
  Alert
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon
} from '@mui/icons-material';
import axios from '../../services/axios';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../context/AuthContext';

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribeDialog, setSubscribeDialog] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly');
  // Payment method collection happens in Stripe Checkout; no manual input needed here
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeError, setSubscribeError] = useState(null);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
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
      if (!selectedPlan?._id) {
        throw new Error('No plan selected');
      }

      // Ask backend to create a Checkout session
      const { data } = await axios.post('/payments/checkout', {
        subscriptionId: selectedPlan._id,
        billingCycle
      });

      const sessionId = data?.data?.id;
      const checkoutUrl = data?.data?.url;

      // Prefer server-provided URL if present (works even if Stripe.js fails)
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
        return;
      }

      // Fallback to Stripe.js redirect with sessionId
      if (!sessionId) {
        throw new Error('Checkout session not created');
      }

      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        throw new Error('Stripe publishable key missing');
      }
      const stripe = await loadStripe(publishableKey);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        throw error;
      }
    } catch (err) {
      const message =
        err?.message ||
        err?.response?.data?.message ||
        'Failed to subscribe. Please try again.';
      setSubscribeError(message);
      console.error('Subscribe error:', err);
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
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 6, flexWrap: 'wrap' }}>
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
        <Button
          variant="outlined"
          onClick={async () => {
            try {
              const { data } = await axios.get('/payments/portal');
              const url = data?.data?.url;
              if (url) window.location.href = url;
            } catch (e) {
              setError('Unable to open billing portal');
            }
          }}
          sx={{ 
            borderColor: '#4CAF50',
            color: '#4CAF50',
            '&:hover': {
              borderColor: '#3d8b40',
              backgroundColor: 'rgba(76, 175, 80, 0.08)'
            }
          }}
        >
          Add/Update Card
        </Button>
      </Box>

      <Grid container spacing={4}>
        {plans.map((plan) => (
          <Grid item xs={12} md={6} lg={3} key={plan._id}>
            <Card 
              elevation={plan.type === 'premium' ? 8 : 2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: plan.type === 'premium' ? '2px solid #FFD700' : '1px solid #e0e0e0',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  transition: 'transform 0.3s ease-in-out'
                }
              }}
            >
              {plan.type === 'premium' && (
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
                    fontWeight: 'bold'
                  }}
                >
                  MOST POPULAR
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  {getPlanIcon(plan.type)}
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {plan.name}
                  </Typography>
                </Box>
                
                <Typography variant="h4" component="div" sx={{ mb: 2, color: '#78CADC' }}>
                  ${plan.price}
                  <Typography variant="body2" component="span" color="text.secondary">
                    /{plan.billingCycle}
                  </Typography>
                </Typography>

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
                {user?.subscriptionStatus === plan.type ? (
                  <Chip 
                    label="Current Plan" 
                    color="success" 
                    variant="outlined"
                    size="large"
                  />
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => handleSubscribe(plan)}
                    disabled={plan.type === 'free' && user?.subscriptionStatus === 'free'}
                    sx={{ 
                      bgcolor: plan.type === 'premium' ? '#FFD700' : '#78CADC',
                      color: plan.type === 'premium' ? '#000' : '#fff',
                      '&:hover': {
                        bgcolor: plan.type === 'premium' ? '#FFC700' : '#5BA3B3'
                      }
                    }}
                  >
                    {plan.type === 'free' ? 'Current Plan' : 'Subscribe'}
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