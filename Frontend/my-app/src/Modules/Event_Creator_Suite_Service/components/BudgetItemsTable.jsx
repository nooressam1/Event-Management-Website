import React, { useState } from "react";
import { Trash2, Check, X } from "lucide-react";

const CATEGORY_STYLE = {
  Venue:     "text-MainBlue bg-MainBlueBackground border-MainBlueLine",
  Catering:  "text-MainGreen bg-MainGreenBackground border-MainGreenLine",
  Marketing: "text-MainYellow bg-MainYellowBackground border-MainYellowLine",
  Equipment: "text-purple-400 bg-purple-900/20 border-purple-800",
  Staff:     "text-orange-400 bg-orange-900/20 border-orange-800",
  Other:     "text-SecondOffWhiteText bg-NavigationBackground border-LineBox",
};

const fmt = (n) => (n == null ? "—" : `$${Number(n).toLocaleString()}`);

const ActualCell = ({ item, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(item.actual != null ? String(item.actual) : "");

  const save = () => {
    const num = val === "" ? null : Number(val);
    onUpdate(item._id, { actual: num });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1">
        <input
          autoFocus
          type="number"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") setEditing(false); }}
          className="w-24 bg-MainBackground border border-MainBlue rounded-lg px-2 py-1 text-sm text-white outline-none"
        />
        <button onClick={save}    className="text-MainGreen hover:opacity-80"><Check size={14} /></button>
        <button onClick={() => setEditing(false)} className="text-SecondOffWhiteText hover:opacity-80"><X size={14} /></button>
      </div>
    );
  }

  return (
    <button
      onClick={() => { setVal(item.actual != null ? String(item.actual) : ""); setEditing(true); }}
      className="text-sm text-MainOffWhiteText hover:text-MainBlue transition-colors text-left"
      title="Click to edit actual"
    >
      {fmt(item.actual)}
    </button>
  );
};

const BudgetItemsTable = ({ items, onUpdate, onDelete }) => {
  if (!items.length) return (
    <p className="text-center text-SecondOffWhiteText text-sm py-6">No expense items yet. Add one above.</p>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-LineBox">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-LineBox bg-NavigationBackground">
            {["Label", "Category", "Estimated", "Actual", ""].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-SecondOffWhiteText uppercase tracking-wide">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr
              key={item._id}
              className={`border-b border-LineBox last:border-0 transition-colors ${
                item._optimistic ? "opacity-60" : "hover:bg-NavigationBackground/50"
              }`}
            >
              <td className="px-4 py-3 text-MainOffWhiteText font-medium">{item.label}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${CATEGORY_STYLE[item.category] ?? CATEGORY_STYLE.Other}`}>
                  {item.category}
                </span>
              </td>
              <td className="px-4 py-3 text-MainOffWhiteText">{fmt(item.estimated)}</td>
              <td className="px-4 py-3">
                {item._optimistic
                  ? <span className="text-SecondOffWhiteText">{fmt(item.actual)}</span>
                  : <ActualCell item={item} onUpdate={onUpdate} />
                }
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onDelete(item._id)}
                  disabled={!!item._optimistic}
                  className="text-SecondOffWhiteText hover:text-MainRed transition-colors disabled:opacity-30"
                >
                  <Trash2 size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BudgetItemsTable;
