import { CheckCircle2, Clock3, ListOrdered, XCircle } from "lucide-react";

const STATUS_INFO = {
  ATTENDING: {
    icon: CheckCircle2,
    color: "text-MainGreen",
    bg: "bg-MainGreenBackground",
    title: "You're in!",
    message: "Your spot is confirmed. We'll send you a confirmation email shortly.",
  },
  PENDING: {
    icon: Clock3,
    color: "text-MainYellow",
    bg: "bg-MainYellowBackground",
    title: "RSVP Received",
    message: "Your RSVP is pending organizer approval. You'll receive an email once confirmed.",
  },
  WAITLISTED: {
    icon: ListOrdered,
    color: "text-MainBlue",
    bg: "bg-MainBlueBackground",
    title: "You're on the waitlist",
    message: "The event is full, but we've added you to the waitlist. We'll notify you if a spot opens up.",
  },
  DECLINED: {
    icon: XCircle,
    color: "text-MainRed",
    bg: "bg-OffRedbackground",
    title: "RSVP Submitted",
    message: "We've noted that you can't make it. Hope to see you next time!",
  },
};

const PublicRsvpSuccess = ({ event, rsvp }) => {
  const info = STATUS_INFO[rsvp.status] ?? STATUS_INFO.PENDING;
  const Icon = info.icon;
  return (
    <div className="bg-MainBackground min-h-screen flex flex-col items-center justify-center px-6 py-16 gap-8">
      <div className={`flex flex-col items-center gap-4 ${info.bg} border border-LineBox rounded-2xl px-8 sm:px-10 py-10 max-w-md w-full text-center`}>
        <Icon size={48} className={info.color} strokeWidth={1.5} />
        <h1 className="text-white font-jakarta font-black text-2xl">{info.title}</h1>
        <p className="text-MainOffWhiteText font-inter text-sm leading-relaxed">{info.message}</p>
        <div className="text-MainOffWhiteText text-sm mt-2">
          A confirmation email has been sent to{" "}
          <span className="text-white font-semibold">{rsvp.guestEmail}</span>.
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-white font-jakarta font-bold text-lg">{event.title}</h2>
        <p className="text-MainOffWhiteText text-sm mt-1">
          {new Date(event.date).toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
          })}
        </p>
      </div>
    </div>
  );
};

export default PublicRsvpSuccess;
