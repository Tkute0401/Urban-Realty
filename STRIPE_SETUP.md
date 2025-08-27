## Stripe Payments and Subscriptions Setup

This guide walks you through configuring Stripe for this project, wiring environment variables, setting up webhook endpoints, mapping Stripe Prices to plans, and testing the complete subscription flow.

### 1) Prerequisites
- Stripe account
- Stripe Dashboard access (`https://dashboard.stripe.com`)
- Backend running from `server/server.js`
- Frontend running from `client` (Vite)

### 2) Create Products and Prices in Stripe
In Stripe Dashboard:
- Create a Product per plan (e.g., Basic, Premium, Enterprise)
- For each Product, create two recurring Prices:
  - Monthly: recurring, interval=month
  - Yearly: recurring, interval=year (commonly discounted)

Copy the resulting Price IDs (e.g., `price_123...`). You will map these into your `Subscription` documents.

### 3) Environment Variables
Create/update the following environment variables.

Backend (`server/.env` or process environment):
- `STRIPE_SECRET_KEY=sk_live_or_test_key`
- `STRIPE_WEBHOOK_SECRET=whsec_...` (from step 5)
- `FRONTEND_URL=http://localhost:5173` (dev) or your production URL

Frontend (`client/.env`):
- `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key`

Ensure your process manager/docker injects these vars in production.

### 4) Code Integration Points (Backend)
- Route mounting: `server/server.js`
  - `POST /api/v1/payments/checkout` (auth required)
  - `GET /api/v1/payments/portal` (auth required)
  - `POST /api/v1/payments/webhook` (no auth; raw body)

- Raw body for webhook: already configured in `server/server.js`:
```12:18:server/server.js
// Stripe webhook requires raw body
app.use('/api/v1/payments/webhook', bodyParser.raw({ type: 'application/json' }));
```

- Payment controller: `server/controllers/paymentController.js`
  - Creates Checkout session for subscriptions using mapped Stripe Price IDs
  - Creates Stripe Billing Portal session
  - Handles Stripe webhooks: `checkout.session.completed`, `invoice.payment_failed`, `customer.subscription.deleted`

```1:20:server/controllers/paymentController.js
const Stripe = require('stripe');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Subscription = require('../models/Subscription');
const UserSubscription = require('../models/UserSubscription');
const User = require('../models/User');

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Stripe: STRIPE_SECRET_KEY is missing. Set it in your environment.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20'
});
```

### 5) Configure the Webhook in Stripe Dashboard
In Stripe Dashboard > Developers > Webhooks:
- Add an endpoint pointing to your backend:
  - Dev: `http://localhost:5000/api/v1/payments/webhook`
  - Prod: `https://your-domain.com/api/v1/payments/webhook`
- Subscribe to events:
  - `checkout.session.completed`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`
- After creating, copy the Signing secret and set `STRIPE_WEBHOOK_SECRET` in backend env.

Local testing alternative:
```bash
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
```
Copy the `whsec_...` value the CLI prints and set it as `STRIPE_WEBHOOK_SECRET`.

### 6) Map Stripe Prices to Plans
Your Mongo `Subscription` documents should include:
- `stripePriceIdMonthly`
- `stripePriceIdYearly`

Ensure these fields are filled with the IDs created in step 2. The backend selects the proper Price based on `billingCycle`.

### 7) Endpoints and Flow
- Create Checkout Session: `POST /api/v1/payments/checkout`
  - Body: `{ subscriptionId: string, billingCycle: 'monthly'|'yearly' }`
  - Requires `Authorization: Bearer <jwt>`
  - Returns `{ id, url }`, then frontend redirects via Stripe.js

- Customer Billing Portal: `GET /api/v1/payments/portal`
  - Requires auth; returns `{ url }`

- Webhook: `POST /api/v1/payments/webhook`
  - Verifies signature using `STRIPE_WEBHOOK_SECRET`
  - Activates `UserSubscription` on successful checkout

### 8) Frontend Integration
- Stripe.js usage already in `client/src/components/Subscription/SubscriptionPlans.jsx`
  - Reads `VITE_STRIPE_PUBLISHABLE_KEY`
  - Calls `/payments/checkout` then `redirectToCheckout({ sessionId })`

```70:89:client/src/components/Subscription/SubscriptionPlans.jsx
// Create Stripe Checkout session via backend
const { data } = await axios.post('/payments/checkout', {
  subscriptionId: selectedPlan._id,
  billingCycle
});
const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripe = await loadStripe(publishableKey);
await stripe.redirectToCheckout({ sessionId: data.data.id });
```

Post-checkout redirects are configured in backend controller:
- Success: `${FRONTEND_URL}/billing-dashboard?success=true`
- Cancel: `${FRONTEND_URL}/subscriptions?canceled=true`

Use these query params in your pages to show user feedback.

### 9) Testing Checklist
1. Set env vars (backend + frontend). Restart both apps.
2. Ensure `Subscription` docs have Stripe Price IDs.
3. Visit `/subscriptions` and start a paid plan checkout.
4. Complete test payment (use Stripe test cards, e.g., 4242 4242 4242 4242).
5. Confirm:
   - Webhook receives `checkout.session.completed`
   - `UserSubscription` transitions from `pending` to `active`
   - User’s `subscriptionStatus` updates
   - `/billing-dashboard` shows success and upcoming billing info
6. Open Billing Portal from Subscription Management to validate customer portal access.

### 10) Production Notes
- Use live keys and live webhooks in production.
- Lock down CORS and verify `FRONTEND_URL`.
- Monitor webhook failures in Stripe Dashboard.
- Never log secrets. Avoid storing raw card data; rely on Stripe.

### 11) Troubleshooting
- 400 at webhook: ensure raw body parsing is used for the webhook route only, and `STRIPE_WEBHOOK_SECRET` matches.
- Redirect errors: verify `VITE_STRIPE_PUBLISHABLE_KEY` and that the Price IDs are correct.
- Session created but status not active: confirm webhook fires and DB update logic in `paymentController` runs.

