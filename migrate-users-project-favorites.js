const mongoose = require('mongoose');
const User = require('./server/models/User');

// Database migration script to add projectFavorites field to existing users
async function migrateUsersForProjectFavorites() {
  try {
    console.log('🚀 Starting migration for project favorites functionality...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-realty', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Find all users that don't have projectFavorites field
    const usersWithoutProjectFavorites = await User.find({
      projectFavorites: { $exists: false }
    });

    console.log(`📊 Found ${usersWithoutProjectFavorites.length} users without projectFavorites field`);

    if (usersWithoutProjectFavorites.length === 0) {
      console.log('✅ All users already have projectFavorites field. Migration not needed.');
      return;
    }

    // Update all users to add projectFavorites field
    const updateResult = await User.updateMany(
      { projectFavorites: { $exists: false } },
      { $set: { projectFavorites: [] } }
    );

    console.log(`✅ Successfully updated ${updateResult.modifiedCount} users`);
    console.log(`📈 Matched ${updateResult.matchedCount} users`);

    // Verify the migration
    const remainingUsers = await User.find({
      projectFavorites: { $exists: false }
    });

    if (remainingUsers.length === 0) {
      console.log('✅ Migration completed successfully! All users now have projectFavorites field.');
    } else {
      console.log(`⚠️  Warning: ${remainingUsers.length} users still don't have projectFavorites field`);
    }

    // Show some statistics
    const totalUsers = await User.countDocuments();
    const usersWithProjectFavorites = await User.countDocuments({
      projectFavorites: { $exists: true }
    });

    console.log('\n📊 Migration Statistics:');
    console.log(`   Total users: ${totalUsers}`);
    console.log(`   Users with projectFavorites: ${usersWithProjectFavorites}`);
    console.log(`   Migration success rate: ${((usersWithProjectFavorites / totalUsers) * 100).toFixed(2)}%`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  migrateUsersForProjectFavorites()
    .then(() => {
      console.log('🎉 Migration completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrateUsersForProjectFavorites;
