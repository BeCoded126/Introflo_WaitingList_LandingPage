"use client";

import React, { useEffect } from "react";
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
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function onMatch(f: Facility) {
    console.log("matched", f);
    // In a real app we'd call API to create match and open chat
  }

  function onSkip(f: Facility) {
    console.log("skipped", f);
  }

  // Only render dynamic content after client-side hydration
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-layout">
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
          <SwipeDeck items={sample} onMatch={onMatch} onSkip={onSkip} />
        </div>

        <div className="chat-area">
          <h3>Live chat</h3>
          <ChatPane partnerName="Harmony Therapy" />
        </div>
      </div>
    </div>
  );
}
