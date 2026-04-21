import { CheckCircle, XCircle, Trash2 } from "lucide-react";

const MoreActionsMenu = ({ isLive, settingStatus, onMarkCompleted, onCancelEvent, onDelete, onClose }) => (
  <>
    <div className="fixed inset-0 z-10" onClick={onClose} />
    <div className="absolute right-0 top-full mt-1 w-52 bg-NavigationBackground border border-LineBox rounded-xl shadow-xl z-20 overflow-hidden py-1">
      {isLive && (
        <button
          onClick={() => { onMarkCompleted(); onClose(); }}
          disabled={settingStatus}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-MainOffWhiteText hover:bg-LineBox/50 hover:text-white transition-colors text-left"
        >
          <CheckCircle size={14} className="text-MainGreen" />
          Mark as Completed
        </button>
      )}
      <button
        onClick={() => { onCancelEvent(); onClose(); }}
        disabled={settingStatus}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-MainOffWhiteText hover:bg-LineBox/50 hover:text-white transition-colors text-left"
      >
        <XCircle size={14} className="text-MainYellow" />
        Cancel Event
      </button>
      <div className="border-t border-LineBox my-1" />
      <button
        onClick={() => { onDelete(); onClose(); }}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-MainRed hover:bg-OffRedbackground transition-colors text-left"
      >
        <Trash2 size={14} />
        Delete Event
      </button>
    </div>
  </>
);

export default MoreActionsMenu;
