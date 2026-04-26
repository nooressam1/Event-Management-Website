import express from "express";
import {
  getMyEvents,
  getEventStats,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  getEventAttendees,
  startEvent,
  exportAttendees,
  revokeInviteLink,
} from "../controllers/eventController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

// Static routes first — must come before /:id to avoid param capture
router.get("/stats", getEventStats);
router.get("/", getMyEvents);
router.post("/", createEvent);

// Parameterised routes
router.get("/:id", getEventById);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);
router.get("/:id/attendees", getEventAttendees);
router.get("/:id/export", exportAttendees);
router.post("/:id/start", startEvent);
router.post("/:id/revoke-invite", revokeInviteLink);

export default router;
