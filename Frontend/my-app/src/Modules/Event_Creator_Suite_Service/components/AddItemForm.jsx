import React, { useState } from "react";
import { Plus } from "lucide-react";
import LabeledInput from "../../shared/components/LabeledInput";
import CustomButton from "../../shared/components/CustomButton";

const CATEGORIES = ["Venue", "Catering", "Marketing", "Equipment", "Staff", "Other"];

const EMPTY = { label: "", category: "Other", estimated: "", actual: "" };

const AddItemForm = ({ onAdd }) => {
  const [form, setForm] = useState(EMPTY);
  const [open, setOpen] = useState(false);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.label.trim() || form.estimated === "") return;
    onAdd({
      label: form.label.trim(),
      category: form.category,
      estimated: Number(form.estimated),
      actual: form.actual !== "" ? Number(form.actual) : null,
    });
    setForm(EMPTY);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-LineBox text-SecondOffWhiteText hover:text-white hover:border-MainBlue/50 text-sm transition-all w-full justify-center"
      >
        <Plus size={15} />
        Add expense item
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-NavigationBackground border border-LineBox rounded-xl p-4 space-y-3"
    >
      <p className="text-sm font-medium text-white">New Expense Item</p>

      <div className="grid grid-cols-2 gap-3">
        <LabeledInput label="Label" value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="e.g. Catering deposit" />
        <div className="w-full font-inter">
          <label className="block mb-2 ml-2 text-sm font-medium text-MainOffWhiteText">Category</label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full bg-NavigationBackground border-2 border-LineBox rounded-xl px-4 py-3 text-white text-sm focus:border-MainBlue outline-none"
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <LabeledInput label="Estimated ($)" type="number" value={form.estimated} onChange={(e) => set("estimated", e.target.value)} placeholder="0" />
        <LabeledInput label="Actual ($) — optional" type="number" value={form.actual} onChange={(e) => set("actual", e.target.value)} placeholder="0" />
      </div>

      <div className="flex gap-2">
        <CustomButton title="Add Item" icon={Plus} type="submit" className="bg-MainBlue text-white hover:opacity-90 text-sm" />
        <button type="button" onClick={() => setOpen(false)} className="text-sm text-SecondOffWhiteText hover:text-white px-3 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddItemForm;
