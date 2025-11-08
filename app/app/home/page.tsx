"use client";

import React from "react";
import Link from "next/link";
import "./home.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-hero">
          <h1 className="home-title">Welcome to IntroFlo</h1>
          <p className="home-subtitle">
            Your hub for smart referral matching and facility connections
          </p>
        </div>

        <div className="home-grid">
          <Link href="/app/dashboard" className="home-card">
            <div className="card-icon">🎯</div>
            <h3 className="card-title">Discover Matches</h3>
            <p className="card-description">
              Swipe through facilities that match your criteria and start new
              connections
            </p>
          </Link>

          <Link href="/app/matches" className="home-card">
            <div className="card-icon">💬</div>
            <h3 className="card-title">Active Matches</h3>
            <p className="card-description">
              View and manage your current facility matches and conversations
            </p>
          </Link>

          <Link href="/app/referrals" className="home-card">
            <div className="card-icon">📋</div>
            <h3 className="card-title">Referrals</h3>
            <p className="card-description">
              Track all your referrals and their status in one place
            </p>
          </Link>

          <Link href="/app/service-areas" className="home-card">
            <div className="card-icon">📍</div>
            <h3 className="card-title">Service Areas</h3>
            <p className="card-description">
              Manage your service areas and coverage regions
            </p>
          </Link>

          <Link href="/app/profile" className="home-card">
            <div className="card-icon">⚙️</div>
            <h3 className="card-title">Profile Settings</h3>
            <p className="card-description">
              Update your profile, preferences, and account settings
            </p>
          </Link>

          <Link href="/app/subscription" className="home-card">
            <div className="card-icon">💳</div>
            <h3 className="card-title">Subscription</h3>
            <p className="card-description">
              View your plan details and manage your subscription
            </p>
          </Link>
        </div>

        <div className="home-stats">
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Active Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">Total Referrals</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">0</div>
            <div className="stat-label">This Month</div>
          </div>
        </div>
      </div>
    </div>
  );
}
