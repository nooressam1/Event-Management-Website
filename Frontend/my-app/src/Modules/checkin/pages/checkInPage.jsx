import { useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import useCheckIn from "../../Event_Creator_Suite_Service/hooks/useCheckIn";
import EventSideBar from "../../Event_Creator_Suite_Service/components/EventSideBar";
import Footer from "../../shared/components/Footer";
import SearchBar from "../../shared/components/SearchBar";
import CheckInBoxGuest from "../components/checkInBoxGuest.jsx";
import LivePulse from "../components/livePulse";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "checkedIn", label: "Checked In" },
];

const CheckInPage = () => {
  const { id } = useParams();
  const { event, attendees, loading, togglingId, checkedInCount, handleToggle } =
    useCheckIn(id);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);

  const counts = {
    all: attendees.length,
    pending: attendees.filter((a) => !a.checkedIn).length,
    checkedIn: checkedInCount,
  };

  const filtered = attendees
    .filter((a) => {
      const q = search.toLowerCase();
      return (
        a.guestName?.toLowerCase().includes(q) ||
        a.guestEmail?.toLowerCase().includes(q)
      );
    })
    .filter((a) => {
      if (filter === "pending") return !a.checkedIn;
      if (filter === "checkedIn") return a.checkedIn;
      return true;
    });

  if (loading) {
    return (
      <div className="flex h-screen bg-MainBackground font-inter">
        <EventSideBar event={null} activeItem="Check-In" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-SecondOffWhiteText text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-MainBackground font-inter">
      <EventSideBar event={event} activeItem="Check-In" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <div className="flex flex-col md:flex-row h-full gap-6">

            {/* Left — attendee list */}
            <div className="flex-1 flex flex-col min-h-0 gap-5">
              <div>
                <h1 className="text-white font-jakarta font-black text-xl">
                  Event Day Check-In
                </h1>
                <p className="text-MainOffWhiteText font-inter text-sm mt-1">
                  {event?.title}
                </p>
              </div>

              {/* Search + filter toggle */}
              <div className="flex gap-2">
                <SearchBar width="w-full" onSearch={setSearch} />
                <button
                  onClick={() => setShowFilter((v) => !v)}
                  className="flex items-center gap-2 shrink-0 border border-LineBox bg-NavigationBackground text-MainOffWhiteText text-sm rounded-lg px-3 py-2 hover:border-MainBlue hover:text-MainBlue transition-colors"
                >
                  <span className="whitespace-nowrap">
                    {FILTERS.find((f) => f.value === filter)?.label} ({counts[filter]})
                  </span>
                  {showFilter ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              </div>

              {/* Filter dropdown */}
              {showFilter && (
                <div className="flex gap-2 flex-wrap -mt-2">
                  {FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => { setFilter(f.value); setShowFilter(false); }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        filter === f.value
                          ? "bg-MainBlue/15 border-MainBlue text-white"
                          : "border-LineBox text-MainOffWhiteText hover:border-MainBlue hover:text-white"
                      }`}
                    >
                      {f.label} ({counts[f.value]})
                    </button>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center px-1">
                <h2 className="text-white font-jakarta font-bold text-sm">
                  Attendee Directory
                </h2>
                <span className="text-SecondOffWhiteText font-inter text-xs">
                  Showing {filtered.length} of {attendees.length}
                </span>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-SecondOffWhiteText font-inter text-sm text-center py-10">
                    {search ? "No attendees match your search." : "No attendees found."}
                  </p>
                ) : (
                  filtered.map((a) => (
                    <CheckInBoxGuest
                      key={a._id}
                      id={a._id}
                      name={a.guestName}
                      status={a.checkedIn}
                      onCheckIn={() => handleToggle(a._id)}
                      disabled={togglingId === a._id}
                    />
                  ))
                )}
              </div>
            </div>

            {/* Right — live stats */}
            <div className="hidden md:flex flex-row w-[25%] gap-5 sticky top-0">
              <div className="h-full w-0.5 bg-LineBox" />
              <div className="w-full">
                <LivePulse checkedIn={checkedInCount} total={event?.capacity} />
              </div>
            </div>

          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default CheckInPage;
