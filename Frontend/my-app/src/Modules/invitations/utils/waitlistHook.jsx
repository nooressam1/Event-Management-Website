import { useState, useEffect } from "react";
import axios from "axios";

export const useWaitlist = (id) => {
  const [rsvpInvitations, setRsvpInvitations] = useState([]);
  const [eventInfo, setEventInfo] = useState();
  const [attendingCount, setAttendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/events/${id}`,
          { withCredentials: true },
        );
        setEventInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEvent();
  }, [id]);

  const fetchGuests = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rsvp/${id}/WAITLISTED`,
        { withCredentials: true },
      );
      setRsvpInvitations(response.data.rsvps);
    } catch (error) {
      console.log("rsvp error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttendingCount = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rsvp/${id}/ATTENDING`,
        { withCredentials: true },
      );
      setAttendingCount(response.data.rsvps.length);
      console.log(attendingCount, "testinggg");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGuests();
    fetchAttendingCount();
  }, [id]);

  const handleMoveToConfirmed = async (selectedGuests, onSuccess) => {
    try {
      const movedGuests = rsvpInvitations.filter((u) =>
        selectedGuests.includes(u._id),
      );

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/rsvp/bulk-update`,
        { rsvpIds: selectedGuests, status: "ATTENDING" },
        { withCredentials: true },
      );
      movedGuests.forEach((u) => addActivity(u.guestName, "confirmed"));

      await fetchGuests();
      await fetchAttendingCount();
      onSuccess();
    } catch (error) {
      console.log(error);
    }
  };
  const addActivity = (name, type) => {
    setRecentActivity((prev) =>
      [{ name, type, time: new Date() }, ...prev].slice(0, 5),
    );
  };
  const handleDelete = async (guestId, guestName) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/rsvp/delete/${guestId}`);
      addActivity(guestName, "deleted");
      await fetchGuests();
    } catch (error) {
      console.log(error);
    }
  };
  return {
    rsvpInvitations,
    eventInfo,
    attendingCount,
    isLoading,
    recentActivity,
    fetchGuests,
    handleDelete,
    handleMoveToConfirmed,
  };
};
