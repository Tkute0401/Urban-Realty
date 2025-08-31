# Urban Realty Mobile App

A Flutter mobile application for Urban Realty, providing a complete real estate platform with property listings, user management, and subscription features.

## Features

### Authentication
- User registration and login
- Secure token storage using flutter_secure_storage
- Role-based access (buyer, agent, developer, admin)
- Profile management

### Properties
- Browse property listings with filters
- Property search with autocomplete
- Property details with image carousel
- Add/edit properties (for agents/developers)
- Favorites and recently viewed
- Contact agents

### Subscriptions
- View subscription plans
- Payment integration (Razorpay)
- Subscription management
- Feature access control

### Additional Features
- Push notifications
- Offline support
- Image caching
- Responsive design
- Dark/Light theme

## Installation

1. Ensure you have Flutter SDK installed (version 3.3.0 or higher)
2. Clone the repository
3. Navigate to the mobile directory
4. Install dependencies:

```bash
flutter pub get
```

5. Run the app:

```bash
flutter run
```

## Dependencies

The app uses the following key dependencies:

- **dio**: HTTP client with interceptors
- **flutter_secure_storage**: Secure token storage
- **provider**: State management
- **cached_network_image**: Image caching
- **image_picker**: Image selection
- **carousel_slider**: Image carousel
- **razorpay_flutter**: Payment integration
- **firebase_messaging**: Push notifications

## Project Structure

```
lib/
├── config/           # App configuration
├── models/           # Data models
├── providers/        # State management
├── screens/          # UI screens
├── services/         # API services
├── utils/            # Utility functions
├── widgets/          # Reusable widgets
└── main.dart         # App entry point
```

## API Integration

The app connects to the Urban Realty backend API with the following endpoints:

- **Auth**: `/api/v1/auth/*`
- **Properties**: `/api/v1/properties/*`
- **Developers**: `/api/v1/developers/*`
- **Subscriptions**: `/api/v1/subscriptions/*`

## Testing

Run tests with:

```bash
flutter test
```

## Building for Production

### Android
```bash
flutter build apk --release
```

### iOS
```bash
flutter build ios --release
```

## Contributing

1. Follow Flutter best practices
2. Write tests for new features
3. Use proper error handling
4. Maintain code documentation

## License

This project is proprietary software for Urban Realty.
