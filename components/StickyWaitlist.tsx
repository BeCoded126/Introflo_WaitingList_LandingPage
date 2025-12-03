"use client";

import React from "react";

/**
 * Waitlist input bar (non-sticky)
 * Simplified: removed scroll handlers and fixed/floating behavior so the
 * input stays static in the document flow.
 */
type Props = {
  heroEmail?: string;
  setHeroEmail?: (v: string) => void;
  handleHeroSubmit?: (e: React.FormEvent) => void;
};

export default function StickyWaitlist({
  heroEmail = "",
  setHeroEmail,
  handleHeroSubmit,
}: Props) {
  return (
    <form onSubmit={handleHeroSubmit} style={{ width: "100%" }}>
      <div
        id="waitlist-bar"
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          marginTop: "16px",
          background: "rgba(248,249,250,0.97)", // Cloud White
          padding: "12px 16px",
          borderRadius: "14px",
          boxShadow: "0 2px 8px rgba(217, 162, 139, 0.08)",
          border: "1px solid #C9CCD1",
          width: "100%",
        }}
      >
        <input
          type="email"
          placeholder="Enter email address"
          value={heroEmail}
          onChange={(e) => setHeroEmail && setHeroEmail(e.target.value)}
          autoComplete="email"
          style={{
            flex: 1,
            padding: "14px 18px",
            fontSize: "16px",
            borderRadius: "10px",
            border: "1px solid #C9CCD1",
            outline: "none",
            background: "#FFFFFF",
            color: "#3A3A3D",
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
            transition: "border 0.2s",
          }}
        />
        <button
          style={{
            padding: "14px 28px",
            fontSize: "16px",
            borderRadius: "10px",
            fontWeight: 700,
            background: "#F08A75", // Muted Coral (Primary Warm Accent)
            color: "#FFFFFF",
            border: "1px solid #F08A75",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(240,138,117,0.25)",
            transition: "all 0.2s",
          }}
          type="submit"
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.background = "#E27562";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(217, 162, 139, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.background = "#F08A75";
            e.currentTarget.style.boxShadow =
              "0 4px 12px rgba(240,138,117,0.25)";
          }}
        >
          Join
        </button>
      </div>
    </form>
  );
}
