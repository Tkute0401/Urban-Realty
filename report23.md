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

