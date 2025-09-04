## Mobile/Web Parity Migration Report

Last updated: 2025-09-04 (mobile subscription management enhanced: payment method update, browse plans link)

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
  - Implemented now: Recently Viewed parity (fetch + track) on mobile

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
- Completed: Endpoint inventory and parity mapping.
- Completed: Unify API config variables via `.env.example` in `client` and `mobile`.
- Completed: Wire mobile subscription UI to `SubscriptionService`.
  - Plans list screen wired: `mobile/lib/screens/subscription_screen.dart` (free + paid flow).
  - Razorpay checkout integrated using key/order/verify endpoints.
  - Management screen wired: `mobile/lib/features/subscription/subscription_management_screen.dart` (my-subscription, billing-history, upcoming-billing, cancel, invoice download).
  - Navigation from settings in place.

### Credentials for manual verification
- admin: email `tanmay@gmail.com`, password `123456`
- agent: email `mrudul@gmail.com`, password `123456`

### Change Log
- Initial report created. Discovered key server routes and client base URLs.
- [Mobile] Consolidated duplicate `SubscriptionService` in `mobile/lib/services/subscription_service.dart` into a single singleton with full parity methods (plans, subscribe, billing, cancel, Razorpay, invoice download, payment method update).
- [Mobile] Added `getRaw` helper to `mobile/lib/services/http_client.dart` to support byte responses for invoice download.
- [Config] Added `.env.example` files for `client` and `mobile` with unified base URL.
  - `client/.env.example` with `VITE_API_BASE_URL`
  - `mobile/.env.example` with `API_BASE_URL`
  - Updated `client/README.md` and `mobile/README.md` with environment usage instructions.
  - Added Settings -> Subscription and Billing navigation in mobile.
  - [Mobile] Wired `subscription_screen.dart` to handle free plan direct subscribe and paid plans via Razorpay, added handlers for success/error/external wallet, and verification call.
  - [Mobile] Wired `subscription_management_screen.dart` to fetch current subscription, upcoming billing, billing history; added cancel and invoice download using bytes.
  - [Mobile] Added `RecentlyViewedService` (`mobile/lib/services/recently_viewed_service.dart`) implementing:
    - `GET /auth/recently-viewed` to list items
    - `POST /auth/recently-viewed/:propertyId` to track views (fire-and-forget)
  - [Mobile] Tracked property views in `PropertyDetailScreen` via `RecentlyViewedService().trackViewed(id)`.
  - [Mobile] Added `RecentlyViewedScreen` with route `/recently-viewed` and navigation entry in `ProfileScreen` under user quick access.
  - [Mobile] Favorites parity:
    - Added toggle to `mobile/lib/features/properties/property_detail_screen.dart` using `FavoritesService` (`/auth/favorites/:propertyId` PUT/DELETE and status GET).
    - Added analytics events on mobile via `AnalyticsService().track(...)` for `property_viewed`, `favorite_added`, `favorite_removed`.
    - Enhanced `mobile/lib/screens/favorites_screen.dart` with empty state, and tap to open property detail.
    - Added Favorites quick access links in `mobile/lib/screens/profile_screen.dart`; route `/favorites` already wired in `mobile/lib/main.dart`.

## Current Work In This Run
- Implemented Recently Viewed parity on mobile (service, tracking, screen, routing, nav entry).
- Implemented Favorites parity on mobile (toggle in detail, list screen polish, profile links).
- Added analytics tracking for view and favorite/unfavorite events on mobile.
- Extended analytics parity to search interactions on mobile:
  - Screen view `search_screen_viewed`
  - Typing breadcrumbs `search_typing` (sampled)
  - Clear action `search_cleared`
  - Suggestion tap `search_suggestion_selected`
- Implemented property contact requests on mobile:
  - New `ContactService` at `mobile/lib/services/contact_service.dart` hitting `POST /api/v1/contacts/property/:propertyId`
  - Inquiry flow wired in `PropertyDetailScreen` with a message dialog and success/error toasts
  - Analytics `contact_created` fired on success
  - Agent inquiries management parity on mobile:
    - Added `updateContactStatus` in `mobile/lib/services/agent_service.dart` to call `PUT /api/v1/contacts/:id` with server-supported statuses: `pending`, `contacted`, `followup`, `closed`
    - Updated `AgentInquiriesScreen` to include status actions (Contacted, Follow Up, Closed), status color mapping, and status filter chips; list supports pull-to-refresh and in-place updates on success
 - Subscription management enhancements on mobile (`mobile/lib/features/subscription/subscription_management_screen.dart`):
   - Added Update Payment Method flow invoking `/subscriptions/payment-method`
   - Added "Browse Plans" link to open `/subscription` plans screen
   - Invoice download remains bytes-only confirmation; full file save deferred (requires `path_provider` and platform permissions)

## Immediate Next Steps (Run Order)
1. QA Favorites on mobile: toggle on detail; verify appears in `/favorites` and persists; status reflects correctly on reopen.
2. QA Recently Viewed on mobile: open multiple properties; verify order/cap of 10.
3. QA Search analytics on mobile: verify events emit without blocking UI; suggestion taps recorded.
4. QA Contact flow on mobile: ensure inquiry is created and visible to agent in web/admin; confirm analytics fired.
5. QA Agent inquiries status update on mobile: ensure status changes (`contacted`, `followup`, `closed`) persist and are visible on refresh; test filter chips.
6. QA Subscription management on mobile: payment method update success and error paths; browse plans navigation; cancel flow happy/edge cases; invoice download bytes length sanity.
7. QA with provided admin/agent accounts for subscription + favorites + recently viewed + contact + subscription flows.

## Suggestions for Improvement
- Add shared TypeScript/JSON schema or OpenAPI spec in `shared/` to generate both Axios types and Dart models.
- Introduce feature flags per role to conditionally enable admin/agent-only mobile screens.
- Add e2e tests for subscription flow on mobile using integration test + mock server.
 - Add scroll-based lazy loading and skeletons for Recently Viewed and Favorites lists.
 - Consider merging favorites/recently-viewed into a single "Library" tab for UX parity with web `AccountSidebar` tabs.

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
  - [Config] Added `client/.env.example` and `mobile/.env.example` with base URL settings.

### Pending Work
- Evaluate whether admin, agent, developer features need full mobile parity; design and implement role-guarded screens as required.
- Extend analytics parity across properties search/view, favorites, inquiries, add property, and admin actions.
- Ensure media upload parity and any missing endpoints in mobile services.

### Next Implementation Targets
- Wire new `SubscriptionService` into mobile UI (create list/manage/subscribe screens).
- Add invoice download if exposed, and Razorpay checkout flow on mobile.
- Add `.env` usage docs to `client/README.md` and `mobile/README.md`.
  - Client: document `VITE_API_BASE_URL` usage in `client/README.md`.
  - Mobile: document `API_BASE_URL` and emulator/simulator localhost nuances.

### Implementation Notes (env unification)
- Created `client/.env.example` with `VITE_API_BASE_URL`.
- Created `mobile/.env.example` with `API_BASE_URL`.
- Mobile `ApiService` already reads `API_BASE_URL` via `flutter_dotenv`; `pubspec.yaml` includes `.env` asset.
- Web `axios` reads `VITE_API_BASE_URL` with production fallback.

