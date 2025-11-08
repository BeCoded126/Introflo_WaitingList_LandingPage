"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import QRCode from "qrcode";

export default function HomePage() {
  const [step, setStep] = useState(0);
  const [showDesktop, setShowDesktop] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [iosQR, setIosQR] = useState("");
  const [androidQR, setAndroidQR] = useState("");

  useEffect(() => {
    // Generate QR codes
    const iosUrl = "http://192.168.0.60:3000";
    const androidUrl = "http://192.168.0.60:3000";

    QRCode.toDataURL(iosUrl, { width: 140, margin: 1 })
      .then(url => setIosQR(url))
      .catch(err => console.error(err));

    QRCode.toDataURL(androidUrl, { width: 140, margin: 1 })
      .then(url => setAndroidQR(url))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    const runAnimation = () => {
      const sequence = [
        { step: 0, delay: 3000 },
        { step: 1, delay: 3000 },
        { step: 2, delay: 2500 },
        { step: 3, delay: 8000 },
      ];

      let timeouts: NodeJS.Timeout[] = [];
      let currentDelay = 0;

      sequence.forEach(({ step: s, delay }) => {
        currentDelay += delay;
        const timeout = setTimeout(() => {
          setStep(s);
          if (s === 1) {
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

      const loopTimeout = setTimeout(() => {
        setShowDesktop((prev) => !prev);
        setStep(0);
        setSwipeOffset(0);
        setTimeout(runAnimation, 100);
      }, currentDelay);
      timeouts.push(loopTimeout);

      return () => timeouts.forEach(clearTimeout);
    };

    const cleanup = runAnimation();
    return cleanup;
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 40px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(480px, 1fr))",
            gap: "64px",
            alignItems: "center",
            padding: "64px 0 48px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(40px,7vw,60px)",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "28px",
                color: "#ff655c",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              Smart referrals for behavioral health teams
            </h1>
            <p
              style={{
                fontSize: "clamp(18px,2.6vw,22px)",
                color: "#5d646d",
                maxWidth: "640px",
                marginBottom: "40px",
                lineHeight: 1.55,
              }}
            >
              Connect with verified facilities, match instantly, chat securely,
              and manage referrals—all in one streamlined workspace.
            </p>
            <div style={{ display: "flex", gap: "18px", flexWrap: "wrap" }}>
              <Link
                href="/waitlist"
                style={{
                  padding: "16px 34px",
                  fontSize: "18px",
                  background: "#ff655c",
                  color: "white",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 14px rgba(255,101,92,0.35)",
                  transition: "transform .25s",
                }}
              >
                Join Waitlist
              </Link>
              <Link
                href="/auth/signin"
                style={{
                  padding: "16px 34px",
                  fontSize: "18px",
                  background: "white",
                  color: "#ff655c",
                  border: "2px solid #ff655c",
                  borderRadius: "12px",
                  textDecoration: "none",
                  fontWeight: 600,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                }}
              >
                Sign In
              </Link>
            </div>
          </div>

          <div
            style={{
              position: "relative",
              height: "640px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            {!showDesktop ? (
              <>
                <PhoneShell
                  style={{
                    opacity: 0.95,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(135deg,#ff8a65 0%, #ffb74d 50%, #4db6ac 100%)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    <LogoMark size={120} />
                    <div style={{ fontSize: "40px", marginTop: "12px" }}>
                      introflo.io
                    </div>
                  </div>
                </PhoneShell>

                <PhoneShell>
                  {step === 0 && <SwipeCard swipeOffset={0} />}
                  {step === 1 && <SwipeCard swipeOffset={swipeOffset} />}
                  {step === 2 && <MatchScreen />}
                  {step === 3 && <ChatPreview />}
                </PhoneShell>
              </>
            ) : (
              <DesktopMockup step={step} swipeOffset={swipeOffset} />
            )}
          </div>
        </section>

        <section style={{ padding: "32px 0 72px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: 700,
              textAlign: "center",
              marginBottom: "44px",
              color: "#14212b",
              letterSpacing: ".3px",
            }}
          >
            How IntroFlo Works
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: "28px",
              maxWidth: "1080px",
              margin: "0 auto",
            }}
          >
            {[
              {
                icon: "🎯",
                title: "Smart Matching",
                body: "Surface facilities aligned with your clinical criteria.",
              },
              {
                icon: "💬",
                title: "Instant Messaging",
                body: "Coordinate care transitions in real time.",
              },
              {
                icon: "✅",
                title: "Verified Facilities",
                body: "Engage only with vetted, credentialed partners.",
              },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: "white",
                  borderRadius: "18px",
                  padding: "28px 26px 30px",
                  boxShadow: "0 6px 20px rgba(16,24,40,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <div style={{ fontSize: "42px" }}>{f.icon}</div>
                <h3
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                    color: "#14212b",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{ fontSize: "15px", lineHeight: 1.5, color: "#637181" }}
                >
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* App footer (semantic), brand-aligned and symmetric */}
        <footer
          role="contentinfo"
          aria-labelledby="footer-cta"
          style={{
            marginTop: 48,
            marginBottom: 64,
            borderRadius: 32,
            background: "#14212b",
            color: "#ffffff",
            padding: "56px clamp(20px,4vw,64px)",
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              alignItems: "center",
              gap: 32,
            }}
          >
            {/* Left phone (swipe) */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ transform: "rotate(-8deg) translateY(6px)" }}>
                <MiniPhone variant="swipe" />
              </div>
            </div>

            {/* Center content */}
            <div style={{ textAlign: "center", padding: "0 8px" }}>
              <h2
                id="footer-cta"
                style={{
                  fontSize: "clamp(24px,4.8vw,38px)",
                  fontWeight: 800,
                  letterSpacing: ".4px",
                  marginBottom: 12,
                }}
              >
                Open the mobile preview
              </h2>
              <p
                style={{
                  fontSize: "clamp(14px,2.2vw,18px)",
                  color: "#e2e8f0",
                  margin: "0 auto 18px",
                  maxWidth: 600,
                  lineHeight: 1.6,
                }}
              >
                Scan the code to explore matching, chat, and referrals. No install required.
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 20,
                  padding: 16,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 20,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                }}
              >
                <div
                  style={{
                    width: 160,
                    height: 160,
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "#0b1720",
                  }}
                  aria-label="QR to open mobile preview"
                >
                  {iosQR ? (
                    <img
                      src={iosQR}
                      alt="Scan IntroFlo preview QR"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#94a3b8",
                        fontSize: 12,
                        background:
                          "repeating-linear-gradient(45deg,#0f1c26,#0f1c26 10px,#102231 10px,#102231 20px)",
                      }}
                    >
                      Generating…
                    </div>
                  )}
                </div>
                <a
                  href="/qr"
                  style={{
                    background: "linear-gradient(135deg,#ff655c,#ff8a65)",
                    color: "white",
                    textDecoration: "none",
                    padding: "14px 22px",
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 700,
                    letterSpacing: ".4px",
                    boxShadow: "0 8px 24px rgba(255,101,92,0.35)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 10,
                    border: "1px solid rgba(255,255,255,0.18)",
                  }}
                >
                  <span style={{ fontSize: 20 }}>📲</span> Open QR Page
                </a>
              </div>
            </div>

            {/* Right phone (chat) */}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ transform: "rotate(8deg) translateY(10px)" }}>
                <MiniPhone variant="chat" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function PhoneShell({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        width: 280,
        height: 580,
        background: "#000",
        borderRadius: 50,
        padding: 12,
        boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 10,
          left: "50%",
          transform: "translateX(-50%)",
          width: 130,
          height: 32,
          background: "#000",
          borderRadius: "0 0 20px 20px",
          zIndex: 10,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 38,
          overflow: "hidden",
          position: "relative",
          background: "white",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}

function LogoMark({ size = 80 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="14" fill="#ffffff" fillOpacity="0.18" />
      <path
        d="M32 18L20 28V46H28V38H36V46H44V28L32 18Z"
        fill="white"
        stroke="white"
        strokeWidth="1"
      />
      <path
        d="M32 34C30.5 32.5 28 31 28 29C28 27.5 29 27 30 27C31 27 31.5 27.5 32 28C32.5 27.5 33 27 34 27C35 27 36 27.5 36 29C36 31 33.5 32.5 32 34Z"
        fill="#ff655c"
      />
    </svg>
  );
}

function SwipeCard({ swipeOffset }: { swipeOffset: number }) {
  return (
    <div
      style={{
        flex: 1,
        background: "linear-gradient(135deg,#7c3aed,#059669,#d97706)",
        padding: "60px 26px 34px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          fontSize: 20,
          fontWeight: 600,
          color: "white",
          textAlign: "center",
          marginBottom: 18,
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
            width: 220,
            background: "white",
            borderRadius: 22,
            padding: 26,
            boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
            transform: `translateX(${swipeOffset}px) rotate(${swipeOffset / 10}deg)`,
            opacity: swipeOffset > 200 ? 0 : 1,
          }}
        >
          <div
            style={{
              width: "100%",
              height: 130,
              borderRadius: 16,
              background: "linear-gradient(135deg,#667eea,#764ba2)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <h3
            style={{
              fontSize: 18,
              fontWeight: 700,
              margin: "16px 0 6px",
            }}
          >
            Tranquility Behavioral Health
          </h3>
          <p
            style={{
              fontSize: 13,
              color: "#64748b",
              marginBottom: 4,
            }}
          >
            Coral Springs, FL
          </p>
          <p
            style={{
              fontSize: 11,
              color: "#94a3b8",
            }}
          >
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
          gap: 26,
        }}
      >
        <CircleBtn label="✕" variant="skip" />
        <CircleBtn label="✓" variant="match" />
      </div>
    </div>
  );
}

function FiltersPreview() {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          background: "#ff655c",
          padding: "54px 20px 20px",
          color: "white",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>Filters</div>
        <div style={{ fontSize: 12, opacity: 0.85 }}>Find your match</div>
      </div>
      <div
        style={{
          flex: 1,
          padding: 22,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Location
          </div>
          <div
            style={{
              background: "#f2f4f6",
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 13,
              color: "#64748b",
            }}
          >
            📍 Miami, FL • 25 mi
          </div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
            Services
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {["IOP", "Therapy", "Counseling", "PHP"].map((s, i) => (
              <div
                key={s}
                style={{
                  background: i < 2 ? "#ff655c" : "#f2f4f6",
                  color: i < 2 ? "white" : "#64748b",
                  padding: "6px 14px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 500,
                }}
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <button
          style={{
            width: "100%",
            background: "#ff655c",
            color: "white",
            border: "none",
            padding: "12px 20px",
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 14,
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(255,101,92,0.35)",
          }}
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}

function MatchScreen() {
  return (
    <div
      style={{
        flex: 1,
        background: "linear-gradient(135deg,#7c3aed,#059669,#d97706)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        color: "white",
      }}
    >
      <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
      <h3 style={{ fontSize: 34, fontWeight: 700, marginBottom: 10 }}>
        You Matched!
      </h3>
      <p
        style={{
          fontSize: 14,
          opacity: 0.9,
          textAlign: "center",
          lineHeight: 1.5,
          marginBottom: 28,
        }}
      >
        You and Tranquility Behavioral Health
        <br />
        have connected
      </p>
      <button
        style={{
          background: "white",
          color: "#ff655c",
          border: "none",
          fontSize: 16,
          padding: "12px 30px",
          borderRadius: 30,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Start Chat
      </button>
    </div>
  );
}

function ChatPreview() {
  const messages = [
    { side: "left", text: "Hi—appreciate you reaching out." },
    { side: "right", text: "Wed/Thu afternoon works." },
    { side: "left", text: "Great—sending a 15m Zoom invite." },
  ];
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          background: "#ff655c",
          padding: "54px 20px 20px",
          color: "white",
        }}
      >
        <div style={{ fontSize: 18, fontWeight: 700 }}>Tranquility BH</div>
        <div style={{ fontSize: 12, opacity: 0.85 }}>Online</div>
      </div>
      <div
        style={{
          flex: 1,
          padding: 22,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflow: "hidden",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              alignSelf: m.side === "left" ? "flex-start" : "flex-end",
              background: m.side === "left" ? "#f2f4f6" : "#ff655c",
              color: m.side === "left" ? "#111827" : "white",
              padding: "10px 14px",
              borderRadius:
                m.side === "left"
                  ? "18px 18px 18px 6px"
                  : "18px 18px 6px 18px",
              fontSize: 13,
              maxWidth: "70%",
              boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            }}
          >
            {m.text}
          </div>
        ))}
      </div>
      <div style={{ padding: 16, borderTop: "1px solid #e5e7eb" }}>
        <div
          style={{
            background: "#f2f4f6",
            padding: "10px 16px",
            borderRadius: 18,
            fontSize: 13,
            color: "#94a3b8",
          }}
        >
          Type a message…
        </div>
      </div>
    </div>
  );
}

function DesktopMockup({ step, swipeOffset }: { step: number; swipeOffset: number }) {
  return (
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
        {(step === 0 || step === 1) && (
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
                  transform: `translateX(${swipeOffset}px) rotate(${swipeOffset / 10}deg)`,
                  transition: step === 1 ? "none" : "transform 0.3s ease",
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

        {step === 2 && (
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

        {step === 3 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              background: "white",
            }}
          >
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
              <div style={{ padding: "0 16px", marginBottom: "20px" }}>
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
                  Quick intro call?
                </div>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  background: "linear-gradient(135deg, #ff655c, #44bc0c)",
                  padding: "20px 24px",
                  color: "white",
                }}
              >
                <div style={{ fontSize: "16px", fontWeight: 700 }}>
                  Tranquility Behavioral Health
                </div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>Online</div>
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
              >
                <div
                  style={{
                    alignSelf: "flex-start",
                    background: "#f3f4f6",
                    color: "#111827",
                    padding: "10px 14px",
                    borderRadius: "16px 16px 16px 4px",
                    maxWidth: "70%",
                    fontSize: "13px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  Hi—appreciate you reaching out.
                </div>
                <div
                  style={{
                    alignSelf: "flex-end",
                    background: "#ff655c",
                    color: "white",
                    padding: "10px 14px",
                    borderRadius: "16px 16px 4px 16px",
                    maxWidth: "70%",
                    fontSize: "13px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  Yes, this week works.
                </div>
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
      </div>
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
  );
}

function CircleBtn({
  label,
  variant,
}: {
  label: string;
  variant: "skip" | "match";
}) {
  const colors =
    variant === "skip"
      ? { bg: "rgba(255,101,92,0.18)", border: "#ff655c", color: "#ff655c" }
      : { bg: "rgba(68,188,12,0.18)", border: "#44bc0c", color: "#44bc0c" };
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: "50%",
        background: colors.bg,
        border: `3px solid ${colors.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 26,
        color: colors.color,
        fontWeight: 700,
        boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      }}
    >
      {label}
    </div>
  );
}

function MiniPhone({ variant }: { variant: "splash" | "swipe" | "chat" }) {
  const common: React.CSSProperties = {
    width: 160,
    height: 330,
    background: "#000",
    borderRadius: 34,
    padding: 8,
    position: "relative",
  };
  return (
    <div style={common}>
      <div
        style={{
          position: "absolute",
          top: 6,
          left: "50%",
          transform: "translateX(-50%)",
          width: 70,
          height: 18,
          background: "#000",
          borderRadius: "0 0 12px 12px",
          zIndex: 5,
        }}
      />
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 26,
          background: "white",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {variant === "splash" && (
          <div
            style={{
              flex: 1,
              background:
                "linear-gradient(135deg,#ff8a65 0%, #ffb74d 50%, #4db6ac 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            introflo.io
          </div>
        )}
        {variant === "swipe" && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              padding: "20px 14px 14px",
              background:
                "linear-gradient(135deg,#7c3aed,#059669,#d97706)",
              color: "white",
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
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
                  width: 110,
                  background: "white",
                  borderRadius: 16,
                  padding: 14,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
                  transform: "rotate(4deg)",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: 60,
                    borderRadius: 12,
                    background:
                      "linear-gradient(135deg,#667eea,#764ba2)",
                  }}
                />
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  Tranquility BH
                </div>
                <div style={{ fontSize: 9, color: "#64748b" }}>Coral Springs</div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 14,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,101,92,0.25)",
                  border: "2px solid #ff655c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  color: "#ff655c",
                  fontWeight: 700,
                }}
              >
                ✕
              </div>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(68,188,12,0.25)",
                  border: "2px solid #44bc0c",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  color: "#44bc0c",
                  fontWeight: 700,
                }}
              >
                ✓
              </div>
            </div>
          </div>
        )}
        {variant === "chat" && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              background: "white",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg,#ff655c,#ff8a65)",
                padding: "12px 14px 10px",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Tranquility BH • Online
            </div>
            <div
              style={{
                flex: 1,
                padding: 12,
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <div
                style={{
                  alignSelf: "flex-start",
                  background: "#f1f5f9",
                  color: "#0f172a",
                  padding: "6px 10px",
                  borderRadius: "14px 14px 14px 4px",
                  fontSize: 10,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.06)",
                  maxWidth: "80%",
                }}
              >
                Wed/Thu afternoon works.
              </div>
              <div
                style={{
                  alignSelf: "flex-end",
                  background: "#ff655c",
                  color: "white",
                  padding: "6px 10px",
                  borderRadius: "14px 14px 4px 14px",
                  fontSize: 10,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  maxWidth: "80%",
                }}
              >
                Great—sending an invite.
              </div>
            </div>
            <div style={{ padding: "8px 10px", borderTop: "1px solid #e2e8f0" }}>
              <div
                style={{
                  background: "#f1f5f9",
                  borderRadius: 12,
                  padding: "6px 10px",
                  fontSize: 10,
                  color: "#64748b",
                }}
              >
                Type a message…
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
