import React from "react";
import Logo from "./Logo";
import DashboardIcon from "../../../assets/DashboardIcon.png";
import MyEventIcon from "../../../assets/MyEventIcon.png";
import Attendees from "../../../assets/Attendees.png";
import Reports from "../../../assets/Reports.png";
import Bell from "../../../assets/Bell.png";
import pfpExample from "../../../assets/pfpExample.png";
import SideBarBox from "./SideBarBox";
import { useAuth } from "../../auth/utils/AuthContext";

const NAV_ITEMS = [
  { title: "Dashboard", image: DashboardIcon },
  { title: "My Events", image: MyEventIcon },
  { title: "Attendees", image: Attendees },
  { title: "Reports", image: Reports },
];

const SideNavigationBar = ({ activeItem = "My Events" }) => {
  const { user } = useAuth();

  return (
    <div className="h-screen w-16 sm:w-64 bg-NavigationBackground border-r border-LineBox flex flex-col shrink-0 transition-all duration-300">
      {/* Logo */}
      <Logo />
      {/* Nav Items */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        <h4 className="hidden sm:block text-[10px] text-SecondOffWhiteText font-jakarta font-bold px-3 mb-2">
          MAIN MENU
        </h4>
        {NAV_ITEMS.map((item) => (
          <SideBarBox
            key={item.title}
            title={item.title}
            image={item.image}
            isActive={activeItem === item.title}
          />
        ))}
      </nav>

      {/* User Profile */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-t border-LineBox">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
            <img
              className="h-full w-full object-cover"
              src={user?.profileImage ?? pfpExample}
              alt="Profile"
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-white font-jakarta font-bold text-xs leading-tight">
              {user?.name ?? "User"}
            </span>
            <span className="text-SecondOffWhiteText font-jakarta text-[10px]">
              Event Organizer
            </span>
          </div>
        </div>
        <div className="w-4 h-4 shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
          <img
            className="h-full w-full object-contain"
            src={Bell}
            alt="Notifications"
          />
        </div>
      </div>
    </div>
  );
};

export default SideNavigationBar;
