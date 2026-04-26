import { useParams } from "react-router-dom";
import { Calendar, Clock, Info, MapPin } from "lucide-react";

import CustomButton from "../../shared/components/CustomButton";
import LabeledInput from "../../shared/components/LabeledInput";
import EventDetails from "../components/EventDetails";
import RsvpStatus from "../components/rsvpStatus";
import PlusOne from "../components/plusOne";
import PublicRsvpSuccess from "../components/PublicRsvpSuccess";
import usePublicEvent from "../hooks/usePublicEvent";

import EventPhoto from "../../../assets/eventphoto.jpg";
import checkMark from "../../../assets/checkMark.png";
import cancel from "../../../assets/cancel.png";

const PublicEventPage = () => {
  const { inviteCode } = useParams();
  const { event, loading, fetchError, rsvpStatus, plusOne, submitResult, submitError, formik, handleRsvpChange, handlePlusOneChange } = usePublicEvent(inviteCode);

  if (loading)
    return (
      <div className="h-screen w-full flex justify-center items-center bg-MainBackground">
        <p className="text-white font-inter">Loading event...</p>
      </div>
    );

  if (fetchError)
    return (
      <div className="h-screen w-full flex justify-center items-center bg-MainBackground">
        <p className="text-MainRed font-inter text-center px-6">{fetchError}</p>
      </div>
    );

  if (submitResult) return <PublicRsvpSuccess event={event} rsvp={submitResult} />;

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-MainBackground w-full flex gap-8 px-6 sm:px-10 lg:px-20 py-10 flex-col min-h-screen">
      {/* Hero */}
      <div className="relative rounded-2xl flex flex-col overflow-hidden justify-center items-center w-full h-56 sm:h-80 lg:h-[520px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(10,25,47,1)), url(${event.coverImage || EventPhoto})` }}
        />
        <div className="relative z-10 flex flex-col gap-4 justify-center items-center px-6 text-center">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">{event.title}</h1>
          <p className="text-xs sm:text-sm font-inter font-light text-MainOffWhiteText max-w-lg">
            {event.shortDescription || event.description}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left - Event Info */}
        <div className="flex flex-col gap-8 flex-1">
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-3">
              <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-sm">
                <Info size={22} className="text-MainBlue" strokeWidth={1.5} />
              </div>
              <h1 className="text-white font-jakarta font-black text-lg">Event Details</h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <EventDetails title="Date" placeholdervalue={formattedDate} icon={Calendar} />
              <EventDetails title="Time" placeholdervalue={formattedTime} icon={Clock} />
            </div>
          </div>

          {event.location?.address && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-row items-center gap-3">
                <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-sm">
                  <MapPin size={22} className="text-MainBlue" strokeWidth={1.5} />
                </div>
                <h1 className="text-white font-jakarta font-black text-lg">Location</h1>
              </div>
              <p className="text-MainOffWhiteText font-inter text-sm">{event.location.address}</p>
            </div>
          )}

          {event.description && (
            <div className="flex flex-col gap-2">
              <h1 className="text-white font-jakarta font-black text-lg">About the Event</h1>
              <p className="text-MainOffWhiteText font-inter font-normal text-sm leading-relaxed">{event.description}</p>
            </div>
          )}
        </div>

        {/* Right - RSVP Form */}
        <div className="bg-NavigationBackground flex flex-col gap-5 border-LineBox border-2 rounded-xl px-6 sm:px-8 py-8 w-full lg:w-[420px] shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-white font-jakarta font-black text-xl sm:text-2xl">Are you coming?</h1>
            <p className="text-MainOffWhiteText font-inter font-normal text-sm">Let the organiser know!</p>
          </div>

          <div className="flex flex-row gap-4">
            <RsvpStatus title="I'm Going!" image={checkMark} value={rsvpStatus === "going"} onChange={() => handleRsvpChange("going")} />
            <RsvpStatus title="Can't Make it" image={cancel} value={rsvpStatus === "not_going"} onChange={() => handleRsvpChange("not_going")} />
          </div>
          {formik.touched.rsvpStatus && formik.errors.rsvpStatus && (
            <p className="text-MainRed text-sm">{formik.errors.rsvpStatus}</p>
          )}

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 w-full">
            <div className="w-full">
              <LabeledInput label="Full Name" isIcon={false} placeholder="John Doe" text={formik.values.guestName} type="text" setText={(v) => formik.setFieldValue("guestName", v)} />
              {formik.touched.guestName && formik.errors.guestName && <p className="text-MainRed text-sm mt-1">{formik.errors.guestName}</p>}
            </div>

            <div className="w-full">
              <LabeledInput label="Email Address" isIcon={false} placeholder="you@example.com" text={formik.values.guestEmail} type="email" setText={(v) => formik.setFieldValue("guestEmail", v)} />
              {formik.touched.guestEmail && formik.errors.guestEmail && <p className="text-MainRed text-sm mt-1">{formik.errors.guestEmail}</p>}
            </div>

            {event.allowPlusOnes && (
              <>
                <PlusOne value={plusOne} onChange={handlePlusOneChange} />
                {plusOne && (
                  <div className="flex flex-col gap-5">
                    <div className="w-full">
                      <LabeledInput label="Plus One's Full Name" isIcon={false} placeholder="Jane Doe" text={formik.values.plusOneFullname} type="text" setText={(v) => formik.setFieldValue("plusOneFullname", v)} />
                      {formik.touched.plusOneFullname && formik.errors.plusOneFullname && <p className="text-MainRed text-sm mt-1">{formik.errors.plusOneFullname}</p>}
                    </div>
                    <div className="w-full">
                      <LabeledInput label="Plus One's Dietary Requirements" isIcon={false} placeholder="Vegetarian, nut allergy..." text={formik.values.plusOneDietaryRequirements} type="text" setText={(v) => formik.setFieldValue("plusOneDietaryRequirements", v)} />
                    </div>
                  </div>
                )}
              </>
            )}

            {submitError && <p className="text-MainRed text-sm">{submitError}</p>}

            <CustomButton type="submit" title={formik.isSubmitting ? "Submitting..." : "Confirm My Attendance"} className="bg-MainBlue px-8 py-4 text-white rounded-lg w-full" />
          </form>

          <p className="text-MainOffWhiteText text-center font-inter font-normal text-sm">
            By clicking confirm, you agree to our <span className="text-MainBlue">event terms</span> and{" "}
            <span className="text-MainBlue">privacy policy.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicEventPage;
