import StatBar from "../../shared/component/StatBar";

const DietaryNeedsSummary = ({ data }) => {
  const { vegetarian, vegan, glutenFree } = data;
  const total = vegetarian + vegan + glutenFree;

  const dietaryItems = [
    {
      name: "Vegetarian",
      count: vegetarian,
      icon: "🥬",
      color: "text-MainGreen",
    },
    {
      name: "Vegan",
      count: vegan,
      icon: "🌱",
      color: "text-MainYellow",
    },
    {
      name: "Gluten-free",
      count: glutenFree,
      icon: "🌾",
      color: "text-MainBlue",
    },
  ];

  return (
    <div className="space-y-6">
      {dietaryItems.map((item, index) => (
        <div key={index}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{item.icon}</span>
              <span className="text-gray-300 text-sm font-medium">
                {item.name}
              </span>
            </div>
            <span className={`${item.color} font-bold text-lg`}>
              {item.count}
            </span>
          </div>
          <StatBar current={item.count} total={total} />
        </div>
      ))}
    </div>
  );
};

export default DietaryNeedsSummary;
