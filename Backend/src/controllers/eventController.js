import Event from "../../models/Event.js";
import RSVP from "../../models/RSVP.js";
import { EVENT_STATUS, RSVP_STATUS } from "../../models/enum.js";
import { sendThankYou } from "../services/Notification_Service/notificationService.js";

// POST /api/events
export const createEvent = async (req, res) => {
  try {
    const {
      title, shortDescription, description, coverImage, date, time, location,
      capacity, enableWaitlist, allowPlusOnes, autoAccept, isPublic, rsvpQuestions, status,
    } = req.body;
    const event = await Event.create({
      organizer: req.user.id, title, shortDescription, description, coverImage, date, time,
      location, capacity,
      enableWaitlist: enableWaitlist ?? false,
      allowPlusOnes: allowPlusOnes ?? false,
      autoAccept: autoAccept ?? false,
      isPublic: isPublic ?? false,
      rsvpQuestions: rsvpQuestions ?? [],
      status: status ?? EVENT_STATUS.DRAFT,
    });
    if (event.status === EVENT_STATUS.PUBLISHED) {
      event.generateInviteCode();
      await event.save();
    }
    res.status(201).json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/events/:id
export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    const prevStatus = event.status;
    const fields = [
      "title","shortDescription","description","coverImage","date","time","location",
      "capacity","enableWaitlist","allowPlusOnes","autoAccept","isPublic","rsvpQuestions","status",
    ];
    fields.forEach((f) => { if (req.body[f] !== undefined) event[f] = req.body[f]; });
    if (event.status === EVENT_STATUS.PUBLISHED && !event.inviteCode) {
      event.generateInviteCode();
    }
    await event.save();
    if (prevStatus !== EVENT_STATUS.COMPLETED && event.status === EVENT_STATUS.COMPLETED) {
      RSVP.find({ eventId: event._id, status: RSVP_STATUS.ATTENDING })
        .then((attendees) => {
          attendees.forEach((rsvp) => {
            sendThankYou(rsvp, event).catch((e) =>
              console.error(`[Notification] Thank-you failed for ${rsvp.guestEmail}:`, e.message)
            );
          });
        })
        .catch((e) => console.error("[Notification] Could not fetch attendees for thank-you:", e.message));
    }
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events
export const getMyEvents = async (req, res) => {
  try {
    const { status, search, sortBy, dateFrom, dateTo } = req.query;
    const filter = { organizer: req.user.id };
    if (status && Object.values(EVENT_STATUS).includes(status)) filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }
    const mongoSort = sortBy === "title" ? { title: 1 } : sortBy === "attendees" ? { date: -1 } : { date: 1 };
    const events = await Event.find(filter).sort(mongoSort);
    const eventIds = events.map((e) => e._id);
    const rsvpCounts = await RSVP.aggregate([
      { $match: { eventId: { $in: eventIds }, status: RSVP_STATUS.ATTENDING } },
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]);
    const rsvpMap = {};
    rsvpCounts.forEach((r) => { rsvpMap[r._id.toString()] = r.count; });
    let enriched = events.map((event) => ({ ...event.toJSON(), rsvpCount: rsvpMap[event._id.toString()] ?? 0 }));
    if (sortBy === "attendees") enriched.sort((a, b) => b.rsvpCount - a.rsvpCount);
    res.json({ success: true, events: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    await RSVP.deleteMany({ eventId: event._id });
    await event.deleteOne();
    res.json({ success: true, message: "Event and all associated data deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events/:id/revoke-invite
export const revokeInviteLink = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    event.revokeInviteLink();
    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
