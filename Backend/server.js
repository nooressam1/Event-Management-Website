import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Connect to MongoDB
await connectDB();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
