import React, { useRef } from "react";
import { Search, SlidersHorizontal, Download, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_BADGE = {
  ATTENDING: { label: "Confirmed", style: "bg-MainGreenBackground text-MainGreen" },
  WAITLISTED: { label: "Waitlisted", style: "bg-MainYellowBackground text-MainYellow" },
  DECLINED: { label: "Declined", style: "bg-OffRedbackground text-MainRed" },
};

const FILTER_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "ATTENDING", label: "Confirmed" },
  { value: "WAITLISTED", label: "Waitlisted" },
  { value: "DECLINED", label: "Declined" },
];

// Simple avatar from initials
const Avatar = ({ name }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <div className="w-8 h-8 rounded-full bg-MainBlue/20 flex items-center justify-center shrink-0">
      <span className="text-MainBlue text-xs font-bold">{initials}</span>
    </div>
  );
};

const AttendeeTable = ({
  attendees,
  pagination,
  loading,
  search,
  statusFilter,
  currentPage,
  onSearchChange,
  onStatusFilterChange,
  onPageChange,
  onExport,
}) => {
  const searchRef = useRef();

  const { total = 0, page = 1, limit = 10, pages = 1 } = pagination;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl overflow-hidden">
      {/* Table header / controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-5 py-4 border-b border-LineBox">
        <h2 className="text-white font-jakarta font-semibold text-base shrink-0">
          Attendee List
        </h2>

        <div className="flex items-center gap-2 flex-1 max-w-lg w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-SecondOffWhiteText pointer-events-none"
            />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search attendees..."
              className="w-full bg-MainBackground border border-LineBox rounded-lg pl-8 pr-3 py-2 text-white text-sm placeholder-SecondOffWhiteText focus:outline-none focus:border-MainBlue transition-colors"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <SlidersHorizontal
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-SecondOffWhiteText pointer-events-none"
            />
            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              className="appearance-none bg-MainBackground border border-LineBox rounded-lg pl-8 pr-6 py-2 text-white text-sm focus:outline-none focus:border-MainBlue transition-colors cursor-pointer"
            >
              {FILTER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-2 bg-MainBackground border border-LineBox hover:border-MainBlue/50 text-MainOffWhiteText hover:text-white px-4 py-2 rounded-lg text-sm transition-colors shrink-0"
        >
          <Download size={14} />
          Export List
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "36%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "22%" }} />
            <col style={{ width: "8%" }} />
          </colgroup>
          <thead>
            <tr className="border-b border-LineBox">
              {["Attendee", "Status", "Plus One", "Notes", ""].map((h) => (
                <th
                  key={h}
                  className="text-left px-3 py-3 text-[10px] uppercase tracking-widest font-bold text-SecondOffWhiteText"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-LineBox last:border-0">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j} className="px-3 py-4">
                      <div className="h-4 bg-LineBox rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : attendees.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-SecondOffWhiteText text-sm">
                  No attendees found.
                </td>
              </tr>
            ) : (
              attendees.map((a) => {
                const badge = STATUS_BADGE[a.status] ?? STATUS_BADGE.ATTENDING;
                return (
                  <tr
                    key={a._id}
                    className="border-b border-LineBox last:border-0 hover:bg-LineBox/30 transition-colors"
                  >
                    {/* Attendee */}
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar name={a.guestName} />
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{a.guestName}</p>
                          <p className="text-SecondOffWhiteText text-xs truncate">{a.guestEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${badge.style}`}>
                        {badge.label}
                      </span>
                    </td>

                    {/* Plus one */}
                    <td className="px-3 py-3 text-sm text-MainOffWhiteText truncate">
                      {a.plusOne ? a.plusOne.name : <span className="text-SecondOffWhiteText">—</span>}
                    </td>

                    {/* Notes */}
                    <td className="px-3 py-3 text-sm text-MainOffWhiteText">
                      <span className="truncate block">
                        {a.additional_notes || <span className="text-SecondOffWhiteText">—</span>}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <button className="w-7 h-7 rounded-lg hover:bg-LineBox flex items-center justify-center transition-colors text-SecondOffWhiteText hover:text-white">
                        <MoreHorizontal size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-LineBox">
        <p className="text-SecondOffWhiteText text-xs">
          {total === 0
            ? "No attendees"
            : `Showing ${from}–${to} of ${total.toLocaleString()} attendees`}
        </p>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-7 h-7 rounded-lg border border-LineBox flex items-center justify-center text-SecondOffWhiteText hover:text-white hover:border-MainBlue/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={13} />
          </button>

          {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
            // Show pages around current
            let p;
            if (pages <= 5) p = i + 1;
            else if (currentPage <= 3) p = i + 1;
            else if (currentPage >= pages - 2) p = pages - 4 + i;
            else p = currentPage - 2 + i;

            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                  p === currentPage
                    ? "bg-MainBlue text-white"
                    : "border border-LineBox text-SecondOffWhiteText hover:text-white hover:border-MainBlue/50"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= pages}
            className="w-7 h-7 rounded-lg border border-LineBox flex items-center justify-center text-SecondOffWhiteText hover:text-white hover:border-MainBlue/50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttendeeTable;
