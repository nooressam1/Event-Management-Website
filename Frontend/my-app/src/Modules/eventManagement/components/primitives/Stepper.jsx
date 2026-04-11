import React from "react";

const Stepper = ({ value, onChange, min = 1 }) => (
  <div className="flex items-center border border-LineBox rounded-xl overflow-hidden">
    <button
      type="button"
      onClick={() => onChange(Math.max(min, value - 1))}
      className="w-9 h-9 flex items-center justify-center text-white hover:bg-LineBox transition-colors text-lg font-bold"
    >
      −
    </button>
    <span className="w-14 text-center text-white text-sm font-semibold">
      {value}
    </span>
    <button
      type="button"
      onClick={() => onChange(value + 1)}
      className="w-9 h-9 flex items-center justify-center text-white hover:bg-LineBox transition-colors text-lg font-bold"
    >
      +
    </button>
  </div>
);

export default Stepper;
