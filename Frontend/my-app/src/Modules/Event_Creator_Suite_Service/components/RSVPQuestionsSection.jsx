import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, Copy, Check } from "lucide-react";
import LabeledInput from "../../shared/component/LabeledInput";
import CustomButton from "../../shared/component/CustomButton";
import useRSVPQuestions from "../hooks/useRSVPQuestions";
import { saveSuiteData } from "../utils/suiteService";

const TYPE_BADGE = {
  text:     "text-MainBlue bg-MainBlueBackground border-MainBlueLine",
  select:   "text-MainGreen bg-MainGreenBackground border-MainGreenLine",
  checkbox: "text-MainYellow bg-MainYellowBackground border-MainYellowLine",
  number:   "text-SecondOffWhiteText bg-NavigationBackground border-LineBox",
};

const RSVPQuestionsSection = ({ event, onSuiteDataSaved }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState("");
  const [copied, setCopied] = useState(false);
  const [fromSaved, setFromSaved] = useState(false);
  const initializedRef = useRef(false);

  const handleQuestionsGenerated = useCallback(
    (qs) => {
      setFromSaved(false);
      if (!event?._id) return;
      saveSuiteData(event._id, { rsvpQuestions: qs })
        .then(() => onSuiteDataSaved?.({ rsvpQuestions: qs }))
        .catch(console.error);
    },
    [event, onSuiteDataSaved]
  );

  const { questions, setQuestions, loading, error, generate } = useRSVPQuestions({
    onComplete: handleQuestionsGenerated,
  });

  useEffect(() => {
    if (!event || initializedRef.current) return;
    initializedRef.current = true;
    setTitle(event.title ?? "");
    setDescription(event.description ?? "");
    if (event.capacity) setAttendees(String(event.capacity));
    const saved = event.suiteData?.rsvpQuestions;
    if (saved?.length) { setQuestions(saved); setFromSaved(true); }
  }, [event, setQuestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || loading) return;
    generate(title, description, attendees);
  };

  const handleCopyAll = () => {
    if (!questions?.length) return;
    const text = questions
      .map((q, i) => {
        let line = `${i + 1}. ${q.question} (${q.required ? "Required" : "Optional"})\n   Type: ${q.type}`;
        if (q.options?.length) line += `\n   Options: ${q.options.join(", ")}`;
        return line;
      })
      .join("\n\n");
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-4">
        <LabeledInput label="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Networking Mixer" />
        <LabeledInput label="Event Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of your event..." />
        <LabeledInput label="Expected Attendees" type="number" value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="e.g. 150" />
        <CustomButton title={loading ? "Generating…" : "Generate Questions"} icon={Sparkles} type="submit" className="bg-MainBlue text-white hover:opacity-90" />
      </form>

      {error && (
        <p className="text-MainRed text-sm bg-OffRedbackground border border-OffRedLine rounded-lg px-4 py-2">{error}</p>
      )}

      {!questions && !loading && !error && (
        <div className="text-center py-14 text-SecondOffWhiteText text-sm border border-dashed border-LineBox rounded-xl">
          Fill in the details above and generate RSVP questions for your event.
        </div>
      )}

      {questions && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-SecondOffWhiteText">
              {fromSaved ? "Saved questions · Generate new ones to replace" : `${questions.length} questions generated`}
            </p>
            <CustomButton title={copied ? "Copied!" : "Copy all"} icon={copied ? Check : Copy} onClick={handleCopyAll} className="text-sm text-SecondOffWhiteText hover:text-white border border-LineBox bg-NavigationBackground" />
          </div>

          {questions.map((q, i) => (
            <div key={i} className="bg-NavigationBackground border border-LineBox rounded-xl p-4 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm text-MainOffWhiteText font-medium leading-snug">{i + 1}. {q.question}</p>
                <div className="flex items-center gap-2 shrink-0 pt-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${TYPE_BADGE[q.type] ?? TYPE_BADGE.text}`}>{q.type}</span>
                  {q.required && <span className="text-xs text-MainRed font-medium">Required</span>}
                </div>
              </div>
              {q.options?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {q.options.map((opt, j) => (
                    <span key={j} className="text-xs px-2.5 py-1 rounded-lg bg-MainBackground border border-LineBox text-SecondOffWhiteText">{opt}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RSVPQuestionsSection;
