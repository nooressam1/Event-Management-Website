import React from "react";
const CustomButton = ({
  bgColor,
  textColor,
  title,
  icon,
  iconPosition = "LEFT", // "left" or "right"
  hasBorder,
  borderColor,
  onClick,
}) => {
  // when using the button make sure to wrap it in the div and the button will take the height and width of the div
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border: hasBorder ? `1px solid ${borderColor}` : "none",
      }}
      className=" h-full w-full px-4 py-2 rounded flex items-center gap-2 transition hover:opacity-80"
    >
      {/* LEFT ICON */}
      {icon && iconPosition === "LEFT" && (
        <img src={icon} alt="icon" className="w-4 h-4" />
      )}

      <span>{title}</span>

      {/* RIGHT ICON */}
      {icon && iconPosition === "RIGHT" && (
        <img src={icon} alt="icon" className="w-4 h-4" />
      )}
    </button>
  );
};

export default CustomButton;
