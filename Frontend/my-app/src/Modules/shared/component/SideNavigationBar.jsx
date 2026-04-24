import React, { useState } from "react";
import Logo from "./Logo";
import DashboardIcon from "../../../assets/DashboardIcon.png";
import MyEventIcon from "../../../assets/MyEventIcon.png";
import Attendees from "../../../assets/Attendees.png";
import Reports from "../../../assets/Reports.png";
import Bell from "../../../assets/Bell.png";
import pfpExample from "../../../assets/pfpExample.png";
import SideBarBox from "./SideBarBox";
import { useAuth } from "../../auth/utils/AuthContext";
import { Menu, X } from "lucide-react";

const NAV_ITEMS = [
  { title: "Dashboard", image: DashboardIcon },
  { title: "My Events", image: MyEventIcon },
  { title: "Attendees", image: Attendees },
  { title: "Reports", image: Reports },
];

const SideNavigationBar = ({ activeItem = "My Events" }) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* MOBILE TOP BAR  */}
      <div className="md:hidden  flex items-center justify-between px-4 py-3 bg-NavigationBackground border-b border-LineBox w-full shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-white"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="text-white font-jakarta font-bold text-sm">
            {activeItem}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <img src={Bell} className="w-4 h-4 opacity-70" alt="Notifications" />
          <div className="w-8 h-8 rounded-lg overflow-hidden">
            <img
              className="h-full w-full object-cover"
              src={user?.profileImage ?? pfpExample}
              alt="Profile"
            />
          </div>
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU  */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[57px] left-0 right-0 z-50 bg-NavigationBackground border-b border-LineBox px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SideBarBox
              key={item.title}
              title={item.title}
              image={item.image}
              isActive={activeItem === item.title}
              onClick={() => setMobileMenuOpen(false)}
            />
          ))}
        </div>
      )}

      {/*  DESKTOP  */}
      <div className="hidden md:flex h-screen w-64 bg-NavigationBackground border-r border-LineBox flex-col shrink-0">
        <Logo />
        <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
          <h4 className="text-[10px] text-SecondOffWhiteText font-jakarta font-bold px-3 mb-2">
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
        <div className="flex items-center justify-between px-5 py-4 border-t border-LineBox">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
              <img
                className="h-full w-full object-cover"
                src={user?.profileImage ?? pfpExample}
                alt="Profile"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-jakarta font-bold text-xs leading-tight">
                {user?.name ?? "User"}
              </span>
              <span className="text-SecondOffWhiteText font-jakarta text-[10px]">
                Event Organizer
              </span>
            </div>
          </div>
          <div className="w-4 h-4 shrink-0 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
            <img className="h-full w-full object-contain" src={Bell} alt="Notifications" />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideNavigationBar;