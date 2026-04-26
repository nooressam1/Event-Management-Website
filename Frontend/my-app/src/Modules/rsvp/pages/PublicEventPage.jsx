import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Calendar, Clock, Info, MapPin, CheckCircle2, Clock3, ListOrdered, XCircle } from "lucide-react";

import CustomButton from "../../shared/component/CustomButton";
import LabeledInput from "../../shared/component/LabeledInput";
import EventDetails from "../component/EventDetails";
import RsvpStatus from "../component/rsvpStatus.jsx";
import PlusOne from "../component/plusOne.jsx";

import EventPhoto from "../../../assets/eventphoto.jpg";
import checkMark from "../../../assets/checkMark.png";
import cancel from "../../../assets/cancel.png";

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

const SuccessScreen = ({ event, rsvp }) => {
  const info = STATUS_INFO[rsvp.status] ?? STATUS_INFO.PENDING;
  const Icon = info.icon;
  return (
    <div className="bg-MainBackground min-h-screen flex flex-col items-center justify-center px-6 py-16 gap-8">
      <div className={`flex flex-col items-center gap-4 ${info.bg} border border-LineBox rounded-2xl px-10 py-10 max-w-md w-full text-center`}>
        <Icon size={48} className={info.color} strokeWidth={1.5} />
        <h1 className="text-white font-jakarta font-black text-2xl">{info.title}</h1>
        <p className="text-MainOffWhiteText font-inter text-sm leading-relaxed">{info.message}</p>
        <div className="text-MainOffWhiteText text-sm mt-2">
          A confirmation email has been sent to <span className="text-white font-semibold">{rsvp.guestEmail}</span>.
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-white font-jakarta font-bold text-lg">{event.title}</h2>
        <p className="text-MainOffWhiteText text-sm mt-1">
          {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>
    </div>
  );
};

const PublicEventPage = () => {
  const { inviteCode } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [plusOne, setPlusOne] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/invite/${inviteCode}`);
        setEvent(res.data.event);
      } catch (err) {
        setFetchError(err.response?.data?.message || "This invite link is invalid or has expired.");
      } finally {
        setLoading(false);
      }
    };
    if (inviteCode) fetchEvent();
  }, [inviteCode]);

  const schema = Yup.object({
    guestName: Yup.string().min(2, "Name must be at least 2 characters").required("Full name is required"),
    guestEmail: Yup.string().email("Enter a valid email").required("Email is required"),
    rsvpStatus: Yup.string().oneOf(["going", "not_going"]).required("Please select your attendance status"),
    plusOneFullname: Yup.string().when("plusOne", {
      is: true,
      then: (s) => s.min(2).required("Plus one's name is required"),
      otherwise: (s) => s.notRequired(),
    }),
    plusOneDietaryRequirements: Yup.string(),
  });

  const formik = useFormik({
    initialValues: {
      guestName: "",
      guestEmail: "",
      rsvpStatus: "",
      plusOne: false,
      plusOneFullname: "",
      plusOneDietaryRequirements: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError(null);
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/invite/${inviteCode}`, {
          guestName: values.guestName,
          guestEmail: values.guestEmail,
          rsvpStatus: values.rsvpStatus,
          plusOne: values.plusOne,
          ...(values.plusOne && {
            plusOneFullname: values.plusOneFullname,
            plusOneDietaryRequirements: values.plusOneDietaryRequirements,
          }),
        });
        setSubmitResult(res.data.rsvp);
      } catch (err) {
        setSubmitError(err.response?.data?.message || "Something went wrong, please try again.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleRsvpChange = (status) => {
    setRsvpStatus(status);
    formik.setFieldValue("rsvpStatus", status);
  };

  const handlePlusOneChange = (val) => {
    setPlusOne(val);
    formik.setFieldValue("plusOne", val);
    if (!val) {
      formik.setFieldValue("plusOneFullname", "");
      formik.setFieldValue("plusOneDietaryRequirements", "");
    }
  };

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

  if (submitResult) return <SuccessScreen event={event} rsvp={submitResult} />;

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
  const formattedTime = new Date(event.date).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="bg-MainBackground w-full flex gap-8 px-6 sm:px-10 lg:px-20 py-10 flex-col min-h-screen">
      {/* Hero */}
      <div className="relative rounded-2xl flex flex-col overflow-hidden justify-center items-center w-full h-64 sm:h-96 lg:h-130">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(10, 25, 47, 1)), url(${event.coverImage || EventPhoto})`,
          }}
        />
        <div className="relative z-10 flex flex-col gap-4 justify-center items-center px-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white text-center">{event.title}</h1>
          <p className="text-xs sm:text-sm font-inter font-light text-MainOffWhiteText text-center max-w-lg">
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
            <p className="text-red-400 text-sm">{formik.errors.rsvpStatus}</p>
          )}

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 w-full">
            <div className="w-full">
              <LabeledInput
                label="Full Name"
                isIcon={false}
                placeholder="John Doe"
                text={formik.values.guestName}
                type="text"
                setText={(value) => formik.setFieldValue("guestName", value)}
              />
              {formik.touched.guestName && formik.errors.guestName && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.guestName}</p>
              )}
            </div>

            <div className="w-full">
              <LabeledInput
                label="Email Address"
                isIcon={false}
                placeholder="you@example.com"
                text={formik.values.guestEmail}
                type="email"
                setText={(value) => formik.setFieldValue("guestEmail", value)}
              />
              {formik.touched.guestEmail && formik.errors.guestEmail && (
                <p className="text-red-400 text-sm mt-1">{formik.errors.guestEmail}</p>
              )}
            </div>

            {event.allowPlusOnes && (
              <>
                <PlusOne value={plusOne} onChange={handlePlusOneChange} />
                {plusOne && (
                  <div className="flex flex-col gap-5">
                    <div className="w-full">
                      <LabeledInput
                        label="Plus One's Full Name"
                        isIcon={false}
                        placeholder="Jane Doe"
                        text={formik.values.plusOneFullname}
                        type="text"
                        setText={(value) => formik.setFieldValue("plusOneFullname", value)}
                      />
                      {formik.touched.plusOneFullname && formik.errors.plusOneFullname && (
                        <p className="text-red-400 text-sm mt-1">{formik.errors.plusOneFullname}</p>
                      )}
                    </div>
                    <div className="w-full">
                      <LabeledInput
                        label="Plus One's Dietary Requirements"
                        isIcon={false}
                        placeholder="Vegetarian, nut allergy..."
                        text={formik.values.plusOneDietaryRequirements}
                        type="text"
                        setText={(value) => formik.setFieldValue("plusOneDietaryRequirements", value)}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {submitError && <p className="text-red-400 text-sm">{submitError}</p>}

            <CustomButton
              type="submit"
              title={formik.isSubmitting ? "Submitting..." : "Confirm My Attendance"}
              className="bg-MainBlue px-8 py-4 text-white rounded-lg w-full"
            />
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
