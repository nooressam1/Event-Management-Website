import React from "react";
import { Bot, Receipt, ImageIcon, ClipboardList } from "lucide-react";

const TOOLS = [
  { key: "ai",     label: "Event Plan",      icon: Bot           },
  { key: "budget", label: "Budget Planner",  icon: Receipt       },
  { key: "flyer",  label: "Flyer Builder",   icon: ImageIcon     },
  { key: "rsvp",   label: "RSVP Generator",  icon: ClipboardList },
];

const SuiteNav = ({ activeTool, onSelect }) => (
  <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
    {TOOLS.map(({ key, label, icon: Icon }) => {
      const isActive = activeTool === key;
      return (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
            isActive
              ? "bg-MainBlue/15 text-MainBlue border-MainBlue/30"
              : "text-SecondOffWhiteText border-transparent hover:text-MainOffWhiteText hover:bg-NavigationBackground"
          }`}
        >
          <Icon size={15} />
          {label}
        </button>
      );
    })}
  </div>
);

export default SuiteNav;
