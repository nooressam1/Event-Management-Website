import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Calendar, Clock, Info, MapPin } from "lucide-react";

import CustomButton from "../../shared/component/CustomButton";
import LabeledInput from "../../shared/component/LabeledInput";
import EventDetails from "../component/EventDetails";
import RsvpStatus from "../component/rsvpStatus.jsx";
import PlusOne from "../component/plusOne.jsx";
import LocationMap from "../component/locationMap.jsx";

import EventPhoto from "../../../assets/eventphoto.jpg";
import checkMark from "../../../assets/checkMark.png";
import cancel from "../../../assets/cancel.png";

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

  // Fetch invitation data
  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        console.log("testinguser");
        setLoading(true);
        console.log("testinguser");

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/rsvp/${id}`,
        );
        console.log("testinguser");

        setInvitationData(response.data);
        console.log("testinguser", response.data);
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
  });

  const formik = useFormik({
    initialValues: {
      fullname: "",
      dietaryRequirements: "",
      rsvpStatus: "",
      plusOne: false,
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError(null);
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/rsvp/${id}/submit`,
          {
            fullname: values.fullname,
            dietaryRequirements: values.dietaryRequirements,
            rsvpStatus: values.rsvpStatus,
            plusOne: values.plusOne,
          },
        );
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
        <p className="text-red-400 font-inter">{fetchError}</p>
      </div>
    );

  if (submitSuccess)
    return (
      <div className="h-screen w-full flex flex-col gap-4 justify-center items-center bg-MainBackground">
        <h1 className="text-white font-jakarta font-black text-3xl">
          You're all set! 🎉
        </h1>
      </div>
    );

  return (
    <div className="p-15 gap-10 bg-MainBackground flex flex-col justify-center items-center">
      {/* Hero */}
      <div className="relative flex flex-col rounded-md overflow-hidden justify-center items-center w-full h-130">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(10, 25, 47, 1)), url(${invitationData.event.coverImage || EventPhoto})`,
          }}
        />
        <div className="relative z-10 flex flex-col gap-5 justify-center items-center">
          <h1 className="text-4xl font-black text-white  text-center">
            {invitationData.event.title}
          </h1>
          <p className="text-sm font-inter font-light text-MainOffWhiteText = text-center">
            {invitationData.event.description}
          </p>
          <CustomButton
            title="RSVP Now"
            className="bg-MainBlue px-8 text-white rounded-lg"
          />
        </div>
      </div>

      <div className="flex gap-10">
        {/* Left - Event Info */}
        <div className="flex flex-col gap-5 py-10">
          {/* Event Details */}
          <div className="flex flex-col gap-5">
            <div className="flex flex-row w-full justify-start items-center gap-3">
              <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-sm">
                <Info size={22} className="text-MainBlue" strokeWidth={1.5} />
              </div>
              <h1 className="text-white font-jakarta font-black text-lg">
                Event Details
              </h1>
            </div>
            <div className="flex flex-col md:flex-row gap-5">
              <EventDetails
                title="Date"
                placeholdervalue={invitationData.event.date}
                icon={Calendar}
              />
              <EventDetails
                title="Time"
                placeholdervalue={invitationData.event.date}
                icon={Clock}
              />
            </div>
          </div>

          {/* Map */}
          <div className="flex flex-col gap-4">
            <div className="flex flex-row w-full justify-start items-center gap-3">
              <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-sm">
                <MapPin size={22} className="text-MainBlue" strokeWidth={1.5} />
              </div>
              <h1 className="text-white font-jakarta font-black text-lg">
                Location
              </h1>
            </div>
            {/* <LocationMap
              lat={invitationData.lat}
              lng={invitationData.lng}
              label={invitationData.title}
            /> */}
          </div>

          {/* About */}
          <div className="flex flex-col gap-2">
            <h1 className="text-white font-jakarta font-black text-lg">
              About the Event
            </h1>
            <p className="text-MainOffWhiteText font-inter font-normal text-sm">
              {invitationData.event.description}
            </p>
          </div>
        </div>

        {/* Right - RSVP Form */}
        <div className="bg-NavigationBackground flex flex-col gap-5 border-LineBox border-2 rounded-xl px-8 py-8">
          <div className="flex flex-col gap-1">
            <h1 className="text-white font-jakarta font-black text-2xl">
              Are you coming?
            </h1>
            <p className="text-MainOffWhiteText font-inter font-normal text-sm">
              Please let us know by{" "}
              <span className="text-MainBlue">{invitationData.deadline}.</span>
            </p>
          </div>

          {/* RSVP buttons */}
          <div className="flex flex-row gap-5">
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
            <p className="text-red-400 text-sm">{formik.errors.rsvpStatus}</p>
          )}

          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col items-start justify-start gap-5 w-md"
          >
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

            <PlusOne value={plusOne} onChange={handlePlusOneChange} />

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

            {submitError && (
              <p className="text-red-400 text-sm">{submitError}</p>
            )}

            <CustomButton
              type="submit"
              title={
                formik.isSubmitting ? "Submitting..." : "Confirm My Attendance"
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
  );
};

export default InvitationPage;
