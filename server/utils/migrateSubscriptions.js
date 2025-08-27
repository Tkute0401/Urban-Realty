const mongoose = require('mongoose');
const Subscription = require('../models/Subscription');

// Default content for known plans. Adjust as needed.
const planDefaultsByType = {
  free: {
    description: 'Basic access to browse properties and contact agents',
    features: {
      propertyListings: 0,
      advancedSearch: false,
      prioritySupport: false,
      analytics: false,
      customBranding: false,
      apiAccess: false
    },
    maxUsers: 1,
    isActive: true
  },
  basic: {
    description: 'Perfect for individual professionals starting out',
    features: {
      propertyListings: 5,
      advancedSearch: true,
      prioritySupport: false,
      analytics: false,
      customBranding: false,
      apiAccess: false
    },
    maxUsers: 1,
    isActive: true
  },
  premium: {
    description: 'Ideal for growing businesses and teams',
    features: {
      propertyListings: 25,
      advancedSearch: true,
      prioritySupport: true,
      analytics: true,
      customBranding: false,
      apiAccess: false
    },
    maxUsers: 3,
    isActive: true
  },
  enterprise: {
    description: 'Full-featured plan for large organizations',
    features: {
      propertyListings: 100,
      advancedSearch: true,
      prioritySupport: true,
      analytics: true,
      customBranding: true,
      apiAccess: true
    },
    maxUsers: 10,
    isActive: true
  }
};

function coalesce(currentValue, fallbackValue) {
  return currentValue === undefined || currentValue === null ? fallbackValue : currentValue;
}

async function migrateSubscriptions() {
  const subs = await Subscription.find();
  let updated = 0;

  for (const sub of subs) {
    const defaults = planDefaultsByType[sub.type] || {};

    // Ensure description, features, maxUsers, isActive, billingCycle
    sub.description = coalesce(sub.description, defaults.description || '');
    sub.features = {
      propertyListings: coalesce(sub.features?.propertyListings, defaults.features?.propertyListings ?? 0),
      advancedSearch: coalesce(sub.features?.advancedSearch, defaults.features?.advancedSearch ?? false),
      prioritySupport: coalesce(sub.features?.prioritySupport, defaults.features?.prioritySupport ?? false),
      analytics: coalesce(sub.features?.analytics, defaults.features?.analytics ?? false),
      customBranding: coalesce(sub.features?.customBranding, defaults.features?.customBranding ?? false),
      apiAccess: coalesce(sub.features?.apiAccess, defaults.features?.apiAccess ?? false)
    };
    sub.maxUsers = coalesce(sub.maxUsers, defaults.maxUsers || 1);
    sub.isActive = coalesce(sub.isActive, true);
    sub.billingCycle = sub.billingCycle || 'monthly';

    // Stripe fields: keep existing if present, otherwise leave blank
    sub.stripeProductId = sub.stripeProductId || '';
    sub.stripePriceIdMonthly = sub.stripePriceIdMonthly || '';
    sub.stripePriceIdYearly = sub.stripePriceIdYearly || '';

    await sub.save();
    updated++;
    console.log(`Updated subscription '${sub.name}' (${sub.type}).`);
  }

  console.log(`Done. Updated ${updated} subscription plan documents.`);
}

module.exports = { migrateSubscriptions };

// Allow running directly: NODE_OPTIONS=... node server/utils/migrateSubscriptions.js
if (require.main === module) {
  (async () => {
    try {
      const uri = process.env.MONGO_URI || 'mongodb+srv://tanmay:1234@urbanrealty.rbqbb.mongodb.net/?retryWrites=true&w=majority&appName=UrbanRealty';
      await mongoose.connect(uri);
      console.log('MongoDB Connected');
      await migrateSubscriptions();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('Migration error:', err);
      process.exit(1);
    }
  })();
}

