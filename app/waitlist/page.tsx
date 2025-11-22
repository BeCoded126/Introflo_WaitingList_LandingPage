"use client";

import React, { useState, useEffect, useRef } from "react";
import FilterPanel from "@/components/FilterPanel";

export default function Waitlist() {
  // Hydration stabilization: track mounted state so we can delay animations
  const [mounted, setMounted] = useState(false);
  const [activePhone, setActivePhone] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [chatStep, setChatStep] = useState(1); // how many chat messages to show
  const [deckIndex, setDeckIndex] = useState(0);
  const [swipeState, setSwipeState] = useState<{ animating: boolean; direction: "left" | "right" | null }>({ animating: false, direction: null });
  const [demoSwiping, setDemoSwiping] = useState(true);
  const demoPauseRef = useRef<number | null>(null);
  const swipeAnimatingRef = useRef(false);

  // Device alternation: show desktop every other cycle
  const showDesktop = activePhone === 1;

  // Define a simple scripted chat sequence for animation
  const chatMessages = [
    { id: 1, text: "Hi! Do you accept Aetna?", time: "2:30 PM", outgoing: false },
    { id: 2, text: "Yes! We accept most major insurances including Aetna.", time: "2:31 PM", outgoing: true },
    { id: 3, text: "Great. Do you have any openings this week?", time: "2:31 PM", outgoing: false },
    { id: 4, text: "We can take new patients starting Thursday.", time: "2:32 PM", outgoing: true },
  ];

  // Card data with real interior images from public/images
  const cards = [
    {
      title: "Tranquility Behavioral Health",
      location: "Coral Springs, FL",
      services: "Therapy • IOP • Counseling",
      image: "/images/interior-1.jpg",
    },
    {
      title: "Harbor Behavioral",
      location: "Tampa, FL",
      services: "Outpatient • Medication Management",
      image: "/images/interior-2.jpg",
    },
    {
      title: "Sunrise Clinic",
      location: "Orlando, FL",
      services: "Counseling • Coaching",
      image: "/images/interior-3.jpg",
    },
  ];

  // Begin phone swap animation only after mount (prevents early client/server divergence)
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setActivePhone((prev) => (prev === 0 ? 1 : 0));
    }, 3500);
    return () => clearInterval(interval);
  }, [mounted]);

  // Swipe handler for left mock: animates card off-screen then advances deck
  const swipe = (direction: "left" | "right") => {
    if (swipeState.animating) return; // prevent double swipes
    // pause demo when a manual/programmatic swipe starts
    pauseDemo();
    swipeAnimatingRef.current = true;
    setSwipeState({ animating: true, direction });
    // after animation completes, advance deck and reset swipe state
    setTimeout(() => {
      setDeckIndex((prev) => (prev + 1) % 3);
      setSwipeState({ animating: false, direction: null });
      swipeAnimatingRef.current = false;
    }, 420);
  };

  // Pause the autoplay demo for a short time after any user interaction
  const pauseDemo = () => {
    setDemoSwiping(false);
    if (demoPauseRef.current) {
      window.clearTimeout(demoPauseRef.current);
    }
    demoPauseRef.current = window.setTimeout(() => {
      setDemoSwiping(true);
      demoPauseRef.current = null;
    }, 5000);
  };

  // Chat animation interval: reveal one more message every 2.5s and loop
  // Chat message reveal sequence - start only after mount for deterministic initial HTML
  useEffect(() => {
    if (!mounted) return;
    const chatInterval = setInterval(() => {
      setChatStep((prev) => {
        const next = prev + 1;
        return next > chatMessages.length ? 1 : next; // loop back
      });
    }, 2000);
    return () => clearInterval(chatInterval);
  }, [mounted, chatMessages.length]);

  // Toggle right-side filter animation every 5s (alternate with chat animation)
  useEffect(() => {
    if (!mounted) return;
    const filterInterval = window.setInterval(() => {
      setShowFilter((prev) => !prev);
    }, 5000);
    return () => window.clearInterval(filterInterval);
  }, [mounted]);

  // Autoplay demo: periodically trigger a swipe animation to demonstrate the interaction
  useEffect(() => {
    if (!mounted || !demoSwiping) return;
    let dirCounter = 0;
    const id = window.setInterval(() => {
      if (swipeAnimatingRef.current) return;
      const direction = dirCounter % 2 === 0 ? ("left" as const) : ("right" as const);
      swipe(direction);
      dirCounter++;
    }, 1800);
    return () => window.clearInterval(id);
  }, [mounted, demoSwiping]);

  // Mark component as mounted (runs after hydration)
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div
      suppressHydrationWarning
      style={{
        background: "#F8F9FA", // Cloud White
        minHeight: "100vh",
        color: "#3A3A3D",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          background: "rgba(248, 249, 250, 1)", // Cloud White (opaque) for stronger contrast
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #C9CCD1", // Stone Neutral
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "20px 36px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "#2B2D31", // Deep Slate for brand wordmark
              letterSpacing: "0.2px",
            }}
          >
            introflo.io
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        style={{
          padding: "36px 40px 60px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: "760px", marginTop: "-20px", paddingBottom: "12px" }}>
            <h1
              style={{
                fontSize: "clamp(24px, 3.8vw, 44px)",
                fontWeight: 800,
                lineHeight: 1.05,
                marginBottom: "18px",
                color: "#2B2D31",
                maxWidth: "900px",
                textTransform: "none",
                wordBreak: "break-word",
              }}
            >
              We Help Your Private Practice Connect <em style={{ fontStyle: "italic" }}>Faster and Smarter.</em>
            </h1>

            {/* Sub-header: moved fragment */}
            <h3
              style={{
                fontSize: "clamp(19px, 2.5vw, 23px)",
                fontWeight: 700,
                marginTop: 12,
                marginBottom: "24px",
                color: "#374151",
                textDecoration: "underline",
                textDecorationColor: "#F08A75",
                textDecorationThickness: "2px",
                textUnderlineOffset: "4px",
                maxWidth: "900px",
              }}
            >
              To Verified Partners Who Are <strong>Looking For You Too</strong>.
            </h3>

            {/* Replaced intro copy with three bullets plus small SVG icons */}
            <ol aria-label="intro-steps" style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "16px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ width: 34, height: 34, borderRadius: 8, background: "#F08A75", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: "18px", fontWeight: 800, flex: "0 0 auto" }}>1</span>
                <div style={{ fontSize: "20px", color: "#374151", textAlign: "left", fontWeight: 800, textTransform: "uppercase" }}>Swipe</div>
              </li>

              <li style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ width: 34, height: 34, borderRadius: 8, background: "#F08A75", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: "18px", fontWeight: 800, flex: "0 0 auto" }}>2</span>
                <div style={{ fontSize: "20px", color: "#374151", textAlign: "left", fontWeight: 800, textTransform: "uppercase" }}>Match</div>
              </li>

              <li style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                <span style={{ width: 34, height: 34, borderRadius: 8, background: "#F08A75", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontSize: "18px", fontWeight: 800, flex: "0 0 auto" }}>3</span>
                <div style={{ fontSize: "20px", color: "#374151", textAlign: "left", fontWeight: 800, textTransform: "uppercase" }}>BUILD YOUR CARE NETWORK EFFORTLESSLY</div>
              </li>
            </ol>

            {/* legacy Problem→Outcome bullets removed per request */}
            {/* Waitlist input field (inline, non-sticky) */}
            {mounted && (
              <div style={{ marginTop: "28px" }}>
                <h3 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "16px", color: "#2B2D31" }}>Be One of the First to Gain Access</h3>
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div style={{ display: "flex", gap: "12px", maxWidth: "504px", width: "100%" }}>
                    <input
                      type="email"
                      placeholder="Type Email Here"
                      aria-label="Type Email Here"
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
                        background: "#F08A75",
                        color: "#FFFFFF",
                        border: "1px solid #F08A75",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(240,138,117,0.25)",
                        transition: "all 0.2s",
                      }}
                      onClick={() => window.open("https://tally.so/r/n0pRk9", "_blank", "noopener,noreferrer")}
                    >
                      Join Waitlist
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Two iPhone Devices Side by Side (client-only to avoid hydration drift) */}
          {mounted && (
            <div
              style={{
                display: "flex",
                gap: "30px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Phone 1 - Swipe Deck */}
              <div
                style={{
                  width: "280px",
                  height: "580px",
                  background: "#E5E7EB", // Cool Mist Gray device frame
                  borderRadius: "40px",
                  padding: "12px",
                  boxShadow: activePhone === 0 ? "0 30px 60px rgba(0,0,0,0.12)" : "0 20px 40px rgba(0,0,0,0.12)",
                  transform: activePhone === 0 ? "scale(1.08)" : "scale(1)",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div style={{ width: "100%", height: "100%", background: "#FFFFFF", borderRadius: "32px", overflow: "hidden", position: "relative" }}>
                  <div style={{ padding: "16px 20px 8px", display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 600, color: "#3A3A3D" }}>
                    <span>9:41</span>
                    <span>●●●●</span>
                  </div>

                  <div style={{ padding: "16px 20px", textAlign: "center" }}>
                    <div style={{ width: "32px", height: "32px", margin: "0 auto 8px", borderRadius: "8px", background: "#8893AD", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>🏥</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, marginTop: "8px", color: "#2B2D31" }}>introflo.io</div>
                  </div>

                  <div style={{ padding: "0 20px" }}>
                    <div style={{ position: "relative", height: "380px", paddingBottom: 36 }}>
                      {/* Simple swipe deck (3 cards loop) */}
                      {cards.map((card, idx) => {
                        // show top-of-deck as deckIndex, render others behind
                        const isTop = idx === (deckIndex % 3);
                        const z = isTop ? 20 : 10 - idx;
                        // compute transform for top card when swiping
                        let transform = "translateY(0) scale(1) rotate(0deg)";
                        let opacity = 1;
                        if (isTop && swipeState.animating && swipeState.direction === "left") {
                          transform = "translateX(-120%) rotate(-10deg)";
                          opacity = 0.95;
                        } else if (isTop && swipeState.animating && swipeState.direction === "right") {
                          transform = "translateX(120%) rotate(10deg)";
                          opacity = 0.95;
                        } else if (!isTop) {
                          const offset = ((idx + 3 - deckIndex) % 3) * 8;
                          transform = `translateY(${offset}px) scale(${1 - 0.03 * (((idx + 3 - deckIndex) % 3))})`;
                          opacity = 0.9;
                        }

                        return (
                          <div
                            key={idx}
                            style={{
                              position: "absolute",
                              left: "50%",
                              top: 12,
                              transform: `translateX(-50%) ${transform}`,
                              width: "84%",
                              maxWidth: 220,
                              height: 280,
                              background: "#FFFFFF",
                              borderRadius: 18,
                              overflow: "hidden",
                              boxShadow: isTop ? "0 12px 28px rgba(0,0,0,0.14)" : "0 8px 18px rgba(0,0,0,0.08)",
                              transition: isTop ? "transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.42s" : "transform 0.28s ease",
                              zIndex: z,
                              opacity,
                              display: (isTop || (!isTop && ((idx + 3 - deckIndex) % 3) <= 2)) ? undefined : "none",
                            }}
                          >
                            <div style={{ height: 140, display: "block", overflow: "hidden" }}>
                              <img src={card.image} alt={`${card.title} interior`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                            </div>
                            <div style={{ padding: 12 }}>
                              <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>{card.title}</div>
                              <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>📍 {card.location}</div>
                              <div style={{ fontSize: 11, color: "#9ca3af" }}>{card.services}</div>
                            </div>
                          </div>
                        );
                      })}

                      <div style={{ position: "absolute", left: "50%", bottom: 8, transform: "translateX(-50%)", display: "flex", gap: 16, zIndex: 60, pointerEvents: "auto" }}>
                        <button
                          aria-label="dislike"
                          onClick={() => swipe("left")}
                          style={{ width: 56, height: 56, borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 6px 18px rgba(0,0,0,0.08)", border: "none", cursor: "pointer", zIndex: 70 }}
                        >
                          ✕
                        </button>
                        <button
                          aria-label="like"
                          onClick={() => swipe("right")}
                          style={{ width: 56, height: 56, borderRadius: "50%", background: "#8893AD", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, boxShadow: "0 6px 18px rgba(0,0,0,0.12)", border: "none", cursor: "pointer", zIndex: 70 }}
                        >
                          ♥
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ width: "280px", height: "580px", background: "#E5E7EB", borderRadius: "40px", padding: "12px", boxShadow: activePhone === 1 ? "0 30px 60px rgba(0,0,0,0.12)" : "0 20px 40px rgba(0,0,0,0.12)", transform: activePhone === 1 ? "scale(1.08)" : "scale(1)", transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}>
                <div style={{ width: "100%", height: "100%", background: "#FFFFFF", borderRadius: "32px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ padding: "16px 20px 8px", display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 600, color: "#3A3A3D" }}>
                    <span>9:41</span>
                    <span>●●●●</span>
                  </div>

                  <div style={{ padding: "16px 20px", background: "#8893AD", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🏥</div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>Tranquility Behavioral Health</div>
                      <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.9)" }}>Online</div>
                    </div>
                  </div>

                  <div style={{ flex: 1, padding: "16px", background: "#F8F9FA", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                    {showFilter ? (
                      <div style={{ flex: 1, padding: 8, display: "flex", alignItems: "stretch", justifyContent: "center" }}>
                          <div style={{ width: "100%", maxWidth: 320 }}>
                            <FilterPanel onFilterChange={() => {}} />
                          </div>
                        </div>
                      ) : (
                      (mounted ? chatMessages.slice(0, chatStep) : chatMessages.slice(0, 1)).map((m) => (
                        <div key={m.id} style={{ marginBottom: "12px", display: "flex", justifyContent: m.outgoing ? "flex-end" : "flex-start", opacity: 0, animation: "fadeIn 0.5s forwards" }}>
                          <div>
                            <div style={{ maxWidth: "80%", background: m.outgoing ? "#8893AD" : "#FFFFFF", color: m.outgoing ? "#FFFFFF" : "#3A3A3D", padding: "10px 14px", borderRadius: m.outgoing ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: "12px", lineHeight: 1.5, boxShadow: m.outgoing ? "0 4px 12px rgba(0,0,0,0.10)" : "0 2px 8px rgba(0,0,0,0.05)", transition: "transform 0.3s" }}>{m.text}</div>
                            <div style={{ fontSize: "10px", color: "#A0A4AB", marginTop: "4px", textAlign: m.outgoing ? "right" : "left" }}>{m.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                    <style>{`
                      @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
                      @keyframes chipPulse { 0% { transform: translateY(0); opacity: 0.9; } 50% { transform: translateY(-6px); opacity: 1; } 100% { transform: translateY(0); opacity: 0.9; } }
                    `}</style>
                  </div>

                  <div style={{ padding: "12px 16px", borderTop: "1px solid #C9CCD1", background: "#FFFFFF" }}>
                    <div style={{ background: "#E5E7EB", borderRadius: "20px", padding: "10px 16px", fontSize: "12px", color: "#8893AD" }}>Type a message...</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "50px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "42px", fontWeight: 800, marginBottom: "16px", color: "#2B2D31" }}>Why Choose introflo.io?</h2>
            <p style={{ fontSize: "18px", color: "#3A3A3D" }}>Everything you need to build a strong referral network</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px" }}>
            {[
              { icon: "🎯", title: "Smart Matching", desc: "Algorithm connects you with facilities matching your criteria" },
              { icon: "💬", title: "Direct Messaging", desc: "Chat instantly with matched facilities" },
              { icon: "✅", title: "Verified Facilities", desc: "All facilities verified and credentialed" },
            ].map((feature, i) => (
              <div key={i} style={{ textAlign: "center", padding: "32px", background: "#F8F9FA", border: "1px solid #C9CCD1", borderRadius: "14px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px", color: "#8893AD" }}>{feature.icon}</div>
                <h3 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "12px", color: "#2B2D31" }}>{feature.title}</h3>
                <p style={{ fontSize: "15px", color: "#3A3A3D", lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: "#F8F9FA", padding: "80px 40px 40px", borderTop: "1px solid #C9CCD1" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "80px", alignItems: "center" }}>
          <div style={{ gridColumn: "1 / span 2", textAlign: "center" }}>
            <h3 style={{ fontSize: "28px", fontWeight: 800, marginBottom: "18px", color: "#2B2D31" }}>Be One of the First to Gain Access</h3>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px", maxWidth: "504px", margin: "0 auto 32px", alignItems: "center" }}>
              <input type="email" placeholder="Type Email Here" aria-label="Type Email Here" style={{ flex: 1, padding: "14px 18px", fontSize: "16px", borderRadius: "10px", border: "1px solid #C9CCD1", outline: "none", background: "#FFFFFF", color: "#3A3A3D", fontWeight: 500, boxShadow: "0 2px 6px rgba(0,0,0,0.04)", transition: "border 0.2s" }} />
              <button style={{ padding: "14px 28px", fontSize: "16px", borderRadius: "10px", fontWeight: 700, background: "#F08A75", color: "#FFFFFF", border: "1px solid #F08A75", cursor: "pointer", boxShadow: "0 4px 12px rgba(240,138,117,0.25)", transition: "all 0.2s" }} onClick={() => window.open("https://tally.so/r/n0pRk9", "_blank", "noopener,noreferrer")} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(240,138,117,0.32)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(240,138,117,0.25)"; }}>Join Waitlist</button>
            </div>
            <div style={{ fontSize: "14px", color: "#8893AD", paddingTop: "32px", borderTop: "1px solid #C9CCD1" }}>© 2025 introflo.io. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
