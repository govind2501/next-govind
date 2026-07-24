          import mongoose from "mongoose";
        
          export async function connect() {

        try {
          if (mongoose.Connection.readyState >= 1) {
            return;
          }
          mongoose.set("bufferCommands", false)
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log("MongoDB connected successfully");

        
      } catch (error) {
        console.log("MongoDB connection FAILED:");
        console.log(error);
        throw error;
      }
    }


      
    