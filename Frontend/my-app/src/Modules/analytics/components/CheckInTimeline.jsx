const CheckInTimeline = ({ timeline = [] }) => {
  const max = timeline.reduce((m, t) => Math.max(m, t.count), 0);
  const total = timeline.reduce((s, t) => s + t.count, 0);
  const chartHeight = 140;

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-jakarta font-bold text-sm">
          Check-in Timeline
        </h3>
        <span className="text-[10px] uppercase tracking-widest font-bold text-SecondOffWhiteText">
          {total} check-ins
        </span>
      </div>

      {timeline.length === 0 ? (
        <p className="text-SecondOffWhiteText text-xs text-center py-10">
          No check-ins recorded for this event.
        </p>
      ) : (
        <>
          <div
            className="flex items-end gap-2 px-2"
            style={{ minHeight: chartHeight }}
          >
            {timeline.map((t, idx) => {
              const h = max > 0 ? (t.count / max) * chartHeight : 0;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <span className="text-[10px] text-SecondOffWhiteText opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.count}
                  </span>
                  <div
                    className="w-full rounded-t bg-MainGreen/60 hover:bg-MainGreen transition-all duration-500"
                    style={{ height: `${h}px`, minHeight: 4 }}
                  />
                </div>
              );
            })}
          </div>
          <div className="flex items-end gap-2 px-2 mt-2">
            {timeline.map((t, idx) => (
              <span
                key={idx}
                className="flex-1 text-center text-[10px] text-SecondOffWhiteText"
              >
                {t.label}
              </span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CheckInTimeline;
