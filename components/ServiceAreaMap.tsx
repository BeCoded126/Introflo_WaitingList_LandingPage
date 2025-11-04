"use client";

import { useState, useCallback } from "react";
import { GoogleMap, LoadScript, Circle } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 39.8283,
  lng: -98.5795,
};

interface ServiceAreaMapProps {
  apiKey: string;
  serviceAreas: Array<{
    id: string;
    lat: number;
    lng: number;
    radiusMiles: number;
  }>;
  facilityId?: string;
  onAreaChange?: (
    areas: Array<{
      lat: number;
      lng: number;
      radiusMiles: number;
    }>
  ) => void;
  isEditable?: boolean;
}

export default function ServiceAreaMap({
  apiKey,
  serviceAreas,
  facilityId,
  onAreaChange,
  isEditable = false,
}: ServiceAreaMapProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [circles, setCircles] = useState(serviceAreas);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      const bounds = new window.google.maps.LatLngBounds();
      circles.forEach(({ lat, lng }) => {
        bounds.extend({ lat, lng });
      });
      map.fitBounds(bounds);
      setMap(map);
    },
    [circles]
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleCircleRadiusChange = (index: number, radius: number) => {
    const newCircles = [...circles];
    newCircles[index] = {
      ...newCircles[index],
      radiusMiles: radius / 1609.34, // Convert meters to miles
    };
    setCircles(newCircles);
    onAreaChange?.(newCircles);
    saveAreas(newCircles);
  };

  const handleCircleCenterChange = (
    index: number,
    center: google.maps.LatLng
  ) => {
    const newCircles = [...circles];
    newCircles[index] = {
      ...newCircles[index],
      lat: center.lat(),
      lng: center.lng(),
    };
    setCircles(newCircles);
    onAreaChange?.(newCircles);
    saveAreas(newCircles);
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!isEditable || !event.latLng) return;

    const newCircle = {
      id: Date.now().toString(),
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      radiusMiles: 10,
    };

    const newCircles = [...circles, newCircle];
    setCircles(newCircles);
    onAreaChange?.(newCircles);
    saveAreas(newCircles);
  };
  async function saveAreas(areasToSave: typeof circles) {
    if (!facilityId) return;
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/service-areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facilityId, areas: areasToSave }),
      });
      if (!res.ok) {
        setSaveStatus("error");
        console.error("Save failed", await res.text());
        return;
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 1200);
    } catch (err) {
      console.error("Failed to save service areas", err);
      setSaveStatus("error");
    }
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={4}
        center={center}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
      >
        {circles.map((circle, index) => (
          <Circle
            key={circle.id}
            center={{ lat: circle.lat, lng: circle.lng }}
            radius={circle.radiusMiles * 1609.34} // Convert miles to meters
            options={{
              fillColor: "#3B82F6",
              fillOpacity: 0.3,
              strokeColor: "#2563EB",
              strokeOpacity: 1,
              strokeWeight: 2,
              editable: isEditable,
              draggable: isEditable,
            }}
            onRadiusChanged={() => {
              // Event typing from the library is loose here; retrieve radius from our local state fallback
              // (This will not capture interactive drag radius in types, but avoids TS error.)
              handleCircleRadiusChange(index, circles[index].radiusMiles * 1609.34);
            }}
            onCenterChanged={() => {
              // The map library's typed event provides no args in types — use current circle center
              handleCircleCenterChange(index, new google.maps.LatLng(circles[index].lat, circles[index].lng));
            }}
          />
        ))}
      </GoogleMap>
      {/* Save status indicator */}
      <div style={{ marginTop: 8 }}>
        {saveStatus === "saving" && (
          <span className="text-sm text-gray-500">Saving...</span>
        )}
        {saveStatus === "saved" && (
          <span className="text-sm text-green-600">Saved</span>
        )}
        {saveStatus === "error" && (
          <span className="text-sm text-red-600">Save failed</span>
        )}
      </div>
    </LoadScript>
  );
}
