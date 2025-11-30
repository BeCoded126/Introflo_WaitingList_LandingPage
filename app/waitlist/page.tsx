"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
// Dynamically import sticky waitlist bar (client-only, no SSR) to prevent hydration drift
const StickyWaitlist = dynamic(() => import("@/components/StickyWaitlist"), {
  ssr: false,
});
import DesktopMockup from "../components/DesktopMockup";

export default function Waitlist() {
  // Hydration stabilization: track mounted state so we can delay animations
  const [mounted, setMounted] = useState(false);
  const [activePhone, setActivePhone] = useState(0);
  const [chatStep, setChatStep] = useState(1); // how many chat messages to show
  const [deckIndex, setDeckIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDir, setSwipeDir] = useState<string | null>(null);

  const [heroEmail, setHeroEmail] = useState("");
  const [footerEmail, setFooterEmail] = useState("");

  const TALLY_URL = "https://tally.so/r/n0pRk9";

  // Device alternation: show desktop every other cycle
  const showDesktop = activePhone === 1;

  // Card images (real office photos in public/images)
  const cards = [
    {
      title: "Tranquility Behavioral",
      image: "/images/interior-1.jpg",
      location: "Coral Springs, FL",
    },
    {
      title: "Tranquility Behavioral Health",
      image: "/images/interior-2.jpg",
      location: "Fort Lauderdale, FL",
    },
    {
      title: "Harmony Care",
      image: "/images/interior-3.jpg",
      location: "Miami, FL",
    },
    {
      title: "Therapy Room",
      image: "/images/therapy-room.jpg",
      location: "Miami, FL",
    },
  ];

  // Define a simple scripted chat sequence for animation
  const chatMessages = [
    {
      id: 1,
      text: "So glad we matched — excited to connect!",
      time: "2:30 PM",
      outgoing: false,
    },
    {
      id: 2,
      text: "Thanks — we'd love that. Want to hop on a quick call to explore referrals?",
      time: "2:31 PM",
      outgoing: true,
    },
    {
      id: 3,
      text: "Yes — how about Thursday at 3:00 PM? I can share how we can refer patients.",
      time: "2:32 PM",
      outgoing: false,
    },
    {
      id: 4,
      text: "Thursday 3 works for me. I'll send a calendar invite — excited to connect!",
      time: "2:33 PM",
      outgoing: true,
    },
  ];

  // Begin phone swap animation only after mount (prevents early client/server divergence)
  useEffect(() => {
    if (!mounted) return;
    const interval = setInterval(() => {
      setActivePhone((prev) => (prev === 0 ? 1 : 0));
    }, 8000); // changed to 8 seconds per request
    return () => clearInterval(interval);
  }, [mounted]);

  const handleSwipe = (dir: "left" | "right") => {
    if (isSwiping) return;
    setSwipeDir(dir);
    setIsSwiping(true);
    // animate then advance deck
    setTimeout(() => {
      setDeckIndex((d) => (d + 1) % cards.length);
      setIsSwiping(false);
      setSwipeDir(null);
    }, 520);
  };

  // Visual-only swipe: triggers the swipe animation but does NOT change the deck index.
  // This is used when you want the visual effect without advancing data/state.
  const visualSwipe = (dir: "left" | "right") => {
    if (isSwiping) return;
    setSwipeDir(dir);
    setIsSwiping(true);
    setTimeout(() => {
      setIsSwiping(false);
      setSwipeDir(null);
    }, 520);
  };

  // Auto-demo swipe: periodically trigger the visual swipe on the left card.
  useEffect(() => {
    if (!mounted) return;
    const swipeDemo = setInterval(() => {
      if (isSwiping) return; // don't interrupt an active animation
      const dir = Math.random() > 0.5 ? "left" : "right";
      visualSwipe(dir);
    }, 3600);
    return () => clearInterval(swipeDemo);
  }, [mounted, isSwiping]);

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
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = heroEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      alert("Please enter a valid email address to join the waitlist.");
      return;
    }
    window.location.href = `${TALLY_URL}?hero_email=${encodeURIComponent(value)}`;
  };

  const handleFooterSubmit = (e?: React.MouseEvent | React.FormEvent) => {
    e?.preventDefault?.();
    const value = footerEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value || !emailRegex.test(value)) {
      alert("Please enter a valid email address to join the waitlist.");
      return;
    }
    window.location.href = `${TALLY_URL}?footer_email=${encodeURIComponent(value)}`;
  };

  // Note: No QR rendering on this page; QR generation removed to avoid unnecessary client work
  return (
    <div
      suppressHydrationWarning
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
          padding: "48px 40px 40px",
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
                fontSize: "clamp(24px, 2.8vw, 38px)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "12px",
                color: "#2B2D31", // Deep Slate for headings
                maxWidth: "780px",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              We Help Your Private Practice Connect <em>Faster & Smarter</em>
            </h1>

            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                marginTop: "6px",
                marginBottom: "18px",
                color: "#2B2D31",
                maxWidth: "780px",
              }}
            >
              With Verified Partners Who Are <u>Looking For You Too.</u>
            </h3>

            <ul
              style={{
                listStyle: "none",
                paddingLeft: 0,
                marginTop: "8px",
                marginBottom: "14px",
                color: "#374151",
                fontSize: "22px",
                lineHeight: 1.7,
              }}
            >
              <li
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: "0.575em",
                    lineHeight: 1,
                    fontWeight: 500,
                    color: "#374151",
                    marginTop: 0,
                  }}
                >
                  ●
                </span>
                <span>Swipe</span>
              </li>
              <li
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: "0.575em",
                    lineHeight: 1,
                    fontWeight: 500,
                    color: "#374151",
                    marginTop: 0,
                  }}
                >
                  ●
                </span>
                <span>Match</span>
              </li>
              <li
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: "0.575em",
                    lineHeight: 1,
                    fontWeight: 500,
                    color: "#374151",
                    marginTop: 0,
                  }}
                >
                  ●
                </span>
                <span>Connect & Build your Network Effortlessly</span>
              </li>
            </ul>

            {/* Problem → Outcome bullets removed per request */}
            {/* Waitlist input field (dynamically loaded client-only component) */}
            {mounted && (
              <div style={{ marginTop: 20 }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 800,
                    marginTop: 24,
                    marginBottom: 20,
                    color: "#2B2D31",
                  }}
                >
                  BE ONE OF THE FIRST TO GAIN ACCESS.
                </div>
                <StickyWaitlist heroEmail={heroEmail} setHeroEmail={setHeroEmail} handleHeroSubmit={handleHeroSubmit} />
              </div>
            )}
          </div>

          {/* Shared mockup container that holds both mobile and desktop layers */}
          {mounted && (
            <div
              style={{
                width: "590px", // two phones (280 + 280) + 30 gap
                height: "580px",
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Mobile layer: two phones side-by-side */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  gap: "30px",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 600ms cubic-bezier(0.4,0,0.2,1), transform 600ms cubic-bezier(0.4,0,0.2,1)",
                  opacity: showDesktop ? 0 : 1,
                  transform: showDesktop ? "scale(0.98)" : "scale(1)",
                }}
              >
                {/* Phone 1 - Swipe Deck */}
                <div
                  style={{
                    width: "280px",
                    height: "580px",
                    background: "#E5E7EB",
                    borderRadius: "40px",
                    padding: "12px",
                    boxShadow:
                      activePhone === 0
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

                    <div style={{ padding: "16px 20px", textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 800,
                          marginTop: "8px",
                          color: "#2B2D31",
                          letterSpacing: "0.3px",
                        }}
                      >
                        introflo.io
                      </div>
                    </div>

                    <div style={{ padding: "0 20px" }}>
                      <div
                        style={{
                          background: "#FFFFFF",
                          borderRadius: "20px",
                          overflow: "hidden",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                          transform: isSwiping
                            ? swipeDir === "left"
                              ? "translateX(-420px) rotate(-15deg) scale(0.95)"
                              : "translateX(420px) rotate(15deg) scale(0.95)"
                            : "translateX(0) rotate(0) scale(1)",
                          opacity: isSwiping ? 0 : 1,
                          transition:
                            "transform 520ms cubic-bezier(0.22, 1, 0.36, 1), opacity 520ms linear",
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
                          <img
                            src={cards[0].image}
                            alt={cards[0].title}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        </div>
                        <div style={{ padding: "16px" }}>
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              marginBottom: "6px",
                            }}
                          >
                            Tranquility Behavioral
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

                        <div
                          style={{
                            display: "flex",
                            gap: "16px",
                            justifyContent: "center",
                            marginTop: "20px",
                          }}
                        >
                          <div
                            aria-hidden="true"
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
                              userSelect: "none",
                            }}
                          >
                            ✕
                          </div>
                          <div
                            aria-hidden="true"
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
                              userSelect: "none",
                            }}
                          >
                            ♥
                          </div>
                        </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    width: "280px",
                    height: "580px",
                    background: "#E5E7EB",
                    borderRadius: "40px",
                    padding: "12px",
                    boxShadow:
                      activePhone === 1
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
                          overflow: "hidden",
                          background: "white",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img src={cards[0].image} alt={cards[0].title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#FFFFFF" }}>
                          Tranquility Behavioral
                        </div>
                        <div style={{ fontSize: "11px", color: "rgba(255, 255, 255, 0.9)" }}>
                          Online
                        </div>
                      </div>
                    </div>

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
                      {(mounted
                        ? chatMessages.slice(0, chatStep)
                        : chatMessages.slice(0, 1)
                      ).map((m) => (
                        <div
                          key={m.id}
                          style={{
                            marginBottom: "12px",
                            display: "flex",
                            justifyContent: m.outgoing
                              ? "flex-end"
                              : "flex-start",
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
                      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                    </div>

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

              {/* Desktop layer: center the DesktopMockup and scale to fit the same footprint */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "opacity 600ms cubic-bezier(0.4,0,0.2,1), transform 600ms cubic-bezier(0.4,0,0.2,1)",
                  opacity: showDesktop ? 1 : 0,
                  transform: showDesktop ? "scale(1)" : "scale(0.98)",
                }}
              >
                <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <DesktopMockup />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section style={{ padding: "60px 24px", background: "#FFFFFF" }}>
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
              Everything You Need to Build a Strong Referral Network
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
              <div
                key={i}
                style={{
                  textAlign: "center",
                  padding: "32px",
                  background: "#F8F9FA",
                  border: "1px solid #C9CCD1",
                  borderRadius: "14px",
                }}
              >
                <div
                  style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    color: "#8893AD",
                  }}
                >
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

      <footer
        style={{
          background: "#F8F9FA",
          padding: "80px 40px 40px",
          borderTop: "1px solid #C9CCD1",
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
                marginTop: "40px",
                marginBottom: "32px",
                color: "#2B2D31",
              }}
            >
              BE ONE OF THE FIRST TO GAIN ACCESS
            </h3>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                maxWidth: "420px",
                margin: "0 auto 32px",
                alignItems: "center",
              }}
            >
              <input
                type="email"
                placeholder="Enter email address"
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
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
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
                onClick={(e) => handleFooterSubmit(e)}
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
