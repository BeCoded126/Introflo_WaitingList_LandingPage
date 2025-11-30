"use client";

import React, { useState } from "react";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg(null);
    try {
      // Import supabase at interaction time to avoid server-side prerender
      const mod = await import("../../lib/supabaseClient");
      const supabase = mod?.default || mod?.supabase;
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setStatus("sent");
      setMsg("Magic link sent — check your inbox.");
    } catch (err: any) {
      console.error(err);
      setStatus("error");
      setMsg(err.message || "Failed to send magic link");
    }
  }

  return (
    <div
      style={{
        maxWidth: 560,
        margin: "80px auto",
        padding: 24,
        background: "#fff",
        borderRadius: 12,
      }}
    >
      <h2>Sign in to introflo.io</h2>
      <p>Enter your work email and we’ll send a magic link.</p>
      <form onSubmit={handleSubmit}>
        <label style={{ display: "block", marginBottom: 8 }}>Work email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="you@organization.com"
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "1px solid #e6e6e6",
            marginBottom: 12,
          }}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            padding: "10px 16px",
            borderRadius: 8,
            background: "#FF655C",
            color: "#fff",
            border: "none",
          }}
        >
          {status === "loading" ? "Sending…" : "Send magic link"}
        </button>
      </form>
      {msg && <div style={{ marginTop: 12 }}>{msg}</div>}
    </div>
  );
}
