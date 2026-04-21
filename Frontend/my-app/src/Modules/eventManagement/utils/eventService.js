import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "";

const cfg = { withCredentials: true };

export const getMyEvents = (params = {}) =>
  axios.get(`${API}/api/events`, { ...cfg, params }).then((r) => r.data);

export const getEventStats = () =>
  axios.get(`${API}/api/events/stats`, cfg).then((r) => r.data);

export const createEvent = (data) =>
  axios.post(`${API}/api/events`, data, cfg).then((r) => r.data);

export const updateEvent = (id, data) =>
  axios.put(`${API}/api/events/${id}`, data, cfg).then((r) => r.data);

export const getEventById = (id) =>
  axios.get(`${API}/api/events/${id}`, cfg).then((r) => r.data);

export const getEventAttendees = (id, params) =>
  axios
    .get(`${API}/api/events/${id}/attendees`, { ...cfg, params })
    .then((r) => r.data);

export const startEvent = (id) =>
  axios.post(`${API}/api/events/${id}/start`, {}, cfg).then((r) => r.data);

export const getExportUrl = (id) => `${API}/api/events/${id}/export`;

export const deleteEvent = (id) =>
  axios.delete(`${API}/api/events/${id}`, cfg).then((r) => r.data);

export const revokeInvite = (id) =>
  axios
    .post(`${API}/api/events/${id}/revoke-invite`, {}, cfg)
    .then((r) => r.data);
