import RSVP from "../../models/RSVP.js";
import Event from "../../models/Event.js";
import mongoose from "mongoose";
import { RSVP_STATUS } from "../../models/enum.js";
import {
  sendRsvpConfirmation,
  sendAcceptance,
} from "../services/Notification_Service/notificationService.js";

// Promote the first waitlisted guest if capacity allows
const promoteFromWaitlist = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) return;
  const confirmedCount = await RSVP.countDocuments({
    eventId,
    status: RSVP_STATUS.ATTENDING,
  });
  if (confirmedCount >= event.capacity) return;
  const next = await RSVP.findOne({
    eventId,
    status: RSVP_STATUS.WAITLISTED,
  }).sort({ waitlistPosition: 1 });
  if (!next) return;
  next.status = RSVP_STATUS.ATTENDING;
  next.waitlistPosition = null;
  await next.save();
  sendAcceptance(next, event).catch((e) =>
    console.error("[Waitlist] Promotion acceptance failed:", e.message),
  );
};

// GET /api/rsvp/:id  (public — used by guest invitation page)
export const getRsvp = async (req, res) => {
  const { id } = req.params;
  try {
    const rsvp = await RSVP.findById(id).populate("eventId");
    if (!rsvp) return res.status(404).json({ message: "Invitation not found" });
    res.status(200).json({ rsvp, event: rsvp.eventId });
  } catch (err) {
    console.error("RSVP fetch error:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST /api/rsvp/:id/submit  (public — guest submits/updates their RSVP)
export const submitRsvp = async (req, res) => {
  const { id } = req.params;
  try {
    const rsvp = await RSVP.findById(id).populate("eventId");
    if (!rsvp) return res.status(404).json({ message: "Invitation not found" });

    const event = rsvp.eventId;
    const {
      fullname,
      dietaryRequirements,
      rsvpStatus,
      plusOne,
      plusOneFullname,
      plusOneDietaryRequirements,
    } = req.body;

    rsvp.guestName = fullname;
    rsvp.dietaryNotes = dietaryRequirements || "";

    const wasAttending = rsvp.status === RSVP_STATUS.ATTENDING;
    const isGoing = rsvpStatus === "going";

    if (!isGoing) {
      rsvp.status = RSVP_STATUS.DECLINED;
      rsvp.plusOne = null;
      rsvp.waitlistPosition = null;
    } else {
      const confirmedCount = await RSVP.countDocuments({
        eventId: event._id,
        status: RSVP_STATUS.ATTENDING,
        _id: { $ne: rsvp._id },
      });

      if (confirmedCount >= event.capacity) {
        if (event.enableWaitlist) {
          const lastOnWaitlist = await RSVP.findOne({
            eventId: event._id,
            status: RSVP_STATUS.WAITLISTED,
          }).sort({ waitlistPosition: -1 });
          rsvp.status = RSVP_STATUS.WAITLISTED;
          rsvp.waitlistPosition = (lastOnWaitlist?.waitlistPosition ?? 0) + 1;
        } else {
          return res
            .status(409)
            .json({ message: "This event is at full capacity." });
        }
      } else {
        rsvp.status = event.autoAccept
          ? RSVP_STATUS.ATTENDING
          : RSVP_STATUS.PENDING;
        rsvp.waitlistPosition = null;
      }

      if (event.allowPlusOnes && plusOne) {
        rsvp.plusOne = {
          name: plusOneFullname,
          dietaryNotes: plusOneDietaryRequirements || "",
        };
      } else {
        rsvp.plusOne = null;
      }
    }

    await rsvp.save();

    // If guest changed from ATTENDING to not going, promote next on waitlist
    if (wasAttending && rsvp.status !== RSVP_STATUS.ATTENDING) {
      promoteFromWaitlist(event._id).catch((e) =>
        console.error("[Waitlist] Promotion failed:", e.message),
      );
    }

    sendRsvpConfirmation(rsvp, event).catch((e) =>
      console.error("[Notification] RSVP confirmation failed:", e.message),
    );
    if (rsvp.status === RSVP_STATUS.ATTENDING) {
      sendAcceptance(rsvp, event).catch((e) =>
        console.error("[Notification] Acceptance email failed:", e.message),
      );
    }

    res.status(200).json({ success: true, rsvp });
  } catch (err) {
    console.error("RSVP submit error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rsvp/:id/:status  (protected — organizer)
export const getRSVPbyStatus = async (req, res) => {
  const { status, id } = req.params;
  try {
    const rsvps = await RSVP.find({
      eventId: new mongoose.Types.ObjectId(id),
      status: status,
    });
    if (!rsvps) return res.status(404).json({ message: "no rsvps found" });
    res.status(200).json({ rsvps, event: rsvps.eventId });
  } catch (err) {
    console.error("RSVP fetch error:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getRsvpCheckedInUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const rsvps = await RSVP.find({
      eventId: new mongoose.Types.ObjectId(id),
      checkedIn: true,
    });
    res.status(200).json({ rsvps });
  } catch (err) {
    console.error("RSVP fetch error:", err);
    res.status(500).json({ message: err.message });
  }
};
export const checkInUser = async (req, res) => {
  const { id } = req.params;
  const { checkin } = req.body;
  
  try {
    const rsvp = await RSVP.findByIdAndUpdate(
      id,
      { $set: { checkedIn: checkin } },
      { new: true },
    );

    if (!rsvp) return res.status(404).json({ message: "RSVP not found" });

    res.status(200).json({ rsvp });
  } catch (err) {
    console.error("RSVP check-in error:", err);
    res.status(500).json({ message: err.message });
  }
};
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { rsvpIds, status } = req.body;

    const before = await RSVP.find({ _id: { $in: rsvpIds } }).select(
      "status eventId",
    );
    await RSVP.updateMany(
      { _id: { $in: rsvpIds } },
      { $set: { status, waitlistPosition: null } },
    );

    if (status === RSVP_STATUS.ATTENDING) {
      const rsvps = await RSVP.find({ _id: { $in: rsvpIds } }).populate(
        "eventId",
      );
      rsvps.forEach((rsvp) => {
        sendAcceptance(rsvp, rsvp.eventId).catch((e) =>
          console.error(
            `[Notification] Acceptance failed for ${rsvp.guestEmail}:`,
            e.message,
          ),
        );
      });
    }

    // If any ATTENDING guests were moved away, try to promote from waitlist
    if (status === RSVP_STATUS.DECLINED) {
      const attendingBefore = before.filter(
        (r) => r.status === RSVP_STATUS.ATTENDING,
      );
      const uniqueEventIds = [
        ...new Set(attendingBefore.map((r) => r.eventId.toString())),
      ];
      uniqueEventIds.forEach((eventId) => {
        promoteFromWaitlist(eventId).catch((e) =>
          console.error("[Waitlist] Promotion failed:", e.message),
        );
      });
    }

    res.json({ success: true, message: `${rsvpIds.length} guests updated` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/rsvp/:rsvpId/status  (protected — organizer, single guest)
export const updateRsvpStatus = async (req, res) => {
  try {
    const { rsvpId } = req.params;
    const { status } = req.body;

    if (!Object.values(RSVP_STATUS).includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const rsvp = await RSVP.findById(rsvpId).populate("eventId");
    if (!rsvp)
      return res
        .status(404)
        .json({ success: false, message: "RSVP not found" });

    const prevStatus = rsvp.status;
    rsvp.status = status;
    if (status !== RSVP_STATUS.WAITLISTED) rsvp.waitlistPosition = null;
    await rsvp.save();

    if (status === RSVP_STATUS.ATTENDING) {
      sendAcceptance(rsvp, rsvp.eventId).catch((e) =>
        console.error("[Notification] Acceptance failed:", e.message),
      );
    }

    if (
      prevStatus === RSVP_STATUS.ATTENDING &&
      status !== RSVP_STATUS.ATTENDING
    ) {
      promoteFromWaitlist(rsvp.eventId._id).catch((e) =>
        console.error("[Waitlist] Promotion failed:", e.message),
      );
    }

    res.json({ success: true, rsvp });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/rsvp/:rsvpId/checkin  (protected — organizer, toggle check-in)
export const toggleCheckIn = async (req, res) => {
  try {
    const { rsvpId } = req.params;
    const rsvp = await RSVP.findById(rsvpId);
    if (!rsvp) return res.status(404).json({ message: "RSVP not found" });
    rsvp.checkedIn = !rsvp.checkedIn;
    rsvp.checkedInAt = rsvp.checkedIn ? new Date() : null;
    await rsvp.save();
    res.json({ checkedIn: rsvp.checkedIn, checkedInAt: rsvp.checkedInAt });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/rsvp/delete/:rsvpId  (protected — organizer)
export const deleteRsvp = async (req, res) => {
  try {
    const { rsvpId } = req.params;
    const rsvp = await RSVP.findByIdAndDelete(rsvpId);
    if (!rsvp)
      return res
        .status(404)
        .json({ success: false, message: "RSVP not found" });

    if (rsvp.status === RSVP_STATUS.ATTENDING) {
      promoteFromWaitlist(rsvp.eventId).catch((e) =>
        console.error("[Waitlist] Promotion failed:", e.message),
      );
    }

    res.json({ success: true, message: "RSVP deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
