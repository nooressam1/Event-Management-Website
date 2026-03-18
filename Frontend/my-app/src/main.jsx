import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Ensure this contains the @tailwind directives
import SideNavigationBar from "./Modules/shared/component/SideNavigationBar";

const TestTailwind = () => {
  return (
    <div className="min-h-screen flex flex-row items-center justify-center font-inter ">
            <SideNavigationBar>testing</SideNavigationBar>

      <h1>testing</h1>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TestTailwind />
  </React.StrictMode>,
);
