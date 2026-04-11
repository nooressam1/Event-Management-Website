import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNavigationBar from "../../shared/component/SideNavigationBar";
import Footer from "../../shared/component/Footer";
import EventCard from "../components/my-events/EventCard";
import AddEventCard from "../components/my-events/AddEventCard";
import StatsSection from "../components/my-events/StatsSection";
import EventTabs, { TAB_TO_STATUS } from "../components/my-events/EventTabs";
import EventFilters from "../components/my-events/EventFilters";
import useMyEvents from "../hooks/useMyEvents";
import CustomButton from "../../shared/component/CustomButton";
import { Plus } from "lucide-react";

const MyEvents = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All Events");

  const {
    events,
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
  } = useMyEvents();

  const filteredEvents =
    activeTab === "All Events"
      ? events
      : events.filter((e) => e.status === TAB_TO_STATUS[activeTab]);

  return (
    <div className="flex h-screen overflow-hidden bg-MainBackground font-inter">
      <SideNavigationBar activeItem="My Events" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-jakarta font-bold text-white mb-1">
                My Events
              </h1>
              <p className="text-MainOffWhiteText text-sm">
                Manage and track your event performance in real-time.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <CustomButton
                title="Create New Event"
                icon={Plus}
                onClick={() => navigate("/events/create")}
                className="bg-MainBlue hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <StatsSection stats={stats} loading={loading} />

          {/* Search Section */}
          <EventFilters
            search={search}
            sortBy={sortBy}
            dateFrom={dateFrom}
            dateTo={dateTo}
            onSearchChange={setSearch}
            onSortChange={setSortBy}
            onDateFromChange={setDateFrom}
            onDateToChange={setDateTo}
          />

          {/* Event Cards */}
          <EventTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {error ? (
            <div className="text-MainRed text-sm py-8">{error}</div>
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-NavigationBackground border border-LineBox rounded-xl h-72 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
              <AddEventCard />
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MyEvents;
