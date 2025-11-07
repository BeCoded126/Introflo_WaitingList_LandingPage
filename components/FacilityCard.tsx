"use client";

import { useState } from "react";
import type { Facility } from "@/types";

interface FacilityCardProps {
  facility: Facility;
  onConnect?: () => void;
}

export default function FacilityCard({
  facility,
  onConnect,
}: FacilityCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const logo =
    facility.logoUrl ||
    (facility as any).logo_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      facility.name || "Business"
    )}&background=random`;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      {/* Logo / Placeholder */}
      <div className="w-full h-40 bg-gray-100 flex items-center justify-center overflow-hidden">
        {/* Using a plain img to avoid Next/Image config needs */}
        <img
          src={logo}
          alt={facility.name}
          className="h-full w-full object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            target.onerror = null;
            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              facility.name || "Business"
            )}&background=random`;
          }}
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900">{facility.name}</h3>

        <p className="mt-2 text-gray-500 line-clamp-2">
          {facility.description || "No description available"}
        </p>

        <div className="mt-4">
          <div className="text-sm text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline-block mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {facility.address}
          </div>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Status</h4>
              <p className="mt-1 text-sm text-gray-500 capitalize">
                {facility.status}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900">
                Last Updated
              </h4>
              <p className="mt-1 text-sm text-gray-500">
                {new Date(facility.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {isExpanded ? "Show less" : "Show more"}
        </button>

        {onConnect && (
          <button
            onClick={onConnect}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  );
}
