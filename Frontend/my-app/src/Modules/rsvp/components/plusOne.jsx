import { UserPlus } from "lucide-react";
import React from "react";

const PlusOne = ({ value, onChange }) => {
  return (
    <div className="w-full flex border-LineBox border-2 px-4 py-2 items-center rounded-xl flex-row justify-between font-inter group">
      <div className="flex flex-row  justify-center items-end">
        <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-md">
          <UserPlus
            size={22}
            className="text-MainBlue"
            strokeWidth={1.5}
          />{" "}
        </div>

        <label className="block mb-2 ml-2 text-sm font-medium text-MainOffWhiteText transition-colors group-focus-within:text-MainBlue">
          Bringing a Plus one?
        </label>
      </div>
      <div
        onClick={() => onChange(!value)}
        className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
          value ? "bg-MainBlue" : "bg-LineBox"
        }`}
      >
        <div
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
            value ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </div>
    </div>
  );
};

export default PlusOne;
