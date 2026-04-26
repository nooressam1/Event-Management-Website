import Event from "../../../models/Event.js";
import RSVP from "../../../models/RSVP.js";
import { RSVP_STATUS } from "../../../models/enum.js";

const DIETARY_KEYWORDS = {
  vegetarian: /\bveget/i,
  vegan: /\bvegan/i,
  glutenFree: /gluten[\s-]?free|\bgf\b|celiac/i,
  nutAllergy: /\bnut|peanut|almond|cashew/i,
  halal: /\bhalal/i,
  kosher: /\bkosher/i,
  dairyFree: /dairy[\s-]?free|lactose/i,
};

const classifyDietary = (note) => {
  if (!note || typeof note !== "string") return null;
  const matched = [];
  for (const [key, re] of Object.entries(DIETARY_KEYWORDS)) {
    if (re.test(note)) matched.push(key);
  }
  return matched.length ? matched : ["other"];
};

const buildDietaryCounts = (rsvps) => {
  const counts = {
    vegetarian: 0,
    vegan: 0,
    glutenFree: 0,
    nutAllergy: 0,
    halal: 0,
    kosher: 0,
    dairyFree: 0,
    other: 0,
  };
  let totalWithNotes = 0;

  const tally = (note) => {
    const tags = classifyDietary(note);
    if (!tags) return;
    totalWithNotes += 1;
    tags.forEach((t) => {
      counts[t] = (counts[t] ?? 0) + 1;
    });
  };

  rsvps.forEach((r) => {
    tally(r.dietaryNotes);
    if (r.plusOne?.dietaryNotes) tally(r.plusOne.dietaryNotes);
  });

  return { counts, totalWithNotes };
};

// Group RSVPs modified within the final 24h before event, bucketed by 2h windows
const buildLastMinuteBuckets = (rsvps, eventDate) => {
  const eventTs = new Date(eventDate).getTime();
  const windowMs = 24 * 60 * 60 * 1000;
  const buckets = [];

  for (let i = 12; i >= 1; i--) {
    const end = eventTs - (i - 1) * 2 * 60 * 60 * 1000;
    const start = eventTs - i * 2 * 60 * 60 * 1000;
    const hoursBefore = i * 2;
    buckets.push({ label: `${hoursBefore}h`, start, end, count: 0 });
  }

  rsvps.forEach((r) => {
    const modifiedTs = new Date(r.lastModifiedAt ?? r.updatedAt).getTime();
    if (modifiedTs < eventTs - windowMs || modifiedTs > eventTs) return;
    const bucket = buckets.find((b) => modifiedTs >= b.start && modifiedTs < b.end);
    if (bucket) bucket.count += 1;
  });

  return buckets.map(({ label, count }) => ({ label, count }));
};

const buildRSVPTimeline = (rsvps, eventDate) => {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const WINDOW_DAYS = 14;
  const eventDay = new Date(new Date(eventDate).setHours(0, 0, 0, 0)).getTime();

  const buckets = [];
  for (let d = WINDOW_DAYS; d >= 0; d--) {
    const dayStart = eventDay - d * DAY_MS;
    const dayEnd = dayStart + DAY_MS;
    const date = new Date(dayStart);
    const label =
      d === 0
        ? "Day of"
        : date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    buckets.push({ label, dayStart, dayEnd, count: 0 });
  }

  rsvps.forEach((r) => {
    const created = new Date(r.createdAt).getTime();
    const bucket = buckets.find((b) => created >= b.dayStart && created < b.dayEnd);
    if (bucket) bucket.count += 1;
  });

  return buckets.map(({ label, count }) => ({ label, count }));
};

const buildCheckInTimeline = (rsvps) => {
  const hourly = {};
  rsvps.forEach((r) => {
    if (!r.checkedIn || !r.checkedInAt) return;
    const d = new Date(r.checkedInAt);
    const key = `${d.getHours()}:00`;
    hourly[key] = (hourly[key] ?? 0) + 1;
  });

  const ordered = Object.entries(hourly)
    .map(([label, count]) => ({
      label,
      count,
      hour: parseInt(label.split(":")[0], 10),
    }))
    .sort((a, b) => a.hour - b.hour)
    .map(({ label, count }) => ({ label, count }));

  return ordered;
};

export const computeEventAnalytics = async (eventId, organizerId) => {
  const event = await Event.findOne({
    _id: eventId,
    organizer: organizerId,
  });
  if (!event) return null;

  const rsvps = await RSVP.find({ eventId: event._id });

  const statusCounts = {
    [RSVP_STATUS.ATTENDING]: 0,
    [RSVP_STATUS.WAITLISTED]: 0,
    [RSVP_STATUS.DECLINED]: 0,
    [RSVP_STATUS.PENDING]: 0,
  };

  let checkedIn = 0;
  let plusOnes = 0;

  rsvps.forEach((r) => {
    statusCounts[r.status] = (statusCounts[r.status] ?? 0) + 1;
    if (r.checkedIn) checkedIn += 1;
    if (r.plusOne) plusOnes += 1;
  });

  const confirmed = statusCounts[RSVP_STATUS.ATTENDING];
  const totalRSVPs = rsvps.length;
  const expectedAttendance = confirmed + plusOnes;
  const noShows = Math.max(confirmed - checkedIn, 0);
  const attendanceRate =
    confirmed > 0 ? Math.round((checkedIn / confirmed) * 100) : 0;
  const capacityUtilization =
    event.capacity > 0
      ? Math.min(Math.round((checkedIn / event.capacity) * 100), 100)
      : 0;

  const { counts: dietaryCounts, totalWithNotes: dietaryTotal } =
    buildDietaryCounts(rsvps);
  const lastMinuteChanges = buildLastMinuteBuckets(rsvps, event.date);
  const checkInTimeline = buildCheckInTimeline(rsvps);
  const rsvpTimeline = buildRSVPTimeline(rsvps, event.date);

  const sentimentRating = null; // placeholder (no feedback model yet)
  const feedback = []; // placeholder

  return {
    event: {
      _id: event._id,
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      status: event.status,
      capacity: event.capacity,
    },
    summary: {
      totalRSVPs,
      confirmed,
      waitlisted: statusCounts[RSVP_STATUS.WAITLISTED],
      declined: statusCounts[RSVP_STATUS.DECLINED],
      pending: statusCounts[RSVP_STATUS.PENDING],
      checkIns: checkedIn,
      noShows,
      plusOnes,
      expectedAttendance,
      attendanceRate,
      capacityUtilization,
      sentimentRating,
    },
    dietary: {
      total: dietaryTotal,
      breakdown: dietaryCounts,
    },
    lastMinuteChanges,
    checkInTimeline,
    rsvpTimeline,
    feedback,
  };
};
