# Cursor Migration Phases: Functionally Dependent React to Next.js Migration

## Prerequisites
1. Create directory structure:
   ```
   project-root/
   ├── old-react-app/     # Your current client folder
   └── new-nextjs-app/    # New Next.js project
   ```

2. Initialize Next.js project:
   ```bash
   cd new-nextjs-app
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir
   ```

---

## Phase 1: Foundation Setup (Testable: Next.js app runs)

### Cursor Prompt 1A: Core Configuration
```
Set up the foundational configuration for Next.js app based on React app.

RELOCATE AND UPDATE:
1. old-react-app/package.json → new-nextjs-app/package.json
   - Copy all dependencies exactly as they are
   - Remove: "react-router-dom", "vite", "@vitejs/*" packages
   - Update scripts to Next.js format:
     * "dev": "next dev"
     * "build": "next build" 
     * "start": "next start"
     * "lint": "next lint"

2. old-react-app/tailwind.config.js → new-nextjs-app/tailwind.config.js (replace existing)
3. old-react-app/postcss.config.cjs → new-nextjs-app/postcss.config.cjs (replace existing)

MERGE:
- old-react-app/eslint.config.js settings into new-nextjs-app/eslint.config.js (keep Next.js base)

After completion, I should be able to run `npm install` and `npm run dev` successfully.
```

### Test Phase 1:
```bash
cd new-nextjs-app
npm install
npm run dev
```
Verify: Next.js development server starts without errors.

---

## Phase 2: Static Assets and Global Styles (Testable: Assets load correctly)

### Cursor Prompt 2A: Public Assets and Global Styles
```
Relocate all static assets and global styling to make the basic Next.js app visually match the React app structure.

COPY ENTIRE DIRECTORIES:
1. old-react-app/public/* → new-nextjs-app/public/ (merge with existing, preserve all files)

RELOCATE GLOBAL STYLES:
2. old-react-app/index.css → merge content into new-nextjs-app/src/app/globals.css
3. old-react-app/src/index.css → new-nextjs-app/src/styles/index.css
4. old-react-app/src/App.css → new-nextjs-app/src/styles/App.css
5. old-react-app/src/styles/ → new-nextjs-app/src/styles/ (copy entire directory structure)

CREATE DIRECTORY if not exists: new-nextjs-app/src/styles/

After completion, the Next.js app should have access to all static assets and styling files.
```

### Test Phase 2:
- Verify static assets are accessible at `http://localhost:3000/[asset-name]`
- Check that styles directory is properly structured
- Confirm globals.css loads without errors

---

## Phase 3: Core Services and Utilities (Testable: Services can be imported)

### Cursor Prompt 3A: Services and Utilities Infrastructure
```
Relocate the core infrastructure that other components depend on.

RELOCATE THESE DIRECTORIES COMPLETELY:
1. old-react-app/src/services/ → new-nextjs-app/src/lib/services/
2. old-react-app/src/utils/ → new-nextjs-app/src/lib/utils/
3. old-react-app/src/constants/ → new-nextjs-app/src/lib/constants/
4. old-react-app/src/hooks/ → new-nextjs-app/src/hooks/

COPY ALL FILES exactly as they are:
- axios.js, analyticsService.js
- format.js and any other utility files
- api.js and any other constant files
- useApi.js, useAnalytics.js and any other hooks

CREATE these directories in new-nextjs-app/src/:
- lib/services/
- lib/utils/
- lib/constants/
- hooks/

After completion, I should be able to import these services in a test component without errors.
```

### Test Phase 3:
Create a test component that imports:
```javascript
// Test imports work
import axios from '@/lib/services/axios'
import { useApi } from '@/hooks/useApi'
```

---

## Phase 4: Theme System (Testable: Theme provides work)

### Cursor Prompt 4A: Theme Configuration and Context
```
Relocate the complete theme system to enable styled components.

RELOCATE THEME SYSTEM:
1. old-react-app/src/styles/Theme/ → new-nextjs-app/src/lib/theme/
2. old-react-app/src/context/ → new-nextjs-app/src/contexts/

COPY ALL CONTEXT FILES:
- ThemeContext.jsx, ThemeProvider.jsx  
- NewTheme.js and any other theme files
- All context files: AuthContext.jsx, PropertiesContext.jsx, DevelopersContext.jsx, AgentsContext.jsx

CREATE these directories:
- new-nextjs-app/src/contexts/
- new-nextjs-app/src/lib/theme/

IMPORTANT: Copy all files exactly as they are with no modifications to the code.

After completion, theme providers should be ready to wrap the Next.js app.
```

### Test Phase 4:
- Verify all context files are properly located
- Test that theme files can be imported
- Check that ThemeProvider can be imported without errors

---

## Phase 5: Layout Foundation (Testable: Basic layout renders)

### Cursor Prompt 5A: Layout Components and Common UI
```
Relocate layout and common components that form the foundation of the app structure.

RELOCATE THESE COMPONENT DIRECTORIES:
1. old-react-app/src/components/common/ → new-nextjs-app/src/components/common/
2. old-react-app/src/components/layout/ → new-nextjs-app/src/components/layout/
3. old-react-app/src/components/Layout/ → new-nextjs-app/src/components/layout/ (merge with above)
4. old-react-app/src/components/forms/ → new-nextjs-app/src/components/forms/

COPY ALL FILES INCLUDING:
- Header, Footer, ErrorBoundary components
- Breadcrumbs, layout components  
- Form components and React Hook Form inputs
- Any CSS files associated with these components

If there are file conflicts between layout/ and Layout/ directories, preserve both with clear naming.

After completion, basic layout components should be available for import.
```

### Test Phase 5:
- Import Header, Footer components in a test page
- Verify no import errors for common components
- Check that form components are accessible

---

## Phase 6: Root Layout Setup (Testable: App renders with providers)

### Cursor Prompt 6A: Convert App Structure to Next.js Layout
```
Convert the React app entry points to Next.js App Router layout.

CONVERT MAIN ENTRY POINTS:
1. Take provider setup logic from old-react-app/src/main.jsx
2. Take app structure from old-react-app/src/App.jsx  
3. Create new-nextjs-app/src/app/layout.tsx that combines both

REQUIREMENTS FOR layout.tsx:
- Import all providers from contexts directory
- Set up provider nesting exactly as in main.jsx: QueryClientProvider → BrowserRouter (remove this) → ThemeProvider → MuiThemeProvider → AuthProvider → PropertiesProvider → AgentsProvider → DevelopersProvider
- Include global ErrorBoundary
- Import global styles
- Remove BrowserRouter (not needed in Next.js)
- Keep all other provider logic identical

ALSO CREATE:
- new-nextjs-app/src/app/page.tsx (basic home page that says "Migration in Progress")

After completion, the Next.js app should render with all providers working.
```

### Test Phase 6:
```bash
npm run dev
```
- Verify app loads without provider errors
- Check browser console for any missing context errors
- Confirm theme switching works if applicable

---

## Phase 7: Home Page Components (Testable: Home page renders)

### Cursor Prompt 7A: Home Page Implementation
```
Relocate home page components and create a functional home page.

RELOCATE HOME COMPONENTS:
1. old-react-app/src/components/home/ → new-nextjs-app/src/components/home/
2. old-react-app/src/pages/Home/ → use for creating new-nextjs-app/src/app/page.tsx

COPY ALL FILES:
- All home page sections/components with associated CSS
- HeroSection, PropertyCard, PropertiesSection, ServiceBlock, etc.
- Any images within components (note for later optimization)

UPDATE new-nextjs-app/src/app/page.tsx:
- Replace placeholder with actual home page component from old-react-app/src/pages/Home/
- Keep all component logic and imports exactly the same
- Just change the file structure to Next.js format

After completion, the home page should render with all sections visible.
```

### Test Phase 7:
- Visit `http://localhost:3000` 
- Verify home page renders all sections
- Check for any missing component errors
- Test basic navigation elements

---

## Phase 8: Authentication System (Testable: Auth flows work)

### Cursor Prompt 8A: Authentication Pages and Components
```
Relocate authentication system to enable user login/register functionality.

CREATE AUTH ROUTE STRUCTURE:
1. new-nextjs-app/src/app/(auth)/login/page.tsx
2. new-nextjs-app/src/app/(auth)/register/page.tsx

RELOCATE AUTH PAGES:
- old-react-app/src/pages/Auth/Login → content for login/page.tsx
- old-react-app/src/pages/Auth/Register → content for register/page.tsx

COPY FILES EXACTLY:
- Maintain all component logic, forms, and styling
- Keep all authentication flows identical
- Preserve any associated CSS files

After completion, login and register pages should be accessible and functional.
```

### Test Phase 8:
- Visit `/login` and `/register` routes
- Verify forms render correctly
- Test that authentication context works
- Check form validation and submission (may not fully work until API is connected)

---

## Phase 9: Property System (Testable: Property listings work)

### Cursor Prompt 9A: Property Components and Pages
```
Relocate the property management system including listings and details.

RELOCATE PROPERTY COMPONENTS:
1. old-react-app/src/components/property/ → new-nextjs-app/src/components/property/

CREATE PROPERTY PAGES:
2. new-nextjs-app/src/app/properties/page.tsx (from old-react-app/src/pages/Properties/)
3. new-nextjs-app/src/app/properties/[id]/page.tsx (from old-react-app/src/pages/PropertyDetails/)
4. new-nextjs-app/src/app/properties/add/page.tsx (from old-react-app/src/pages/AddProperty/)

COPY ALL FILES:
- Property search UI, maps, property cards
- All PropertyDetails sub-sections and components
- Add property forms and functionality
- Maintain all folder structures and associated files

After completion, property listing, viewing, and adding should work.
```

### Test Phase 9:
- Visit `/properties` route
- Test property listing displays
- Check individual property detail pages
- Verify add property page renders
- Test property search and filtering

---

## Phase 10: User Management (Testable: User profiles work)

### Cursor Prompt 10A: User Components and Profile System
```
Relocate user management system including profiles and user-related functionality.

RELOCATE USER COMPONENTS:
1. old-react-app/src/components/User/ → new-nextjs-app/src/components/user/
2. old-react-app/src/components/ui/ → new-nextjs-app/src/components/ui/

CREATE USER PAGES:
3. new-nextjs-app/src/app/user/profile/page.tsx (from old-react-app/src/pages/User/)

COPY ALL FILES:
- User profile UI components
- Mobile navigation and UI components  
- Any user-related forms and functionality
- Maintain all component logic and styling

After completion, user profile and related functionality should work.
```

### Test Phase 10:
- Test user profile page renders
- Verify user-related components work
- Check mobile navigation elements
- Test user settings and profile editing

---

## Phase 11: Developer System (Testable: Developer features work)

### Cursor Prompt 11A: Developer Management System
```
Relocate developer management functionality.

CREATE DEVELOPER PAGES:
1. new-nextjs-app/src/app/developers/page.tsx (from old-react-app/src/pages/Developer/)
2. new-nextjs-app/src/app/developers/[id]/page.tsx (developer details)
3. new-nextjs-app/src/app/developers/add/page.tsx (add developer)
4. new-nextjs-app/src/app/developers/[id]/edit/page.tsx (edit developer)

COPY ALL FILES:
- All developer page components: DeveloperList, DeveloperDetails, AddDeveloperPage, EditDeveloperPage
- Any associated CSS files
- Maintain all CRUD functionality for developers

After completion, developer listing, viewing, adding, and editing should work.
```

### Test Phase 11:
- Visit `/developers` route
- Test developer listings display
- Check developer detail pages
- Verify add/edit developer functionality

---

## Phase 12: Subscription System (Testable: Subscription features work)

### Cursor Prompt 12A: Subscription Management
```
Relocate subscription and billing functionality.

RELOCATE SUBSCRIPTION COMPONENTS:
1. old-react-app/src/components/Subscription/ → new-nextjs-app/src/components/subscription/

CREATE SUBSCRIPTION PAGES:
2. new-nextjs-app/src/app/subscriptions/page.tsx
3. new-nextjs-app/src/app/subscription-management/page.tsx  
4. new-nextjs-app/src/app/subscription-comparison/page.tsx
5. new-nextjs-app/src/app/billing-dashboard/page.tsx

COPY ALL FILES:
- SubscriptionPlans, SubscriptionComparison, SubscriptionManagement, BillingDashboard
- All subscription-related components and logic
- Maintain all billing and subscription functionality

After completion, subscription management should be fully functional.
```

### Test Phase 12:
- Test subscription plan pages
- Verify billing dashboard functionality  
- Check subscription comparison features
- Test subscription management interface

---

## Phase 13: Admin System (Testable: Admin dashboard works)

### Cursor Prompt 13A: Admin Dashboard and Management
```
Relocate complete admin system for property management.

RELOCATE ADMIN COMPONENTS:
1. old-react-app/src/components/admin/ → new-nextjs-app/src/components/admin/

CREATE ADMIN PAGES STRUCTURE:
2. new-nextjs-app/src/app/admin/layout.tsx (admin layout)
3. new-nextjs-app/src/app/admin/(dashboard)/page.tsx (main dashboard)
4. new-nextjs-app/src/app/admin/(dashboard)/analytics/page.tsx
5. new-nextjs-app/src/app/admin/(dashboard)/users/page.tsx
6. new-nextjs-app/src/app/admin/(dashboard)/properties/page.tsx
7. new-nextjs-app/src/app/admin/(dashboard)/contacts/page.tsx
8. new-nextjs-app/src/app/admin/(dashboard)/media/page.tsx
9. new-nextjs-app/src/app/admin/(dashboard)/reports/page.tsx
10. new-nextjs-app/src/app/admin/(dashboard)/settings/page.tsx

COPY FROM:
- old-react-app/src/pages/admin/ (all admin pages)
- Maintain all admin functionality: dashboards, analytics, user management, property management

After completion, complete admin system should be functional.
```

### Test Phase 13:
- Visit `/admin` route
- Test admin dashboard loads
- Check all admin sub-sections
- Verify admin analytics and management features

---

## Phase 14: Agent System (Testable: Agent dashboard works)

### Cursor Prompt 14A: Agent Dashboard and Tools
```
Relocate agent management system and tools.

RELOCATE AGENT COMPONENTS:
1. old-react-app/src/components/agent/ → new-nextjs-app/src/components/agent/

CREATE AGENT PAGES:
2. new-nextjs-app/src/app/agent/layout.tsx (agent layout)
3. new-nextjs-app/src/app/agent/(dashboard)/page.tsx (main dashboard)
4. new-nextjs-app/src/app/agent/(dashboard)/properties/page.tsx
5. new-nextjs-app/src/app/agent/(dashboard)/leads/page.tsx
6. new-nextjs-app/src/app/agent/(dashboard)/analytics/page.tsx
7. new-nextjs-app/src/app/agent/(dashboard)/inquiries/page.tsx
8. new-nextjs-app/src/app/agent/(dashboard)/settings/page.tsx

COPY FROM:
- old-react-app/src/pages/Agent/ (all agent pages)
- Maintain all agent functionality: dashboards, analytics, leads, properties, settings

After completion, complete agent system should be functional.
```

### Test Phase 14:
- Visit `/agent` route
- Test agent dashboard functionality
- Check agent tools and analytics
- Verify agent property management

---

## Phase 15: Footer Content and Remaining Pages (Testable: All routes work)

### Cursor Prompt 15A: Footer Pages and Remaining Content
```
Relocate all remaining footer pages and any missed content.

CREATE FOOTER CONTENT PAGES:
1. new-nextjs-app/src/app/about/page.tsx
2. new-nextjs-app/src/app/contact/page.tsx
3. new-nextjs-app/src/app/help/page.tsx
4. new-nextjs-app/src/app/privacy-policy/page.tsx
5. new-nextjs-app/src/app/terms/page.tsx
6. new-nextjs-app/src/app/career/page.tsx
7. new-nextjs-app/src/app/trust/page.tsx
8. new-nextjs-app/src/app/how-we-work/page.tsx
9. new-nextjs-app/src/app/lawyer-consultancy/page.tsx
10. new-nextjs-app/src/app/packers-and-movers/page.tsx
11. new-nextjs-app/src/app/interior-design/page.tsx
12. new-nextjs-app/src/app/emi-calculator/page.tsx

COPY CONTENT FROM:
- old-react-app/src/components/common/footer/* (footer content components)
- Create corresponding pages for each footer link
- Maintain all content and functionality

ALSO CHECK:
- Scan old-react-app/src/ for any remaining files or directories not yet relocated
- Copy any missed components, pages, or functionality

After completion, all website routes should be functional and accessible.
```

### Test Phase 15:
- Test all footer links work
- Verify all content pages load
- Check for any broken routes
- Confirm complete site navigation

---

## Phase 16: Testing and Verification (Testable: Complete functionality)

### Cursor Prompt 16A: Testing Setup and Final Verification
```
Relocate testing infrastructure and perform final verification.

RELOCATE TESTING:
1. old-react-app/src/__tests__/ → new-nextjs-app/src/__tests__/
2. old-react-app/src/tests/ → new-nextjs-app/src/tests/
3. old-react-app/vitest.setup.ts → new-nextjs-app/vitest.setup.ts
4. old-react-app/src/setupTests.ts → new-nextjs-app/src/setupTests.ts

FINAL VERIFICATION:
5. Check old-react-app/src/ for any remaining files not relocated
6. Verify all routes are accessible and functional
7. Test that all major features work: auth, properties, admin, agent, subscriptions
8. Confirm all components render without errors

PROVIDE SUMMARY:
- List all successfully migrated features
- Note any issues or missing functionality
- Highlight any files that couldn't be relocated

After completion, the entire application should be fully functional in Next.js.
```

### Test Phase 16:
- Run complete application testing
- Test all user flows: registration, login, property browsing, admin functions
- Verify no major functionality is broken
- Check browser console for any remaining errors

---

## Summary

This phase-by-phase approach ensures:

1. **Each phase is independently testable** - you can verify functionality works before moving on
2. **Dependency order is maintained** - services and contexts are set up before components that use them
3. **Incremental functionality** - each phase adds working features to your Next.js app
4. **Risk mitigation** - problems can be identified and fixed at each phase
5. **Progress tracking** - clear milestones to measure migration progress

After completing all phases, you'll have a fully functional Next.js application with all your original React functionality preserved and working.
