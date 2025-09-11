## Frontend Analysis (client)

### Tech Stack Overview
- **Runtime/Framework**: React 19, Vite 6
- **Routing**: React Router 7 (`react-router-dom`)
- **UI**: MUI 6 (`@mui/material`, `@mui/icons-material`), Tailwind CSS 3
- **State/Data**: React Context, TanStack Query 5 (React Query)
- **Forms/Validation**: React Hook Form 7, Formik 2, Yup 1, Zod 3
- **Networking**: Axios 1 with centralized instance and interceptors
- **Maps/Charts/Animation**: Leaflet + React-Leaflet 5, Recharts 3, Framer Motion 12, Swiper/Slick
- **Utilities**: date-fns, lodash, clsx, react-icons
- **Testing**: Vitest 3, RTL, jsdom; setup files present

### App Entry and Providers
- `src/main.jsx`
  - Wraps app with: `QueryClientProvider` (React Query with tuned defaults), `BrowserRouter`, custom `ThemeProvider` (context storing `'light'|'dark'` in `localStorage`), `MuiThemeProvider` with dynamic theme, `CssBaseline`, global `ErrorBoundary`, and React Query Devtools.
  - Query defaults: retry=1, no refetch on focus, 5m staleTime, 10m cache.

- `src/App.jsx`
  - Uses `Suspense` and extensive `lazy()` for route-level code splitting.
  - Provider nesting: `AuthProvider` → `PropertiesProvider` → `AgentsProvider` → `DevelopersProvider` inside `MuiThemeProvider`.
  - Conditional `Header` hidden on `/`.
  - Global `Layout` wrapper and `Footer` always rendered.
  - Theme is derived from `ThemeContext` and applied via `createUrbanRealtyTheme(theme)`.

### Routing Map (Public and Protected)
- Public routes:
  - `/`: Home
  - `/login`, `/register`
  - `/properties`, `/pg`, `/properties/:id`
  - Footer pages: `/about`, `/contact`, `/help`, `/privacy-policy`, `/terms`, `/career`, `/trust`, `/how-we-work`, `/lawyer-consultancy`, `/packers-and-movers`, `/interior-design`, `/emi-calculator`
  - Developers: `/developers`, `/developers/:id`, `/developers/add`, `/developers/:id/edit`
  - Subscriptions: `/subscriptions`, `/subscription-management`, `/subscription-comparison`, `/billing-dashboard`

- Admin (guarded):
  - `/admin` → `AdminLayout` with index dashboard and child routes: `analytics`, `agents`, `users`, `properties`, `contacts`, `media`, `reports`, `settings`, `subscriptions`

- Agent (guarded):
  - `/agent` → `AgentLayout` with child routes: `dashboard`, `properties`, `leads`, `analytics`, `inquiries`, `settings`

- Auth-required (general guard):
  - `/properties/:id/edit`, `/add-property`, `/profile`

Note: `ProtectedRoute` currently ignores any `allowedRoles` prop passed from `App.jsx` and only checks for presence of `user`. This makes role-based routes effectively auth-only. See Issues/Recommendations.

### Theming
- `src/context/ThemeProvider.jsx`: Stores `theme` in localStorage, sets `data-theme` attribute on `<html>`, exposes `toggle()` to switch.
- `src/Theme/NewTheme.js`: Builds a comprehensive MUI theme, toggles palettes based on mode, customizes typography, components (Buttons, Cards, AppBar, TextField), and shapes. Export also includes a static `urbanRealtyTheme` for backward compatibility.
- Tailwind is configured (see `tailwind.config.js`, `postcss.config.cjs`). Global CSS at `index.css` and `App.css`. CSS tokens under `src/styles/themes/tokens.css` and utilities in `src/styles/components/utilities.css`.

### Global Contexts and Data Flows
- `src/context/AuthContext.jsx`
  - Manages `user`, `loading`, and `error` with login/register/logout helpers.
  - On mount, loads the current user from `/auth/me` if a token exists.
  - Configures axios interceptors to attach `Authorization` header and handle 401 → clears token, resets user, navigates to `/login`.
  - Exposes `updateUser` and `clearError`.
  - Note: axios response interceptor in `src/services/axios.js` also handles 401 by `window.location.href='/login'`; this duplicates navigation logic with slight differences.

- `src/context/PropertiesContext.jsx`
  - Holds `properties`, `featuredProperties`, `property`, `developers`, `agentProperties`, `pagination`, `loading`, `error`.
  - `getProperties(params)`: Normalizes filters to the backend format, caches results in-memory keyed by params, manages pagination.
  - `getFeaturedProperties()`, `getProperty(id)` with per-id cache, `createProperty(formData)` and `updateProperty(id, formData)` using `FormData` transformations for nested objects, `deleteProperty(id)`, `getDevelopers()`, `getAgentProperties(user)`.
  - Utilities: `clearProperty`, `clearErrors`.

- `src/context/AgentsContext.jsx`
  - Loads admin-visible agents from `/admin/agents`, exposes `agents`, `loading`, `error`, and `getAgents`.

- `src/context/DevelopersContext.jsx`
  - Manages `developers`, `loading`, `error`.
  - `getDevelopers()`, `getDeveloper(id)`, `updateDeveloper(id, formData, config)`. Uses axios; contains `console.log` calls.
  - Note: `getDeveloper` sets the entire `developers` array to a single developer response; consider a separate `developer` state.

### Networking and Services
- `src/services/axios.js`
  - `baseURL` from `import.meta.env.VITE_API_BASE_URL`, fallback to production API.
  - Request interceptor attaches token and properly handles `FormData` headers.
  - Response interceptor normalizes common error cases (network, 401/403/404/422/5xx) and redirects to `/login` on 401.
  - Exports `formDataRequest(url, data, method, config)` helper.

- `src/constants/api.js`: Likely holds endpoint constants (not opened).
- `src/services/analyticsService.js`: Present; likely tracks client analytics events.

### Hooks
- `src/hooks/useAnalytics.js`: Expected to centralize analytics events across pages.
- `src/hooks/useApi.js`: Likely a small wrapper over axios/React Query to standardize calls.

### Layout and Common Components
- `src/components/Layout/layout.jsx`: Main layout wrapper for pages.
- `src/components/layout/Breadcrumbs.jsx`: Breadcrumb component (note the lowercase `layout` directory; see naming issues).
- `src/components/common/Header.jsx` and `Header.css`: Main navigation; conditionally hidden on home.
- `src/components/common/footer/*`: Footer and many content pages (AboutUs, ContactUs, HelpCenter, PrivacyPolicy, TermsConditions, Career, TrustSafety, HowWeWork, LaywerConsultancy, PackersMovers, InteriorDesign, EMICalculator, Reviews, ComingSoonPopup).
- `src/components/common/ErrorBoundary.jsx`: App-level error boundary used in `main.jsx`.
- `src/components/common/ProtectedRoute.jsx`: Wraps `Outlet` and redirects to `/login` if `!user`. Ignores role constraints.
- `src/components/common/RoleRoute.jsx`, `AgentRoute.jsx`: Present but not used by `App.jsx` routes; potential for role-based guarding.
- `src/components/common/LoadingSkeleton.jsx`: Generic skeleton loader.

### Home and Property Components
- `src/components/home/*`: `HeroSection` (with `HeroSection.css`), `PropertyCard`, `PropertiesSection`, `ServiceBlock`, `OwnerServiceBox`, `AccountSidebar`, `BlurHeader`.
- `src/components/property/*`: `PropertyList`, `MainPage` and others used in routes.

### Subscription Components
- `src/components/Subscription/*`: `SubscriptionPlans`, `SubscriptionComparison`, `SubscriptionManagement`, `BillingDashboard`.

### Admin and Agent Components
- Admin (`src/components/admin/*`): `AdminLayout`, `AdminSidebar`, `AdminHeader`, dashboards (`AnalyticsDashboard`, `SubscriptionAnalytics`, `RecentUsers`, `RecentProperties`, `RecentContacts`), `SubscriptionManagement`.
- Agent (`src/components/agent/*`): `AgentLayout`.

### Pages
- Home: `src/pages/Home/Home.jsx` with `home.css`.
- Auth: `src/pages/Auth/Login`, `Register` (lazy loaded).
- Properties: `src/pages/Properties/EditProperty`; details under `src/pages/PropertyDetails/*` including `PropertyDetails` and many sectional components: `PropertyHeader`, `PropertyOverview`, `PropertyAmenities`, `PropertyHighlights`, `PropertyFloorPlan`, `PropertySimilar`, `PropertyNearby`, `PropertyDeveloper`, `PropertyMoreInfo`, `PropertySidebar`, `PropertyNavigation`, dialogs (`ContactDialog`, `DeleteConfirmationDialog`), `PremiumButton`, `PremiumPaper`, `animations.js`.
- Developers: `DeveloperList.jsx`, `DeveloperDetails.jsx`, `AddDeveloperPage.jsx`, `EditDeveloperPage.jsx` (+ CSS for list).
- Admin: `AdminDashboard`, `AdminAnalytics`, `AdminUsers`, `AdminProperties`, `AdminContacts`, `AdminMedia`, `AdminReports`, `AdminSettings`, tables (`UsersTable`, `PropertiesTable`, `ContactsTable`), `AgentsPage`, `InquiriesPage`, `InquiryDetails`.
- Agent: `AgentDashboard`, `AgentProperties`, `AgentLeads`, `AgentAnalytics`, `Inquiries`, `AgentSettings`.
- User: `src/pages/User/Profile` (imported as `Profile` from `./pages/User/Profile`). Also component `src/components/User/UserProfile.jsx` exists; ensure no duplication/confusion.
- Add Property: `src/pages/AddProperty/AddProperty`.

### Forms and UI Helpers
- `src/components/forms/RHFTextField.jsx`: Integration component for React Hook Form + MUI TextField.

### Styles and Assets
- Global CSS: `index.css`, `src/index.css`, `src/App.css` (be wary of duplicate naming `index.css` in root and `src/index.css`).
- Tailwind config: `tailwind.config.js` with plugins `forms` and `aspect-ratio` referenced in `package.json`.
- PostCSS: `postcss.config.cjs` present.
- Tokens/utilities: `src/styles/themes/tokens.css`, `src/styles/components/utilities.css`.
- Public assets under `client/public/*`: multiple images and `Office_Video.mp4`.
- Notable oddity: `src/components/home/Screenshot 2025-04-04 165330.png` inside source; large binary assets in `src/` can bloat builds (should move to `public/`).

### Utilities and Duplicates
- Root `utils/format.js` and `src/utils/format.jsx` both exist; likely duplicate or divergent formatting helpers. Prefer a single canonical location under `src/utils`.

### Configuration and Tooling
- Vite: `vite.config.js`
- ESLint: `eslint.config.js`
- Tailwind: `tailwind.config.js`
- Testing setup: `vitest.setup.ts`, `src/setupTests.ts`; RT Library dependencies present.
- `README.md` in `client` exists.

### Testing
- `src/__tests__/smoke.test.tsx`: Basic smoke test present to mount the app/components in jsdom.
- Ensure test environment is aligned with React 19 and React Router 7 APIs.

### Performance Considerations
- Positive:
  - Route-level code splitting via `React.lazy` and `Suspense`.
  - React Query configured for reasonable cache and stale times.
  - MUI `CssBaseline` for consistent rendering.
  - Property list caching in `PropertiesContext` to avoid redundant fetches.

- Opportunities:
  - Use skeleton components for `Suspense` fallback instead of a simple div.
  - Prefer React Query for all server state (e.g., `PropertiesContext`, `AgentsContext`, `DevelopersContext`) to remove manual caches, consolidate error/loading, and leverage auto refetch/invalidation.
  - Heavy libraries (Leaflet, charts) can be dynamically imported only on routes that need them, and possibly `import()` CSS only there.
  - Move large images from `src/` to `public/` and ensure proper image optimization (WebP/AVIF already present for some; audit usage).

### Accessibility and UX
- MUI components are accessible by default; ensure:
  - All images have meaningful `alt` text.
  - Forms provide labels and error messages (RHF + MUI).
  - Keyboard focus styles preserved; avoid removing outlines in CSS.
  - Color contrast verified in both light and dark modes.

### Security
- Tokens stored in `localStorage` and automatically attached to requests.
- 401 handling duplicates between `AuthContext` (navigate) and axios instance (window.location). Consolidate to avoid race conditions.
- Avoid logging sensitive data; remove console logs in contexts/services for production builds.

### Internationalization
- No i18n framework detected. If multilingual is needed, consider `react-intl` or `i18next`.

### Known Issues and Inconsistencies
- **Role-based protection is not enforced**: `ProtectedRoute` ignores `allowedRoles` even though routes pass it. Users with any role (or any authenticated user) can access `/admin` and `/agent` areas contrary to intent.
- **Duplicate redirect logic on 401**: `AuthContext` uses `navigate`, axios instance uses `window.location.href`. Prefer one approach (context-driven) and centralize.
- **Case-sensitive directory naming**: Both `components/Layout` and `components/layout` exist. On case-insensitive systems this can collide and cause import confusion. Standardize to a single `Layout`.
- **Duplicate/overlapping utilities**: `utils/format.js` (root) vs `src/utils/format.jsx` (different extensions). Merge into `src/utils/format.ts(x?)` and update imports.
- **DevelopersContext state shape**: `getDeveloper` sets array state (`developers`) with a single developer item; introduce a `developer` state or return the fetched item.
- **Console logs in production code**: Several `console.log` usages in contexts.
- **Binary asset inside `src/`**: `Screenshot 2025-04-04 165330.png` should live in `public/`.
- **Mixed form libs**: Both Formik and React Hook Form are installed. Standardize on one to reduce bundle size and complexity.

### Recommendations (Prioritized)
1. Implement role-based route guard:
   - Extend `ProtectedRoute` to accept `allowedRoles` and check `user.role`. Alternatively, use existing `RoleRoute`/`AgentRoute` and wire them in `App.jsx`.
2. Consolidate 401 handling:
   - Remove redirect in axios instance and delegate to `AuthContext` via an event/emitter or shared handler to avoid double-navigation.
3. Normalize directory/file naming:
   - Merge `components/Layout` and `components/layout`; ensure imports match casing. Consider standardizing to PascalCase for component directories.
4. Unify utilities:
   - Remove root `utils/` and keep all app code under `src/`. Merge `format` utilities.
5. Migrate server state to React Query:
   - Replace manual caching in `PropertiesContext`/`AgentsContext`/`DevelopersContext` with React Query queries and mutations where feasible.
6. Clean up logs and dead code:
   - Remove console logs, unused files, and ensure `RoleRoute`/`AgentRoute` are either used or deleted.
7. Optimize assets and bundles:
   - Move large images out of `src/`, use responsive images, lazy-load heavy feature modules (Leaflet, charts).
8. Testing coverage:
   - Add tests for route guards, contexts behavior, and critical flows (auth, property CRUD).
9. Forms consolidation:
   - Choose RHF or Formik; if RHF, remove Formik/Yup where redundant and use Zod resolver.
10. Error UI:
   - Improve Suspense fallbacks and error boundaries per-route for better UX.

### File/Directory Inventory (High-level)
- Root `client`:
  - `index.html`, `index.css`, `index.js`, `package.json`, `package-lock.json`, `eslint.config.js`, `postcss.config.cjs`, `tailwind.config.js`, `vite.config.js`, `vitest.setup.ts`, `README.md`, `dist.zip`
  - `public/`: images (about-us.jpg, building_*.jpg, fm-*.png, m-*.png), `Office_Video.mp4`, policy/terms images, `vite.png`
  - `src/`:
    - `main.jsx`, `App.jsx`, `App.css`, `index.css`
    - `components/`:
      - `admin/*`, `agent/*`, `common/*` (Header, Footer, ErrorBoundary, routes), `forms/*`, `home/*`, `layout/Breadcrumbs.jsx`, `Layout/layout.jsx`, `property/*`, `Subscription/*`, `ui/*`, `User/*`
    - `pages/`: `Home/*`, `Auth/*`, `AddProperty/*`, `PropertyDetails/*`, `Properties/*`, `Developer/*`, `admin/*`, `Agent/*`, `User/*`
    - `context/`: `AuthContext.jsx`, `AgentsContext.jsx`, `PropertiesContext.jsx`, `DevelopersContext.jsx`, `ThemeContext.jsx`, `ThemeProvider.jsx`
    - `Theme/NewTheme.js`
    - `hooks/`: `useAnalytics.js`, `useApi.js`
    - `services/`: `axios.js`, `analyticsService.js`
    - `styles/`: `themes/tokens.css`, `components/utilities.css`
    - `utils/`: various including `format.jsx`
    - `__tests__/smoke.test.tsx`, `setupTests.ts`

### Conclusion
The frontend is a React + MUI + Tailwind application with React Router and a mixture of Context and React Query for state. The architecture is sound with route-level code-splitting and central axios config. Addressing role-based protection, consolidating duplicate logic/files, and leaning more on React Query will improve correctness, maintainability, and performance.

