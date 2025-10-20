# Urban Realty Mobile - Production Deployment Guide

## 📋 Overview

This guide covers the complete production deployment process for the Urban Realty mobile application, including build configuration, CI/CD setup, and app store submission.

## 🔧 Build Configuration

### Android Configuration

**Build Variants:**
- **Development**: Debug builds with dev API endpoints
- **Staging**: Testing builds with staging API endpoints  
- **Production**: Release builds with production API endpoints

**Build Commands:**
```bash
# Development
flutter build apk --flavor development --debug

# Staging
flutter build apk --flavor staging --release

# Production
flutter build apk --flavor production --release
flutter build appbundle --flavor production --release
```

**Key Configuration Files:**
- `android/app/build.gradle` - Build configuration with flavors and signing
- `android/app/proguard-rules.pro` - Code obfuscation rules
- `android/key.properties` - Keystore configuration (not in version control)

### iOS Configuration

**Build Commands:**
```bash
# Development
flutter build ios --flavor development --debug

# Staging  
flutter build ios --flavor staging --release

# Production
flutter build ios --flavor production --release
```

**Key Configuration Files:**
- `ios/Runner.xcodeproj` - Xcode project configuration
- `ios/Runner/Info.plist` - App metadata and permissions
- `ios/ExportOptions.plist` - App Store export configuration

## 🔐 Code Signing

### Android Signing

1. Generate keystore:
```bash
keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

2. Create `android/key.properties`:
```properties
storePassword=<password>
keyPassword=<password>
keyAlias=upload
storeFile=../upload-keystore.jks
```

3. Configure signing in `build.gradle` (already configured)

### iOS Signing

1. Create App ID in Apple Developer Portal
2. Generate provisioning profiles
3. Configure signing in Xcode
4. Add certificates to CI/CD secrets

## 🚀 CI/CD Pipeline

### GitHub Actions Workflow

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests
- Release tags

**Jobs:**
1. **Test** - Run unit, widget, and integration tests
2. **Build Android** - Build APK and App Bundle
3. **Build iOS** - Build iOS app
4. **Deploy Android** - Deploy to Google Play
5. **Deploy iOS** - Deploy to App Store

**Required Secrets:**
```
GOOGLE_PLAY_SERVICE_ACCOUNT_JSON
APP_STORE_API_KEY
APP_STORE_API_ISSUER
ANDROID_KEYSTORE_BASE64
ANDROID_KEYSTORE_PASSWORD
IOS_CERTIFICATE_BASE64
IOS_PROVISIONING_PROFILE_BASE64
```

### Manual Deployment

**Android:**
```bash
# Build release
flutter build appbundle --release --flavor production

# Upload to Google Play Console
# Navigate to: https://play.google.com/console
# Upload: build/app/outputs/bundle/productionRelease/app-production-release.aab
```

**iOS:**
```bash
# Build release
flutter build ios --release --flavor production

# Archive in Xcode
# Upload to App Store Connect
```

## 📱 App Store Submission

### Google Play Store

**Requirements:**
- App Bundle (.aab file)
- App icon (512x512 PNG)
- Feature graphic (1024x500 PNG)
- Screenshots (phone, tablet, TV)
- Privacy policy URL
- App description and metadata

**Steps:**
1. Create app in Google Play Console
2. Complete store listing
3. Upload app bundle
4. Set up pricing and distribution
5. Submit for review

### Apple App Store

**Requirements:**
- IPA file
- App icon (1024x1024 PNG)
- Screenshots (iPhone, iPad)
- Privacy policy URL
- App description and metadata

**Steps:**
1. Create app in App Store Connect
2. Complete app information
3. Upload build via Xcode or Transporter
4. Submit for review

## 🎨 App Store Assets

### Icon Requirements

**Android:**
- 512x512 PNG (Google Play)
- Various sizes in `android/app/src/main/res/mipmap-*`

**iOS:**
- 1024x1024 PNG (App Store)
- Various sizes in `ios/Runner/Assets.xcassets/AppIcon.appiconset`

### Screenshots

**Android:**
- Phone: 1080x1920 or 1080x2340
- Tablet: 1536x2048 or 2048x2732
- Minimum 2, maximum 8 per device type

**iOS:**
- iPhone 6.7": 1290x2796
- iPhone 6.5": 1242x2688
- iPad Pro: 2048x2732
- Minimum 1, maximum 10 per device type

## 🔒 Security Checklist

- [ ] Enable ProGuard/R8 for Android
- [ ] Enable bitcode for iOS
- [ ] Remove debug logs
- [ ] Obfuscate API keys
- [ ] Enable SSL pinning
- [ ] Implement certificate pinning
- [ ] Add security headers
- [ ] Enable app signing
- [ ] Configure content security policy
- [ ] Implement biometric authentication

## 📊 Performance Optimization

- [ ] Enable code splitting
- [ ] Optimize images
- [ ] Minimize bundle size
- [ ] Enable caching
- [ ] Implement lazy loading
- [ ] Profile app performance
- [ ] Monitor crash reports
- [ ] Track analytics

## 🧪 Pre-Release Testing

- [ ] Run all unit tests
- [ ] Run all widget tests
- [ ] Run all integration tests
- [ ] Test on real devices
- [ ] Test different OS versions
- [ ] Test different screen sizes
- [ ] Test offline functionality
- [ ] Test payment flows
- [ ] Test push notifications
- [ ] Perform security audit

## 📈 Post-Release Monitoring

**Metrics to Track:**
- Crash rate
- ANR (Application Not Responding) rate
- App size
- Download/install rate
- User ratings and reviews
- Performance metrics
- API response times
- User engagement

**Tools:**
- Firebase Crashlytics
- Google Analytics
- Firebase Performance Monitoring
- App Store Connect Analytics
- Google Play Console Analytics

## 🔄 Version Management

**Version Format:** `MAJOR.MINOR.PATCH+BUILD`

Example: `1.0.0+1`

**Update Process:**
1. Update version in `pubspec.yaml`
2. Update version code/build number
3. Update changelog
4. Create git tag
5. Build and deploy

## 📝 Release Checklist

- [ ] Update version number
- [ ] Update changelog
- [ ] Run all tests
- [ ] Build release artifacts
- [ ] Test release build
- [ ] Update app store metadata
- [ ] Upload screenshots
- [ ] Submit for review
- [ ] Monitor crash reports
- [ ] Respond to user feedback

## 🆘 Troubleshooting

### Common Issues

**Build Failures:**
- Clean build: `flutter clean && flutter pub get`
- Update Flutter: `flutter upgrade`
- Check dependencies: `flutter doctor`

**Signing Issues:**
- Verify keystore path
- Check password configuration
- Ensure certificates are valid

**Upload Failures:**
- Check bundle size limits
- Verify API credentials
- Ensure correct format

## 📞 Support

For deployment issues:
- Check Flutter documentation
- Review platform-specific guides
- Contact platform support teams

## 🎉 Success Criteria


Your app is ready for production when:
- All tests pass
- No critical bugs
- Performance meets targets
- Security audit complete
- App store guidelines met
- Legal requirements satisfied
- Analytics configured
- Monitoring enabled

---

**Last Updated:** 2024
**Version:** 1.0.0
**Maintained by:** Urban Realty Development Team



