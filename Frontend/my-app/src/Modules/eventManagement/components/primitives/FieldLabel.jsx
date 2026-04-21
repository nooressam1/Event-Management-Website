import React from "react";

const FieldLabel = ({ children, className = "" }) => (
  <p
    className={`text-[10px] uppercase tracking-widest font-bold text-SecondOffWhiteText mb-2 ${className}`}
  >
    {children}
  </p>
);

export default FieldLabel;
