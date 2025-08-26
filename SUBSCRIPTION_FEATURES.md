# Urban Realty - Subscription Model & New Roles

## Overview
This update adds a comprehensive subscription model and new professional roles to the Urban Realty platform, enabling users to access different service tiers and professional services.

## New Features

### 1. Subscription Model

#### Subscription Plans
- **Free Plan**: Basic access to browse properties and contact agents
- **Basic Plan** ($9.99/month): 5 property listings, advanced search features
- **Premium Plan** ($29.99/month): 25 property listings, priority support, analytics
- **Enterprise Plan** ($99.99/month): 100 property listings, custom branding, API access

#### Features by Plan
- Property listing limits
- Advanced search capabilities
- Priority customer support
- Analytics and insights
- Custom branding options
- API access for integrations
- Multi-user support

#### Billing Options
- Monthly billing
- Yearly billing with 20% discount
- Multiple payment methods (Credit Card, Debit Card, Bank Transfer)

### 2. New Professional Roles

#### Available Roles
- **Buyer**: Property buyers (existing)
- **Real Estate Agent**: Licensed real estate professionals (existing)
- **Painter**: Professional painting services
- **Interior Designer**: Interior design and decoration services
- **Lawyer**: Legal services related to real estate
- **Admin**: System administrators (existing)

#### Professional Information Fields
For professional roles (painter, interior designer, lawyer, agent), users can provide:
- License number
- Years of experience
- Specializations (comma-separated)
- Certifications (comma-separated)
- Business name
- Business address
- Business phone
- Business website

### 3. Technical Implementation

#### Backend Models
- `Subscription`: Defines subscription plans and features
- `UserSubscription`: Tracks individual user subscriptions
- Updated `User`: Includes subscription status and professional info

#### API Endpoints
- `GET /api/subscriptions`: List all available plans
- `POST /api/subscriptions/subscribe`: Subscribe to a plan
- `GET /api/subscriptions/my-subscription`: Get user's current subscription
- `PUT /api/subscriptions/cancel`: Cancel subscription
- Admin endpoints for managing plans and payment status

#### Frontend Components
- `SubscriptionPlans`: Display and manage subscription options
- `UserProfile`: Enhanced user profile with subscription details
- Updated `Register`: Professional role registration with additional fields

## Usage

### For Users
1. **Registration**: Choose a role and provide professional information if applicable
2. **Subscription**: Browse plans and subscribe to upgrade features
3. **Profile Management**: Update professional information and manage subscriptions
4. **Role-Specific Features**: Access features based on role and subscription level

### For Administrators
1. **Plan Management**: Create, update, and manage subscription plans
2. **Payment Processing**: Update payment status and manage subscriptions
3. **User Management**: Monitor user subscriptions and professional information

## Database Schema

### Subscription Collection
```javascript
{
  name: String,
  type: Enum['free', 'basic', 'premium', 'enterprise'],
  price: Number,
  billingCycle: Enum['monthly', 'yearly'],
  features: {
    propertyListings: Number,
    advancedSearch: Boolean,
    prioritySupport: Boolean,
    analytics: Boolean,
    customBranding: Boolean,
    apiAccess: Boolean
  },
  maxUsers: Number,
  isActive: Boolean
}
```

### UserSubscription Collection
```javascript
{
  user: ObjectId,
  subscription: ObjectId,
  status: Enum['active', 'inactive', 'cancelled', 'expired', 'pending'],
  startDate: Date,
  endDate: Date,
  billingCycle: String,
  amount: Number,
  paymentStatus: String
}
```

### Updated User Collection
```javascript
{
  // ... existing fields
  role: Enum['buyer', 'agent', 'admin', 'painter', 'interior_designer', 'lawyer'],
  currentSubscription: ObjectId,
  subscriptionStatus: String,
  subscriptionExpiry: Date,
  professionalInfo: {
    licenseNumber: String,
    yearsOfExperience: Number,
    specializations: [String],
    certifications: [String],
    businessName: String,
    businessAddress: String,
    businessPhone: String,
    businessWebsite: String
  }
}
```

## Setup Instructions

### 1. Database Seeding
Run the subscription seeder to populate default plans:
```bash
node server/utils/seedSubscriptions.js
```

### 2. Environment Variables
Ensure these environment variables are set:
- `MONGO_URI`: MongoDB connection string
- `JWT_SECRET`: JWT signing secret
- `JWT_EXPIRE`: JWT expiration time

### 3. API Routes
The subscription routes are automatically mounted in `server/app.js`:
```javascript
app.use('/api/subscriptions', subscriptionRoutes);
```

## Security Features

- Role-based access control for subscription management
- Admin-only access to plan creation and payment status updates
- JWT authentication for all subscription operations
- Input validation and sanitization for all endpoints

## Future Enhancements

- Payment gateway integration (Stripe, PayPal)
- Automated billing and renewal
- Subscription analytics and reporting
- Role-based feature restrictions
- Professional verification system
- Service marketplace integration

## Support

For technical support or questions about the subscription model, please refer to the API documentation or contact the development team.