import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

const schema = Yup.object({
  fullname: Yup.string().min(3, "Name must be at least 3 characters").required("Full name is required"),
  dietaryRequirements: Yup.string(),
  rsvpStatus: Yup.string().oneOf(["going", "not_going"], "Please select your attendance status").required("Please select your attendance status"),
  plusOneFullname: Yup.string().when("plusOne", {
    is: true,
    then: (s) => s.min(3, "Name must be at least 3 characters").required("Plus one's full name is required"),
    otherwise: (s) => s.notRequired(),
  }),
  plusOneDietaryRequirements: Yup.string(),
});

const useInvitation = (id) => {
  const [invitationData, setInvitationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [plusOne, setPlusOne] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchInvitation = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/rsvp/${id}`);
        setInvitationData(response.data);
      } catch (error) {
        setFetchError(error.response?.data?.message || "Invitation not found");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchInvitation();
  }, [id]);

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
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/rsvp/${id}/submit`, {
          fullname: values.fullname,
          dietaryRequirements: values.dietaryRequirements,
          rsvpStatus: values.rsvpStatus,
          plusOne: values.plusOne,
          ...(values.plusOne && {
            plusOneFullname: values.plusOneFullname,
            plusOneDietaryRequirements: values.plusOneDietaryRequirements,
          }),
        });
        setInvitationData((prev) => ({ ...prev, rsvp: res.data.rsvp }));
        setSubmitSuccess(true);
      } catch (error) {
        setSubmitError(error.response?.data?.message || "Something went wrong, try again");
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

  return {
    invitationData, loading, fetchError,
    rsvpStatus, plusOne,
    submitSuccess, setSubmitSuccess,
    submitError, isEditing, setIsEditing,
    formik, handleRsvpChange, handlePlusOneChange,
  };
};

export default useInvitation;
