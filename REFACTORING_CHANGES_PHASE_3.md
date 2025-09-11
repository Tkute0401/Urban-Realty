## Refactoring Changes — Phase 3 (Client-Side Refactoring)

Date: {{AUTO}}

### Overview
This document tracks structural and code changes performed in Phase 3 to organize the React client into a scalable architecture, introduce a design system, and prepare a theming and component library foundation.

### Changes

1) Client Directory Scaffolding
- Created base folders aligned with plan:
  - `client/src/components/ui/`
  - `client/src/components/forms/`
  - `client/src/components/layout/`
  - `client/src/components/feature/`
  - `client/src/hooks/`
  - `client/src/context/`
  - `client/src/services/`
  - `client/src/utils/`
  - `client/src/constants/`
  - `client/src/styles/themes/`
  - `client/src/styles/components/`
  - `client/src/styles/globals/`
  - `client/src/assets/`
  - `client/src/types/`

2) Documentation
- Added this file to document decisions, edits, and follow-ups for Phase 3.

### Next
- Migrate existing components into the new structure.
- Add more base components and accessibility improvements.
- Document Storybook usage in client README.

### Verification
- Client builds successfully after each structural change.
- No broken imports; alias adjustments documented when applied.

### This Session
 - Step 19 (CSS Optimization & Consolidation): Migrated inline styles to CSS Modules for base UI kit
   - `client/src/components/ui/Modal.jsx` -> `Modal.module.css`
   - `client/src/components/ui/Button.jsx` -> `Button.module.css` (added `clsx` composition)
   - `client/src/components/ui/Input.jsx` -> `Input.module.css`
   - Updated hover/focus states using CSS instead of DOM style mutations
 - Step 19 (CSS Optimization & Consolidation): Removed inline styles in common header
   - `client/src/components/common/Header.jsx`: eliminated inline position for mobile menu and logout button styles
   - `client/src/components/common/Header.css`: added absolute positioning to `.mobile-menu` and `.button-link` class
 - Step 19 (CSS Optimization & Consolidation): Consolidated icon sizing in PropertyCard
   - `client/src/components/property/PropertyCard.jsx`: replaced inline icon sizes with utility classes
   - `client/src/styles/components/utilities.css`: added `.icon-sm` and `.icon-lg`
 - Step 19 (CSS Optimization & Consolidation): Removed inline styles in home components
   - `client/src/components/home/PropertyCard.jsx`: icon size via `text-[1rem]`
   - `client/src/pages/Properties/Properties.jsx`: search icon color via `text-white`
   - `client/src/components/home/HeroSection.jsx`: z-index via `z-[...]` utility classes

### Commands
To run Storybook in the client app:

```
cd client
npx storybook@latest dev -p 6006
```

### Step 22: API Client Optimization (Completed)
### Step 21: Form Handling Standardization (In Progress)
- Added `react-hook-form` and `@hookform/resolvers` for schema-based validation.
- Created `components/forms/RHFTextField.jsx` for consistent MUI TextField integration.
- Refactored `pages/Auth/Login.jsx` to RHF with Zod validation; unified loading state.
- Migrated `pages/Auth/Register.jsx` to RHF + Zod with conditional professional fields (Agent/Developer) and validation for RERA ID.
 - Migrated footer forms to RHF + Zod:
   - `components/common/footer/ContactUs.jsx` (adds validation, loading, accessibility attributes)
   - `components/common/footer/HelpCenter.jsx` (question form migrated; adds validation and loading)

- Centralized API endpoints and query keys in `client/src/constants/api.js`.
- Added reusable hooks in `client/src/hooks/useApi.js` wrapping Axios + React Query:
  - `useApiQuery`, `useApiMutation`, `useApiClient`.
- Enables standardized data fetching, caching, and invalidation patterns.

Verification:
- Vite production build succeeded; Vitest smoke test passed.

### Step 25: Navigation & Routing Optimization (Breadcrumbs)
- Added reusable Breadcrumbs component at `client/src/components/layout/Breadcrumbs.jsx`.
- Integrated breadcrumbs into `client/src/components/Layout/layout.jsx` above page content.
- Labels are derived from the current path with title-casing and separators via MUI `Breadcrumbs`.
- Home link always shown; last segment rendered as plain text.

Verification:
- App routes render correctly with lazy loading in place.
- Breadcrumbs appear on all routes except the home page (no segments after `/`).
