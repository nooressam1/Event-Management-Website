import React from "react";
import EventPlanSection from "../components/EventPlanSection";

// "Event Plan" tab — generates an AI event plan and persists it to the event.
const AIAssistantPage = ({ event, onSuiteDataSaved }) => (
  <EventPlanSection event={event} onSuiteDataSaved={onSuiteDataSaved} />
);

export default AIAssistantPage;
