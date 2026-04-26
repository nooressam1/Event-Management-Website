import express from "express";
import {
  getBudget,
  saveTotalBudget,
  addBudgetItem,
  updateBudgetItem,
  deleteBudgetItem,
  generatePlan,
  generateRsvpQuestions,
} from "../controllers/suiteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Budget
router.get("/budget/:eventId",                      getBudget);
router.post("/budget/:eventId",                     saveTotalBudget);
router.post("/budget/:eventId/items",               addBudgetItem);
router.patch("/budget/:eventId/items/:itemId",      updateBudgetItem);
router.delete("/budget/:eventId/items/:itemId",     deleteBudgetItem);

// AI
router.post("/plan",                                generatePlan);
router.post("/rsvp-questions",                      generateRsvpQuestions);

export default router;
