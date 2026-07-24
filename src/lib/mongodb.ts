    // import mongoose from "mongoose";
  
    // export async function connect() {
    // if (mongoose.connections[0].readyState) return;

    // await mongoose.connect(process.env.MONGO_URL!);
    // }




    import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

const  uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {

  // Preserve the connection across hot reloads in dev

  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {

  // In production, create a new client

  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;