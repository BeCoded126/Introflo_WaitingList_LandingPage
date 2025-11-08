"use client";

import React, { useEffect, useRef, useState } from "react";
import SwipeDeck from "../../components/SwipeDeck";
import ChatPane from "../../components/ChatPane";
import FilterPanel from "../../components/FilterPanel";
import type { Facility } from "../../components/Card";

// Add dashboard styles to globals.css
import "./dashboard.css";

const sample: Facility[] = [
  {
    id: "f1",
    name: "The SD Mindset, Coaching and Counseling",
    city: "Coral Springs",
    state: "FL",
    services: ["Therapy", "Counseling", "Coaching", "Adolescent (5-22)"],
    verified: true,
    image: "/images/image.png",
  },
  {
    id: "f2",
    name: "Tranduitiy Behavioral Health",
    city: "Dallas",
    state: "TX",
    services: ["IOP", "Detox"],
  },
  {
    id: "f3",
    name: "CareBridge Clinic",
    city: "Houston",
    state: "TX",
    services: ["PHP", "Med Management"],
  },
];

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [matchCount, setMatchCount] = useState(0);
  const [showMatchScreen, setShowMatchScreen] = useState(false);
  const [currentChat, setCurrentChat] = useState<string | null>(null);
  const [currentFacilityIdx, setCurrentFacilityIdx] = useState(0);
  const [deckKey, setDeckKey] = useState(0); // force SwipeDeck reset
  const [pendingMatch, setPendingMatch] = useState<string | null>(null); // store facility name for match screen

  useEffect(() => {
    setMounted(true);
  }, []);

  function onMatch(f: Facility) {
    setMatchCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setPendingMatch(f.name);
        setShowMatchScreen(true);
        return 0; // reset count
      }
      return next;
    });
    // In a real app we'd call API to create match and open chat
  }

  function onSkip(f: Facility) {
    // Optionally handle skip logic
  }

  // Only render dynamic content after client-side hydration
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
      {/* DEBUG: Render state info for troubleshooting */}
      <pre style={{background:'#f8f8f8',color:'#c00',padding:8,borderRadius:8,marginBottom:12,fontSize:14}}>
        {JSON.stringify({mounted, matchCount, showMatchScreen, currentChat, currentFacilityIdx, deckKey, pendingMatch}, null, 2)}
      </pre>
      <aside className="sidebar">
        <FilterPanel
          onFilterChange={(filters) => {
            console.log("Filter changed:", filters);
            // TODO: Fetch filtered facilities
          }}
        />
      </aside>

      <div className="content-area">
        <div className="match-area">
          <h2>Discover matches</h2>
          {showMatchScreen ? (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#7c3aed,#059669,#d97706)",
              color: "white",
              borderRadius: 24,
              padding: 48,
              minHeight: 320,
              boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
              marginBottom: 24,
            }}>
              <div style={{ fontSize: 54, marginBottom: 16 }}>🎉</div>
              <h3 style={{ fontSize: 32, fontWeight: 700, marginBottom: 10 }}>
                You matched with <span style={{ color: "#ffe082" }}>{pendingMatch}</span>!
              </h3>
              <div style={{ fontSize: 16, opacity: 0.92, marginBottom: 24 }}>
                A new chat has been started.
              </div>
              <button
                style={{
                  background: "white",
                  color: "#ff655c",
                  border: "none",
                  fontSize: 18,
                  fontWeight: 700,
                  borderRadius: 24,
                  padding: "14px 36px",
                  marginTop: 12,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                }}
                onClick={() => {
                  setShowMatchScreen(false);
                  setCurrentChat(pendingMatch);
                  setCurrentFacilityIdx((idx) => (idx + 1) % sample.length);
                  setDeckKey((k) => k + 1);
                  setPendingMatch(null);
                }}
              >Continue</button>
            </div>
          ) : (
            <SwipeDeck
              key={deckKey}
              items={[
                sample[(currentFacilityIdx) % sample.length],
                sample[(currentFacilityIdx + 1) % sample.length],
                sample[(currentFacilityIdx + 2) % sample.length],
              ]}
              onMatch={onMatch}
              onSkip={onSkip}
            />
          )}
        </div>

        <div className="chat-area">
          <h3>Live chat</h3>
          {currentChat ? (
            <ChatPane partnerName={currentChat} />
          ) : (
            <div style={{ color: "#888", fontSize: 16, marginTop: 32 }}>
              No active chat yet. Match with a facility to start chatting!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
