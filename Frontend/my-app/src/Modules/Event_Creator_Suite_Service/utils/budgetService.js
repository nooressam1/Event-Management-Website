import axios from "axios";

const API = import.meta.env.VITE_API_URL ?? "";
const cfg = { withCredentials: true };
const base = (eventId) => `${API}/api/suite/budget/${eventId}`;

export const fetchBudget = (eventId) =>
  axios.get(base(eventId), cfg).then((r) => r.data.budget);

export const saveTotalBudget = (eventId, totalBudget) =>
  axios.post(base(eventId), { totalBudget }, cfg).then((r) => r.data.budget);

export const createItem = (eventId, data) =>
  axios.post(`${base(eventId)}/items`, data, cfg).then((r) => r.data.item);

export const patchItem = (eventId, itemId, updates) =>
  axios.patch(`${base(eventId)}/items/${itemId}`, updates, cfg).then((r) => r.data.item);

export const removeItem = (eventId, itemId) =>
  axios.delete(`${base(eventId)}/items/${itemId}`, cfg);
