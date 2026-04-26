import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEventById,
  getEventAttendees,
  startEvent,
  updateEvent,
  deleteEvent,
  revokeInvite,
  getExportUrl,
  updateRsvpStatus,
  removeRsvp,
} from "../utils/eventService";

const PAGE_SIZE = 10;

const useEventDashboard = (eventId) => {
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [attendees, setAttendees] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [starting, setStarting] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [settingStatus, setSettingStatus] = useState(false);

  // Fetch event + rsvpStats
  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    getEventById(eventId)
      .then((data) => {
        setEvent(data.event);
        setError(null);
      })
      .catch(() => setError("Failed to load event."))
      .finally(() => setLoading(false));
  }, [eventId]);

  // Fetch attendees when filters/page change
  const fetchAttendees = useCallback(() => {
    if (!eventId) return;
    setAttendeesLoading(true);
    getEventAttendees(eventId, {
      page: currentPage,
      limit: PAGE_SIZE,
      search,
      status: statusFilter || undefined,
    })
      .then((data) => {
        setAttendees(data.attendees);
        setPagination(data.pagination);
      })
      .catch(() => {})
      .finally(() => setAttendeesLoading(false));
  }, [eventId, currentPage, search, statusFilter]);

  useEffect(() => {
    fetchAttendees();
  }, [fetchAttendees]);

  const handleStartEvent = async () => {
    if (starting) return;
    setStarting(true);
    try {
      const data = await startEvent(eventId);
      setEvent((prev) => ({ ...prev, status: data.event.status }));
    } catch {
      // silently fail — user sees button re-enable
    } finally {
      setStarting(false);
    }
  };

  const handleExport = () => {
    window.open(getExportUrl(eventId), "_blank");
  };

  const handleEditEvent = () => navigate(`/events/${eventId}/edit`);

  const handleRevokeInvite = async () => {
    if (revoking) return;
    setRevoking(true);
    try {
      const data = await revokeInvite(eventId);
      setEvent((prev) => ({ ...prev, inviteLinkActive: data.event.inviteLinkActive }));
    } catch {
      // no-op
    } finally {
      setRevoking(false);
    }
  };

  const handleSetStatus = async (status) => {
    if (settingStatus) return;
    setSettingStatus(true);
    try {
      const data = await updateEvent(eventId, { status });
      setEvent((prev) => ({ ...prev, status: data.event.status }));
    } catch {
      // no-op
    } finally {
      setSettingStatus(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (deleting) return;
    setDeleting(true);
    try {
      await deleteEvent(eventId);
      navigate("/myevents");
    } catch {
      setDeleting(false);
    }
  };

  const handleApproveRsvp = async (rsvpId) => {
    await updateRsvpStatus(rsvpId, "ATTENDING").catch(() => {});
    fetchAttendees();
  };

  const handleDeclineRsvp = async (rsvpId) => {
    await updateRsvpStatus(rsvpId, "DECLINED").catch(() => {});
    fetchAttendees();
  };

  const handleRemoveRsvp = async (rsvpId) => {
    await removeRsvp(rsvpId).catch(() => {});
    fetchAttendees();
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  return {
    event,
    loading,
    error,
    attendees,
    pagination,
    attendeesLoading,
    search,
    statusFilter,
    currentPage,
    starting,
    revoking,
    deleting,
    settingStatus,
    setCurrentPage,
    handleSearchChange,
    handleStatusFilterChange,
    handleStartEvent,
    handleRevokeInvite,
    handleSetStatus,
    handleDeleteEvent,
    handleExport,
    handleEditEvent,
    handleApproveRsvp,
    handleDeclineRsvp,
    handleRemoveRsvp,
  };
};

export default useEventDashboard;
