import React from "react";
import { useState } from "react";
import CustomButton from "../../shared/component/CustomButton";
import { useEffect } from "react";
import axios from "axios";
import EventPhoto from "../../../assets/eventphoto.jpg";
import checkMark from "../../../assets/checkMark.png";
import cancel from "../../../assets/cancel.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import LabeledInput from "../../shared/component/LabeledInput";
import EventDetails from "../component/EventDetails";
import RsvpStatus from "../component/rsvpStatus.jsx";
import { Calendar, Icon, Info, Lock, MapPin } from "lucide-react";
import PlusOne from "../component/plusOne.jsx";
const InvitationPage = () => {
  const [invitationData, setInvitationData] = useState(null);
  const [enabled, setEnabled] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState(null); // "going" or "not_going"

  const statusSchema = Yup.object({
    fullname: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),

    status: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),

    DietaryRequirements: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: statusSchema,
    onSubmit: async (values) => {
      try {
        // await signup(values.username, values.email, values.password);
      } catch (error) {
        console.error("Signup failed:", error);
      }
    },
  });
  //   useEffect(() => {
  //     async function fetchInvitation() {
  //       try {
  //         // const response = await axios.post(
  //         //   `${backendUrl}/api/invitations/id`,
  //         //   {},
  //         // );
  //         // setInvitationData(response.data);
  //       } catch (error) {
  //         console.error("Failed to fetch related games", error);
  //       }
  //     }

  //     fetchInvitation();
  //   }, [invitationData]);
  return (
    <div className="p-15 gap-10 bg-MainBackground flex flex-col justify-center items-center">
      
      <div className="relative flex flex-col rounded-md overflow-hidden justify-center items-center w-full h-130">
        {/* Background image with blur */}
        <div
          className="absolute inset-0 bg-cover bg-center rounded-md "
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(10, 25, 47, 1)), url(${EventPhoto})`,
          }}
        />

        {/* Your content on top */}
        <div className="relative z-10 flex flex-col gap-5 justify-center items-center ">
          <h1 className="text-4xl font-black text-white max-w-1/2 text-center">
            {/* {invitationData.title} */}
            Annual Tech Connect Summit 2024
          </h1>
          <h1 className="text-sm font-inter font-light text-MainOffWhiteText w-[75%] text-center">
            {/* {invitationData.description} */}
            Join the industry's brightest minds for a weekend of innovation,
            networking, and celebration at the heart of the tech hub.
          </h1>{" "}
          <div>
            <CustomButton
              type="="
              title="RSVP Now"
              className="bg-MainBlue px-8 text-white rounded-lg"
            />
          </div>
        </div>
      </div>
      <div className="flex gap-10">
        <div className="flex flex-col gap-5 py-10 ">
          <div className="flex flex-col gap-5">
            <div className="flex flex-row w-full justify-start items-center gap-3">
              <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-sm">
                <Info
                  size={22}
                  className="text-MainBlue"
                  strokeWidth={1.5}
                />{" "}
              </div>
              <h1 className=" text-white font-jakarta font-black text-lg">
                Event Details
              </h1>
            </div>
            <div className=" flex flex-col md:flex-row  gap-5 ">
              <EventDetails
                title="Date"
                placeholdervalue="October 12 - 14, 2024"
                icon={Calendar}
              ></EventDetails>
              <EventDetails
                title="Date"
                placeholdervalue="October 12 - 14, 2024"
                icon={Calendar}
              ></EventDetails>
            </div>
          </div>
          <div className="flex flex-row w-full justify-start items-center gap-3">
            <div className="flex justify-center items-center bg-MainBlueBackground p-2 rounded-sm">
              <MapPin
                size={22}
                className="text-MainBlue"
                strokeWidth={1.5}
              />{" "}
            </div>
            <h1 className="hidden sm:block text-white font-jakarta font-black text-lg">
              Location
            </h1>
          </div>
          <div className=" flex flex-col  gap-2 ">
            <h1 className="hidden sm:block text-white font-jakarta font-black text-lg">
              About the Event
            </h1>
            <p className=" text-MainOffWhiteText  font-inter font-normal text-sm">
              Get ready for three days of immersive workshops, visionary
              keynotes, and unprecedented networking opportunities. This year,
              we're focusing on the intersection of AI and Human Creativity.
              Whether you're a developer, a designer, or a tech enthusiast,
              there's something here for everyone.
            </p>
          </div>
        </div>
        <div className="bg-NavigationBackground flex flex-col gap-5 border-LineBox border-2 rounded-xl px-8 py-8">
          <div className="flex flex-col gap-1">
            <h1 className="hidden sm:block text-white font-jakarta font-black text-2xl">
              Are you coming?
            </h1>
            <h1 className=" text-MainOffWhiteText  font-inter font-normal text-sm">
              {/* add date*/}
              Please let us know by{" "}
              <span className="text-MainBlue"> September 20th.</span>
            </h1>
          </div>
          <div className="flex flex-row gap-5">
            <RsvpStatus
              title="I'm Going!"
              image={checkMark}
              value={rsvpStatus === "going"}
              onChange={() => setRsvpStatus("going")}
            />
            <RsvpStatus
              title="Can't Make it"
              image={cancel}
              value={rsvpStatus === "not_going"}
              onChange={() => setRsvpStatus("not_going")}
            />
          </div>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col items-start justify-start gap-5 w-md"
          >
            <LabeledInput
              label="Full Name"
              isIcon={false}
              placeholder="John Doe"
              text={formik.values.fullname}
              type="fullname"
              setText={(value) => formik.setFieldValue("fullname", value)}
            />
            <PlusOne value={enabled} onChange={setEnabled}></PlusOne>
            <LabeledInput
              label="Dietary Requirements "
              isIcon={false}
              placeholder="Vegetarian, nut allergy, or just a friendly 
hello..."
              text={formik.values.DietaryRequirements}
              type="DietaryRequirements "
              setText={(value) =>
                formik.setFieldValue("DietaryRequirements ", value)
              }
            />

            <CustomButton
              type="="
              title="Confirm My Attendance"
              className="bg-MainBlue px-8 py-4 text-white rounded-lg"
            />
          </form>
          <h1 className=" text-MainOffWhiteText text-center font-inter font-normal text-sm">
            {/* add date*/}
            By clicking confirm, you agree to our
            <span className="text-MainBlue"> event terms</span> and
            <span className="text-MainBlue"> privacy policy.</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default InvitationPage;
