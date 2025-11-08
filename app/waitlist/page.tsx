"use client";

import React, { useState, useEffect, useRef } from "react";
// Correct relative path to styles folder from /app/waitlist/page.tsx
import styles from "../../styles/Landing.module.css";

export default function Home() {
  const [animationStep, setAnimationStep] = useState(4);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [email, setEmail] = useState("");
  const [showDesktop, setShowDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [chatIndex, setChatIndex] = useState(0);
  const [chatMessages, setChatMessages] = useState<
    { side: "left" | "right"; text: string }[]
  >([]);
  const [chatTotal, setChatTotal] = useState(0);
  const phoneChatRef = useRef<HTMLDivElement | null>(null);
  const desktopChatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const runAnimation = () => {
      // Keep early steps snappy; give chat (step 3) extra time via post-hold
      const sequence = [
        { step: 4, delay: 3000 },
        { step: 0, delay: 3000 },
        { step: 1, delay: 3000 },
        { step: 2, delay: 2500 },
        { step: 3, delay: 0 }, // switch to chat, then hold below
      ];

      let timeouts: NodeJS.Timeout[] = [];
      let currentDelay = 0;

      sequence.forEach(({ step, delay }) => {
        currentDelay += delay;
        const timeout = setTimeout(() => {
          setAnimationStep(step);
          if (step === 1) {
            setSwipeOffset(0);
            let offset = 0;
            const swipeInterval = setInterval(() => {
              offset += 5;
              setSwipeOffset(offset);
              if (offset >= 300) {
                clearInterval(swipeInterval);
              }
            }, 20);
          }
        }, currentDelay);
        timeouts.push(timeout);
      });

      // Hold on chat step long enough for the scripted conversation to play
      const POST_CHAT_HOLD_MS = 14000; // ~14s to ensure the full exchange is readable
      const loopTimeout = setTimeout(() => {
        setShowDesktop((prev) => !prev);
        setAnimationStep(4);
        setSwipeOffset(0);
        setTimeout(runAnimation, 100);
      }, currentDelay + POST_CHAT_HOLD_MS);
      timeouts.push(loopTimeout);

      return () => timeouts.forEach(clearTimeout);
    };

    const cleanup = runAnimation();
    return cleanup;
  }, [mounted]);

  // Chat message sequencing when in Chat step (3)
  useEffect(() => {
    if (animationStep !== 3) {
      // reset chat state when leaving chat step
      setChatMessages([]);
      setChatIndex(0);
      setChatTotal(0);
      return;
    }

    // Exactly 4 exchanges (8 messages), alternating sides
    const scripted: { side: "left" | "right"; text: string; delay: number }[] =
      [
        {
          side: "left",
          text: "Hi—appreciate you reaching out. Interested in a quick intro call?",
          delay: 900,
        },
        {
          side: "right",
          text: "Yes, this week works. Do you have Wed/Thu afternoon?",
          delay: 1000,
        },
        {
          side: "left",
          text: "I do—15 minutes on Zoom okay? I can send an invite.",
          delay: 1100,
        },
        {
          side: "right",
          text: "Perfect. Please invite me and our clinical lead.",
          delay: 1000,
        },
        {
          side: "left",
          text: "Also—we'll be at the BH Summit next month. Will you attend?",
          delay: 1100,
        },
        {
          side: "right",
          text: "Yes, we have a booth. If schedules slip, let's meet onsite.",
          delay: 1000,
        },
        {
          side: "left",
          text: "Great—sharing my calendar link now to lock a time.",
          delay: 1000,
        },
        {
          side: "right",
          text: "Booked Thu 2pm. Talk soon—thanks!",
          delay: 900,
        },
      ];

    setChatTotal(scripted.length);

    let active = true;
    let t = 0;
    scripted.forEach((m, i) => {
      t += m.delay;
      setTimeout(() => {
        if (!active) return;
        setChatMessages((prev) => [...prev, { side: m.side, text: m.text }]);
        setChatIndex(i + 1);
      }, t);
    });

    return () => {
      active = false;
    };
  }, [animationStep]);

  // Auto-scroll chat containers to bottom as messages arrive
  useEffect(() => {
    if (animationStep !== 3) return;
    const containers: (HTMLDivElement | null)[] = [
      phoneChatRef.current,
      desktopChatRef.current,
    ];
    containers.forEach((el) => {
      if (!el) return;
      // Use smooth scroll for better feel
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, [chatMessages, animationStep]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      window.location.href = "https://tally.so/r/n0pRk9";
    }
  };

  return (
    <div
      className={styles.landingRoot}
      style={{ background: "var(--bg)", overflow: "hidden" }}
    >
      <div className={`${styles.landingContainer} ${styles.landingCard}`}>
        {/* Logo Header (matches app Navigation logo) */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <a href="/" className="brand-link" style={{ textDecoration: "none" }}>
            <svg
              className="brand-logo-nav"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                width="64"
                height="64"
                rx="12"
                fill="url(#logo-bg-gradient-landing)"
              />
              <path
                d="M32 18L20 28V46H28V38H36V46H44V28L32 18Z"
                fill="white"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M32 34C30.5 32.5 28 31 28 29C28 27.5 29 27 30 27C31 27 31.5 27.5 32 28C32.5 27.5 33 27 34 27C35 27 36 27.5 36 29C36 31 33.5 32.5 32 34Z"
                fill="#FF655C"
              />
              <defs>
                <linearGradient
                  id="logo-bg-gradient-landing"
                  x1="0"
                  y1="0"
                  x2="64"
                  y2="64"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#FF8A65" />
                  <stop offset="0.5" stopColor="#FFB74D" />
                  <stop offset="1" stopColor="#4DB6AC" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="brand-wordmark-nav" style={{ margin: 0 }}>
              introflo.io
            </h1>
          </a>
        </div>
        <div className={styles.landingGrid}>
          {/* Left Content */}
          <div>
            <h1 className={styles.title}>Smart Intros for Care Teams</h1>
            <p className={styles.lead}>
              Connect with the right mental health facilities through
              intelligent matching. Swipe, match, and build your referral
              network effortlessly.
            </p>

            {/* Key Value Propositions */}
            <ul className={styles.features}>
              <li style={{ marginBottom: "12px" }}>
                Too many calls, too few reliable contacts →{" "}
                <strong>Curate your own verified network</strong>
              </li>
              <li style={{ marginBottom: "12px" }}>
                Endless follow-ups and guessing games →{" "}
                <strong>Collaborate confidently with vetted partners</strong>
              </li>
              <li style={{ marginBottom: "12px" }}>
                Disconnected care transitions →{" "}
                <strong>
                  Strengthen every step of your patient's continuum
                </strong>
              </li>
            </ul>

            {/* Email CTA */}
            <div style={{ marginTop: "32px" }}>
              <h3 className={styles.ctaHeading}>Reserve your spot</h3>
              <form onSubmit={handleSubmit} className={styles.ctaForm}>
                <input
                  type="email"
                  placeholder="Enter Email Here"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={styles.input}
                />
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  aria-label="Join the waitlist"
                >
                  Join waitlist
                </button>
              </form>
            </div>
          </div>

          {/* Right Content - Animated iPhone or Desktop */}
          <div className={styles.mockupFrame}>
            <div className={styles.mockupHolder}>
              {!showDesktop ? (
                /* iPhone Mockup */
                <div
                  style={{
                    width: "280px",
                    height: "570px",
                    background: "#000",
                    borderRadius: "50px",
                    padding: "12px",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                    position: "relative",
                  }}
                >
                  {/* Notch */}
                  <div
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "120px",
                      height: "30px",
                      background: "#000",
                      borderRadius: "0 0 20px 20px",
                      zIndex: 10,
                    }}
                  />
                  {/* Screen */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "42px",
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #059669 50%, #d97706 100%)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Step 0 & 1: Swipe View */}
                    {(animationStep === 0 || animationStep === 1) && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          padding: "50px 20px 30px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "20px",
                            fontWeight: 600,
                            color: "white",
                            marginBottom: "20px",
                            textAlign: "center",
                          }}
                        >
                          introflo.io
                        </div>
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              background: "white",
                              borderRadius: "20px",
                              padding: "30px",
                              width: "220px",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                              transform: `translateX(${swipeOffset}px) rotate(${
                                swipeOffset / 10
                              }deg)`,
                              transition:
                                animationStep === 1
                                  ? "none"
                                  : "transform 0.3s ease",
                              opacity: swipeOffset > 200 ? 0 : 1,
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "120px",
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: "12px",
                                marginBottom: "16px",
                              }}
                            />
                            <h3
                              style={{
                                fontSize: "18px",
                                fontWeight: 700,
                                marginBottom: "8px",
                                color: "#1a1a1a",
                              }}
                            >
                              Tranquility Behavioral Health
                            </h3>
                            <p
                              style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                marginBottom: "8px",
                              }}
                            >
                              Coral Springs, FL
                            </p>
                            <p style={{ fontSize: "11px", color: "#9ca3af" }}>
                              Therapy • IOP • Counseling
                            </p>
                          </div>
                          {swipeOffset > 50 && (
                            <div
                              style={{
                                position: "absolute",
                                top: "20%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontSize: "48px",
                                fontWeight: 800,
                                color: "#44bc0c",
                                opacity: Math.min(swipeOffset / 100, 1),
                                textShadow: "0 2px 10px rgba(68, 188, 12, 0.5)",
                              }}
                            >
                              ✓
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "20px",
                            paddingBottom: "20px",
                          }}
                        >
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              background: "rgba(255,101,92,0.2)",
                              border: "3px solid #ff655c",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "24px",
                            }}
                          >
                            ✕
                          </div>
                          <div
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50%",
                              background: "rgba(68,188,12,0.2)",
                              border: "3px solid #44bc0c",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "24px",
                            }}
                          >
                            ✓
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Match Screen */}
                    {animationStep === 2 && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "40px 30px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            color: "white",
                            marginBottom: "30px",
                          }}
                        >
                          introflo.io
                        </div>
                        <div
                          style={{
                            fontSize: "48px",
                            fontWeight: 800,
                            color: "white",
                            marginBottom: "20px",
                          }}
                        >
                          🎉
                        </div>
                        <div
                          style={{
                            fontSize: "32px",
                            fontWeight: 700,
                            color: "white",
                            marginBottom: "16px",
                            textAlign: "center",
                          }}
                        >
                          You Matched!
                        </div>
                        <div
                          style={{
                            fontSize: "14px",
                            color: "white",
                            textAlign: "center",
                            lineHeight: 1.6,
                            marginBottom: "30px",
                            opacity: 0.9,
                          }}
                        >
                          You and Tranquility Behavioral Health
                          <br />
                          have connected
                        </div>
                        <button
                          style={{
                            background: "white",
                            color: "#ff655c",
                            border: "none",
                            padding: "12px 32px",
                            fontSize: "16px",
                            fontWeight: 600,
                            borderRadius: "25px",
                            cursor: "pointer",
                          }}
                        >
                          Start Chat
                        </button>
                      </div>
                    )}

                    {/* Step 3: Chat Screen */}
                    {animationStep === 3 && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          background: "white",
                        }}
                      >
                        <div
                          style={{
                            background: "var(--brand-1)",
                            padding: "50px 20px 20px",
                            color: "white",
                          }}
                        >
                          <div style={{ fontSize: "18px", fontWeight: 700 }}>
                            Tranquility Behavioral Health
                          </div>
                          <div style={{ fontSize: "12px", opacity: 0.9 }}>
                            Online
                          </div>
                        </div>
                        <div
                          style={{
                            flex: 1,
                            padding: "20px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            overflowY: "auto",
                          }}
                          ref={phoneChatRef}
                        >
                          {chatMessages.map((m, idx) => (
                            <div
                              key={idx}
                              className={styles.messageBubble}
                              style={{
                                alignSelf:
                                  m.side === "left" ? "flex-start" : "flex-end",
                                background:
                                  m.side === "left"
                                    ? "#f3f4f6"
                                    : "var(--brand-1)",
                                color: m.side === "left" ? "#111827" : "white",
                                padding: "10px 14px",
                                borderRadius:
                                  m.side === "left"
                                    ? "16px 16px 16px 4px"
                                    : "16px 16px 4px 16px",
                                maxWidth: "70%",
                                fontSize: "13px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                              }}
                            >
                              {m.text}
                            </div>
                          ))}
                          {chatIndex < chatTotal && (
                            <div
                              style={{
                                alignSelf:
                                  chatMessages[chatMessages.length - 1]
                                    ?.side === "left"
                                    ? "flex-end"
                                    : "flex-start",
                              }}
                              aria-label="Typing"
                            >
                              {chatMessages[chatMessages.length - 1]?.side ===
                              "left" ? (
                                <div className={styles.typingDotsRight}>
                                  <span />
                                  <span />
                                  <span />
                                </div>
                              ) : (
                                <div className={styles.typingDots}>
                                  <span />
                                  <span />
                                  <span />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            padding: "15px",
                            borderTop: "1px solid #e5e7eb",
                          }}
                        >
                          <div
                            style={{
                              background: "#f3f4f6",
                              borderRadius: "20px",
                              padding: "10px 16px",
                              fontSize: "13px",
                              color: "#9ca3af",
                            }}
                          >
                            Type a message...
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Filters Screen */}
                    {animationStep === 4 && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          background: "white",
                        }}
                      >
                        <div
                          style={{
                            background: "var(--brand-1)",
                            padding: "50px 20px 20px",
                            color: "white",
                          }}
                        >
                          <div style={{ fontSize: "22px", fontWeight: 700 }}>
                            Filters
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              opacity: 0.9,
                              marginTop: "4px",
                            }}
                          >
                            Find your perfect match
                          </div>
                        </div>
                        <div
                          style={{ flex: 1, padding: "20px", overflow: "auto" }}
                        >
                          <div style={{ marginBottom: "24px" }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                marginBottom: "10px",
                                color: "#1a1a1a",
                              }}
                            >
                              Location
                            </div>
                            <div
                              style={{
                                background: "#f3f4f6",
                                padding: "12px 16px",
                                borderRadius: "10px",
                                fontSize: "14px",
                                color: "#6b7280",
                              }}
                            >
                              📍 Miami, FL • 25 miles
                            </div>
                          </div>
                          <div style={{ marginBottom: "24px" }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                marginBottom: "10px",
                                color: "#1a1a1a",
                              }}
                            >
                              Services Needed
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                              }}
                            >
                              {["IOP", "Therapy", "Counseling", "PHP"].map(
                                (service, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      background:
                                        idx < 2 ? "var(--brand-1)" : "#f3f4f6",
                                      color: idx < 2 ? "white" : "#6b7280",
                                      padding: "8px 16px",
                                      borderRadius: "20px",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {service}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                          <div style={{ marginBottom: "24px" }}>
                            <div
                              style={{
                                fontSize: "14px",
                                fontWeight: 600,
                                marginBottom: "10px",
                                color: "#1a1a1a",
                              }}
                            >
                              Insurance Accepted
                            </div>
                            <div
                              style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                              }}
                            >
                              {["Medicaid", "Medicare", "Private"].map(
                                (insurance, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      background:
                                        idx === 0
                                          ? "var(--brand-1)"
                                          : "#f3f4f6",
                                      color: idx === 0 ? "white" : "#6b7280",
                                      padding: "8px 16px",
                                      borderRadius: "20px",
                                      fontSize: "12px",
                                      fontWeight: 500,
                                    }}
                                  >
                                    {insurance}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                        <div style={{ padding: "20px" }}>
                          <button
                            style={{
                              width: "100%",
                              background:
                                "linear-gradient(135deg, #ff655c, #44bc0c)",
                              color: "white",
                              border: "none",
                              padding: "14px",
                              fontSize: "16px",
                              fontWeight: 600,
                              borderRadius: "10px",
                              cursor: "pointer",
                            }}
                          >
                            Apply Filters
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Desktop Mockup */
                <div
                  style={{
                    width: "500px",
                    height: "320px",
                    background: "#1a1a1a",
                    borderRadius: "12px",
                    padding: "8px",
                    boxShadow: "0 25px 50px rgba(0,0,0,0.3)",
                    position: "relative",
                  }}
                >
                  {/* Camera notch */}
                  <div
                    style={{
                      position: "absolute",
                      top: "8px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "8px",
                      height: "8px",
                      background: "#333",
                      borderRadius: "50%",
                      zIndex: 10,
                    }}
                  />
                  {/* Screen */}
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "8px",
                      background:
                        "linear-gradient(135deg, #7c3aed 0%, #059669 50%, #d97706 100%)",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    {/* Step 0 & 1: Swipe View */}
                    {(animationStep === 0 || animationStep === 1) && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          padding: "30px 40px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "24px",
                            fontWeight: 600,
                            color: "white",
                            marginBottom: "20px",
                          }}
                        >
                          introflo.io
                        </div>
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            position: "relative",
                          }}
                        >
                          <div
                            style={{
                              background: "white",
                              borderRadius: "16px",
                              padding: "30px",
                              width: "280px",
                              boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                              transform: `translateX(${swipeOffset}px) rotate(${
                                swipeOffset / 10
                              }deg)`,
                              transition:
                                animationStep === 1
                                  ? "none"
                                  : "transform 0.3s ease",
                              opacity: swipeOffset > 200 ? 0 : 1,
                            }}
                          >
                            <div
                              style={{
                                width: "100%",
                                height: "120px",
                                background:
                                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                borderRadius: "12px",
                                marginBottom: "16px",
                              }}
                            />
                            <h3
                              style={{
                                fontSize: "20px",
                                fontWeight: 700,
                                marginBottom: "8px",
                                color: "#1a1a1a",
                              }}
                            >
                              Tranquility Behavioral Health
                            </h3>
                            <p
                              style={{
                                fontSize: "14px",
                                color: "#6b7280",
                                marginBottom: "8px",
                              }}
                            >
                              Coral Springs, FL
                            </p>
                            <p style={{ fontSize: "12px", color: "#9ca3af" }}>
                              Therapy • IOP • Counseling
                            </p>
                          </div>
                          {swipeOffset > 50 && (
                            <div
                              style={{
                                position: "absolute",
                                top: "20%",
                                left: "50%",
                                transform: "translateX(-50%)",
                                fontSize: "60px",
                                fontWeight: 800,
                                color: "#44bc0c",
                                opacity: Math.min(swipeOffset / 100, 1),
                                textShadow: "0 2px 10px rgba(68, 188, 12, 0.5)",
                              }}
                            >
                              ✓
                            </div>
                          )}
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            gap: "30px",
                            paddingBottom: "20px",
                          }}
                        >
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              background: "rgba(255,101,92,0.2)",
                              border: "3px solid #ff655c",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "28px",
                            }}
                          >
                            ✕
                          </div>
                          <div
                            style={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "50%",
                              background: "rgba(68,188,12,0.2)",
                              border: "3px solid #44bc0c",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "28px",
                            }}
                          >
                            ✓
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Match Screen */}
                    {animationStep === 2 && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "40px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "28px",
                            fontWeight: 600,
                            color: "white",
                            marginBottom: "30px",
                          }}
                        >
                          introflo.io
                        </div>
                        <div
                          style={{
                            fontSize: "64px",
                            fontWeight: 800,
                            color: "white",
                            marginBottom: "20px",
                          }}
                        >
                          🎉
                        </div>
                        <div
                          style={{
                            fontSize: "40px",
                            fontWeight: 700,
                            color: "white",
                            marginBottom: "16px",
                            textAlign: "center",
                          }}
                        >
                          You Matched!
                        </div>
                        <div
                          style={{
                            fontSize: "16px",
                            color: "white",
                            textAlign: "center",
                            lineHeight: 1.6,
                            marginBottom: "30px",
                            opacity: 0.9,
                          }}
                        >
                          You and Tranquility Behavioral Health
                          <br />
                          have connected
                        </div>
                        <button
                          style={{
                            background: "white",
                            color: "#ff655c",
                            border: "none",
                            padding: "14px 40px",
                            fontSize: "18px",
                            fontWeight: 600,
                            borderRadius: "25px",
                            cursor: "pointer",
                          }}
                        >
                          Start Chat
                        </button>
                      </div>
                    )}

                    {/* Step 3: Chat Screen */}
                    {animationStep === 3 && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          background: "white",
                        }}
                      >
                        {/* Sidebar */}
                        <div
                          style={{
                            width: "180px",
                            background: "#f9fafb",
                            borderRight: "1px solid #e5e7eb",
                            display: "flex",
                            flexDirection: "column",
                            padding: "20px 0",
                          }}
                        >
                          <div
                            style={{ padding: "0 16px", marginBottom: "20px" }}
                          >
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: 700,
                                color: "#1a1a1a",
                              }}
                            >
                              Messages
                            </div>
                          </div>
                          <div
                            style={{
                              padding: "12px 16px",
                              background:
                                "linear-gradient(135deg, rgba(255,101,92,0.1), rgba(68,188,12,0.1))",
                              borderLeft: "3px solid #ff655c",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "13px",
                                fontWeight: 600,
                                color: "#1a1a1a",
                                marginBottom: "4px",
                              }}
                            >
                              Tranquility BH
                            </div>
                            <div style={{ fontSize: "11px", color: "#6b7280" }}>
                              I have a patient who...
                            </div>
                          </div>
                        </div>
                        {/* Chat Area */}
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, #ff655c, #44bc0c)",
                              padding: "20px 24px",
                              color: "white",
                            }}
                          >
                            <div style={{ fontSize: "16px", fontWeight: 700 }}>
                              Tranquility Behavioral Health
                            </div>
                            <div style={{ fontSize: "12px", opacity: 0.9 }}>
                              Online
                            </div>
                          </div>
                          <div
                            style={{
                              flex: 1,
                              padding: "20px 24px",
                              display: "flex",
                              flexDirection: "column",
                              gap: "12px",
                              overflowY: "auto",
                            }}
                            ref={desktopChatRef}
                          >
                            {chatMessages.map((m, idx) => (
                              <div
                                key={idx}
                                className={styles.messageBubble}
                                style={{
                                  alignSelf:
                                    m.side === "left"
                                      ? "flex-start"
                                      : "flex-end",
                                  background:
                                    m.side === "left"
                                      ? "#f3f4f6"
                                      : "var(--brand-1)",
                                  color:
                                    m.side === "left" ? "#111827" : "white",
                                  padding: "10px 14px",
                                  borderRadius:
                                    m.side === "left"
                                      ? "16px 16px 16px 4px"
                                      : "16px 16px 4px 16px",
                                  maxWidth: "70%",
                                  fontSize: "13px",
                                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                                }}
                              >
                                {m.text}
                              </div>
                            ))}
                            {chatIndex < chatTotal && (
                              <div
                                style={{
                                  alignSelf:
                                    chatMessages[chatMessages.length - 1]
                                      ?.side === "left"
                                      ? "flex-end"
                                      : "flex-start",
                                }}
                                aria-label="Typing"
                              >
                                {chatMessages[chatMessages.length - 1]?.side ===
                                "left" ? (
                                  <div className={styles.typingDotsRight}>
                                    <span />
                                    <span />
                                    <span />
                                  </div>
                                ) : (
                                  <div className={styles.typingDots}>
                                    <span />
                                    <span />
                                    <span />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                          <div
                            style={{
                              padding: "15px 24px",
                              borderTop: "1px solid #e5e7eb",
                            }}
                          >
                            <div
                              style={{
                                background: "#f3f4f6",
                                borderRadius: "20px",
                                padding: "10px 16px",
                                fontSize: "13px",
                                color: "#9ca3af",
                              }}
                            >
                              Type a message...
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 4: Filters Screen */}
                    {animationStep === 4 && (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          background: "white",
                        }}
                      >
                        {/* Sidebar */}
                        <div
                          style={{
                            width: "180px",
                            background: "#f9fafb",
                            borderRight: "1px solid #e5e7eb",
                            padding: "20px 16px",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "16px",
                              fontWeight: 700,
                              color: "#1a1a1a",
                              marginBottom: "20px",
                            }}
                          >
                            introflo.io
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#6b7280",
                              marginBottom: "12px",
                            }}
                          >
                            🔍 Discover
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#1a1a1a",
                              fontWeight: 600,
                              padding: "8px 12px",
                              background:
                                "linear-gradient(135deg, rgba(255,101,92,0.1), rgba(68,188,12,0.1))",
                              borderRadius: "8px",
                              marginBottom: "8px",
                            }}
                          >
                            ⚙️ Filters
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "#6b7280",
                              marginBottom: "12px",
                            }}
                          >
                            💬 Messages
                          </div>
                          <div style={{ fontSize: "13px", color: "#6b7280" }}>
                            ⭐ Matches
                          </div>
                        </div>
                        {/* Filter Content */}
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <div
                            style={{
                              background:
                                "linear-gradient(135deg, #ff655c, #44bc0c)",
                              padding: "20px 24px",
                              color: "white",
                            }}
                          >
                            <div style={{ fontSize: "20px", fontWeight: 700 }}>
                              Filters
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                opacity: 0.9,
                                marginTop: "4px",
                              }}
                            >
                              Find your perfect match
                            </div>
                          </div>
                          <div
                            style={{
                              flex: 1,
                              padding: "20px 24px",
                              overflow: "auto",
                            }}
                          >
                            <div style={{ marginBottom: "20px" }}>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  marginBottom: "10px",
                                  color: "#1a1a1a",
                                }}
                              >
                                Location
                              </div>
                              <div
                                style={{
                                  background: "#f3f4f6",
                                  padding: "10px 14px",
                                  borderRadius: "8px",
                                  fontSize: "13px",
                                  color: "#6b7280",
                                }}
                              >
                                📍 Miami, FL • 25 miles
                              </div>
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  marginBottom: "10px",
                                  color: "#1a1a1a",
                                }}
                              >
                                Services Needed
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "8px",
                                }}
                              >
                                {["IOP", "Therapy", "Counseling", "PHP"].map(
                                  (service, idx) => (
                                    <div
                                      key={idx}
                                      style={{
                                        background:
                                          idx < 2
                                            ? "linear-gradient(135deg, #ff655c, #44bc0c)"
                                            : "#f3f4f6",
                                        color: idx < 2 ? "white" : "#6b7280",
                                        padding: "6px 14px",
                                        borderRadius: "16px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {service}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                            <div style={{ marginBottom: "20px" }}>
                              <div
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 600,
                                  marginBottom: "10px",
                                  color: "#1a1a1a",
                                }}
                              >
                                Insurance Accepted
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "8px",
                                }}
                              >
                                {["Medicaid", "Medicare", "Private"].map(
                                  (insurance, idx) => (
                                    <div
                                      key={idx}
                                      style={{
                                        background:
                                          idx === 0
                                            ? "linear-gradient(135deg, #ff655c, #44bc0c)"
                                            : "#f3f4f6",
                                        color: idx === 0 ? "white" : "#6b7280",
                                        padding: "6px 14px",
                                        borderRadius: "16px",
                                        fontSize: "12px",
                                        fontWeight: 500,
                                      }}
                                    >
                                      {insurance}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                          <div style={{ padding: "20px 24px" }}>
                            <button
                              style={{
                                width: "100%",
                                background: "var(--brand-1)",
                                color: "white",
                                border: "none",
                                padding: "12px",
                                fontSize: "14px",
                                fontWeight: 600,
                                borderRadius: "8px",
                                cursor: "pointer",
                              }}
                            >
                              Apply Filters
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Desktop Stand */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "120px",
                      height: "20px",
                      background: "linear-gradient(to bottom, #1a1a1a, #333)",
                      borderRadius: "0 0 8px 8px",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
