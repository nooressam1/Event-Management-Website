import { Calendar, Clock, PartyPopper, UserPen } from "lucide-react";
import React from "react";
import CustomButton from "../../shared/component/CustomButton";
import EventDetails from "./EventDetails";

const SubmittedResponse = ({ invitationData,onUpdateClick }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case "ATTENDING":
        return "border-MainGreenLine bg-MainGreenBackground border-0.5 text-MainGreen";
      case "DECLINED":
        return "text-OffRed border-OffRedLine border-0.5 bg-OffRedbackground";
      case "WAITLISTED":
        return "text-MainYellow bg-MainYellowBackground border-0.5 border-MainYellowLine";
      default:
        return "border-gray-500 text-gray-400";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ATTENDING": return "Confirmed";
      case "DECLINED": return "Declined";
      case "WAITLISTED": return "Waitlisted";
      default: return status;
    }
  };

  const getStatusContent = (status, eventTitle) => {
    switch (status) {
      case "ATTENDING":
        return {
          headerStart: "You're",
          headerHighlight: "Going!",
          subheader: `Your spot is secured for ${eventTitle}. We can't wait to see you there!`,
        };
      case "DECLINED":
        return {
          headerStart: "You've",
          headerHighlight: "Declined",
          subheader: `We're sorry you can't make it to ${eventTitle}. You can change your response anytime.`,
        };
      case "WAITLISTED":
        return {
          headerStart: "You're on the",
          headerHighlight: "Waitlist",
          subheader: `We'll notify you if a spot opens up for ${eventTitle}. Hang tight!`,
        };
      default:
        return {
          headerStart: "Awaiting",
          headerHighlight: "Response",
          subheader: `Let us know if you'll be joining us for ${eventTitle}.`,
        };
    }
  };

  const { headerStart, headerHighlight, subheader } = getStatusContent(
    invitationData.rsvp.status,
    invitationData.event.title,
  );

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 justify-center items-stretch bg-MainBackground px-4 sm:px-6 lg:px-10 py-10">
      
      {/* Left - Status Card */}
      <div
        style={{
          background: `
            radial-gradient(circle at 50% 0%, rgba(46, 144, 255, 0.15), rgba(46, 144, 255, 0)),
            radial-gradient(circle at 50% 70%, rgba(25, 120, 229, 0.10), rgba(25, 120, 229, 0))
          `,
        }}
        className="border-2 border-LineBox flex flex-col gap-6 px-6 sm:px-8 py-10 sm:py-16 rounded-3xl w-full lg:max-w-sm"
      >
        <div className="flex justify-center items-center bg-MainBlue/15 p-3 rounded-2xl border border-MainBlue/40 w-fit">
          <PartyPopper size={36} className="text-MainBlue" strokeWidth={1.5} />
        </div>

        <h1 className="text-white font-inter font-black text-3xl sm:text-5xl">
          {headerStart} <br />
          <span className="text-MainBlue">{headerHighlight}</span>
        </h1>

        <p className="text-MainOffWhiteText font-inter font-normal text-sm sm:text-base leading-relaxed">
          {subheader}
        </p>
      </div>

      {/* Right - Event Summary */}
      <div className="bg-NavigationBackground flex flex-col gap-6 border-LineBox border-2 rounded-3xl px-6 sm:px-8 py-10 w-full lg:w-[580px] shrink-0">
        
        {/* Header */}
        <div className="flex flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-white font-jakarta font-black text-xl sm:text-2xl">
              Event Summary
            </h1>
            <p className="text-MainOffWhiteText font-inter font-normal text-sm">
              Review your schedule and location details.
            </p>
          </div>
          <div className={`border-2 rounded-3xl px-4 py-1.5 w-fit h-fit shrink-0 ${getStatusStyle(invitationData.rsvp.status)}`}>
            <p className="font-inter font-medium text-sm">
              {getStatusLabel(invitationData.rsvp.status)}
            </p>
          </div>
        </div>

        {/* Event Details */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <EventDetails
              title="Date"
              placeholdervalue={new Date(invitationData.event.date).toLocaleDateString()}
              icon={Calendar}
            />
            <EventDetails
              title="Time"
              placeholdervalue={new Date(invitationData.event.date).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
              icon={Clock}
            />
          </div>

          <EventDetails
            title="Location"
            placeholdervalue={invitationData.event.location?.address || "TBD"}
            icon={Calendar}
          />

          <CustomButton
            type="submit"
            icon={UserPen}
            onClick={onUpdateClick}
            title="Update Response"
            className="text-MainBlue bg-MainBlueBackground border border-MainBlue px-8 py-4 rounded-lg w-full mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SubmittedResponse;