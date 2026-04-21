import React from "react";

export const TABS = ["All Events", "Live", "Draft", "Past"];

export const TAB_TO_STATUS = {
  Live: "PUBLISHED",
  Draft: "DRAFT",
  Past: "COMPLETED",
};

const EventTabs = ({ activeTab, onTabChange }) => (
  <div className="flex gap-8 border-b border-LineBox mt-8 mb-6">
    {TABS.map((tab) => (
      <button
        key={tab}
        onClick={() => onTabChange(tab)}
        className={`pb-4 text-sm font-medium transition-colors ${
          activeTab === tab
            ? "text-MainBlue border-b-2 border-MainBlue"
            : "text-SecondOffWhiteText hover:text-white"
        }`}
      >
        {tab}
      </button>
    ))}
  </div>
);

export default EventTabs;
