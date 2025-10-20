import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  const uri =
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    process.env.NEXT_PUBLIC_MONGO_URI ||
    '';

  if (!uri) {
    throw new Error('MongoDB connection string is not set (MONGO_URI/MONGODB_URI)');
  }

  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
  } as any);

  isConnected = true;
}


