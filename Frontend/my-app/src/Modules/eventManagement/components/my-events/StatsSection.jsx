import React from "react";
import { Radio, Ticket, Bell } from "lucide-react";

const StatItem = ({ label, value, Icon, iconColor, children }) => (
  <div className="flex-1 bg-NavigationBackground border border-LineBox rounded-2xl p-5 flex flex-col justify-between min-h-28">
    <div className="flex justify-between items-center mb-4">
      <span className="text-MainOffWhiteText text-[11px] font-bold tracking-widest uppercase">
        {label}
      </span>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <h2 className="text-white text-3xl font-bold tracking-tight font-jakarta">
        {value?.toLocaleString() ?? "—"}
      </h2>
      {children}
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="flex-1 bg-NavigationBackground border border-LineBox rounded-2xl p-5 min-h-28 animate-pulse">
    <div className="h-3 w-24 bg-LineBox rounded mb-6" />
    <div className="h-8 w-16 bg-LineBox rounded" />
  </div>
);

const StatsSection = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex gap-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      <StatItem
        label="Active Events"
        value={stats?.activeEvents}
        Icon={Radio}
        iconColor="text-MainBlue"
      >
        <p className="text-MainGreen text-sm mt-1 font-medium">↑ Live now</p>
      </StatItem>

      <StatItem
        label="Total RSVPs (Month)"
        value={stats?.totalRSVPs}
        Icon={Ticket}
        iconColor="text-MainBlue"
      >
        <p className="text-MainGreen text-sm mt-1 font-medium">↑ This month</p>
      </StatItem>

      <StatItem
        label="Upcoming Deadlines"
        value={stats?.upcomingDeadlines}
        Icon={Bell}
        iconColor="text-MainYellow"
      >
        {stats?.upcomingDeadlines > 0 ? (
          <p className="text-MainRed text-sm mt-1 font-semibold">! Urgent</p>
        ) : (
          <p className="text-MainGreen text-sm mt-1 font-medium">All clear</p>
        )}
      </StatItem>
    </div>
  );
};

export default StatsSection;
