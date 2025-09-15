## Refactor Report 23

### Session kickoff
- Date: 2025-09-15
- Scope: Implement refactors outlined in `new-nextjs-app/REFACTOR_AUDIT.md`.
- Action: Initialized reporting. Established format to log each edit with rationale and file references.

### Reporting format
- Entry template:
  - Change ID: <sequential id>
  - Files affected: <paths>
  - Summary: <what changed>
  - Rationale: <why>
  - Audit mapping: <section/phase from REFACTOR_AUDIT.md>
  - Notes/Risks: <optional>

### Implementation plan (actionable)
- Phase 0: Baseline and safety
  - Create `src/lib/services/api.config.ts`, `src/lib/services/http.ts`, `src/lib/services/api.types.ts`, `src/lib/services/api.ts`.
  - Migrate from `src/lib/services/axios.js` and normalize response envelopes.
  - Keep SSR-safe token helpers; preserve JS interop while increasing TS strictness.
- Phase 1: Routing hygiene
  - Remove `react-router-dom` usages; switch to `next/link` and `next/navigation`.
  - Add guards for `window`/`localStorage` access; move to effects where needed.
  - Update route guards to middleware/client wrappers.
- Phase 2: Component extraction and reuse
  - Extract page-internal UIs to `src/components/*` (Admin, Properties, Home service blocks).
  - Normalize props; co-locate styles as CSS modules.
- Phase 3: API centralization with React Query
  - Add domain hooks in `src/hooks/api/*` for auth, properties, admin, subscriptions using `api`.
  - Replace `apiService` and ad-hoc context fetches with hooks.
- Phase 4: Cleanup and type hardening
  - Convert critical JS to TS (contexts, hooks, key components).
  - Remove dead/duplicate files and CSS; add ESLint rule banning `react-router-dom`.

### Initial task breakdown (granular execution order)
1) Centralized API layer files and wiring
2) Introduce domain React Query hooks and migrate first consumer (e.g., AdminDashboard)
3) Replace `react-router-dom` in `src/components/common/Header.jsx`
4) Extract `AdminDashboard` into `src/components/admin/*` and wire hooks
5) Create `PropertiesExplorer.tsx` and split filters/map/grid components
6) Home page service blocks extraction
7) Remove deprecated files (`axios.js`, `useApi.js`, constants), add ESLint rule
8) Final TS/ESLint pass

---

Change ID: 1
- Files affected: `report23.md`
- Summary: Created report and initialized logging template.
- Rationale: Track all edits per user request.
- Audit mapping: Phase 0 — Baseline and safety (tracking setup)
- Notes/Risks: None

Change ID: 2
- Files affected: `report23.md`
- Summary: Added actionable implementation plan and initial task breakdown.
- Rationale: Provide executable steps aligned to audit phases.
- Audit mapping: "Phased Refactor Plan" and "Step-by-step Cursor task plan" consolidation
- Notes/Risks: Order may adjust as dependencies surface during migration

Change ID: 3
- Files affected: `new-nextjs-app/src/lib/services/api.types.ts`, `new-nextjs-app/src/lib/services/http.ts`, `new-nextjs-app/src/lib/services/api.ts`
- Summary: Added centralized API layer with SSR-safe axios client, normalized response types, and typed endpoint wrappers.
- Rationale: Unify API access, error handling, and prepare for React Query domain hooks.
- Audit mapping: Phase 0 — Baseline and safety (steps 2–4)
- Notes/Risks: Base URL sourced from `NEXT_PUBLIC_API_URL` (browser) or `API_URL` (server) with `/api` fallback.

Change ID: 4
- Files affected: `new-nextjs-app/src/components/common/Header.jsx`
- Summary: Replaced `react-router-dom` `Link` with `next/link`, added `useRouter` for logout navigation, and guarded `window` usage by moving to `useEffect` + responsive state.
- Rationale: Align routing with Next.js App Router and ensure SSR safety.
- Audit mapping: Phase 1 — Routing hygiene (items 1–2); Trackable Issue: `src/components/common/Header.jsx`.
- Notes/Risks: Component assumes `useAuth` path is `../../context/AuthContext`; verify actual location under `src/contexts` during further cleanup.

Change ID: 5
- Files affected: `new-nextjs-app/src/lib/services/api.ts`
- Summary: Added admin endpoints `dashboard` and `analytics` to centralized API under `api.admin`.
- Rationale: Provide unified, typed access for admin data to back new domain hooks.
- Audit mapping: Phase 0 — Centralized API Design; Step 1 of Cursor task plan.
- Notes/Risks: Endpoint paths assume `/admin/dashboard` and `/admin/analytics` exist on backend.

Change ID: 6
- Files affected: `new-nextjs-app/src/hooks/api/admin.ts`
- Summary: Created admin React Query hooks `useAdminDashboard` and `useAdminAnalytics` backed by centralized API.
- Rationale: Migrate components away from `apiService` to standardized hooks with caching.
- Audit mapping: Phase 3 — API centralization and React Query integration; Step 2 of Cursor plan.
- Notes/Risks: Query keys standardized; stale times added.

Change ID: 7
- Files affected: `new-nextjs-app/src/app/admin/AdminDashboard.jsx`
- Summary: Refactored to consume `useAdminDashboard` and `useAdminAnalytics` hooks; removed direct `apiService` usage and `useQuery` inline configs.
- Rationale: Align with centralized API and domain hooks for consistency and caching.
- Audit mapping: Trackable Issue: `src/app/admin/AdminDashboard.jsx`; Phases 2–3.
- Notes/Risks: `refresh` now uses hook `refetch`; verify data shape matches previous expectations (counts/recent/etc.).


Change ID: 8
- Files affected: `new-nextjs-app/src/components/property/PropertyCard.jsx`
- Summary: Replaced `react-router-dom` navigation with Next.js `useRouter`; switched axios import to centralized `http` client; updated favorites status and mutation calls accordingly.
- Rationale: Remove legacy routing and unify HTTP usage per centralized API layer.
- Audit mapping: Phase 1 — Routing hygiene (remove `react-router-dom`); Phase 0 — Centralized API layer adoption.
- Notes/Risks: `useAuth` import path remains as-is; ensure AuthContext export path is consistent during later TS conversion.

Change ID: 9
- Files affected: `new-nextjs-app/src/components/layout/Breadcrumbs.jsx`
- Summary: Replaced `react-router-dom` `useLocation` and `RouterLink` with Next.js `usePathname` and `next/link`; kept MUI `Link` for styling via `component` prop.
- Rationale: Align navigation with Next.js App Router and remove legacy router dependencies.
- Audit mapping: Phase 1 — Routing hygiene; Trackable Issue: replace `react-router-dom` imports.
- Notes/Risks: None.

Change ID: 10
- Files affected: `new-nextjs-app/src/hooks/api/properties.ts`
- Summary: Added `usePropertiesQuery` hook backed by centralized `api` to fetch property lists with React Query.
- Rationale: Establish domain hook for properties to support new explorer component.
- Audit mapping: Phase 3 — API centralization and React Query integration; Step 2 of plan.
- Notes/Risks: Assumes `api.properties.list` returns array or `{ items }`.

Change ID: 11
- Files affected: `new-nextjs-app/src/components/property/PropertiesExplorer.tsx`, `new-nextjs-app/src/app/properties/page.tsx`
- Summary: Created `PropertiesExplorer` component leveraging `usePropertiesQuery`, responsive grid + optional map; updated properties page to render it and removed legacy page-local logic/CSS reliance.
- Rationale: Extract complex UI from page, standardize data loading and composition per audit.
- Audit mapping: Phase 2 — Component extraction; Trackable Issues: replace `PropertyList.jsx` and update `app/properties/page.tsx`.
- Notes/Risks: Introduces CSS module import `PropertiesExplorer.module.css` which needs adding or styling adjustments later.

Change ID: 12
- Files affected: `new-nextjs-app/src/components/property/PropertiesExplorer.module.css`
- Summary: Added minimal responsive CSS module to support `PropertiesExplorer` grid, map, and pagination layout.
- Rationale: Ensure component builds without missing style import errors and has basic responsive layout.
- Audit mapping: Phase 2 — Component extraction and style co-location.
- Notes/Risks: Styles are minimal and may need refinement to match design system.
 
Change ID: 13
- Files affected: `new-nextjs-app/src/components/home/ServiceBlocksGroup.tsx`, `new-nextjs-app/src/app/page.tsx`
- Summary: Extracted three inline `ServiceBlock` usages from home page into a new reusable `ServiceBlocksGroup` component and updated the home page to render it.
- Rationale: Keep page files thin and improve reuse/maintainability per audit plan.
- Audit mapping: Trackable Issue: `src/app/page.tsx` (extract service blocks); Phase 2 — Component extraction and reuse.
- Notes/Risks: Ensure `ServiceBlock` remains client component; no behavior change intended.

Change ID: 14
- Files affected: `new-nextjs-app/src/components/common/AgentRoute.jsx`
- Summary: Replaced `react-router-dom` `Navigate`/`useLocation` with Next.js `useRouter`/`usePathname`; performs client-side role checks and redirects using `router.replace`, returning null during redirect.
- Rationale: Align route guarding with Next.js App Router and remove legacy dependency.
- Audit mapping: Phase 1 — Routing hygiene; Trackable Issue cleanup for guard components.
- Notes/Risks: Preserves redirect-to-login with `from` query param; ensure AuthContext remains client-safe.

Change ID: 15
- Files affected: `new-nextjs-app/src/hooks/useAnalytics.js`
- Summary: Migrated from `react-router-dom` `useLocation` to Next.js `usePathname`/`useSearchParams`; updated all analytics events to use pathname string and derived search query.
- Rationale: Remove legacy routing dependency and ensure compatibility with Next.js App Router.
- Audit mapping: Phase 1 — Routing hygiene; Trackable Issue: replace `react-router-dom` imports.
- Notes/Risks: `hash` tracking set to empty string; add if hash usage is required later.

Change ID: 16
- Files affected: `new-nextjs-app/src/app/admin/AdminAnalytics.jsx`, `new-nextjs-app/src/app/admin/AdminProperties.jsx`, `new-nextjs-app/src/app/admin/UsersTable.jsx`
- Summary: Replaced imports of legacy `@/lib/services/axios` with centralized `@/lib/services/http` and updated GET/PUT/DELETE calls accordingly.
- Rationale: Consolidate HTTP client usage under SSR-safe axios instance with interceptors.
- Audit mapping: Phase 0 — Centralized API Design; Step 1 migration of axios usage.
- Notes/Risks: Response envelope assumptions unchanged; future step may normalize via `api` wrappers.

Change ID: 18
- Files affected: `new-nextjs-app/src/components/Subscription/SubscriptionComparison.jsx`, `new-nextjs-app/src/components/Subscription/BillingDashboard.jsx`, `new-nextjs-app/src/components/admin/SubscriptionAnalytics.jsx`, `new-nextjs-app/src/app/developers/[id]/page.tsx`, `new-nextjs-app/src/app/agent/Inquiries.jsx`
- Summary: Replaced legacy `@/lib/services/axios` imports with centralized `@/lib/services/http` and updated GET/DELETE calls accordingly.
- Rationale: Consolidate HTTP client usage under SSR-safe axios instance and prepare for full `api` wrapper migration.
- Audit mapping: Phase 0 — Centralized API Design; Step 1 migration of axios usage.
- Notes/Risks: Some modules still assume specific response envelopes; next pass will standardize via `api` wrappers where needed.
Change ID: 17
- Files affected: `new-nextjs-app/src/components/property/PropertyList.jsx`
- Summary: Removed `react-router-dom` by switching to `next/navigation` (`usePathname`, `useSearchParams`, `useRouter`); replaced URL updates with `router.replace` and guarded `window.scrollTo` for SSR safety.
- Rationale: Align with Next.js App Router and eliminate legacy router usage per audit.
- Audit mapping: Phase 1 — Routing hygiene; Trackable Issue: `src/components/property/PropertyList.jsx`.
- Notes/Risks: Initial filter default now uses `pathname` instead of `window.location.pathname`.
