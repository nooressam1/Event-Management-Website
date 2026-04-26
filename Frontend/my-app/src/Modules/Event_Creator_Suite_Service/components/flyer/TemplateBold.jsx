import React from "react";

const TemplateBold = React.forwardRef(
  ({ title, tagline, dateTime, location, description, primaryColor, secondaryColor }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "560px",
          height: "400px",
          backgroundColor: "#ffffff",
          fontFamily: "'Inter', sans-serif",
          position: "relative",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* Left color block */}
        <div style={{
          backgroundColor: primaryColor,
          width: "220px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "32px 28px",
          position: "relative",
        }}>
          {/* Background shape */}
          <div style={{
            position: "absolute",
            top: "-40px",
            left: "-40px",
            width: "180px",
            height: "180px",
            borderRadius: "50%",
            backgroundColor: "rgba(255,255,255,0.08)",
          }} />

          {dateTime && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px 0" }}>When</p>
              <p style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600, margin: "0", lineHeight: 1.4 }}>{dateTime}</p>
            </div>
          )}
          {location && (
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "9px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 4px 0" }}>Where</p>
              <p style={{ color: "#ffffff", fontSize: "12px", fontWeight: 600, margin: "0", lineHeight: 1.4 }}>{location}</p>
            </div>
          )}
        </div>

        {/* Right content */}
        <div style={{
          flex: 1,
          backgroundColor: secondaryColor,
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "16px",
        }}>
          <div style={{ width: "40px", height: "4px", backgroundColor: primaryColor, borderRadius: "2px" }} />

          <h1 style={{
            color: "#ffffff",
            fontSize: "34px",
            fontWeight: 900,
            lineHeight: 1.05,
            margin: "0",
            wordBreak: "break-word",
            textTransform: "uppercase",
            letterSpacing: "-0.5px",
          }}>
            {title || "Event Title"}
          </h1>

          {tagline && (
            <p style={{ color: primaryColor, fontSize: "13px", fontWeight: 700, margin: "0", letterSpacing: "0.5px" }}>
              {tagline}
            </p>
          )}

          {description && (
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "12px", lineHeight: 1.6, margin: "0", maxHeight: "56px", overflow: "hidden" }}>
              {description}
            </p>
          )}
        </div>
      </div>
    );
  }
);

TemplateBold.displayName = "TemplateBold";
export default TemplateBold;
