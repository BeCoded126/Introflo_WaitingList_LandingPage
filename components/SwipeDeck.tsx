"use client";

import React, { useState, useEffect, useRef } from "react";
import Card, { Facility } from "./Card";
import styles from "../styles/SwipeDeck.module.css";

type Props = {
  items?: Facility[];
  facilities?: Facility[];
  onMatch?: (f: Facility) => void;
  onSkip?: (f: Facility) => void;
};

export default function SwipeDeck({
  items = [],
  facilities = [],
  onMatch,
  onSkip,
}: Props) {
  const [stack, setStack] = useState<Facility[]>([]);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [touchOffset, setTouchOffset] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  // Initialize stack only on client
  useEffect(() => {
    setStack(facilities.length > 0 ? facilities : items);
  }, [items, facilities]);

  function handleMatch() {
    const [top, ...rest] = stack;
    if (top && !isAnimating) {
      setIsAnimating(true);
      setSwipeDirection("right");
      setTimeout(() => {
        onMatch?.(top);
        setStack(rest);
        setSwipeDirection(null);
        setIsAnimating(false);
      }, 400);
    }
  }

  function handleSkip() {
    const [top, ...rest] = stack;
    if (top && !isAnimating) {
      setIsAnimating(true);
      setSwipeDirection("left");
      setTimeout(() => {
        onSkip?.(top);
        setStack(rest);
        setSwipeDirection(null);
        setIsAnimating(false);
      }, 400);
    }
  }

  // Touch handlers for swipe gestures
  function handleTouchStart(e: React.TouchEvent) {
    if (isAnimating) return;
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (!touchStart || isAnimating) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStart.x;
    const deltaY = touch.clientY - touchStart.y;
    setTouchOffset({ x: deltaX, y: deltaY });
  }

  function handleTouchEnd() {
    if (!touchStart || isAnimating) return;

    const swipeThreshold = 100; // pixels

    if (Math.abs(touchOffset.x) > swipeThreshold) {
      if (touchOffset.x > 0) {
        // Swiped right - match
        handleMatch();
      } else {
        // Swiped left - skip
        handleSkip();
      }
    }

    // Reset touch state
    setTouchStart(null);
    setTouchOffset({ x: 0, y: 0 });
  }

  function handleTouchCancel() {
    setTouchStart(null);
    setTouchOffset({ x: 0, y: 0 });
  }

  const top = stack[0];

  // Calculate transform style for dragging
  const cardTransform =
    touchStart && !isAnimating
      ? `translate(${touchOffset.x}px, ${touchOffset.y}px) rotate(${
          touchOffset.x * 0.1
        }deg)`
      : "";

  // Calculate opacity for visual feedback
  const cardOpacity =
    touchStart && !isAnimating
      ? Math.max(0.5, 1 - Math.abs(touchOffset.x) / 300)
      : 1;

  return (
    <div className={styles["swipe-deck"]}>
      {top ? (
        <div className={styles.stack}>
          <div
            ref={cardRef}
            className={`${styles["top-card"]} ${
              swipeDirection === "left" ? styles["swipe-left"] : ""
            } ${swipeDirection === "right" ? styles["swipe-right"] : ""}`}
            style={{
              transform: cardTransform,
              opacity: cardOpacity,
              transition: touchStart ? "none" : "all 0.4s ease-out",
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          >
            <Card facility={top} />
          </div>
          <div className={styles.controls}>
            <button
              className={`${styles.btn} ${styles.skip}`}
              onClick={handleSkip}
              aria-label="Skip match"
              title="Skip"
              disabled={isAnimating}
            >
              ✕
            </button>
            <button
              className={`${styles.btn} ${styles.match}`}
              onClick={handleMatch}
              aria-label="Confirm match"
              title="Match"
              disabled={isAnimating}
            >
              ✓
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.empty}>
          No more matches — try widening your filters.
        </div>
      )}
    </div>
  );
}
