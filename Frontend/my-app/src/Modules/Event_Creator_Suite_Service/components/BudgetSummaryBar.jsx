import React from "react";

const fmt = (n) =>
  n == null ? "—" : `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

const Stat = ({ label, value, highlight }) => (
  <div className="flex-1 bg-NavigationBackground border border-LineBox rounded-xl px-4 py-3 min-w-[110px]">
    <p className="text-xs text-SecondOffWhiteText mb-1">{label}</p>
    <p className={`text-lg font-semibold ${highlight ? "text-MainRed" : "text-white"}`}>
      {value}
    </p>
  </div>
);

const BudgetSummaryBar = ({ totalBudget, items }) => {
  const totalEstimated = items.reduce((s, i) => s + (i.estimated ?? 0), 0);
  const totalActual = items.reduce((s, i) => s + (i.actual ?? 0), 0);
  const effectiveSpend = items.reduce(
    (s, i) => s + (i.actual != null ? i.actual : i.estimated ?? 0),
    0
  );
  const remaining = totalBudget - effectiveSpend;
  const overBudget = remaining < 0;

  return (
    <div className="flex flex-wrap gap-3">
      <Stat label="Total Budget"    value={fmt(totalBudget)}    />
      <Stat label="Total Estimated" value={fmt(totalEstimated)} />
      <Stat label="Total Actual"    value={fmt(totalActual)}    />
      <Stat
        label={overBudget ? "Over Budget" : "Remaining"}
        value={overBudget ? fmt(Math.abs(remaining)) : fmt(remaining)}
        highlight={overBudget}
      />
    </div>
  );
};

export default BudgetSummaryBar;
