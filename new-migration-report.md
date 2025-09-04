## Mobile/Web Parity Migration Report

Last updated: 2025-09-04

### Context
- Server: `server/` (Express). Routes found: `authRoutes`, `subscriptionRoutes`, `propertyRoutes`, `adminRoutes`, `analyticsRoutes`.
- Web client: `client/` (Vite + React). Uses `axios` with base URL `VITE_API_BASE_URL` fallback to `https://urban-realty-production.up.railway.app/api/v1`.
- Mobile app: `mobile/` (Flutter + Dio). Uses `.env` `API_BASE_URL` with fallback from `ApiConfig.baseUrl`.

### Current Integrations (Web)
- Subscriptions: `/subscriptions`, `/subscriptions/my-subscription`, billing history, upcoming billing, Razorpay (`/subscriptions/razorpay/*`), cancel, invoice download, admin subscription management.
- Admin: `/admin/*` (users, properties, agents, contacts, stats, subscription-analytics, reports export/email, settings, backup/restore, dynamic fields, user-types, media delete).
- Auth: `/auth/*` (register, login, me, update, favorites: add/remove/status/list; recently-viewed list/add).
- Analytics tracking: `/api/v1/analytics/track`, export `/api/v1/analytics/export?format=csv`.
- Properties: `GET /properties`, `GET /properties/:id`, search suggestions, featured, radius, agent properties, contact request, CRUD (auth roles: agent/admin/individual_seller/developer) + media upload.

### Current Integrations (Mobile)
- Centralized `ApiService` with Dio interceptor attaching `Authorization` header from `FlutterSecureStorage`. Retries and normalized errors present. Base URL from env `API_BASE_URL` or `ApiConfig.baseUrl`.
- Implemented services: `auth_service.dart` (`/auth/login`, `/auth/register`, `/auth/me`, `/auth/update`), `favorites_service.dart` (favorites CRUD + status), `property_service.dart` (list, by id, featured, suggestions, CRUD including upload via multipart), `subscription_service.dart` (plans, my-subscription, billing history, upcoming billing, subscribe, cancel, Razorpay key/order/verify, invoice download), `admin_service.dart` (stats, users, properties, agents, verify agent), lightweight `analytics_service.dart` (`/analytics/track`).
- Remaining: Admin endpoints for settings, reports, backup/restore, dynamic fields, user types; analytics dashboard/export; contact requests mgmt; property media delete (admin).

### Gaps Identified
- Mobile lacks concrete API method implementations for many web features (subscriptions, admin dashboards, analytics, favorites/recently-viewed, invoices, settings, backups/restores, dynamic fields, user types, property CRUD/media upload, search suggestions, featured).
- Ensure consistent base URL and versioning: All clients should target `/api/v1`.

### Plan
1) Audit endpoints and features across web and mobile, produce mapping.
2) Unify API configuration: env naming and base URL per environment for both clients.
3) Implement missing mobile API methods mirroring web calls (with strong typing and error handling).
4) Add/align mobile screens for roles (admin/agent/user) to match web features.
5) Test flows end-to-end; fix auth/token refresh and error UX.
6) Keep this report updated after each change.

### Next Steps
- In progress: Audit web endpoints and features.
- Pending: Audit mobile feature and API usage; parity mapping; unify API config variables.

### Credentials for manual verification
- admin: email `tanmay@gmail.com`, password `123456`
- agent: email `mrudul@gmail.com`, password `123456`

### Change Log
- Initial report created. Discovered key server routes and client base URLs.
- [Mobile] Consolidated duplicate `SubscriptionService` in `mobile/lib/services/subscription_service.dart` into a single singleton with full parity methods (plans, subscribe, billing, cancel, Razorpay, invoice download, payment method update).
- [Mobile] Added `getRaw` helper to `mobile/lib/services/http_client.dart` to support byte responses for invoice download.
 - [Config] Added `.env.example` files for `client` and `mobile` with unified base URL.

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
- [Mobile] Added `SubscriptionService` in `mobile/lib/services/subscription_service.dart` implementing all server endpoints: list plans, subscribe, my-subscription, cancel, upcoming billing, billing history, update payment method, and Razorpay (key, order, verify).

### Pending Work
- Evaluate whether admin, agent, developer features need full mobile parity; design and implement role-guarded screens as required.
- Extend analytics parity across properties search/view, favorites, inquiries, add property, and admin actions.
- Ensure media upload parity and any missing endpoints in mobile services.

### Next Implementation Targets
- Wire new `SubscriptionService` into mobile UI (create list/manage/subscribe screens).
- Add invoice download if exposed, and Razorpay checkout flow on mobile.

