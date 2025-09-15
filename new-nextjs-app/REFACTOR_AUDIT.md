## Urban Realty Next.js App – Codebase Audit and Refactor Plan

### Executive Summary

- There is duplication and fragmentation across UI composition, routing, and API access:
  - Components are implemented inside `app/*/page.tsx` and also in `src/components/*`, leading to inconsistent reuse.
  - Multiple API layers coexist: `src/lib/services/apiService.ts` (fetch-based), `src/lib/services/axios.js` (axios instance), `src/hooks/useApi.js` (react-query + axios) and `src/contexts/*` using `apiService` directly. This causes divergence in error handling, typing, and caching.
  - Mixed routing paradigms: some legacy code still uses `react-router-dom` and client-side `window` references, which conflicts with Next.js App Router.

- Refactor goals:
  - Extract reusable UI from pages into dedicated components in `src/components/*` and keep page files minimal, focusing on layout, data loading, and composition.
  - Centralize API access through a single typed client, unify error envelopes, and integrate with React Query for caching.
  - Remove `react-router-dom` usage and align navigation, links, and route guards with Next.js primitives.
  - Eliminate dead code, type gaps, and fix SSR/CSR hazards (direct `window` usage, localStorage access guards).

---

### Why components exist inside pages while also having a `components` directory

- Historical drift: features were first built inside pages for velocity, then later extracted partially to `src/components`. Some pages still hold complex UI logic (e.g., large dashboards, property list UIs).
- App Router encourages colocating route-bound logic in `app/*`. Without discipline, page files grow into monoliths. Proper practice: keep pages as thin composition wrappers that import presentational and container components from `src/components`.

### Why there are multiple API layers (apiService + axios + context/hooks)

- Legacy axios setup (`src/lib/services/axios.js`) predates `src/lib/services/apiService.ts`. Then `useApi.js` introduced React Query wrappers over the axios instance. Meanwhile contexts call `apiService` directly. This created:
  - Divergent base URLs, auth handling, and error shapes.
  - Inconsistent typing (TS in `apiService.ts`, JS elsewhere) and duplication of endpoints.
  - Two caching strategies: manual state in contexts vs React Query.

---

### Phased Refactor Plan (Cursor-ready)

Phase 0: Baseline and safety
1. Add TypeScript strictness where feasible; keep JS interop working.
2. Introduce a single source of truth for API config/endpoints in `src/lib/services/api.config.ts` and deprecate `src/lib/constants/api.js` and any `shared/constants` imports used only on client.
3. Create `src/lib/services/http.ts` exporting a single HTTP client (axios) configured with interceptors and SSR-safe token accessors.
4. Define `src/lib/services/client.ts` that wraps `http` with typed methods and normalized ApiResponse, exported as `api`.
5. Migrate `useApi.js` to TS as `useApi.ts`, using the centralized `api` and React Query v5.

Phase 1: Routing hygiene (Next.js App Router alignment)
1. Remove `react-router-dom` usage. Replace `Link` with `next/link`, and `useNavigate` patterns with `next/navigation`.
2. Guard client-only code: wrap any `window`/`localStorage` access with `typeof window !== 'undefined'` checks or move to effects.
3. Move route guards (`ProtectedRoute`, `RoleRoute`, `AgentRoute`) to Next.js middleware or client wrappers that depend on `useAuth` and render children conditionally. Prefer server checks where possible.

Phase 2: Component extraction and reuse
1. Identify large JSX blocks in pages and extract to `src/components/*`:
   - Admin dashboard sections
   - Property listing filters and drawers
   - Map + list compositions
2. Normalize component props and lift shared state into container components.
3. Co-locate styles with components (CSS Modules or styled system) and delete duplicated CSS under `app/*` when replaced.

Phase 3: API centralization and React Query integration
1. Replace direct `apiService` and context-fetch patterns with React Query hooks per domain: `useProperties`, `useContacts`, `useSubscriptions`, `useAdmin` backed by `api`.
2. Remove `src/lib/services/apiService.ts` once parity achieved, or reduce it to a thin export layer reusing the centralized client.
3. Ensure uniform error handling and toasts via a single `ErrorToast` and boundary.

Phase 4: Clean-up and type hardening
1. Convert critical JS files to TS incrementally (contexts, hooks, key components).
2. Remove dead files and duplicate styles.
3. Add ESLint rules for banned imports (`react-router-dom`) and prefer `next/link`.

---

### Centralized API Design (target)

- `src/lib/services/http.ts` (axios instance with interceptors)
- `src/lib/services/api.types.ts` (shared response types)
- `src/lib/services/api.ts` (typed endpoints: auth, properties, admin, subscriptions)
- `src/hooks/api/` domain hooks using React Query and `api`

Notes:
- SSR safety: token retrieval only in effects or via request headers from server actions if added later.
- Normalize envelope: `{ status, success, data, message }` across all calls.

---

### Per-File TODOs and exact extraction moves

app shell
- `src/app/layout.tsx`
  - Ensure global Providers are minimal. Keep only composition; no feature logic. [review-only]

- `src/app/page.tsx`
  - Extract hardcoded `ServiceBlock` configuration to `src/components/home/ServiceBlocksGroup.tsx`.
  - Page renders: `<HeroSection/><ServiceBlocksGroup/><Reviews/>`.

Admin
- `src/app/admin/page.tsx`
  - Keep as thin wrapper rendering `<AdminDashboard />` from components.

- `src/app/admin/AdminDashboard.jsx`
  - Move to `src/components/admin/AdminDashboard.tsx`.
  - Extract sub-sections:
    - `StatsGrid` (cards) -> `src/components/admin/StatsGrid.tsx`
    - `QuickActions` -> `src/components/admin/QuickActions.tsx`
    - `SystemHealth` -> `src/components/admin/SystemHealth.tsx`
    - `PlatformMetrics` -> `src/components/admin/PlatformMetrics.tsx`
    - `GrowthChart` and `DistributionCharts` -> `src/components/admin/charts/*`
    - `RecentUsersTable`, `RecentPropertiesTable`, `RecentContactsTable` -> `src/components/admin/tables/*`
  - Replace direct `apiService` calls with React Query hooks under `src/hooks/api/admin.ts`.
  - Convert to TS.

Properties (listing)
- `src/app/properties/page.tsx`
  - Page becomes thin container using hooks and rendering a new component `<PropertiesExplorer />` from `src/components/property/PropertiesExplorer.tsx`.
  - Move all UI logic from `PropertyList.jsx` and `app/properties/MainPage.css` into `PropertiesExplorer` with CSS modules.

- `src/components/property/PropertyList.jsx`
  - Deprecate; split into:
    - `FiltersBar.tsx`, `MobileFiltersDrawer.tsx`, `ActiveFilterChips.tsx`
    - `PropertiesGrid.tsx`, `PropertiesMapPanel.tsx`
  - Data source: `usePropertiesQuery(params)` in `src/hooks/api/properties.ts`.
  - Remove `react-router-dom` imports; use Next primitives and `useSearchParams` from `next/navigation`.

- `src/components/home/PropertyCard.jsx`
  - Convert to TS `PropertyCard.tsx` with typed `Property` model.

Header and navigation
- `src/components/common/Header.jsx`
  - Replace `react-router-dom` with `next/link` and `usePathname`/`useRouter` from `next/navigation`.
  - Remove direct `window.innerWidth` usage; use CSS or `useMediaQuery` from MUI.
  - Ensure all routes point to `app/*` pages.

Contexts and hooks
- `src/contexts/AuthContext.jsx`
  - Keep context state, but move API calls to `src/hooks/api/auth.ts` using `api` and React Query mutations.
  - SSR guards for session access.
  - Convert to TS.

- `src/hooks/useApi.js`
  - Replace with `src/hooks/api/client.ts` and per-domain hooks in `src/hooks/api/*`. Deprecate file after migration.

Services
- `src/lib/services/axios.js`
  - Move to `src/lib/services/http.ts` (TS). Keep interceptors; unify base URL source from `env`.

- `src/lib/services/apiService.ts`
  - Re-implement as thin wrapper around `api` or remove after migration. Avoid duplicate fetch logic.

- `src/lib/constants/api.js`
  - Remove; replace imports with `src/lib/services/api.ts` and `api.types.ts`.

Misc cleanup
- Replace any `window` and `localStorage` direct usage with guards.
- Delete unused CSS under `src/app/*/*.css` once migrated to component-scoped CSS modules.
- Add ESLint rule to prevent `react-router-dom` imports in this project.

---

### Step-by-step Cursor task plan (granular)

1) Create centralized API layer
- Add files: `src/lib/services/http.ts`, `src/lib/services/api.types.ts`, `src/lib/services/api.ts`.
- Migrate axios config from `src/lib/services/axios.js` and response normalization from `apiService.ts`.
- Implement auth token helpers with SSR safety.

2) Introduce domain React Query hooks
- Add `src/hooks/api/auth.ts`, `src/hooks/api/properties.ts`, `src/hooks/api/admin.ts`, `src/hooks/api/subscriptions.ts`.
- Replace `apiService` usages in contexts/components with these hooks.

3) Routing and navigation fixes
- Search for `react-router-dom` imports and replace with Next equivalents.
- Update `Header.jsx` to Next links and responsive approach without direct `window` usage.
- Ensure all `href` paths match `app/*` routes.

4) Component extraction from pages
- Admin: move `src/app/admin/AdminDashboard.jsx` into `src/components/admin/*` parts as described.
- Properties: create `PropertiesExplorer.tsx` and split filter/map/grid into child components.
- Home page: add `ServiceBlocksGroup.tsx`.

5) Remove duplicates and dead code
- Remove `src/lib/constants/api.js`, legacy `PropertyList.jsx` after migration, and CSS duplicates under `app/*`.
- Convert key JS files to TS.

6) Lint, type, and test
- Run ESLint and fix violations.
- Ensure unit smoke test passes and pages render.

---

### Trackable Issues (by file)

- `src/app/page.tsx`
  - [ ] Extract service blocks to `components/home/ServiceBlocksGroup.tsx` and import.

- `src/app/admin/AdminDashboard.jsx`
  - [ ] Move to `components/admin/AdminDashboard.tsx` and split subsections into separate components.
  - [ ] Replace `apiService` calls with hooks in `hooks/api/admin.ts`.

- `src/app/admin/page.tsx`
  - [ ] Update import to new `components/admin/AdminDashboard.tsx`.

- `src/components/common/Header.jsx`
  - [ ] Replace `react-router-dom` with `next/link` and remove direct `window` width check.

- `src/components/property/PropertyList.jsx`
  - [ ] Replace with `components/property/PropertiesExplorer.tsx` and child components; remove `react-router-dom`.

- `src/app/properties/page.tsx`
  - [ ] Render new `PropertiesExplorer` and remove page-local CSS reliance.

- `src/lib/services/axios.js`
  - [ ] Migrate to TS `lib/services/http.ts`; update all imports.

- `src/lib/services/apiService.ts`
  - [ ] Reimplement on top of new `api` or remove after hook migration.

- `src/lib/constants/api.js`
  - [ ] Remove and update imports to `lib/services/api.ts`.

- `src/contexts/AuthContext.jsx`
  - [ ] Move network calls into `hooks/api/auth.ts` and convert file to TS.

- `src/hooks/useApi.js`
  - [ ] Deprecate after new domain hooks exist; remove file.

---

### Notes on bugs and risks spotted

- `src/components/common/Header.jsx` uses `react-router-dom` and direct `window` which will break SSR and Next navigation.
- `src/app/properties/page.tsx` mixes client-only `window` logic in components; ensure guards exist. Several components under `components/property/*` assume DOM.
- `src/lib/services/apiService.ts` imports a type from framer-motion incorrectly: `import { c } from ...types.d-*` which should be removed.
- Duplicate source of truth for endpoints in `src/lib/constants/api.js` vs services.
- Inconsistent envelope handling (`response.data` vs `response.data.data`). Centralization will fix.

---

If you want, I can begin implementing Phase 1 immediately.

