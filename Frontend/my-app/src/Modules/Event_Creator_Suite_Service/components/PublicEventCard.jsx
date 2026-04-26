import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import CustomButton from "../../shared/component/CustomButton";
import EventPhoto from "../../../assets/eventphoto.jpg";

const PublicEventCard = ({ event }) => {
  const navigate = useNavigate();
  const { title, date, capacity, rsvpCount = 0, coverImage, shortDescription, location, inviteCode } = event;

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

  const spotsLeft = Math.max(0, capacity - rsvpCount);
  const isFull = spotsLeft === 0;

  const handleJoin = (e) => {
    e.stopPropagation();
    navigate(`/event/${inviteCode}`);
  };

  return (
    <div
      onClick={() => navigate(`/event/${inviteCode}`)}
      className="bg-NavigationBackground border border-LineBox rounded-xl overflow-hidden flex flex-col group cursor-pointer hover:border-MainBlue/50 transition-all"
    >
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={coverImage || EventPhoto}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-NavigationBackground/60 to-transparent" />
        {isFull && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-OffRedbackground text-OffRed">
              Full
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        <h3 className="text-white font-jakarta font-semibold text-lg leading-snug">
          {title}
        </h3>

        {shortDescription && (
          <p className="text-MainOffWhiteText text-sm leading-relaxed line-clamp-2">
            {shortDescription}
          </p>
        )}

        <div className="flex flex-col gap-1.5 text-MainOffWhiteText text-sm">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="shrink-0" />
            <span>{formattedDate}</span>
            <span className="text-SecondOffWhiteText">•</span>
            <Clock size={13} className="shrink-0" />
            <span>{formattedTime}</span>
          </div>
          {location?.address && (
            <div className="flex items-center gap-2">
              <MapPin size={13} className="shrink-0" />
              <span className="truncate">{location.address}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users size={13} className="shrink-0" />
            <span>
              {isFull ? (
                <span className="text-OffRed">No spots left</span>
              ) : (
                <span>
                  <span className="text-MainGreen">{spotsLeft}</span>
                  <span className="text-SecondOffWhiteText"> spots left</span>
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="mt-auto pt-2">
          <CustomButton
            onClick={handleJoin}
            title={isFull ? "Join Waitlist" : "Join Event"}
            className="w-full bg-MainBlue hover:bg-blue-600 text-white py-2.5 rounded-lg font-semibold text-sm transition-colors"
          />
        </div>
      </div>
    </div>
  );
};

export default PublicEventCard;
