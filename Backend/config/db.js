//connect to mongodb
import dotenv from "dotenv/config";
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("URI:", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Failed to connect: ${err.message}`);
    // exit node to avoid app sending requests, 1 means Failure
    process.exit(1);
  }
};

export default connectDB;
