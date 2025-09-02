# Urban Realty API Documentation

## Overview

The Urban Realty API provides comprehensive endpoints for managing real estate properties, users, subscriptions, and administrative functions. This RESTful API is built with Node.js, Express, and MongoDB.

## Base URL

- **Production**: `https://urban-realty-production.up.railway.app/api/v1`
- **Development**: `http://localhost:5000/api/v1`

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "error": "Error message",
  "errors": { ... },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Authentication Endpoints

### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "phone": "+1234567890",
  "role": "user"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "jwt-token-here"
  }
}
```

### POST /auth/login
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

### GET /auth/me
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

### POST /auth/logout
Logout current user.

## Properties Endpoints

### GET /properties
Get list of properties with filtering and pagination.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `type` (string): Property type (apartment, villa, plot, commercial)
- `city` (string): Filter by city
- `minPrice` (number): Minimum price
- `maxPrice` (number): Maximum price
- `bedrooms` (number): Number of bedrooms
- `bathrooms` (number): Number of bathrooms

**Example:**
```
GET /properties?type=apartment&city=Mumbai&minPrice=5000000&maxPrice=10000000&page=1&limit=20
```

### GET /properties/:id
Get detailed information about a specific property.

### POST /properties
Create a new property (requires authentication).

**Request Body:**
```json
{
  "title": "Beautiful 3BHK Apartment",
  "description": "Spacious apartment with modern amenities",
  "type": "apartment",
  "location": {
    "address": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001",
    "coordinates": {
      "latitude": 19.0760,
      "longitude": 72.8777
    }
  },
  "details": {
    "bedrooms": 3,
    "bathrooms": 2,
    "builtUpArea": 1200,
    "floor": 5,
    "totalFloors": 10
  },
  "pricing": {
    "price": 7500000,
    "negotiable": true
  }
}
```

### PUT /properties/:id
Update an existing property.

### DELETE /properties/:id
Delete a property.

## Users Endpoints

### GET /users
Get list of users (admin only).

### GET /users/:id
Get user details by ID.

### PUT /users/:id
Update user information.

### DELETE /users/:id
Delete user account.

## Subscriptions Endpoints

### GET /subscriptions
Get available subscription plans.

### POST /subscriptions
Create a new subscription.

### GET /subscriptions/:id
Get subscription details.

### PUT /subscriptions/:id
Update subscription.

## Admin Endpoints

### GET /admin/dashboard
Get admin dashboard statistics.

### GET /admin/users
Get all users with admin controls.

### GET /admin/properties
Get all properties with admin controls.

### GET /admin/analytics
Get analytics data.

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |

## Rate Limiting

API requests are rate limited to 100 requests per 15-minute window per IP address.

## File Upload

### POST /media/upload
Upload images or documents.

**Request:** Multipart form data with file field.

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://cloudinary.com/image/upload/v1234567890/sample.jpg",
    "publicId": "sample",
    "secureUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/sample.jpg"
  }
}
```

## Webhooks

### POST /subscriptions/webhook
Razorpay payment webhook endpoint.

## SDKs and Libraries

### JavaScript/Node.js
```javascript
const axios = require('axios');

const api = axios.create({
  baseURL: 'https://urban-realty-production.up.railway.app/api/v1',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get properties
const properties = await api.get('/properties');
```

### React Hook Example
```javascript
import { useQuery } from 'react-query';

const useProperties = (params) => {
  return useQuery(['properties', params], async () => {
    const response = await fetch(`/api/v1/properties?${new URLSearchParams(params)}`);
    return response.json();
  });
};
```

## Testing

Use the provided Postman collection or test with curl:

```bash
# Register user
curl -X POST https://urban-realty-production.up.railway.app/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","password":"SecurePassword123!","phone":"+1234567890","role":"user"}'

# Login
curl -X POST https://urban-realty-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePassword123!"}'

# Get properties
curl -X GET https://urban-realty-production.up.railway.app/api/v1/properties \
  -H "Authorization: Bearer <your-token>"
```

## Support

For API support and questions, please contact the development team or create an issue in the project repository.