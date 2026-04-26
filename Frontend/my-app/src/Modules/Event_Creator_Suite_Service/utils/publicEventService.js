import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const fetchPublicEvents = async (params = {}) => {
  const { data } = await axios.get(`${API}/api/public/events`, { params });
  return data.events;
};
