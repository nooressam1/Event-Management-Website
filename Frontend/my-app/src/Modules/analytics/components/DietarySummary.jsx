import { Leaf, Sprout, Wheat, Nut, Milk, Utensils } from "lucide-react";

const ROWS = [
  {
    key: "vegetarian",
    label: "Vegetarian",
    Icon: Leaf,
    iconColor: "text-MainGreen",
    iconBg: "bg-MainGreenBackground",
    barColor: "bg-MainGreen",
  },
  {
    key: "vegan",
    label: "Vegan",
    Icon: Sprout,
    iconColor: "text-OffRed",
    iconBg: "bg-OffRedbackground",
    barColor: "bg-OffRed",
  },
  {
    key: "glutenFree",
    label: "Gluten-Free",
    Icon: Wheat,
    iconColor: "text-MainBlue",
    iconBg: "bg-MainBlueBackground",
    barColor: "bg-MainBlue",
  },
  {
    key: "nutAllergy",
    label: "Nut Allergy",
    Icon: Nut,
    iconColor: "text-MainYellow",
    iconBg: "bg-MainYellowBackground",
    barColor: "bg-MainYellow",
  },
  {
    key: "dairyFree",
    label: "Dairy-Free",
    Icon: Milk,
    iconColor: "text-MainOffWhiteText",
    iconBg: "bg-LineBox",
    barColor: "bg-MainOffWhiteText",
  },
  {
    key: "other",
    label: "Other",
    Icon: Utensils,
    iconColor: "text-SecondOffWhiteText",
    iconBg: "bg-LineBox",
    barColor: "bg-SecondOffWhiteText",
  },
];

const DietarySummary = ({ dietary = {} }) => {
  const { breakdown = {}, total = 0 } = dietary;
  const max = Math.max(...Object.values(breakdown), 1);

  const visibleRows = ROWS.filter((r) => (breakdown[r.key] ?? 0) > 0);

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-jakarta font-bold text-sm">
          Dietary Needs Summary
        </h3>
        <span className="text-[10px] uppercase tracking-widest font-bold text-SecondOffWhiteText">
          {total} requests
        </span>
      </div>

      {visibleRows.length === 0 ? (
        <p className="text-SecondOffWhiteText text-xs text-center py-8">
          No dietary preferences collected for this event.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {visibleRows.map(
            ({ key, label, Icon, iconColor, iconBg, barColor }) => {
              const count = breakdown[key] ?? 0;
              const pct = max > 0 ? (count / max) * 100 : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon size={16} className={iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-MainOffWhiteText text-sm">
                        {label}
                      </span>
                      <span className="text-white font-jakarta font-bold text-sm">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-MainBackground rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
};

export default DietarySummary;
