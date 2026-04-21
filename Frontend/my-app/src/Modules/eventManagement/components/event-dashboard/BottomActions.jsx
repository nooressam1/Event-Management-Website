import { ListChecks, Play, CheckCircle } from "lucide-react";

const BottomActions = ({ isDraft, isLive, starting, settingStatus, onStartEvent, onSetStatus }) => (
  <div className="flex items-center gap-3 mt-6">
    <button className="flex items-center gap-2 px-5 py-2.5 bg-MainBackground border border-LineBox hover:border-MainBlue/50 text-MainOffWhiteText hover:text-white rounded-lg text-sm font-semibold transition-colors">
      <ListChecks size={15} />
      Manage Waitlist
    </button>

    {isDraft && (
      <button
        onClick={onStartEvent}
        disabled={starting}
        className="flex items-center gap-2 px-5 py-2.5 bg-MainGreen hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
      >
        <Play size={15} />
        {starting ? "Publishing..." : "Publish Event"}
      </button>
    )}

    {isLive && (
      <button
        onClick={() => onSetStatus("COMPLETED")}
        disabled={settingStatus}
        className="flex items-center gap-2 px-5 py-2.5 bg-MainGreen hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
      >
        <CheckCircle size={15} />
        {settingStatus ? "Updating..." : "Mark as Completed"}
      </button>
    )}
  </div>
);

export default BottomActions;
