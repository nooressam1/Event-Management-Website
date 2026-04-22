import React, { useEffect, useState } from "react";
import SearchBar from "../../shared/component/SearchBar";
import GuestBox from "../component/guestBox";
import StatCard from "../../shared/component/StatCard";
import { Check, CircleCheck, Mail, Users } from "lucide-react";
import StatBar from "../../shared/component/StatBar";
import CustomButton from "../../shared/component/CustomButton";
import axios from "axios";
import { useParams } from "react-router-dom";

const ManageWaitlist = () => {
  const { id } = useParams();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [rsvpInvitations, setRsvpInvitations] = useState([]);
  const [eventInfo, setEventInfo] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  // Replace selectAll handler
  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedGuests(filteredGuests.map((u) => u._id));
    } else {
      setSelectedGuests([]);
    }
  };

  const handleSelectGuest = (id) => {
    setSelectedGuests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  // Add this state
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
        `${import.meta.env.VITE_API_URL}/api/rsvp/${id}/ATTENDING`,
        { withCredentials: true },
      );
      setRsvpInvitations(response.data.rsvps);
    } catch (error) {
      console.log("rsvp error:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, [id]);

  // Sort + filter guests
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
        case "newest":
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        case "oldest":
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        case "name_asc":
          return a.guestName.localeCompare(b.guestName);
        case "name_desc":
          return b.guestName.localeCompare(a.guestName);
        default:
          return new Date(a.updatedAt) - new Date(b.updatedAt);
      }
    });
  const timeAgo = (dateStr) => {
    const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleMoveToConfirmed = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/rsvp/bulk-update`,
        { rsvpIds: selectedGuests, status: "ATTENDING" },
        { withCredentials: true },
      );
      setSelectedGuests([]);
      setSelectAll(false);
      fetchGuests(); // refetch
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-row h-full gap-6 overflow-hidden">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="flex flex-row justify-between items-center">
          <div>
            <h1 className="text-white font-jakarta font-black text-lg">
              Manage Waitlist
            </h1>
            <p className="text-MainOffWhiteText font-inter text-sm">
              {eventInfo?.event?.title} • {eventInfo?.event?.location}
            </p>
          </div>
          <div className="w-[25%]">
            <SearchBar
              width="w-full"
              onSearch={(value) => setSearchQuery(value)}
            />
          </div>
        </div>

        <div className="flex gap-10 justify-between items-center py-8 px-5">
          <div className="flex gap-4">
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              className="text-MainOffWhiteText font-inter text-sm"
            >
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              Select All
            </label>
            <div className="h-4 w-0.5 bg-LineBox"></div>
            <h1 className="text-MainOffWhiteText font-inter text-sm">
              {filteredGuests.length} people
            </h1>
          </div>
          <div className="flex gap-8">
            <h1 className="text-MainOffWhiteText font-inter text-sm">
              SORT BY :
            </h1>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="bg-transparent text-MainBlue font-inter text-sm rounded-md outline-none cursor-pointer focus:border-MainOffWhiteText"
            >
              <option value="">Oldest First</option>
              <option value="newest">Newest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
            </select>
          </div>
        </div>

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
            <GuestBox
              key={user._id || user.guestEmail}
              name={user.guestName}
              email={user.guestEmail}
              joinedTime={timeAgo(user.updatedAt)}
              positionNum={user.waitlistPosition}
              checked={selectedGuests.includes(user._id)}
              onCheck={() => handleSelectGuest(user._id)}
            />
          ))
        )}
      </div>

      {/* Right sidebar - unchanged */}
      <div className="flex flex-row gap-5 sticky top-0 ">
        <div className="flex flex-col justify-baseline gap-5">
          <div className="flex flex-col gap-5">
            <div>
              <StatCard
                label="Capacity left"
                value={eventInfo?.event?.capacity}
                color="blue"
                icon={Users}
              >
                <StatBar current={250} total={500} />
              </StatCard>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-MainOffWhiteText font-inter text-sm">
                Quick Actions
              </h1>
              <div>
                <CustomButton
                  type="submit"
                  title={`Move to Confirm (${selectedGuests.length})`}
                  icon={CircleCheck}
                  onClick={handleMoveToConfirmed}
                  className="bg-MainBlue px-8 py-4 text-sm text-white rounded-lg w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full justify-between border-dotted items-center rounded-lg bg-MainBlueBackground border-LineBox border-2 py-4 px-5 gap-5">
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-3">
                <h1 className="text-MainOffWhiteText font-inter uppercase font-medium text-sm">
                  Recent Activity
                </h1>
                <div className="flex gap-2 pl-3">
                  <Check className="text-MainGreen" size={20} strokeWidth={2} />
                  <h1 className="text-white font-inter font-normal text-sm">
                    John Doe was moved to confirmed.
                  </h1>
                </div>
                <div className="flex gap-2 pl-3">
                  <Mail
                    className="text-MainOffWhiteText"
                    size={20}
                    strokeWidth={2}
                  />
                  <h1 className="text-MainOffWhiteText font-inter font-normal text-sm">
                    Waitlist invitation sent to 12 people.
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageWaitlist;
