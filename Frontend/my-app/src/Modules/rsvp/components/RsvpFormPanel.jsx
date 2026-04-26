import CustomButton from "../../shared/components/CustomButton";
import LabeledInput from "../../shared/components/LabeledInput";
import RsvpStatus from "./rsvpStatus";
import PlusOne from "./plusOne";
import checkMark from "../../../assets/checkMark.png";
import cancel from "../../../assets/cancel.png";

const RsvpFormPanel = ({ invitationData, formik, rsvpStatus, plusOne, handleRsvpChange, handlePlusOneChange, submitError }) => (
  <div className="bg-NavigationBackground flex flex-col gap-5 border-LineBox border-2 rounded-xl px-6 sm:px-8 py-8 w-full lg:w-[420px] shrink-0">
    <div className="flex flex-col gap-1">
      <h1 className="text-white font-jakarta font-black text-xl sm:text-2xl">Are you coming?</h1>
      <p className="text-MainOffWhiteText font-inter font-normal text-sm">
        Please let us know by{" "}
        <span className="text-MainBlue">{invitationData.deadline || "soon"}.</span>
      </p>
    </div>

    <div className="flex flex-row gap-4">
      <RsvpStatus title="I'm Going!" image={checkMark} value={rsvpStatus === "going"} onChange={() => handleRsvpChange("going")} />
      <RsvpStatus title="Can't Make it" image={cancel} value={rsvpStatus === "not_going"} onChange={() => handleRsvpChange("not_going")} />
    </div>
    {formik.touched.rsvpStatus && formik.errors.rsvpStatus && (
      <p className="text-MainRed text-sm">{formik.errors.rsvpStatus}</p>
    )}

    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5 w-full">
      <div className="w-full">
        <LabeledInput label="Full Name" isIcon={false} placeholder="John Doe" text={formik.values.fullname} type="text" setText={(v) => formik.setFieldValue("fullname", v)} />
        {formik.touched.fullname && formik.errors.fullname && <p className="text-MainRed text-sm mt-1">{formik.errors.fullname}</p>}
      </div>

      <div className="w-full">
        <LabeledInput label="Dietary Requirements" isIcon={false} placeholder="Vegetarian, nut allergy..." text={formik.values.dietaryRequirements} type="text" setText={(v) => formik.setFieldValue("dietaryRequirements", v)} />
      </div>

      {invitationData.event?.allowPlusOnes && (
        <>
          <PlusOne value={plusOne} onChange={handlePlusOneChange} />
          {plusOne && (
            <div className="flex flex-col gap-5">
              <div className="w-full">
                <LabeledInput label="Plus One's Full Name" isIcon={false} placeholder="Jane Doe" text={formik.values.plusOneFullname} type="text" setText={(v) => formik.setFieldValue("plusOneFullname", v)} />
                {formik.touched.plusOneFullname && formik.errors.plusOneFullname && <p className="text-MainRed text-sm mt-1">{formik.errors.plusOneFullname}</p>}
              </div>
              <div className="w-full">
                <LabeledInput label="Plus One's Dietary Requirements" isIcon={false} placeholder="Vegetarian, nut allergy..." text={formik.values.plusOneDietaryRequirements} type="text" setText={(v) => formik.setFieldValue("plusOneDietaryRequirements", v)} />
              </div>
            </div>
          )}
        </>
      )}

      {submitError && <p className="text-MainRed text-sm">{submitError}</p>}

      <CustomButton type="submit" title={formik.isSubmitting ? "Submitting..." : "Confirm My Attendance"} className="bg-MainBlue px-8 py-4 text-white rounded-lg w-full" />
    </form>

    <p className="text-MainOffWhiteText text-center font-inter font-normal text-sm">
      By clicking confirm, you agree to our <span className="text-MainBlue">event terms</span> and{" "}
      <span className="text-MainBlue">privacy policy.</span>
    </p>
  </div>
);

export default RsvpFormPanel;
