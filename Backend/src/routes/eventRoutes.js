import express from "express";
import {
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  revokeInviteLink,
} from "../controllers/eventController.js";
import {
  getEventStats,
  getEventById,
  getEventAttendees,
  startEvent,
  exportAttendees,
} from "../controllers/eventActionsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/stats", getEventStats);
router.get("/", getMyEvents);
router.post("/", createEvent);

router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/:id/attendees", getEventAttendees);
router.get("/:id/export", exportAttendees);
router.post("/:id/start", startEvent);
router.post("/:id/revoke-invite", revokeInviteLink);

export default router;
