import React, { useState } from "react";
import { Link2, Copy, Check, Clock, Palette, ClipboardList, ChevronRight, PartyPopper } from "lucide-react";
import SectionCard from "../primitives/SectionCard";
import CustomButton from "../../../shared/component/CustomButton";

const INVITE_BASE = `${window.location.origin}/event/`;

// Quick-share platforms
const SHARE_BUTTONS = [
  {
    label: "WhatsApp",
    color: "bg-[#0D2018] border-[#1A4A30] text-[#25D366]",
    hoverGlow: "hover:shadow-[0_0_14px_rgba(37,211,102,0.25)] hover:border-[#25D366]/50",
    getUrl: (link, title) =>
      `https://wa.me/?text=${encodeURIComponent(`You're invited to ${title}! ${link}`)}`,
  },
  {
    label: "Email",
    color: "bg-MainBlueBackground border-MainBlueLine text-MainBlue",
    hoverGlow: "hover:shadow-[0_0_14px_rgba(25,120,229,0.25)] hover:border-MainBlue/50",
    getUrl: (link, title) =>
      `mailto:?subject=${encodeURIComponent(`You're invited: ${title}`)}&body=${encodeURIComponent(`Join us! ${link}`)}`,
  },
  {
    label: "Slack",
    color: "bg-[#1A1019] border-[#3D1F4A] text-[#A855F7]",
    hoverGlow: "hover:shadow-[0_0_14px_rgba(168,85,247,0.25)] hover:border-[#A855F7]/50",
    getUrl: (link) => `https://slack.com/share?url=${encodeURIComponent(link)}`,
  },
];

const FINAL_ADJUSTMENTS = [
  { icon: Clock, label: "Set RSVP Deadline", subtitle: "Close registrations automatically", color: "text-MainYellow", bg: "bg-MainYellowBackground" },
  { icon: Palette, label: "Customize Theme", subtitle: "Edit colors & landing page visuals", color: "text-[#A855F7]", bg: "bg-[#1A1019]" },
  { icon: ClipboardList, label: "Registration Form", subtitle: "Add custom attendee questions", color: "text-MainBlue", bg: "bg-MainBlueBackground" },
];

const Step3InviteGuests = ({ event }) => {
  const [copied, setCopied] = useState(false);

  const inviteLink = event?.inviteCode
    ? `${INVITE_BASE}${event.inviteCode}`
    : `${INVITE_BASE}preview`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Left column */}
      <div className="flex-1 space-y-4 min-w-0">
        {/* Success card */}
        <SectionCard className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-MainBlue/20 flex items-center justify-center mb-4">
            <PartyPopper size={28} className="text-MainBlue" />
          </div>
          <h3 className="text-white font-jakarta font-bold text-xl mb-2">
            {event?.title ?? "Your Event"}
          </h3>
          <p className="text-MainOffWhiteText text-sm max-w-xs">
            Successfully created. Your custom dashboard is ready to track
            attendees.
          </p>
        </SectionCard>

        {/* Invite link card */}
        <SectionCard className="space-y-4">
          <div className="flex items-center gap-2">
            <Link2 size={14} className="text-MainBlue" />
            <span className="text-white text-sm font-semibold">Event Invite Link</span>
          </div>

          {/* URL row */}
          <div className="flex gap-2">
            <input
              readOnly
              value={inviteLink}
              className="flex-1 bg-MainBackground border border-LineBox rounded-lg px-3 py-2.5 text-SecondOffWhiteText text-xs font-mono truncate focus:outline-none"
            />
            <CustomButton
              title={copied ? "Copied!" : "Copy"}
              icon={copied ? Check : Copy}
              iconPosition="LEFT"
              onClick={copyLink}
              className={`px-4 py-2.5 rounded-lg text-sm font-semibold shrink-0 ${
                copied
                  ? "bg-MainGreen/20 text-MainGreen border border-MainGreenLine"
                  : "bg-MainBlue hover:bg-blue-600 text-white"
              }`}
            />
          </div>

          {/* Quick share */}
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-SecondOffWhiteText mb-3">
              Quick Share To
            </p>
            <div className="flex gap-2">
              {SHARE_BUTTONS.map(({ label, color, hoverGlow, getUrl }) => (
                <a
                  key={label}
                  href={getUrl(inviteLink, event?.title ?? "")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 py-3.5 rounded-xl border text-xs font-semibold text-center transition-all duration-200 ${color} ${hoverGlow}`}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Right column: Final Adjustments */}
      <div className="w-72 shrink-0">
        <SectionCard title="Final Adjustments">
          <div className="space-y-2">
            {FINAL_ADJUSTMENTS.map(({ icon: Icon, label, subtitle, color, bg }) => (
              <button
                key={label}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-LineBox/50 transition-colors text-left"
              >
                <div className={`w-9 h-9 rounded-full ${bg} flex items-center justify-center shrink-0`}>
                  <Icon size={15} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium">{label}</p>
                  <p className="text-SecondOffWhiteText text-xs">{subtitle}</p>
                </div>
                <ChevronRight size={14} className="text-SecondOffWhiteText shrink-0" />
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default Step3InviteGuests;
