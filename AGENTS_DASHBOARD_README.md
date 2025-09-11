# Agents Dashboard (CRM) - Documentation

## Overview

A comprehensive Customer Relationship Management (CRM) dashboard designed specifically for real estate agents to manage their properties, leads, and business operations efficiently.

## Features

### 🏠 Dashboard Overview
- **Key Metrics**: Total properties, active leads, total views, monthly revenue
- **Recent Properties**: Quick view of latest property listings with status and views
- **Recent Leads**: Latest inquiries with contact information and status
- **Performance Insights**: Visual representation of agent performance

### 🏘️ Property Management
- **Property Listing**: View all agent properties with detailed information
- **Advanced Filtering**: Filter by status, price range, and search terms
- **Property Actions**: Edit, delete, and view individual properties
- **Status Management**: Track property status (active, pending, sold, inactive)
- **Performance Tracking**: Monitor views and lead generation per property

### 👥 Lead Management
- **Lead Tracking**: Comprehensive lead management with status updates
- **Contact Information**: Complete contact details for each lead
- **Lead Status Workflow**: 
  - Pending → Contacted → Follow Up → Closed
- **Communication Tools**: Direct email and phone integration
- **Lead Analytics**: Conversion rates and response time tracking

### 📊 Analytics & Insights
- **Performance Metrics**: Conversion rates, response times, lead sources
- **Top Performing Properties**: Properties with highest views and leads
- **Lead Source Breakdown**: Email, phone, WhatsApp inquiry analysis
- **Monthly Trends**: Lead generation patterns over time
- **Revenue Tracking**: Estimated commission calculations

### ⚙️ Settings & Profile
- **Profile Management**: Update personal and professional information
- **License Information**: Real estate license number and specializations
- **Notification Preferences**: Email and SMS notification settings
- **Account Information**: Account type and membership details

## Technical Architecture

### Frontend Components

#### Pages
- `AgentDashboard.jsx` - Main dashboard with overview and metrics
- `AgentProperties.jsx` - Property management with filtering and actions
- `AgentLeads.jsx` - Lead management with status tracking
- `AgentAnalytics.jsx` - Performance analytics and insights
- `AgentSettings.jsx` - Profile and account settings
- `Inquiries.jsx` - Legacy inquiries page (enhanced)

#### Layout
- `AgentLayout.jsx` - Navigation sidebar and layout wrapper

### Backend Integration

#### API Endpoints Used
- `GET /properties/agent/:id` - Fetch agent's properties
- `GET /contacts/agent` - Fetch agent's contact requests
- `PUT /contacts/:id` - Update contact request status
- `PUT /auth/profile` - Update agent profile
- `DELETE /properties/:id` - Delete property

#### Data Models
- **User Model**: Agent profile information
- **Property Model**: Property listings with agent association
- **ContactRequest Model**: Lead inquiries with status tracking

## User Roles & Permissions

### Agent Role Features
- Access to personal dashboard
- Manage own properties
- Track and manage leads
- View performance analytics
- Update profile information

### Admin Role Features
- View all agents
- Manage agent accounts
- Access admin analytics
- Monitor system-wide performance

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- React (v17 or higher)
- Material-UI (v5)
- React Query for data fetching

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Update API endpoints and other configurations
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Usage Guide

### For Agents

#### Accessing the Dashboard
1. Login with agent credentials
2. Navigate to `/agent/dashboard`
3. Use the sidebar navigation to access different sections

#### Managing Properties
1. Go to "Properties" section
2. Use filters to find specific properties
3. Click "Edit" to modify property details
4. Use "Delete" to remove properties (with confirmation)

#### Managing Leads
1. Navigate to "Leads" section
2. View leads by status using tabs
3. Click on lead to view details
4. Update status using the status update dialog
5. Use communication buttons for direct contact

#### Viewing Analytics
1. Go to "Analytics" section
2. Select time range for data
3. Review performance metrics
4. Analyze top-performing properties
5. Monitor lead conversion rates

### For Administrators

#### Managing Agents
1. Access admin panel at `/admin`
2. Navigate to "Agents" section
3. View all registered agents
4. Manage agent status and permissions

## API Documentation

### Agent Properties Endpoint
```javascript
GET /api/v1/properties/agent/:agentId
```
**Parameters:**
- `page` - Page number for pagination
- `limit` - Number of items per page
- `search` - Search term for property title/location
- `status` - Filter by property status
- `priceRange` - Filter by price range

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "property_id",
      "title": "Property Title",
      "price": 500000,
      "location": "Property Location",
      "status": "active",
      "views": 150,
      "images": ["image_urls"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Agent Leads Endpoint
```javascript
GET /api/v1/contacts/agent
```
**Parameters:**
- `page` - Page number for pagination
- `limit` - Number of items per page
- `search` - Search term for lead name/email
- `status` - Filter by lead status
- `contactMethod` - Filter by contact method

**Response:**
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "contact_id",
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "mobile": "+1234567890"
      },
      "property": {
        "title": "Property Title",
        "price": 500000
      },
      "status": "pending",
      "contactMethod": "email",
      "message": "I'm interested in this property",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## Customization

### Styling
The dashboard uses Material-UI theming. Customize the theme in `src/Theme/NewTheme.js`:

```javascript
export const urbanRealtyTheme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  // Add custom theme configurations
});
```

### Adding New Features
1. Create new components in `src/pages/Agent/`
2. Add routes in `src/App.jsx`
3. Update navigation in `src/components/agent/AgentLayout.jsx`
4. Implement backend API endpoints if needed

## Performance Optimization

### Data Fetching
- Uses React Query for efficient data caching
- Implements pagination for large datasets
- Optimistic updates for better UX

### Code Splitting
- Lazy loading for route-based components
- Dynamic imports for better initial load times

## Security Considerations

### Authentication
- JWT-based authentication
- Role-based access control
- Protected routes for agent-only access

### Data Validation
- Input validation on forms
- API endpoint validation
- XSS protection

## Troubleshooting

### Common Issues

1. **Dashboard not loading**
   - Check authentication status
   - Verify API endpoints are accessible
   - Check browser console for errors

2. **Properties not showing**
   - Verify agent ID in API calls
   - Check property ownership
   - Ensure proper permissions

3. **Leads not updating**
   - Check API response format
   - Verify status update endpoint
   - Check network connectivity

### Debug Mode
Enable debug mode by setting:
```javascript
localStorage.setItem('debug', 'true');
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Maintainer**: Development Team