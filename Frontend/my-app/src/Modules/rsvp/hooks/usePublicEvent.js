import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

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

const usePublicEvent = (inviteCode) => {
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

  return { event, loading, fetchError, rsvpStatus, plusOne, submitResult, submitError, formik, handleRsvpChange, handlePlusOneChange };
};

export default usePublicEvent;
