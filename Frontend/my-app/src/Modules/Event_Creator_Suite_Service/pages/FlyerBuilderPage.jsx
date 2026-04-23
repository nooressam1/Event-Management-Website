import React, { useState, useEffect, useRef } from "react";
import FlyerForm from "../components/FlyerForm";
import FlyerPreview from "../components/FlyerPreview";
import { saveSuiteData } from "../utils/suiteService";

const DEFAULT_FIELDS = {
  title:          "",
  tagline:        "",
  dateTime:       "",
  location:       "",
  description:    "",
  primaryColor:   "#3B82F6",
  secondaryColor: "#0f172a",
};

const formatDateTime = (event) => {
  if (!event?.date) return "";
  try {
    const d = new Date(event.date);
    const datePart = d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    return `${datePart}${event.time ? ` · ${event.time}` : ""}`;
  } catch { return ""; }
};

const FlyerBuilderPage = ({ event, onSuiteDataSaved }) => {
  const [fields, setFields] = useState(DEFAULT_FIELDS);
  const [template, setTemplate] = useState("modern");
  const initializedRef = useRef(false);
  const saveTimerRef = useRef(null);

  useEffect(() => {
    if (!event || initializedRef.current) return;
    initializedRef.current = true;
    const saved = event.suiteData?.flyerSettings;
    if (saved?.fields) {
      setFields(saved.fields);
      setTemplate(saved.template ?? "modern");
    } else {
      setFields((prev) => ({
        ...prev,
        title:       event.title        ?? prev.title,
        dateTime:    formatDateTime(event) || prev.dateTime,
        location:    event.location     ?? prev.location,
        description: event.shortDescription || event.description || prev.description,
      }));
    }
  }, [event]);

  // Cleanup timer on unmount
  useEffect(() => () => clearTimeout(saveTimerRef.current), []);

  const debouncedSave = (newFields, newTemplate) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      if (!event?._id) return;
      const flyerSettings = { fields: newFields, template: newTemplate };
      saveSuiteData(event._id, { flyerSettings })
        .then(() => onSuiteDataSaved?.({ flyerSettings }))
        .catch(console.error);
    }, 1500);
  };

  const handleChange = (key, value) => {
    const newFields = { ...fields, [key]: value };
    setFields(newFields);
    debouncedSave(newFields, template);
  };

  const handleTemplateChange = (newTemplate) => {
    setTemplate(newTemplate);
    debouncedSave(fields, newTemplate);
  };

  return (
    <div className="grid grid-cols-[1fr_1.1fr] gap-6 items-start">
      {/* Left — form */}
      <div className="bg-NavigationBackground border border-LineBox rounded-xl p-5 space-y-1">
        <p className="text-sm font-semibold text-white mb-4">Flyer Details</p>
        <FlyerForm fields={fields} onChange={handleChange} />
      </div>

      {/* Right — live preview */}
      <div className="bg-NavigationBackground border border-LineBox rounded-xl p-5">
        <p className="text-sm font-semibold text-white mb-4">Live Preview</p>
        <FlyerPreview
          fields={fields}
          template={template}
          onTemplateChange={handleTemplateChange}
          eventTitle={fields.title}
        />
      </div>
    </div>
  );
};

export default FlyerBuilderPage;
