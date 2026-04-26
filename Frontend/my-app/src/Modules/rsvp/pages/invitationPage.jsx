import { useRef } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, Info, MapPin } from "lucide-react";

import EventDetails from "../components/EventDetails";
import SubmittedResponse from "../components/submittedResponse";
import RsvpFormPanel from "../components/RsvpFormPanel";
import useInvitation from "../hooks/useInvitation";
import EventPhoto from "../../../assets/eventphoto.jpg";

const InvitationPage = () => {
  const { id } = useParams();
  const formRef = useRef(null);
  const {
    invitationData, loading, fetchError,
    rsvpStatus, plusOne,
    submitSuccess, setSubmitSuccess,
    submitError, isEditing, setIsEditing,
    formik, handleRsvpChange, handlePlusOneChange,
  } = useInvitation(id);

  const showForm = (invitationData?.rsvp?.status === "PENDING" || isEditing) && !submitSuccess;

  if (loading)
    return (
      <div className="h-screen w-full flex justify-center items-center bg-MainBackground">
        <p className="text-white font-inter">Loading invitation...</p>
      </div>
    );

  if (fetchError)
    return (
      <div className="h-screen w-full flex justify-center items-center bg-MainBackground">
        <p className="text-MainRed font-inter">{fetchError}</p>
      </div>
    );

  return (
    <>
      {showForm ? (
        <div className="bg-MainBackground w-full flex gap-8 px-6 sm:px-10 lg:px-20 py-10 flex-col min-h-screen">
          {/* Hero */}
          <div className="relative rounded-2xl flex flex-col overflow-hidden justify-center items-center w-full h-56 sm:h-80 lg:h-[520px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(10,25,47,1)), url(${invitationData.event.coverImage || EventPhoto})`,
              }}
            />
            <div className="relative z-10 flex flex-col gap-4 justify-center items-center px-6 text-center">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                {invitationData.event.title}
              </h1>
              <p className="text-xs sm:text-sm font-inter font-light text-MainOffWhiteText max-w-lg">
                {invitationData.event.description}
              </p>
              <button
                onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="bg-MainBlue px-8 py-3 text-white rounded-lg font-inter text-sm font-medium hover:bg-MainBlue/90 transition-colors"
              >
                RSVP Now
              </button>
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
                  <EventDetails title="Date" placeholdervalue={new Date(invitationData.event.date).toLocaleDateString()} icon={Calendar} />
                  <EventDetails title="Time" placeholdervalue={new Date(invitationData.event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} icon={Clock} />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-3">
                  <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-sm">
                    <MapPin size={22} className="text-MainBlue" strokeWidth={1.5} />
                  </div>
                  <h1 className="text-white font-jakarta font-black text-lg">Location</h1>
                </div>
                <p className="text-MainOffWhiteText font-inter text-sm">
                  {invitationData.event.location?.address || "TBD"}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-white font-jakarta font-black text-lg">About the Event</h1>
                <p className="text-MainOffWhiteText font-inter font-normal text-sm leading-relaxed">
                  {invitationData.event.description}
                </p>
              </div>
            </div>

            {/* Right - RSVP Form */}
            <div ref={formRef}>
              <RsvpFormPanel
                invitationData={invitationData}
                formik={formik}
                rsvpStatus={rsvpStatus}
                plusOne={plusOne}
                handleRsvpChange={handleRsvpChange}
                handlePlusOneChange={handlePlusOneChange}
                submitError={submitError}
              />
            </div>
          </div>
        </div>
      ) : (
        <SubmittedResponse
          invitationData={invitationData}
          onUpdateClick={() => setIsEditing(true)}
        />
      )}
    </>
  );
};

export default InvitationPage;
