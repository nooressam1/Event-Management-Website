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
      <div>
        <div className="flex justify-between items-center mb-4">
          <span
            className={`${theme.text} uppercase text-[11px] font-bold tracking-widest`}
          >
            {label}
          </span>
          {Icon && <Icon className={`${theme.text} w-5 h-5`} />}
        </div>

        <div className="space-y-1">
          <h2 className="text-white text-3xl font-bold tracking-tight">
            {value}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
