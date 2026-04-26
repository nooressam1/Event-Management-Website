import React from "react";
import { Users, Timer, UserPlus, Globe, SlidersHorizontal, ClipboardList } from "lucide-react";
import SectionCard from "../primitives/SectionCard";
import RuleRow from "../primitives/RuleRow";
import Toggle from "../primitives/Toggle";
import Checkbox from "../primitives/Checkbox";
import Stepper from "../primitives/Stepper";
import RSVPQuestionBuilder from "./RSVPQuestionBuilder";

const Step2CapacityLogic = ({ formData, updateField }) => (
  <div className="max-w-2xl space-y-6">
    <SectionCard icon={SlidersHorizontal} title="Attendance Rules">
      <RuleRow
        icon={Users}
        title="Total Capacity"
        subtitle="Maximum guests allowed"
        control={
          <Stepper
            value={formData.capacity}
            onChange={(v) => updateField("capacity", v)}
          />
        }
      />
      <RuleRow
        icon={Timer}
        title="Enable Waitlist"
        subtitle="Automatically queue guests when full"
        control={
          <Toggle
            checked={formData.enableWaitlist}
            onChange={(v) => updateField("enableWaitlist", v)}
          />
        }
      />
      <RuleRow
        icon={UserPlus}
        title="Allow Plus-Ones"
        subtitle="Guests can bring additional people"
        control={
          <Checkbox
            checked={formData.allowPlusOnes}
            onChange={(v) => updateField("allowPlusOnes", v)}
          />
        }
      />
      <RuleRow
        icon={Globe}
        title="Public Event"
        subtitle="Appear on the public homepage — anyone can discover and join"
        control={
          <Toggle
            checked={formData.isPublic}
            onChange={(v) => updateField("isPublic", v)}
          />
        }
      />
    </SectionCard>

    <SectionCard icon={ClipboardList} title="RSVP Questions">
      <RSVPQuestionBuilder
        questions={formData.rsvpQuestions}
        onChange={(q) => updateField("rsvpQuestions", q)}
      />
    </SectionCard>
  </div>
);

export default Step2CapacityLogic;
