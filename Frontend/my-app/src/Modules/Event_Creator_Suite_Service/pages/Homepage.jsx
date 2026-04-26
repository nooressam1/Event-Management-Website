import React from "react";
import { Globe } from "lucide-react";
import PublicEventCard from "../components/PublicEventCard";
import HomepageFilters from "../components/HomepageFilters";
import usePublicEvents from "../hooks/usePublicEvents";

const SkeletonCard = () => (
  <div className="bg-NavigationBackground border border-LineBox rounded-xl overflow-hidden h-80 animate-pulse" />
);

const EmptyState = ({ search }) => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-14 h-14 rounded-2xl bg-MainBlueBackground border border-MainBlueLine flex items-center justify-center">
      <Globe size={26} className="text-MainBlue" strokeWidth={1.5} />
    </div>
    <div className="text-center">
      <p className="text-white font-jakarta font-semibold text-lg">
        {search ? "No events found" : "No public events yet"}
      </p>
      <p className="text-MainOffWhiteText text-sm mt-1">
        {search
          ? "Try a different search term or clear the filters."
          : "Check back soon — events will appear here once published."}
      </p>
    </div>
  </div>
);

const Homepage = () => {
  const {
    events,
    loading,
    error,
    search,
    setSearch,
    sortBy,
    setSortBy,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
  } = usePublicEvents();

  return (
    <div className="w-full px-6 sm:px-10 lg:px-20 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-jakarta font-bold text-white mb-1">
          Discover Events
        </h1>
        <p className="text-MainOffWhiteText text-sm">
          Browse upcoming public events and grab your spot.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <HomepageFilters
          search={search}
          sortBy={sortBy}
          dateFrom={dateFrom}
          dateTo={dateTo}
          onSearchChange={setSearch}
          onSortChange={setSortBy}
          onDateFromChange={setDateFrom}
          onDateToChange={setDateTo}
        />
      </div>

      {/* Error */}
      {error && (
        <p className="text-MainRed text-sm mb-6">{error}</p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)
        ) : events.length === 0 ? (
          <EmptyState search={search} />
        ) : (
          events.map((event) => (
            <PublicEventCard key={event._id} event={event} />
          ))
        )}
      </div>
    </div>
  );
};

export default Homepage;
