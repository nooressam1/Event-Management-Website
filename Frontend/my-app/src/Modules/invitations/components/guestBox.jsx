import React from "react";
import pfp from "../../../assets/pfp.png";
import { Trash } from "lucide-react";

const GuestBox = ({
  name,
  email,
  image,
  joinedTime,
  positionNum,
  checked,
  onCheck,
  onDelete,
}) => {
  return (
    <div className="flex mb-3 flex-col sm:flex-row w-full justify-between sm:items-center rounded-lg bg-MainBlueBackground border-LineBox border-2 py-4 px-5 gap-3 sm:gap-5">
      {/* Left side */}
      <div className="flex flex-row gap-3 sm:gap-5 items-center min-w-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={onCheck}
          className="shrink-0"
        />
        <div className="flex w-10 h-10 sm:w-12 sm:h-12 rounded-sm shrink-0">
          <img src={image || pfp} className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-white font-inter capitalize font-semibold text-sm sm:text-md truncate">
            {name}
          </h1>
          <p className="text-MainOffWhiteText font-inter font-normal text-xs sm:text-sm truncate">
            <span className="uppercase">{email}</span>
            <span className="capitalize normal-case">
              {" "}
              • Joined {joinedTime}
            </span>
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-row gap-3 sm:gap-4 items-center sm:ml-auto shrink-0 pl-[calc(40px+12px+12px)] sm:pl-0">
        <Trash
          size={18}
          className="text-MainOffWhiteText cursor-pointer hover:text-red-400 transition-colors shrink-0"
          strokeWidth={2}
          onClick={onDelete}
        />
      </div>
    </div>
  );
};

export default GuestBox;
