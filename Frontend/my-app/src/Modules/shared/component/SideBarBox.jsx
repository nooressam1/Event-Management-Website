import React from "react";

const SideBarBox = ({ title, image }) => {
  return (
    <div className="w-full flex gap-3 py-3 cursor-pointer px-3 items-center rounded-lg hover:bg-MainBlue/10">
      <div className="w-5  shrink-0">
        <img className="h-full w-full object-cover" src={image} alt={title} />
      </div>

      <h4 className="text-sm text-MainOffWhiteText font-jakarta font-semibold hidden sm:block">
        {title}
      </h4>
    </div>
  );
};

export default SideBarBox;
