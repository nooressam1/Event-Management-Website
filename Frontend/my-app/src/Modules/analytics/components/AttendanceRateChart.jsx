const AttendanceRateChart = ({ attended, noShow, attendanceRate }) => {
  const total = attended + noShow;
  const circumference = 2 * Math.PI * 45;
  const attendedOffset =
    circumference - (attended / total) * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div className="relative w-40 h-40">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={attendedOffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-MainBlue">{attendanceRate}%</div>
          <div className="text-gray-400 text-xs uppercase">Showed Up</div>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-MainBlue"></div>
            <span className="text-gray-300 text-sm">Attended</span>
          </div>
          <span className="text-white font-bold">{attended}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-600"></div>
            <span className="text-gray-300 text-sm">No-show</span>
          </div>
          <span className="text-white font-bold">{noShow}</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRateChart;
