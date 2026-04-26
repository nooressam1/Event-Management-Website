const StatBar = ({ current, total }) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="pt-2">
      <div className="relative w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-MainBlue h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default StatBar;
