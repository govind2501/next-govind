import mongoose from "mongoose";

// Cache the connection promise across hot-reloads and concurrent requests,
// so multiple requests arriving at the same time all wait for the SAME
// connection attempt instead of racing each other.
let cachedConnectionPromise: Promise<typeof mongoose> | null = null;

export async function connect() {
  try {
    // Already connected - nothing to do
    if (mongoose.connection.readyState === 1) {
      return;
    }

    // A connection attempt is already in progress - wait for that same one
    if (cachedConnectionPromise) {
      await cachedConnectionPromise;
      return;
    }

    mongoose.set("bufferCommands", false);

    cachedConnectionPromise = mongoose.connect(process.env.MONGO_URI as string);
    await cachedConnectionPromise;

    console.log("MongoDB connected successfully");

  } catch (error) {
    // If connection failed, clear the cache so the next request can retry
    cachedConnectionPromise = null;
    console.log("MongoDB connection FAILED:");
    console.log(error);
    throw error;
  }
}