import express from "express";
import { getRsvp, getRSVPbyStatus ,bulkUpdateStatus} from "../controllers/rsvpController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.get("/:id", getRsvp);
router.get("/:id/:status", getRSVPbyStatus);
router.patch("/bulk-update", bulkUpdateStatus);
export default router;
