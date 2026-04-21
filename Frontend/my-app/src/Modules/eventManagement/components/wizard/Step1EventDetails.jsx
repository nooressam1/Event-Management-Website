import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, ArrowLeft } from "lucide-react";
import GuestViewPreview from "./GuestViewPreview";
import FieldLabel from "../primitives/FieldLabel";
import LabeledInput from "../../../shared/component/LabeledInput";

const MapPlaceholder = ({ location }) => (
  <div className="mt-3 h-44 bg-[#080D18] rounded-xl border border-LineBox overflow-hidden relative">
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.07]"
      xmlns="http://www.w3.org/2000/svg"
    >
      {[...Array(10)].map((_, i) => (
        <line
          key={`h${i}`}
          x1="0"
          y1={`${(i + 1) * 10}%`}
          x2="100%"
          y2={`${(i + 1) * 10}%`}
          stroke="#94A3B8"
          strokeWidth="1"
        />
      ))}
      {[...Array(16)].map((_, i) => (
        <line
          key={`v${i}`}
          x1={`${(i + 1) * 6.25}%`}
          y1="0"
          x2={`${(i + 1) * 6.25}%`}
          y2="100%"
          stroke="#94A3B8"
          strokeWidth="1"
        />
      ))}
      <line
        x1="20%"
        y1="0"
        x2="60%"
        y2="100%"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
      <line
        x1="80%"
        y1="0"
        x2="30%"
        y2="100%"
        stroke="#94A3B8"
        strokeWidth="1.5"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
      <div className="w-8 h-8 rounded-full bg-MainBlue/20 flex items-center justify-center">
        <MapPin size={18} className="text-MainBlue" />
      </div>
      {location ? (
        <span className="bg-NavigationBackground/90 text-white text-xs px-3 py-1 rounded-lg border border-LineBox max-w-[80%] truncate">
          {location}
        </span>
      ) : (
        <span className="text-SecondOffWhiteText text-xs">
          Enter a location above to preview
        </span>
      )}
    </div>
  </div>
);
const Step1EventDetails = ({ formData, updateField }) => {
  const navigate = useNavigate();
  return (
  <div>
    <button
      onClick={() => navigate("/myevents")}
      className="flex items-center gap-2 text-SecondOffWhiteText hover:text-white text-sm mb-6 transition-colors"
    >
      <ArrowLeft size={15} />
      Back to My Events
    </button>

    <div className="flex gap-8">
    <div className="flex-1 space-y-6 min-w-0">
      <LabeledInput
        label="Event Name"
        placeholder="Summer Networking Mixer"
        value={formData.title}
        onChange={(e) => updateField("title", e.target.value)}
      />

      <LabeledInput
        label="Short Description"
        placeholder="A Time to to dally Around"
        value={formData.shortDescription}
        onChange={(e) => updateField("shortDescription", e.target.value)}
      />

      <LabeledInput
        label="Cover Image URL"
        placeholder="https://..."
        value={formData.coverImage}
        onChange={(e) => updateField("coverImage", e.target.value)}
      />

      <div className="flex gap-4">
        <LabeledInput
          label="Select Date"
          type="date"
          icon={Calendar}
          inputClassName="[color-scheme:dark]"
          value={formData.date}
          onChange={(e) => updateField("date", e.target.value)}
        />
        <LabeledInput
          label="Start Time"
          type="time"
          icon={Clock}
          inputClassName="[color-scheme:dark]"
          value={formData.time}
          onChange={(e) => updateField("time", e.target.value)}
        />
      </div>

      <div>
        <LabeledInput
          label="Location"
          icon={MapPin}
          placeholder="The Rooftop Lounge, San Francisco"
          value={formData.location}
          onChange={(e) => updateField("location", e.target.value)}
        />
        <MapPlaceholder location={formData.location} />
      </div>

      <div>
        <FieldLabel>Description</FieldLabel>
        <textarea
          rows={5}
          className="w-full bg-NavigationBackground border border-LineBox rounded-xl px-4 py-3 text-white text-sm placeholder-SecondOffWhiteText focus:outline-none focus:border-MainBlue transition-colors resize-none"
          placeholder="Tell guests what to expect at your event..."
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>
    </div>

      <GuestViewPreview formData={formData} />
    </div>
  </div>
  );
};

export default Step1EventDetails;
