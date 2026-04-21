import React from "react";

// size="md" → 20×20px (w-5 h-5), size="sm" → 16×16px (w-4 h-4)
const SIZE = {
  md: { box: "w-5 h-5 border-2", mark: "w-3 h-2.5" },
  sm: { box: "w-4 h-4 border",   mark: "w-2.5 h-2" },
};

const Checkmark = ({ className }) => (
  <svg
    viewBox="0 0 10 8"
    fill="none"
    className={className}
    stroke="white"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 4l2.5 2.5L9 1" />
  </svg>
);

const Checkbox = ({ checked, onChange, size = "md" }) => {
  const s = SIZE[size] ?? SIZE.md;
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`${s.box} rounded flex items-center justify-center transition-colors ${
        checked ? "bg-MainBlue border-MainBlue" : "border-LineBox bg-transparent"
      }`}
    >
      {checked && <Checkmark className={s.mark} />}
    </button>
  );
};

export default Checkbox;
