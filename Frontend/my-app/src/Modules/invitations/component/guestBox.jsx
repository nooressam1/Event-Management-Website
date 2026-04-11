import React from "react";
import pfp from "../../../assets/pfp.png";
import { Trash } from "lucide-react";
const GuestBox = ({ name, email, image, joinedTime, placeholdervalue }) => {
  return (
    <div className="flex  flex-row w-full justify-between items-center rounded-lg bg-MainBlueBackground border-LineBox border-2 py-4 px-5 gap-5">
      <div className="flex flex-row gap-5">
        {" "}
        <input type="checkbox" checked={""} onChange={""} />
        <div className="flex w-12 h-12 rounded-sm">
          <img src={image || pfp} className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className=" text-white  font-inter capitalize font-semibold text-md">
            {email}
          </h1>
          <div className="flex flex-row">
            <h1 className=" text-MainOffWhiteText uppercase font-inter font-normal text-sm">
              {name}
            </h1>
            <h1 className=" text-MainOffWhiteText capitilize font-inter font-normal text-sm">
              • Joined {joinedTime} ago
            </h1>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 items-center">
        <div
          className={`border-1 rounded-3xl px-4 py-1.5 w-fit h-fit shrink-0 border-MainGreenLine text-MainGreen bg-MainGreenBackground`}
        >
          <p className="font-inter font-medium text-sm">Position #1</p>
        </div>

        <Trash size={22} className="text-MainOffWhiteText" strokeWidth={2} />
      </div>
    </div>
  );
};

export default GuestBox;
