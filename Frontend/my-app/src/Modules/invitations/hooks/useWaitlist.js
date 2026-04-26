import { useState, useEffect } from "react";
import axios from "axios";

export const useWaitlist = (id, status = "ATTENDING") => {
  const [rsvpInvitations, setRsvpInvitations] = useState([]);
  const [eventInfo, setEventInfo] = useState();
  const [attendingCount, setAttendingCount] = useState(0);
  const [checkedInCount, setCheckedInCount] = useState(0);
  const [attending, setAttending] = useState([]);
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
        `${import.meta.env.VITE_API_URL}/api/rsvp/${id}/${status}`,
        { withCredentials: true },
      );
      setRsvpInvitations(response.data.rsvps);
    } catch (error) {
      console.log("rsvp error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAttending = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rsvp/${id}/ATTENDING`,
        { withCredentials: true },
      );
      setAttendingCount(response.data.rsvps.length);
      setAttending(response.data.rsvps);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCheckedIn = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/rsvp/${id}/checkedIn`,
        { withCredentials: true },
      );
      setCheckedInCount(response.data.rsvps.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchGuests();
    fetchCheckedIn();
    fetchAttending();
  }, [id, status]);

  const addActivity = (name, type) => {
    setRecentActivity((prev) =>
      [{ name, type, time: new Date() }, ...prev].slice(0, 5),
    );
  };

  const handleMoveToConfirmed = async (selectedGuests, onSuccess) => {
    if (!selectedGuests?.length) return;
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
      await fetchAttending();
      onSuccess?.();
    } catch (error) {
      console.log(error);
    }
  };
  const handleConfirmCheckIn = async (userID, status) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/rsvp/:id/checkUser`,
        { rsvpId: userID, checkin: status },
        { withCredentials: true },
      );

      await fetchGuests();
      await fetchAttending();
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
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/rsvp/delete/${guestId}`,
        { withCredentials: true },
      );
      addActivity(guestName, "deleted");
      await fetchGuests();
      await fetchAttending();
    } catch (error) {
      console.log(error);
    }
  };

  return {
    rsvpInvitations,
    eventInfo,
    attending,
    attendingCount,
    isLoading,
    recentActivity,
    checkedInCount,
    fetchGuests,
    handleDelete,
    handleMoveToConfirmed,
    handleConfirmCheckIn,
  };
};
