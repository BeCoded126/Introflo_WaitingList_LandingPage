"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@introflo.io");
  const [password, setPassword] = useState("demo123");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate a brief loading state for presentation
    setTimeout(() => {
      // Redirect to dashboard page
      router.push("/app/dashboard");
    }, 800);
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        {/* Logo and Branding */}
        <div className="signin-brand">
          <div className="signin-logo">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
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
          <h1 className="signin-title">introflo.io</h1>
          <p className="signin-subtitle">Smart intros for care teams</p>
        </div>

        {/* Sign In Form */}
        <form className="signin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-footer">
            <label className="remember-me">
              <input type="checkbox" defaultChecked />
              <span>Remember me</span>
            </label>
            <a href="#" className="forgot-password">
              Forgot password?
            </a>
          </div>

          <button type="submit" className="signin-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Demo Notice */}
        <div className="demo-notice">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z" />
          </svg>
          <span>
            Demo credentials are pre-filled. Click <strong>Sign In</strong> to
            continue.
          </span>
        </div>

        {/* Divider */}
        <div className="signin-divider">
          <span>or continue with</span>
        </div>

        {/* Social Sign In */}
        <div className="social-buttons">
          <button type="button" className="social-button">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
              />
            </svg>
            Google
          </button>
          <button type="button" className="social-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            GitHub
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="signup-link">
          Don't have an account?{" "}
          <a href="/auth/signup">Sign up for free</a>
        </div>
      </div>

      <style jsx>{`
        .signin-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #fff5f3 0%, #f0fdf4 100%);
          padding: 24px;
        }

        .signin-container {
          width: 100%;
          max-width: 440px;
          background: white;
          border-radius: 20px;
          padding: 48px 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
        }

        .signin-brand {
          text-align: center;
          margin-bottom: 40px;
        }

        .signin-logo {
          display: inline-block;
          margin-bottom: 16px;
        }

        .signin-title {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #ff655c, #44bc0c);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 8px;
        }

        .signin-subtitle {
          color: #6b7280;
          font-size: 15px;
        }

        .signin-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          transition: all 0.2s;
          background: #f9fafb;
        }

        .form-input:focus {
          outline: none;
          border-color: #ff655c;
          background: white;
          box-shadow: 0 0 0 3px rgba(255, 101, 92, 0.1);
        }

        .form-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .remember-me {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          color: #6b7280;
        }

        .remember-me input {
          cursor: pointer;
        }

        .forgot-password {
          color: #ff655c;
          text-decoration: none;
          font-weight: 600;
        }

        .forgot-password:hover {
          color: #e5554b;
          text-decoration: underline;
        }

        .signin-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #ff655c, #44bc0c);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .signin-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 101, 92, 0.3);
        }

        .signin-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .demo-notice {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: linear-gradient(135deg, #fff5f3, #f0fdf4);
          border-radius: 10px;
          font-size: 13px;
          color: #6b7280;
          margin-top: 16px;
          border: 1px solid rgba(255, 101, 92, 0.1);
        }

        .demo-notice svg {
          flex-shrink: 0;
          color: #ff655c;
        }

        .demo-notice strong {
          color: #111827;
        }

        .signin-divider {
          position: relative;
          text-align: center;
          margin: 32px 0;
        }

        .signin-divider::before {
          content: "";
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }

        .signin-divider span {
          position: relative;
          background: white;
          padding: 0 16px;
          color: #9ca3af;
          font-size: 14px;
        }

        .social-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 24px;
        }

        .social-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .social-button:hover {
          border-color: #ff655c;
          background: #fff5f3;
        }

        .signup-link {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
        }

        .signup-link a {
          color: #ff655c;
          font-weight: 600;
          text-decoration: none;
        }

        .signup-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
