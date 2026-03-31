import React from "react";
import ColorMap from "./ColorMap";

const CustomButton = ({
  title,
  icon: Icon,
  color = "blue",
  iconPosition = "LEFT", // "LEFT" or "RIGHT"
  hasBorder = false,
  onClick = () => {},
  width = "w-fit",
  height = "h-fit",
  px = "px-6",
  py = "py-3",
}) => {
  const selectedColor = color.toLowerCase();
  const theme = ColorMap[selectedColor] || ColorMap.blue;
  // Determine if we need to flip the order based on iconPosition
  const isRight = iconPosition.toUpperCase() === "RIGHT";

  return (
    <button
      onClick={onClick}
      className={`
        ${width} ${height} ${px} ${py}
        rounded-xl flex items-center justify-center gap-2 
        transition-all duration-200 cursor-pointer
        font-inter font-semibold text-sm
        /* Flex Direction Logic */
        ${isRight ? "flex-row-reverse" : "flex-row"}
        /* Theme Colors */
        ${theme.bg} 
        ${theme.text} 
        ${hasBorder ? `border-2 ${theme.border}` : "border-2 border-transparent"}
        /* Interaction States */
        hover:brightness-110 hover:shadow-lg
        active:scale-[0.98] active:brightness-90
      `}
    >
      {/* Icon - Rendered only once */}
      {Icon &&
        (typeof Icon === "string" ? (
          <img src={Icon} alt="" className="w-5 h-5 object-contain" />
        ) : (
          <Icon size={20} strokeWidth={2} />
        ))}

      {/* Title - Rendered only once */}
      <span>{title}</span>
    </button>
  );
};

export default CustomButton;
