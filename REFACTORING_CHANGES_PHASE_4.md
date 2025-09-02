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

### Next Steps (Step 36 follow-up)
- Incrementally move files into the new structure:
  - Move configs to `core/config`, services to `core/services`, utilities to `core/utils`
  - Move models/providers/widgets to `shared`
  - Group screens into `features/*`
- Update imports to use barrel exports gradually to avoid breakage
- Run builds and tests after each batch of moves

### Verification
- Scaffolding committed and pushed to `main`
- Next commit will update imports and begin moving files without breaking the build

