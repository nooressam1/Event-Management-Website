import "./App.css";
import { Route, Routes, Outlet, useNavigate } from "react-router-dom";
import AuthPage from "./Modules/auth/pages/AuthPage";
import InvitationPage from "./Modules/rsvp/pages/invitationPage";
import PublicEventPage from "./Modules/rsvp/pages/PublicEventPage";
import MyEvents from "./Modules/eventManagement/pages/MyEvents";
import CreateEvent from "./Modules/eventManagement/pages/CreateEvent";
import EventDashboard from "./Modules/eventManagement/pages/EventDashboard";
import CheckInPage from "./Modules/checkin/pages/checkInPage.jsx";
import ManageWaitlist from "./Modules/invitations/pages/manageAttendees";
import Homepage from "./Modules/Event_Creator_Suite_Service/pages/Homepage";
import EventAnalytics from "./Modules/analytics/pages/EventAnalytics";
import SideNavigationBar from "./Modules/shared/components/SideNavigationBar";
import Footer from "./Modules/shared/components/Footer";
import CustomButton from "./Modules/shared/components/CustomButton";
import EventHubIcon from "../src/assets/EventHubIcon.png";
import { useAuth } from "./Modules/auth/context/AuthContext";

// Guest layout — header adjusts based on auth state
const GuestLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col bg-MainBackground font-inter text-white">
      {/* Header */}
      <div className="flex justify-between items-center w-full h-fit bg-MainBlueBackground px-10 py-5 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="flex gap-3 items-center"
        >
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
        </button>
        {user ? (
          <CustomButton
            onClick={() => navigate("/myevents")}
            title="My Events"
            className="bg-MainBlue hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          />
        ) : (
          <CustomButton
            onClick={() => navigate("/login")}
            title="Login"
            className="bg-MainBlue hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
          />
        )}
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center">
        <Outlet />
      </main>

      {/* Footer */}
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
function App() {
  return (
    <Routes>
      <Route>
        {" "}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<AuthPage />} />
      </Route>
      <Route element={<GuestLayout />}>
        <Route path="/" element={<Homepage />} />
        <Route path="/invitation/:id" element={<InvitationPage />} />
        <Route path="/event/:inviteCode" element={<PublicEventPage />} />
      </Route>

      <Route path="/dashboard/:id" element={<ManageWaitlist />} />
      <Route path="/checkin/:id" element={<CheckInPage />} />
      <Route path="/myevents" element={<MyEvents />} />
      <Route path="/events/create" element={<CreateEvent />} />
      <Route path="/events/:id" element={<EventDashboard />} />
      <Route path="/events/:id/edit" element={<CreateEvent />} />
      <Route path="/events/:id/analytics" element={<EventAnalytics />} />
    </Routes>
  );
}

export default App;
