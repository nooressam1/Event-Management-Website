import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Ensure this contains the @tailwind directives

const TestTailwind = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-MainBackground font-inter text-white">
      <div className="p-10 rounded-xl border-2 border-LineBox bg-NavigationBackground shadow-2xl text-center">
        <h1 className="text-4xl font-jakarta font-bold mb-4 text-MainGreen">
          Tailwind is Active!
        </h1>
        <p className="text-lg text-slate-400 mb-6">
          Testing custom config:{" "}
          <span className="text-MainRed font-mono">MainRed</span> and
          <span className="text-MainYellow font-mono ml-2">MainYellow</span>
        </p>

        <div className="flex gap-4 justify-center">
          <button className="px-6 py-2 bg-MainBlue rounded-lg hover:opacity-90 transition-all">
            Blue Action
          </button>
          <button className="px-6 py-2 bg-MainGreenBackground border border-MainGreenLine text-MainGreen rounded-lg">
            Green Theme
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-OffRedbackground border-l-4 border-OffRedLine text-OffRed">
        Status: Custom Design System Loaded Successfully.
      </div>
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TestTailwind />
  </React.StrictMode>,
);
