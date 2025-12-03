"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import LogoMark from "@/components/LogoMark";
import QRCode from "qrcode";

export default function Home() {
  const [activePhone, setActivePhone] = useState(0);
  const [qrCode, setQrCode] = useState("");
  const [qrTarget, setQrTarget] = useState("");
  const [chatStep, setChatStep] = useState(1); // how many chat messages to show

  // Define a simple scripted chat sequence for animation
  const chatMessages = [
    {
      id: 1,
      text: "Hi! Do you accept Aetna?",
      time: "2:30 PM",
      outgoing: false,
    },
    {
      id: 2,
      text: "Yes! We accept most major insurances including Aetna.",
      time: "2:31 PM",
      outgoing: true,
    },
    {
      id: 3,
      text: "Great. Do you have any openings this week?",
      time: "2:31 PM",
      outgoing: false,
    },
    {
      id: 4,
      text: "We can take new patients starting Thursday.",
      time: "2:32 PM",
      outgoing: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhone((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Chat animation interval: reveal one more message every 2.5s and loop
  useEffect(() => {
    const chatInterval = setInterval(() => {
      setChatStep((prev) => {
        const next = prev + 1;
        return next > chatMessages.length ? 1 : next; // loop back
      });
    }, 2500);
    return () => clearInterval(chatInterval);
  }, [chatMessages.length]);

  useEffect(() => {
    // Generate QR code for mobile access
    const generateQR = async () => {
      try {
        // Prefer a configured public URL when on localhost for mobile scanning
        const configured = process.env.NEXT_PUBLIC_PUBLIC_URL;
        const url =
          typeof window !== "undefined"
            ? window.location.hostname === "localhost" && configured
              ? configured
              : window.location.origin
            : configured || "http://localhost:3000";
        setQrTarget(url);
        const qr = await QRCode.toDataURL(url, { width: 180, margin: 1 });
        setQrCode(qr);
      } catch (err) {
        console.error("QR generation failed:", err);
      }
    };
    generateQR();
  }, []);

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #fff5f3 0%, #ffe4e1 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Navigation */}
      <nav
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(217, 162, 139, 0.15)",
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
              fontWeight: 700,
              background: "var(--accent-warm-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            introflo.io
          </span>
          <Link
            href="/auth_disabled"
            style={{
              padding: "12px 28px",
              fontSize: "15px",
              borderRadius: "12px",
              fontWeight: 600,
              background: "white",
              color: "var(--accent-warm-primary)",
              border: "2px solid var(--accent-warm-primary)",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.2s",
              position: "absolute",
              right: "40px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.background = "var(--accent-warm-primary)";
              e.currentTarget.style.color = "white";
              e.currentTarget.style.borderColor = "transparent";
              e.currentTarget.style.boxShadow =
                "0 4px 12px rgba(217, 162, 139, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.background = "white";
              e.currentTarget.style.color = "var(--accent-warm-primary)";
              e.currentTarget.style.borderColor = "var(--accent-warm-primary)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Sign In
          </Link>
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
                background: "var(--accent-warm-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                maxWidth: "780px",
              }}
            >
              We empower care teams to connect faster and smarter.
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "#6b7280",
                lineHeight: 1.7,
                marginBottom: "40px",
              }}
            >
              Connect with verified facilities, match instantly, chat securely,
              and manage referrals—all in one streamlined workspace.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link
                href="/app/dashboard"
                style={{
                  padding: "16px 36px",
                  fontSize: "17px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  background: "var(--accent-warm-primary)",
                  color: "white",
                  border: "none",
                  textDecoration: "none",
                  display: "inline-block",
                  boxShadow: "0 4px 14px rgba(217, 162, 139, 0.15)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 6px 20px rgba(217, 162, 139, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 14px rgba(217, 162, 139, 0.15)";
                }}
              >
                Get Started
              </Link>
              <Link
                href="/app/dashboard"
                style={{
                  padding: "16px 36px",
                  fontSize: "17px",
                  borderRadius: "12px",
                  fontWeight: 600,
                  background: "white",
                  color: "var(--accent-warm-primary)",
                  border: "2px solid var(--accent-warm-primary)",
                  textDecoration: "none",
                  display: "inline-block",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fff5f3";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                }}
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Two iPhone Devices Side by Side */}
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
                background: "#1f2937",
                borderRadius: "40px",
                padding: "12px",
                boxShadow:
                  activePhone === 0
                    ? "0 30px 60px rgba(139, 92, 246, 0.4)"
                    : "0 20px 40px rgba(0,0,0,0.2)",
                transform: activePhone === 0 ? "scale(1.05)" : "scale(1)",
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(135deg, #faf5ff 0%, #f5f3ff 100%)",
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
                    color: "#111827",
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
                      background: "var(--accent-warm-primary)",
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
                      background: "var(--accent-warm-primary)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    introflo.io
                  </div>
                </div>

                {/* Facility Card */}
                <div style={{ padding: "0 20px" }}>
                  <div
                    style={{
                      background: "white",
                      borderRadius: "20px",
                      overflow: "hidden",
                      boxShadow: "0 8px 24px rgba(217, 162, 139, 0.15)",
                    }}
                  >
                    <div
                      style={{
                        height: "220px",
                        background:
                          "linear-gradient(135deg, var(--accent-warm-primary) 0%, var(--accent-warm-secondary) 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
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
                        background: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      ✕
                    </div>
                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                        background: "var(--accent-warm-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "24px",
                        color: "white",
                        boxShadow: "0 4px 12px rgba(217, 162, 139, 0.15)",
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
                background: "#1f2937",
                borderRadius: "40px",
                padding: "12px",
                boxShadow:
                  activePhone === 1
                    ? "0 30px 60px rgba(217, 162, 139, 0.15)"
                    : "0 20px 40px rgba(0,0,0,0.2)",
                transform: activePhone === 1 ? "scale(1.05)" : "scale(1)",
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  background: "white",
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
                    color: "#111827",
                  }}
                >
                  <span>9:41</span>
                  <span>●●●●</span>
                </div>

                {/* Chat Header */}
                <div
                  style={{
                    padding: "12px 20px",
                    background: "var(--accent-warm-primary)",
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
                    style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px 40px" }}
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: "white",
                      }}
                    >
                      The SD Mindset
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      Online
                    </div>
                  </div>
                </div>

                {/* Messages (Animated) */}
                <div
                  style={{
                    flex: 1,
                    padding: "16px",
                    background: "#f9fafb",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {chatMessages.slice(0, chatStep).map((m) => (
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
                            background: m.outgoing
                              ? "var(--accent-warm-primary)"
                              : "white",
                            color: m.outgoing ? "white" : "#111827",
                            padding: "10px 14px",
                            borderRadius: m.outgoing
                              ? "16px 16px 4px 16px"
                              : "16px 16px 16px 4px",
                            fontSize: "12px",
                            lineHeight: 1.5,
                            boxShadow: m.outgoing
                              ? "0 4px 12px rgba(217, 162, 139, 0.15)"
                              : "0 2px 8px rgba(0,0,0,0.05)",
                            transition: "transform 0.3s",
                          }}
                        >
                          {m.text}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#9ca3af",
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
                    borderTop: "1px solid #e5e7eb",
                    background: "white",
                  }}
                >
                  <div
                    style={{
                      background: "#f3f4f6",
                      borderRadius: "20px",
                      padding: "10px 16px",
                      fontSize: "12px",
                      color: "#9ca3af",
                    }}
                  >
                    Type a message...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "100px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "42px",
                fontWeight: 800,
                marginBottom: "16px",
              }}
            >
              Why Choose introflo.io?
            </h2>
            <p style={{ fontSize: "18px", color: "#6b7280" }}>
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
              <div key={i} style={{ textAlign: "center", padding: "32px" }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    marginBottom: "12px",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "15px",
                    color: "#6b7280",
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
          background: "#fff5f3",
          padding: "80px 40px 40px",
          borderTop: "1px solid rgba(217, 162, 139, 0.15)",
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
          <div>
            <h3
              style={{
                fontSize: "32px",
                fontWeight: 700,
                marginBottom: "16px",
                background: "var(--accent-warm-primary)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Get the app
            </h3>
            <p
              style={{
                fontSize: "18px",
                color: "#6b7280",
                marginBottom: "32px",
              }}
            >
              Just scan the QR code to get started.
            </p>
            <div style={{ display: "flex", gap: "16px", marginBottom: "40px" }}>
              <Link
                href="/app/dashboard"
                style={{
                  padding: "12px 24px",
                  fontSize: "15px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  background: "var(--accent-warm-primary)",
                  color: "white",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Join Waitlist
              </Link>
              <Link
                href="/app/dashboard"
                style={{
                  padding: "12px 24px",
                  fontSize: "15px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  background: "white",
                  color: "var(--accent-warm-primary)",
                  border: "2px solid var(--accent-warm-primary)",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Sign In
              </Link>
            </div>
            <div
              style={{
                fontSize: "14px",
                color: "#9ca3af",
                paddingTop: "32px",
                borderTop: "1px solid rgba(217, 162, 139, 0.15)",
              }}
            >
              © 2025 introflo.io. All rights reserved.
            </div>
          </div>

          {/* QR Code */}
          <div
            style={{
              background: "white",
              padding: "32px",
              borderRadius: "20px",
              boxShadow: "0 8px 24px rgba(217, 162, 139, 0.15)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {qrCode && (
              <img
                src={qrCode}
                alt="QR Code"
                style={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "12px",
                }}
              />
            )}
            <div
              style={{
                marginTop: "16px",
                fontSize: "13px",
                color: "#6b7280",
                textAlign: "center",
              }}
            >
              Scan to view on mobile
              {qrTarget && (
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "11px",
                    color: "#9ca3af",
                  }}
                >
                  URL:{" "}
                  <a
                    href={qrTarget}
                    style={{
                      color: "var(--accent-warm-primary)",
                      textDecoration: "none",
                    }}
                  >
                    {qrTarget}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
