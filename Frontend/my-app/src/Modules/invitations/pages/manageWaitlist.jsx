import React, { useState } from "react";
import SearchBar from "../../shared/component/SearchBar";
import GuestBox from "../component/guestBox";
import StatCard from "../../shared/component/StatCard";
import { Check, CircleCheck, Mail, Trash, Users } from "lucide-react";
import StatBar from "../../shared/component/StatBar";
import CustomButton from "../../shared/component/CustomButton";

const ManageWaitlist = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  return (
    <div className="flex flex-row h-full gap-6">
      <div className="flex-1">
        <div className=" flex flex-row justify-between items-center">
          <div>
            <h1 className="text-white font-jakarta font-black text-lg">
              Manage Waitlist
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
      <div className="flex flex-row gap-5">
        <div className="h-full w-0.5 bg-LineBox"></div>
        <div className="flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <div>
              <StatCard
                label="Capacity left"
                value="250 "
                color="blue"
                icon={Users}
              >
                <StatBar current={250} total={500} />
              </StatCard>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-MainOffWhiteText font-inter text-sm">
                {/* {event.title} */}
                Quick Actions
              </h1>
              <div>
                <CustomButton
                  type="submit"
                  title={`Move to Confirm (${3})`}
                  icon={CircleCheck}
                  className="bg-MainBlue px-8 py-4 text-sm text-white rounded-lg w-full"
                />
              </div>
            </div>
          </div>
          <div className="flex  flex-row w-full justify-between border-dotted items-center rounded-lg bg-MainBlueBackground border-LineBox border-2 py-4 px-5 gap-5">
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-3">
                <h1 className=" text-MainOffWhiteText  font-inter uppercase font-medium text-sm">
                  Recent Activity
                </h1>
                <div className="flex  gap-2 pl-3">
                  <Check className="text-MainGreen" size={20} strokeWidth={2} />

                  <h1 className=" text-white capitilize font-inter font-normal text-sm">
                    John Doe was moved to confirmed.
                  </h1>
                </div>
                <div className="flex  gap-2 pl-3">
                  <Mail
                    className="text-MainOffWhiteText"
                    size={20}
                    strokeWidth={2}
                  />

                  <h1 className=" text-MainOffWhiteText capitilize font-inter font-normal text-sm">
                    Waitlist invitation sent to 12 people.
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageWaitlist;
