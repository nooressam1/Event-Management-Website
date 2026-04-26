import React, { useState } from "react";
import { Link2, Copy, Check, PartyPopper } from "lucide-react";
import SectionCard from "../primitives/SectionCard";
import CustomButton from "../../../shared/components/CustomButton";

const INVITE_BASE = `${window.location.origin}/event/`;

const SHARE_BUTTONS = [
  {
    label: "WhatsApp",
    color: "bg-MainGreenBackground border-MainGreenLine text-MainGreen",
    hoverGlow: "hover:border-MainGreen/50",
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
    color: "bg-OffRedbackground border-OffRedLine text-OffRed",
    hoverGlow: "hover:border-OffRed/50",
    getUrl: (link) => `https://slack.com/share?url=${encodeURIComponent(link)}`,
  },
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
    <div className="max-w-xl space-y-4">
      {/* Success card */}
      <SectionCard className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-MainBlue/20 flex items-center justify-center mb-4">
          <PartyPopper size={28} className="text-MainBlue" />
        </div>
        <h3 className="text-white font-jakarta font-bold text-xl mb-2">
          {event?.title ?? "Your Event"}
        </h3>
        <p className="text-MainOffWhiteText text-sm max-w-xs">
          Successfully created. Your custom dashboard is ready to track attendees.
        </p>
      </SectionCard>

      {/* Invite link card */}
      <SectionCard className="space-y-4">
        <div className="flex items-center gap-2">
          <Link2 size={14} className="text-MainBlue" />
          <span className="text-white text-sm font-semibold">Event Invite Link</span>
        </div>

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
  );
};

export default Step3InviteGuests;
