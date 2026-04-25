import { createServer } from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import rsvpRoutes from "./src/routes/rsvpRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import { initSocket } from "./src/socket.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rsvp", rsvpRoutes);
app.use("/api/events", eventRoutes);


// Connect to MongoDB then start server
await connectDB();

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
