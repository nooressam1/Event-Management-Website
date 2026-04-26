import React from "react";
import { Receipt } from "lucide-react";

const BudgetPlannerTool = () => (
  <div className="flex flex-col items-center justify-center min-h-80 rounded-2xl border border-LineBox bg-NavigationBackground p-12 text-center gap-5">
    <div className="w-16 h-16 rounded-2xl bg-MainGreenBackground border border-MainGreenLine flex items-center justify-center">
      <Receipt size={30} className="text-MainGreen" />
    </div>

    <div className="space-y-1.5">
      <h2 className="text-lg font-semibold text-white">Budget Planner</h2>
      <p className="text-sm text-SecondOffWhiteText max-w-sm leading-relaxed">
        Track event expenses, set spending limits per category, and get a real-time budget breakdown as you plan.
      </p>
    </div>

    <span className="text-xs px-3 py-1 rounded-full bg-MainGreenBackground text-MainGreen border border-MainGreenLine">
      Coming soon
    </span>
  </div>
);

export default BudgetPlannerTool;
