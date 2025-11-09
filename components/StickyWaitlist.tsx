"use client";

import React, { useEffect, useRef, useState } from "react";

/**
 * StickyWaitlist: Floating join bar that becomes sticky on scroll
 * Client-only to avoid SSR/CSR drift and hydration warnings.
 */
export default function StickyWaitlist() {
  const waitlistRef = useRef<HTMLDivElement>(null);
  const [isFloating, setIsFloating] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!waitlistRef.current) return;
      const rect = waitlistRef.current.getBoundingClientRect();
      const nextIsFloating = rect.top <= 0;
      if (nextIsFloating !== isFloating) setIsFloating(nextIsFloating);

      const y = window.scrollY;
      const goingDown = y > lastYRef.current + 5;
      const goingUp = y < lastYRef.current - 5;
      if (nextIsFloating) {
        if (goingDown) setHidden(true);
        else if (goingUp) setHidden(false);
      }
      lastYRef.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Run once to initialize state based on initial position
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
    // Intentionally exclude isFloating from deps; we manage via local comparisons
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={waitlistRef}
      id="waitlist-sticky"
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        marginTop: "16px",
        position: isFloating ? "fixed" : "static",
        top: isFloating ? 0 : undefined,
        left: isFloating ? 0 : undefined,
        width: isFloating ? "100vw" : undefined,
        zIndex: 200,
        background: "rgba(248,249,250,0.97)", // Cloud White
        padding: "12px 16px",
        borderRadius: isFloating ? 0 : "14px",
        boxShadow: isFloating
          ? "0 2px 16px rgba(0,0,0,0.08)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        border: "1px solid #C9CCD1",
        borderBottom: isFloating ? "1px solid #C9CCD1" : undefined,
        transition: "transform 0.25s, background 0.25s",
        transform: hidden ? "translateY(-110%)" : "translateY(0)",
      }}
    >
      <input
        type="email"
        placeholder="Join waitlist"
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
        onClick={() =>
          window.open(
            "https://tally.so/r/n0pRk9",
            "_blank",
            "noopener,noreferrer"
          )
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow =
            "0 6px 16px rgba(240,138,117,0.32)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow =
            "0 4px 12px rgba(240,138,117,0.25)";
        }}
      >
        Join
      </button>
    </div>
  );
}
