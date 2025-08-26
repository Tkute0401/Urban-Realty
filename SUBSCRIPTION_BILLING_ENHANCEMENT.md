# Subscription Billing Enhancement

This document outlines the comprehensive improvements made to the subscription and billing system, including better subscription change handling, invoice generation, and billing details display.

## Overview

The subscription system has been enhanced with the following key features:

1. **Invoice Generation System** - Complete invoice management with automatic generation
2. **Subscription Change Handling** - Smart upgrade/downgrade logic with proration
3. **Billing Details Dashboard** - Comprehensive billing information display
4. **Enhanced API Endpoints** - New endpoints for invoice and billing management

## New Models

### Invoice Model (`server/models/Invoice.js`)

A comprehensive invoice model that handles:

- **Invoice Numbering**: Automatic generation with year-based format (INV-2024-000001)
- **Billing Details**: Complete invoice information including items, taxes, discounts
- **Status Tracking**: Draft, sent, paid, overdue, cancelled, refunded
- **Invoice Types**: Initial, renewal, upgrade, downgrade, refund
- **Payment Tracking**: Transaction IDs, payment dates, due dates

#### Key Features:
- Automatic invoice number generation
- Support for multiple currencies
- Tax and discount calculations
- Detailed item breakdown
- Payment status tracking
- Virtual fields for formatted display

### Invoice Service (`server/utils/invoiceService.js`)

A utility service that provides:

- **Invoice Generation**: Create invoices for different subscription events
- **Subscription Upgrades**: Handle upgrades with proration calculations
- **Subscription Downgrades**: Handle downgrades with effective date management
- **Billing Details**: Comprehensive billing information retrieval
- **Payment Processing**: Mark invoices as paid and update subscription status

## Enhanced Subscription Controller

### New Endpoints

#### 1. Get Billing Details
```
GET /api/v1/subscriptions/billing-details
```
Returns comprehensive billing information including:
- Current subscription details
- Invoice history
- Billing summary with totals
- Outstanding amounts

#### 2. Get User Invoices
```
GET /api/v1/subscriptions/invoices?page=1&limit=10
```
Returns paginated list of user invoices with:
- Invoice details
- Status information
- Payment history
- Pagination metadata

#### 3. Get Specific Invoice
```
GET /api/v1/subscriptions/invoices/:id
```
Returns detailed invoice information including:
- Complete invoice details
- Item breakdown
- Payment information
- Billing period details

#### 4. Mark Invoice as Paid
```
PUT /api/v1/subscriptions/invoices/:id/mark-paid
```
Marks an invoice as paid and updates subscription status.

#### 5. Change Subscription Plan
```
PUT /api/v1/subscriptions/change-plan
```
Handles subscription plan changes with:
- Automatic upgrade/downgrade detection
- Proration calculations
- Invoice generation
- Subscription status updates

### Enhanced Subscribe Endpoint

The existing subscribe endpoint has been enhanced to:
- Automatically detect plan changes
- Handle upgrades with proration
- Handle downgrades with effective date management
- Generate appropriate invoices
- Return detailed change information

## Frontend Components

### BillingDetails Component (`client/src/components/Subscription/BillingDetails.jsx`)

A comprehensive billing dashboard that displays:

#### Billing Summary
- Total paid amount
- Outstanding balance
- Next billing date and amount
- Total invoice count

#### Current Subscription
- Plan details
- Billing cycle information
- Expiration date
- Status indicators

#### Invoice Management
- Invoice history table
- Detailed invoice view with item breakdown
- Payment status management
- Pagination support

#### Billing History
- Complete subscription history
- Plan changes over time
- Amount tracking

### SubscriptionChange Component (`client/src/components/Subscription/SubscriptionChange.jsx`)

A user-friendly interface for changing subscription plans:

#### Plan Selection
- Visual plan comparison
- Current plan highlighting
- Plan selection with visual feedback

#### Billing Cycle Options
- Monthly vs yearly comparison
- Savings calculation for yearly plans
- Interactive selection interface

#### Change Summary
- Detailed cost breakdown
- Proration calculations for upgrades
- Effective date information for downgrades
- Final amount calculation

#### Confirmation Process
- Change confirmation dialog
- Invoice generation notification
- Proration credit display
- Success feedback

## Subscription Change Logic

### Upgrade Process

1. **Detection**: Automatically detects when user selects a higher-tier plan
2. **Proration Calculation**: 
   - Calculates unused portion of current subscription
   - Applies credit to new subscription cost
   - Determines final amount to charge
3. **Subscription Update**: 
   - Cancels current subscription
   - Creates new subscription with immediate effect
   - Updates user subscription status
4. **Invoice Generation**: Creates upgrade invoice with proration details

### Downgrade Process

1. **Detection**: Automatically detects when user selects a lower-tier plan
2. **Effective Date**: 
   - Downgrade takes effect at end of current billing period
   - Current subscription remains active until expiration
3. **New Subscription**: 
   - Creates new subscription starting from next billing cycle
   - Maintains current subscription until expiration
4. **Invoice Generation**: Creates downgrade invoice for next billing cycle

### Proration Formula

```
Days Remaining = (End Date - Current Date) / (24 * 60 * 60 * 1000)
Total Days = (End Date - Start Date) / (24 * 60 * 60 * 1000)
Unused Amount = (Current Amount / Total Days) * Days Remaining
Proration Credit = Unused Amount
Final Amount = New Amount - Proration Credit
```

## Invoice Generation

### Automatic Invoice Creation

Invoices are automatically generated for:
- **Initial Subscriptions**: When user first subscribes
- **Plan Upgrades**: With proration calculations
- **Plan Downgrades**: For next billing cycle
- **Renewals**: For recurring billing

### Invoice Structure

Each invoice includes:
- **Header Information**: Invoice number, dates, billing period
- **Customer Details**: User information
- **Subscription Details**: Plan information and billing cycle
- **Item Breakdown**: Detailed line items with descriptions
- **Financial Summary**: Subtotal, taxes, discounts, total
- **Payment Information**: Due date, payment method, status

### Invoice Items

Standard invoice items include:
- Subscription plan cost
- Yearly discount (if applicable)
- Tax calculations
- Proration credits (for upgrades)
- Additional charges or credits

## API Response Examples

### Billing Details Response
```json
{
  "success": true,
  "data": {
    "currentSubscription": {
      "_id": "...",
      "subscription": {
        "name": "Premium Plan",
        "type": "premium"
      },
      "amount": 29.99,
      "billingCycle": "monthly",
      "status": "active",
      "endDate": "2024-02-15T00:00:00.000Z"
    },
    "invoices": [...],
    "billingHistory": [...],
    "summary": {
      "totalPaid": 89.97,
      "totalOutstanding": 0,
      "nextBillingDate": "2024-02-15T00:00:00.000Z",
      "nextBillingAmount": 29.99,
      "invoiceCount": 3,
      "activeInvoices": 0
    }
  }
}
```

### Subscription Change Response
```json
{
  "success": true,
  "data": {
    "userSubscription": {
      "_id": "...",
      "subscription": {
        "name": "Enterprise Plan",
        "type": "enterprise"
      },
      "amount": 99.99,
      "billingCycle": "monthly",
      "status": "pending"
    },
    "invoice": {
      "_id": "...",
      "invoiceNumber": "INV-2024-000015",
      "total": 70.00,
      "status": "draft"
    },
    "changeType": "upgrade",
    "prorationCredit": 15.00,
    "finalAmount": 70.00
  }
}
```

## Usage Examples

### Frontend Integration

```javascript
// Get billing details
const billingDetails = await subscriptionService.getBillingDetails();

// Get invoices with pagination
const invoices = await subscriptionService.getInvoices(1, 10);

// Change subscription plan
const changeResult = await subscriptionService.changePlan(
  'subscription_id', 
  'monthly'
);

// Mark invoice as paid
await subscriptionService.markInvoiceAsPaid(
  'invoice_id', 
  'transaction_id'
);
```

### Component Usage

```jsx
// Billing details component
<BillingDetails />

// Subscription change component
<SubscriptionChange />
```

## Configuration

### Tax Rate
The tax rate is currently set to 8.5% in the invoice service. This can be configured in `server/utils/invoiceService.js`:

```javascript
// Calculate tax (example: 8.5% tax rate)
tax = subtotal * 0.085;
```

### Yearly Discount
The yearly discount is set to 20% (0.8 multiplier). This can be configured in multiple places:

```javascript
// In subscription controller
amount = subscription.price * 12 * 0.8; // 20% discount for yearly

// In invoice service
const discountedYearlyPrice = yearlyPrice * 0.8; // 20% discount
```

## Security Considerations

1. **User Authorization**: All endpoints verify user ownership of invoices and subscriptions
2. **Admin Access**: Admin users can access all invoices and billing information
3. **Data Validation**: All input data is validated using express-validator
4. **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## Testing

The system includes comprehensive error handling and validation:

1. **Input Validation**: All endpoints validate required fields
2. **Business Logic Validation**: Checks for valid subscription changes
3. **Authorization Checks**: Ensures users can only access their own data
4. **Error Responses**: Detailed error messages for debugging

## Future Enhancements

Potential future improvements:

1. **Payment Gateway Integration**: Connect with Stripe, PayPal, etc.
2. **Automated Billing**: Automatic recurring payment processing
3. **Invoice Templates**: Customizable invoice templates
4. **Email Notifications**: Automated invoice and payment notifications
5. **Analytics Dashboard**: Billing analytics and reporting
6. **Multi-currency Support**: Enhanced currency handling
7. **Tax Calculation**: Dynamic tax calculation based on location
8. **Refund Processing**: Automated refund handling

## Conclusion

This enhancement provides a robust, user-friendly subscription and billing system that handles complex scenarios like proration, plan changes, and invoice management. The system is designed to be scalable, maintainable, and provides a great user experience for both customers and administrators.