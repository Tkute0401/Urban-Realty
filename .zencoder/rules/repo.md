---
description: Repository Information Overview
alwaysApply: true
---

# Repository Information Overview

## Repository Summary
Urban Realty is a comprehensive real estate platform built as a monorepo containing multiple applications: a Node.js/Express backend, a React web client, a Next.js frontend, and a Flutter mobile app. The platform offers property listings, user management, subscription services, and advanced search capabilities.

## Repository Structure
- **server/**: Node.js/Express API with MongoDB
- **client/**: React web application built with Vite
- **new-nextjs-app/**: Next.js frontend application
- **mobile/**: Flutter cross-platform mobile app
- **shared/**: Common utilities, constants, and models
- **docs/**: Project documentation
- **deploy/**: Deployment configurations
- **.github/**: GitHub workflows and CI/CD

## Projects

### Backend (Express.js)
**Configuration File**: server/app.js

#### Language & Runtime
**Language**: JavaScript (Node.js)
**Version**: Node.js 18+
**Framework**: Express.js
**Database**: MongoDB with Mongoose

#### Dependencies
**Main Dependencies**:
- express: ^4.21.2
- mongoose: ^8.13.0
- jsonwebtoken: ^9.0.2
- bcryptjs: ^2.4.3
- razorpay: ^2.9.6
- nodemailer: ^6.10.0
- cloudinary: ^2.6.0

#### Build & Installation
```bash
npm install
npm run server  # Development with nodemon
npm start       # Production
```

#### Docker
**Dockerfile**: /Dockerfile
**Image**: Node.js 18 Alpine
**Configuration**: Multi-stage build with separate frontend and backend stages

#### Testing
**Framework**: Not explicitly defined
**Run Command**:
```bash
npm run test:server
```

### Frontend (React)
**Configuration File**: client/package.json

#### Language & Runtime
**Language**: JavaScript/TypeScript
**Version**: React 19.1.0
**Build System**: Vite 6.2.0
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- react: ^19.1.0
- react-dom: ^19.1.0
- @tanstack/react-query: ^5.85.5
- react-router-dom: ^7.4.0
- @mui/material: ^6.4.9
- tailwindcss: ^3.3.3

#### Build & Installation
```bash
cd client
npm install
npm run dev    # Development
npm run build  # Production
```

#### Testing
**Framework**: Vitest with Testing Library
**Test Location**: client/src/__tests__
**Run Command**:
```bash
cd client
npm test
```

### Next.js Frontend
**Configuration File**: new-nextjs-app/package.json

#### Language & Runtime
**Language**: TypeScript
**Version**: Next.js 14.2.14
**Build System**: Next.js
**Package Manager**: npm

#### Dependencies
**Main Dependencies**:
- next: 14.2.14
- react: 18.3.1
- react-dom: 18.3.1
- @tanstack/react-query: ^5.85.5
- @mui/material: ^6.4.9
- tailwindcss: 3.3.3

#### Build & Installation
```bash
cd new-nextjs-app
npm install
npm run dev    # Development
npm run build  # Production
```

#### Docker
**Dockerfile**: new-nextjs-app/Dockerfile
**Configuration**: Docker Compose setup with railway.json deployment config

### Mobile App (Flutter)
**Configuration File**: mobile/pubspec.yaml

#### Language & Runtime
**Language**: Dart
**Version**: Flutter SDK >=3.3.0 <4.0.0
**Package Manager**: pub

#### Dependencies
**Main Dependencies**:
- flutter: sdk
- http: ^1.2.1
- dio: ^5.4.0
- provider: ^6.1.1
- firebase_core: ^2.24.2
- razorpay_flutter: ^1.3.5

#### Build & Installation
```bash
cd mobile
flutter pub get
flutter run          # Development
flutter build apk    # Android build
flutter build ios    # iOS build
```

#### Testing
**Framework**: flutter_test
**Test Location**: mobile/test
**Run Command**:
```bash
cd mobile
flutter test
```

## Testing Framework Configuration
**targetFramework**: Playwright