import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

// Components
import SideNavigationBar from "./Modules/shared/component/SideNavigationBar";
import CustomButton from "./Modules/shared/component/CustomButton";
import App from "./App.jsx";
import Footer from "./Modules/shared/component/Footer";
import LabeledInput from "./Modules/shared/component/LabeledInput";
import StatCard from "./Modules/shared/component/StatCard";
import StatsWrapper from "./Modules/shared/component/StatWrapper";
import StatBar from "./Modules/shared/component/StatBar";
import StatPercentage from "./Modules/shared/component/StatPercentage";
import SearchBar from "./Modules/shared/component/SearchBar";
import { BrowserRouter } from "react-router-dom";
// Assets & Icons - FIXED: Added Hourglass to the import list
import pfpExample from "../src/assets/pfpExample.png";
import { User, CheckCircle, Users, Hourglass } from "lucide-react";
import AuthTemp from "./Modules/auth/pages/AuthTemp";

const PageTemplate = () => {
  const [username, setUsername] = useState("");

  return (
    <div className="h-screen w-full flex bg-MainBackground font-inter text-white overflow-hidden">
      {/* 1. Sidebar */}
      <SideNavigationBar />

      {/* 2. Right Side Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* 3. SCROLLABLE CONTENT AREA */}
        <main className="flex-1 px-8 py-5 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="max-w-md">
            <LabeledInput
              label="Username"
              icon={User}
              text={username}
              type="text"
              setText={setUsername}
              secondayIcon={User}
            />
          </div>
          <div className="mb-6">
            <SearchBar
              placeholder="Search for confirmed cases..."
              onSearch={(val) => console.log("Current Search:", val)}
            />
          </div>
          <StatsWrapper>
            <StatCard
              label="Confirmed"
              value="128"
              color="green"
              icon={CheckCircle}
            >
              <StatPercentage percentage="+12%" />
            </StatCard>

            <StatCard label="Capacity" value="250" color="blue" icon={Users}>
              <StatBar current={250} total={500} />
            </StatCard>

            <StatCard
              label="Active Sessions"
              value="42"
              color="yellow"
              icon={Hourglass} // This was the cause of the error
            />
          </StatsWrapper>

          {/* Test area to ensure scroll works */}
          <div className="h-[600px] border border-dashed border-white/10 rounded-2xl flex items-center justify-center">
            <p className="text-MainOffWhiteText">
              Extra Content Area (Scroll Test)
            </p>
          </div>

          {/* Spacer at the bottom so content doesn't touch the footer when scrolled to end */}
          <div className="h-10" />
        </main>

        {/* 4. Footer */}
        <Footer />
      </div>
    </div>
  );
};

// Root Rendering
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}
