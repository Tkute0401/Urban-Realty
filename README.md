# Urban-Realty
Property dealing website

## Payments & Subscriptions

Configure these environment variables on the server:

- STRIPE_SECRET_KEY
- STRIPE_PUBLISHABLE_KEY
- STRIPE_WEBHOOK_SECRET
- FRONTEND_URL (e.g., http://localhost:5173)

Stripe setup steps:
- Create Products and recurring Prices (monthly/yearly) in Stripe.
- Save `stripeProductId`, `stripePriceIdMonthly`, `stripePriceIdYearly` on `Subscription` documents.
- Add webhook endpoint to Stripe dashboard: `/api/v1/payments/webhook` using `STRIPE_WEBHOOK_SECRET`.
