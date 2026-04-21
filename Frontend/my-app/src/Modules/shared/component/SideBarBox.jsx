import React from "react";

const SideBarBox = ({ title, image, isActive = false }) => {
  return (
    <div
      className={`w-full flex gap-3 py-3 cursor-pointer px-3 items-center rounded-lg transition-colors ${
        isActive
          ? "bg-MainBlue/15 border-l-2 border-MainBlue"
          : "hover:bg-MainBlue/10 border-l-2 border-transparent"
      }`}
    >
      <div className="w-5 shrink-0">
        <img className="h-full w-full object-cover" src={image} alt={title} />
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
