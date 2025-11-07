"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function QRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [networkUrl, setNetworkUrl] = useState("");

  useEffect(() => {
    // Get the network URL (your local IP)
    const url = "http://192.168.0.60:3000/auth/signin";
    setNetworkUrl(url);

    // Generate QR code
    QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
    })
      .then((url) => {
        setQrCodeUrl(url);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <div className="qr-page">
      <div className="qr-container">
        {/* Header */}
        <div className="qr-header">
          <div className="qr-logo">
            <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
              <rect width="48" height="48" rx="12" fill="url(#logo-gradient)" />
              <path
                d="M24 14L18 20H22V28H26V20H30L24 14Z"
                fill="white"
                opacity="0.9"
              />
              <path
                d="M16 30C16 28.9 16.9 28 18 28H30C31.1 28 32 28.9 32 30V32C32 33.1 31.1 34 30 34H18C16.9 34 16 33.1 16 32V30Z"
                fill="white"
                opacity="0.9"
              />
              <defs>
                <linearGradient
                  id="logo-gradient"
                  x1="0"
                  y1="0"
                  x2="48"
                  y2="48"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#ff655c" />
                  <stop offset="1" stopColor="#44bc0c" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="qr-title">introflo.io</h1>
          <p className="qr-subtitle">Scan to view mobile demo</p>
        </div>

        {/* QR Code */}
        {qrCodeUrl && (
          <div className="qr-code-wrapper">
            <div className="qr-code-frame">
              <img src={qrCodeUrl} alt="QR Code" className="qr-code-image" />
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="qr-instructions">
          <div className="instruction-step">
            <div className="step-number">1</div>
            <div className="step-text">
              <strong>Open your phone camera</strong>
              <span>Point it at the QR code above</span>
            </div>
          </div>
          <div className="instruction-step">
            <div className="step-number">2</div>
            <div className="step-text">
              <strong>Tap the notification</strong>
              <span>Your phone will detect the link automatically</span>
            </div>
          </div>
          <div className="instruction-step">
            <div className="step-number">3</div>
            <div className="step-text">
              <strong>Explore the mobile demo</strong>
              <span>Swipe through facilities, try filters, view profile</span>
            </div>
          </div>
        </div>

        {/* Network Info */}
        <div className="network-info">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z" />
          </svg>
          <span>
            Make sure your phone is on the same WiFi network
          </span>
        </div>

        {/* Alternative Link */}
        <div className="alternative-link">
          <p>Or type this URL manually:</p>
          <div className="url-box">
            <code>{networkUrl}</code>
            <button
              className="copy-btn"
              onClick={() => {
                navigator.clipboard.writeText(networkUrl);
                alert("Copied to clipboard!");
              }}
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .qr-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff5f3 0%, #f0fdf4 100%);
          padding: 40px 20px;
        }

        .qr-container {
          width: 100%;
          max-width: 600px;
          background: white;
          border-radius: 24px;
          padding: 48px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .qr-header {
          margin-bottom: 40px;
        }

        .qr-logo {
          display: inline-block;
          margin-bottom: 20px;
        }

        .qr-title {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #ff655c, #44bc0c);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .qr-subtitle {
          font-size: 18px;
          color: #6b7280;
          font-weight: 500;
        }

        .qr-code-wrapper {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
        }

        .qr-code-frame {
          padding: 24px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
          border: 3px solid #f3f4f6;
        }

        .qr-code-image {
          display: block;
          width: 400px;
          height: 400px;
        }

        .qr-instructions {
          text-align: left;
          margin-bottom: 32px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .instruction-step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }

        .step-number {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #ff655c, #44bc0c);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          flex-shrink: 0;
        }

        .step-text {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .step-text strong {
          font-size: 16px;
          color: #111827;
          font-weight: 600;
        }

        .step-text span {
          font-size: 14px;
          color: #6b7280;
        }

        .network-info {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 16px 20px;
          background: linear-gradient(135deg, #fff5f3, #f0fdf4);
          border-radius: 12px;
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
          border: 1px solid rgba(255, 101, 92, 0.1);
        }

        .network-info svg {
          flex-shrink: 0;
          color: #ff655c;
        }

        .alternative-link {
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .alternative-link p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 12px;
        }

        .url-box {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
        }

        .url-box code {
          flex: 1;
          font-size: 13px;
          color: #374151;
          font-family: monospace;
          text-align: left;
        }

        .copy-btn {
          padding: 6px 16px;
          background: linear-gradient(135deg, #ff655c, #44bc0c);
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .copy-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 101, 92, 0.3);
        }

        @media (max-width: 768px) {
          .qr-container {
            padding: 32px 24px;
          }

          .qr-title {
            font-size: 28px;
          }

          .qr-subtitle {
            font-size: 16px;
          }

          .qr-code-frame {
            padding: 16px;
          }

          .qr-code-image {
            width: 280px;
            height: 280px;
          }

          .instruction-step {
            gap: 12px;
          }

          .step-number {
            width: 28px;
            height: 28px;
            font-size: 14px;
          }

          .step-text strong {
            font-size: 14px;
          }

          .step-text span {
            font-size: 13px;
          }

          .url-box code {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
}
