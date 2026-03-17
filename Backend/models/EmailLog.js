import mongoose from "mongoose";
import { EMAIL_TYPE, EMAIL_STATUS } from "./enum.js";

const emailLogSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    recipient: {
      type: String,
      required: [true, "Recipient email is required"],
      lowercase: true,
      trim: true,
    },
    recipientName: {
      type: String,
      trim: true,
      default: "",
    },
    type: {
      type: String,
      enum: Object.values(EMAIL_TYPE),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(EMAIL_STATUS),
      default: EMAIL_STATUS.PENDING,
    },
    sendgridMessageId: {
      type: String,
      default: null,
    },
    errorMessage: {
      type: String,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// common queries involve emails for an event, by type, by status
emailLogSchema.index({ event: 1, type: 1 });
emailLogSchema.index({ recipient: 1 });
emailLogSchema.index({ status: 1 });

export default mongoose.model("EmailLog", emailLogSchema);
