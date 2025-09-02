## Phase 4: Mobile App Refactoring — Step 36 (Flutter Project Structure Optimization)

### Overview
This step introduces a scalable directory structure for the Flutter app, aligning with the refactoring guide. We added `core`, `features`, and `shared` domains and created barrel exports to enable clean imports during ongoing migration.

### Changes Made
- Created new directories:
  - `mobile/lib/core/{constants,utils,services,config}`
  - `mobile/lib/features/{auth,properties,profile,admin,agent,developers,notifications,search,subscription,settings,add_property,static_pages,home}`
  - `mobile/lib/shared/{widgets,models,providers}`
- Added barrel export files:
  - `mobile/lib/core/config/index.dart`
  - `mobile/lib/core/utils/index.dart`
  - `mobile/lib/core/services/index.dart`
  - `mobile/lib/shared/widgets/index.dart`
  - `mobile/lib/shared/models/index.dart`
  - `mobile/lib/shared/providers/index.dart`

### Barrel Contents
- `core/config/index.dart` re-exports `api_config.dart`, `app_theme.dart`, `environment_config.dart`
- `core/utils/index.dart` re-exports `utils.dart`
- `core/services/index.dart` re-exports API and domain services
- `shared/widgets/index.dart` re-exports shared widgets
- `shared/models/index.dart` re-exports shared models
- `shared/providers/index.dart` re-exports providers

### Follow-up Progress
- Added barrel files:
  - `core/config/index.dart`, `core/utils/index.dart`, `core/services/index.dart`
  - `shared/providers/index.dart`, `shared/models/index.dart`, `shared/widgets/index.dart`
- Created feature re-export stubs so imports can be updated without moving files yet:
  - `features/{auth,home,profile,settings,search,subscription,properties,static_pages,admin,agent,developers,notifications,splash}/*`
  - Batch 1 added:
    - `features/home/dashboard_screen.dart`
    - `features/home/home_tabs.dart`
    - `features/notifications/notifications_screen.dart`
    - `features/profile/profile_screen.dart`
    - `features/properties/properties_screen.dart`
    - `features/search/search_screen.dart`
    - `features/settings/settings_screen.dart`
    - `features/subscription/subscription_screen.dart`
    - `features/add_property/add_property_screen.dart`
    - `features/static_pages/static_pages.dart`
    - `features/favorites/favorites_screen.dart`
- Updated `main.dart` to import from `features/*` and `shared/providers/*`

### Auth Screens Migration (Step 36 continuation)
- Moved implementations into feature files:
  - `features/auth/login_screen.dart` now contains the full Login screen implementation
  - `features/auth/register_screen.dart` now contains the full Register screen implementation
- Converted legacy screens to re-exports:
  - `screens/login_screen.dart` -> `export '../features/auth/login_screen.dart';`
  - `screens/register_screen.dart` -> `export '../features/auth/register_screen.dart';`

Verification:
- `main.dart` already routes to `features/auth/*`; no changes required.
- Will run `flutter analyze` and a build in a Flutter-enabled environment.

### Providers Migration (Step 36 continuation)
- Moved providers to `shared/providers/` and updated barrel exports:
  - `shared/providers/auth_provider.dart`
  - `shared/providers/properties_provider.dart`
  - `shared/providers/theme_provider.dart`
- Left compatibility re-export stubs in `providers/` to avoid breaking existing imports.

### Next Steps (Step 36 continuation)
- Incrementally move screens from `screens/` into `features/*` directories
- Move providers to `shared/providers` and update imports
- Move widgets/models to `shared` and update re-exports
- Run `flutter analyze` and tests after each batch of moves

### State Management Optimization (Step 37)
- Enhanced `shared/providers/auth_provider.dart` to improve offline readiness and startup UX:
  - Persist user JSON in secure storage under `user_cache` after successful `_getMe()`.
  - Load cached user on `tryAutoLogin()` when token is absent for limited offline mode.
  - Clear `user_cache` on `logout`.

Verification Plan:
- Run `flutter analyze` and add a widget test to validate cached user render without network.

### API Integration Enhancement (Step 38)
- Updated `services/api_service.dart` to improve resilience and DX:
  - Add request interceptor to apply `Authorization` and `Accept` headers.
  - Add error interceptor with retry/backoff on network and 503 errors (max 2 retries: 300ms, 600ms).
  - Normalize error messages for consistent UI handling.

Verification Plan:
- Create integration tests to simulate timeouts and 503 responses and assert retry attempts.
- Ensure UI surfaces user-friendly error strings.

### Verification
- Scaffolding committed and pushed
- Barrel files verified present:
  - `mobile/lib/core/{config,utils,services}/index.dart`
  - `mobile/lib/shared/{providers,models,widgets}/index.dart`
- `main.dart` imports resolve against barrels and features
- Next: begin moving providers and screens incrementally

### Additional Changes
- Added feature re-export adapter:
  - `features/splash/splash_screen.dart` re-exports `screens/splash_screen.dart`
- Purpose: allow progressive migration of imports to `features/` without breaking.

