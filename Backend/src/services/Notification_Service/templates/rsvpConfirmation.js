const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const statusBadge = (status) => {
  const map = {
    ATTENDING: { bg: "#0d4a2a", border: "#1a8a4a", color: "#4ade80", label: "Confirmed" },
    DECLINED: { bg: "#4a0d0d", border: "#8a1a1a", color: "#f87171", label: "Declined" },
    PENDING: { bg: "#1a3a5f", border: "#1978e5", color: "#60a5fa", label: "Pending Review" },
    WAITLISTED: { bg: "#3a2a0d", border: "#8a6a1a", color: "#fbbf24", label: "On Waitlist" },
  };
  const s = map[status] ?? map.PENDING;
  return `<table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
    <tr>
      <td style="background-color:${s.bg};border:1px solid ${s.border};border-radius:6px;padding:8px 16px;">
        <span style="color:${s.color};font-size:13px;font-weight:600;">${s.label}</span>
      </td>
    </tr>
  </table>`;
};

export const rsvpConfirmationTemplate = ({ rsvp, event, modifyLink }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a192f;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a192f;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <tr>
            <td style="background-color:#112240;border-radius:12px 12px 0 0;padding:32px;text-align:center;border-bottom:1px solid #1e3a5f;">
              <p style="color:#1978e5;font-size:12px;font-weight:700;letter-spacing:4px;text-transform:uppercase;margin:0 0 12px 0;">EventHub</p>
              <h1 style="color:#ffffff;font-size:24px;font-weight:900;margin:0;">RSVP Received!</h1>
            </td>
          </tr>

          <tr>
            <td style="background-color:#112240;padding:32px;">
              <p style="color:#a8b2d8;font-size:15px;line-height:1.6;margin:0 0 24px 0;">
                Hi <strong style="color:#ffffff;">${rsvp.guestName}</strong>,
              </p>
              <p style="color:#a8b2d8;font-size:15px;line-height:1.6;margin:0 0 32px 0;">
                We've received your RSVP for <strong style="color:#ffffff;">${event.title}</strong>.
                ${rsvp.status === "ATTENDING" ? "You're confirmed — we look forward to seeing you!" : "Your response has been logged."}
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d2137;border-radius:8px;border:1px solid #1e3a5f;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="color:#ffffff;font-size:16px;font-weight:700;margin:0 0 16px 0;">${event.title}</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#64748b;font-size:12px;padding:5px 0;width:80px;">Date</td>
                        <td style="color:#a8b2d8;font-size:13px;padding:5px 0;">${formatDate(event.date)}</td>
                      </tr>
                      <tr>
                        <td style="color:#64748b;font-size:12px;padding:5px 0;">Time</td>
                        <td style="color:#a8b2d8;font-size:13px;padding:5px 0;">${event.time}</td>
                      </tr>
                      ${event.location?.address ? `<tr>
                        <td style="color:#64748b;font-size:12px;padding:5px 0;">Location</td>
                        <td style="color:#a8b2d8;font-size:13px;padding:5px 0;">${event.location.address}</td>
                      </tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              ${statusBadge(rsvp.status)}

              <p style="color:#a8b2d8;font-size:14px;line-height:1.6;margin:0 0 16px 0;">
                Need to update your response? Use your personal RSVP link below:
              </p>
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#1978e5;border-radius:8px;padding:12px 28px;">
                    <a href="${modifyLink}" style="color:#ffffff;font-size:14px;font-weight:700;text-decoration:none;">
                      View / Modify My RSVP →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#0d2137;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;border-top:1px solid #1e3a5f;">
              <p style="color:#4a5568;font-size:12px;margin:0;">
                This link is unique to you — please don't share it with others.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
