const STEPS = [
  { key: "capacity",    label: "Capacity",   color: "bg-MainBlue",   text: "text-MainBlue" },
  { key: "totalRSVPs", label: "RSVP'd",     color: "bg-MainYellow", text: "text-MainYellow" },
  { key: "confirmed",  label: "Confirmed",  color: "bg-OffRed",     text: "text-OffRed" },
  { key: "checkIns",   label: "Checked In", color: "bg-MainGreen",  text: "text-MainGreen" },
];

const ConversionFunnel = ({ summary = {}, capacity = 0 }) => {
  const values = {
    capacity,
    totalRSVPs: summary.totalRSVPs ?? 0,
    confirmed:  summary.confirmed  ?? 0,
    checkIns:   summary.checkIns   ?? 0,
  };

  const max = values.capacity || 1;

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl p-5">
      <h3 className="text-white font-jakarta font-bold text-sm mb-5">
        Conversion Funnel
      </h3>

      <div className="flex flex-col gap-3">
        {STEPS.map(({ key, label, color, text }, idx) => {
          const count = values[key];
          const prev  = idx === 0 ? max : values[STEPS[idx - 1].key] || 1;
          const pct   = Math.round((count / max) * 100);
          const dropPct = idx === 0 ? null : Math.round(((prev - count) / prev) * 100);

          return (
            <div key={key} className="flex items-center gap-4">
              {/* Label */}
              <span className="text-MainOffWhiteText text-sm w-20 shrink-0">{label}</span>

              {/* Bar */}
              <div className="flex-1 h-8 bg-MainBackground rounded-lg overflow-hidden">
                <div
                  className={`h-full ${color} rounded-lg transition-all duration-700 flex items-center px-3`}
                  style={{ width: `${Math.max((count / max) * 100, count > 0 ? 2 : 0)}%` }}
                >
                  {pct >= 12 && (
                    <span className="text-white text-xs font-jakarta font-bold">{pct}%</span>
                  )}
                </div>
              </div>

              {/* Count + drop */}
              <div className="w-28 shrink-0 flex items-center justify-between">
                <span className={`font-jakarta font-bold text-sm ${text}`}>
                  {count.toLocaleString()}
                </span>
                {dropPct !== null && dropPct > 0 && (
                  <span className="text-[10px] text-MainRed font-bold">
                    −{dropPct}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-SecondOffWhiteText mt-4 pt-3 border-t border-LineBox">
        ⓘ Shows how guests moved through each stage from capacity to actual attendance.
      </p>
    </div>
  );
};

export default ConversionFunnel;
