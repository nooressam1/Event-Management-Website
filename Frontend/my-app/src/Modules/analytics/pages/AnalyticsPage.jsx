import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SideNavigationBar from "../../shared/component/SideNavigationBar";
import Footer from "../../shared/component/Footer";
import StatCard from "../../shared/component/StatCard";
import StatPercentage from "../../shared/component/StatPercentage";
import { Download, Share2, ArrowLeft } from "lucide-react";
import AttendanceRateChart from "../components/AttendanceRateChart";
import LastMinuteChangesChart from "../components/LastMinuteChangesChart";
import DietaryNeedsSummary from "../components/DietaryNeedsSummary";
import AttendeeReviews from "../components/AttendeeReviews";

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [eventData] = useState({
    title: "Tech Mixer 2024: Analytics",
    location: "San Francisco Innovation Hub",
    date: "June 12, 2024",
    totalRsvps: 428,
    rsvpChange: "-18%",
    checkIns: 356,
    checkInPercentage: "83%",
    avgSentiment: 4.9,
    sentimentChange: "+2.2%",
    netRevenue: "$12.4k",
    revenueChange: "+2.2%",
    attendance: {
      attended: 356,
      noShow: 72,
      attendanceRate: 83,
    },
    dietaryNeeds: {
      vegetarian: 42,
      vegan: 18,
      glutenFree: 25,
    },
  });

  // const handleExport = () => {
  //   console.log("Exporting analytics...");
  // };

  // const handleShare = () => {
  //   console.log("Sharing analytics...");
  // };

  return (
    <div className="flex h-screen bg-MainBackground">
     
      <SideNavigationBar />

      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        <div className="bg-NavigationBackground border-b-2 border-LineBox px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-MainBlue hover:text-MainBlue/80 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="text-sm font-medium">BACK TO EVENTS</span>
            </button>
            <div className="flex gap-3">
              <button
                // onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-900 transition-colors">
                <Download size={16} />
                <span>Export</span>
              </button>
              <button
                // onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-MainBlue text-white hover:bg-MainBlue/90 transition-colors">
                <Share2 size={16} />
                <span>Share</span>
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              {eventData.title}
            </h1>
            <p className="text-gray-400 text-sm">
              {eventData.location} • {eventData.date}
            </p>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total RSVPs"
              value={eventData.totalRsvps}
              color="blue">
              <StatPercentage percentage={eventData.rsvpChange} />
            </StatCard>
            <StatCard
              label="Check-Ins"
              value={eventData.checkIns}
              color="green">
              <div className="text-gray-300 text-xs mt-1">
                {eventData.checkInPercentage} Attend.
              </div>
            </StatCard>
            <StatCard
              label="Avg. Sentiment"
              value={`${eventData.avgSentiment}/5`}
              color="yellow">
              <div className="text-gray-300 text-xs mt-1">⭐⭐⭐⭐⭐</div>
            </StatCard>

            <StatCard
              label="Net Revenue"
              value={eventData.netRevenue}
              color="red">
              <StatPercentage percentage={eventData.revenueChange} />
            </StatCard>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-NavigationBackground border-2 border-LineBox rounded-2xl p-6">
              <h3 className="text-white font-bold mb-6">Attendance Rate</h3>
              <AttendanceRateChart
                attended={eventData.attendance.attended}
                noShow={eventData.attendance.noShow}
                attendanceRate={eventData.attendance.attendanceRate}
              />
            </div>
            <div className="bg-NavigationBackground border-2 border-LineBox rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold">Last-minute Changes</h3>
                <span className="text-MainGreen text-xs font-bold">
                  HIGH ACTIVITY WINDOW
                </span>
              </div>
              <LastMinuteChangesChart />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-NavigationBackground border-2 border-LineBox rounded-2xl p-6">
              <h3 className="text-white font-bold mb-6">Dietary Needs Summary</h3>
              <DietaryNeedsSummary data={eventData.dietaryNeeds} />
            </div>
            <div className="bg-NavigationBackground border-2 border-LineBox rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white font-bold">Attendee feedback</h3>
                <a href="#" className="text-MainBlue text-xs hover:underline">
                  View all →
                </a>
              </div>
              <AttendeeReviews />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AnalyticsPage;
