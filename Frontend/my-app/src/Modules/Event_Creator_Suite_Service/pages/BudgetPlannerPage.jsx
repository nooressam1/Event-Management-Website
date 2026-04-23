import React, { useState, useEffect } from "react";
import { Pencil, Check } from "lucide-react";
import useBudget from "../hooks/useBudget";
import BudgetSummaryBar from "../components/BudgetSummaryBar";
import BudgetChart from "../components/BudgetChart";
import BudgetItemsTable from "../components/BudgetItemsTable";
import AddItemForm from "../components/AddItemForm";

const BudgetPlannerPage = ({ event }) => {
  const eventId = event?._id;
  const { budget, loading, error, setError, saveTotalBudget, addItem, updateItem, deleteItem } =
    useBudget(eventId);

  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState("");

  useEffect(() => {
    setBudgetInput(String(budget.totalBudget ?? 0));
  }, [budget.totalBudget]);

  const handleSaveBudget = () => {
    const val = Number(budgetInput);
    if (!isNaN(val) && val >= 0) saveTotalBudget(val);
    setEditingBudget(false);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-NavigationBackground border border-LineBox rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <p className="text-MainRed text-sm bg-OffRedbackground border border-OffRedLine rounded-lg px-4 py-2 flex items-center justify-between">
          {error}
          <button onClick={() => setError(null)} className="ml-3 hover:opacity-70 text-xs">✕</button>
        </p>
      )}

      {/* Total budget header */}
      <div className="flex items-center gap-3 border-b border-LineBox pb-4">
        <span className="text-sm text-SecondOffWhiteText shrink-0">Total Budget</span>
        {editingBudget ? (
          <div className="flex items-center gap-2">
            <span className="text-SecondOffWhiteText">$</span>
            <input
              autoFocus
              type="number"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSaveBudget(); if (e.key === "Escape") setEditingBudget(false); }}
              className="w-36 bg-NavigationBackground border-2 border-MainBlue rounded-xl px-3 py-1.5 text-white text-lg font-semibold outline-none"
            />
            <button onClick={handleSaveBudget} className="text-MainGreen hover:opacity-80 transition-colors">
              <Check size={18} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white">
              ${Number(budget.totalBudget).toLocaleString()}
            </span>
            <button
              onClick={() => { setBudgetInput(String(budget.totalBudget)); setEditingBudget(true); }}
              className="text-SecondOffWhiteText hover:text-MainBlue transition-colors"
            >
              <Pencil size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Summary stats */}
      <BudgetSummaryBar totalBudget={budget.totalBudget} items={budget.items ?? []} />

      {/* Chart */}
      <BudgetChart items={budget.items ?? []} />

      {/* Add item */}
      <AddItemForm onAdd={addItem} />

      {/* Items table */}
      <BudgetItemsTable
        items={budget.items ?? []}
        onUpdate={updateItem}
        onDelete={deleteItem}
      />
    </div>
  );
};

export default BudgetPlannerPage;
