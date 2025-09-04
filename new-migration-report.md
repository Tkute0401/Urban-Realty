## Mobile Parity Migration Report

Owner: AI Assistant (Cursor)  
Scope: Align `mobile` app features and APIs with `client` (web) app using the same `server` APIs.

### Current State (Initial Assessment)
- Server base URL used by both web and mobile:
  - Web client: `client/src/services/axios.js` baseURL `https://urban-realty-production.up.railway.app/api/v1`
  - Mobile client: `mobile/lib/services/api_service.dart` baseUrl `https://urban-realty-production.up.railway.app/api/v1`
- Web uses Axios with interceptors for auth and error handling.
- Mobile uses Dio with secure storage, auth header injection, retry and normalized errors.

### Endpoint Inventory (from web usage)
- Favorites: `/auth/favorites/:propertyId` (GET status, PUT add, DELETE remove)
- Subscriptions:
  - `/subscriptions` (GET plans)
  - `/subscriptions/subscribe` (POST)
  - `/subscriptions/my-subscription` (GET)
  - `/subscriptions/billing-history` (GET)
  - `/subscriptions/upcoming-billing` (GET)
  - `/subscriptions/cancel` (PUT)
  - Razorpay: `/subscriptions/razorpay/key` (GET), `/subscriptions/razorpay/order` (POST), `/subscriptions/razorpay/verify` (POST)
  - Invoices: `/subscriptions/invoice/:subscriptionId/download` (GET blob)
- Admin:
  - `/admin/subscription-plans` (CRUD)
  - `/admin/subscriptions` (GET), `/admin/subscriptions/:id/status` (PUT)
  - `/admin/settings` (GET/PUT), `/admin/backup` (POST), `/admin/restore/:id` (POST)
  - `/admin/reports` (GET, export, email)
  - `/admin/users?role=agent` (GET), `/admin/users/:id` (DELETE), `/admin/users/:id/status` (PATCH)
  - `/admin/properties/stats` (GET)
  - `/admin/inquiries` (GET/PATCH/DELETE)
  - `/admin/media` and `/admin/media/upload` (GET/POST)
- User:
  - `/api/auth/update` (PUT) and `/auth/me` (GET) used elsewhere
- Properties:
  - `/properties` (GET list with query)
  - `/properties/search-suggestions` (GET)
  - `/properties/featured` (GET)
  - `/properties/:id` (GET)
  - Authenticated create/update/delete/photo endpoints present server-side

### Mobile Current Coverage
- Implemented services in Flutter/Dart:
  - `auth_service.dart`: login/register/me/update
  - `property_service.dart`: list, suggestions, featured, get by id, CRUD
  - `favorites_service.dart`: list, add, remove, status
  - `api_service.dart`: base client, token injection, retry
- Gaps identified:
  - Subscription flows (plans, subscribe, billing, Razorpay, invoices) not present in mobile services/screens.
  - Admin flows largely web-only (may be out of scope for mobile or require role-gated mobile screens).
  - Analytics events: web posts to `/api/v1/analytics/*`; mobile parity TBD.

### Decisions and Approach
- Preserve a single API surface: no server changes required for parity.
- Unify base URL configuration via environment on both platforms to enable staging/prod switching.
- Port web features to mobile incrementally, starting with subscriptions and any missing core flows.
- Maintain role-gated functionality: admin-only routes may be excluded from consumer mobile app unless required.

### Action Plan
1) Unify API client configuration with env support across web and mobile.
2) Implement subscription services and UI on mobile to match web features.
3) Ensure properties, favorites, media upload, contact/inquiry flows are functionally equivalent.
4) Add analytics parity on mobile if required.
5) QA: test parity scenarios with provided accounts.
6) Documentation and CI/CD updates.

### Next Steps
- Create env-driven config for base URLs (`client` and `mobile`).
- Add mobile services for subscriptions and necessary UI screens.
- Map web flows to mobile navigation and permissions.

### Notes
- Live web at `www.squarefooot.com`; credentials provided for admin and agent testing.

### Change Log
- [Init] Created report and captured current inventory and gaps.
- [Config] Web now reads API base URL from `VITE_API_BASE_URL` in `client/src/services/axios.js` with production fallback.
- [Config] Mobile `ApiService` now reads `API_BASE_URL` from `.env` with fallback to `ApiConfig.baseUrl`.
- [Mobile] Wired `SubscriptionScreen` to live APIs using `SubscriptionService` for: list plans (GET `/subscriptions`) and subscribe (POST `/subscriptions/subscribe`). Removed mock data.
- [Mobile] Added `SubscriptionManagementScreen` to manage current plan, cancel, view upcoming billing, and billing history, with invoice download (bytes response) via `/subscriptions/*` endpoints.
- [Mobile] Added `AnalyticsService` posting to `/analytics/track` to capture `mobile_subscription_viewed` and `mobile_subscription_subscribed` events. Integrated in `SubscriptionScreen`.
- [Mobile] Updated routing in `main.dart` to include `/subscription/manage`, and linked from `ProfileScreen` quick access.

### Pending Work
- Evaluate whether admin, agent, developer features need full mobile parity; design and implement role-guarded screens as required.
- Extend analytics parity across properties search/view, favorites, inquiries, add property, and admin actions.
- Ensure media upload parity and any missing endpoints in mobile services.

