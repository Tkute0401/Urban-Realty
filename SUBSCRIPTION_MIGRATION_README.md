# Subscription Migration and Access Control System

This document describes the implementation of subscription handling for existing users and the new access control system for premium features.

## Overview

The system automatically handles existing users who don't have a `subscriptionStatus` field by:
1. Assigning them to the "free" plan by default
2. Creating proper UserSubscription records
3. Implementing access control for premium features

## Migration Process

### Automatic Migration
When the server starts, it automatically runs a migration script that:
- Finds all users without a `subscriptionStatus` field
- Assigns them to the "free" plan
- Creates UserSubscription records for tracking
- Updates the database schema

### Manual Migration
You can also run the migration manually:

```bash
cd server
node utils/migrateExistingUsers.js
```

## New Middleware

### Subscription Access Control
The system provides middleware to control access to premium features:

```javascript
const { 
  requireSubscription, 
  requireAdvancedSearch, 
  requireAnalytics,
  requireCustomBranding,
  requireApiAccess,
  checkListingLimit,
  requirePrioritySupport 
} = require('../middleware/subscriptionAccess');

// Require specific subscription level
router.get('/premium-feature', protect, requireSubscription('premium', 'Premium feature'), controller.premiumFeature);

// Check specific features
router.get('/advanced-search', protect, requireAdvancedSearch, controller.advancedSearch);
router.get('/analytics', protect, requireAnalytics, controller.analytics);
```

### Usage Examples

```javascript
// In your routes
const { requireSubscription, checkListingLimit } = require('../middleware/subscriptionAccess');

// Require basic subscription for property creation
router.post('/properties', protect, checkListingLimit(5), propertyController.createProperty);

// Require premium for analytics
router.get('/analytics', protect, requireSubscription('premium', 'Analytics'), analyticsController.getAnalytics);
```

## New API Endpoints

### Check Feature Access
```
GET /api/v1/subscriptions/check-feature/:feature
```
Check if a user can access a specific feature.

**Features:**
- `advancedSearch` - Requires basic plan
- `analytics` - Requires premium plan
- `customBranding` - Requires enterprise plan
- `apiAccess` - Requires enterprise plan
- `prioritySupport` - Requires premium plan

### Check Listing Limit
```
GET /api/v1/subscriptions/listing-limit
```
Check user's current listing count and limits.

## Utility Functions

### subscriptionUtils.js
Provides helper functions for subscription operations:

```javascript
const { 
  getUserSubscriptionInfo,
  canAccessFeature,
  checkListingLimit,
  upgradeUserPlan,
  downgradeToFree 
} = require('../utils/subscriptionUtils');

// Get user's subscription info
const subscriptionInfo = await getUserSubscriptionInfo(userId);

// Check feature access
const hasAccess = await canAccessFeature(userId, 'analytics');

// Check listing limits
const limitInfo = await checkListingLimit(userId);
```

## User Model Updates

### New Methods
The User model now includes methods for subscription checking:

```javascript
// Check subscription level
const hasAccess = user.hasSubscription('premium');

// Check specific feature
const canAccess = user.canAccessFeature('analytics');

// Get subscription info
const info = user.getSubscriptionInfo();
```

### Automatic Defaults
- New users automatically get 'free' subscription status
- Existing users are migrated to 'free' plan
- The `subscriptionStatus` field is now required

## Database Schema Changes

### User Model
- `subscriptionStatus` is now required with default 'free'
- Added methods for subscription checking

### UserSubscription Model
- Tracks subscription history and status
- Includes billing information and limits

## Access Control Implementation

### Feature Access Matrix
| Feature | Free | Basic | Premium | Enterprise |
|---------|------|-------|---------|------------|
| Browse Properties | ✅ | ✅ | ✅ | ✅ |
| Contact Agents | ✅ | ✅ | ✅ | ✅ |
| Advanced Search | ❌ | ✅ | ✅ | ✅ |
| Property Listings | ❌ | 5 | 25 | 100 |
| Analytics | ❌ | ❌ | ✅ | ✅ |
| Priority Support | ❌ | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ❌ | ✅ |
| API Access | ❌ | ❌ | ❌ | ✅ |

### Implementation in Controllers
```javascript
// Example: Property creation with listing limit check
exports.createProperty = [
  protect,
  checkListingLimit(0), // 0 means no listings allowed for free users
  asyncHandler(async (req, res, next) => {
    // Property creation logic
  })
];

// Example: Analytics with premium requirement
exports.getAnalytics = [
  protect,
  requireSubscription('premium', 'Analytics dashboard'),
  asyncHandler(async (req, res, next) => {
    // Analytics logic
  })
];
```

## Error Handling

### Access Denied Errors
When users try to access premium features without proper subscription:

```json
{
  "success": false,
  "error": "Access denied. Analytics dashboard requires a premium subscription or higher. Your current plan: free"
}
```

### Listing Limit Errors
When users exceed their listing limits:

```json
{
  "success": false,
  "error": "You have reached your listing limit of 5 properties. Please upgrade your plan to add more listings."
}
```

## Testing

### Run Migration
```bash
cd server
node utils/migrateExistingUsers.js
```

### Test Subscription Routes
```bash
# Check subscription status
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/subscriptions/my-subscription

# Check feature access
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/subscriptions/check-feature/analytics

# Check listing limits
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/v1/subscriptions/listing-limit
```

## Security Considerations

1. **Authentication Required**: All subscription endpoints require valid JWT tokens
2. **User Isolation**: Users can only access their own subscription information
3. **Admin Controls**: Only admins can modify subscription plans and user subscriptions
4. **Automatic Migration**: Existing users are safely migrated without data loss

## Troubleshooting

### Common Issues

1. **Migration Fails**: Ensure subscriptions are seeded first
2. **Access Denied**: Check user's subscription status
3. **Database Errors**: Verify MongoDB connection and schema

### Debug Commands
```bash
# Check user subscription status
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
mongoose.connect(process.env.MONGO_URI).then(async () => {
  const users = await User.find({}).select('email subscriptionStatus');
  console.log(users);
  process.exit(0);
});
"
```

## Future Enhancements

1. **Subscription Expiry Handling**: Automatic downgrade when subscriptions expire
2. **Usage Analytics**: Track feature usage for billing purposes
3. **Webhook Integration**: Payment provider webhooks for subscription updates
4. **Trial Periods**: Free trial periods for new users
5. **Bulk Operations**: Admin tools for bulk subscription management