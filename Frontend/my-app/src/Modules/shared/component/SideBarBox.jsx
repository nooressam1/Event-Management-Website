import React from "react";

const SideBarBox = ({ title, image }) => {
  return (
    <div className="w-full flex gap-3 py-3 cursor-pointer px-3 items-center  rounded-lg hover:bg-MainBlue/10">
      <div className={`w-4.5 `}>
        
        <img className="h-full w-full object-cover" src={image} />
      </div>
      <h4 className="text-sm text-MainOffWhiteText font-jakarta font-semibold">
        {title}
      </h4>
    </div>
  );
};

export default SideBarBox;
