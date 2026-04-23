import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthTemp from "./Modules/auth/pages/AuthTemp";
import MyEvents from "./Modules/eventManagement/pages/MyEvents";
import CreateEvent from "./Modules/eventManagement/pages/CreateEvent";
import EventDashboard from "./Modules/eventManagement/pages/EventDashboard";
import SuitePage from "./Modules/Event_Creator_Suite_Service/pages/SuitePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthTemp />} />
      <Route path="/signup" element={<AuthTemp />} />
      <Route path="/myevents" element={<MyEvents />} />
      <Route path="/events/create" element={<CreateEvent />} />
      <Route path="/events/:id" element={<EventDashboard />} />
      <Route path="/events/:id/edit" element={<CreateEvent />} />
      <Route path="/events/:id/suite" element={<SuitePage />} />
    </Routes>
  );
}

export default App;
