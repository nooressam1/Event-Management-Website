import Event from "../../models/Event.js";
import RSVP from "../../models/RSVP.js";
import { EVENT_STATUS, RSVP_STATUS } from "../../models/enum.js";
import {
  sendRsvpConfirmation,
  sendAcceptance,
} from "../services/Notification_Service/notificationService.js";

const findEventByCode = (inviteCode) =>
  Event.findOne({ inviteCode, status: EVENT_STATUS.PUBLISHED });

// GET /api/invite/:inviteCode
export const getEventByInviteCode = async (req, res) => {
  try {
    const event = await findEventByCode(req.params.inviteCode);
    if (!event)
      return res.status(404).json({ success: false, message: "Invite link not found or has expired." });

    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/invite/:inviteCode
export const submitRsvpFromInvite = async (req, res) => {
  try {
    const event = await findEventByCode(req.params.inviteCode);
    if (!event)
      return res.status(404).json({ success: false, message: "Invite link not found or has expired." });

    const { guestName, guestEmail, rsvpStatus, plusOne, plusOneFullname, plusOneDietaryRequirements } = req.body;

    const existing = await RSVP.findOne({ eventId: event._id, guestEmail: guestEmail.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You've already registered for this event.",
        rsvpId: existing._id,
      });
    }

    const isGoing = rsvpStatus === "going";
    let status = RSVP_STATUS.DECLINED;
    let waitlistPosition = null;

    if (isGoing) {
      const confirmedCount = await RSVP.countDocuments({ eventId: event._id, status: RSVP_STATUS.ATTENDING });
      if (confirmedCount >= event.capacity) {
        if (event.enableWaitlist) {
          const lastOnWaitlist = await RSVP.findOne({ eventId: event._id, status: RSVP_STATUS.WAITLISTED }).sort({ waitlistPosition: -1 });
          status = RSVP_STATUS.WAITLISTED;
          waitlistPosition = (lastOnWaitlist?.waitlistPosition ?? 0) + 1;
        } else {
          return res.status(409).json({ success: false, message: "This event is at full capacity." });
        }
      } else {
        status = event.autoAccept ? RSVP_STATUS.ATTENDING : RSVP_STATUS.PENDING;
      }
    }

    const rsvpData = { eventId: event._id, guestName, guestEmail, status, waitlistPosition };

    if (isGoing && event.allowPlusOnes && plusOne && plusOneFullname) {
      rsvpData.plusOne = { name: plusOneFullname, dietaryNotes: plusOneDietaryRequirements || "" };
    }

    const rsvp = await RSVP.create(rsvpData);

    sendRsvpConfirmation(rsvp, event).catch((e) =>
      console.error("[Notification] RSVP confirmation failed:", e.message)
    );
    if (rsvp.status === RSVP_STATUS.ATTENDING) {
      sendAcceptance(rsvp, event).catch((e) =>
        console.error("[Notification] Acceptance failed:", e.message)
      );
    }

    res.status(201).json({ success: true, rsvp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
