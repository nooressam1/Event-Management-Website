import Event from "../../models/Event.js";
import RSVP from "../../models/RSVP.js";
import { EVENT_STATUS, RSVP_STATUS } from "../../models/enum.js";

// POST /api/events
export const createEvent = async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      coverImage,
      date,
      time,
      location,
      capacity,
      enableWaitlist,
      allowPlusOnes,
      rsvpQuestions,
      status,
    } = req.body;

    const event = await Event.create({
      organizer: req.user.id,
      title,
      shortDescription,
      description,
      coverImage,
      date,
      time,
      location,
      capacity,
      enableWaitlist: enableWaitlist ?? false,
      allowPlusOnes: allowPlusOnes ?? false,
      rsvpQuestions: rsvpQuestions ?? [],
      status: status ?? EVENT_STATUS.DRAFT,
    });

    // Auto-generate invite link on publish
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
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user.id,
    });

    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    const fields = [
      "title",
      "shortDescription",
      "description",
      "coverImage",
      "date",
      "time",
      "location",
      "capacity",
      "enableWaitlist",
      "allowPlusOnes",
      "rsvpQuestions",
      "status",
    ];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) event[f] = req.body[f];
    });

    // Generate invite code when publishing for the first time
    if (event.status === EVENT_STATUS.PUBLISHED && !event.inviteCode) {
      event.generateInviteCode();
    }

    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events?status=&search=&sortBy=date|title|attendees&dateFrom=&dateTo=
export const getMyEvents = async (req, res) => {
  try {
    const { status, search, sortBy, dateFrom, dateTo } = req.query;
    const filter = { organizer: req.user.id };

    if (status && Object.values(EVENT_STATUS).includes(status)) {
      filter.status = status;
    }

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

    // Build sort — attendees sort is applied after aggregation
    const mongoSort =
      sortBy === "title"
        ? { title: 1 }
        : sortBy === "attendees"
          ? { date: -1 } // placeholder; re-sorted after aggregation
          : { date: 1 }; // default: closest date first

    const events = await Event.find(filter).sort(mongoSort);

    // Aggregate RSVP counts in one query instead of N queries
    const eventIds = events.map((e) => e._id);
    const rsvpCounts = await RSVP.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          status: RSVP_STATUS.ATTENDING,
        },
      },
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

// GET /api/events/stats
export const getEventStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Active = PUBLISHED events
    const activeEvents = await Event.countDocuments({
      organizer: userId,
      status: EVENT_STATUS.PUBLISHED,
    });

    // Total attending RSVPs created this calendar month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const organizerEventIds = (
      await Event.find({ organizer: userId }).select("_id")
    ).map((e) => e._id);

    const totalRSVPs = await RSVP.countDocuments({
      eventId: { $in: organizerEventIds },
      status: RSVP_STATUS.ATTENDING,
      createdAt: { $gte: startOfMonth },
    });

    // Upcoming deadlines = PUBLISHED events happening within the next 7 days
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingDeadlines = await Event.countDocuments({
      organizer: userId,
      status: EVENT_STATUS.PUBLISHED,
      date: { $gte: now, $lte: in7Days },
    });

    res.json({
      success: true,
      stats: { activeEvents, totalRSVPs, upcomingDeadlines },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/events/:id
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user.id,
    });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    await RSVP.deleteMany({ eventId: event._id });
    await event.deleteOne();

    res.json({
      success: true,
      message: "Event and all associated data deleted",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events/:id/revoke-invite
export const revokeInviteLink = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user.id,
    });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    event.revokeInviteLink(); // sets inviteLinkActive = false
    await event.save();
    res.json({ success: true, event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user.id,
    });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    const [confirmed, waitlisted, declined] = await Promise.all([
      RSVP.countDocuments({
        eventId: event._id,
        status: RSVP_STATUS.ATTENDING,
      }),
      RSVP.countDocuments({
        eventId: event._id,
        status: RSVP_STATUS.WAITLISTED,
      }),
      RSVP.countDocuments({ eventId: event._id, status: RSVP_STATUS.DECLINED }),
    ]);

    res.json({
      success: true,
      event: {
        ...event.toJSON(),
        rsvpStats: { confirmed, waitlisted, declined },
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/events/:id/attendees?page=1&limit=10&search=&status=
export const getEventAttendees = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user.id,
    });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    const { page = 1, limit = 10, search = "", status } = req.query;
    const filter = { eventId: event._id };

    if (status && Object.values(RSVP_STATUS).includes(status))
      filter.status = status;

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
      success: true,
      attendees,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/events/:id/suite-data
export const saveSuiteData = async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, organizer: req.user.id });
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (!event.suiteData) event.suiteData = {};
    const { plan, rsvpQuestions, flyerSettings } = req.body;
    if (plan          !== undefined) event.suiteData.plan          = plan;
    if (rsvpQuestions !== undefined) event.suiteData.rsvpQuestions = rsvpQuestions;
    if (flyerSettings !== undefined) event.suiteData.flyerSettings = flyerSettings;
    event.markModified("suiteData");
    await event.save();
    res.json({ success: true, suiteData: event.suiteData });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/events/:id/start
export const startEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user.id,
    });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

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
    const event = await Event.findOne({
      _id: req.params.id,
      organizer: req.user.id,
    });
    if (!event)
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });

    const attendees = await RSVP.find({ eventId: event._id }).sort({
      createdAt: -1,
    });

    const rows = [
      ["Name", "Email", "Status", "Plus One", "Checked In", "Notes"],
      ...attendees.map((a) => [
        `"${a.guestName}"`,
        `"${a.guestEmail}"`,
        a.status,
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
