"use client";

import React from "react";

export type Facility = {
  id: string;
  name: string;
  city?: string;
  state?: string;
  services?: string[];
  ageGroups?: string[];
  phone?: string;
  verified?: boolean;
  image?: string;
  images?: string[];
  insurances?: string[];
  bio?: string;
};

export default function Card({ facility }: { facility: Facility }) {
  // Use first image from profile images if available, otherwise fall back to single image
  const displayImage = facility.images?.[0] || facility.image;

  return (
    <div className="card horizontal">
      <div className="card-media">
        {displayImage ? (
          <img src={displayImage} alt={facility.name} loading="lazy" />
        ) : (
          <div className="card-media-placeholder" aria-hidden>
            No image
          </div>
        )}
      </div>

      <div className="card-content">
        <div className="card-header">
          <div className="card-title">{facility.name}</div>
          {facility.verified && <div className="badge">Verified</div>}
        </div>
        <div className="card-body">
          <div className="meta">
            {facility.city}, {facility.state}
          </div>
          {facility.bio && <div className="bio">{facility.bio}</div>}
          <div className="services">
            {facility.services?.slice(0, 4).join(" • ")}
          </div>
          {facility.insurances && facility.insurances.length > 0 && (
            <div className="insurances">
              <strong>Insurance:</strong>{" "}
              {facility.insurances.slice(0, 3).join(", ")}
              {facility.insurances.length > 3 &&
                ` +${facility.insurances.length - 3} more`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
