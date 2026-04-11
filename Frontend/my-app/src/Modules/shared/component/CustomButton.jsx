const CustomButton = ({
  title,
  icon: Icon,
  iconPosition = "LEFT",
  onClick,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-4 py-2 rounded inline-flex items-center justify-center gap-2 transition
        hover:opacity-80
        ${className}
      `}
    >
      {Icon && iconPosition === "LEFT" && <Icon size={18} className="shrink-0" />}

      <span className="font-medium leading-none">{title}</span>

      {Icon && iconPosition === "RIGHT" && <Icon size={18} className="shrink-0" />}
    </button>
  );
};

export default CustomButton;
