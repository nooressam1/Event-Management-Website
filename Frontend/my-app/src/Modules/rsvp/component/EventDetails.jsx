import { Mail } from "lucide-react";
import React from "react";

const EventDetails = ({ title, placeholdervalue, icon: Icon = Mail }) => {
  return (
    <div className="flex  flex-row w-full rounded-lg bg-MainBlueBackground border-LineBox border-2 p-5 gap-5">
      <div className="flex justify-center items-center bg-[#122542] p-2 rounded-sm">
        <Icon size={22} className="text-MainBlue" strokeWidth={1.5} />
      </div>
      <div>
        <h1 className=" text-MainOffWhiteText uppercase font-inter font-normal text-sm">
          {title}
        </h1>
        <h1 className=" text-white  font-inter capitalize font-normal text-md">
          {placeholdervalue}
        </h1>
      </div>
    </div>
  );
};

export default EventDetails;
