import React from "react";
import { Bot } from "lucide-react";

const AIAssistantTool = () => (
  <div className="flex flex-col items-center justify-center min-h-80 rounded-2xl border border-LineBox bg-NavigationBackground p-12 text-center gap-5">
    <div className="w-16 h-16 rounded-2xl bg-MainBlue/10 border border-MainBlue/20 flex items-center justify-center">
      <Bot size={30} className="text-MainBlue" />
    </div>

    <div className="space-y-1.5">
      <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
      <p className="text-sm text-SecondOffWhiteText max-w-sm leading-relaxed">
        Get AI-powered suggestions for event copy, themes, schedules, and promotional content — all tailored to your event.
      </p>
    </div>

    <span className="text-xs px-3 py-1 rounded-full bg-MainBlueBackground text-MainBlue border border-MainBlueLine">
      Coming soon
    </span>
  </div>
);

export default AIAssistantTool;
