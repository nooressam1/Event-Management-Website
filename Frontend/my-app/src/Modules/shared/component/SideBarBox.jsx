import React from "react";

const SideBarBox = ({ title, image }) => {
  return (
    <div className="w-full flex gap-2 py-5 items-center  hover:bg-MainBlue/10">
      <div class=" w-4 h-4">
        <img className="h-full w-full object-fit" src={image} />
      </div>
      <h4 className="text-md text-MainOffWhiteText font-jakarta font-semibold">
        {title}
      </h4>
    </div>
  );
};

export default SideBarBox;
