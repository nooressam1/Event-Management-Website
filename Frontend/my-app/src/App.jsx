import "./App.css";
import { Route, Routes } from "react-router-dom";
import AuthTemp from "./Modules/auth/pages/AuthTemp";
import AnalyticsPage from "./Modules/analytics/pages/AnalyticsPage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthTemp />} />
      <Route path="/signup" element={<AuthTemp />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
    </Routes>
  );
}

export default App;
