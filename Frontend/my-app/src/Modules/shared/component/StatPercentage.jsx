const StatPercentage = ({ percentage }) => {
  const isPositive = percentage.toString().startsWith("+");

  return (
    <div
      className={`flex items-center gap-1 text-sm font-medium ${
        isPositive ? "text-MainGreen" : "text-MainRed"
      }`}
    >
      <span className="text-xs">{isPositive ? "↗" : "↘"}</span>
      <span>{percentage}</span>
    </div>
  );
};

export default StatPercentage;
