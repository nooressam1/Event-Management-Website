import React from "react";

// Minimal — light/white canvas, strong typography, clean professional look
const TemplateMinimal = React.forwardRef(
  ({ title, tagline, dateTime, location, description, primaryColor, secondaryColor }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          width: "560px",
          height: "400px",
          backgroundColor: "#f8fafc",
          fontFamily: "'Inter', sans-serif",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: "0",
        }}
      >
        {/* Top color band */}
        <div style={{ backgroundColor: primaryColor, height: "8px", width: "100%", flexShrink: 0 }} />

        {/* Main area */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          padding: "36px 48px 0 48px",
        }}>
          <p style={{
            color: primaryColor, fontSize: "9px", fontWeight: 700,
            letterSpacing: "3px", textTransform: "uppercase", margin: "0 0 16px 0",
          }}>
            You are invited
          </p>

          <h1 style={{
            color: secondaryColor, fontSize: "38px", fontWeight: 800, lineHeight: 1.08,
            margin: "0 0 10px 0", wordBreak: "break-word", letterSpacing: "-0.5px",
          }}>
            {title || "Event Title"}
          </h1>

          {tagline && (
            <p style={{ color: "#64748b", fontSize: "14px", margin: "0 0 16px 0", fontStyle: "italic", fontWeight: 400 }}>
              {tagline}
            </p>
          )}

          {/* Thin rule */}
          <div style={{ width: "48px", height: "2px", backgroundColor: primaryColor, margin: "0 0 16px 0", borderRadius: "1px" }} />

          {description && (
            <p style={{
              color: "#475569", fontSize: "12px", lineHeight: 1.65,
              margin: "0", maxHeight: "58px", overflow: "hidden",
            }}>
              {description}
            </p>
          )}
        </div>

        {/* Footer bar */}
        <div style={{
          backgroundColor: secondaryColor,
          padding: "14px 48px",
          display: "flex",
          gap: "36px",
          flexShrink: 0,
        }}>
          {dateTime && (
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 3px 0" }}>Date & Time</p>
              <p style={{ color: "#ffffff", fontSize: "12px", fontWeight: 500, margin: "0" }}>{dateTime}</p>
            </div>
          )}
          {location && (
            <div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "8px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", margin: "0 0 3px 0" }}>Location</p>
              <p style={{ color: "#ffffff", fontSize: "12px", fontWeight: 500, margin: "0" }}>{location}</p>
            </div>
          )}
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: primaryColor }} />
          </div>
        </div>
      </div>
    );
  }
);

TemplateMinimal.displayName = "TemplateMinimal";
export default TemplateMinimal;
