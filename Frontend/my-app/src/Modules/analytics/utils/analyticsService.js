import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "";
const cfg = { withCredentials: true };

export const getEventAnalytics = (id) =>
  axios.get(`${API}/api/analytics/events/${id}`, cfg).then((r) => r.data);
