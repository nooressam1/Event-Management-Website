import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

// Connect to MongoDB
await connectDB();

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
