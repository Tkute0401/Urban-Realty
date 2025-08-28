import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import {
  Payment as PaymentIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import axios from '../../services/axios';

const RazorpayPayment = ({ 
  open, 
  onClose, 
  subscription, 
  billingCycle, 
  onSuccess, 
  onError 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [subscriptionId, setSubscriptionId] = useState(null);

  const steps = [
    'Create Order',
    'Process Payment',
    'Verify Payment',
    'Complete'
  ];

  useEffect(() => {
    if (open && subscription) {
      setCurrentStep(0);
      setError(null);
      setOrderData(null);
      setPaymentStatus('pending');
    }
  }, [open, subscription]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post('/payments/create-order', {
        subscriptionId: subscription._id,
        billingCycle
      });

      if (response.data.success) {
        setOrderData(response.data.data);
        setSubscriptionId(response.data.data.subscriptionId);
        setCurrentStep(1);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create payment order';
      setError(errorMessage);
      onError?.(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initializePayment = (orderData) => {
    if (!window.Razorpay) {
      setError('Razorpay not loaded. Please refresh the page.');
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Urban Realty',
      description: `${subscription.name} Subscription - ${billingCycle}`,
      order_id: orderData.orderId,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: localStorage.getItem('userName') || '',
        email: localStorage.getItem('userEmail') || '',
        contact: localStorage.getItem('userPhone') || ''
      },
      theme: {
        color: '#1976d2'
      },
      modal: {
        ondismiss: function() {
          setPaymentStatus('cancelled');
          setCurrentStep(2);
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Failed to initialize payment. Please try again.');
      console.error('Payment initialization error:', err);
    }
  };

  const handlePaymentSuccess = async (response) => {
    try {
      setPaymentStatus('processing');
      setCurrentStep(2);

      const verifyResponse = await axios.post('/payments/verify', {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        subscriptionId
      });

      if (verifyResponse.data.success) {
        setPaymentStatus('success');
        setCurrentStep(3);
        onSuccess?.(verifyResponse.data.data);
        
        // Auto close after 3 seconds
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        throw new Error(verifyResponse.data.message || 'Payment verification failed');
      }
    } catch (err) {
      setPaymentStatus('failed');
      const errorMessage = err.response?.data?.message || err.message || 'Payment verification failed';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  };

  const handleStartPayment = async () => {
    try {
      const orderData = await createOrder();
      if (orderData) {
        initializePayment(orderData);
      }
    } catch (err) {
      // Error already handled in createOrder
    }
  };

  const handleClose = () => {
    if (paymentStatus === 'processing') {
      return; // Prevent closing during payment processing
    }
    onClose();
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box textAlign="center" py={3}>
            <PaymentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Ready to Subscribe?
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              You're about to subscribe to the {subscription?.name} plan with {billingCycle} billing.
            </Typography>
            
            <Card variant="outlined" sx={{ mt: 2, mb: 3 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Plan
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight="medium">
                      {subscription?.name}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Billing Cycle
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Chip 
                      label={billingCycle} 
                      color="primary" 
                      size="small" 
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Amount
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h6" color="primary" fontWeight="bold">
                      ₹{billingCycle === 'yearly' 
                        ? Math.round(subscription?.price * 12 * 0.8) 
                        : subscription?.price}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              size="large"
              onClick={handleStartPayment}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <PaymentIcon />}
            >
              {loading ? 'Creating Order...' : 'Proceed to Payment'}
            </Button>
          </Box>
        );

      case 1:
        return (
          <Box textAlign="center" py={3}>
            <PaymentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Payment Gateway
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Razorpay payment gateway is opening. Please complete your payment to continue.
            </Typography>
            <CircularProgress />
          </Box>
        );

      case 2:
        return (
          <Box textAlign="center" py={3}>
            {paymentStatus === 'processing' && (
              <>
                <CircularProgress sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Verifying Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Please wait while we verify your payment...
                </Typography>
              </>
            )}
            
            {paymentStatus === 'success' && (
              <>
                <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom color="success.main">
                  Payment Successful!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your subscription has been activated successfully.
                </Typography>
              </>
            )}
            
            {paymentStatus === 'failed' && (
              <>
                <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom color="error.main">
                  Payment Failed
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {error || 'Something went wrong with your payment.'}
                </Typography>
              </>
            )}
            
            {paymentStatus === 'cancelled' && (
              <>
                <ScheduleIcon sx={{ fontSize: 60, color: 'warning.main', mb: 2 }} />
                <Typography variant="h6" gutterBottom color="warning.main">
                  Payment Cancelled
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  You cancelled the payment. You can try again anytime.
                </Typography>
              </>
            )}
          </Box>
        );

      case 3:
        return (
          <Box textAlign="center" py={3}>
            <CheckCircleIcon sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom color="success.main">
              Welcome to {subscription?.name}!
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Your subscription is now active. You can access all the features included in your plan.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This dialog will close automatically in a few seconds.
            </Typography>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={paymentStatus === 'processing'}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            Subscription Payment
          </Typography>
          {currentStep > 0 && (
            <Stepper activeStep={currentStep} alternativeLabel size="small">
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
        </Box>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {getStepContent(currentStep)}
      </DialogContent>

      <DialogActions>
        {currentStep === 0 && (
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
        )}
        
        {currentStep === 2 && paymentStatus === 'failed' && (
          <Button onClick={() => setCurrentStep(0)} color="primary">
            Try Again
          </Button>
        )}
        
        {currentStep === 2 && paymentStatus === 'cancelled' && (
          <Button onClick={() => setCurrentStep(0)} color="primary">
            Try Again
          </Button>
        )}
        
        {currentStep === 3 && (
          <Button onClick={onClose} color="primary" variant="contained">
            Close
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default RazorpayPayment;