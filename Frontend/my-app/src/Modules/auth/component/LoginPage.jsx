import { ArrowRight, Lock, Mail, User } from "lucide-react";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import LabeledInput from "../../shared/component/LabeledInput";
import CustomButton from "../../shared/component/CustomButton";
import { Link } from "react-router-dom";
const signUpSchema = Yup.object({
  username: Yup.string()
    .min(3, "Username must be at least 3 characters")
    .required("Username is required"),

  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const LoginPage = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: signUpSchema,
    onSubmit: (values) => {
      console.log("Form Submitted:", values);
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

        <div className="w-full h-12">
          <CustomButton
            title="Login "
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
