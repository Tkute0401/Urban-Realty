'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
import FieldIndicator from '@/components/ui/FieldIndicator';

interface PaymentFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (paymentData: any) => void;
  plan: {
    id: string;
    name: string;
    price: number;
    description: string;
  };
  billingCycle: 'monthly' | 'yearly';
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  open,
  onClose,
  onSuccess,
  plan,
  billingCycle
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    zipCode: ''
  });
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [savePaymentMethod, setSavePaymentMethod] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Real payment processing with Razorpay or other payment gateway
      const response = await fetch('/api/v1/payments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          planId: plan.id,
          billingCycle,
          paymentMethod,
          amount: billingCycle === 'yearly' ? plan.price * 12 * 0.8 : plan.price
        })
      });

      if (!response.ok) {
        throw new Error('Payment creation failed');
      }

      const paymentData = await response.json();
      onSuccess(paymentData);
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
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

          {/* Payment Method Selection */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Payment Method</InputLabel>
            <Select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <MenuItem value="card">Credit/Debit Card</MenuItem>
              <MenuItem value="paypal">PayPal</MenuItem>
              <MenuItem value="bank">Bank Transfer</MenuItem>
            </Select>
          </FormControl>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                Card Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FieldIndicator required helperText="16-digit card number" />
                  <TextField
                    fullWidth
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({
                      ...cardDetails, 
                      number: formatCardNumber(e.target.value)
                    })}
                    required
                    inputProps={{ maxLength: 19 }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <FieldIndicator required helperText="MM/YY format" />
                  <TextField
                    fullWidth
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) => setCardDetails({
                      ...cardDetails, 
                      expiry: formatExpiry(e.target.value)
                    })}
                    required
                    inputProps={{ maxLength: 5 }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <FieldIndicator required helperText="3-4 digit security code" />
                  <TextField
                    fullWidth
                    label="CVV"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({
                      ...cardDetails, 
                      cvv: e.target.value.replace(/\D/g, '').substring(0, 4)
                    })}
                    required
                    inputProps={{ maxLength: 4 }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FieldIndicator required helperText="Name as it appears on card" />
                  <TextField
                    fullWidth
                    label="Cardholder Name"
                    placeholder="John Doe"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({
                      ...cardDetails, 
                      name: e.target.value
                    })}
                    required
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FieldIndicator required helperText="Billing ZIP code" />
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    placeholder="12345"
                    value={cardDetails.zipCode}
                    onChange={(e) => setCardDetails({
                      ...cardDetails, 
                      zipCode: e.target.value.replace(/\D/g, '').substring(0, 10)
                    })}
                    required
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Billing Address */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Billing Address
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FieldIndicator required helperText="Complete street address" />
                <TextField
                  fullWidth
                  label="Street Address"
                  placeholder="123 Main St"
                  value={billingAddress.street}
                  onChange={(e) => setBillingAddress({
                    ...billingAddress, 
                    street: e.target.value
                  })}
                  required
                />
              </Grid>
              
              <Grid item xs={6}>
                <FieldIndicator required helperText="City name" />
                <TextField
                  fullWidth
                  label="City"
                  placeholder="New York"
                  value={billingAddress.city}
                  onChange={(e) => setBillingAddress({
                    ...billingAddress, 
                    city: e.target.value
                  })}
                  required
                />
              </Grid>
              
              <Grid item xs={3}>
                <FieldIndicator required helperText="State abbreviation" />
                <TextField
                  fullWidth
                  label="State"
                  placeholder="NY"
                  value={billingAddress.state}
                  onChange={(e) => setBillingAddress({
                    ...billingAddress, 
                    state: e.target.value.toUpperCase().substring(0, 2)
                  })}
                  required
                />
              </Grid>
              
              <Grid item xs={3}>
                <FieldIndicator required helperText="ZIP code" />
                <TextField
                  fullWidth
                  label="ZIP Code"
                  placeholder="10001"
                  value={billingAddress.zipCode}
                  onChange={(e) => setBillingAddress({
                    ...billingAddress, 
                    zipCode: e.target.value.replace(/\D/g, '').substring(0, 10)
                  })}
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Options */}
          <Box sx={{ mb: 3 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={savePaymentMethod}
                  onChange={(e) => setSavePaymentMethod(e.target.checked)}
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
              label="Save payment method for future use"
            />
          </Box>

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
                    sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                  >
                    Terms of Service
                  </Button>
                  {' '}and{' '}
                  <Button 
                    variant="text" 
                    size="small" 
                    sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}
                  >
                    Privacy Policy
                  </Button>
                </Typography>
              }
            />
          </Box>

          {/* Security Notice */}
          <Alert severity="info" sx={{ mb: 2 }}>
            <SecurityIcon sx={{ mr: 1 }} />
            Your payment information is secure and encrypted. We use industry-standard security measures.
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={onClose}
            disabled={loading}
            sx={{ color: 'var(--color-text-secondary)' }}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            variant="contained"
            disabled={loading || !agreedToTerms}
            sx={{ 
              bgcolor: 'var(--color-primary)',
              '&:hover': {
                bgcolor: 'var(--color-primary-hover)',
              }
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <>
                <CheckIcon sx={{ mr: 1 }} />
                Complete Payment (₹{getTotalPrice().toFixed(2)})
              </>
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PaymentForm;