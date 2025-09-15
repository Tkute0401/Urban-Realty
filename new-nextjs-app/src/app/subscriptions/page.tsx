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
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Check as CheckIcon,
  Star as StarIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
  Support as SupportIcon
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscriptionPlans, useSubscribeMutation } from '@/hooks/api/subscriptions';
import PaymentForm from '@/components/Subscription/PaymentForm';

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxProperties: number;
  maxAgents: number;
  maxUsers: number;
  isPopular: boolean;
  isActive: boolean;
}

const SubscriptionPlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showYearly, setShowYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [subscribeDialog, setSubscribeDialog] = useState(false);

  const { user } = useAuth();

  const { data: fetchedPlans, isLoading: isPlansLoading, error: plansError } = useSubscriptionPlans();
  const subscribeMutation = useSubscribeMutation({
    onSuccess: () => {
      setSubscribeDialog(false);
      setSelectedPlan(null);
      alert('Subscription successful!');
    },
    onError: () => {
      setError('Subscription failed. Please try again.');
    },
  });

  useEffect(() => {
    setLoading(isPlansLoading);
    if (plansError) {
      setError('Failed to load subscription plans');
    } else if (fetchedPlans) {
      setPlans(fetchedPlans as SubscriptionPlan[]);
    }
  }, [isPlansLoading, plansError, fetchedPlans]);

  const handleSubscribe = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setSubscribeDialog(true);
  };

  const handleSubscribeConfirm = async (paymentData: any) => {
    if (!selectedPlan || !user) return;
    subscribeMutation.mutate({ userId: user.id, planId: selectedPlan.id, paymentMethod: paymentData.paymentMethod });
  };

  const getPrice = (plan: SubscriptionPlan) => {
    if (showYearly) {
      const yearlyPrice = plan.price * 12 * 0.8; // 20% discount for yearly
      return `$${yearlyPrice.toFixed(0)}/year`;
    }
    return `$${plan.price}/month`;
  };

  const getSavings = (plan: SubscriptionPlan) => {
    if (showYearly) {
      const monthlyTotal = plan.price * 12;
      const yearlyPrice = plan.price * 12 * 0.8;
      const savings = monthlyTotal - yearlyPrice;
      return `Save $${savings.toFixed(0)}/year`;
    }
    return '';
  };

  const getFeatureIcon = (feature: string) => {
    switch (feature) {
      case 'Priority support':
      case '24/7 phone support':
        return <SupportIcon sx={{ color: 'var(--color-primary)', fontSize: 20 }} />;
      case 'API access':
      case 'White-label options':
        return <SecurityIcon sx={{ color: 'var(--color-primary)', fontSize: 20 }} />;
      default:
        return <CheckIcon sx={{ color: 'var(--color-success)', fontSize: 20 }} />;
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
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            color: 'var(--color-primary)',
            fontWeight: 'bold',
            mb: 2
          }}
        >
          Choose Your Plan
        </Typography>
        <Typography 
          variant="h6" 
          color="var(--color-text-secondary)"
          sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}
        >
          Select the perfect subscription plan for your real estate business needs. 
          All plans include our core features with different levels of access.
        </Typography>

        {/* Billing Toggle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
          <Typography variant="body1" color="var(--color-text-secondary)">
            Monthly
          </Typography>
          <Switch
            checked={showYearly}
            onChange={(e) => setShowYearly(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'var(--color-primary)',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'var(--color-primary)',
              },
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" color="var(--color-text-secondary)">
              Yearly
            </Typography>
            <Chip 
              label="Save 20%" 
              size="small" 
              sx={{ 
                bgcolor: 'var(--color-success)',
                color: 'var(--color-text-inverse)',
                fontWeight: 'bold'
              }} 
            />
          </Box>
        </Box>
      </Box>

      {/* Plans Grid */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan.id}>
            <Card 
              elevation={plan.isPopular ? 8 : 2}
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: plan.isPopular ? '2px solid var(--color-primary)' : '1px solid var(--color-border-light)',
                position: 'relative',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                }
              }}
            >
              {plan.isPopular && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    bgcolor: 'var(--color-primary)',
                    color: 'var(--color-text-inverse)',
                    px: 3,
                    py: 1,
                    borderRadius: 2,
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <StarIcon sx={{ fontSize: 16 }} />
                  MOST POPULAR
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: plan.isPopular ? 4 : 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                  {plan.isPopular && <StarIcon sx={{ color: 'var(--color-primary)', mr: 1 }} />}
                  <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', color: 'var(--color-text-primary)' }}>
                    {plan.name}
                  </Typography>
                </Box>
                
                <Typography variant="h3" component="div" sx={{ mb: 1, color: 'var(--color-primary)', fontWeight: 'bold' }}>
                  {getPrice(plan)}
                </Typography>
                
                {getSavings(plan) && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 'bold',
                      color: 'var(--color-success)',
                      bgcolor: 'var(--color-bg-secondary)',
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block'
                    }}
                  >
                    {getSavings(plan)}
                  </Typography>
                )}

                <Typography 
                  variant="body1" 
                  color="var(--color-text-secondary)" 
                  sx={{ mb: 3, minHeight: 60, display: 'flex', alignItems: 'center' }}
                >
                  {plan.description}
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleSubscribe(plan)}
                  disabled={user?.subscriptionStatus === plan.name.toLowerCase()}
                  sx={{ 
                    bgcolor: plan.isPopular ? 'var(--color-primary)' : 'var(--color-primary)',
                    color: 'var(--color-text-inverse)',
                    py: 1.5,
                    px: 4,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'var(--color-primary-hover)',
                    },
                    mb: 3,
                    width: '100%'
                  }}
                >
                  {user?.subscriptionStatus === plan.name.toLowerCase() ? 'Current Plan' : 'Choose Plan'}
                </Button>

                {/* Features List */}
                <Box sx={{ textAlign: 'left' }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)', fontWeight: 'bold' }}>
                    What's included:
                  </Typography>
                  {plan.features.map((feature, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 1.5,
                        py: 0.5
                      }}
                    >
                      {getFeatureIcon(feature)}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          ml: 1.5, 
                          color: 'var(--color-text-secondary)',
                          flex: 1
                        }}
                      >
                        {feature}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Features Comparison */}
      <Card sx={{ mb: 6 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'var(--color-primary)', textAlign: 'center' }}>
            <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Feature Comparison
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                All Plans Include:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Mobile app access', 'Email support', 'Basic analytics', 'Standard templates'].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ color: 'var(--color-success)', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="var(--color-text-secondary)">
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                Professional & Enterprise:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['Priority support', 'Advanced analytics', 'Lead management', 'CRM integration'].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ color: 'var(--color-success)', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="var(--color-text-secondary)">
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-text-primary)' }}>
                Enterprise Only:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {['24/7 phone support', 'API access', 'White-label options', 'Dedicated account manager'].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckIcon sx={{ color: 'var(--color-success)', fontSize: 20, mr: 1 }} />
                    <Typography variant="body2" color="var(--color-text-secondary)">
                      {feature}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card sx={{ 
        textAlign: 'center', 
        py: 6, 
        background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%)', 
        color: 'var(--color-text-inverse)',
        borderRadius: 3
      }}>
        <CardContent>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}>
            Join thousands of real estate professionals who trust our platform to grow their business.
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/subscription-comparison"
            sx={{ 
              bgcolor: 'var(--color-text-inverse)',
              color: 'var(--color-primary)',
              py: 2,
              px: 6,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: 'var(--color-bg-secondary)',
              }
            }}
          >
            Compare All Plans
          </Button>
        </CardContent>
      </Card>

      {/* Payment Form Dialog */}
      {selectedPlan && (
        <PaymentForm
          open={subscribeDialog}
          onClose={() => {
            setSubscribeDialog(false);
            setSelectedPlan(null);
          }}
          onSuccess={handleSubscribeConfirm}
          plan={selectedPlan}
          billingCycle={showYearly ? 'yearly' : 'monthly'}
        />
      )}
    </Container>
  );
};

export default SubscriptionPlans;