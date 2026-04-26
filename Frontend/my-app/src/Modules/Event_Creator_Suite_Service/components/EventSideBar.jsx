import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, ScanLine, BarChart3, Play, CheckCircle, LogOut, ChevronUp, Menu, X } from "lucide-react";
import { useAuth } from "../../auth/context/AuthContext";
import Logo from "../../shared/components/Logo";
import pfpExample from "../../../assets/pfpExample.png";

const STATUS_BADGE = {
  PUBLISHED: { label: "LIVE",      style: "bg-MainGreenBackground text-MainGreen" },
  DRAFT:     { label: "DRAFT",     style: "bg-MainBlueBackground text-MainBlue" },
  COMPLETED: { label: "PAST",      style: "bg-LineBox text-MainOffWhiteText" },
  CANCELLED: { label: "CANCELLED", style: "bg-OffRedbackground text-MainRed" },
};

const NavLink = ({ icon: Icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-jakarta font-semibold transition-colors border-l-2 ${
      active
        ? "bg-MainBlue/15 border-MainBlue text-white"
        : "border-transparent text-MainOffWhiteText hover:bg-MainBlue/10 hover:text-white"
    }`}
  >
    <Icon size={16} className="shrink-0" />
    {label}
  </button>
);

const EventSideBar = ({
  event,
  activeItem = "Overview",
  starting = false,
  settingStatus = false,
  onStartEvent,
  onSetStatus,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const id = event?._id;
  const isDraft     = event?.status === "DRAFT";
  const isLive      = event?.status === "PUBLISHED";
  const isCompleted = event?.status === "COMPLETED";
  const statusInfo  = STATUS_BADGE[event?.status] ?? STATUS_BADGE.DRAFT;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navLinks = (
    <>
      <NavLink icon={LayoutDashboard} label="Overview"         active={activeItem === "Overview"}   onClick={() => { navigate(`/events/${id}`); setMobileOpen(false); }} />
      <NavLink icon={Users}           label="Manage Attendees" active={activeItem === "Attendees"}  onClick={() => { navigate(`/dashboard/${id}`); setMobileOpen(false); }} />
      {isLive && (
        <NavLink icon={ScanLine} label="Check-In" active={activeItem === "Check-In"} onClick={() => { navigate(`/checkin/${id}`); setMobileOpen(false); }} />
      )}
      {isCompleted && (
        <NavLink icon={BarChart3} label="Analytics" active={activeItem === "Analytics"} onClick={() => { navigate(`/events/${id}/analytics`); setMobileOpen(false); }} />
      )}
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-NavigationBackground border-b border-LineBox w-full shrink-0">
        <button onClick={() => navigate("/myevents")}>
          <Logo />
        </button>
        <span className="text-white font-jakarta font-bold text-sm truncate mx-3 flex-1 text-center">
          {event?.title ?? activeItem}
        </span>
        <button onClick={() => setMobileOpen((v) => !v)} className="text-white shrink-0">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[57px] left-0 right-0 z-50 bg-NavigationBackground border-b border-LineBox px-3 py-4 flex flex-col gap-1">
          {navLinks}
          {(isDraft || isLive) && (
            <div className="mt-3 pt-3 border-t border-LineBox">
              {isDraft && (
                <button onClick={() => { onStartEvent?.(); setMobileOpen(false); }} disabled={starting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-MainGreen hover:bg-green-500 text-white rounded-lg text-sm font-semibold disabled:opacity-40">
                  <Play size={15} />{starting ? "Publishing..." : "Publish Event"}
                </button>
              )}
              {isLive && (
                <button onClick={() => { onSetStatus?.("COMPLETED"); setMobileOpen(false); }} disabled={settingStatus}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-MainGreen hover:bg-green-500 text-white rounded-lg text-sm font-semibold disabled:opacity-40">
                  <CheckCircle size={15} />{settingStatus ? "Updating..." : "Mark as Completed"}
                </button>
              )}
            </div>
          )}
          <div className="mt-2 pt-2 border-t border-LineBox">
            <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-MainOffWhiteText hover:text-MainRed transition-colors">
              <LogOut size={13} />Logout
            </button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen w-64 bg-NavigationBackground border-r border-LineBox flex-col shrink-0">
        <button onClick={() => navigate("/myevents")} className="w-full text-left">
          <Logo />
        </button>

        <div className="px-5 py-3 border-b border-LineBox">
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${statusInfo.style}`}>
            {statusInfo.label}
          </span>
          <p className="text-white font-jakarta font-bold text-sm mt-1.5 leading-snug line-clamp-2">
            {event?.title ?? "Event"}
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          <h4 className="text-[10px] text-SecondOffWhiteText font-jakarta font-bold px-3 mb-2">EVENT</h4>
          {navLinks}
          {(isDraft || isLive) && (
            <div className="mt-4 pt-4 border-t border-LineBox">
              {isDraft && (
                <button onClick={onStartEvent} disabled={starting}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-MainGreen hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40">
                  <Play size={15} />{starting ? "Publishing..." : "Publish Event"}
                </button>
              )}
              {isLive && (
                <button onClick={() => onSetStatus("COMPLETED")} disabled={settingStatus}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-MainGreen hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40">
                  <CheckCircle size={15} />{settingStatus ? "Updating..." : "Mark as Completed"}
                </button>
              )}
            </div>
          )}
        </nav>

        <div className="relative border-t border-LineBox">
          <button onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-3 w-full px-5 py-4 hover:bg-MainBlue/10 transition-colors">
            <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
              <img className="h-full w-full object-cover" src={user?.profileImage ?? pfpExample} alt="Profile" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 text-left">
              <span className="text-white font-jakarta font-bold text-xs leading-tight truncate">{user?.name ?? "User"}</span>
              <span className="text-SecondOffWhiteText font-jakarta text-[10px]">Event Organizer</span>
            </div>
            <ChevronUp size={13} className={`text-SecondOffWhiteText shrink-0 transition-transform ${profileOpen ? "" : "rotate-180"}`} />
          </button>
          {profileOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
              <div className="absolute bottom-full left-2 right-2 z-20 mb-1 bg-NavigationBackground border border-LineBox rounded-xl overflow-hidden shadow-xl">
                <button onClick={handleLogout} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-MainOffWhiteText hover:bg-MainBackground hover:text-MainRed transition-colors">
                  <LogOut size={13} />Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default EventSideBar;
