import React from "react";

const RsvpStatus = ({ title, image, value, onChange }) => {
  return (
    <div
      onClick={() => onChange(!value)}
      className={` ${value ? `border-MainBlue  bg-MainBlueBackground` : `border-LineBox  bg-NavigationBackground`} w-full  cursor-pointer justify-center items-center p-5 rounded-2xl border-2 flex flex-col gap-5`}
    >
      <div className="w-8 h-8">
        <img
          className="h-full w-full object-contain"
          src={image}
          alt="status Logo"
        />
      </div>
      <h1 className=" text-MainOffWhiteText font-inter font-normal text-md">{title}</h1>
    </div>
  );
};

export default RsvpStatus;
