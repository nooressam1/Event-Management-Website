import Event from "../../models/Event.js";
import RSVP from "../../models/RSVP.js";
import { EVENT_STATUS, RSVP_STATUS } from "../../models/enum.js";

// GET /api/public/events — no auth required
export const getPublicEvents = async (req, res) => {
  try {
    const { search, sortBy, dateFrom, dateTo } = req.query;

    const filter = {
      status: EVENT_STATUS.PUBLISHED,
      isPublic: true,
      inviteLinkActive: true,
    };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) filter.date.$gte = new Date(dateFrom);
      if (dateTo) filter.date.$lte = new Date(dateTo);
    }

    const mongoSort =
      sortBy === "title"
        ? { title: 1 }
        : sortBy === "attendees"
          ? { date: -1 }
          : { date: 1 }; // default: soonest first

    const events = await Event.find(filter).sort(mongoSort);

    const eventIds = events.map((e) => e._id);
    const rsvpCounts = await RSVP.aggregate([
      { $match: { eventId: { $in: eventIds }, status: RSVP_STATUS.ATTENDING } },
      { $group: { _id: "$eventId", count: { $sum: 1 } } },
    ]);

    const rsvpMap = {};
    rsvpCounts.forEach((r) => {
      rsvpMap[r._id.toString()] = r.count;
    });

    let enriched = events.map((event) => ({
      ...event.toJSON(),
      rsvpCount: rsvpMap[event._id.toString()] ?? 0,
    }));

    if (sortBy === "attendees") {
      enriched.sort((a, b) => b.rsvpCount - a.rsvpCount);
    }

    res.json({ success: true, events: enriched });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
