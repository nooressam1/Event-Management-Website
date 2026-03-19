import React from "react";
import EventHubIcon from "../../../assets/EventHubIcon.png";
import MyEventIcon from "../../../assets/MyEventIcon.png";
import DashboardIcon from "../../../assets/DashboardIcon.png";
import Reports from "../../../assets/Reports.png";
import ManageWaitlist from "../../../assets/ManageWaitlist.png";
import Attendees from "../../../assets/Attendees.png";
import Bell from "../../../assets/Bell.png";
import pfpExample from "../../../assets/pfpExample.png";
import SideBarBox from "./SideBarBox";

const SideNavigationBar = () => {
  return (
    <div class=" h-screen w-70 bg-NavigationBackground  border-LineBox border-2 flex flex-col justify-between">
      <div class="flex  gap-2  px-7 py-5 border-b-2 border-b-LineBox">
        <div class=" w-6 h-6">
          <img className="h-full w-full object-fit" src={EventHubIcon} />
        </div>
        <h1 class="text-white font-jakarta font-black text-lg">EventHub</h1>
      </div>
      <div>
        <div className="px-7 py-5 flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h4 className="text-[10px] text-SecondOffWhiteText font-jakarta font-bold">
              MAIN MENU
            </h4>
            <SideBarBox title="My Events" image={MyEventIcon}></SideBarBox>
          </div>
          <div className="flex flex-col gap-2 ">
            <h4 className="text-[10px] text-SecondOffWhiteText font-jakarta font-bold">
              EVENT MENU
            </h4>
            <SideBarBox title="Dashboard" image={DashboardIcon}></SideBarBox>
            <SideBarBox title="Attendees" image={Attendees}></SideBarBox>
            <SideBarBox title="Reports" image={Reports}></SideBarBox>
            <SideBarBox
              title="Manage Waitlist"
              image={ManageWaitlist}
            ></SideBarBox>
          </div>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between px-7 py-5 border-t-2  border-t-LineBox">
        {" "}
        <div className="flex gap-2 items-center justify-center">
          <div class=" w-10 h-10 rounded-sm">
            <img className="h-full w-full object-fit" src={pfpExample} />
          </div>
          <div className="flex flex-col">
            <h1 class="text-white font-jakarta font-bold text-xs w-full">
              Username
            </h1>
            <h1 class="text-SecondOffWhiteText font-jakarta  text-[10px] w-full">
              EventHub
            </h1>
          </div>
        </div>
        <div class=" w-4 h-5">
          <img className="h-full w-full object-fit" src={Bell}  />
        </div>
      </div>
    </div>
  );
};

export default SideNavigationBar;
