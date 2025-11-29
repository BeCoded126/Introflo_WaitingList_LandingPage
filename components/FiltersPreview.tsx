"use client";

import React from "react";

interface Props {
  activeInsurances?: string[];
  activeAges?: string[];
  activeServices?: string[];
  location?: string;
  distance?: string;
}

export default function FiltersPreview({
  activeInsurances = [],
  activeAges = [],
  activeServices = [],
  location = "",
  distance = "",
}: Props) {
  return (
    <div style={{ width: "100%", boxSizing: "border-box", fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial' }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>Filters</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>Refine results</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>Location</div>
          <input value={location} readOnly style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(2,6,23,0.06)", fontSize: 13 }} />
        </div>
        <div>
          <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>Distance</div>
          <select value={distance} disabled style={{ width: "100%", padding: "8px 10px", borderRadius: 8, border: "1px solid rgba(2,6,23,0.06)", fontSize: 13 }}>
            <option value="">Any distance</option>
            <option value="10">Within 10 miles</option>
            <option value="25">Within 25 miles</option>
            <option value="50">Within 50 miles</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>Insurances Accepted ({activeInsurances.length})</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {['Florida Blue', 'Aetna', 'Cigna', 'Humana'].map((i) => (
            <div key={i} style={{ padding: '6px 8px', background: activeInsurances.includes(i) ? '#0f172a' : '#f8fafc', color: activeInsurances.includes(i) ? '#fff' : '#111827', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{i}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>Ages Treated ({activeAges.length})</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {['Adult (26-64)', 'Young Adult (18-25)'].map((a) => (
            <div key={a} style={{ padding: '6px 8px', background: activeAges.includes(a) ? '#0f172a' : '#f8fafc', color: activeAges.includes(a) ? '#fff' : '#111827', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{a}</div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{ fontSize: 12, color: "#374151", marginBottom: 6 }}>Services Provided ({activeServices.length})</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {['Therapy', 'IOP', 'Med Management'].map((s) => (
            <div key={s} style={{ padding: '6px 8px', background: activeServices.includes(s) ? '#0f172a' : '#f8fafc', color: activeServices.includes(s) ? '#fff' : '#111827', borderRadius: 8, fontSize: 12, fontWeight: 600 }}>{s}</div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
        <div style={{ padding: '8px 12px', borderRadius: 8, background: 'transparent', color: '#6b7280', border: 'none' }}>Clear All</div>
        <div style={{ padding: '8px 12px', borderRadius: 8, background: '#0f172a', color: '#fff' }}>Apply Filters</div>
      </div>
    </div>
  );
}
