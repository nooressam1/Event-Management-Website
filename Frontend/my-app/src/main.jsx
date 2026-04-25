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
import { AuthProvider } from "./Modules/auth/utils/AuthContext";



// Root Rendering
const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>,
  );
}
