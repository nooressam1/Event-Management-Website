import React from "react";
import { Eye, Calendar, MapPin } from "lucide-react";

const PLACEHOLDER_IMG =
  "https://images.unsplash.com/photo-1540575861501-7cf05a4b125a?auto=format&fit=crop&q=80&w=800";

const GuestViewPreview = ({ formData }) => {
  const { title, description, date, time, location, coverImage } = formData;

  const eventDate = date ? new Date(`${date}T${time || "00:00"}`) : null;

  const monthLabel = eventDate
    ? eventDate.toLocaleDateString("en-US", { month: "short" }).toUpperCase()
    : "—";
  const dayLabel = eventDate ? eventDate.getDate() : "—";

  const dateTimeLabel = eventDate
    ? `${eventDate.toLocaleDateString("en-US", { weekday: "long" })} • ${
        time
          ? new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Time TBD"
      }`
    : "Date & Time TBD";

  return (
    <div className="hidden lg:block w-72 shrink-0">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <Eye size={14} className="text-MainBlue" />
        <span className="text-[10px] uppercase tracking-widest font-bold text-SecondOffWhiteText">
          Guest View Preview
        </span>
      </div>

      {/* Card */}
      <div className="bg-NavigationBackground border border-LineBox rounded-2xl overflow-hidden">
        {/* Cover image with date badge */}
        <div className="relative h-40">
          <img
            src={coverImage || PLACEHOLDER_IMG}
            alt="cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3 bg-NavigationBackground/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center min-w-[44px]">
            <div className="text-MainBlue text-[10px] font-bold leading-none">
              {monthLabel}
            </div>
            <div className="text-white font-jakarta font-bold text-xl leading-tight">
              {dayLabel}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4">
          <h3 className="text-white font-jakarta font-bold text-base mb-1 leading-snug">
            {title || "Event Name"}
          </h3>
          <p className="text-MainOffWhiteText text-xs mb-4 line-clamp-2 leading-relaxed">
            {description || "Your event description will appear here."}
          </p>

          {/* Date & Location rows */}
          <div className="space-y-2.5 mb-4">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-LineBox flex items-center justify-center shrink-0">
                <Calendar size={12} className="text-MainOffWhiteText" />
              </div>
              <div>
                <p className="text-[9px] text-SecondOffWhiteText uppercase font-bold tracking-wider">
                  Date & Time
                </p>
                <p className="text-MainOffWhiteText text-xs">{dateTimeLabel}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-LineBox flex items-center justify-center shrink-0">
                <MapPin size={12} className="text-MainOffWhiteText" />
              </div>
              <div>
                <p className="text-[9px] text-SecondOffWhiteText uppercase font-bold tracking-wider">
                  Location
                </p>
                <p className="text-MainOffWhiteText text-xs">
                  {location || "Location TBD"}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button className="w-full bg-MainBlue text-white py-2 rounded-lg font-bold text-xs uppercase tracking-widest mb-3">
            Get Tickets
          </button>

          {/* Attendees + visibility */}
          <div className="flex items-center justify-between">
            <div className="flex -space-x-1.5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-LineBox border-2 border-NavigationBackground"
                />
              ))}
              <div className="w-6 h-6 rounded-full bg-MainBlue/20 border-2 border-NavigationBackground flex items-center justify-center text-[8px] text-MainBlue font-bold">
                +12
              </div>
            </div>
            <span className="text-[9px] text-SecondOffWhiteText uppercase font-bold tracking-wider">
              Public Event
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestViewPreview;
