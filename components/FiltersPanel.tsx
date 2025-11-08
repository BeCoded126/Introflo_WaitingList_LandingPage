"use client";

import React, { useState } from "react";

export interface FilterOptions {
  location?: string;
  distance?: number;
  insurances?: string[];
  ageGroups?: string[];
  services?: string[];
}

interface FiltersPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose: () => void;
}

const FL_INSURANCES = [
  "Aetna",
  "BlueCross BlueShield of Florida",
  "Cigna",
  "Florida Blue",
  "Humana",
  "Medicare",
  "Medicaid",
  "UnitedHealthcare",
  "Sunshine Health",
  "Molina Healthcare",
  "WellCare",
  "Simply Healthcare",
  "Oscar Health",
  "Ambetter",
];

const AGE_GROUPS = [
  "Children (0-12)",
  "Adolescent (13-17)",
  "Young Adult (18-25)",
  "Adult (26-64)",
  "Senior (65+)",
];

const SERVICES = [
  "Therapy",
  "IOP",
  "PHP",
  "Detox",
  "Med Management",
  "TMS",
  "ECT",
  "Counseling",
  "Coaching",
];

export default function FiltersPanel({
  filters,
  onFiltersChange,
  onClose,
}: FiltersPanelProps) {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleLocationChange = (location: string) => {
    setLocalFilters({ ...localFilters, location });
  };

  const handleDistanceChange = (distance: string) => {
    setLocalFilters({
      ...localFilters,
      distance: parseInt(distance) || undefined,
    });
  };

  const toggleInsurance = (insurance: string) => {
    const current = localFilters.insurances || [];
    const updated = current.includes(insurance)
      ? current.filter((i) => i !== insurance)
      : [...current, insurance];
    setLocalFilters({ ...localFilters, insurances: updated });
  };

  const toggleAgeGroup = (ageGroup: string) => {
    const current = localFilters.ageGroups || [];
    const updated = current.includes(ageGroup)
      ? current.filter((a) => a !== ageGroup)
      : [...current, ageGroup];
    setLocalFilters({ ...localFilters, ageGroups: updated });
  };

  const toggleService = (service: string) => {
    const current = localFilters.services || [];
    const updated = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service];
    setLocalFilters({ ...localFilters, services: updated });
  };

  const handleApply = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleClear = () => {
    const clearedFilters: FilterOptions = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="filters-overlay" onClick={onClose}>
      <div className="filters-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="filters-header">
          <h2>Filters</h2>
          <button className="close-filters-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Filters Content */}
        <div className="filters-content">
          {/* Location */}
          <div className="filter-section">
            <label className="filter-label">Location</label>
            <input
              type="text"
              className="filter-input"
              placeholder="City or ZIP code"
              value={localFilters.location || ""}
              onChange={(e) => handleLocationChange(e.target.value)}
            />
          </div>

          {/* Distance */}
          <div className="filter-section">
            <label className="filter-label">Distance</label>
            <select
              className="filter-input"
              value={localFilters.distance || ""}
              onChange={(e) => handleDistanceChange(e.target.value)}
            >
              <option value="">Any distance</option>
              <option value="10">Within 10 miles</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
              <option value="100">Within 100 miles</option>
              <option value="200">Within 200 miles</option>
            </select>
          </div>

          {/* Insurances */}
          <div className="filter-section">
            <label className="filter-label">
              Insurances Accepted ({localFilters.insurances?.length || 0})
            </label>
            <div className="filter-options">
              {FL_INSURANCES.map((insurance) => (
                <button
                  key={insurance}
                  className={`filter-option ${
                    localFilters.insurances?.includes(insurance) ? "active" : ""
                  }`}
                  onClick={() => toggleInsurance(insurance)}
                >
                  {insurance}
                </button>
              ))}
            </div>
          </div>

          {/* Age Groups */}
          <div className="filter-section">
            <label className="filter-label">
              Ages Treated ({localFilters.ageGroups?.length || 0})
            </label>
            <div className="filter-options">
              {AGE_GROUPS.map((ageGroup) => (
                <button
                  key={ageGroup}
                  className={`filter-option ${
                    localFilters.ageGroups?.includes(ageGroup) ? "active" : ""
                  }`}
                  onClick={() => toggleAgeGroup(ageGroup)}
                >
                  {ageGroup}
                </button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="filter-section">
            <label className="filter-label">
              Services Provided ({localFilters.services?.length || 0})
            </label>
            <div className="filter-options">
              {SERVICES.map((service) => (
                <button
                  key={service}
                  className={`filter-option ${
                    localFilters.services?.includes(service) ? "active" : ""
                  }`}
                  onClick={() => toggleService(service)}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="filters-footer">
          <button className="clear-filters-btn" onClick={handleClear}>
            Clear All
          </button>
          <button className="apply-filters-btn" onClick={handleApply}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
