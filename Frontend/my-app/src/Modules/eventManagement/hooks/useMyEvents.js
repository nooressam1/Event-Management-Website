import { useState, useEffect, useCallback, useMemo } from "react";
import { getMyEvents, getEventStats } from "../utils/eventService";
import useSocket from "../utils/useSocket";

const useMyEvents = () => {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search / sort / date-range state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date"); // date | title | attendees
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const handleCapacityUpdate = useCallback(({ eventId, rsvpCount }) => {
    setEvents((prev) =>
      prev.map((e) => (e._id === eventId ? { ...e, rsvpCount } : e)),
    );
  }, []);

  const { joinEvent, leaveEvent } = useSocket(handleCapacityUpdate);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [eventsRes, statsRes] = await Promise.all([
        getMyEvents(),
        getEventStats(),
      ]);
      setEvents(eventsRes.events);
      setStats(statsRes.stats);
      eventsRes.events.forEach((e) => joinEvent(e._id));
    } catch {
      setError("Failed to load events. Make sure you are logged in.");
    } finally {
      setLoading(false);
    }
  }, [joinEvent]);

  useEffect(() => {
    fetchData();
    return () => {
      events.forEach((e) => leaveEvent(e._id));
    };
  }, []);

  // Client-side search + date range + sort (all events already loaded)
  const processedEvents = useMemo(() => {
    let result = [...events];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q),
      );
    }

    // Date range
    if (dateFrom) {
      const from = new Date(dateFrom);
      result = result.filter((e) => new Date(e.date) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      result = result.filter((e) => new Date(e.date) <= to);
    }

    // Sort
    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "attendees") {
      result.sort((a, b) => (b.rsvpCount ?? 0) - (a.rsvpCount ?? 0));
    } else {
      // date: closest first
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return result;
  }, [events, search, sortBy, dateFrom, dateTo]);

  return {
    events: processedEvents,
    rawEvents: events,
    stats,
    loading,
    error,
    search,
    sortBy,
    dateFrom,
    dateTo,
    setSearch,
    setSortBy,
    setDateFrom,
    setDateTo,
    refetch: fetchData,
  };
};

export default useMyEvents;
