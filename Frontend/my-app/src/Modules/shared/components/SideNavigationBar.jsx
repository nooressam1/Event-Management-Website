import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";
import MyEventIcon from "../../../assets/MyEventIcon.png";
import pfpExample from "../../../assets/pfpExample.png";
import SideBarBox from "./SideBarBox";
import { useAuth } from "../../auth/context/AuthContext";
import { Globe, Menu, X, LogOut, ChevronUp } from "lucide-react";

const NAV_ITEMS = [
  { title: "My Events", image: MyEventIcon, path: "/myevents" },
];

const SideNavigationBar = ({ activeItem = "My Events" }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-NavigationBackground border-b border-LineBox w-full shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <span className="text-white font-jakarta font-bold text-sm">{activeItem}</span>
        </div>
        <div className="w-8 h-8 rounded-lg overflow-hidden cursor-pointer">
          <img className="h-full w-full object-cover" src={user?.profileImage ?? pfpExample} alt="Profile" />
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[57px] left-0 right-0 z-50 bg-NavigationBackground border-b border-LineBox px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <SideBarBox
              key={item.title}
              title={item.title}
              image={item.image}
              isActive={activeItem === item.title}
              onClick={() => { setMobileMenuOpen(false); navigate(item.path); }}
            />
          ))}
          <SideBarBox
            title="Explore"
            Icon={Globe}
            isActive={activeItem === "Explore"}
            onClick={() => { setMobileMenuOpen(false); navigate("/"); }}
          />
          <div className="border-t border-LineBox mt-2 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-MainOffWhiteText hover:text-MainRed transition-colors"
            >
              <LogOut size={13} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP */}
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
              onClick={() => navigate(item.path)}
            />
          ))}
          <div className="mt-4 pt-4 border-t border-LineBox">
            <h4 className="text-[10px] text-SecondOffWhiteText font-jakarta font-bold px-3 mb-2">
              DISCOVER
            </h4>
            <SideBarBox
              title="Explore"
              Icon={Globe}
              isActive={activeItem === "Explore"}
              onClick={() => navigate("/")}
            />
          </div>
        </nav>

        {/* Profile with logout dropdown */}
        <div className="relative border-t border-LineBox">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-3 w-full px-5 py-4 hover:bg-MainBlue/10 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
              <img className="h-full w-full object-cover" src={user?.profileImage ?? pfpExample} alt="Profile" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 text-left">
              <span className="text-white font-jakarta font-bold text-xs leading-tight truncate">
                {user?.name ?? "User"}
              </span>
              <span className="text-SecondOffWhiteText font-jakarta text-[10px]">
                Event Organizer
              </span>
            </div>
            <ChevronUp
              size={13}
              className={`text-SecondOffWhiteText shrink-0 transition-transform ${profileOpen ? "" : "rotate-180"}`}
            />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute bottom-full left-2 right-2 z-20 mb-1 bg-NavigationBackground border border-LineBox rounded-xl overflow-hidden shadow-xl">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-MainOffWhiteText hover:bg-MainBackground hover:text-MainRed transition-colors"
                >
                  <LogOut size={13} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SideNavigationBar;
