import React from "react";

const COLORS = {
  Venue:     "#3B82F6",
  Catering:  "#22C55E",
  Marketing: "#EAB308",
  Equipment: "#A855F7",
  Staff:     "#F97316",
  Other:     "#6B7280",
};

const SIZE = 140;
const R = 58;
const CX = SIZE / 2;
const CY = SIZE / 2;

const describeSlice = (startRad, endRad) => {
  const x1 = CX + R * Math.sin(startRad);
  const y1 = CY - R * Math.cos(startRad);
  const x2 = CX + R * Math.sin(endRad);
  const y2 = CY - R * Math.cos(endRad);
  const large = endRad - startRad > Math.PI ? 1 : 0;
  return `M ${CX} ${CY} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`;
};

const BudgetChart = ({ items }) => {
  const grouped = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + (item.estimated ?? 0);
    return acc;
  }, {});

  const data = Object.entries(grouped)
    .filter(([, v]) => v > 0)
    .map(([cat, val]) => ({ cat, val, color: COLORS[cat] ?? COLORS.Other }));

  const total = data.reduce((s, d) => s + d.val, 0);

  if (total === 0) return (
    <div className="flex items-center justify-center h-36 text-SecondOffWhiteText text-sm border border-dashed border-LineBox rounded-xl">
      Add items to see category breakdown
    </div>
  );

  let cursor = 0;
  const slices = data.map((d) => {
    const angle = (d.val / total) * 2 * Math.PI;
    const path = data.length === 1
      ? null
      : describeSlice(cursor, cursor + angle);
    cursor += angle;
    return { ...d, path };
  });

  return (
    <div className="flex items-center gap-6 bg-NavigationBackground border border-LineBox rounded-xl p-4">
      <svg width={SIZE} height={SIZE} className="shrink-0">
        {slices.map((s, i) =>
          s.path
            ? <path key={i} d={s.path} fill={s.color} stroke="#111827" strokeWidth="2" />
            : <circle key={i} cx={CX} cy={CY} r={R} fill={s.color} />
        )}
      </svg>
      <div className="space-y-1.5 flex-1 min-w-0">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-SecondOffWhiteText truncate">{s.cat}</span>
            <span className="ml-auto text-MainOffWhiteText font-medium shrink-0">
              ${s.val.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetChart;
