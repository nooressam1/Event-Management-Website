import nodemailer from "nodemailer";
import EmailLog from "../../../models/EmailLog.js";
import { EMAIL_TYPE, EMAIL_STATUS } from "../../../models/enum.js";
import { rsvpConfirmationTemplate } from "./templates/rsvpConfirmation.js";
import { acceptanceTemplate } from "./templates/acceptance.js";
import { thankYouTemplate } from "./templates/thankYou.js";

const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

const send = async ({ event, recipient, recipientName, type, subject, html, attachments = [] }) => {
  const log = await EmailLog.create({
    event: event._id,
    recipient,
    recipientName,
    type,
    status: EMAIL_STATUS.PENDING,
  });

  try {
    const transporter = createTransporter();
    const info = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || "EventHub"}" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      html,
      attachments,
    });

    log.status = EMAIL_STATUS.SENT;
    log.sentAt = new Date();
    log.sendgridMessageId = info.messageId;
    await log.save();
  } catch (err) {
    log.status = EMAIL_STATUS.FAILED;
    log.errorMessage = err.message;
    await log.save();
    console.error(`[Email] Failed [${type}] → ${recipient}: ${err.message}`);
  }
};

export const sendRsvpConfirmation = async (rsvp, event) => {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const modifyLink = `${frontendUrl}/invitation/${rsvp._id}`;

  await send({
    event,
    recipient: rsvp.guestEmail,
    recipientName: rsvp.guestName,
    type: EMAIL_TYPE.CONFIRMATION,
    subject: `RSVP received — ${event.title}`,
    html: rsvpConfirmationTemplate({ rsvp, event, modifyLink }),
  });
};

export const sendAcceptance = async (rsvp, event) => {
  const attachments = [];

  if (event.suiteData?.flyerImageBase64) {
    // Flyer Builder PNG exported by the organizer — preferred over raw coverImage
    const raw = event.suiteData.flyerImageBase64.replace(/^data:image\/\w+;base64,/, "");
    attachments.push({
      filename: `${(event.title || "flyer").replace(/[^a-z0-9]/gi, "-")}-flyer.png`,
      content: Buffer.from(raw, "base64"),
      contentType: "image/png",
    });
  } else if (event.coverImage?.startsWith("http")) {
    // Fallback: organizer's cover image URL
    attachments.push({ filename: "event-flyer.jpg", path: event.coverImage });
  }

  await send({
    event,
    recipient: rsvp.guestEmail,
    recipientName: rsvp.guestName,
    type: EMAIL_TYPE.ACCEPTANCE,
    subject: `You're in! — ${event.title}`,
    html: acceptanceTemplate({ rsvp, event }),
    attachments,
  });
};

export const sendThankYou = async (rsvp, event) => {
  await send({
    event,
    recipient: rsvp.guestEmail,
    recipientName: rsvp.guestName,
    type: EMAIL_TYPE.THANK_YOU,
    subject: `Thank you for attending — ${event.title}`,
    html: thankYouTemplate({ rsvp, event }),
  });
};
