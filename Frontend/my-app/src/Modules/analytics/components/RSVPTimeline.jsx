const RSVPTimeline = ({ timeline = [] }) => {
  const max = timeline.reduce((m, t) => Math.max(m, t.count), 0);
  const total = timeline.reduce((s, t) => s + t.count, 0);
  const chartHeight = 140;

  const nonEmpty = timeline.filter((t) => t.count > 0);
  const peakBucket = nonEmpty.reduce(
    (p, t) => (t.count > (p?.count ?? -1) ? t : p),
    null,
  );

  const labelEvery = timeline.length > 10 ? 2 : 1;

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-jakarta font-bold text-sm">
          RSVP Response Timeline
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-MainBlue bg-MainBlueBackground uppercase tracking-widest">
          Last 14 days · {total} RSVPs
        </span>
      </div>

      {nonEmpty.length === 0 ? (
        <p className="text-SecondOffWhiteText text-xs text-center py-10">
          No RSVPs were recorded in the 14 days before this event.
        </p>
      ) : (
        <>
          <div
            className="flex items-end gap-1.5 px-2"
            style={{ minHeight: chartHeight }}
          >
            {timeline.map((t, idx) => {
              const h = max > 0 ? (t.count / max) * chartHeight : 0;
              const isPeak = peakBucket && t.label === peakBucket.label && t.count > 0;
              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-1 group"
                >
                  <span className="text-[10px] text-SecondOffWhiteText opacity-0 group-hover:opacity-100 transition-opacity">
                    {t.count}
                  </span>
                  <div
                    className={`w-full rounded-t transition-all duration-500 ${
                      isPeak ? "bg-MainBlue" : "bg-MainBlue/40"
                    }`}
                    style={{ height: `${h}px`, minHeight: t.count > 0 ? 3 : 0 }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-end gap-1.5 px-2 mt-2">
            {timeline.map((t, idx) => (
              <span
                key={idx}
                className="flex-1 text-center text-[9px] text-SecondOffWhiteText truncate"
              >
                {idx % labelEvery === 0 ? t.label : ""}
              </span>
            ))}
          </div>
        </>
      )}

      <p className="text-[11px] text-SecondOffWhiteText mt-4 pt-3 border-t border-LineBox">
        ⓘ Shows when guests RSVPd in the 14 days leading up to the event.
      </p>
    </div>
  );
};

export default RSVPTimeline;
