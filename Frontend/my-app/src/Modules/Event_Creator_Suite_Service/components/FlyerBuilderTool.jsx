import React from "react";
import { ImageIcon } from "lucide-react";

const FlyerBuilderTool = () => (
  <div className="flex flex-col items-center justify-center min-h-80 rounded-2xl border border-LineBox bg-NavigationBackground p-12 text-center gap-5">
    <div className="w-16 h-16 rounded-2xl bg-MainYellowBackground border border-MainYellowLine flex items-center justify-center">
      <ImageIcon size={30} className="text-MainYellow" />
    </div>

    <div className="space-y-1.5">
      <h2 className="text-lg font-semibold text-white">Flyer Builder</h2>
      <p className="text-sm text-SecondOffWhiteText max-w-sm leading-relaxed">
        Design and export a branded event flyer using your event details — choose a template, customize colors, and share instantly.
      </p>
    </div>

    <span className="text-xs px-3 py-1 rounded-full bg-MainYellowBackground text-MainYellow border border-MainYellowLine">
      Coming soon
    </span>
  </div>
);

export default FlyerBuilderTool;
