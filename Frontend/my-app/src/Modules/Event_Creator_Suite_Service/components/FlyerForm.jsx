import React from "react";
import LabeledInput from "../../shared/components/LabeledInput";

const ColorField = ({ label, value, onChange }) => (
  <div className="w-full font-inter">
    <label className="block mb-2 ml-2 text-sm font-medium text-MainOffWhiteText">{label}</label>
    <div className="flex items-center gap-3 bg-NavigationBackground border-2 border-LineBox rounded-xl px-4 py-2.5 focus-within:border-MainBlue transition-colors">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent p-0"
      />
      <span className="text-sm text-MainOffWhiteText font-mono">{value}</span>
    </div>
  </div>
);

const FlyerForm = ({ fields, onChange }) => {
  const set = (key) => (e) => onChange(key, e.target.value);

  return (
    <div className="space-y-3">
      <LabeledInput label="Event Title" value={fields.title} onChange={set("title")} placeholder="e.g. Annual Tech Summit" />
      <LabeledInput label="Tagline (optional)" value={fields.tagline} onChange={set("tagline")} placeholder="e.g. Connect. Innovate. Inspire." />
      <div className="grid grid-cols-2 gap-3">
        <LabeledInput label="Date & Time" value={fields.dateTime} onChange={set("dateTime")} placeholder="e.g. June 14, 2026 · 6PM" />
        <LabeledInput label="Location" value={fields.location} onChange={set("location")} placeholder="e.g. Grand Hall, NYC" />
      </div>

      <div className="w-full font-inter">
        <label className="block mb-2 ml-2 text-sm font-medium text-MainOffWhiteText">Description (optional)</label>
        <textarea
          value={fields.description}
          onChange={set("description")}
          placeholder="Brief description shown on the flyer…"
          rows={3}
          className="w-full bg-NavigationBackground border-2 border-LineBox rounded-xl px-4 py-3 text-white text-sm focus:border-MainBlue outline-none resize-none custom-scrollbar placeholder:text-SecondOffWhiteText"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ColorField label="Primary Color" value={fields.primaryColor} onChange={(v) => onChange("primaryColor", v)} />
        <ColorField label="Background Color" value={fields.secondaryColor} onChange={(v) => onChange("secondaryColor", v)} />
      </div>
    </div>
  );
};

export default FlyerForm;
