import React from "react";

const LivePulse = ({ checkedIn = 145, total = 250, plusOnes = 42 }) => {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (checkedIn / total) * circumference;
  const remaining = total - checkedIn;

  return (
    <div className="flex flex-col items-center gap-6 bg-[#0d1b2e] rounded-2xl px-6 py-8 w-full">
      <h2 className="text-white font-jakarta font-medium text-lg">
        Live Pulse
      </h2>

      {/* Ring */}
      <div className="relative w-40 h-40">
        <svg
          width="160"
          height="160"
          viewBox="0 0 160 160"
          style={{ transform: "rotate(-90deg)" }}
        >
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#162233"
            strokeWidth="14"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.6s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-4xl font-bold leading-none">
            {checkedIn}
          </span>
          <span className="text-[#6b87a8] text-xs font-semibold tracking-wide mt-1">
            OF {total}
          </span>
        </div>
      </div>

      <p className="text-[#6b87a8] text-sm font-medium tracking-wide">
        Attendees Checked In
      </p>

      {/* Stats */}
      <div className="  w-full  flex items-center justify-center">
        <div className="flex flex-col items-center justify-center px-6 gap-1 bg-[#162233] rounded-xl py-3">
          <span className="text-white text-2xl font-bold">{remaining}</span>
          <span className="text-[#6b87a8] text-[10px] font-semibold uppercase tracking-widest">
            Remaining
          </span>
        </div>
      </div>
    </div>
  );
};

export default LivePulse;
