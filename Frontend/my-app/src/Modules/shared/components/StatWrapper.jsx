import React from "react";

const StatsWrapper = ({ children }) => {
  return (
    /* grid-cols-1: Mobile (stacks vertically)
       md:grid-cols-2: Tablet (2x2)
       lg:grid-cols-4: Desktop (All 4 in a row)
    */
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-MainBackground w-full">
      {children}
    </div>
  );
};

export default StatsWrapper;
