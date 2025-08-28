# Mobile App Setup Guide

## 🚀 Quick Start

This guide will help you set up and run the enhanced SQUARE FOOOT mobile app.

## 📋 Prerequisites

### Required Software
- **Flutter SDK** (3.24.5 or higher)
- **Android Studio** or **VS Code**
- **Java 17** (for Android development)
- **Android SDK** (API level 34 or higher)

### System Requirements
- **Operating System**: Windows, macOS, or Linux
- **RAM**: 8GB minimum (16GB recommended)
- **Storage**: 10GB free space
- **Internet**: Required for downloading dependencies

## 🔧 Installation Steps

### 1. Install Flutter SDK
```bash
# Download Flutter
curl -O https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.24.5-stable.tar.xz

# Extract Flutter
tar xf flutter_linux_3.24.5-stable.tar.xz

# Add Flutter to PATH
export PATH="$PATH:/path/to/flutter/bin"
```

### 2. Install Android SDK
```bash
# Download Android Command Line Tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip

# Extract to android-sdk directory
unzip commandlinetools-linux-11076708_latest.zip -d android-sdk

# Create proper directory structure
mkdir -p android-sdk/cmdline-tools/latest
mv android-sdk/cmdline-tools/* android-sdk/cmdline-tools/latest/

# Set environment variables
export ANDROID_HOME=/path/to/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

# Accept licenses
yes | sdkmanager --licenses

# Install required SDK components
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### 3. Install Java 17
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y openjdk-17-jdk

# macOS (using Homebrew)
brew install openjdk@17

# Windows
# Download from Oracle or use Chocolatey: choco install openjdk17
```

### 4. Configure Flutter
```bash
# Set Java directory
flutter config --jdk-dir=/usr/lib/jvm/java-17-openjdk-amd64

# Verify installation
flutter doctor
```

## 📱 Running the App

### 1. Navigate to Project
```bash
cd mobile
```

### 2. Install Dependencies
```bash
flutter pub get
```

### 3. Run the App
```bash
# For debug mode
flutter run

# For release build
flutter build apk --release

# For specific device
flutter run -d <device-id>
```

## 🎯 Available Routes

The enhanced app includes the following routes:

- `/login` - Login screen
- `/enhanced-home` - Enhanced home screen with modern UI
- `/properties` - Properties listing
- `/search` - Search functionality
- `/notifications` - Notifications screen
- `/settings` - Settings screen
- `/dashboard` - Dashboard screen
- `/favorites` - Favorites screen
- `/profile` - User profile
- `/enhanced-property-detail` - Enhanced property detail screen

## 🔍 Testing the App

### 1. Build Verification
```bash
# Check for any build issues
flutter analyze

# Run tests
flutter test

# Build APK
flutter build apk --debug
```

### 2. Key Features to Test
- ✅ Navigation between screens
- ✅ Search functionality
- ✅ Property detail viewing
- ✅ Image loading and caching
- ✅ Theme switching (light/dark)
- ✅ Quick actions (Buy, Rent, Sell, Favorites)
- ✅ Property filtering
- ✅ Loading states and animations

## 🛠️ Development

### Project Structure
```
mobile/
├── lib/
│   ├── config/
│   │   └── app_theme.dart          # Enhanced theme system
│   ├── providers/
│   │   └── theme_provider.dart     # Theme state management
│   ├── screens/
│   │   ├── enhanced_home_screen.dart           # New enhanced home
│   │   ├── enhanced_property_detail_screen.dart # New enhanced detail
│   │   ├── login_screen.dart
│   │   ├── properties_screen.dart
│   │   └── ... (other screens)
│   ├── services/
│   └── widgets/
├── android/                         # Android platform files
├── pubspec.yaml                     # Dependencies
└── README.md
```

### Key Dependencies
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.2.1                      # API calls
  shared_preferences: ^2.2.2        # Local storage
  provider: ^6.1.1                  # State management
  cached_network_image: ^3.3.1      # Image caching
  shimmer: ^3.0.0                   # Loading effects
  url_launcher: ^6.2.4              # External links
  intl: ^0.19.0                     # Formatting
```

## 🎨 Customization

### Theme Colors
Edit `lib/config/app_theme.dart` to customize:
- Primary color (currently orange #FF6B35)
- Secondary color (deep blue #1A00CD)
- Surface colors
- Text styles

### Adding New Screens
1. Create new screen file in `lib/screens/`
2. Add route in `lib/main.dart`
3. Update navigation as needed

## 🐛 Troubleshooting

### Common Issues

#### Build Fails
```bash
# Clean and rebuild
flutter clean
flutter pub get
flutter build apk --debug
```

#### Java Version Issues
```bash
# Check Java version
java -version

# Set correct Java version
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

#### Android SDK Issues
```bash
# Check Android SDK
flutter doctor

# Install missing components
sdkmanager "platform-tools" "platforms;android-34"
```

#### Dependencies Issues
```bash
# Update dependencies
flutter pub upgrade

# Check for conflicts
flutter pub deps
```

## 📞 Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Review the `MOBILE_APP_ENHANCEMENTS.md` file
3. Check Flutter documentation: https://docs.flutter.dev/
4. Create an issue in the project repository

## 🚀 Next Steps

After successful setup:

1. **Explore the UI**: Navigate through all screens to see the enhancements
2. **Test Features**: Try search, filtering, and property details
3. **Customize**: Modify colors, themes, or add new features
4. **Deploy**: Build release APK for production deployment

---

**Happy Coding! 🎉**