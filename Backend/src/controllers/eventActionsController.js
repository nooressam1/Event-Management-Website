import Event from "../../models/Event.js";
import RSVP from "../../models/RSVP.js";
import { EVENT_STATUS, RSVP_STATUS } from "../../models/enum.js";

// GET /api/events/stats
export const getEventStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();
    const activeEvents = await Event.countDocuments({ organizer: userId, status: EVENT_STATUS.PUBLISHED });
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const organizerEventIds = (await Event.find({ organizer: userId }).select("_id")).map((e) => e._id);
    const totalRSVPs = await RSVP.countDocuments({
      eventId: { $in: organizerEventIds },
      status: RSVP_STATUS.ATTENDING,
      createdAt: { $gte: startOfMonth },
    });
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = await Event.countDocuments({
      organizer: userId,
      status: EVENT_STATUS.PUBLISHED,
      date: { $gte: now, $lte: in7Days },
    });
    res.json({ success: true, stats: { activeEvents, totalRSVPs, upcomingDeadlines } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    const [confirmed, waitlisted, declined] = await Promise.all([
      RSVP.countDocuments({ eventId: event._id, status: RSVP_STATUS.ATTENDING }),
      RSVP.countDocuments({ eventId: event._id, status: RSVP_STATUS.WAITLISTED }),
      RSVP.countDocuments({ eventId: event._id, status: RSVP_STATUS.DECLINED }),
    ]);
    res.json({ success: true, event: { ...event.toJSON(), rsvpStats: { confirmed, waitlisted, declined } } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id/attendees
export const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    const { page = 1, limit = 10, search = "", status } = req.query;
    const filter = { eventId: event._id };
    if (status && Object.values(RSVP_STATUS).includes(status)) filter.status = status;
    if (search) {
      filter.$or = [
        { guestName: { $regex: search, $options: "i" } },
        { guestEmail: { $regex: search, $options: "i" } },
      ];
    }
    const total = await RSVP.countDocuments(filter);
    const attendees = await RSVP.find(filter)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.json({
      success: true, attendees,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events/:id/start
export const startEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    event.status = EVENT_STATUS.PUBLISHED;
    if (!event.inviteCode) event.generateInviteCode();
    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id/export
export const exportAttendees = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });
    const attendees = await RSVP.find({ eventId: event._id }).sort({ createdAt: -1 });
    const rows = [
      ["Name", "Email", "Status", "Plus One", "Checked In", "Notes"],
      ...attendees.map((a) => [
        `"${a.guestName}"`, `"${a.guestEmail}"`, a.status,
        a.plusOne ? `"${a.plusOne.name}"` : "",
        a.checkedIn ? "Yes" : "No",
        `"${(a.additional_notes ?? "").replace(/"/g, '""')}"`,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const filename = `${event.title.replace(/[^a-z0-9]/gi, "_")}_attendees.csv`;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(csv);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
