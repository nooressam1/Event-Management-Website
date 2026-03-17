export const BCRYPT_ROUNDS = 12;

const EVENT_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

const RSVP_STATUS = {
  ATTENDING: "attending",
  DECLINED: "declined",
  WAITLISTED: "waitlisted",
};

const EMAIL_TYPE = {
  INVITE: "invite",
  REMINDER: "reminder",
  CONFIRMATION: "confirmation",
  THANK_YOU: "thankYou",
};

const EMAIL_STATUS = {
  PENDING: "pending",
  SENT: "sent",
  FAILED: "failed",
};

export { EVENT_STATUS, RSVP_STATUS, EMAIL_TYPE, EMAIL_STATUS };
