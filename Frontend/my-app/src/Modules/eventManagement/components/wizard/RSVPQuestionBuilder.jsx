import React from "react";
import { Trash2, Plus } from "lucide-react";
import FieldLabel from "../primitives/FieldLabel";
import Checkbox from "../primitives/Checkbox";

const FIELD_TYPES = [
  { value: "text", label: "Text Input" },
  { value: "multiple_choice", label: "Multiple Choice" },
  { value: "yes_no", label: "Yes / No" },
];

const EMPTY_QUESTION = { label: "", fieldType: "text", required: false };

const inputClass =
  "w-full bg-MainBackground border border-LineBox rounded-lg px-3 py-2.5 text-white text-sm placeholder-SecondOffWhiteText focus:outline-none focus:border-MainBlue transition-colors";

const RSVPQuestionBuilder = ({ questions, onChange }) => {
  const add = () => onChange([...questions, { ...EMPTY_QUESTION }]);
  const remove = (i) => onChange(questions.filter((_, idx) => idx !== i));
  const update = (i, field, value) => {
    const updated = [...questions];
    updated[i] = { ...updated[i], [field]: value };
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div
          key={i}
          className="border border-dashed border-LineBox rounded-xl p-4 space-y-3"
        >
          <div className="flex justify-between items-center">
            <FieldLabel className="mb-0">Question Label</FieldLabel>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-SecondOffWhiteText hover:text-MainRed transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>

          <input
            className={inputClass}
            placeholder="e.g. Do you have any dietary restrictions?"
            value={q.label}
            onChange={(e) => update(i, "label", e.target.value)}
          />

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <FieldLabel className="mb-1.5">Field Type</FieldLabel>
              <div className="relative">
                <select
                  className="w-full appearance-none bg-MainBackground border border-LineBox rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-MainBlue transition-colors cursor-pointer"
                  value={q.fieldType}
                  onChange={(e) => update(i, "fieldType", e.target.value)}
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-SecondOffWhiteText pointer-events-none text-xs">
                  ▾
                </span>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer mt-5 shrink-0">
              <Checkbox
                size="sm"
                checked={q.required}
                onChange={(v) => update(i, "required", v)}
              />
              <span className="text-MainOffWhiteText text-xs">Required</span>
            </label>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full border border-dashed border-LineBox rounded-xl py-3 text-SecondOffWhiteText hover:text-white hover:border-MainBlue/50 text-sm flex items-center justify-center gap-2 transition-colors"
      >
        <Plus size={15} />
        Add Custom Question
      </button>
    </div>
  );
};

export default RSVPQuestionBuilder;
