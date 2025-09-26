# Squarefooot – Codebase Overview (Generated)
_Date: 2025-09-01 09:35 UTC_

This document summarizes the uploaded Urban-Realty project (server, client, mobile) to help optimization tooling (e.g., Gemini CLI) understand **every feature, major component, and module**.

> **Note on source completeness:** Some files in the uploaded archive appear to include literal `...` truncation inside code bodies. This overview leverages directory structure, file names, and the parsable portions of files to give the most complete map possible. Treat this as authoritative for structure and features, but verify any lines that show `...` in the source.

---

## Monorepo Layout

```
/server    -> Node.js (Express, MongoDB/Mongoose), Auth, Properties, Media, Subscriptions, Payments (Razorpay), Admin & Agent APIs
/client    -> React 19 + Vite + Tailwind + MUI; full-featured web app (user, agent, admin flows)
/mobile    -> Flutter app (Provider, Dio/HTTP, Secure Storage, etc.); targets feature parity with web using same REST APIs
```

---

## Server (Express/Mongoose)

**Key directories**
- `server/app.js`, `server/server.js` – Express bootstrap, middleware, route mounts
- `server/config/db.js` – MongoDB connection
- **Controllers**: `authController.js`, `propertyController.js`, `contactController.js`, `paymentController.js`, `subscriptionController.js`, `adminController.js`, `mediaController.js`, `developers.js`, `dynamicFieldController.js`, `userTypeController.js`
- **Models**: `User.js`, `Property.js`, `Developer.js`, `ContactRequest.js`, `Media.js`, `Subscription.js`, `UserSubscription.js`, `DynamicField.js`, `UserType.js`
- **Routes**: `authRoutes.js`, `propertyRoutes.js`, `contactRoutes.js`, `subscriptionRoutes.js`, `adminRoutes.js`, `mediaRoutes.js`, `developerRoutes.js`
- **Middleware**: `auth.js` (protect/authorize), `advancedResults.js`, `async.js`, `multer.js` (uploads)
- **Utils/Services**: `razorpay.js`, `invoiceGenerator.js`, `sendEmail.js`, `geocoder.js`, `subscriptionUtils.js`, `billingService.js`, `seedSubscriptions.js`, `migrateExistingUsers.js`

**Notable Capabilities**
- User auth & roles (`buyer`, `individual_seller`, `agent`, `developer`, `admin`) with JWTs.
- Properties: search with filters/sorting/pagination, featured, near-me (geocoder), CRUD (role-based), media upload (Cloudinary + Multer).
- Developers: CRUD + logo upload.
- Contacts/Leads: inquiries & contact requests.
- Subscriptions: plans, purchase, status; **Razorpay** order creation & signature verification; invoices.
- Admin: analytics, users/properties management, media management, reports, dynamic fields, user types.
- Email & billing utilities.

**API Endpoints (parsed from route files; partial where source contains `...`)**

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

## Client (React 19 + Vite)

**Core stacks**: React 19, React Router, MUI, Tailwind, Axios (with auth token & FormData auto-handling), Context API providers.

**Top-level routing** (from `src/App.jsx`):
- `/`
- `/login`
- `/register`
- `/properties`
- `/pg`
- `/properties/:id`
- `/about`
- `/contact`
- `/help`
- `/privacy-policy`
- `/terms`
- `/career`
- `/trust`
- `/developers`
- `/developers/:id`
- `/developers/add`
- `/developers/:id/edit`
- `/how-we-work`
- `/lawyer-consultancy`
- `/packers-and-movers`
- `/interior-design`
- `/emi-calculator`
- `/subscriptions`
- `/subscription-management`
- `/subscription-comparison`
- `/billing-dashboard`
- `/admin`
- `analytics`
- `agents`
- `users`
- `properties`
- `contacts`
- `media`
- `reports`
- `settings`
- `subscriptions`
- `/agent`
- `dashboard`
- `properties`
- `leads`
- `analytics`
- `inquiries`
- `settings`
- `/properties/:id/edit`
- `/add-property`
- `/profile`

**Pages** (`client/src/pages/`):
- `client/src/pages/AddProperty/AddProperty.jsx`
- `client/src/pages/Agent/AgentAnalytics.jsx`
- `client/src/pages/Agent/AgentDashboard.jsx`
- `client/src/pages/Agent/AgentLeads.jsx`
- `client/src/pages/Agent/AgentProperties.jsx`
- `client/src/pages/Agent/AgentSettings.jsx`
- `client/src/pages/Agent/Inquiries.jsx`
- `client/src/pages/Auth/Login.jsx`
- `client/src/pages/Auth/Register.jsx`
- `client/src/pages/Developer/AddDeveloperPage.jsx`
- `client/src/pages/Developer/DeveloperCard.jsx`
- `client/src/pages/Developer/DeveloperDetails.jsx`
- `client/src/pages/Developer/DeveloperList.jsx`
- `client/src/pages/Developer/EditDeveloperPage.jsx`
- `client/src/pages/Home/Home.jsx`
- `client/src/pages/Properties/EditProperty.jsx`
- `client/src/pages/Properties/Properties.jsx`
- `client/src/pages/PropertyDetails/ContactDialog.jsx`
- `client/src/pages/PropertyDetails/DeleteConfirmationDialog.jsx`
- `client/src/pages/PropertyDetails/PremiumButton.jsx`
- `client/src/pages/PropertyDetails/PremiumPaper.jsx`
- `client/src/pages/PropertyDetails/PropertyAmenities.jsx`
- `client/src/pages/PropertyDetails/PropertyDetails.jsx`
- `client/src/pages/PropertyDetails/PropertyDeveloper.jsx`
- `client/src/pages/PropertyDetails/PropertyFloorPlan.jsx`
- `client/src/pages/PropertyDetails/PropertyHeader.jsx`
- `client/src/pages/PropertyDetails/PropertyHighlights.jsx`
- `client/src/pages/PropertyDetails/PropertyMoreInfo.jsx`
- `client/src/pages/PropertyDetails/PropertyNavigation.jsx`
- `client/src/pages/PropertyDetails/PropertyNearby.jsx`
- `client/src/pages/PropertyDetails/PropertyOverview.jsx`
- `client/src/pages/PropertyDetails/PropertySidebar.jsx`
- `client/src/pages/PropertyDetails/PropertySimilar.jsx`
- `client/src/pages/PropertyDetails/SectionHeader.jsx`
- `client/src/pages/PropertyDetails/animations.js`
- `client/src/pages/User/Favorites.jsx`
- `client/src/pages/User/Profile.jsx`
- `client/src/pages/admin/AdminAnalytics.jsx`
- `client/src/pages/admin/AdminContacts.jsx`
- `client/src/pages/admin/AdminDashboard.jsx`
- `client/src/pages/admin/AdminInquiries.jsx`
- `client/src/pages/admin/AdminMedia.jsx`
- `client/src/pages/admin/AdminProperties.jsx`
- `client/src/pages/admin/AdminReports.jsx`
- `client/src/pages/admin/AdminSettings.jsx`
- `client/src/pages/admin/AdminUsers.jsx`
- `client/src/pages/admin/AgentsPage.jsx`
- `client/src/pages/admin/ContactsTable.jsx`
- `client/src/pages/admin/InquiriesPage.jsx`
- `client/src/pages/admin/InquiryDetails.jsx`
- `client/src/pages/admin/PropertiesTable.jsx`
- `client/src/pages/admin/UsersTable.jsx`

**Components** (`client/src/components/`):
- `client/src/components/Layout/layout.jsx`
- `client/src/components/Subscription/BillingDashboard.jsx`
- `client/src/components/Subscription/SubscriptionComparison.jsx`
- `client/src/components/Subscription/SubscriptionManagement.jsx`
- `client/src/components/Subscription/SubscriptionPlans.jsx`
- `client/src/components/User/UserProfile.jsx`
- `client/src/components/admin/AdminHeader.jsx`
- `client/src/components/admin/AdminLayout.jsx`
- `client/src/components/admin/AdminSidebar.jsx`
- `client/src/components/admin/RecentContacts.jsx`
- `client/src/components/admin/RecentProperties.jsx`
- `client/src/components/admin/RecentUsers.jsx`
- `client/src/components/admin/SubscriptionAnalytics.jsx`
- `client/src/components/admin/SubscriptionManagement.jsx`
- `client/src/components/agent/AgentLayout.jsx`
- `client/src/components/common/AgentRoute.jsx`
- `client/src/components/common/ErrorBoundary.jsx`
- `client/src/components/common/Header.jsx`
- `client/src/components/common/LoadingSkeleton.jsx`
- `client/src/components/common/ProtectedRoute.jsx`
- `client/src/components/common/RoleRoute.jsx`
- `client/src/components/common/footer/AboutUs.jsx`
- `client/src/components/common/footer/Career.jsx`
- `client/src/components/common/footer/ComingSoonPopup.jsx`
- `client/src/components/common/footer/ContactUs.jsx`
- `client/src/components/common/footer/EMICalculator.jsx`
- `client/src/components/common/footer/Footer.jsx`
- `client/src/components/common/footer/HelpCenter.jsx`
- `client/src/components/common/footer/HowWeWork.jsx`
- `client/src/components/common/footer/InteriorDesign.jsx`
- `client/src/components/common/footer/LaywerConsultancy.jsx`
- `client/src/components/common/footer/PackersMovers.jsx`
- `client/src/components/common/footer/PrivacyPolicy.jsx`
- `client/src/components/common/footer/Reviews.jsx`
- `client/src/components/common/footer/TermsConditions.jsx`
- `client/src/components/common/footer/TrustSafety.jsx`
- `client/src/components/home/AccountSidebar.jsx`
- `client/src/components/home/BlurHeader.jsx`
- `client/src/components/home/HeroSection.jsx`
- `client/src/components/home/OwnerServiceBox.jsx`
- `client/src/components/home/PropertiesSection.jsx`
- `client/src/components/home/PropertyCard.jsx`
- `client/src/components/home/ServiceBlock.jsx`
- `client/src/components/property/BedBath.jsx`
- `client/src/components/property/EnhancedSearch.jsx`
- `client/src/components/property/HomeType.jsx`
- `client/src/components/property/MainPage.jsx`
- `client/src/components/property/MobileEnhancedSearch.jsx`
- `client/src/components/property/More.jsx`
- `client/src/components/property/PriceDropdown.jsx`
- `client/src/components/property/PropertiesMap.jsx`
- `client/src/components/property/PropertyCard.jsx`
- `client/src/components/property/PropertyCardSkeleton.jsx`
- `client/src/components/property/PropertyImageGallery.jsx`
- `client/src/components/property/PropertyList.jsx`
- `client/src/components/property/PropertyMap.jsx`
- `client/src/components/property/SearchAnalytics.js`
- `client/src/components/property/SearchDemo.jsx`
- `client/src/components/ui/MobileBottomNav.jsx`
- `client/src/components/ui/MobilePropertyFilters.jsx`

**Context/Services**:
- `src/context/AuthContext.jsx` – Intercepts Axios, manages user session & redirects
- `src/context/PropertiesContext.jsx`, `src/context/AgentsContext.jsx`, `src/context/DevelopersContext.jsx`
- `src/services/axios.js` – Base URL, auth header injector, transparent FormData conversion for multipart

**Feature Highlights**
- Home & discovery (hero, featured properties, categories)
- Property search & filters (`/properties`, `/pg`), details page (gallery, map)
- Favorites, profile & user settings
- Add/Edit Property flows (role-gated)
- Developer directory (list/details/add/edit)
- Static info pages (About, Contact, Help, Privacy, Terms, Career, Trust, How We Work, Services)
- Subscriptions: Plans, Management, Comparison, Billing Dashboard
- Admin area: dashboard, analytics, users, properties, contacts, media, reports, settings
- Agent area: dashboard, properties, leads, analytics, inquiries, settings

---

## Mobile (Flutter)

**Packages** (from `pubspec.yaml`):
- `dio`/`http`, `flutter_secure_storage`, `shared_preferences`, `flutter_dotenv`, `provider`, `cached_network_image`, `geolocator`, `flutter_map` (if present), etc.

**Key directories**
- `lib/screens/` – Home tabs, Dashboard, Search, Properties, Favorites, Notifications, Profile
  - Admin & Agent sections mirror web (e.g., `admin_*`, `agent_*` screens)
  - Subscriptions (`subscription_screen.dart`), Developers (`developers_list_screen.dart`), Add Property, Static pages
- `lib/providers/` – `auth_provider.dart`, `properties_provider.dart`, `theme_provider.dart`, etc.
- `lib/services/` – `auth_service.dart`, `network_service.dart`, `api_config.dart`
- `lib/models/` – `user.dart`, `property.dart`, etc.
- `lib/widgets/` – `property_card.dart`, `form_text_field.dart`, etc.
- `lib/config/` – `environment_config.dart`, theming

**Environment**
- `ApiConfig.baseUrl` uses production Railway API (`/api/v1`). Tokens stored securely. Provider patterns for state.

---

## Environment Variables (Server)

- `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
- `SMTP_*` (if email), geocoder keys, etc.

---

## Known/Implied Flows to Verify

- Auth: register/login, role-based routing, token refresh behavior
- Property CRUD with media upload (Cloudinary via Multer – ensure mobile uses multipart correctly)
- Search suggestions & autocomplete
- Developer CRUD including logo upload
- Subscriptions: plan fetch, order creation, payment capture, signature verification, invoice
- Admin dashboards & Agent workflows
- Contact/inquiry creation & admin handling

---

## Noted Caveat

The uploaded archive appears to contain literal `...` truncations within some source files. While structure and intent are clear, **line-for-line code may be incomplete**. Use this document for a faithful feature map, but double-check any truncated files before running code-generation or migrations.

