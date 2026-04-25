import {
  ArrowBigDown,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Users,
} from "lucide-react";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useWaitlist } from "../../invitations/utils/waitlistHook";
import CheckInBoxGuest from "../../checkin/component/checkInBoxGuest.jsx";
import SearchBar from "../../shared/component/SearchBar.jsx";
import CustomButton from "../../shared/component/CustomButton";
import LivePulse from "../component/livePulse.jsx";

const checkInPage = () => {
  const { id } = useParams();

  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };
  const {
    rsvpInvitations,
    eventInfo,
    attending,
    attendingCount,
    checkedInCount,
    isLoading,
    recentActivity,
    handleMoveToConfirmed,
    handleDelete,
  } = useWaitlist(id);

  const [selectAll, setSelectAll] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
const [statusFilter, setStatusFilter] = useState("all"); // "all" | "checkedIn" | "pending"
  const filteredGuests = attending.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.guestName?.toLowerCase().includes(query) ||
      user.guestEmail?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row h-full  overflow-hidden">
      {/* Left side */}
      <div className="flex-1 flex flex-col min-h-0 gap-4">
        <div className="flex flex-col  gap-5 md:flex-row justify-between items-center">
          <div
            className="w-full flex md:flex-col gap-2 flex-row items-center md:items-start  justify-between
          "
          >
            <h1 className="text-white font-jakarta font-black text-lg">
              Event Day Check-In
            </h1>
            <p className="text-MainOffWhiteText flex flex-row gap-2 font-inter text-sm">
              {eventInfo?.event?.title}{" "}
              <span className="hidden md:block">
                • {eventInfo?.event?.location}
              </span>
            </p>
          </div>
        </div>
        {/* Search + filter toggle */}
        <div className="flex items-center gap-2  w-full">
          <SearchBar
            width="w-full"
            onSearch={(value) => setSearchQuery(value)}
          />
          <button
            className=" w-fit gap-2 flex flex-row text-MainOffWhiteText border bg-NavigationBackground border-LineBox rounded-lg px-3 py-[10px] text-sm hover:border-MainBlue hover:text-MainBlue transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="whitespace-nowrap">All Status</span>
            {showFilters ? (
              <ChevronUp></ChevronUp>
            ) : (
              <ChevronDown></ChevronDown>
            )}
          </button>
        </div>
        <div className="flex flex-row justify-between items-center p-2">
          <h1 className="text-white font-jakarta font-black text-md">
            Attendee Directory
          </h1>{" "}
          <h1 className="text-MainOffWhiteText font-jakarta font-medium text-sm">
            Showing {attending.length} total records
          </h1>
        </div>
        {/* Scrollable guest list */}
        <div className="flex-1 overflow-y-auto custom-scroll pr-2">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-16 rounded-lg bg-MainBlueBackground animate-pulse"
                />
              ))}
            </div>
          ) : filteredGuests.length === 0 ? (
            <p className="text-MainOffWhiteText font-inter text-sm text-center py-10">
              {searchQuery ? "No guests match your search." : "No guests yet."}
            </p>
          ) : (
            filteredGuests.map((user) => (
              <CheckInBoxGuest
                key={user._id || user.guestEmail}
                name={user.guestName}
                id={user._id}
                joinedTime={timeAgo(user.updatedAt)}
                positionNum={user.waitlistPosition}
                status={user.checkedIn}
                onDelete={() => handleDelete(user._id, user.guestName)}
                onCheckIn={() => ""}
              />
            ))
          )}
        </div>
      </div>

      {/* Right sidebar - hidden on mobile, visible on md+ */}
      <div className="hidden md:flex flex-row w-[25%] gap-5 items-center justify-center sticky top-0">
        <div className="flex flex-col w-full justify-between items-center gap-5">
          <LivePulse
            checkedIn={checkedInCount}
            total={eventInfo?.event?.capacity}
          ></LivePulse>
          <div className="flex flex-row w-full justify-between border-dotted items-center rounded-lg bg-MainBlueBackground border-LineBox border-2 py-4 px-5 gap-5">
            <div className="flex flex-col gap-3">
              <h1 className="text-MainOffWhiteText font-inter uppercase font-medium text-sm">
                Recent Activity
              </h1>

              {recentActivity.length === 0 ? (
                <p className="text-MainOffWhiteText font-inter text-sm pl-3">
                  No recent activity
                </p>
              ) : (
                recentActivity.map((activity, i) => (
                  <div key={i} className="flex gap-2 pl-3">
                    {activity.type === "confirmed" ? (
                      <Check
                        className="text-MainGreen"
                        size={20}
                        strokeWidth={2}
                      />
                    ) : (
                      <Trash
                        className="text-red-400"
                        size={20}
                        strokeWidth={2}
                      />
                    )}
                    <h1
                      className={`font-inter font-normal text-sm ${activity.type === "confirmed" ? "text-white" : "text-red-400"}`}
                    >
                      {activity.name} was{" "}
                      {activity.type === "confirmed"
                        ? "moved to confirmed"
                        : "removed"}{" "}
                      • {timeAgo(activity.time.toISOString())}
                    </h1>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Buttom mobile*/}
    </div>
  );
};

export default checkInPage;
