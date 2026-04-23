import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Square } from "lucide-react";
import LabeledInput from "../../shared/component/LabeledInput";
import CustomButton from "../../shared/component/CustomButton";
import useEventPlan from "../hooks/useEventPlan";
import PlanRenderer from "./PlanRenderer";
import { saveSuiteData } from "../utils/suiteService";

const EventPlanSection = ({ event, onSuiteDataSaved }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fromSaved, setFromSaved] = useState(false);
  const initializedRef = useRef(false);

  const handlePlanComplete = useCallback(
    (fullPlan) => {
      setFromSaved(false);
      if (!event?._id) return;
      saveSuiteData(event._id, { plan: fullPlan })
        .then(() => onSuiteDataSaved?.({ plan: fullPlan }))
        .catch(console.error);
    },
    [event, onSuiteDataSaved]
  );

  const { plan, setPlan, streaming, error, generate, cancel } = useEventPlan({
    onComplete: handlePlanComplete,
  });

  useEffect(() => {
    if (!event || initializedRef.current) return;
    initializedRef.current = true;
    setTitle(event.title ?? "");
    setDescription(event.description ?? "");
    const saved = event.suiteData?.plan;
    if (saved) { setPlan(saved); setFromSaved(true); }
  }, [event, setPlan]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || streaming) return;
    setFromSaved(false);
    generate(title, description);
  };

  const isEmpty = !plan && !streaming && !error;

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <LabeledInput label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Networking Mixer" />
        <LabeledInput label="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of your event..." />

        <div className="flex gap-3 items-center">
          {streaming ? (
            <CustomButton title="Stop" icon={Square} onClick={cancel} type="button" className="bg-OffRedbackground text-MainRed border border-OffRedLine hover:opacity-80" />
          ) : (
            <CustomButton title="Generate Plan" icon={Sparkles} type="submit" className="bg-MainBlue text-white hover:opacity-90" />
          )}
          {streaming && <span className="text-xs text-SecondOffWhiteText animate-pulse">Generating…</span>}
        </div>
      </form>

      {error && (
        <p className="text-MainRed text-sm bg-OffRedbackground border border-OffRedLine rounded-lg px-4 py-2">{error}</p>
      )}

      {isEmpty && (
        <div className="text-center py-14 text-SecondOffWhiteText text-sm border border-dashed border-LineBox rounded-xl">
          Fill in the event details above and click Generate Plan.
        </div>
      )}

      {(plan || streaming) && (
        <div className="space-y-2">
          {fromSaved && !streaming && (
            <p className="text-xs text-SecondOffWhiteText px-1">
              Showing saved plan · Generate a new one to replace it.
            </p>
          )}
          <PlanRenderer text={plan} streaming={streaming} />
        </div>
      )}
    </div>
  );
};

export default EventPlanSection;
