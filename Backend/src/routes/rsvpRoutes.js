import express from "express";
import {
  getRsvp,
  getRSVPbyStatus,
  bulkUpdateStatus,
  deleteRsvp,
  getRsvpCheckedInUsers,
  checkInUser
} from "../controllers/rsvpController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/:id/checkUser", getRSVPbyStatus);
router.get("/:id/checkedIn", checkInUser);
router.get("/:id/:status", getRSVPbyStatus);

router.get("/:id", getRsvp);

router.patch("/bulk-update", bulkUpdateStatus);
router.delete("/delete/:rsvpId", deleteRsvp);

export default router;
