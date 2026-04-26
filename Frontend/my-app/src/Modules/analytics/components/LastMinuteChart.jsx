const LastMinuteChart = ({ buckets = [] }) => {
  const max = buckets.reduce((m, b) => Math.max(m, b.count), 0);
  const total = buckets.reduce((s, b) => s + b.count, 0);
  const chartHeight = 180;

  const peakBucket = buckets.reduce(
    (peak, b) => (b.count > (peak?.count ?? -1) ? b : peak),
    null,
  );

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-jakarta font-bold text-sm">
          Last-minute Changes
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-MainGreen bg-MainGreenBackground uppercase tracking-widest">
          Last 24h · {total} updates
        </span>
      </div>

      <div
        className="flex-1 flex items-end gap-2 px-2"
        style={{ minHeight: chartHeight }}
      >
        {buckets.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-SecondOffWhiteText text-xs">
              No changes in the 24 hours before the event.
            </p>
          </div>
        )}
        {buckets.map((b, idx) => {
          const h = max > 0 ? (b.count / max) * chartHeight : 0;
          const isPeak = peakBucket && b.label === peakBucket.label && b.count > 0;
          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-1 group"
            >
              <span className="text-[10px] text-SecondOffWhiteText opacity-0 group-hover:opacity-100 transition-opacity">
                {b.count}
              </span>
              <div
                className={`w-full rounded-t ${
                  isPeak ? "bg-MainBlue" : "bg-MainBlue/40"
                } transition-all duration-500`}
                style={{ height: `${h}px`, minHeight: b.count > 0 ? 4 : 0 }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex items-end gap-2 px-2 mt-2">
        {buckets.map((b, idx) => (
          <span
            key={idx}
            className="flex-1 text-center text-[10px] text-SecondOffWhiteText"
          >
            {b.label}
          </span>
        ))}
      </div>

      <p className="text-[11px] text-SecondOffWhiteText mt-4 pt-3 border-t border-LineBox">
        ⓘ Bars show RSVP updates grouped by hours before event start.
      </p>
    </div>
  );
};

export default LastMinuteChart;
