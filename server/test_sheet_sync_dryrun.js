const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { syncProjectsFromSheet } = require('./services/SheetSyncService');

// Load env vars
dotenv.config({ path: require('path').resolve(__dirname, '.env') });

// Connect to DB
const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error('MONGODB_URI not found in environment');

        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`DB Connection Error: ${err.message}`);
        process.exit(1);
    }
};

const runTest = async () => {
    await connectDB();

    // Mock admin user ID (replace with a valid one if strict checking exists, but service only uses it for assignment)
    const mockAdminId = new mongoose.Types.ObjectId();

    console.log('Starting Sync Test...');
    try {
        const result = await syncProjectsFromSheet(mockAdminId);
        console.log('Sync Result:', JSON.stringify(result, null, 2));
    } catch (err) {
        console.error('Sync Failed:', err);
    } finally {
        await mongoose.connection.close();
        console.log('DB Connection Closed');
    }
};

runTest();
