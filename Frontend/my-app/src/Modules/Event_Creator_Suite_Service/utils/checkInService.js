import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const opts = { withCredentials: true };

export const fetchAttendees = (eventId) =>
  axios
    .get(`${API}/api/rsvp/${eventId}/ATTENDING`, opts)
    .then((r) => r.data.rsvps);

export const patchCheckIn = (rsvpId) =>
  axios
    .patch(`${API}/api/rsvp/${rsvpId}/checkin`, {}, opts)
    .then((r) => r.data);

export const fetchEvent = (eventId) =>
  axios
    .get(`${API}/api/events/${eventId}`, opts)
    .then((r) => r.data.event);
