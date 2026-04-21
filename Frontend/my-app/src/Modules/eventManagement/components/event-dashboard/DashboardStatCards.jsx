import React from "react";
import { Users, Clock, XCircle, BarChart2 } from "lucide-react";

const cards = [
  {
    key: "confirmed",
    label: "Confirmed",
    icon: Users,
    iconColor: "text-MainGreen",
    iconBg: "bg-MainGreenBackground",
    valueColor: "text-MainGreen",
    badgeColor: "text-MainGreen bg-MainGreenBackground",
  },
  {
    key: "waitlisted",
    label: "Waitlisted",
    icon: Clock,
    iconColor: "text-MainYellow",
    iconBg: "bg-MainYellowBackground",
    valueColor: "text-MainYellow",
    badgeColor: "text-MainYellow bg-MainYellowBackground",
  },
  {
    key: "declined",
    label: "Declined",
    icon: XCircle,
    iconColor: "text-MainRed",
    iconBg: "bg-OffRedbackground",
    valueColor: "text-MainRed",
    badgeColor: "text-MainRed bg-OffRedbackground",
  },
];

const DashboardStatCards = ({ rsvpStats = {}, capacity = 0 }) => {
  const { confirmed = 0, waitlisted = 0, declined = 0 } = rsvpStats;
  const total = confirmed + waitlisted + declined;
  const capacityPct = capacity > 0 ? Math.min((confirmed / capacity) * 100, 100) : 0;

  const values = { confirmed, waitlisted, declined };
  const pcts = {
    confirmed: total > 0 ? ((confirmed / total) * 100).toFixed(0) : 0,
    waitlisted: total > 0 ? ((waitlisted / total) * 100).toFixed(0) : 0,
    declined: total > 0 ? ((declined / total) * 100).toFixed(0) : 0,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map(({ key, label, icon: Icon, iconColor, iconBg, valueColor, badgeColor }) => (
        <div
          key={key}
          className="bg-NavigationBackground border border-LineBox rounded-2xl p-5 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
              <Icon size={18} className={iconColor} />
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
              {pcts[key]}%
            </span>
          </div>
          <div>
            <p className={`text-2xl font-jakarta font-bold ${valueColor}`}>
              {values[key].toLocaleString()}
            </p>
            <p className="text-SecondOffWhiteText text-xs mt-0.5">{label} guests</p>
          </div>
        </div>
      ))}

      {/* Capacity card */}
      <div className="bg-NavigationBackground border border-LineBox rounded-2xl p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-xl bg-MainBlueBackground flex items-center justify-center">
            <BarChart2 size={18} className="text-MainBlue" />
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-MainBlue bg-MainBlueBackground">
            {capacityPct.toFixed(0)}%
          </span>
        </div>
        <div>
          <p className="text-2xl font-jakarta font-bold text-MainBlue">
            {capacity.toLocaleString()}
          </p>
          <p className="text-SecondOffWhiteText text-xs mt-0.5">Total capacity</p>
          <div className="mt-2 h-1.5 bg-MainBackground rounded-full overflow-hidden">
            <div
              className="h-full bg-MainBlue transition-all duration-500"
              style={{ width: `${capacityPct}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStatCards;
