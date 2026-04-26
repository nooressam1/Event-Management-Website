import React from "react";

const TemplateModern = React.forwardRef(
  ({ title, tagline, dateTime, location, description, primaryColor, secondaryColor }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "560px",
          height: "400px",
          backgroundColor: secondaryColor,
          fontFamily: "'Inter', sans-serif",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top accent bar */}
        <div style={{ backgroundColor: primaryColor, height: "6px", width: "100%" }} />

        {/* Content area */}
        <div style={{ flex: 1, padding: "36px 44px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          {/* Header */}
          <div>
            <p style={{ color: primaryColor, fontSize: "11px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 12px 0" }}>
              Event
            </p>
            <h1 style={{ color: "#ffffff", fontSize: "38px", fontWeight: 800, lineHeight: 1.1, margin: "0 0 12px 0", wordBreak: "break-word" }}>
              {title || "Event Title"}
            </h1>
            {tagline && (
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", margin: "0", lineHeight: 1.4 }}>
                {tagline}
              </p>
            )}
          </div>

          {/* Description */}
          {description && (
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: 1.6, margin: "0", maxHeight: "60px", overflow: "hidden" }}>
              {description}
            </p>
          )}

          {/* Footer details */}
          <div style={{ display: "flex", gap: "32px", borderTop: `1px solid rgba(255,255,255,0.12)`, paddingTop: "16px" }}>
            {dateTime && (
              <div>
                <p style={{ color: primaryColor, fontSize: "9px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px 0" }}>Date & Time</p>
                <p style={{ color: "#ffffff", fontSize: "12px", margin: "0", fontWeight: 500 }}>{dateTime}</p>
              </div>
            )}
            {location && (
              <div>
                <p style={{ color: primaryColor, fontSize: "9px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px 0" }}>Location</p>
                <p style={{ color: "#ffffff", fontSize: "12px", margin: "0", fontWeight: 500 }}>{location}</p>
              </div>
            )}
          </div>
        </div>

        {/* Decorative circle */}
        <div style={{
          position: "absolute",
          right: "-60px",
          top: "-60px",
          width: "240px",
          height: "240px",
          borderRadius: "50%",
          border: `2px solid ${primaryColor}`,
          opacity: 0.12,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          right: "-30px",
          top: "-30px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          backgroundColor: primaryColor,
          opacity: 0.06,
          pointerEvents: "none",
        }} />
      </div>
    );
  }
);

TemplateModern.displayName = "TemplateModern";
export default TemplateModern;
