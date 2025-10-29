const mongoose = require('mongoose');
const User = require('./server/models/User');

// Comprehensive database migration script for project favorites functionality
async function comprehensiveMigrationForProjectFavorites() {
  const startTime = Date.now();
  let migrationStats = {
    totalUsers: 0,
    usersWithoutProjectFavorites: 0,
    usersUpdated: 0,
    usersWithNullProjectFavorites: 0,
    usersWithInvalidProjectFavorites: 0,
    errors: []
  };

  try {
    console.log('🚀 Starting comprehensive migration for project favorites functionality...');
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
    
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-realty';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Get total user count
    migrationStats.totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${migrationStats.totalUsers}`);

    // Find users without projectFavorites field
    const usersWithoutField = await User.find({
      projectFavorites: { $exists: false }
    });
    migrationStats.usersWithoutProjectFavorites = usersWithoutField.length;

    // Find users with null projectFavorites
    const usersWithNull = await User.find({
      projectFavorites: null
    });
    migrationStats.usersWithNullProjectFavorites = usersWithNull.length;

    // Find users with invalid projectFavorites (not an array)
    const usersWithInvalid = await User.find({
      projectFavorites: { $exists: true, $not: { $type: "array" } }
    });
    migrationStats.usersWithInvalidProjectFavorites = usersWithInvalid.length;

    console.log('\n📋 Migration Analysis:');
    console.log(`   Users without projectFavorites field: ${migrationStats.usersWithoutProjectFavorites}`);
    console.log(`   Users with null projectFavorites: ${migrationStats.usersWithNullProjectFavorites}`);
    console.log(`   Users with invalid projectFavorites: ${migrationStats.usersWithInvalidProjectFavorites}`);

    // Migration 1: Add projectFavorites field to users who don't have it
    if (migrationStats.usersWithoutProjectFavorites > 0) {
      console.log('\n🔄 Step 1: Adding projectFavorites field to users without it...');
      
      const updateResult1 = await User.updateMany(
        { projectFavorites: { $exists: false } },
        { $set: { projectFavorites: [] } }
      );
      
      migrationStats.usersUpdated += updateResult1.modifiedCount;
      console.log(`   ✅ Updated ${updateResult1.modifiedCount} users`);
    }

    // Migration 2: Fix users with null projectFavorites
    if (migrationStats.usersWithNullProjectFavorites > 0) {
      console.log('\n🔄 Step 2: Fixing users with null projectFavorites...');
      
      const updateResult2 = await User.updateMany(
        { projectFavorites: null },
        { $set: { projectFavorites: [] } }
      );
      
      migrationStats.usersUpdated += updateResult2.modifiedCount;
      console.log(`   ✅ Updated ${updateResult2.modifiedCount} users`);
    }

    // Migration 3: Fix users with invalid projectFavorites
    if (migrationStats.usersWithInvalidProjectFavorites > 0) {
      console.log('\n🔄 Step 3: Fixing users with invalid projectFavorites...');
      
      const updateResult3 = await User.updateMany(
        { projectFavorites: { $exists: true, $not: { $type: "array" } } },
        { $set: { projectFavorites: [] } }
      );
      
      migrationStats.usersUpdated += updateResult3.modifiedCount;
      console.log(`   ✅ Updated ${updateResult3.modifiedCount} users`);
    }

    // Verification
    console.log('\n🔍 Verifying migration...');
    
    const remainingIssues = await User.find({
      $or: [
        { projectFavorites: { $exists: false } },
        { projectFavorites: null },
        { projectFavorites: { $exists: true, $not: { $type: "array" } } }
      ]
    });

    if (remainingIssues.length === 0) {
      console.log('✅ All users now have valid projectFavorites field!');
    } else {
      console.log(`⚠️  Warning: ${remainingIssues.length} users still have issues`);
      migrationStats.errors.push(`${remainingIssues.length} users still have invalid projectFavorites`);
    }

    // Final statistics
    const finalUsersWithProjectFavorites = await User.countDocuments({
      projectFavorites: { $exists: true, $type: "array" }
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    console.log('\n📊 Final Migration Statistics:');
    console.log(`   Total users: ${migrationStats.totalUsers}`);
    console.log(`   Users with valid projectFavorites: ${finalUsersWithProjectFavorites}`);
    console.log(`   Users updated: ${migrationStats.usersUpdated}`);
    console.log(`   Migration success rate: ${((finalUsersWithProjectFavorites / migrationStats.totalUsers) * 100).toFixed(2)}%`);
    console.log(`   Duration: ${duration} seconds`);

    if (migrationStats.errors.length > 0) {
      console.log('\n⚠️  Errors encountered:');
      migrationStats.errors.forEach(error => console.log(`   - ${error}`));
    }

    return migrationStats;

  } catch (error) {
    console.error('❌ Migration failed:', error);
    migrationStats.errors.push(error.message);
    throw error;
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Rollback function (in case migration needs to be undone)
async function rollbackProjectFavoritesMigration() {
  try {
    console.log('🔄 Starting rollback of project favorites migration...');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/urban-realty', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Remove projectFavorites field from all users
    const rollbackResult = await User.updateMany(
      {},
      { $unset: { projectFavorites: 1 } }
    );

    console.log(`✅ Rollback completed. Removed projectFavorites from ${rollbackResult.modifiedCount} users`);

  } catch (error) {
    console.error('❌ Rollback failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.includes('--rollback')) {
    rollbackProjectFavoritesMigration()
      .then(() => {
        console.log('🎉 Rollback completed successfully!');
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Rollback failed:', error);
        process.exit(1);
      });
  } else {
    comprehensiveMigrationForProjectFavorites()
      .then((stats) => {
        console.log('🎉 Migration completed successfully!');
        if (stats.errors.length === 0) {
          console.log('✨ All users are now ready for project favorites functionality!');
        }
        process.exit(0);
      })
      .catch((error) => {
        console.error('💥 Migration failed:', error);
        process.exit(1);
      });
  }
}

module.exports = {
  comprehensiveMigrationForProjectFavorites,
  rollbackProjectFavoritesMigration
};
