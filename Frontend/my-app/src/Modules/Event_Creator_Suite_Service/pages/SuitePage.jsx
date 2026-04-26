import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import EventSideBar from "../components/EventSideBar";
import Footer from "../../shared/components/Footer";
import SuiteNav from "../components/SuiteNav";
import AIAssistantPage from "./AIAssistantPage";
import BudgetPlannerPage from "./BudgetPlannerPage";
import FlyerBuilderPage from "./FlyerBuilderPage";
import RSVPGeneratorTool from "../components/RSVPGeneratorTool";
import { getEventById } from "../../eventManagement/utils/eventService";

const renderTool = (activeTool, event, onSuiteDataSaved) => {
  switch (activeTool) {
    case "ai":     return <AIAssistantPage    event={event} onSuiteDataSaved={onSuiteDataSaved} />;
    case "budget": return <BudgetPlannerPage  event={event} />;
    case "flyer":  return <FlyerBuilderPage   event={event} onSuiteDataSaved={onSuiteDataSaved} />;
    case "rsvp":   return <RSVPGeneratorTool  event={event} onSuiteDataSaved={onSuiteDataSaved} />;
    default:       return null;
  }
};

const SuitePage = () => {
  const { id } = useParams();
  const [activeTool, setActiveTool] = useState("ai");
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEventById(id)
      .then(({ event: e }) => setEvent(e))
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  // Merge partial suiteData updates into local event state so tools see
  // the latest saved data when switching between tabs.
  const handleSuiteDataSaved = useCallback((partial) => {
    setEvent((prev) =>
      prev ? { ...prev, suiteData: { ...(prev.suiteData ?? {}), ...partial } } : prev
    );
  }, []);

  return (
    <div className="h-screen w-full flex bg-MainBackground font-inter text-white overflow-hidden">
      <EventSideBar event={event} activeItem="Suite" />

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <main className="flex-1 px-8 py-6 space-y-5 overflow-y-auto custom-scrollbar">

          {/* Suite heading */}
          <div className="border-b border-LineBox pb-5">
            <p className="text-[11px] text-SecondOffWhiteText uppercase tracking-widest font-medium mb-1.5">
              Event Creator Suite
            </p>
            {loading ? (
              <div className="w-56 h-8 bg-NavigationBackground animate-pulse rounded-lg" />
            ) : (
              <h1 className="text-2xl font-jakarta font-bold text-white truncate">
                {event?.title || "Untitled Event"}
              </h1>
            )}
          </div>

          {/* Suite tool navigation */}
          <SuiteNav activeTool={activeTool} onSelect={setActiveTool} />

          {/* Active tool content area */}
          {renderTool(activeTool, event, handleSuiteDataSaved)}

        </main>
        <Footer />
      </div>
    </div>
  );
};

export default SuitePage;
