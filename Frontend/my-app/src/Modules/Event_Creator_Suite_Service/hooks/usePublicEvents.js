import { useState, useEffect } from "react";
import { fetchPublicEvents } from "../utils/publicEventService";

const usePublicEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    setError(null);
    const handler = setTimeout(() => {
      setLoading(true);
      fetchPublicEvents({ search, sortBy, dateFrom, dateTo })
        .then((data) => { setEvents(data); setLoading(false); })
        .catch(() => { setError("Failed to load events."); setLoading(false); });
    }, 300);
    return () => clearTimeout(handler);
  }, [search, sortBy, dateFrom, dateTo]);

  return {
    events,
    loading,
    error,
    search,
    setSearch,
    sortBy,
    setSortBy,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
  };
};

export default usePublicEvents;
