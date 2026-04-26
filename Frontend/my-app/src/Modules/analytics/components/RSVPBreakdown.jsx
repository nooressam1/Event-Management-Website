const RSVPBreakdown = ({ summary = {} }) => {
  const {
    confirmed = 0,
    waitlisted = 0,
    declined = 0,
    pending = 0,
  } = summary;

  const total = confirmed + waitlisted + declined + pending || 1;

  const rows = [
    {
      key: "confirmed",
      label: "Attending",
      count: confirmed,
      color: "bg-MainGreen",
      text: "text-MainGreen",
    },
    {
      key: "waitlisted",
      label: "Waitlisted",
      count: waitlisted,
      color: "bg-MainYellow",
      text: "text-MainYellow",
    },
    {
      key: "pending",
      label: "No Response",
      count: pending,
      color: "bg-MainBlue",
      text: "text-MainBlue",
    },
    {
      key: "declined",
      label: "Declined",
      count: declined,
      color: "bg-MainRed",
      text: "text-MainRed",
    },
  ];

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl p-5">
      <h3 className="text-white font-jakarta font-bold text-sm mb-4">
        RSVP Breakdown
      </h3>

      <div className="flex h-3 rounded-full overflow-hidden mb-5 bg-MainBackground">
        {rows.map(({ key, count, color }) => {
          const pct = (count / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={key}
              className={`${color} transition-all duration-500`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {rows.map(({ key, label, count, color, text }) => (
          <div
            key={key}
            className="flex items-center justify-between bg-MainBackground border border-LineBox rounded-lg px-3 py-2"
          >
            <div className="flex items-center gap-2 min-w-0">
              <span className={`w-2 h-2 rounded-full ${color} shrink-0`} />
              <span className="text-MainOffWhiteText text-xs truncate">
                {label}
              </span>
            </div>
            <span className={`text-sm font-jakarta font-bold ${text}`}>
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RSVPBreakdown;
