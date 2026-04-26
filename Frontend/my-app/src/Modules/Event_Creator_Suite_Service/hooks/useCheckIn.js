import { useState, useEffect, useCallback } from "react";
import { fetchAttendees, fetchEvent, patchCheckIn } from "../utils/checkInService";

const useCheckIn = (eventId) => {
  const [event, setEvent] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [ev, list] = await Promise.all([
          fetchEvent(eventId),
          fetchAttendees(eventId),
        ]);
        setEvent(ev);
        setAttendees(list);
      } catch (e) {
        console.error("[useCheckIn]", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const handleToggle = useCallback(async (rsvpId) => {
    setTogglingId(rsvpId);
    try {
      const { checkedIn, checkedInAt } = await patchCheckIn(rsvpId);
      setAttendees((prev) =>
        prev.map((a) => (a._id === rsvpId ? { ...a, checkedIn, checkedInAt } : a))
      );
    } catch (e) {
      console.error("[useCheckIn] toggle failed", e);
    } finally {
      setTogglingId(null);
    }
  }, []);

  const checkedInCount = attendees.filter((a) => a.checkedIn).length;

  return { event, attendees, loading, togglingId, checkedInCount, handleToggle };
};

export default useCheckIn;
