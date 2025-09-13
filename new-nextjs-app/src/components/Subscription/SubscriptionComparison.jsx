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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import axios from '@/lib/services/axios';
import { useAuth } from '@/contexts/AuthContext';

const SubscriptionComparison = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showYearly, setShowYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscribeDialog, setSubscribeDialog] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/subscriptions');
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
  };

  const getFeatureValue = (plan, feature) => {
    if (feature === 'propertyListings') {
      return plan.features[feature] > 0 ? `${plan.features[feature]} Listings` : 'Unlimited';
    }
    return plan.features[feature] ? 'Yes' : 'No';
  };

  const getFeatureIcon = (plan, feature) => {
    if (feature === 'propertyListings') {
      return plan.features[feature] > 0 ? <CheckIcon color="success" /> : <StarIcon color="warning" />;
    }
    return plan.features[feature] ? <CheckIcon color="success" /> : <CloseIcon color="error" />;
  };

  const getPrice = (plan) => {
    if (showYearly) {
      const yearlyPrice = plan.price * 12 * 0.8; // 20% discount for yearly
      return `$${yearlyPrice.toFixed(0)}/year`;
    }
    return `$${plan.price}/month`;
  };

  const getSavings = (plan) => {
    if (showYearly) {
      const monthlyTotal = plan.price * 12;
      const yearlyPrice = plan.price * 12 * 0.8;
      const savings = monthlyTotal - yearlyPrice;
      return `Save $${savings.toFixed(0)}/year`;
    }
    return '';
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

  const features = [
    'propertyListings',
    'advancedSearch',
    'prioritySupport',
    'analytics',
    'customBranding',
    'apiAccess'
  ];

  const featureLabels = {
    propertyListings: 'Property Listings',
    advancedSearch: 'Advanced Search',
    prioritySupport: 'Priority Support',
    analytics: 'Analytics & Insights',
    customBranding: 'Custom Branding',
    apiAccess: 'API Access'
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 2, color: 'var(--color-primary)' }}>
        Plan Comparison
      </Typography>
      
      <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Compare our subscription plans to find the perfect fit for your needs
      </Typography>

      {/* Billing Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <FormControlLabel
          control={
            <Switch
              checked={showYearly}
              onChange={(e) => setShowYearly(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body1">Monthly</Typography>
              <Typography variant="body1" color="primary" fontWeight="bold">
                {showYearly ? 'Yearly (Save 20%)' : 'Monthly'}
              </Typography>
            </Box>
          }
        />
      </Box>

      {/* Plans Overview */}
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan._id}>
            <Card 
              elevation={plan.type === 'premium' ? 8 : 2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: plan.type === 'premium' ? '2px solid var(--color-warning)' : '1px solid var(--color-border-light)',
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
                    bgcolor: 'var(--color-warning)',
                    color: 'var(--color-text-primary)',
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
                  {plan.type === 'premium' && <StarIcon sx={{ color: 'var(--color-warning)', mr: 1 }} />}
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                    {plan.name}
                  </Typography>
                </Box>
                
                <Typography variant="h4" component="div" sx={{ mb: 1, color: 'var(--color-primary)' }}>
                  {getPrice(plan)}
                </Typography>
                
                {getSavings(plan) && (
                  <Typography variant="body2" color="success.main" sx={{ mb: 2, fontWeight: 'bold' }}>
                    {getSavings(plan)}
                  </Typography>
                )}

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {plan.description}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleSubscribe(plan)}
                  disabled={user?.subscriptionStatus === plan.type}
                  sx={{ 
                    bgcolor: plan.type === 'premium' ? 'var(--color-warning)' : 'var(--color-primary)',
                    color: plan.type === 'premium' ? 'var(--color-text-primary)' : 'var(--color-text-inverse)',
                    '&:hover': {
                      bgcolor: plan.type === 'premium' ? 'var(--color-warning-hover)' : 'var(--color-primary-hover)'
                    },
                    mb: 2
                  }}
                >
                  {user?.subscriptionStatus === plan.type ? 'Current Plan' : 'Choose Plan'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Detailed Comparison Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, color: 'var(--color-primary)' }}>
            <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Feature Comparison
          </Typography>
          
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', minWidth: 200 }}>Features</TableCell>
                  {plans.map((plan) => (
                    <TableCell key={plan._id} align="center" sx={{ fontWeight: 'bold' }}>
                      {plan.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {features.map((feature) => (
                  <TableRow key={feature}>
                    <TableCell sx={{ fontWeight: 'bold' }}>
                      {featureLabels[feature]}
                    </TableCell>
                    {plans.map((plan) => (
                      <TableCell key={plan._id} align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {getFeatureIcon(plan, feature)}
                          <Typography variant="body2" sx={{ ml: 1 }}>
                            {getFeatureValue(plan, feature)}
                          </Typography>
                        </Box>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                
                {/* Pricing Row */}
                <TableRow sx={{ backgroundColor: 'rgba(120, 202, 220, 0.1)' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Monthly Price</TableCell>
                  {plans.map((plan) => (
                    <TableCell key={plan._id} align="center">
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        ${plan.price}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
                
                {/* Yearly Pricing Row */}
                <TableRow sx={{ backgroundColor: 'rgba(255, 215, 0, 0.1)' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Yearly Price (20% off)</TableCell>
                  {plans.map((plan) => (
                    <TableCell key={plan._id} align="center">
                      <Typography variant="h6" color="warning.main" fontWeight="bold">
                        ${(plan.price * 12 * 0.8).toFixed(0)}
                      </Typography>
                      <Typography variant="caption" color="success.main">
                        Save ${(plan.price * 12 * 0.2).toFixed(0)}/year
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card sx={{ textAlign: 'center', py: 4, background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)', color: 'var(--color-text-inverse)' }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Choose the plan that best fits your real estate needs and start exploring premium features today.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/subscriptions"
            sx={{ 
              bgcolor: 'var(--color-warning)',
              color: 'var(--color-text-primary)',
              '&:hover': {
                bgcolor: 'var(--color-warning-hover)'
              }
            }}
          >
            View All Plans
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default SubscriptionComparison;