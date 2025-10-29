# Project Favorites Migration Guide

This guide explains how to migrate all existing users to support the new project favorites functionality.

## Overview

The project favorites feature adds the ability for users to save projects to their favorites, similar to how they can favorite properties. This migration ensures all existing users have the necessary database fields to use this feature.

## What the Migration Does

1. **Adds `projectFavorites` field** to all users who don't have it
2. **Initializes the field** as an empty array `[]`
3. **Fixes any corrupted data** (null values, wrong data types)
4. **Verifies the migration** was successful

## Migration Scripts

### 1. Simple Migration Script
```bash
node migrate-users-project-favorites.js
```

### 2. Comprehensive Migration Script
```bash
node migrate-users-project-favorites-comprehensive.js
```

### 3. Package.json Scripts (Recommended)
```bash
# Run migration
npm run migrate:project-favorites

# Rollback migration (if needed)
npm run migrate:project-favorites:rollback
```

## Prerequisites

1. **Database Access**: Ensure you have access to the MongoDB database
2. **Environment Variables**: Make sure `MONGODB_URI` or `DATABASE_URL` is set
3. **Backup**: Always backup your database before running migrations
4. **Node.js**: Ensure Node.js is installed

## Step-by-Step Migration Process

### Step 1: Backup Your Database
```bash
# Create a backup before migration
mongodump --uri="your-mongodb-uri" --out=backup-$(date +%Y%m%d-%H%M%S)
```

### Step 2: Run the Migration
```bash
# Using npm script (recommended)
npm run migrate:project-favorites

# Or directly with node
node scripts/migrate-project-favorites.js
```

### Step 3: Verify Migration
The script will automatically verify the migration and show statistics:
- Total users in database
- Users updated
- Migration success rate
- Any remaining issues

### Step 4: Test the Feature
1. Login to the application
2. Navigate to projects
3. Try adding a project to favorites
4. Check your profile page for the "Project Favorites" tab

## Expected Output

```
🚀 Urban Realty - Project Favorites Migration
============================================
🔌 Connecting to database...
✅ Database connected successfully
📊 Found 150 total users
📊 150 users need migration
🔄 Starting migration...
✅ Migration completed! Updated 150 users
✅ Verification passed! All users now have projectFavorites field.
⏱️  Migration completed in 2.34 seconds
🎉 All users are now ready for project favorites functionality!
🔌 Database connection closed
```

## Rollback (If Needed)

If you need to undo the migration:

```bash
npm run migrate:project-favorites:rollback
```

**Warning**: This will remove the projectFavorites field from all users and disable the feature.

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check your `MONGODB_URI` environment variable
   - Ensure MongoDB is running
   - Verify network connectivity

2. **Permission Errors**
   - Ensure your database user has write permissions
   - Check MongoDB user roles

3. **Migration Fails Partially**
   - Check the error logs
   - Run the migration again (it's idempotent)
   - Contact support if issues persist

### Manual Verification

You can manually verify the migration by checking the database:

```javascript
// Connect to MongoDB and run:
db.users.find({projectFavorites: {$exists: false}}).count()
// Should return 0

db.users.find({projectFavorites: {$type: "array"}}).count()
// Should return total user count
```

## Database Schema Changes

### Before Migration
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  favorites: [ObjectId], // Property favorites
  // projectFavorites field missing
}
```

### After Migration
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  favorites: [ObjectId], // Property favorites
  projectFavorites: [ObjectId], // Project favorites (new field)
}
```

## Performance Impact

- **Migration Time**: Typically 1-5 seconds for databases with < 10,000 users
- **Database Load**: Minimal - uses efficient MongoDB update operations
- **Downtime**: None - migration runs while application is running
- **Storage**: Minimal increase (~8 bytes per user for empty array)

## Support

If you encounter any issues during migration:

1. Check the error logs
2. Verify your database connection
3. Ensure you have proper permissions
4. Contact the development team

## Post-Migration Checklist

- [ ] Migration completed successfully
- [ ] All users have projectFavorites field
- [ ] Application starts without errors
- [ ] Users can add projects to favorites
- [ ] Project favorites page loads correctly
- [ ] Profile page shows "Project Favorites" tab

---

**Note**: This migration is safe to run multiple times. It will only update users who need the migration and skip those who already have the field.
