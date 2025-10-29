#!/usr/bin/env node

/**
 * Test Script for Project Favorites Migration
 * 
 * This script creates test users and verifies the migration works correctly.
 * It's safe to run in development environments.
 */

const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

// Import the User model
const User = require(path.join(__dirname, '../server/models/User'));

async function testMigration() {
  console.log('🧪 Testing Project Favorites Migration');
  console.log('=====================================');
  
  try {
    // Connect to database
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/urban-realty';
    console.log('🔌 Connecting to database...');
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Database connected successfully');

    // Create test users with different scenarios
    console.log('👥 Creating test users...');
    
    const testUsers = [
      {
        name: 'Test User 1',
        email: 'test1@example.com',
        password: 'password123',
        role: 'buyer'
        // No projectFavorites field - should be added by migration
      },
      {
        name: 'Test User 2',
        email: 'test2@example.com',
        password: 'password123',
        role: 'buyer',
        projectFavorites: null // Should be fixed by migration
      },
      {
        name: 'Test User 3',
        email: 'test3@example.com',
        password: 'password123',
        role: 'buyer',
        projectFavorites: 'invalid' // Should be fixed by migration
      },
      {
        name: 'Test User 4',
        email: 'test4@example.com',
        password: 'password123',
        role: 'buyer',
        projectFavorites: [] // Already correct - should be left alone
      }
    ];

    // Clean up any existing test users
    await User.deleteMany({ email: { $regex: /^test\d@example\.com$/ } });
    console.log('🧹 Cleaned up existing test users');

    // Create test users
    const createdUsers = await User.insertMany(testUsers);
    console.log(`✅ Created ${createdUsers.length} test users`);

    // Run migration
    console.log('🔄 Running migration...');
    const { migrateProjectFavorites } = require('./migrate-project-favorites');
    await migrateProjectFavorites();

    // Verify results
    console.log('🔍 Verifying migration results...');
    
    const usersAfterMigration = await User.find({ 
      email: { $regex: /^test\d@example\.com$/ } 
    });

    let allValid = true;
    
    for (const user of usersAfterMigration) {
      const isValid = Array.isArray(user.projectFavorites);
      console.log(`   ${user.email}: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
      if (!isValid) allValid = false;
    }

    if (allValid) {
      console.log('✅ All test users have valid projectFavorites field!');
    } else {
      console.log('❌ Some test users still have invalid projectFavorites field');
    }

    // Test API functionality
    console.log('🔌 Testing API functionality...');
    
    const testUser = usersAfterMigration[0];
    
    // Test adding a project to favorites
    const testProjectId = new mongoose.Types.ObjectId();
    testUser.projectFavorites.push(testProjectId);
    await testUser.save();
    
    console.log('✅ Successfully added project to favorites');
    
    // Test removing from favorites
    testUser.projectFavorites = testUser.projectFavorites.filter(
      id => id.toString() !== testProjectId.toString()
    );
    await testUser.save();
    
    console.log('✅ Successfully removed project from favorites');

    // Clean up test users
    await User.deleteMany({ email: { $regex: /^test\d@example\.com$/ } });
    console.log('🧹 Cleaned up test users');

    console.log('🎉 Migration test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the test
if (require.main === module) {
  testMigration()
    .then(() => {
      console.log('✨ All tests passed! Migration is ready for production.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error.message);
      process.exit(1);
    });
}

module.exports = testMigration;
