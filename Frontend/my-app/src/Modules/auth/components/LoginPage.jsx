import { ArrowRight, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import LabeledInput from "../../shared/components/LabeledInput";
import CustomButton from "../../shared/components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const loginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState("");

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        setServerError("");
        await login(values.email, values.password);
        navigate("/myevents");
      } catch (err) {
        setServerError(
          err?.response?.data?.message ?? "Login failed. Please try again."
        );
      }
    },
  });
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col items-start justify-start gap-5 w-md"
    >
      <div className="gap-2 flex flex-col">
        <h1 className="text-white font-jakarta font-black text-2xl">
          Welcome Back{" "}
        </h1>
        <h1 className="hidden sm:block text-MainOffWhiteText font-jakarta font-medium text-sm">
          Log in to manage your events and track RSVPs.{" "}
        </h1>
      </div>

      <div className="w-full flex flex-col gap-5">
        <div>
          <LabeledInput
            label="Email"
            icon={Mail}
            text={formik.values.email}
            type="text"
            setText={(value) => formik.setFieldValue("email", value)}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <LabeledInput
            label="Password"
            icon={Lock}
            text={formik.values.password}
            type="password"
            setText={(value) => formik.setFieldValue("password", value)}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-red-500 text-sm -mt-2">{serverError}</p>
        )}

        <div className="w-full h-12">
          <CustomButton
            type="submit"
            title="Login"
            icon={ArrowRight}
            iconPosition="RIGHT"
            className="bg-MainBlue text-white rounded-lg"
          />
        </div>
        <div className="flex items-center justify-center gap-2 text-sm">
          <span className="text-MainOffWhiteText">Dont have an account ?</span>
          <Link
            to="/signup"
            className="text-MainBlue font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
};

export default LoginPage;
