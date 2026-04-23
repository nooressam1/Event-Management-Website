import express from "express";
import { streamEventPlan, getRSVPQuestions } from "../controllers/aiSuiteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/plan", protect, streamEventPlan);
router.post("/rsvp-questions", protect, getRSVPQuestions);

export default router;
