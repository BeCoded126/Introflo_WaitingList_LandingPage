import React from "react";
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #fff5f3 0%, #f0fdf4 100%)",
      }}
    >
      {/* Hero Section */}
      <section
        style={{
          padding: "120px 24px 80px",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "60px",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "56px",
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: "24px",
                background: "linear-gradient(135deg, #ff655c, #44bc0c)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Smart Intros for Care Teams
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "#6b7280",
                lineHeight: 1.6,
                marginBottom: "32px",
              }}
            >
              Connect with the right mental health facilities through
              intelligent matching. Swipe, match, and build your referral
              network effortlessly.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              <Link
                href="/auth/signup"
                style={{
                  padding: "14px 32px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  background: "linear-gradient(135deg, #ff655c, #44bc0c)",
                  color: "white",
                  border: "none",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Get Started
              </Link>
              <Link
                href="/dashboard"
                style={{
                  padding: "14px 32px",
                  fontSize: "16px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  background: "white",
                  color: "#ff655c",
                  border: "2px solid #ff655c",
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                View Demo
              </Link>
            </div>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "20px",
              padding: "40px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                background: "white",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 24px rgba(16, 24, 40, 0.12)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "200px",
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                }}
              >
                [Facility Photo]
              </div>
              <div style={{ padding: "20px" }}>
                <div
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "8px",
                  }}
                >
                  The SD Mindset
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Coral Springs, FL
                </div>
                <div style={{ fontSize: "12px", color: "#6b7280" }}>
                  Therapy • IOP • Counseling
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
                icon: "🔒",
                title: "HIPAA Compliant",
                desc: "Fully encrypted and secure communications",
              },
              {
                icon: "📍",
                title: "Location-Based",
                desc: "Find facilities in your service area",
              },
              {
                icon: "✅",
                title: "Verified Facilities",
                desc: "All facilities verified and credentialed",
              },
              {
                icon: "📊",
                title: "Track Referrals",
                desc: "Monitor pipeline with built-in analytics",
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

      {/* CTA */}
      <section
        style={{
          padding: "100px 24px",
          background: "linear-gradient(135deg, #ff655c, #44bc0c)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2
            style={{ fontSize: "48px", fontWeight: 800, marginBottom: "24px" }}
          >
            Ready to Transform Your Referral Network?
          </h2>
          <p style={{ fontSize: "20px", marginBottom: "40px", opacity: 0.95 }}>
            Join hundreds of mental health facilities already using introflo.io
          </p>
          <Link
            href="/auth/signup"
            style={{
              background: "white",
              color: "#ff655c",
              border: "none",
              padding: "16px 40px",
              fontSize: "18px",
              fontWeight: 600,
              borderRadius: "10px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
