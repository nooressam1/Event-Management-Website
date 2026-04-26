import { ArrowLeft, Calendar, MapPin, Download, Share2 } from "lucide-react";

const AnalyticsHeader = ({ event, onBack, onExport, onShare, shareToast }) => {
  const eventDate = event?.date ? new Date(event.date) : null;
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <div className="mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-SecondOffWhiteText hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Event
      </button>

      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-MainBlue text-xs font-jakarta font-bold uppercase tracking-widest mb-2">
            Past Event · Analytics
          </p>
          <h1 className="text-white font-jakarta font-bold text-3xl mb-2">
            {event?.title ?? "Event"}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-MainOffWhiteText text-sm">
            {event?.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={13} className="text-MainBlue shrink-0" />
                <span>{event.location}</span>
              </div>
            )}
            {formattedDate && (
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-MainBlue shrink-0" />
                <span>
                  {formattedDate}
                  {event?.time ? ` · ${event.time}` : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-MainBackground border border-LineBox hover:border-MainBlue/50 text-MainOffWhiteText hover:text-white rounded-lg text-sm transition-colors"
          >
            <Download size={13} />
            Export
          </button>
          <button
            onClick={onShare}
            className="flex items-center gap-2 px-4 py-2 bg-MainBlue hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Share2 size={13} />
            {shareToast ? "Copied!" : "Share"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsHeader;
