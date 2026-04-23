import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "";
const cfg = { withCredentials: true };

/**
 * Persist suite tool data onto the event document.
 * @param {string} eventId
 * @param {{ plan?: string, rsvpQuestions?: object[], flyerSettings?: object }} partial
 */
export const saveSuiteData = (eventId, partial) =>
  axios.patch(`${API}/api/events/${eventId}/suite-data`, partial, cfg).then((r) => r.data);
