# Urban Realty Codebase Audit Report

## Project Overview
- **Project Name**: Urban Realty
- **Architecture**: Monorepo with Server (Node.js/Express), Client (React/Vite), and Mobile (Flutter)
- **Current Status**: Production-ready with subscription system, payment integration, and admin dashboard

## Baseline Metrics (Phase 1 Step 1)
- Total files in repo: 415
- Detected duplication (via jscpd):
  - JS: 176 files, 8.19% duplicated lines
  - JSX: 112 files, 3.17% duplicated lines
  - Dart: 48 files, 9.02% duplicated lines
  - CSS: 11 files, 1.91% duplicated lines
  - Total clones found: 126 across server/client/mobile

### Notable Duplicate Areas
- Client footer pages: Terms, Privacy, Trust & Safety, Career, How We Work, Lawyer Consultancy, Interior Design, Packers & Movers
- Client admin pages: AdminReports/AdminAnalytics repeated blocks, tables and list sections
- Client subscription components: overlapping sections across BillingDashboard, SubscriptionManagement, and Comparison/Plans
- Client property pages: component duplication between home and property cards, EnhancedSearch vs MobileEnhancedSearch, PropertyDetails subcomponents
- Server: duplicate legacy `server/routes/*` and new `server/src/api/routes/*` routes present simultaneously; `middleware/errorHandler.js` duplicate in legacy and src
- Mobile: agent/admin dashboard and list screens share repeated structures

### Inline CSS
- No inline style attributes found in `client/src` (0 matches for `style="`).

## Structure Snapshot
- server: legacy folders (`controllers`, `routes`, `middleware`, `models`) plus new `src/` structure; `config/constants` centralized; environment validation present
- client: organized under `components`, `pages`, `context`, `services`, `utils`, `Theme`; Vite + Tailwind + MUI present
- mobile: Flutter app with providers, screens, config, assets, tests

## Build/Run Status (baseline)
- Client build attempted via root script pending dependency audit; to be validated after Step 3 updates.
- Server start via `node server/server.js` pending environment variables and DB connectivity; to be validated post env standardization.

## Recommendations Summary
- Consolidate duplicate server legacy folders into `server/src/*` exclusively; remove legacy duplicates once routes are verified.
- Create shared UI and composition patterns for duplicated client sections (footer pages, admin analytics/reports blocks, subscription modules, cards/search components).
- Factor repeated Flutter screen blocks into shared widgets and providers.
- Proceed with Phase 1 Steps 2–5 to enable safe subsequent refactors.
