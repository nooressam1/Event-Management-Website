import React from "react";

const SideBarBox = ({ title, image, Icon, isActive = false, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`w-full flex gap-3 py-3 cursor-pointer px-3 items-center rounded-lg transition-colors ${
        isActive
          ? "bg-MainBlue/15 border-l-2 border-MainBlue"
          : "hover:bg-MainBlue/10 border-l-2 border-transparent"
      }`}
    >
      <div className="w-5 h-5 shrink-0 flex items-center justify-center">
        {Icon ? (
          <Icon
            size={16}
            className={isActive ? "text-white" : "text-MainOffWhiteText"}
          />
        ) : (
          <img className="h-full w-full object-cover" src={image} alt={title} />
        )}
      </div>
      <h4
        className={`text-sm font-jakarta font-semibold hidden sm:block ${
          isActive ? "text-white" : "text-MainOffWhiteText"
        }`}
      >
        {title}
      </h4>
    </div>
  );
};

export default SideBarBox;
