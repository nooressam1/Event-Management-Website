import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STEPS = [
  { label: "Create New Event", next: "Capacity & Logic" },
  { label: "Capacity & Logic", next: "Invite Guests" },
  { label: "Invite Guests", next: null },
];

const StepIndicator = ({ step, isEditing = false }) => {
  const navigate = useNavigate();
  const meta = STEPS[step - 1];
  const progress = Math.round((step / 3) * 100);

  return (
    <div className="border-b border-LineBox px-8 py-5 shrink-0">
      {step === 1 && (
        <button
          onClick={() => navigate("/myevents")}
          className="flex items-center gap-2 text-SecondOffWhiteText hover:text-white text-sm mb-4 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to My Events
        </button>
      )}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-MainBlue text-[11px] font-bold uppercase tracking-widest mb-1">
            Step {step} of 3
          </p>
          <h2 className="text-white font-jakarta font-bold text-xl">
            {isEditing && step === 1 ? "Edit Event" : meta.label}
          </h2>
        </div>
        <span className="text-SecondOffWhiteText text-sm">{progress}% complete</span>
      </div>

      <div className="w-full h-1.5 bg-LineBox rounded-full overflow-hidden">
        <div
          className="h-full bg-MainBlue rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {meta.next && (
        <p className="text-SecondOffWhiteText text-xs mt-2">
          Next: {meta.next}
        </p>
      )}
    </div>
  );
};

export default StepIndicator;
