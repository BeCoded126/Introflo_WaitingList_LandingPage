// Callback route disabled — moved to `app/auth_disabled/callback`.
export const dynamic = "force-dynamic";

export default function DisabledAuthCallback() {
  return (
    <div style={{ padding: 48, maxWidth: 720, margin: "64px auto" }}>
      <h2>Auth callback disabled</h2>
      <p>
        The auth callback has been disabled in this environment. The previous
        callback handler exists under <code>/auth_disabled/callback</code>.
      </p>
    </div>
  );
}
