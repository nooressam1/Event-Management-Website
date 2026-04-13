import express from "express";
import {
  getCurrentUser,
  login,
  logout,
  signup,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import AnalyticsPage from "../../../Frontend/my-app/src/Modules/analytics/pages/AnalyticsPage.jsx";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", protect,  logout);
router.post("/analytics", AnalyticsPage)
router.get("/me", protect, getCurrentUser);
export default router;
