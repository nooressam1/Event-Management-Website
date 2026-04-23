import express from "express";
import {
  getBudget,
  upsertBudget,
  addItem,
  updateItem,
  deleteItem,
} from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:eventId",                 protect, getBudget);
router.post("/:eventId",                protect, upsertBudget);
router.post("/:eventId/items",          protect, addItem);
router.patch("/:eventId/items/:itemId", protect, updateItem);
router.delete("/:eventId/items/:itemId",protect, deleteItem);

export default router;
