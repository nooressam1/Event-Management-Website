import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EventSideBar from "../../Event_Creator_Suite_Service/components/EventSideBar";
import Footer from "../../shared/components/Footer";
import AnalyticsHeader from "../components/AnalyticsHeader";
import AnalyticsSummaryCards from "../components/AnalyticsSummaryCards";
import AttendanceDonut from "../components/AttendanceDonut";
import LastMinuteChart from "../components/LastMinuteChart";
import DietarySummary from "../components/DietarySummary";
import RSVPBreakdown from "../components/RSVPBreakdown";
import CheckInTimeline from "../components/CheckInTimeline";
import ConversionFunnel from "../components/ConversionFunnel";
import RSVPTimeline from "../components/RSVPTimeline";
import useEventAnalytics from "../hooks/useEventAnalytics";
import { getExportUrl } from "../../eventManagement/utils/eventService";

const EventAnalytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { analytics, loading, error } = useEventAnalytics(id);
  const [shareToast, setShareToast] = useState(false);

  const handleExport = () => window.open(getExportUrl(id), "_blank");

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    } catch {
      // clipboard blocked — ignore
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-MainBackground font-inter">
        <EventSideBar event={null} activeItem="Analytics" />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto p-8 space-y-4">
            <div className="h-24 bg-NavigationBackground border border-LineBox rounded-2xl animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-32 bg-NavigationBackground border border-LineBox rounded-2xl animate-pulse"
                />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 bg-NavigationBackground border border-LineBox rounded-2xl animate-pulse"
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex h-screen bg-MainBackground font-inter">
        <EventSideBar event={null} activeItem="Analytics" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-MainRed text-sm">
            {error ?? "Analytics unavailable."}
          </p>
        </div>
      </div>
    );
  }

  const { event, summary, dietary, lastMinuteChanges, checkInTimeline, rsvpTimeline } =
    analytics;

  return (
    <div className="flex h-screen overflow-hidden bg-MainBackground font-inter">
      <EventSideBar event={event} activeItem="Analytics" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-8">
          <AnalyticsHeader
            event={event}
            onBack={() => navigate(`/events/${id}`)}
            onExport={handleExport}
            onShare={handleShare}
            shareToast={shareToast}
          />

          <AnalyticsSummaryCards summary={summary} />

          <div className="mb-6">
            <ConversionFunnel summary={summary} capacity={event.capacity} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <AttendanceDonut summary={summary} />
            <div className="lg:col-span-2">
              <LastMinuteChart buckets={lastMinuteChanges} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <DietarySummary dietary={dietary} />
            <RSVPBreakdown summary={summary} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <RSVPTimeline timeline={rsvpTimeline ?? []} />
            <CheckInTimeline timeline={checkInTimeline} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default EventAnalytics;
