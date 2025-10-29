#!/usr/bin/env node

/**
 * Project Favorites Migration Script
 * 
 * This script migrates all existing users to support the new project favorites functionality.
 * It adds the projectFavorites field to users who don't have it and ensures it's properly initialized.
 * 
 * Usage:
 *   node scripts/migrate-project-favorites.js
 *   node scripts/migrate-project-favorites.js --rollback
 *   npm run migrate:project-favorites
 *   npm run migrate:project-favorites:rollback
 */

const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Import the User model
const User = require(path.join(__dirname, '../server/models/User'));

async function migrateProjectFavorites() {
  console.log('🚀 Urban Realty - Project Favorites Migration');
  console.log('============================================');
  
  const startTime = Date.now();
  
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/urban-realty';
    console.log('🔌 Connecting to database...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected successfully');

    // Get migration statistics
    const totalUsers = await User.countDocuments();
    const usersNeedingMigration = await User.countDocuments({
      $or: [
        { projectFavorites: { $exists: false } },
        { projectFavorites: null },
        { projectFavorites: { $exists: true, $not: { $type: "array" } } }
      ]
    });

    console.log(`📊 Found ${totalUsers} total users`);
    console.log(`📊 ${usersNeedingMigration} users need migration`);

    if (usersNeedingMigration === 0) {
      console.log('✅ All users already have projectFavorites field. No migration needed.');
      return;
    }

    // Perform migration
    console.log('🔄 Starting migration...');
    
    const updateResult = await User.updateMany(
      {
        $or: [
          { projectFavorites: { $exists: false } },
          { projectFavorites: null },
          { projectFavorites: { $exists: true, $not: { $type: "array" } } }
        ]
      },
      { $set: { projectFavorites: [] } }
    );

    console.log(`✅ Migration completed! Updated ${updateResult.modifiedCount} users`);

    // Verify migration
    const remainingIssues = await User.countDocuments({
      $or: [
        { projectFavorites: { $exists: false } },
        { projectFavorites: null },
        { projectFavorites: { $exists: true, $not: { $type: "array" } } }
      ]
    });

    if (remainingIssues === 0) {
      console.log('✅ Verification passed! All users now have projectFavorites field.');
    } else {
      console.log(`⚠️  Warning: ${remainingIssues} users still have issues`);
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);
    
    console.log(`⏱️  Migration completed in ${duration} seconds`);
    console.log('🎉 All users are now ready for project favorites functionality!');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Stack trace:', error.stack);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

async function rollbackMigration() {
  console.log('🔄 Urban Realty - Project Favorites Rollback');
  console.log('===========================================');
  
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/urban-realty';
    console.log('🔌 Connecting to database...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected successfully');

    // Remove projectFavorites field from all users
    const rollbackResult = await User.updateMany(
      {},
      { $unset: { projectFavorites: 1 } }
    );

    console.log(`✅ Rollback completed! Removed projectFavorites from ${rollbackResult.modifiedCount} users`);
    console.log('⚠️  Note: This will disable project favorites functionality for all users');

  } catch (error) {
    console.error('❌ Rollback failed:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  try {
    if (args.includes('--rollback')) {
      await rollbackMigration();
    } else {
      await migrateProjectFavorites();
    }
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { migrateProjectFavorites, rollbackMigration };
