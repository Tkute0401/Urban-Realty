'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  CreditCard as CreditCardIcon,
  Security as SecurityIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { useRazorpayKey, useCreateRazorpayOrderMutation, useVerifyRazorpayPaymentMutation } from '@/hooks/api/subscriptions';

// Extend Window type to include Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
  plan: {
    _id: string;
    name: string;
    price: number;
    description: string;
  };
  billingCycle: 'monthly' | 'yearly';
}

const RazorpayPaymentForm: React.FC<RazorpayPaymentFormProps> = ({
  open,
  onClose,
  onSuccess,
  plan,
  billingCycle
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const { data: razorpayKeyData, isLoading: keyLoading } = useRazorpayKey();
  const createOrderMutation = useCreateRazorpayOrderMutation();
  const verifyPaymentMutation = useVerifyRazorpayPaymentMutation();

  useEffect(() => {
    // Load Razorpay script
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setRazorpayLoaded(true);
      };
      script.onerror = () => {
        setError('Failed to load Razorpay. Please check your internet connection.');
      };
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }

    // No cleanup needed
    return () => {};
  }, []);

  const getTotalPrice = () => {
    if (billingCycle === 'yearly') {
      return plan.price * 12 * 0.8; // 20% discount
    }
    return plan.price;
  };

  const getSavings = () => {
    if (billingCycle === 'yearly') {
      return plan.price * 12 * 0.2; // 20% savings
    }
    return 0;
  };

  const handlePayment = async () => {
    if (!agreedToTerms) {
      setError('Please accept the terms and conditions to proceed');
      return;
    }

    if (!razorpayLoaded || !window.Razorpay) {
      setError('Razorpay is not loaded. Please refresh the page and try again.');
      return;
    }

    if (!razorpayKeyData?.key) {
      setError('Payment system configuration error. Please try again later.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create order on backend
      const orderData = await createOrderMutation.mutateAsync({
        subscriptionId: plan._id,
        billingCycle
      });

      const { order } = orderData;

      // Configure Razorpay options
      const options = {
        key: razorpayKeyData.key,
        amount: order.amount,
        currency: order.currency,
        name: 'Squarefooot',
        description: `${plan.name} Subscription (${billingCycle})`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            await verifyPaymentMutation.mutateAsync({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            onSuccess({
              orderId: order.id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              amount: getTotalPrice(),
              currency: 'INR',
              status: 'success',
              plan: plan.name,
              billingCycle
            });
          } catch (error) {
            console.error('Payment verification failed:', error);
            setError('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: 'User Name',
          email: 'user@example.com',
          contact: '9999999999'
        },
        notes: {
          subscription_id: plan._id,
          billing_cycle: billingCycle,
          plan_name: plan.name
        },
        theme: {
          color: '#3f51b5'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
          },
          // Add settings to handle permission policy issues
          hide_topbar: false,
          escape: true,
          confirm_close: true,
          backdrop_close: true
        },
        // Additional options for better compatibility
        config: {
          display: {
            language: 'en'
          }
        }
      };

      try {
        // Open Razorpay payment modal
        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.on('payment.failed', function (response: any) {
          console.error('Payment failed:', response.error);
          setError(`Payment failed: ${response.error.description || 'Unknown error'}`);
          setLoading(false);
        });
        
        razorpayInstance.open();
      } catch (razorpayError: any) {
        console.error('Razorpay initialization error:', razorpayError);
        setError('Payment system initialization failed. Please refresh the page and try again.');
        setLoading(false);
      }

    } catch (error: any) {
      console.error('Payment initiation failed:', error);
      setError(error.message || 'Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
        <CreditCardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Complete Your Payment
      </DialogTitle>
      
      <DialogContent>
        {/* Plan Summary */}
        <Card sx={{ mb: 3, bgcolor: 'var(--color-bg-secondary)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              Order Summary
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">
                {plan.name} Plan ({billingCycle})
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                ₹{billingCycle === 'yearly' ? `${(plan.price * 12).toFixed(2)}` : `${plan.price}`}
              </Typography>
            </Box>
            {billingCycle === 'yearly' && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" color="var(--color-success)">
                  Yearly Discount (20%)
                </Typography>
                <Typography variant="body2" color="var(--color-success)" sx={{ fontWeight: 'bold' }}>
                  -₹{getSavings().toFixed(2)}
                </Typography>
              </Box>
            )}
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Total
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>
                ₹{getTotalPrice().toFixed(2)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Security Information */}
        <Card sx={{ mb: 3, bgcolor: 'var(--color-bg-light)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SecurityIcon sx={{ color: 'var(--color-success)', mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Secure Payment
              </Typography>
            </Box>
            <Typography variant="body2" color="var(--color-text-secondary)">
              Your payment is processed securely through Razorpay. We use industry-standard encryption to protect your financial information.
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {['256-bit SSL Encryption', 'PCI DSS Compliant', 'Bank-level Security'].map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <CheckIcon sx={{ color: 'var(--color-success)', fontSize: 16, mr: 0.5 }} />
                  <Typography variant="body2" color="var(--color-text-secondary)">
                    {feature}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Terms and Conditions */}
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
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
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Button 
                  variant="text" 
                  size="small" 
                  sx={{ p: 0, minWidth: 'auto', textTransform: 'none', color: 'var(--color-primary)' }}
                >
                  Terms of Service
                </Button>
                {' '}and{' '}
                <Button 
                  variant="text" 
                  size="small" 
                  sx={{ p: 0, minWidth: 'auto', textTransform: 'none', color: 'var(--color-primary)' }}
                >
                  Privacy Policy
                </Button>
              </Typography>
            }
          />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Loading States */}
        {(keyLoading || !razorpayLoaded) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CircularProgress size={20} sx={{ mr: 2 }} />
              Loading payment system...
            </Box>
          </Alert>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose} 
          disabled={loading}
          sx={{ color: 'var(--color-text-secondary)' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          variant="contained"
          disabled={loading || !agreedToTerms || keyLoading || !razorpayLoaded}
          startIcon={loading ? <CircularProgress size={20} /> : <CreditCardIcon />}
          sx={{
            bgcolor: 'var(--color-primary)',
            color: 'var(--color-text-inverse)',
            px: 4,
            py: 1,
            fontSize: '1rem',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: 'var(--color-primary-hover)',
            },
          }}
        >
          {loading ? 'Processing...' : `Pay ₹${getTotalPrice().toFixed(2)}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RazorpayPaymentForm;