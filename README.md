# Urban Realty

A modern property dealing website with subscription-based access control, comprehensive property management, and advanced search capabilities.

## 🚀 Quick Start

### Prerequisites
- Node.js (>= 18.0.0)
- npm or yarn
- MongoDB (for database)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd urban-realty
   ```

2. **Run the setup script**
   ```bash
   npm run setup
   ```
   This will:
   - Install all dependencies (server + client)
   - Extract or build the frontend assets
   - Create necessary directories

3. **Start the server**
   ```bash
   npm start
   ```
   The application will be available at `http://localhost:5000`

### Development

For development with hot reloading:
```bash
npm run dev
```

This starts both the server (with nodemon) and client (with Vite) in development mode.

### Build

To build the frontend for production:
```bash
npm run build:client
```

## 🏗️ Project Structure

```
├── client/                 # React frontend (Vite)
│   ├── src/               # Source files
│   ├── dist/              # Built frontend (auto-generated)
│   └── dist.zip           # Pre-built frontend assets
├── server/                # Express.js backend
│   ├── routes/            # API routes
│   ├── controllers/       # Route controllers
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   └── config/            # Configuration files
├── scripts/               # Build and utility scripts
└── uploads/               # File uploads directory
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in the root and server directories:

**Root `.env`:**
```env
NODE_ENV=development
PORT=5000
```

**Server `.env`:**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
# Add other environment variables as needed
```

## 🚀 Deployment

### Railway
The project includes `Railway.toml` for Railway deployment.

### Docker
```bash
docker-compose up
```

### Manual Deployment
1. Run `npm run build` to prepare the application
2. Start the server with `npm start`
3. Ensure MongoDB is accessible

## 📚 API Documentation

### Health Check
- `GET /api/v1/health` - Server health status
- `GET /api/v1/test` - API test endpoint

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login

### Properties
- `GET /api/v1/properties` - List properties
- `POST /api/v1/properties` - Create property
- `GET /api/v1/properties/:id` - Get property details

### Subscriptions
- `GET /api/v1/subscriptions` - User subscriptions
- `POST /api/v1/subscriptions` - Create subscription

## 🔒 Access Control

The application implements subscription-based access control:
- Free tier: Limited property access
- Premium tier: Full access to all features
- Admin access: Complete system management

## 🛠️ Troubleshooting

### Frontend Assets Not Found
If you see "Frontend assets not found" error:
1. Run `npm run setup` to extract/build frontend
2. Ensure `client/dist/` directory exists
3. Check that `client/dist/index.html` is present

### Server Won't Start
1. Check if all dependencies are installed: `npm install`
2. Verify environment variables are set
3. Ensure MongoDB is running and accessible

### Development Issues
1. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
2. Clear client build: `rm -rf client/dist && npm run build:client`

## 📝 License

This project is proprietary software.
