import express from "express";
import {
  getRsvp,
  submitRsvp,
  getRSVPbyStatus,
  // rsvpCheckedInUsers,
  bulkUpdateStatus,
  updateRsvpStatus,
  deleteRsvp,
  getRsvpCheckedInUsers,
  checkInUser,
  toggleCheckIn,
} from "../controllers/rsvpController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public — guest-facing, no auth required
router.get("/:id", getRsvp);
router.post("/:id/submit", submitRsvp);

// Protected — organizer only
router.use(protect);
router.get("/:id/checkUser", getRSVPbyStatus);
router.get("/:id/checkedIn", checkInUser);
router.get("/:id/:status", getRSVPbyStatus);
router.patch("/bulk-update", bulkUpdateStatus);
router.patch("/:rsvpId/checkin", toggleCheckIn);
router.patch("/:rsvpId/status", updateRsvpStatus);
router.delete("/delete/:rsvpId", deleteRsvp);

export default router;
