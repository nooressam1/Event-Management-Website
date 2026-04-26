import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Calendar, Clock, Info, MapPin, Upload, UserPen } from "lucide-react";

import CustomButton from "../../shared/component/CustomButton";
import LabeledInput from "../../shared/component/LabeledInput";
import EventDetails from "../component/EventDetails";
import RsvpStatus from "../component/rsvpStatus.jsx";
import PlusOne from "../component/plusOne.jsx";

import EventPhoto from "../../../assets/eventphoto.jpg";
import checkMark from "../../../assets/checkMark.png";
import cancel from "../../../assets/cancel.png";
import SubmittedResponse from "../component/submittedResponse.jsx";

const InvitationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invitationData, setInvitationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [plusOne, setPlusOne] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const showForm = (invitationData?.rsvp?.status === "PENDING" || isEditing) && !submitSuccess;

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rsvp/${id}`,
        );
        setInvitationData(response.data);
      } catch (error) {
        setFetchError(error.response?.data?.message || "Invitation not found");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInvitation();
  }, [id]);

  const schema = Yup.object({
    fullname: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Full name is required"),
    dietaryRequirements: Yup.string(),
    rsvpStatus: Yup.string()
      .oneOf(["going", "not_going"], "Please select your attendance status")
      .required("Please select your attendance status"),
    plusOneFullname: Yup.string().when("plusOne", {
      is: true,
      then: (s) =>
        s
          .min(3, "Name must be at least 3 characters")
          .required("Plus one's full name is required"),
      otherwise: (s) => s.notRequired(),
    }),
    plusOneDietaryRequirements: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: invitationData?.rsvp?.guestName || "",
      dietaryRequirements: invitationData?.rsvp?.dietaryNotes || "",
      rsvpStatus: "",
      plusOne: false,
      plusOneFullname: "",
      plusOneDietaryRequirements: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError(null);
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/rsvp/${id}/submit`,
          {
            fullname: values.fullname,
            dietaryRequirements: values.dietaryRequirements,
            rsvpStatus: values.rsvpStatus,
            plusOne: values.plusOne,
            ...(values.plusOne && {
              plusOneFullname: values.plusOneFullname,
              plusOneDietaryRequirements: values.plusOneDietaryRequirements,
            }),
          },
        );
        setInvitationData((prev) => ({ ...prev, rsvp: res.data.rsvp }));
        setSubmitSuccess(true);
      } catch (error) {
        setSubmitError(
          error.response?.data?.message || "Something went wrong, try again",
        );
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
    // Clear plus one fields when toggled off
    if (!val) {
      formik.setFieldValue("plusOneFullname", "");
      formik.setFieldValue("plusOneDietaryRequirements", "");
    }
  };

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
          <div className="relative rounded-2xl flex flex-col overflow-hidden justify-center items-center w-full h-64 sm:h-96 lg:h-130">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(10, 25, 47, 1)), url(${invitationData.event.coverImage || EventPhoto})`,
              }}
            />
            <div className="relative z-10 flex flex-col gap-4 justify-center items-center px-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white text-center">
                {invitationData.event.title}
              </h1>
              <p className="text-xs sm:text-sm font-inter font-light text-MainOffWhiteText text-center max-w-lg">
                {invitationData.event.description}
              </p>
              <div>
                <CustomButton
                  title="RSVP Now"
                  className="bg-MainBlue px-8 py-3 text-white rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Event Info */}
            <div className="flex flex-col gap-8 flex-1">
              {/* Event Details */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-3">
                  <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-sm">
                    <Info
                      size={22}
                      className="text-MainBlue"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h1 className="text-white font-jakarta font-black text-lg">
                    Event Details
                  </h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <EventDetails
                    title="Date"
                    placeholdervalue={new Date(
                      invitationData.event.date,
                    ).toLocaleDateString()}
                    icon={Calendar}
                  />
                  <EventDetails
                    title="Time"
                    placeholdervalue={new Date(
                      invitationData.event.date,
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    icon={Clock}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-3">
                  <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-sm">
                    <MapPin
                      size={22}
                      className="text-MainBlue"
                      strokeWidth={1.5}
                    />
                  </div>
                  <h1 className="text-white font-jakarta font-black text-lg">
                    Location
                  </h1>
                </div>
                <p className="text-MainOffWhiteText font-inter text-sm">
                  {invitationData.event.location?.address || "TBD"}
                </p>
              </div>

              {/* About */}
              <div className="flex flex-col gap-2">
                <h1 className="text-white font-jakarta font-black text-lg">
                  About the Event
                </h1>
                <p className="text-MainOffWhiteText font-inter font-normal text-sm leading-relaxed">
                  {invitationData.event.description}
                </p>
              </div>
            </div>

            {/* Right - RSVP Form */}
            <div className="bg-NavigationBackground flex flex-col gap-5 border-LineBox border-2 rounded-xl px-6 sm:px-8 py-8 w-full lg:w-[420px] shrink-0">
              <div className="flex flex-col gap-1">
                <h1 className="text-white font-jakarta font-black text-xl sm:text-2xl">
                  Are you coming?
                </h1>
                <p className="text-MainOffWhiteText font-inter font-normal text-sm">
                  Please let us know by{" "}
                  <span className="text-MainBlue">
                    {invitationData.deadline || "soon"}.
                  </span>
                </p>
              </div>

              {/* RSVP buttons */}
              <div className="flex flex-row gap-4">
                <RsvpStatus
                  title="I'm Going!"
                  image={checkMark}
                  value={rsvpStatus === "going"}
                  onChange={() => handleRsvpChange("going")}
                />
                <RsvpStatus
                  title="Can't Make it"
                  image={cancel}
                  value={rsvpStatus === "not_going"}
                  onChange={() => handleRsvpChange("not_going")}
                />
              </div>
              {formik.touched.rsvpStatus && formik.errors.rsvpStatus && (
                <p className="text-red-400 text-sm">
                  {formik.errors.rsvpStatus}
                </p>
              )}

              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col gap-5 w-full"
              >
                {/* Guest fields */}
                <div className="w-full">
                  <LabeledInput
                    label="Full Name"
                    isIcon={false}
                    placeholder="John Doe"
                    text={formik.values.fullname}
                    type="text"
                    setText={(value) => formik.setFieldValue("fullname", value)}
                  />
                  {formik.touched.fullname && formik.errors.fullname && (
                    <p className="text-red-400 text-sm mt-1">
                      {formik.errors.fullname}
                    </p>
                  )}
                </div>

                <div className="w-full">
                  <LabeledInput
                    label="Dietary Requirements"
                    isIcon={false}
                    placeholder="Vegetarian, nut allergy, or just a friendly hello..."
                    text={formik.values.dietaryRequirements}
                    type="text"
                    setText={(value) =>
                      formik.setFieldValue("dietaryRequirements", value)
                    }
                  />
                </div>

                {/* Plus one toggle */}
                <PlusOne value={plusOne} onChange={handlePlusOneChange} />

                {/* Plus one fields — revealed when toggled on */}
                {plusOne && (
                  <div className="flex flex-col gap-5  ">
                    <div className="w-full">
                      <LabeledInput
                        label="Plus One's Full Name"
                        isIcon={false}
                        placeholder="Jane Doe"
                        text={formik.values.plusOneFullname}
                        type="text"
                        setText={(value) =>
                          formik.setFieldValue("plusOneFullname", value)
                        }
                      />
                      {formik.touched.plusOneFullname &&
                        formik.errors.plusOneFullname && (
                          <p className="text-red-400 text-sm mt-1">
                            {formik.errors.plusOneFullname}
                          </p>
                        )}
                    </div>

                    <div className="w-full">
                      <LabeledInput
                        label="Plus One's Dietary Requirements"
                        isIcon={false}
                        placeholder="Vegetarian, nut allergy, or just a friendly hello..."
                        text={formik.values.plusOneDietaryRequirements}
                        type="text"
                        setText={(value) =>
                          formik.setFieldValue(
                            "plusOneDietaryRequirements",
                            value,
                          )
                        }
                      />
                    </div>
                  </div>
                )}

                {submitError && (
                  <p className="text-red-400 text-sm">{submitError}</p>
                )}

                <CustomButton
                  type="submit"
                  title={
                    formik.isSubmitting
                      ? "Submitting..."
                      : "Confirm My Attendance"
                  }
                  className="bg-MainBlue px-8 py-4 text-white rounded-lg w-full"
                />
              </form>

              <p className="text-MainOffWhiteText text-center font-inter font-normal text-sm">
                By clicking confirm, you agree to our{" "}
                <span className="text-MainBlue">event terms</span> and{" "}
                <span className="text-MainBlue">privacy policy.</span>
              </p>
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
