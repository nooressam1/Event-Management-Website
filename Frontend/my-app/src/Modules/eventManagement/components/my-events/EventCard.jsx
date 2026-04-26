import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import EventPhoto from "../../../../assets/eventphoto.jpg";

// Maps DB enum values → display label + badge style
const STATUS_MAP = {
  PUBLISHED: {
    label: "LIVE",
    style: "bg-MainGreenBackgroundLighter text-MainGreen",
  },
  DRAFT: {
    label: "DRAFT",
    style: "bg-MainBlueBackground text-MainBlue",
  },
  COMPLETED: {
    label: "PAST",
    style: "bg-LineBox text-MainOffWhiteText",
  },
  CANCELLED: {
    label: "CANCELLED",
    style: "bg-OffRedbackground text-MainRed",
  },
};

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const { title, date, capacity, rsvpCount = 0, status, coverImage } = event;

  const statusInfo = STATUS_MAP[status] ?? STATUS_MAP.DRAFT;
  const isPast = status === "COMPLETED";
  const progress = capacity > 0 ? Math.min((rsvpCount / capacity) * 100, 100) : 0;
  const progressBarColor = isPast ? "bg-MainGreen" : "bg-MainBlue";

  const eventDate = new Date(date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      onClick={() => navigate(`/events/${event._id}`)}
      className="bg-NavigationBackground border border-LineBox rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:border-MainBlue/50 transition-all"
    >
      {/* Image */}
      <div className="relative h-44 w-full">
        <img
          src={coverImage || EventPhoto}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${statusInfo.style}`}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-white font-jakarta font-semibold text-lg mb-3">
          {title}
        </h3>

        <div className="flex items-center text-MainOffWhiteText text-sm gap-2 mb-6">
          <Calendar size={14} />
          <span>{formattedDate}</span>
          <span className="text-SecondOffWhiteText">•</span>
          <Clock size={14} />
          <span>{formattedTime}</span>
        </div>

        {/* Capacity / Progress */}
        <div className="mt-auto">
          <div className="flex justify-between items-end mb-2">
            <span className="text-SecondOffWhiteText text-[10px] uppercase font-bold tracking-widest">
              {isPast ? "Final RSVPs" : "Capacity"}
            </span>
            <span className="text-white text-sm font-medium">
              {rsvpCount.toLocaleString()}{" "}
              <span className="text-SecondOffWhiteText">
                / {capacity.toLocaleString()}
              </span>
            </span>
          </div>
          <div className="w-full h-2 bg-MainBackground rounded-full overflow-hidden">
            <div
              className={`h-full ${progressBarColor} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
