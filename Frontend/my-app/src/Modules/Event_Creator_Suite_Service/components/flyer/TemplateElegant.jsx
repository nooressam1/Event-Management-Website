import React from "react";

const Divider = ({ color }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "10px", margin: "0 auto", width: "200px" }}>
    <div style={{ flex: 1, height: "1px", backgroundColor: color, opacity: 0.4 }} />
    <div style={{ width: "5px", height: "5px", borderRadius: "50%", backgroundColor: color, opacity: 0.6 }} />
    <div style={{ flex: 1, height: "1px", backgroundColor: color, opacity: 0.4 }} />
  </div>
);

const TemplateElegant = React.forwardRef(
  ({ title, tagline, dateTime, location, description, primaryColor, secondaryColor }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "560px",
          height: "400px",
          backgroundColor: secondaryColor,
          fontFamily: "Georgia, 'Times New Roman', serif",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "48px 64px",
          boxSizing: "border-box",
        }}
      >
        {/* Corner ornaments */}
        {[
          { top: 16, left: 16, borderTop: `2px solid ${primaryColor}`, borderLeft: `2px solid ${primaryColor}` },
          { top: 16, right: 16, borderTop: `2px solid ${primaryColor}`, borderRight: `2px solid ${primaryColor}` },
          { bottom: 16, left: 16, borderBottom: `2px solid ${primaryColor}`, borderLeft: `2px solid ${primaryColor}` },
          { bottom: 16, right: 16, borderBottom: `2px solid ${primaryColor}`, borderRight: `2px solid ${primaryColor}` },
        ].map((s, i) => (
          <div key={i} style={{ position: "absolute", width: "28px", height: "28px", opacity: 0.5, ...s }} />
        ))}

        {/* Eyebrow */}
        <p style={{ color: primaryColor, fontSize: "9px", fontWeight: 400, letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 14px 0", fontFamily: "'Inter', sans-serif" }}>
          You are cordially invited
        </p>

        <Divider color={primaryColor} />

        {/* Title */}
        <h1 style={{ color: "#ffffff", fontSize: "32px", fontWeight: 700, lineHeight: 1.15, margin: "18px 0 6px 0", wordBreak: "break-word", fontStyle: "italic" }}>
          {title || "Event Title"}
        </h1>

        {tagline && (
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "13px", margin: "0 0 16px 0", fontStyle: "italic" }}>
            "{tagline}"
          </p>
        )}

        <Divider color={primaryColor} />

        {/* Description */}
        {description && (
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "11px", lineHeight: 1.7, margin: "16px 0 0 0", maxHeight: "46px", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
            {description}
          </p>
        )}

        {/* Footer */}
        {(dateTime || location) && (
          <div style={{ position: "absolute", bottom: "32px", left: "64px", right: "64px", display: "flex", justifyContent: "center", gap: "40px" }}>
            {dateTime && (
              <div>
                <p style={{ color: primaryColor, fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 3px 0", fontFamily: "'Inter', sans-serif" }}>Date & Time</p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", margin: "0" }}>{dateTime}</p>
              </div>
            )}
            {location && (
              <div>
                <p style={{ color: primaryColor, fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 3px 0", fontFamily: "'Inter', sans-serif" }}>Venue</p>
                <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "11px", margin: "0" }}>{location}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

TemplateElegant.displayName = "TemplateElegant";
export default TemplateElegant;
