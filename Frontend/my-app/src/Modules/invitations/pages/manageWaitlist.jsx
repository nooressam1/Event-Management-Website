import React, { useState } from "react";
import SearchBar from "../../shared/component/SearchBar";
import GuestBox from "../component/guestBox";
import StatCard from "../../shared/component/StatCard";
import { Trash } from "lucide-react";

const ManageWaitlist = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="flex flex-row h-full gap-6">
      <div className="flex-1">
        <div className=" flex flex-row justify-between items-center">
          <div>
            <h1 className="text-white font-jakarta font-black text-lg">
              Location
            </h1>
            <p className="text-MainOffWhiteText font-inter text-sm">
              {/* {event.title} */}
              Tech Summit 2024 • Main Hall
            </p>
          </div>
          <div className="w-[25%]">
            <SearchBar width="w-full"></SearchBar>
          </div>
        </div>
        <div className="flex gap-10 justify-between items-center py-8 px-5">
          <div className="flex gap-4">
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
              className="text-MainOffWhiteText font-inter text-sm"
            >
              <input
                type="checkbox"
                checked={selectAll}
                onChange={(e) => setSelectAll(e.target.checked)}
              />
              Select All
            </label>
            <div className="h-4 w-0.5 bg-LineBox"></div>
            <h1 className="text-MainOffWhiteText font-inter text-sm">
              {/* {event.title} */}
              42 peole
            </h1>
          </div>
          <div className="flex gap-8">
            <h1 className="text-MainOffWhiteText font-inter text-sm">
              {/* {event.title} */}
              SORT BY :
            </h1>
            <select
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="
      bg-transparent
      text-MainBlue
      font-inter
      text-sm
      rounded-md
      outline-none
      cursor-pointer
      focus:border-MainOffWhiteText
    "
            >
              <option value="">Choose one</option>
              <option value="apple">Apple</option>
              <option value="banana">Banana</option>
              <option value="orange">Orange</option>
            </select>
          </div>
        </div>
        <GuestBox name="test" email="tgest" joinedTime="15m"></GuestBox>
      </div>
      <div>
      
        <div className="h-full w-0.5 bg-LineBox"></div>
        <div>
         
        </div>
      </div>
    </div>
  );
};

export default ManageWaitlist;
