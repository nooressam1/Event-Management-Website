import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protect,  logout);
router.get("/me", protect, getCurrentUser);

export default router;
