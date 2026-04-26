import pfp from "../../../assets/pfp.png";
import CustomButton from "../../shared/components/CustomButton";

const CheckInBoxGuest = ({
  name,
  id,
  email,
  image,
  positionNum,
  onDelete,
  status,
  onCheckIn,
  onUndo,
}) => {
  return (
    <div
      className={`flex mb-3 flex-col sm:flex-row w-full justify-between sm:items-center rounded-lg border-2 py-4 px-5 gap-3 sm:gap-5 transition-all
        ${status ? "bg-MainBlueBackground/50 border-LineBox/50 opacity-60" : "bg-MainBlueBackground border-LineBox"}`}
    >
      {/* Left side */}
      <div className="flex flex-row gap-3 sm:gap-5 items-center min-w-0">
        <div className="flex w-10 h-10 sm:w-12 sm:h-12 rounded-sm shrink-0">
          <img
            src={pfp}
            className={`h-full w-full object-contain ${status ? "grayscale" : ""}`}
          />
        </div>
        <div className="flex flex-col min-w-0">
          <h1
            className={`font-inter capitalize font-semibold text-sm sm:text-md truncate
              ${status ? "text-MainOffWhiteText line-through" : "text-white"}`}
          >
            {name}
          </h1>
          <h1 className="text-SecondOffWhiteText font-inter font-medium text-xs truncate">
            ID #{id}
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-row gap-3 sm:gap-4 items-center sm:ml-auto shrink-0 pl-[calc(40px+12px+12px)] sm:pl-0">
        <div
          className={`border rounded-3xl px-3 sm:px-4 py-1.5 w-fit h-fit ${
            status
              ? "border-MainGreenLine text-MainGreen bg-MainGreenBackground"
              : "border-LineBox text-MainOffWhiteText bg-MainBlueBackground"
          }`}
        >
          <p className="font-inter font-medium text-xs sm:text-sm whitespace-nowrap">
            {status ? "Checked In" : "Pending"}
          </p>
        </div>
        <CustomButton
          type="button"
          title={disabled ? "..." : status ? "Undo" : "Check In"}
          onClick={onCheckIn}
          disabled={disabled}
          className={`px-4 py-3 min-h-[44px] min-w-[88px] text-sm text-white rounded-lg transition-opacity
            ${disabled ? "opacity-40 cursor-not-allowed" : ""}
            ${status ? "bg-MainOffWhiteText/30" : "bg-MainBlue"}`}
        />
      </div>
    </div>
  );
};

export default CheckInBoxGuest;
