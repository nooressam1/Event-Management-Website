import StatCard from "../../shared/components/StatCard";
import CustomButton from "../../shared/components/CustomButton";
import { CircleCheck, Users, Check, Trash } from "lucide-react";
import StatBar from "../../shared/components/StatBar";

const timeAgo = (dateStr) => {
  const diff = Math.floor((new Date() - new Date(dateStr)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ManageAttendeesStats = ({ eventInfo, attendingCount, selectedGuests, actionLabel, onAction, recentActivity }) => (
  <div className="hidden md:flex flex-row w-[25%] gap-5 sticky top-0">
    <div className="h-full w-0.5 bg-LineBox" />
    <div className="flex flex-col w-full justify-between gap-5">
      <div className="flex w-full flex-col gap-5">
        <StatCard label="Capacity left" value={eventInfo?.event?.capacity - attendingCount} color="blue" icon={Users}>
          <StatBar current={attendingCount} total={eventInfo?.event?.capacity} />
        </StatCard>
        <div className="flex flex-col gap-3">
          <h1 className="text-MainOffWhiteText font-inter text-sm">Quick Actions</h1>
          <CustomButton
            type="button"
            title={`${actionLabel} (${selectedGuests.length})`}
            icon={CircleCheck}
            onClick={onAction}
            className="bg-MainBlue px-8 py-4 text-sm text-white rounded-lg w-full"
          />
        </div>
      </div>
      <div className="flex flex-row w-full justify-between border-dotted items-center rounded-lg bg-MainBlueBackground border-LineBox border-2 py-4 px-5 gap-5">
        <div className="flex flex-col gap-3">
          <h1 className="text-MainOffWhiteText font-inter uppercase font-medium text-sm">Recent Activity</h1>
          {recentActivity.length === 0 ? (
            <p className="text-MainOffWhiteText font-inter text-sm pl-3">No recent activity</p>
          ) : (
            recentActivity.map((activity, i) => (
              <div key={i} className="flex gap-2 pl-3">
                {activity.type === "confirmed" ? (
                  <Check className="text-MainGreen" size={20} strokeWidth={2} />
                ) : (
                  <Trash className="text-MainRed" size={20} strokeWidth={2} />
                )}
                <p className={`font-inter font-normal text-sm ${activity.type === "confirmed" ? "text-white" : "text-MainRed"}`}>
                  {activity.name} was {activity.type === "confirmed" ? "approved" : "removed"} • {timeAgo(activity.time.toISOString())}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ManageAttendeesStats;
