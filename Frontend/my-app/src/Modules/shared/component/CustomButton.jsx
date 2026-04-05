import React from "react";

const CustomButton = ({
  title,
  icon: Icon,
  iconPosition = "LEFT",
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        h-full w-full px-4 py-2 rounded flex items-center justify-center gap-2 transition
        hover:opacity-80
        ${className}
      `}
    >
      {Icon && iconPosition === "LEFT" && <Icon size={18} />}

      <span className="font-medium">{title}</span>

      {Icon && iconPosition === "RIGHT" && <Icon size={18} />}
    </button>
  );
};

export default CustomButton;