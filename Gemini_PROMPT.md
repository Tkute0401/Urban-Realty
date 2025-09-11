# Urban Realty – Mobile Migration Prompt (Copy/Paste for AI Codegen)
_Date: 2025-09-01 09:35 UTC_

You are an expert **Flutter** engineer integrating with a **Node.js/Express** backend. Your task is to **achieve feature parity** between the React web app (`/client`) and the Flutter app (`/mobile`) **reusing the same REST API** served by `/server`.

## Project Context
- Monorepo with `server` (Express/Mongoose), `client` (React 19, Vite, MUI, Tailwind), `mobile` (Flutter, Provider, Dio/HTTP).
- API base URL (production): `https://urban-realty-production.up.railway.app/api/v1`
- Auth via JWT, roles: `buyer`, `individual_seller`, `agent`, `developer`, `admin`.
- Key domains: Users, Properties, Developers, Contacts/Leads, Media, Subscriptions/Billing (Razorpay), Admin & Agent dashboards.

> **Important:** Some uploaded source files appear truncated with `...`. When inferring types/shapes, prefer server **models** and **controllers** as single source of truth. Validate assumptions by hitting the **routes** documented below.

## Deliverables
Implement or complete the following in Flutter. Use **Provider** for state. Use **Dio** for requests with interceptors (auth token, retries, FormData for multipart). Use **flutter_secure_storage** for tokens.

### 1) Auth & Onboarding
- Screens: Login, Register, Profile, Settings, Splash/Bootstrap.
- Persist JWT in secure storage, auto-inject as `Authorization: Bearer <token>`.
- Role-aware navigation guards (admin/agent/developer routes).
- Error states: invalid creds, network offline, server unreachable.
- Session restore & logout.

### 2) Property Discovery & Details
- Property List with server-side filters/sort/pagination matching web:
  - Query params: price, bedrooms, bathrooms, type, furnishing, city, locality, verified, featured, min/max area, etc.
  - Search suggestions/autocomplete (`GET /properties/search-suggestions`).
- Property Details:
  - Gallery (cached images), map (geolocation), key facts/amenities.
  - Contact/Inquiry CTA (posts to contact/inquiry endpoint).
  - Favorite/Unfavorite (persist to user profile if supported).
- Add/Edit Property (role-gated):
  - Form with validation mirroring web client (title, description, price, address, location, propertyType, bedrooms/bathrooms, area, amenities, images).
  - **Multipart upload** to match server’s Multer/Cloudinary (`images[]`, etc.).
  - Draft & retry for unstable connectivity.

### 3) Developers Directory
- List, Details, Add/Edit Developer (role-gated).
- Logo upload via multipart (`PUT /developers/:id/logo`).

### 4) Subscriptions & Billing
- Fetch plans (`GET /subscriptions`).
- Start purchase: Razorpay order creation (server endpoint), payment capture, signature verification (server).
- Billing dashboard with current plan, usage/limits, invoices.
- Grace periods & expired states per `UserSubscription` model.

### 5) Contacts/Leads & Inquiries
- Create contact/inquiry from property details and contact pages.
- Admin list & detail of inquiries (mirroring `/admin` tables in web).

### 6) Admin & Agent Dashboards (Mobile parity)
- **Admin**: dashboard metrics, analytics, users, properties, contacts, media, reports, settings, subscription management.
- **Agent**: dashboard, properties, leads, analytics, inquiries, settings.
- Implement read/write actions with role-based guards.
- Provide responsive master/detail layouts suitable for mobile.

### 7) Static & Support Pages
- About, Contact, Help, Privacy, Terms, Career, Trust & Safety, How We Work, Services (Lawyer, Packers/Movers, Interior), EMI Calculator.
- Use the same content endpoints if dynamic; otherwise ship as local content with update hooks.

### 8) Networking Architecture
- **Dio client**: base URL from env; 30s timeout; JSON; FormData auto-conversion for file fields.
- Request interceptor adds `Authorization` if token present.
- Response interceptor handles 401 → logout/refresh flow; parse server `ErrorResponse` shape.
- **NetworkService** to check internet reachability and server health (already partially present).

### 9) State & Caching
- `AuthProvider`, `PropertiesProvider`, `[Developers|Subscriptions|Contacts]Provider`.
- Normalize lists by `_id`; keep paging cursors; cache last successful filter query.
- Offline cache of last viewed property & developer details; retry queue for mutations.

### 10) UI/UX
- Material 3 theming; light/dark themes; match brand palette from web (Tailwind/MUI theme).
- Reusable widgets: `PropertyCard`, `Shimmer/Skeleton`, `ErrorView`, `EmptyState`, `RetryButton`, `NetworkBanner`.
- Accessibility: large text support, min tap targets, semantic labels.
- Pull-to-refresh and infinite scroll where applicable.

### 11) Testing
- Unit tests for providers (auth, properties), services (auth, subscriptions).
- Widget tests for `PropertyCard`, lists, forms.
- Integration tests for critical flows: login → add property → upload images → list refresh.

### 12) Security & Privacy
- Secure token storage; never log tokens.
- Validate file types and size before upload.
- Handle PII in contact forms; mask sensitive fields when rendering logs.
- Prevent IDOR by always relying on server auth checks.

### 13) Telemetry & Crash Reporting
- Add app-level error boundary; send crash reports to preferred service.
- User consent & privacy toggles.

### 14) Performance
- Image caching & lazy loading.
- Debounced search; incremental rendering for long lists.
- Use `ListView.builder`/`Sliver` lists; avoid jank in animations.

---

## API SURFACE (from `/server/routes/*.js`)
- Treat the following as canonical. If a file contains `...`, keep path structure but confirm exact parameter names via controller code or manual request.


**server/routes/adminRoutes.js**
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`
- `GET /properties`
- `GET /properties/stats`
- `GET /properties/:id`
- `DELETE /properties/:id`
- `GET /agents`
- `GET /agents/:id`
- `PUT /agents/:id/verify`
- `GET /contacts`
- `GET /contacts/stats`
- `GET /contacts/:id`
- `DELETE /contacts/:id`
- `GET /stats`
- `GET /analytics`
- `GET /subscription-analytics`
- `GET /reports`
- `GET /reports/export`
- `POST /reports/email`
- `GET /settings`
- `PUT /settings`
- `POST /backup`
- `POST /restore/:id`
- `GET /fields`
- `GET /fields/:entityType`
- `POST /fields`
- `PUT /fields/:id`
- `DELETE /fields/:id`
- `PUT /fields/reorder`
- `GET /user-types`
- `GET /user-types/:id`
- `POST /user-types`
- `PUT /user-types/:id`
- `DELETE /user-types/:id`
- `DELETE /media/:id`

**server/routes/authRoutes.js**
- `POST /register`
- `POST /login`
- `GET /me`
- `PUT /update`
- `GET /favorites`
- `GET /recently-viewed`
- `PUT /favorites/:propertyId`
- `DELETE /favorites/:propertyId`
- `GET /favorites/:propertyId/status`
- `PUT /favorites/:propertyId`
- `POST /recently-viewed/:propertyId`

**server/routes/contactRoutes.js**
- `POST /property/:propertyId`
- `GET /agent`
- `PUT /:id`
- `GET /`
- `DELETE /:id`

**server/routes/developerRoutes.js**
- (Endpoints present but not fully parsed due to chaining or truncated source.)

**server/routes/mediaRoutes.js**
- `POST /:entityType/:entityId`
- `GET /:entityType/:entityId`
- `DELETE /:id`

**server/routes/propertyRoutes.js**
- `GET /`
- `GET /search-suggestions`
- `GET /featured`
- `GET /radius/:zipcode/:distance`
- `GET /agent/:id`
- `POST /:id/contact`
- `POST /`
- `PUT /:id`
- `DELETE /:id`
- `PUT /:id/photo`
- `GET /:id`

**server/routes/subscriptionRoutes.js**
- `GET /`
- `GET /my-subscription`
- `GET /check-feature/:feature`
- `GET /listing-limit`
- `GET /billing-history`
- `GET /upcoming-billing`
- `POST /subscribe`
- `PUT /cancel`
- `PUT /payment-method`
- `GET /razorpay/key`
- `POST /razorpay/order`
- `POST /razorpay/verify`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`
- `PUT /:id/payment-status`


---

## Feature Parity Checklist (Web → Mobile)
Mark each as ✅ when implemented & verified:

- Auth: Login ✅ / Register ✅ / Profile ✅ / Role guard ✅
- Home/Discover: Featured ✅ / Recent ✅ / Suggestions ✅
- Search/Filters: Price ✅ / Beds ✅ / Baths ✅ / Type ✅ / Area ✅ / City/Locality ✅ / Verified ✅ / Featured ✅ / Pagination ✅
- Property Details: Gallery ✅ / Map ✅ / Amenities ✅ / Contact CTA ✅ / Favorite ✅
- Add/Edit Property: Form ✅ / Multipart upload ✅ / Drafts ✅
- Developers: List ✅ / Details ✅ / Add/Edit ✅ / Logo upload ✅
- Subscriptions: Plans ✅ / Purchase (Razorpay) ✅ / Signature verify ✅ / Billing Dashboard ✅ / Invoices ✅
- Contacts/Leads: Create ✅ / Admin list ✅ / Detail ✅
- Admin: Dashboard ✅ / Analytics ✅ / Users ✅ / Properties ✅ / Contacts ✅ / Media ✅ / Reports ✅ / Settings ✅ / Subscription management ✅
- Agent: Dashboard ✅ / Properties ✅ / Leads ✅ / Analytics ✅ / Inquiries ✅ / Settings ✅
- Static/Support pages ✅
- Notifications (optional enhancement) ✅
- Offline cache & retry (enhancement) ✅

---

## Coding Standards
- Dart: effective_dart, null-safety, provider patterns.
- REST errors: surface human-readable messages; preserve server `message` field.
- Files: use `FormData` with correct field names to match Multer/Cloudinary; compress images client-side if needed.
- Avoid hard-coded strings; centralize endpoints and timeouts in `ApiConfig`.
- All network calls cancellable; timeouts 30s; exponential backoff retries for idempotent GETs.

---

## Acceptance Criteria
- All listed features are reachable in-app for appropriate roles, with the **same behavior** as web.
- 0 crash on typical flows; 90+ Lighthouse-like UX score analog (smooth frames).
- Network loss does not corrupt local state; user sees actionable errors.
- Subscriptions flow completes and invoices appear.
- All admin and agent screens show correct data and allow allowed mutations.

