import React from "react";
import ColorMap from "./ColorMap";
const StatCard = ({
  label,
  value,
  icon: Icon,
  color = "green",
  children,
  isAdaptive = true, // Default to your "normal" behavior
  width,
  height,
}) => {
  const selectedColor = color.toLowerCase();
  const theme = ColorMap[selectedColor] || colorMap.green;

  // Logic: If not adaptive, use provided width/height. Else, use h-full/w-full.
  const dynamicStyle = !isAdaptive
    ? {
        width: width || "300px",
        height: height || "180px",
      }
    : {};

  return (

  <div
    style={dynamicStyle}
    className={`
      ${theme.bg} ${theme.border} 
      ${isAdaptive ? "h-full w-full" : ""} 
      border rounded-2xl p-5 flex flex-col justify-between
    `}
  >
    {/* Top row - label and value side by side on mobile, stacked on md+ */}
    <div className="flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start gap-2 md:gap-0">
      <div className="flex justify-between items-center md:mb-4 w-full ">
        <span className={`${theme.text} uppercase text-[11px] font-bold tracking-widest`}>
          {label}
        </span>
        {Icon && <Icon className={`${theme.text} hidden md:block w-5 h-5`} />}
      </div>

      <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight whitespace-nowrap">
        {value}
      </h2>
    </div>

    {/* Bar always at bottom */}
    <div className="mt-3">
      {children}
    </div>
  </div>

  );
};

export default StatCard;
