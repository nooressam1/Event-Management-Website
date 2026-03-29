import { ArrowBigRightIcon, Lock, Mail, User } from "lucide-react";
import React, { useState } from "react";
import LabeledInput from "../../shared/component/LabeledInput";
import CustomButton from "../../shared/component/CustomButton";
import ColorMap from "../../shared/component/ColorMap";

const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, SetEmail] = useState("");

  return (
    <div className="flex flex-col items-start justify-start gap-5 w-md">
      <div className="gap-2 flex flex-col ">
        <h1 className=" text-white font-jakarta font-black text-2xl">
          Create Organizer Account
        </h1>
        <h1 className="hidden sm:block text-MainOffWhiteText font-jakarta font-medium text-sm">
          Start managing your events with power and ease
        </h1>
      </div>
      <div className="w-full flex flex-col gap-5">
        <LabeledInput
          label="Username"
          icon={User}
          text={username}
          type="text"
          setText={setUsername}
          secondayIcon={User}
        />

        <LabeledInput
          label="Email"
          icon={Mail}
          text={email}
          type="text"
          setText={SetEmail}
          secondayIcon={User}
        />
        <LabeledInput
          label="Password"
          icon={Lock}
          text={password}
          type="password"
          setText={setPassword}
          secondayIcon={User}
        />
        <div className="flex items-center gap-2">
          <input type="checkbox" id="rememberMe" className="w-4 h-4  rounded" />
          <label htmlFor="rememberMe" className="text-sm text-MainOffWhiteText ">
            Remember me
          </label>
        </div>
        <CustomButton
          title="Sign up"
          icon={ArrowBigRightIcon}
          color={ColorMap.MainBlue } // Default theme
          iconPosition="RIGHT"
          onClick=""
        ></CustomButton>
      </div>
    </div>
  );
};

export default SignUpPage;
