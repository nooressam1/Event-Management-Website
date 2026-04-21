import React from "react";

const RuleRow = ({ icon: Icon, title, subtitle, control }) => (
  <div className="flex items-center justify-between py-3 border-b border-LineBox last:border-0">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-LineBox flex items-center justify-center shrink-0">
        <Icon size={16} className="text-MainBlue" />
      </div>
      <div>
        <p className="text-white text-sm font-medium">{title}</p>
        <p className="text-SecondOffWhiteText text-xs">{subtitle}</p>
      </div>
    </div>
    <div className="shrink-0 ml-4">{control}</div>
  </div>
);

export default RuleRow;
