const LastMinuteChangesChart = () => {
  const data = [
    { time: "8AM", changes: 5 },
    { time: "9AM", changes: 8 },
    { time: "10AM", changes: 12 },
    { time: "12PM", changes: 18 },
    { time: "3PM", changes: 28 },
    { time: "5PM", changes: 35 },
  ];

  const maxChanges = Math.max(...data.map((d) => d.changes));
  const height = 200;
  const width = 100;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - (d.changes / maxChanges) * height;
      return `${x},${y}`;
    })
    .join(" ");

  const fillPath = `M ${points} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="flex flex-col h-full">
      <svg viewBox={`0 0 ${width} ${height + 20}`} className="w-full h-48">
        {[0, 1, 2, 3, 4].map((i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={(i / 4) * height}
            x2={width}
            y2={(i / 4) * height}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        ))}
        <path d={fillPath} fill="rgba(59, 130, 246, 0.2)" stroke="none" />
        <polyline
          points={points}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - (d.changes / maxChanges) * height;
          return (
            <circle
              key={`point-${i}`}
              cx={x}
              cy={y}
              r="2"
              fill="#3B82F6"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>
      <div className="flex justify-between text-gray-400 text-xs mt-2 px-2">
        {data.map((d, i) => (
          <span key={`label-${i}`}>{d.time}</span>
        ))}
      </div>
      <div className="text-gray-400 text-xs mt-4 px-2 border-l-2 border-MainBlue pl-3">
        <span className="text-MainBlue">↓</span> Cancellations and RSVP updates
        peak 4 hours before event start
      </div>
    </div>
  );
};

export default LastMinuteChangesChart;
