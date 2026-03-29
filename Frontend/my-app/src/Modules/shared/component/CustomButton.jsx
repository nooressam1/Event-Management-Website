import React from "react";
import ColorMap from "./ColorMap"; // Adjust the path as needed

const CustomButton = ({
  title,
  icon,
  className = "",

  iconPosition = "LEFT",
  hasBorder = false,
  onClick,
}) => {
  // Normalize the color string and get the theme from the map
  const selectedColor = color.toLowerCase();
  const theme = ColorMap[selectedColor] || ColorMap.blue;

  return (
    <button
      onClick={onClick}
      className={`
        h-full w-full px-4 py-2 rounded flex items-center justify-center gap-2 transition 
        ${theme.bg} 
        ${theme.text} 
        ${hasBorder ? `border ${theme.border}` : "border-transparent"}
        hover:opacity-80
      `}
    >
      {/* LEFT ICON */}
      {icon && iconPosition === "LEFT" && (
        <img src={icon} alt="icon" className="w-4 h-4" />
      )}

      <span className="font-medium">{title}</span>

      {/* RIGHT ICON */}
      {icon && iconPosition === "RIGHT" && (
        <img src={icon} alt="icon" className="w-4 h-4" />
      )}
    </button>
  );
};

export default CustomButton;
