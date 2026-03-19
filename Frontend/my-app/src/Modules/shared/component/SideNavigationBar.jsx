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
    <div className="h-screen w-16 sm:w-70 bg-NavigationBackground border-LineBox border-2 flex flex-col justify-between transition-all duration-300">
      
      <div className="flex flex-col sm:flex-row gap-2 px-2 sm:px-7 py-5 border-b-2 border-b-LineBox items-center sm:items-start">
        <div className="w-6 h-6">
          <img className="h-full w-full object-contain" src={EventHubIcon} alt="EventHub Logo"/>
        </div>
        <h1 className="hidden sm:block text-white font-jakarta font-black text-lg">
          EventHub
        </h1>
      </div>

      <div className="px-2 sm:px-7 py-5 flex flex-col ">
        {/* MAIN MENU */}
        <div className="flex flex-col gap-2">
          <h4 className="hidden sm:block text-[10px] text-SecondOffWhiteText font-jakarta font-bold">
            MAIN MENU
          </h4>
          <SideBarBox title="My Events" image={MyEventIcon} />
        </div>

        {/* EVENT MENU */}
        <div className="flex flex-col gap-2 mt-4">
          <h4 className="hidden sm:block text-[10px] text-SecondOffWhiteText font-jakarta font-bold">
            EVENT MENU
          </h4>
          <SideBarBox title="Dashboard" image={DashboardIcon} />
          <SideBarBox title="Attendees" image={Attendees} />
          <SideBarBox title="Reports" image={Reports} />
          <SideBarBox title="Manage Waitlist" image={ManageWaitlist} />
        </div>
      </div>

      <div className="mt-auto flex flex-col sm:flex-row items-center sm:items-start justify-between px-2 sm:px-7 py-5 border-t-2 border-t-LineBox gap-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-sm">
            <img className="h-full w-full object-contain" src={pfpExample} alt="Profile" />
          </div>
          <div className="hidden sm:flex flex-col">
            <h1 className="text-white font-jakarta font-bold text-xs">Username</h1>
            <h1 className="text-SecondOffWhiteText font-jakarta text-[10px]">EventHub</h1>
          </div>
        </div>
        <div className="w-4 h-5">
          <img className="h-full w-full object-contain" src={Bell} alt="Notifications"/>
        </div>
      </div>
    </div>
  );
};

export default SideNavigationBar;