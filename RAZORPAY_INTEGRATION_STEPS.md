## Razorpay Subscription Integration: Owner Setup Guide

Follow these steps to enable and verify Razorpay payments in this project.

### 1) Create/Get Razorpay Credentials
- Log in to Razorpay Dashboard.
- Go to Settings → API Keys.
- Generate or copy:
  - RAZORPAY_KEY_ID
  - RAZORPAY_KEY_SECRET

Keep the Secret safe and never commit it to source control.

### 2) Set Server Environment Variables
Add the credentials to the server environment. For local development, add to `server/.env` (or your platform’s env settings in production):

```
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

Restart the server after updating environment variables.

### 3) Confirm Server Endpoints
These endpoints are already added under `api/v1/subscriptions`:
- `GET /razorpay/key` → Returns public key to client
- `POST /razorpay/order` → Creates order for a selected plan and billing cycle
- `POST /razorpay/verify` → Verifies signature, marks subscription as active

No additional code changes needed; just ensure env vars are set.

### 4) Frontend Domain and CORS
Make sure your deployed frontend domain is allowed by the API server CORS settings. If you restrict origins, include your production and staging domains.

### 5) Currency and Amounts
- Orders are created in INR; Razorpay expects amounts in paise (already handled).
- UI shows INR when using Razorpay flows.

### 6) Test the Flow (Staging)
1. Ensure you are logged in on the frontend.
2. Visit the plans page `/subscriptions`.
3. Choose a paid plan and select billing cycle.
4. Razorpay Checkout should open. Complete a test payment using Razorpay’s test cards in Test Mode.
5. On success, the app calls `POST /razorpay/verify` and activates the subscription.
6. Verify on the management page `/subscription-management` that status is Active and Payment shows Paid.

### 7) Webhooks (Optional but Recommended)
Set up a Razorpay webhook to handle edge cases like delayed or asynchronous payment events:
- Go to Dashboard → Settings → Webhooks.
- Add an endpoint (e.g., `https://your-api.com/api/v1/subscriptions/razorpay/webhook`).
- Subscribe to relevant events: `payment.captured`, `payment.failed`, `order.paid`.
- Add a Webhook Secret and store it on the server (e.g., `RAZORPAY_WEBHOOK_SECRET`).
- Implement server-side validation using the webhook secret and update subscription/payment status accordingly (not included by default; add if needed).

### 8) Deployment Checklist
- Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in your hosting platform.
- Rebuild/restart the server.
- Confirm the client base URL in `client/src/services/axios.js` points to your API (`/api/v1`).
- Smoke test paid plan purchase end-to-end.

### 9) Troubleshooting
- "Failed to load Razorpay":
  - Ensure client can reach `https://checkout.razorpay.com/v1/checkout.js` and no Content Security Policy blocks it.
- "Invalid payment signature":
  - Confirm server has correct `RAZORPAY_KEY_SECRET` and system time is correct.
- Order created but subscription not active:
  - Verify `POST /razorpay/verify` is called and returns success.
  - Check logs for signature verification errors.
- CORS issues:
  - Add your frontend domain(s) to allowed origins on the API server.

### 10) Where Code Lives
- Server
  - `server/utils/razorpay.js` → SDK instance + signature verification.
  - `server/controllers/paymentController.js` → key, order, verification handlers.
  - `server/routes/subscriptionRoutes.js` → routes mounted under `/api/v1/subscriptions`.
  - `server/models/UserSubscription.js` → fields for Razorpay ids/signature and payment status.
- Client
  - `client/src/components/Subscription/SubscriptionPlans.jsx` → launches Razorpay Checkout and verifies payment.
  - `client/src/components/Subscription/SubscriptionManagement.jsx` → displays payment and subscription status.

You’re set. Add your keys, redeploy, and run a test transaction to confirm end-to-end payments.

