import mongoose from "mongoose";
import crypto from "crypto";
import { EVENT_STATUS } from "./enum.js";

const eventSchema = new mongoose.Schema(
  {
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Event title is required"],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    coverImage: {
      type: String, // either URL or file path
      default: null,
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    location: {
      address: {
        type: String,
        trim: true,
        default: "",
      },
      lat: {
        type: Number,
        default: null,
      },
      lng: {
        type: Number,
        default: null,
      },
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    status: {
      type: String,
      enum: Object.values(EVENT_STATUS),
      default: EVENT_STATUS.DRAFT,
    },
    time: {
      type: String,
      required: [true, "Event time is required"],
    },
    inviteCode: {
      type: String,
      unique: true,
      sparse: true, // ignore unique rule if null
    },
    inviteLinkActive: {
      type: Boolean,
      default: false,
    },
    checkInActive: {
      type: Boolean,
      default: false,
    },
    enableWaitlist: {
      type: Boolean,
      default: false,
    },
    allowPlusOnes: {
      type: Boolean,
      default: false,
    },
    autoAccept: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    rsvpQuestions: [
      {
        label: { type: String, required: true },
        fieldType: {
          type: String,
          enum: ["text", "multiple_choice", "yes_no"],
          default: "text",
        },
        required: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }, // we have calculated variables below, they need this
    toObject: { virtuals: true }, // same, virtual values are not stored but calculated on fly
  },
);

// Number of confirmed RSVPs
eventSchema.virtual("rsvps", {
  ref: "RSVP",
  localField: "_id",
  foreignField: "eventId",
});

// Generate unique invite code
eventSchema.methods.generateInviteCode = function () {
  this.inviteCode = crypto.randomBytes(8).toString("hex");
  this.inviteLinkActive = true;
  return this.inviteCode;
};

// Stop invite link
eventSchema.methods.revokeInviteLink = function () {
  this.inviteLinkActive = false;
};

eventSchema.index({ organizer: 1, date: -1 });
eventSchema.index({ status: 1 });
eventSchema.index({ title: "text", description: "text" });

export default mongoose.model("Event", eventSchema);
