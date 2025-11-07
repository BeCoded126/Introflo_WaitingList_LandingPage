import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Dashboard from "../app/dashboard/page";
import SwipeDeck from "../components/SwipeDeck";
import Card from "../components/Card";
import type { Facility } from "../components/Card";

describe("UI Smoke Tests", () => {
  it("renders dashboard without crashing", () => {
    const { container } = render(<Dashboard />);
    expect(container).toBeTruthy();
  });

  it("displays facility card with all key elements", () => {
    const mockFacility: Facility = {
      id: "test-1",
      name: "Test Facility",
      city: "Austin",
      state: "TX",
      services: ["Therapy", "Counseling"],
      verified: true,
      image: "/images/test.png",
    };

    render(<Card facility={mockFacility} />);
    
    expect(screen.getByText("Test Facility")).toBeInTheDocument();
    expect(screen.getByText("Austin, TX")).toBeInTheDocument();
    expect(screen.getByText(/Therapy • Counseling/)).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });

  it("renders swipe deck controls", () => {
    const mockFacilities: Facility[] = [
      {
        id: "f1",
        name: "Facility One",
        city: "Dallas",
        state: "TX",
        services: ["IOP"],
      },
    ];

    const mockMatch = vi.fn();
    const mockSkip = vi.fn();

    render(
      <SwipeDeck items={mockFacilities} onMatch={mockMatch} onSkip={mockSkip} />
    );

    expect(screen.getByText("Nope")).toBeInTheDocument();
    expect(screen.getByText("Match")).toBeInTheDocument();
  });

  it("shows empty state when no matches", () => {
    render(<SwipeDeck items={[]} />);
    expect(
      screen.getByText(/No more matches — try widening your filters/i)
    ).toBeInTheDocument();
  });
});
