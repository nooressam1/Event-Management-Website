const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const acceptanceTemplate = ({ rsvp, event }) => `
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
            <td style="background:linear-gradient(135deg,#0d3b7a,#1978e5);border-radius:12px 12px 0 0;padding:40px 32px;text-align:center;">
              <p style="color:rgba(255,255,255,0.65);font-size:12px;font-weight:700;letter-spacing:4px;text-transform:uppercase;margin:0 0 16px 0;">EventHub</p>
              <h1 style="color:#ffffff;font-size:28px;font-weight:900;margin:0 0 8px 0;">You're In!</h1>
              <p style="color:#93c5fd;font-size:15px;margin:0;">Your spot is officially confirmed.</p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#112240;padding:32px;">
              <p style="color:#a8b2d8;font-size:15px;line-height:1.6;margin:0 0 20px 0;">
                Hi <strong style="color:#ffffff;">${rsvp.guestName}</strong>,
              </p>
              <p style="color:#a8b2d8;font-size:15px;line-height:1.6;margin:0 0 32px 0;">
                Great news — you've been confirmed for <strong style="color:#ffffff;">${event.title}</strong>.
                We can't wait to see you there!
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d2137;border-radius:8px;border:1px solid #1978e5;margin-bottom:28px;">
                <tr>
                  <td style="padding:24px;">
                    <h3 style="color:#ffffff;font-size:17px;font-weight:700;margin:0 0 8px 0;">${event.title}</h3>
                    ${event.shortDescription ? `<p style="color:#a8b2d8;font-size:13px;margin:0 0 20px 0;">${event.shortDescription}</p>` : ""}
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
                      <tr>
                        <td style="padding:8px 0;border-top:1px solid #1e3a5f;">
                          <table width="100%"><tr>
                            <td style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;width:80px;">Date</td>
                            <td style="color:#e2e8f0;font-size:14px;font-weight:600;">${formatDate(event.date)}</td>
                          </tr></table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-top:1px solid #1e3a5f;">
                          <table width="100%"><tr>
                            <td style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;width:80px;">Time</td>
                            <td style="color:#e2e8f0;font-size:14px;font-weight:600;">${event.time}</td>
                          </tr></table>
                        </td>
                      </tr>
                      ${event.location?.address ? `<tr>
                        <td style="padding:8px 0;border-top:1px solid #1e3a5f;">
                          <table width="100%"><tr>
                            <td style="color:#64748b;font-size:11px;font-weight:700;text-transform:uppercase;width:80px;">Venue</td>
                            <td style="color:#e2e8f0;font-size:14px;font-weight:600;">${event.location.address}</td>
                          </tr></table>
                        </td>
                      </tr>` : ""}
                    </table>
                  </td>
                </tr>
              </table>

              ${rsvp.plusOne ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0d2137;border-radius:8px;border:1px solid #1e3a5f;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 24px;">
                    <p style="color:#60a5fa;font-size:12px;font-weight:700;text-transform:uppercase;margin:0 0 4px 0;">Plus One</p>
                    <p style="color:#e2e8f0;font-size:14px;margin:0;">${rsvp.plusOne.name} is also confirmed.</p>
                  </td>
                </tr>
              </table>` : ""}

              ${event.coverImage ? `<p style="color:#64748b;font-size:13px;margin:0;">The event flyer is attached to this email. Save the date!</p>` : ""}
            </td>
          </tr>

          <tr>
            <td style="background-color:#0d2137;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;border-top:1px solid #1e3a5f;">
              <p style="color:#4a5568;font-size:12px;margin:0;">Questions? Contact the event organizer.</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
