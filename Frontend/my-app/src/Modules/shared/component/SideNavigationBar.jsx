import React from "react";
import myImage from "../../../assets/image.png";
import SideBarBox from "./SideBarBox";

const SideNavigationBar = () => {
  return (
    <div class=" h-screen w-1/5 bg-NavigationBackground">
      <div class="flex  gap-2  px-7 py-5 border-2 border-LineBox">
        <div class=" w-6 h-6">
          <img className="h-full w-full object-fit" src={myImage} />
        </div>
        <h1 class="text-white font-jakarta font-black text-lg">EventHub</h1>
      </div>
      <div>
        <div className="px-7 py-5">
          <h4 className="text-xs text-MainOffWhiteText font-jakarta font-bold">
            MAIN MENU
          </h4>
          <SideBarBox title="testing" image={myImage}></SideBarBox>
        </div>
      </div>
    </div>
  );
};

export default SideNavigationBar;
