## Urban Realty Mobile (Flutter)

This Flutter app consumes the same APIs as the existing web client, targeting both Android and iOS.

### Prerequisites
- Flutter SDK (3.x recommended)
- Android Studio or Xcode (for device emulators)
- A running backend at one of:
  - Production: https://urban-realty-production.up.railway.app/api/v1
  - Local: http://localhost:5000/api/v1

### Configure API base URL
Update `lib/config/api_config.dart` to switch between production and local environments.

### Run
```bash
flutter pub get
flutter run
```

If running the backend locally on a device/emulator, ensure the base URL points to your machine's LAN IP instead of `localhost` (e.g., `http://192.168.1.50:5000/api/v1`). On Android emulators you can also use `http://10.0.2.2:5000/api/v1`.

### Build
- Android: `flutter build apk`
- iOS: `flutter build ios`

### Features
- Login, fetch current user
- List properties, view details
- Token-based auth with bearer token

### Project structure
```
mobile/
  lib/
    config/api_config.dart
    services/
      http_client.dart
      auth_service.dart
      property_service.dart
    screens/
      login_screen.dart
      properties_screen.dart
  pubspec.yaml
```

