import express from "express";
import { getEventAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/events/:id", getEventAnalytics);

export default router;
