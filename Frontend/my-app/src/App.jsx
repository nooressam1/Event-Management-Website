import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthTemp from "./Modules/auth/pages/AuthTemp";
import InvitationPage from "./Modules/rsvp/pages/invitationPage";
import SideNavigationBar from "./Modules/shared/component/SideNavigationBar";
import Footer from "./Modules/shared/component/Footer";
import LabeledInput from "./Modules/shared/component/LabeledInput";
import StatCard from "./Modules/shared/component/StatCard";
import StatsWrapper from "./Modules/shared/component/StatWrapper";
import StatBar from "./Modules/shared/component/StatBar";
import StatPercentage from "./Modules/shared/component/StatPercentage";
import SearchBar from "./Modules/shared/component/SearchBar";
import { User, CheckCircle, Users, Hourglass } from "lucide-react";
import { Outlet } from "react-router-dom";
import ManageWaitlist from "./Modules/invitations/pages/manageWaitlist";
import EventHubIcon from "../src/assets/EventHubIcon.png";

// Guest layout - with header
const GuestLayout = () => {
  return (
    <div className="h-screen w-full bg-MainBackground font-inter text-white">
      <div className="w-full h-fit bg-MainBlueBackground p-5">
        <div className="flex gap-3">
          <div className="w-6 h-6">
            <img
              className="h-full w-full object-contain"
              src={EventHubIcon}
              alt="EventHub Logo"
            />
          </div>
          <h1 className="hidden sm:block text-white font-jakarta font-black text-lg">
            EventHub
          </h1>
        </div>
      </div>
      <Outlet />
    </div>
  );
};

// User layout - with sidebar
const UserLayout = () => {
  return (
    <div className="h-screen w-full flex bg-MainBackground font-inter text-white overflow-hidden">
      <SideNavigationBar />
      <div className="flex-1 flex flex-col min-w-0 h-full">
        <main className="flex-1 px-8 py-5 space-y-8 overflow-y-auto custom-scrollbar">
          <Outlet /> {/* ← user pages render here */}
        </main>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<GuestLayout />}>
        <Route path="/login" element={<AuthTemp />} />
        <Route path="/signup" element={<AuthTemp />} />
        <Route path="/invitation" element={<InvitationPage />} />
      </Route>

      <Route element={<UserLayout />}>
        <Route path="/dashboard" element={<ManageWaitlist />} />
        {/* add more user routes here */}
      </Route>
    </Routes>
  );
}

export default App;
