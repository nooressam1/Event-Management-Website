const LivePulse = ({ checkedIn = 0, total = 0 }) => {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const safePct = total > 0 ? Math.min(checkedIn / total, 1) : 0;
  const offset = circumference - safePct * circumference;
  const remaining = Math.max((total ?? 0) - checkedIn, 0);

  return (
    <div className="flex flex-col items-center gap-6 bg-NavigationBackground rounded-2xl px-6 py-8 w-full">
      <h2 className="text-white font-jakarta font-medium text-lg">Live Pulse</h2>

      {/* Ring */}
      <div className="relative w-40 h-40">
        <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#0E1E33" strokeWidth="14" />
          {/* Progress */}
          <circle
            cx="80" cy="80" r={radius} fill="none"
            stroke="#1978E5"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-4xl font-bold leading-none">{checkedIn}</span>
          <span className="text-SecondOffWhiteText text-xs font-semibold tracking-wide mt-1">
            OF {total ?? "—"}
          </span>
        </div>
      </div>

      <p className="text-MainOffWhiteText text-sm font-medium tracking-wide">
        Attendees Checked In
      </p>

      {/* Stats */}
      <div className="w-full flex items-center justify-center">
        <div className="flex flex-col items-center justify-center px-6 gap-1 bg-MainBlueBackground rounded-xl py-3">
          <span className="text-white text-2xl font-bold">{remaining}</span>
          <span className="text-SecondOffWhiteText text-[10px] font-semibold uppercase tracking-widest">
            Remaining
          </span>
        </div>
      </div>
    </div>
  );
};

export default LivePulse;
