# Squarefooot Developer Setup Guide

## Quick Start

Get the Squarefooot project running locally in under 10 minutes.

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Git ([Download](https://git-scm.com/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-username/urban-realty.git
cd urban-realty

# Install dependencies
npm run install-all
```

### 2. Environment Setup

```bash
# Copy environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# Edit server/.env with your configuration
# Edit client/.env with your configuration
```

### 3. Start Development

```bash
# Start all services (server + client)
npm run dev

# Or start individually
npm run server  # Server only
npm run client  # Client only
```

### 4. Access Application

- **Web App**: http://localhost:3000
- **API**: http://localhost:5000
- **API Health**: http://localhost:5000/api/v1/health

## Detailed Setup

### Project Structure

```
urban-realty/
├── server/                 # Node.js/Express API
│   ├── src/
│   │   ├── api/           # API routes, controllers, middleware
│   │   ├── config/        # Database, environment config
│   │   ├── database/      # Models, repositories, migrations
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── constants/         # Application constants
│   └── server.js          # Main server file
├── client/                # React web application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Utility functions
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

### Environment Configuration

#### Server Environment (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/urban-realty

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email Configuration (Gmail example)
EMAIL_FROM=noreply@yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary (Image storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Razorpay (Payments)
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3000

# Security
SESSION_SECRET=your-session-secret-key-minimum-32-characters
BCRYPT_ROUNDS=12

# Optional
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
SENTRY_DSN=your-sentry-dsn-for-error-tracking
```

#### Client Environment (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
VITE_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
```

### Database Setup

#### Option 1: Local MongoDB

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb

# Start MongoDB
sudo systemctl start mongod
# or
mongod
```

#### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in server/.env

### External Services Setup

#### 1. Cloudinary (Image Storage)

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Add to server/.env

#### 2. Razorpay (Payments)

1. Sign up at [Razorpay](https://razorpay.com/)
2. Get your key ID and key secret from dashboard
3. Add to server/.env

#### 3. Google Maps API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create API key
4. Add to both server/.env and client/.env

#### 4. Email Service (Gmail)

1. Enable 2-factor authentication on Gmail
2. Generate app password
3. Use app password in EMAIL_PASS

## Development Workflow

### Available Scripts

```bash
# Root level
npm run dev          # Start both server and client
npm run server       # Start server only
npm run client       # Start client only
npm run build        # Build client for production
npm run test         # Run tests
npm run install-all  # Install all dependencies

# Server
cd server
npm run dev          # Start with nodemon
npm start            # Start production server
npm test             # Run server tests

# Client
cd client
npm run dev          # Start Vite dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run client tests
npm run storybook    # Start Storybook
```

### Code Style and Linting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### Testing

```bash
# Run all tests
npm test

# Run server tests
cd server && npm test

# Run client tests
cd client && npm test

# Run tests with coverage
npm run test:coverage
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

## Development Tools

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Prettier - Code formatter
- ESLint
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- MongoDB for VS Code
- REST Client

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### Browser Extensions

- React Developer Tools
- Redux DevTools
- JSON Formatter
- Postman (for API testing)

## API Development

### Testing API Endpoints

#### Using REST Client (VS Code)

Create `api-tests.http`:

```http
### Health Check
GET http://localhost:5000/api/v1/health

### Register User
POST http://localhost:5000/api/v1/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "role": "user"
}

### Login
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}

### Get Properties
GET http://localhost:5000/api/v1/properties
Authorization: Bearer YOUR_JWT_TOKEN
```

#### Using Postman

1. Import the API collection
2. Set environment variables
3. Run requests

### Database Management

#### MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Browse collections and documents

#### Command Line

```bash
# Connect to MongoDB
mongosh

# Use database
use urban-realty

# Show collections
show collections

# Query documents
db.users.find()
db.properties.find({ type: "apartment" })
```

## Mobile Development

### Flutter Setup

```bash
# Install Flutter
# Follow: https://flutter.dev/docs/get-started/install

# Check Flutter installation
flutter doctor

# Get dependencies
cd mobile
flutter pub get

# Run on device/emulator
flutter run

# Build for release
flutter build apk --release
```

### Mobile Development Tools

- Android Studio
- VS Code with Flutter extension
- Flutter Inspector
- Dart DevTools

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run server
```

#### 2. MongoDB Connection Issues

```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check connection
mongosh --eval "db.adminCommand('ismaster')"
```

#### 3. Node Modules Issues

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 4. Build Issues

```bash
# Clear Vite cache
cd client
rm -rf node_modules/.vite
npm run build
```

#### 5. Environment Variables Not Loading

- Check file is named exactly `.env`
- Verify no spaces around `=`
- Restart development server
- Check file encoding (should be UTF-8)

### Getting Help

1. Check the [Issues](https://github.com/your-username/urban-realty/issues) page
2. Search existing issues
3. Create new issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Screenshots if applicable

### Debug Mode

```bash
# Enable debug logging
DEBUG=* npm run server

# Or specific modules
DEBUG=urban-realty:* npm run server
```

## Performance Tips

### Development Performance

1. Use `npm run dev` for hot reloading
2. Enable React Fast Refresh
3. Use React DevTools Profiler
4. Monitor bundle size with Vite analyzer

### Database Performance

1. Add indexes for frequently queried fields
2. Use MongoDB Compass to analyze queries
3. Implement pagination for large datasets
4. Use aggregation pipelines for complex queries

## Security Considerations

### Development Security

1. Never commit `.env` files
2. Use strong JWT secrets
3. Validate all inputs
4. Use HTTPS in production
5. Implement rate limiting

### API Security

1. Use authentication middleware
2. Validate request data
3. Sanitize inputs
4. Implement CORS properly
5. Use helmet for security headers

## Contributing

### Code Standards

1. Follow ESLint rules
2. Use Prettier for formatting
3. Write meaningful commit messages
4. Add tests for new features
5. Update documentation

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Update documentation
6. Submit pull request

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests pass
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Error handling implemented
- [ ] Performance considerations
- [ ] Security implications reviewed

## Additional Resources

- [React Documentation](https://reactjs.org/docs)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Flutter Documentation](https://flutter.dev/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)