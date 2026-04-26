import React from "react";

// Neon — dark bg, glowing accent lines, tech/party vibe
const TemplateNeon = React.forwardRef(
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
          justifyContent: "center",
          padding: "44px 52px",
          boxSizing: "border-box",
        }}
      >
        {/* Glowing horizontal rule top */}
        <div style={{
          position: "absolute", top: "36px", left: "52px", right: "52px",
          height: "1px", backgroundColor: primaryColor,
          boxShadow: `0 0 8px ${primaryColor}, 0 0 20px ${primaryColor}40`,
        }} />

        {/* Glowing horizontal rule bottom */}
        <div style={{
          position: "absolute", bottom: "36px", left: "52px", right: "52px",
          height: "1px", backgroundColor: primaryColor,
          boxShadow: `0 0 8px ${primaryColor}, 0 0 20px ${primaryColor}40`,
        }} />

        {/* Corner dots */}
        {[
          { top: "31px", left: "48px" }, { top: "31px", right: "48px" },
          { bottom: "31px", left: "48px" }, { bottom: "31px", right: "48px" },
        ].map((s, i) => (
          <div key={i} style={{
            position: "absolute", width: "6px", height: "6px", borderRadius: "50%",
            backgroundColor: primaryColor,
            boxShadow: `0 0 6px ${primaryColor}, 0 0 14px ${primaryColor}`,
            ...s,
          }} />
        ))}

        {/* Glow blob background */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: "320px", height: "320px", borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}18 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {tagline && (
            <p style={{
              color: primaryColor, fontSize: "10px", fontWeight: 700,
              letterSpacing: "4px", textTransform: "uppercase", margin: "0 0 14px 0",
              textShadow: `0 0 10px ${primaryColor}`,
            }}>
              {tagline}
            </p>
          )}

          <h1 style={{
            color: "#ffffff", fontSize: "42px", fontWeight: 900, lineHeight: 1.0,
            margin: "0 0 20px 0", wordBreak: "break-word", letterSpacing: "-1px",
            textShadow: "0 0 40px rgba(255,255,255,0.15)",
          }}>
            {title || "Event Title"}
          </h1>

          {description && (
            <p style={{
              color: "rgba(255,255,255,0.45)", fontSize: "12px", lineHeight: 1.6,
              margin: "0 0 20px 0", maxHeight: "38px", overflow: "hidden",
            }}>
              {description}
            </p>
          )}

          <div style={{ display: "flex", gap: "28px" }}>
            {dateTime && (
              <div>
                <p style={{ color: primaryColor, fontSize: "8px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 3px 0" }}>When</p>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: 500, margin: "0" }}>{dateTime}</p>
              </div>
            )}
            {location && (
              <div>
                <p style={{ color: primaryColor, fontSize: "8px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 3px 0" }}>Where</p>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "12px", fontWeight: 500, margin: "0" }}>{location}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

TemplateNeon.displayName = "TemplateNeon";
export default TemplateNeon;
