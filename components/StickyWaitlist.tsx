"use client";

// HERO INPUT COMPONENT FILE: /Users/snipergang/Desktop/Introflo.io/components/StickyWaitlist.tsx
// This component renders the hero waitlist input row used by the hero page.
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

export default function StickyWaitlist({ heroEmail = "", setHeroEmail, handleHeroSubmit }: Props) {
  return (
    <form onSubmit={handleHeroSubmit}>
      <div id="waitlist-bar" className="hero-waitlist" style={{ marginTop: "16px" }}>
        <input
          className="hero-waitlist__input"
          type="email"
          placeholder="Enter email address"
          value={heroEmail}
          onChange={(e) => setHeroEmail && setHeroEmail(e.target.value)}
          autoComplete="email"
        />
        <button
          className="hero-waitlist__btn"
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
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(240,138,117,0.25)";
          }}
        >
          Join
        </button>
      </div>
    </form>
  );
}
