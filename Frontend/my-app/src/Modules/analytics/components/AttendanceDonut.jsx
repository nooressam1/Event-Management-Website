const RADIUS = 70;
const STROKE = 14;
const CIRC = 2 * Math.PI * RADIUS;

const AttendanceDonut = ({ summary = {} }) => {
  const { checkIns = 0, noShows = 0, confirmed = 0, attendanceRate = 0 } = summary;
  const total = checkIns + noShows || confirmed || 1;
  const attendedFrac = Math.min(checkIns / total, 1);
  const dashArc = CIRC * attendedFrac;

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl p-5 flex flex-col">
      <h3 className="text-white font-jakarta font-bold text-sm mb-4">
        Attendance Rate
      </h3>

      <div className="flex-1 flex items-center justify-center py-4">
        <div className="relative w-[180px] h-[180px]">
          <svg width="180" height="180" className="-rotate-90">
            <circle
              cx="90"
              cy="90"
              r={RADIUS}
              stroke="#1E293B"
              strokeWidth={STROKE}
              fill="none"
            />
            <circle
              cx="90"
              cy="90"
              r={RADIUS}
              stroke="#1978E5"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${dashArc} ${CIRC - dashArc}`}
              strokeLinecap="round"
              className="transition-all duration-700"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-MainBlue text-3xl font-jakarta font-bold">
              {attendanceRate}%
            </span>
            <span className="text-SecondOffWhiteText text-[10px] uppercase tracking-widest mt-1">
              Attended
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 pt-4 border-t border-LineBox">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-MainBlue" />
            <span className="text-MainOffWhiteText">Attended</span>
          </div>
          <span className="text-white font-jakarta font-bold">{checkIns}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-SecondOffWhiteText" />
            <span className="text-MainOffWhiteText">No-show</span>
          </div>
          <span className="text-white font-jakarta font-bold">{noShows}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDonut;
