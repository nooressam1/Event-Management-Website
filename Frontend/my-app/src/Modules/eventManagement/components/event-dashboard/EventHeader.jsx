import { useState } from "react";
import { Calendar, MapPin, Edit2, Share2, Link2Off, ChevronDown, Trash2, Copy, Check } from "lucide-react";
import MoreActionsMenu from "./MoreActionsMenu";

const STATUS_BADGE = {
  PUBLISHED:  { label: "LIVE",      style: "bg-MainGreenBackground text-MainGreen border-MainGreenLine" },
  DRAFT:      { label: "DRAFT",     style: "bg-MainBlueBackground text-MainBlue border-MainBlueLine" },
  COMPLETED:  { label: "PAST",      style: "bg-LineBox text-MainOffWhiteText border-LineBox" },
  CANCELLED:  { label: "CANCELLED", style: "bg-OffRedbackground text-MainRed border-OffRedbackground" },
};

const INVITE_BASE = `${window.location.origin}/event/`;

const EventHeader = ({ event, revoking, settingStatus, onEdit, onRevokeInvite, onSetStatus, onDeleteClick }) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const statusInfo = STATUS_BADGE[event.status] ?? STATUS_BADGE.DRAFT;
  const isLive = event.status === "PUBLISHED";
  const isTerminal = event.status === "COMPLETED" || event.status === "CANCELLED";

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  const inviteLink = event.inviteCode ? `${INVITE_BASE}${event.inviteCode}` : null;

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setShareToast(true);
    setShowShareMenu(false);
    setTimeout(() => setShareToast(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!inviteLink) return;
    window.open(`https://wa.me/?text=${encodeURIComponent(`You're invited! Join here: ${inviteLink}`)}`, "_blank");
    setShowShareMenu(false);
  };

  return (
    <div className="bg-NavigationBackground border border-LineBox rounded-2xl mb-6">
      {event.coverImage && (
        <div className="h-40 w-full relative overflow-hidden rounded-t-2xl">
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-NavigationBackground/90 to-transparent" />
        </div>
      )}

      <div className="px-6 py-5 flex items-start justify-between gap-4">
        {/* Left: meta */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest border ${statusInfo.style}`}>
              {statusInfo.label}
            </span>
            {isLive && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-SecondOffWhiteText">
                Upcoming Event
              </span>
            )}
          </div>

          <h1 className="text-white font-jakarta font-bold text-2xl mb-2">{event.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-MainOffWhiteText text-sm">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-MainBlue shrink-0" />
              <span>{formattedDate} · {formattedTime}</span>
            </div>
            {event.location?.address && (
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-MainBlue shrink-0" />
                <span>{event.location.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-MainBackground border border-LineBox hover:border-MainBlue/50 text-MainOffWhiteText hover:text-white rounded-lg text-sm transition-colors"
          >
            <Edit2 size={13} />
            Edit
          </button>

          {event.inviteLinkActive && (
            <button
              onClick={onRevokeInvite}
              disabled={revoking}
              className="flex items-center gap-2 px-4 py-2 bg-MainYellowBackground border border-MainYellowLine hover:opacity-80 text-MainYellow rounded-lg text-sm font-semibold transition-all disabled:opacity-40"
            >
              <Link2Off size={13} />
              {revoking ? "Revoking..." : "Revoke Link"}
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setShowShareMenu((v) => !v)}
              disabled={!inviteLink}
              title={!inviteLink ? "Publish the event to generate an invite link" : "Share invite link"}
              className="flex items-center gap-2 px-4 py-2 bg-MainBlue hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-40"
            >
              {shareToast ? <Check size={13} /> : <Share2 size={13} />}
              {shareToast ? "Copied!" : "Share Invite"}
            </button>
            {showShareMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowShareMenu(false)} />
                <div className="absolute right-0 mt-2 w-44 bg-NavigationBackground border border-LineBox rounded-xl shadow-xl z-20 overflow-hidden">
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-MainOffWhiteText hover:bg-MainBackground hover:text-white transition-colors"
                  >
                    <Copy size={13} />
                    Copy Link
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-MainOffWhiteText hover:bg-MainBackground hover:text-white transition-colors"
                  >
                    <Share2 size={13} />
                    Share on WhatsApp
                  </button>
                </div>
              </>
            )}
          </div>

          {!isTerminal && (
            <div className="relative">
              <button
                onClick={() => setShowMoreMenu((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-2 bg-MainBackground border border-LineBox hover:border-MainBlue/50 text-SecondOffWhiteText hover:text-white rounded-lg text-sm transition-colors"
              >
                More <ChevronDown size={13} />
              </button>
              {showMoreMenu && (
                <MoreActionsMenu
                  isLive={isLive}
                  settingStatus={settingStatus}
                  onMarkCompleted={() => onSetStatus("COMPLETED")}
                  onCancelEvent={() => onSetStatus("CANCELLED")}
                  onDelete={onDeleteClick}
                  onClose={() => setShowMoreMenu(false)}
                />
              )}
            </div>
          )}

          {isTerminal && (
            <button
              onClick={onDeleteClick}
              className="flex items-center gap-2 px-3 py-2 bg-MainBackground border border-LineBox hover:border-MainRed/50 text-SecondOffWhiteText hover:text-MainRed rounded-lg text-sm transition-colors"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventHeader;
