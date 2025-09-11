# Urban Realty

A comprehensive real estate platform built with modern web technologies, featuring property listings, user management, subscription services, and mobile applications.

## 🏗️ Architecture

Urban Realty is a full-stack monorepo application consisting of:

- **Server**: Node.js/Express API with MongoDB
- **Client**: React web application with Vite
- **Mobile**: Flutter cross-platform mobile app
- **Shared**: Common utilities, constants, and models

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/urban-realty.git
cd urban-realty

# Install all dependencies
npm run install-all

# Set up environment variables
cp server/.env.example server/.env
cp client/.env.example client/.env

# Start development servers
npm run dev
```

### Access the Application

- **Web App**: http://localhost:3000
- **API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/v1/health

## 📁 Project Structure

```
urban-realty/
├── server/                 # Node.js/Express API
│   ├── src/
│   │   ├── api/           # Routes, controllers, middleware
│   │   ├── config/        # Database and environment config
│   │   ├── database/      # Models, repositories, migrations
│   │   ├── services/      # Business logic layer
│   │   └── utils/         # Utility functions
│   ├── constants/         # Application constants
│   └── server.js          # Main server file
├── client/                # React web application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── styles/        # CSS and styling
│   └── public/            # Static assets
├── mobile/                # Flutter mobile app
│   └── lib/
│       ├── core/          # Core functionality
│       ├── features/      # Feature modules
│       ├── shared/        # Shared components
│       └── main.dart      # App entry point
├── shared/                # Shared code across platforms
│   ├── constants/         # Shared constants
│   ├── utils/             # Shared utilities
│   ├── models/            # Shared data models
│   └── config/            # Shared configuration
└── docs/                  # Documentation
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT
- **File Storage**: Cloudinary
- **Payments**: Razorpay
- **Email**: Nodemailer

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS Modules
- **State Management**: React Query + Context API
- **Forms**: React Hook Form + Zod
- **UI Components**: Material-UI
- **Maps**: Google Maps API

### Mobile
- **Framework**: Flutter
- **State Management**: Provider
- **HTTP Client**: Dio
- **Local Storage**: SharedPreferences + Secure Storage

### DevOps
- **Deployment**: Railway
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry

## 📚 Documentation

- [Developer Setup Guide](docs/DEVELOPER_SETUP.md) - Complete setup instructions
- [API Documentation](docs/API_DOCUMENTATION.md) - Comprehensive API reference
- [Component Documentation](docs/COMPONENT_DOCUMENTATION.md) - React component library
- [Deployment Guide](docs/DEPLOYMENT_GUIDE.md) - Production deployment instructions
- [Troubleshooting Guide](docs/TROUBLESHOOTING.md) - Common issues and solutions

## 🚀 Available Scripts

### Root Level
```bash
npm run dev          # Start both server and client
npm run server       # Start server only
npm run client       # Start client only
npm run build        # Build client for production
npm run test         # Run all tests
npm run install-all  # Install all dependencies
```

### Server
```bash
cd server
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run server tests
```

### Client
```bash
cd client
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run client tests
npm run storybook    # Start Storybook
```

### Mobile
```bash
cd mobile
flutter pub get      # Get dependencies
flutter run          # Run on device/emulator
flutter build apk    # Build Android APK
flutter build ios    # Build iOS app
```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
MONGODB_URI=mongodb://localhost:27017/urban-realty
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
RAZORPAY_KEY_ID=your-razorpay-key-id
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

#### Client (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

## 🏗️ Features

### Core Features
- **Property Listings**: Browse and search properties
- **User Management**: Registration, authentication, profiles
- **Advanced Search**: Filter by location, price, amenities
- **Property Details**: Comprehensive property information
- **Image Gallery**: High-quality property images
- **Interactive Maps**: Google Maps integration
- **Favorites**: Save favorite properties
- **Contact Forms**: Inquire about properties

### User Roles
- **Users**: Browse properties, save favorites
- **Agents**: Manage property listings, view analytics
- **Developers**: Showcase projects, manage portfolios
- **Admins**: Full system administration

### Subscription Features
- **Basic Plan**: Limited property listings
- **Premium Plan**: Enhanced features and priority
- **Enterprise Plan**: Full access and custom features

### Mobile Features
- **Cross-Platform**: iOS and Android support
- **Offline Support**: Cached data and offline functionality
- **Push Notifications**: Real-time updates
- **Biometric Auth**: Secure authentication

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Rate limiting
- XSS and CSRF protection
- Secure file uploads
- Environment variable protection

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test suites
npm run test:server
npm run test:client
```

## 📦 Deployment

### Railway (Recommended)
```bash
# Deploy to Railway
railway login
railway link
railway up
```

### Docker
```bash
# Build and run with Docker
docker build -t urban-realty .
docker run -p 5000:5000 urban-realty
```

### Manual Deployment
```bash
# Build client
cd client && npm run build && cd ..

# Start server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow ESLint and Prettier configurations
- Write comprehensive tests
- Update documentation
- Use conventional commit messages
- Ensure all tests pass

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [docs](docs/) directory
- **Issues**: Create a [GitHub Issue](https://github.com/your-username/urban-realty/issues)
- **Discussions**: Use [GitHub Discussions](https://github.com/your-username/urban-realty/discussions)
- **Email**: support@urbanrealty.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust server framework
- MongoDB for the flexible database
- Flutter team for cross-platform mobile development
- All contributors and community members

## 📊 Project Status

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Test Coverage](https://img.shields.io/badge/coverage-85%25-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node Version](https://img.shields.io/badge/node-18%2B-green)
![React Version](https://img.shields.io/badge/react-18%2B-blue)

---

**Urban Realty** - Building the future of real estate technology 🏠✨

## 📋 Refactoring Progress

Refactoring progress is tracked in `URBAN_REALTY_REFACTORING_MASTER_REPORT.md` and per-phase docs like `REFACTORING_CHANGES_PHASE_3.md` and `REFACTORING_CHANGES_PHASE_4.md`.