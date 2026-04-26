import { Users, UserCheck, UserX, Percent } from "lucide-react";

const formatNumber = (n) => (n ?? 0).toLocaleString();

const AnalyticsSummaryCards = ({ summary = {} }) => {
  const {
    totalRSVPs = 0,
    checkIns = 0,
    attendanceRate = 0,
    capacityUtilization = 0,
    noShows = 0,
    plusOnes = 0,
  } = summary;

  const cards = [
    {
      key: "rsvps",
      label: "Total RSVPs",
      value: formatNumber(totalRSVPs),
      hint: `${formatNumber(plusOnes)} plus-ones`,
      Icon: Users,
      iconBg: "bg-MainBlueBackground",
      iconColor: "text-MainBlue",
      valueColor: "text-MainBlue",
    },
    {
      key: "checkins",
      label: "Check-ins",
      value: formatNumber(checkIns),
      hint: `${attendanceRate}% attendance rate`,
      Icon: UserCheck,
      iconBg: "bg-MainGreenBackground",
      iconColor: "text-MainGreen",
      valueColor: "text-MainGreen",
    },
    {
      key: "noshows",
      label: "No-Shows",
      value: formatNumber(noShows),
      hint: "confirmed but didn't attend",
      Icon: UserX,
      iconBg: "bg-MainYellowBackground",
      iconColor: "text-MainYellow",
      valueColor: "text-MainYellow",
    },
    {
      key: "capacity",
      label: "Fill Rate",
      value: `${capacityUtilization}%`,
      hint: "of capacity actually attended",
      Icon: Percent,
      iconBg: "bg-OffRedbackground",
      iconColor: "text-OffRed",
      valueColor: "text-OffRed",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(
        ({ key, label, value, hint, Icon, iconBg, iconColor, valueColor }) => (
          <div
            key={key}
            className="bg-NavigationBackground border border-LineBox rounded-2xl p-5 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div
                className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}
              >
                <Icon size={18} className={iconColor} />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-SecondOffWhiteText">
                {label}
              </span>
            </div>
            <div>
              <p className={`text-3xl font-jakarta font-bold ${valueColor}`}>
                {value}
              </p>
              <p className="text-SecondOffWhiteText text-xs mt-1">{hint}</p>
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default AnalyticsSummaryCards;
