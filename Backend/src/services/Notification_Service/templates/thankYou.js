const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const thankYouTemplate = ({ rsvp, event }) => `
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
            <td style="background-color:#112240;border-radius:12px 12px 0 0;padding:40px 32px;text-align:center;border-bottom:1px solid #1e3a5f;">
              <p style="color:#1978e5;font-size:12px;font-weight:700;letter-spacing:4px;text-transform:uppercase;margin:0 0 16px 0;">EventHub</p>
              <div style="font-size:44px;margin:0 0 12px 0;">🙏</div>
              <h1 style="color:#ffffff;font-size:26px;font-weight:900;margin:0 0 8px 0;">Thank You for Coming!</h1>
              <p style="color:#a8b2d8;font-size:14px;margin:0;">${event.title} · ${formatDate(event.date)}</p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#112240;padding:32px;">
              <p style="color:#a8b2d8;font-size:15px;line-height:1.6;margin:0 0 20px 0;">
                Hi <strong style="color:#ffffff;">${rsvp.guestName}</strong>,
              </p>
              <p style="color:#a8b2d8;font-size:15px;line-height:1.6;margin:0 0 20px 0;">
                Thank you so much for joining us at <strong style="color:#ffffff;">${event.title}</strong>.
                It was wonderful having you there, and we hope you had a great time!
              </p>
              <p style="color:#a8b2d8;font-size:15px;line-height:1.6;margin:0 0 32px 0;">
                Your presence made the event special. We look forward to seeing you at future events!
              </p>

              <hr style="border:none;border-top:1px solid #1e3a5f;margin:0 0 28px 0;" />

              <p style="color:#64748b;font-size:13px;line-height:1.6;margin:0;">
                Stay tuned — more events are on the way. 🎉
              </p>
            </td>
          </tr>

          <tr>
            <td style="background-color:#0d2137;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;border-top:1px solid #1e3a5f;">
              <p style="color:#4a5568;font-size:12px;margin:0;">
                You received this because you attended ${event.title}. Thank you again!
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
