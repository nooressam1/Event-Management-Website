import React from "react";
import background from "../../../assets/Authbackground.png";
import Footer from "../../shared/components/Footer";
import EventHubIcon from "../../../assets/EventHubIcon.png";
import SignUpPage from "../components/SignUpPage.jsx";
import LoginPage from "../components/LoginPage.jsx";
import { useLocation } from "react-router-dom";

const AuthPage = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row bg-MainBackground">
      {/* Left panel — hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 h-screen">
        <div
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
          }}
          className="p-15 flex flex-col gap-10 justify-center items-center"
        >
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6">
                <img
                  className="h-full w-full object-contain"
                  src={EventHubIcon}
                  alt="EventHub Logo"
                />
              </div>
              <h1 className="text-white font-jakarta font-black text-lg">EventHub</h1>
            </div>
            <h1 className="text-6xl font-black text-white">
              Host <br />
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] bg-clip-text text-transparent">
                Unforgettable
              </span>
              <br />
              Experiences.
            </h1>
            <p className="text-md font-inter font-light text-MainOffWhiteText">
              The all-in-one platform for professional organizers <br />
              to manage sales, RSVPs, and attendee engagement.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel — full width on mobile, half on desktop */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:py-0">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 md:hidden">
          <div className="w-6 h-6">
            <img className="h-full w-full object-contain" src={EventHubIcon} alt="EventHub Logo" />
          </div>
          <span className="text-white font-jakarta font-black text-lg">EventHub</span>
        </div>
        <div className="w-full max-w-sm">
          {isLogin ? <LoginPage /> : <SignUpPage />}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
