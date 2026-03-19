import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Ensure this contains the @tailwind directives
import SideNavigationBar from "./Modules/shared/component/SideNavigationBar";

const PageTemplate = () => {
  return (
    <div className="mmin-h-screen flex bg-MainBackground font-inter">
      <SideNavigationBar></SideNavigationBar>
      <div className="w-screen h-screen px-8 py-5  ">
        {/*all content will go in here */}
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PageTemplate />
  </React.StrictMode>,
);
