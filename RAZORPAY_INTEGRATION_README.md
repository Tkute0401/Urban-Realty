# Razorpay Payment Gateway Integration

## Overview
This document explains how to set up and use the Razorpay payment gateway integration for subscription payments in the Urban Realty platform.

## Features
- ✅ Create payment orders for subscriptions
- ✅ Process payments securely with signature verification
- ✅ Handle webhooks for payment events
- ✅ Support for monthly and yearly billing cycles
- ✅ Automatic subscription activation after successful payment
- ✅ Payment status tracking and management
- ✅ Subscription cancellation with refund support

## Prerequisites
1. Razorpay account (https://razorpay.com/)
2. Node.js 18+ and npm
3. MongoDB database
4. Environment variables configured

## Setup Instructions

### 1. Install Dependencies
```bash
npm install razorpay
```

### 2. Environment Configuration
Create a `.env` file in the server directory with the following variables:

```env
# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

**How to get Razorpay credentials:**
1. Log in to your Razorpay Dashboard
2. Go to Settings → API Keys
3. Generate a new key pair
4. Copy the Key ID and Key Secret
5. For webhook secret, go to Settings → Webhooks and create a new webhook

### 3. Database Schema Updates
The integration automatically updates the `UserSubscription` model with Razorpay-specific fields:
- `razorpayOrderId`: Razorpay order ID
- `razorpayPaymentId`: Razorpay payment ID
- `razorpaySignature`: Payment verification signature
- `paymentGateway`: Payment gateway identifier

### 4. Webhook Configuration
In your Razorpay Dashboard, configure webhooks for the following events:
- `payment.captured`
- `payment.failed`
- `subscription.activated` (if using subscriptions)
- `subscription.cancelled` (if using subscriptions)

Webhook URL: `https://yourdomain.com/api/payments/webhook`

## API Endpoints

### 1. Create Payment Order
```http
POST /api/payments/create-order
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "subscriptionId": "subscription_id_here",
  "billingCycle": "monthly" // or "yearly"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "order_xyz123",
    "amount": 99900,
    "currency": "INR",
    "subscriptionId": "user_subscription_id",
    "keyId": "your_razorpay_key_id"
  }
}
```

### 2. Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "razorpay_order_id": "order_xyz123",
  "razorpay_payment_id": "pay_abc456",
  "razorpay_signature": "payment_signature_here",
  "subscriptionId": "user_subscription_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully. Subscription activated.",
  "data": {
    "subscriptionId": "user_subscription_id",
    "status": "active",
    "endDate": "2024-02-15T10:30:00.000Z"
  }
}
```

### 3. Get Payment Status
```http
GET /api/payments/status/:subscriptionId
Authorization: Bearer <jwt_token>
```

### 4. Cancel Subscription
```http
POST /api/payments/cancel/:subscriptionId
Authorization: Bearer <jwt_token>
```

### 5. Webhook Handler
```http
POST /api/payments/webhook
Content-Type: application/json
X-Razorpay-Signature: webhook_signature_here

{
  "event": "payment.captured",
  "payload": { ... }
}
```

## Frontend Integration

### 1. Install Razorpay Checkout
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. Create Payment Flow
```javascript
// Step 1: Create order
const createOrder = async (subscriptionId, billingCycle) => {
  try {
    const response = await fetch('/api/payments/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ subscriptionId, billingCycle })
    });
    
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error creating order:', error);
  }
};

// Step 2: Initialize Razorpay checkout
const initializePayment = (orderData) => {
  const options = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'Urban Realty',
    description: 'Subscription Payment',
    order_id: orderData.orderId,
    handler: function (response) {
      // Handle successful payment
      verifyPayment(response, orderData.subscriptionId);
    },
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone
    },
    theme: {
      color: '#3399cc'
    }
  };
  
  const rzp = new Razorpay(options);
  rzp.open();
};

// Step 3: Verify payment
const verifyPayment = async (response, subscriptionId) => {
  try {
    const verifyResponse = await fetch('/api/payments/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        subscriptionId
      })
    });
    
    const data = await verifyResponse.json();
    if (data.success) {
      // Payment successful, redirect or show success message
      alert('Payment successful! Your subscription is now active.');
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
  }
};

// Complete payment flow
const handleSubscription = async (subscriptionId, billingCycle) => {
  const orderData = await createOrder(subionId, billingCycle);
  if (orderData) {
    initializePayment(orderData);
  }
};
```

## Security Features

### 1. Payment Signature Verification
- All payments are verified using Razorpay's signature verification
- Prevents payment tampering and ensures data integrity

### 2. Webhook Signature Verification
- Webhook events are verified using the webhook secret
- Ensures webhook authenticity and prevents unauthorized access

### 3. JWT Authentication
- All payment endpoints require valid JWT tokens
- User-specific payment operations are isolated

### 4. Input Validation
- All payment inputs are validated and sanitized
- Prevents injection attacks and invalid data

## Testing

### 1. Test Mode
Use Razorpay test credentials for development:
- Test cards: https://razorpay.com/docs/payments/payment-gateway/test-mode/
- Test UPI: test@upi
- Test net banking: Any bank

### 2. Test Webhooks
Use tools like ngrok to test webhooks locally:
```bash
ngrok http 5000
```

## Production Deployment

### 1. Environment Variables
Ensure all Razorpay credentials are properly set in production:
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. SSL Certificate
Ensure your domain has a valid SSL certificate for secure payment processing.

### 3. Webhook URL
Update webhook URL in Razorpay Dashboard to your production domain.

## Error Handling

### Common Errors and Solutions

1. **"Payment gateway not configured"**
   - Check environment variables
   - Ensure Razorpay credentials are set

2. **"Invalid payment signature"**
   - Verify Razorpay key secret
   - Check payment verification logic

3. **"Webhook signature verification failed"**
   - Verify webhook secret
   - Check webhook URL configuration

4. **"Subscription not found"**
   - Verify subscription ID
   - Check user authentication

## Monitoring and Logging

### 1. Payment Logs
All payment operations are logged for debugging and monitoring.

### 2. Webhook Events
Webhook events are logged with detailed information.

### 3. Error Tracking
Payment errors are logged with stack traces for debugging.

## Support

For technical support:
1. Check Razorpay documentation: https://razorpay.com/docs/
2. Review server logs for error details
3. Verify environment configuration
4. Test with Razorpay test credentials

## Changelog

### v1.0.0 (Current)
- Initial Razorpay integration
- Payment order creation and verification
- Webhook handling for payment events
- Subscription management with payments
- Security features and validation

## Future Enhancements

- [ ] Recurring payment support
- [ ] Multiple payment method support
- [ ] Payment analytics and reporting
- [ ] Automated refund processing
- [ ] Payment retry mechanisms
- [ ] Advanced webhook event handling