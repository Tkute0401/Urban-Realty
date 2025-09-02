# Shared Code Directory

This directory contains shared code, constants, utilities, and models that are used across multiple platforms (server, client, mobile) in the Urban Realty project.

## Structure

```
shared/
├── constants/          # Shared constants and enums
│   └── index.js       # HTTP status codes, user roles, property types, etc.
├── utils/             # Shared utility functions
│   ├── validation.js  # Validation utilities
│   ├── formatting.js  # Formatting utilities
│   └── api.js         # API utilities
├── models/            # Shared data models
│   ├── User.js        # User model structure and transformers
│   └── Property.js    # Property model structure and transformers
├── config/            # Shared configuration
│   └── index.js       # Application configuration
└── README.md          # This file
```

## Usage

### Constants

```javascript
import { HTTP_STATUS, USER_ROLES, PROPERTY_TYPES } from '../shared/constants/index.js';

// Use in server
res.status(HTTP_STATUS.OK).json(data);

// Use in client
if (user.role === USER_ROLES.ADMIN) {
  // Show admin features
}

// Use in mobile
const propertyType = PROPERTY_TYPES.APARTMENT;
```

### Utilities

```javascript
import { isValidEmail, formatCurrency, createApiResponse } from '../shared/utils/index.js';

// Validation
if (isValidEmail(email)) {
  // Process email
}

// Formatting
const formattedPrice = formatCurrency(property.price);

// API responses
const response = createSuccessResponse(data, 'Operation successful');
```

### Models

```javascript
import { UserModel, UserTransformers } from '../shared/models/User.js';

// Transform user for client response
const safeUser = UserTransformers.toClientResponse(user);

// Check user role
if (UserTransformers.isAdmin(user)) {
  // Admin functionality
}
```

### Configuration

```javascript
import { getPlatformConfig } from '../shared/config/index.js';

// Get platform-specific configuration
const config = getPlatformConfig('web', 'production');
const apiUrl = config.api.baseUrl;
```

## Benefits

1. **Consistency**: Ensures consistent data structures and validation rules across all platforms
2. **Maintainability**: Single source of truth for shared logic
3. **Type Safety**: Common interfaces and validation rules
4. **Code Reuse**: Reduces duplication across platforms
5. **Synchronization**: Changes to shared code automatically apply to all platforms

## Platform Integration

### Server (Node.js)
```javascript
const { HTTP_STATUS, createErrorResponse } = require('../shared/constants/index.js');
```

### Client (React)
```javascript
import { USER_ROLES, formatCurrency } from '../shared/constants/index.js';
```

### Mobile (Flutter)
```dart
// Convert shared constants to Dart
const userRoles = {
  'admin': 'admin',
  'agent': 'agent',
  'user': 'user'
};
```

## Adding New Shared Code

1. **Constants**: Add to `shared/constants/index.js`
2. **Utilities**: Create new file in `shared/utils/`
3. **Models**: Create new file in `shared/models/`
4. **Configuration**: Update `shared/config/index.js`

## Best Practices

1. Keep shared code platform-agnostic
2. Use consistent naming conventions
3. Add proper JSDoc documentation
4. Include validation and error handling
5. Test shared utilities thoroughly
6. Update all platforms when making changes

## Version Control

- All changes to shared code should be committed with clear messages
- Breaking changes should be documented and coordinated across platforms
- Use semantic versioning for major shared code updates