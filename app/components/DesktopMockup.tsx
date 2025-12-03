"use client";

import React, { useEffect, useState } from "react";
import FiltersPreview from "@/components/FiltersPreview";
import Card, { Facility } from "@/components/Card";

export default function DesktopMockup({
  isActive = true,
}: {
  isActive?: boolean;
}) {
  const [stepIndex, setStepIndex] = useState(0);

  // Animation steps (stepIndex):
  // 0 = idle (panel closed)
  // 1 = panel opens (short)
  // 2 = panel open while full card visible (short showcase)
  // 3 = user selects first filter (insurance)
  // 4 = dashboard updates for first filter
  // 5 = user selects second filter (service)
  // 6 = user selects Ages Treated pill (NEW - every loop)
  // 7 = dashboard long showcase after selections
  // 8 = panel closes (final)

  // delays for steps 1..8 (ms). We split the original long showcase into two
  // segments so we can show an explicit Ages Treated selection step while
  // preserving the overall timing of the animation loop.
  const delays = [100, 700, 200, 500, 200, 200, 7800, 700];

  useEffect(() => {
    let timers: number[] = [];

    if (!isActive) {
      setStepIndex(0);
      return () => timers.forEach((id) => clearTimeout(id));
    }

    const runSequence = () => {
      let t = 0;
      for (let i = 1; i <= 8; i++) {
        t += delays[i - 1];
        timers.push(
          window.setTimeout(() => {
            setStepIndex(i);
          }, t)
        );
      }

      // return to idle briefly
      timers.push(
        window.setTimeout(() => {
          setStepIndex(0);
        }, t + 500)
      );

      // schedule next loop
      timers.push(
        window.setTimeout(() => {
          runSequence();
        }, t + 600)
      );
    };

    // reset and start
    setStepIndex(0);
    runSequence();

    return () => timers.forEach((id) => clearTimeout(id));
  }, [isActive]);

  const showPanel = stepIndex >= 1 && stepIndex <= 8;
  const pulse = stepIndex === 1;

  // persist the typed/selected location so it remains shown once filled
  const [chosenLocation, setChosenLocation] = useState("");

  useEffect(() => {
    if (stepIndex >= 2 && !chosenLocation) {
      setChosenLocation("Tampa, FL");
    }
  }, [stepIndex, chosenLocation]);

  const activeInsurances = stepIndex >= 3 ? ["Florida Blue"] : [];
  const activeServices = stepIndex >= 5 ? ["Therapy"] : [];
  const activeAges = stepIndex >= 6 ? ["Young Adult (18-25)"] : [];

  const dashboardScale = 0.7; // scale applied to whole dashboard area
  const panelWidth = 420; // narrower panel so cards remain visible behind it
  const filtersButtonBaseScale = 0.9;

  // monitor sizing - match the footprint of the two iPhone mockups container
  const monitorWidth = 590;
  const monitorHeight = 580;

  const bezelColor = "#0f172a";
  const innerScreenPadding = 20;

  const baseFacility: Facility = {
    id: "1",
    name: "Tranquility Behavioral",
    city: "Coral Springs",
    state: "FL",
    services: ["Therapy", "IOP"],
    ageGroups: ["Adult (26-64)"],
    image: "/images/interior-1.jpg",
    insurances: ["Aetna", "Cigna", "Blue Cross Blue Shield"],
    bio: "Tranquility Behavioral is a multidisciplinary outpatient practice offering psychiatric evaluations, medication management, and evidence-based therapy. Our team focuses on personalized care, fast access to appointments, and collaborative treatment planning.",
  };

  const facilityAfterFirst: Facility = {
    ...baseFacility,
    insurances: ["Florida Blue"],
  };

  const facilityAfterSecond: Facility = {
    ...facilityAfterFirst,
    services: ["Therapy"],
    image: "/images/interior-2.jpg",
  };

  const currentFacility =
    stepIndex >= 5
      ? facilityAfterSecond
      : stepIndex >= 3
      ? facilityAfterFirst
      : baseFacility;

  const reducedHeight = Math.round(monitorHeight * 0.7);
  const scale = reducedHeight / monitorHeight;

  const neckHeight = Math.max(6, Math.round(12 * scale));
  const baseHeight = Math.max(8, Math.round(18 * scale));
  const neckMarginTop = Math.max(6, Math.round(14 * scale));

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          width: "100%",
          maxWidth: monitorWidth,
          maxHeight: monitorHeight,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Monitor bezel (fixed width, reduced height) */}
        <div
          className="max-w-full max-h-full object-contain"
          style={{
            width: "100%",
            height: reducedHeight,
            maxHeight: "100%",
            background: bezelColor,
            borderRadius: 16,
            padding: innerScreenPadding,
            boxSizing: "border-box",
            boxShadow: "0 20px 50px rgba(2,6,23,0.18)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Screen area (content must be fully inside this box) */}
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#ffffff",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                  width: `${100 / scale}%`,
                  pointerEvents: "none",
                }}
              >
                <div
                  style={{
                    height: 64,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 20px",
                    borderBottom: "1px solid rgba(16,24,40,0.06)",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontWeight: 800,
                      fontSize: 20,
                      color: "#0f172a",
                      pointerEvents: "none",
                    }}
                  >
                    introflo.io
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      right: innerScreenPadding,
                      top: 0,
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{ position: "relative", pointerEvents: "auto" }}
                    >
                      <div
                        style={{
                          transformOrigin: "center",
                          transition: "transform 160ms ease",
                          transform: `scale(${
                            pulse
                              ? filtersButtonBaseScale * 0.96
                              : filtersButtonBaseScale
                          })`,
                        }}
                      >
                        <div
                          style={{
                            background: "#0f172a",
                            color: "#fff",
                            padding: "10px 16px",
                            borderRadius: 12,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden
                          >
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 5a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm2 5a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          </svg>
                          Filters
                          <span
                            style={{
                              marginLeft: 6,
                              background: "#ef4444",
                              color: "#fff",
                              fontSize: 12,
                              padding: "4px 8px",
                              borderRadius: 999,
                            }}
                          >
                            3
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    padding: 18,
                    height: `calc(100% - 64px)`,
                    boxSizing: "border-box",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <div style={{ width: "100%", height: "100%" }}>
                    <div
                      style={{
                        transform: `scale(${dashboardScale})`,
                        transformOrigin: "top left",
                        width: `${100 / dashboardScale}%`,
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: 18,
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          background: "linear-gradient(180deg,#fff,#fbfbfd)",
                          borderRadius: 10,
                          padding: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 12,
                          width: "100%",
                        }}
                      >
                        <div
                          style={{ pointerEvents: "auto", overflow: "visible" }}
                        >
                          <Card facility={currentFacility} />
                        </div>

                        <div style={{ height: 10 }} />
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(3,1fr)",
                            gap: 8,
                          }}
                        >
                          <div
                            style={{
                              height: 44,
                              background: "#fff",
                              borderRadius: 8,
                            }}
                          />
                          <div
                            style={{
                              height: 44,
                              background: "#fff",
                              borderRadius: 8,
                            }}
                          />
                          <div
                            style={{
                              height: 44,
                              background: "#fff",
                              borderRadius: 8,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {showPanel && (
                    <div
                      style={{
                        position: "absolute",
                        top: 28,
                        right: 12,
                        width: panelWidth,
                        maxWidth: "48%",
                        background: "#fff",
                        padding: 14,
                        borderRadius: 12,
                        boxShadow: "0 8px 30px rgba(2,6,23,0.12)",
                        pointerEvents: "auto",
                        opacity: 1,
                        transition: "opacity 200ms ease, transform 200ms ease",
                        transform:
                          stepIndex === 1
                            ? "translateY(-6px)"
                            : "translateY(0)",
                      }}
                    >
                      <FiltersPreview
                        location={chosenLocation}
                        distance={stepIndex >= 3 ? "25" : ""}
                        activeInsurances={activeInsurances}
                        activeAges={activeAges}
                        activeServices={activeServices}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: neckMarginTop,
            width: 160,
            height: neckHeight,
            background: "#0f172a",
            borderRadius: 8,
            boxShadow: "0 8px 20px rgba(2,6,23,0.12)",
          }}
        />
        <div
          style={{
            marginTop: Math.max(4, Math.round(8 * scale)),
            width: 340,
            height: baseHeight,
            background: "#0b1220",
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(2,6,23,0.12)",
            transform: "translateY(4px)",
          }}
        />
      </div>
    </div>
  );
}
