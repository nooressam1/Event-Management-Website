import React from "react";
import { Search, ArrowUpDown, Calendar } from "lucide-react";

const SORT_OPTIONS = [
  { value: "date", label: "Date (Upcoming)" },
  { value: "title", label: "Title (A–Z)" },
  { value: "attendees", label: "Attendees (Most)" },
];

const inputBase =
  "bg-NavigationBackground border border-LineBox rounded-xl text-white text-sm focus:outline-none focus:border-MainBlue transition-colors";

const EventFilters = ({
  search,
  sortBy,
  dateFrom,
  dateTo,
  onSearchChange,
  onSortChange,
  onDateFromChange,
  onDateToChange,
}) => (
  <div className="mt-6 space-y-3">
    {/* Row 1: Search + Sort */}
    <div className="flex items-center gap-3">
      <div className="relative flex-1">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-SecondOffWhiteText pointer-events-none"
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search events..."
          className={`${inputBase} w-full pl-9 pr-3 py-2.5 placeholder-SecondOffWhiteText`}
        />
      </div>

      <div className="relative shrink-0">
        <ArrowUpDown
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-SecondOffWhiteText pointer-events-none"
        />
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className={`${inputBase} appearance-none pl-8 pr-7 py-2.5 cursor-pointer`}
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>

    {/* Row 2: Date range */}
    <div className="flex items-center gap-3">
      <Calendar size={14} className="text-SecondOffWhiteText shrink-0" />
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => onDateFromChange(e.target.value)}
        className={`${inputBase} px-3 py-2 text-SecondOffWhiteText [color-scheme:dark]`}
      />
      <span className="text-SecondOffWhiteText text-xs shrink-0">to</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => onDateToChange(e.target.value)}
        className={`${inputBase} px-3 py-2 text-SecondOffWhiteText [color-scheme:dark]`}
      />
      {(dateFrom || dateTo) && (
        <button
          onClick={() => { onDateFromChange(""); onDateToChange(""); }}
          className="text-xs text-SecondOffWhiteText hover:text-MainRed transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  </div>
);

export default EventFilters;
