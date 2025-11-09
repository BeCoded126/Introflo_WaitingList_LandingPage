"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
// Dynamically import sticky waitlist bar (client-only, no SSR) to prevent hydration drift
const StickyWaitlist = dynamic(() => import("@/components/StickyWaitlist"), { ssr: false });

export default function Waitlist() {
  // Hydration stabilization: track mounted state so we can delay animations
  const [mounted, setMounted] = useState(false);
  const [activePhone, setActivePhone] = useState(0);
  const [chatStep, setChatStep] = useState(1); // how many chat messages to show

  // Define a simple scripted chat sequence for animation
  const chatMessages = [
    { id: 1, text: "Hi! Do you accept Aetna?", time: "2:30 PM", outgoing: false },
    { id: 2, text: "Yes! We accept most major insurances including Aetna.", time: "2:31 PM", outgoing: true },
    { id: 3, text: "Great. Do you have any openings this week?", time: "2:31 PM", outgoing: false },
    { id: 4, text: "We can take new patients starting Thursday.", time: "2:32 PM", outgoing: true },
  ];

  // Begin phone swap animation only after mount (prevents early client/server divergence)
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setActivePhone((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, [mounted]);

  // Chat animation interval: reveal one more message every 2.5s and loop
  // Chat message reveal sequence - start only after mount for deterministic initial HTML
  useEffect(() => {
    if (!mounted) return;
    const chatInterval = setInterval(() => {
      setChatStep((prev) => {
        const next = prev + 1;
        return next > chatMessages.length ? 1 : next; // loop back
      });
    }, 2500);
    return () => clearInterval(chatInterval);
  }, [mounted, chatMessages.length]);

  // Mark component as mounted (runs after hydration)
  useEffect(() => { setMounted(true); }, []);

  // Note: No QR rendering on this page; QR generation removed to avoid unnecessary client work

  return (
    <div suppressHydrationWarning
      style={{
        background: "#F8F9FA", // Cloud White
        minHeight: "100vh",
        color: "#3A3A3D", // Graphite Text default
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          background: "rgba(248, 249, 250, 0.95)", // Cloud White translucent
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #C9CCD1", // Stone Neutral
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "20px 40px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "28px",
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
          padding: "80px 40px 100px",
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
          <div style={{ maxWidth: "600px" }}>
            <h1
              style={{
                fontSize: "clamp(42px, 5.4vw, 64px)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "24px",
                color: "#2B2D31", // Deep Slate for headings
                maxWidth: "780px",
              }}
            >
              We Empower Care Teams to Connect Faster and Smarter.
            </h1>
            {/* Intro copy (two lines) */}
            <p
              style={{
                fontSize: "18px",
                color: "#374151",
                lineHeight: 1.7,
                marginBottom: "8px",
              }}
            >
              Connect with the right behavioral practices through intelligent matching.
            </p>
            <p
              style={{
                fontSize: "18px",
                color: "#374151",
                lineHeight: 1.7,
                marginBottom: "14px",
              }}
            >
              Swipe, match, and build your network effortlessly.
            </p>

            {/* Problem → Outcome bullets */}
            <ul style={{ listStyle: "none", padding: 0, margin: 0, marginBottom: "16px" }}>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                <div style={{ width: "12px", height: "12px", background: "#8893AD", borderRadius: "3px", marginTop: "6px", flex: "0 0 12px" }} />
                <div style={{ fontSize: "16px", color: "#3A3A3D", lineHeight: 1.6 }}>
                  Too many calls, too few reliable contacts <span style={{ color: "#6b7280" }}>→</span> <strong>Curate your own verified network</strong>
                </div>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "10px" }}>
                <div style={{ width: "12px", height: "12px", background: "#8893AD", borderRadius: "3px", marginTop: "6px", flex: "0 0 12px" }} />
                <div style={{ fontSize: "16px", color: "#3A3A3D", lineHeight: 1.6 }}>
                  Endless follow-ups and guessing games <span style={{ color: "#6b7280" }}>→</span> <strong>Collaborate confidently with vetted partners</strong>
                </div>
              </li>
              <li style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ width: "12px", height: "12px", background: "#8893AD", borderRadius: "3px", marginTop: "6px", flex: "0 0 12px" }} />
                <div style={{ fontSize: "16px", color: "#3A3A3D", lineHeight: 1.6 }}>
                  Disconnected care transitions <span style={{ color: "#6b7280" }}>→</span> <strong>Strengthen every step of your patient's continuum</strong>
                </div>
              </li>
            </ul>
            {/* Waitlist input field (dynamically loaded client-only component) */}
            {mounted && <StickyWaitlist />}
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
                boxShadow: activePhone === 0 
                  ? "0 30px 60px rgba(0,0,0,0.12)" 
                  : "0 20px 40px rgba(0,0,0,0.12)",
                transform: activePhone === 0 ? "scale(1.05)" : "scale(1)",
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#FFFFFF",
                  borderRadius: "32px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                {/* Status Bar */}
                <div
                  style={{
                    padding: "16px 20px 8px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#3A3A3D",
                  }}
                >
                  <span>9:41</span>
                  <span>●●●●</span>
                </div>

                {/* App Header */}
                <div style={{ padding: "16px 20px", textAlign: "center" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      margin: "0 auto 8px",
                      borderRadius: "8px",
                      background: "#8893AD",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "16px",
                    }}
                  >
                    🏥
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      marginTop: "8px",
                      color: "#2B2D31",
                    }}
                  >
                    introflo.io
                  </div>
                </div>

                {/* Facility Card */}
                <div style={{ padding: "0 20px" }}>
                  <div
                    style={{
                      background: "#FFFFFF",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div
                      style={{
                        height: "220px",
                        background: "#E5E7EB",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#2B2D31",
                        fontSize: "48px",
                      }}
                    >
                      🏥
                    </div>
                    <div style={{ padding: "16px" }}>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: 700,
                          marginBottom: "6px",
                        }}
                      >
                        The SD Mindset
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          marginBottom: "8px",
                        }}
                      >
                        📍 Coral Springs, FL
                      </div>
                      <div style={{ fontSize: "10px", color: "#9ca3af" }}>
                        Therapy • IOP • Counseling
                      </div>
                    </div>
                  </div>

                  {/* Swipe Buttons */}
                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      justifyContent: "center",
                      marginTop: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      ✕
                    </div>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: "#8893AD",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        color: "#FFFFFF",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      }}
                    >
                      ♥
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phone 2 - Chat View */}
            <div
              style={{
                width: "280px",
                height: "580px",
                background: "#E5E7EB", // Cool Mist Gray
                borderRadius: "40px",
                padding: "12px",
                boxShadow: activePhone === 1
                  ? "0 30px 60px rgba(0,0,0,0.12)"
                  : "0 20px 40px rgba(0,0,0,0.12)",
                transform: activePhone === 1 ? "scale(1.05)" : "scale(1)",
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#FFFFFF",
                  borderRadius: "32px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Status Bar */}
                <div
                  style={{
                    padding: "16px 20px 8px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: "#3A3A3D",
                  }}
                >
                  <span>9:41</span>
                  <span>●●●●</span>
                </div>

                {/* Chat Header */}
                <div
                  style={{
                    padding: "12px 20px",
                    background: "#8893AD",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      background: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    🏥
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>
                      The SD Mindset
                    </div>
                    <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.9)" }}>
                      Online
                    </div>
                  </div>
                </div>

                {/* Messages (Animated) */}
                <div
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: "#F8F9FA",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {(mounted ? chatMessages.slice(0, chatStep) : chatMessages.slice(0, 1)).map((m) => (
                    <div
                      key={m.id}
                      style={{
                        marginBottom: "12px",
                        display: "flex",
                        justifyContent: m.outgoing ? "flex-end" : "flex-start",
                        opacity: 0,
                        animation: "fadeIn 0.5s forwards",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            maxWidth: "80%",
                            background: m.outgoing ? "#8893AD" : "#FFFFFF",
                            color: m.outgoing ? "#FFFFFF" : "#3A3A3D",
                            padding: "10px 14px",
                            borderRadius: m.outgoing
                              ? "16px 16px 4px 16px"
                              : "16px 16px 16px 4px",
                            fontSize: "12px",
                            lineHeight: 1.5,
                            boxShadow: m.outgoing
                              ? "0 4px 12px rgba(0,0,0,0.10)"
                              : "0 2px 8px rgba(0,0,0,0.05)",
                            transition: "transform 0.3s",
                          }}
                        >
                          {m.text}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#A0A4AB",
                            marginTop: "4px",
                            textAlign: m.outgoing ? "right" : "left",
                          }}
                        >
                          {m.time}
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Simple keyframes injection */}
                  <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px);} to { opacity: 1; transform: translateY(0);} }`}</style>
                </div>

                {/* Message Input */}
                <div
                  style={{
                    padding: "12px 16px",
                    borderTop: "1px solid #C9CCD1",
                    background: "#FFFFFF",
                  }}
                >
                  <div
                    style={{
                      background: "#E5E7EB",
                      borderRadius: "20px",
                      padding: "10px 16px",
                      fontSize: "12px",
                      color: "#8893AD",
                    }}
                  >
                    Type a message...
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "42px",
                fontWeight: 800,
                marginBottom: "16px",
                color: "#2B2D31",
              }}
            >
              Why Choose introflo.io?
            </h2>
            <p style={{ fontSize: "18px", color: "#3A3A3D" }}>
              Everything you need to build a strong referral network
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "40px",
            }}
          >
            {[
              {
                icon: "🎯",
                title: "Smart Matching",
                desc: "Algorithm connects you with facilities matching your criteria",
              },
              {
                icon: "💬",
                title: "Direct Messaging",
                desc: "Chat instantly with matched facilities",
              },
              {
                icon: "✅",
                title: "Verified Facilities",
                desc: "All facilities verified and credentialed",
              },
            ].map((feature, i) => (
              <div key={i} style={{ textAlign: "center", padding: "32px", background: "#F8F9FA", border: "1px solid #C9CCD1", borderRadius: "14px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px", color: "#8893AD" }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    marginBottom: "12px",
                    color: "#2B2D31",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#3A3A3D",
                    lineHeight: 1.6,
                  }}
                >
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer with QR Code */}
      <footer
        style={{
          background: "#F8F9FA", // Cloud White
          padding: "80px 40px 40px",
          borderTop: "1px solid #C9CCD1", // Stone Neutral
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "80px",
            alignItems: "center",
          }}
        >
          <div style={{ gridColumn: "1 / span 2", textAlign: "center" }}>
            <h3
              style={{
                fontSize: "28px",
                fontWeight: 800,
                marginBottom: "18px",
                color: "#2B2D31",
              }}
            >
              Be One of the First to Gain Access
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                maxWidth: "420px",
                margin: "0 auto 32px",
                alignItems: "center"
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
                  transition: "border 0.2s"
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
                  transition: "all 0.2s"
                }}
                onClick={() => window.open("https://tally.so/r/n0pRk9", "_blank", "noopener,noreferrer")}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 16px rgba(240,138,117,0.32)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(240,138,117,0.25)"; }}
              >
                Join
              </button>
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#8893AD",
                paddingTop: "32px",
                borderTop: "1px solid #C9CCD1",
              }}
            >
              © 2025 introflo.io. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
