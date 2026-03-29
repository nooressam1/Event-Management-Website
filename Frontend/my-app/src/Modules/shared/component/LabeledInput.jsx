import { Mail, Eye, EyeClosed } from "lucide-react";
import { useState } from "react";

const LabeledInput = ({
  placeholder = "placeholder text..",
  type = "text",
  label = "text",
  text = "",
  setText = () => {},
  icon: Icon = Mail,
  width = "px-4",
  height = "py-3",
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const currentType = isPasswordField && showPassword ? "text" : type;

  return (
    <div className="w-full max-w-md font-inter group">
      <label className="block mb-2 ml-2 text-sm font-medium text-MainOffWhiteText transition-colors group-focus-within:text-MainBlue">
        {label}
      </label>

      <div
        className={`
          flex items-center gap-3 ${width} ${height} rounded-xl border-2 transition-all duration-200
          border-LineBox bg-NavigationBackground 
          focus-within:border-MainBlue 
          focus-within:shadow-[0_0_12px_rgba(25,120,229,0.25)]
        `}
      >
        <Icon
          size={20}
          className="text-SecondOffWhiteText transition-colors group-focus-within:text-MainBlue"
          strokeWidth={1.5}
        />

        <input
          type={currentType}
          value={text}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none w-full text-white font-jakarta placeholder:text-SecondOffWhiteText"
          onChange={(e) => setText(e.target.value)}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-SecondOffWhiteText hover:text-white transition-colors focus:outline-none pr-1"
          >
            {showPassword ? (
              <Eye
                size={20}
                strokeWidth={1.5}
                className="animate-in fade-in zoom-in duration-200"
              />
            ) : (
              <EyeClosed
                size={20}
                strokeWidth={1.5}
                className="animate-in fade-in zoom-in duration-200"
              />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default LabeledInput;
