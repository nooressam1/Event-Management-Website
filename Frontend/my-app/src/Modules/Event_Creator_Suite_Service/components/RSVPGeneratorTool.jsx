import React from "react";
import RSVPQuestionsSection from "./RSVPQuestionsSection";

// "RSVP Generator" tab — AI-generates RSVP question suggestions and persists them.
const RSVPGeneratorTool = ({ event, onSuiteDataSaved }) => (
  <RSVPQuestionsSection event={event} onSuiteDataSaved={onSuiteDataSaved} />
);

export default RSVPGeneratorTool;
