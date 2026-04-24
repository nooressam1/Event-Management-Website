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
import ManageWaitlist from "./Modules/invitations/pages/manageAttendees";
import EventHubIcon from "../src/assets/EventHubIcon.png";
import CustomButton from "./Modules/shared/component/CustomButton";
import { useNavigate } from "react-router-dom";

// Guest layout with header
const GuestLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-MainBackground font-inter text-white">
      {/* Header */}
      <div className="flex justify-between items-center w-full h-fit bg-MainBlueBackground px-10 py-5">
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
        <div className="w-25">
          <CustomButton
            onClick={() => navigate("/login")}
            title="Login"
            className="bg-MainBlue text-white rounded-lg"
          />
        </div>
      </div>

      {/* Content - grows to fill space, centered */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <Outlet />
      </main>

      {/* Footer - always at bottom */}
      <Footer />
    </div>
  );
};

// User layout with sidebar
const UserLayout = () => {
  return (
    <div className="h-screen w-full flex flex-col md:flex-row bg-MainBackground font-inter text-white overflow-hidden">
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
import MyEvents from "./Modules/eventManagement/pages/MyEvents";
import CreateEvent from "./Modules/eventManagement/pages/CreateEvent";
import EventDashboard from "./Modules/eventManagement/pages/EventDashboard";

function App() {
  return (
    <Routes>
      <Route>
        {" "}
        <Route path="/login" element={<AuthTemp />} />
        <Route path="/signup" element={<AuthTemp />} />
      </Route>
      <Route element={<GuestLayout />}>
        <Route path="/invitation/:id" element={<InvitationPage />} />
      </Route>

      <Route element={<UserLayout />}>
        <Route path="/dashboard/:id" element={<ManageWaitlist />} />
        {/* add more user routes here */}
      </Route>
      <Route path="/myevents" element={<MyEvents />} />
      <Route path="/events/create" element={<CreateEvent />} />
      <Route path="/events/:id" element={<EventDashboard />} />
      <Route path="/events/:id/edit" element={<CreateEvent />} />
    </Routes>
  );
}

export default App;
