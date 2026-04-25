import express from "express";
import {
  getRsvp,
  getRSVPbyStatus,
  bulkUpdateStatus,
  deleteRsvp,
  rsvpCheckedInUsers,
} from "../controllers/rsvpController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/:id/checkedIn", rsvpCheckedInUsers);
router.get("/:id/:status", getRSVPbyStatus);

router.get("/:id", getRsvp);

router.patch("/bulk-update", bulkUpdateStatus);
router.delete("/delete/:rsvpId", deleteRsvp);

export default router;
