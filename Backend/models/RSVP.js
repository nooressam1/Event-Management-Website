import mongoose from "mongoose";
import { RSVP_STATUS } from "./enum.js";
import { nanoid } from "nanoid";
const plusOneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plus-one name is required"],
    },
    dietaryNotes: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }, //this is embedded, no need for seperate id
);

const rsvpSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId, //24 hexadecimal string ID, Primary key
      ref: "Event", //this belongs to a collection named 'Event', used in populate(), we can get all organizer events that way
      required: true,
    },
    guestName: {
      type: String,
      required: [true, "Guest name is required"],
      trim: true,
    },
    guestEmail: {
      type: String,
      required: [true, "Guest email name is required"],
      lowercase: true,
      trim: true,
    },
    accessCode: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(10),
    },
    status: {
      type: String,
      enum: Object.values(RSVP_STATUS),
      required: true,
    },
    dietaryNotes: {
      //might edit later to somthing more structured
      type: String,
      trim: true,
      default: "",
    },
    additional_notes: {
      type: String,
      trim: true,
      default: "",
    },
    plusOne: {
      type: plusOneSchema,
      default: null,
    },
    // only when status waitlisted
    waitlistPosition: {
      type: Number,
      default: null,
      validate: function (value) {
        if (this.status === RSVP_STATUS.WAITLISTED)
          return value !== null && value >= 0;
        else return value === null;
      },
      message: "Waitlist position can only be set if status is 'waitlisted'",
    },
    // for last minute changes
    lastModifiedAt: {
      type: Date,
      default: Date.now(),
    },
    checkedIn: {
      type: Boolean,
      default: false,
    },
    checkedInAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

// adds rule: One RSVP per guest email per event
rsvpSchema.index({ event: 1, guestEmail: 1 }, { unique: true });

// For filtering/searching guests within an event, purely performance
rsvpSchema.index({ event: 1, status: 1 }); //order ascendeningly event and their status
rsvpSchema.index({ event: 1, guestName: "text", guestEmail: "text" });

// For waitlist ordering, when we grap waitlist we usually want the top 10 or so
rsvpSchema.index({ event: 1, waitlistPosition: 1 });

// Update lastModifiedAt on every save
rsvpSchema.pre("save", async function () {
  if (this.isModified() && !this.isNew) {
    this.lastModifiedAt = new Date();
  }
});

export default mongoose.model("RSVP", rsvpSchema);
