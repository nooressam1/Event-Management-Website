import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../shared/component/Footer";
import EventSideBar from "../../Event_Creator_Suite_Service/components/EventSideBar";
import EventHeader from "../components/event-dashboard/EventHeader";
import DeleteConfirm from "../components/event-dashboard/DeleteConfirm";
import DashboardStatCards from "../components/event-dashboard/DashboardStatCards";
import AttendeeTable from "../components/event-dashboard/AttendeeTable";
import useEventDashboard from "../hooks/useEventDashboard";

const EventDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
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
  } = useEventDashboard(id);

  if (loading) {
    return (
      <div className="flex h-screen bg-MainBackground font-inter">
        <EventSideBar event={null} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-SecondOffWhiteText text-sm">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex h-screen bg-MainBackground font-inter">
        <EventSideBar event={null} />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-MainRed text-sm">{error ?? "Event not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-MainBackground font-inter">
      <EventSideBar
        event={event}
        activeItem="Overview"
        starting={starting}
        settingStatus={settingStatus}
        onStartEvent={handleStartEvent}
        onSetStatus={handleSetStatus}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {showDeleteConfirm && (
            <DeleteConfirm
              onConfirm={handleDeleteEvent}
              onCancel={() => setShowDeleteConfirm(false)}
              loading={deleting}
            />
          )}

          <EventHeader
            event={event}
            revoking={revoking}
            settingStatus={settingStatus}
            onEdit={handleEditEvent}
            onRevokeInvite={handleRevokeInvite}
            onSetStatus={handleSetStatus}
            onDeleteClick={() => setShowDeleteConfirm(true)}
          />

          <DashboardStatCards rsvpStats={event.rsvpStats} capacity={event.capacity} />

          <AttendeeTable
            attendees={attendees}
            pagination={pagination}
            loading={attendeesLoading}
            search={search}
            statusFilter={statusFilter}
            currentPage={currentPage}
            onSearchChange={handleSearchChange}
            onStatusFilterChange={handleStatusFilterChange}
            onPageChange={setCurrentPage}
            onExport={handleExport}
            onApprove={handleApproveRsvp}
            onDecline={handleDeclineRsvp}
            onRemove={handleRemoveRsvp}
          />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default EventDashboard;
