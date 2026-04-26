import React, { useState } from "react";
import SearchBar from "../../shared/component/SearchBar";
import GuestBox from "../component/guestBox";
import StatCard from "../../shared/component/StatCard";
import { Check, CircleCheck, Users, Trash } from "lucide-react";
import StatBar from "../../shared/component/StatBar";
import CustomButton from "../../shared/component/CustomButton";
import { useParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { useWaitlist } from "../utils/waitlistHook";
import EventSideBar from "../../Event_Creator_Suite_Service/components/EventSideBar";
import Footer from "../../shared/component/Footer";

const timeAgo = (dateStr) => {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const TABS = [
  { key: "WAITLISTED", label: "Waitlisted" },
  { key: "PENDING",    label: "Pending Approval" },
];

const manageAttendees = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("WAITLISTED");

  const {
    rsvpInvitations,
    eventInfo,
    attendingCount,
    isLoading,
    recentActivity,
    handleMoveToConfirmed,
    handleDelete,
  } = useWaitlist(id, activeTab);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedGuests([]);
    setSelectAll(false);
    setSearchQuery("");
  };

  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedGuests(filteredGuests.map((u) => u._id));
    } else {
      setSelectedGuests([]);
    }
  };

  const handleSelectGuest = (guestId) => {
    setSelectedGuests((prev) =>
      prev.includes(guestId)
        ? prev.filter((i) => i !== guestId)
        : [...prev, guestId],
    );
  };

  const filteredGuests = rsvpInvitations
    .filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        user.guestName?.toLowerCase().includes(query) ||
        user.guestEmail?.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      switch (selectedOption) {
        case "newest":  return new Date(b.updatedAt) - new Date(a.updatedAt);
        case "oldest":  return new Date(a.updatedAt) - new Date(b.updatedAt);
        case "name_asc":  return a.guestName.localeCompare(b.guestName);
        case "name_desc": return b.guestName.localeCompare(a.guestName);
        default: return new Date(a.updatedAt) - new Date(b.updatedAt);
      }
    });

  const actionLabel = activeTab === "PENDING" ? "Approve" : "Move to Confirmed";

  return (
    <div className="flex h-screen overflow-hidden bg-MainBackground font-inter">
      <EventSideBar event={eventInfo?.event} activeItem="Attendees" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
    <div className="flex flex-col md:flex-row h-full gap-6 overflow-hidden">
      {/* Left side */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col gap-5 md:flex-row justify-between items-center">
          <div className="w-full flex md:flex-col flex-row items-center md:items-start justify-between">
            <h1 className="text-white font-jakarta font-black text-lg">Manage Attendees</h1>
            <p className="text-MainOffWhiteText flex flex-row gap-2 font-inter text-sm">
              {eventInfo?.event?.title}{" "}
              <span className="hidden md:block">
                • {eventInfo?.event?.location?.address || ""}
              </span>
            </p>
          </div>

          <div className="md:hidden w-full flex flex-col gap-5">
            <StatCard label="Capacity left" value={eventInfo?.event?.capacity - attendingCount} color="blue" icon={Users}>
              <StatBar current={attendingCount} total={eventInfo?.event?.capacity} />
            </StatCard>
          </div>

          <div className="flex items-center gap-2 md:w-[400px] w-full">
            <SearchBar width="w-full" onSearch={(value) => setSearchQuery(value)} />
            <button
              className="md:hidden shrink-0 text-MainOffWhiteText border border-LineBox rounded-lg px-3 py-[10px] text-sm hover:border-MainBlue hover:text-MainBlue transition-colors"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 border-b border-LineBox">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.key
                  ? "border-MainBlue text-white"
                  : "border-transparent text-SecondOffWhiteText hover:text-MainOffWhiteText"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap gap-4 justify-between items-center py-4 sm:py-2 px-2 sm:px-5">
          <div className="flex gap-4">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }} className="text-MainOffWhiteText font-inter text-sm">
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
              Select All
            </label>
            <div className="h-4 w-0.5 bg-LineBox"></div>
            <h1 className="text-MainOffWhiteText font-inter text-sm">{filteredGuests.length} people</h1>
          </div>
          <div className={`${showFilters ? "flex" : "hidden"} md:flex flex-wrap gap-4 justify-between items-center py-4 sm:py-5 px-2 sm:px-5 md:relative absolute left-0 right-0 top-[57px] md:top-auto z-40 bg-MainBackground md:bg-transparent border-b md:border-none border-LineBox`}>
            <h1 className="text-MainOffWhiteText font-inter text-sm">SORT BY :</h1>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="bg-transparent text-MainBlue font-inter text-sm rounded-md outline-none cursor-pointer"
            >
              <option value="">Oldest First</option>
              <option value="newest">Newest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
            </select>
          </div>
        </div>

        {/* Scrollable guest list */}
        <div className="flex-1 overflow-y-auto custom-scroll pr-2">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-MainBlueBackground animate-pulse" />
              ))}
            </div>
          ) : filteredGuests.length === 0 ? (
            <p className="text-MainOffWhiteText font-inter text-sm text-center py-10">
              {searchQuery ? "No guests match your search." : `No ${activeTab === "PENDING" ? "pending" : "waitlisted"} guests.`}
            </p>
          ) : (
            filteredGuests.map((user) => (
              <GuestBox
                key={user._id || user.guestEmail}
                name={user.guestName}
                email={user.guestEmail}
                joinedTime={timeAgo(user.updatedAt)}
                positionNum={user.waitlistPosition}
                checked={selectedGuests.includes(user._id)}
                onCheck={() => handleSelectGuest(user._id)}
                onDelete={() => handleDelete(user._id, user.guestName)}
              />
            ))
          )}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="hidden md:flex flex-row w-[25%] gap-5 sticky top-0">
        <div className="h-full w-0.5 bg-LineBox"></div>
        <div className="flex flex-col w-full justify-between gap-5">
          <div className="flex w-full flex-col gap-5">
            <StatCard label="Capacity left" value={eventInfo?.event?.capacity - attendingCount} color="blue" icon={Users}>
              <StatBar current={attendingCount} total={eventInfo?.event?.capacity} />
            </StatCard>
            <div className="flex flex-col gap-3">
              <h1 className="text-MainOffWhiteText font-inter text-sm">Quick Actions</h1>
              <CustomButton
                type="button"
                title={`${actionLabel} (${selectedGuests.length})`}
                icon={CircleCheck}
                onClick={() =>
                  handleMoveToConfirmed(selectedGuests, () => {
                    setSelectedGuests([]);
                    setSelectAll(false);
                  })
                }
                className="bg-MainBlue px-8 py-4 text-sm text-white rounded-lg w-full"
              />
            </div>
          </div>

          <div className="flex flex-row w-full justify-between border-dotted items-center rounded-lg bg-MainBlueBackground border-LineBox border-2 py-4 px-5 gap-5">
            <div className="flex flex-col gap-3">
              <h1 className="text-MainOffWhiteText font-inter uppercase font-medium text-sm">Recent Activity</h1>
              {recentActivity.length === 0 ? (
                <p className="text-MainOffWhiteText font-inter text-sm pl-3">No recent activity</p>
              ) : (
                recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-2 pl-3">
                    {activity.type === "confirmed" ? (
                      <Check className="text-MainGreen" size={20} strokeWidth={2} />
                    ) : (
                      <Trash className="text-red-400" size={20} strokeWidth={2} />
                    )}
                    <h1 className={`font-inter font-normal text-sm ${activity.type === "confirmed" ? "text-white" : "text-red-400"}`}>
                      {activity.name} was {activity.type === "confirmed" ? "approved" : "removed"} • {timeAgo(activity.time.toISOString())}
                    </h1>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom button */}
      <div className="md:hidden absolute bottom-2 flex w-[80%] flex-col">
        <CustomButton
          type="button"
          title={`${actionLabel} (${selectedGuests.length})`}
          icon={CircleCheck}
          onClick={() =>
            handleMoveToConfirmed(selectedGuests, () => {
              setSelectedGuests([]);
              setSelectAll(false);
            })
          }
          className="bg-MainBlue px-8 py-4 text-sm text-white rounded-lg w-full"
        />
      </div>
    </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default manageAttendees;
