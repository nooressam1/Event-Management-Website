import React, { useState } from "react";
import background from "../../../assets/Authbackground.png";
import Footer from "../../shared/component/Footer";
import EventHubIcon from "../../../assets/EventHubIcon.png";
import SignUpPage from "../component/SignUpPage.jsx";
import LoginPage from "../component/LoginPage.jsx";
import { useLocation } from "react-router-dom";
const AuthTemp = () => {
  const location = useLocation();
  const isLogin = location.pathname === "/login";
  return (
    <div className="w-full h-screen flex bg-MainBackground">
      <div className="w-1/2 h-full flex ">
        <div
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            width: "100%",
          }}
          className=" p-15 flex flex-col gap-10 justify-center items-center"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col sm:flex-row gap-2   items-start w-full ">
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
            <h1 className="text-6xl font-black text-white">
              Host <br />
              <span className="bg-gradient-to-r from-[#22D3EE] to-[#2DD4BF] bg-clip-text text-transparent">
                Unforgettable
              </span>
              <br />
              Experiences.
            </h1>
            <h1 className="text-md font-inter font-light text-MainOffWhiteText">
              The all-in-one platform for professional organizers <br />
              to manage sales, RSVPs, and attendee engagement.
            </h1>
          </div>
        </div>
      </div>
      {/* switch between login & signup */}
      <div className="w-1/2 justify-center items-center flex flex-col">
        {isLogin ? <LoginPage /> : <SignUpPage />}
      </div>
    </div>
  );
};

export default AuthTemp;
